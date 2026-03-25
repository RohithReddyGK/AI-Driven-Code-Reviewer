from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os
import json
import re


load_dotenv()


app = Flask(__name__)
CORS(app)


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in .env file")


client = Groq(api_key=GROQ_API_KEY)



# ================= HELPER =================
def prepare_code_for_ai(code: str, max_chars: int = 12000):
    if len(code) <= max_chars:
        return code
    head = code[:6000]
    tail = code[-6000:]
    return f"""
[Code truncated for analysis]
--- START ---
{head}
--- SKIPPED MIDDLE ---
--- END ---
{tail}
"""



# ================= ROUTES =================


@app.route("/")
def home():
    return "Groq Backend Running 🚀"



@app.route("/analyze", methods=["POST"])
def analyze_code():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        code          = data.get("code", "").strip()
        language      = data.get("language", "code")
        mismatch_note = data.get("mismatch_note", "").strip()

        if not code:
            return jsonify({"error": "Code is empty"}), 400

        processed_code = prepare_code_for_ai(code)

        # Build mismatch warning block to inject into prompt
        mismatch_block = ""
        if mismatch_note:
            mismatch_block = f"""
⚠️ LANGUAGE MISMATCH INSTRUCTION (HIGHEST PRIORITY):
{mismatch_note}

You MUST address this mismatch clearly in the "review" field first, before anything else.
The "optimized_code" and "suggestions" MUST include a corrected version written in {language}.
"""

        prompt = f"""
You are a world-class senior software engineer and algorithm expert.

Analyze the following {language} code thoroughly and return ONLY valid JSON. No markdown, no explanation outside the JSON.

{mismatch_block}

FORMAT (return exactly this structure):
{{
  "review": "Overall engaging review with emojis 🚀⚠️💡 — mention key issues, code quality, and patterns used",
  "current_complexity": {{
    "time": "e.g. O(n log n)",
    "space": "e.g. O(n)",
    "time_explanation": "Brief reason why — e.g. recursive splitting halves the array each time",
    "space_explanation": "Brief reason why — e.g. auxiliary arrays created at each merge step"
  }},
  "optimized_complexity": {{
    "time": "e.g. O(n log n)",
    "space": "e.g. O(1)",
    "time_explanation": "How/why this version is better or same",
    "space_explanation": "How/why this version is better or same"
  }},
  "optimized_code": "The single most efficient version of the full code, as a string with \\n for newlines",
  "optimized_title": "Short name for the optimized version e.g. 'In-place Merge Sort'",
  "suggestions": [
    {{
      "title": "Short improvement title",
      "issue": "What's wrong or could be better",
      "code": "Fixed/improved code snippet"
    }}
  ],
  "chart_data": {{
    "labels": ["Current", "Optimized"],
    "time_values": [numeric score 1-10 for time efficiency, higher=better],
    "space_values": [numeric score 1-10 for space efficiency, higher=better]
  }}
}}

RULES:
- suggestions: give 2-4 specific, meaningful improvements
- optimized_code must be COMPLETE and runnable
- chart_data values must be integers 1-10
- Do NOT wrap response in ```json
- Escape all quotes and newlines inside string values properly

Code to analyze:
{processed_code}
"""

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=2500,
            top_p=0.9,
        )

        raw = completion.choices[0].message.content.strip()  # ← FIXED: added 
        print("🔍 RAW RESPONSE:\n", raw[:500])

        # Clean markdown fences if present
        if raw.startswith("```"):
            raw = re.sub(r"^```(?:json)?", "", raw).strip()
            raw = re.sub(r"```$", "", raw).strip()

        match = re.search(r"\{[\s\S]*\}", raw)
        if not match:
            raise ValueError("No valid JSON found in AI response")

        parsed = json.loads(match.group(0))
        return jsonify(parsed)

    except json.JSONDecodeError as e:
        print("❌ JSON PARSE ERROR:", repr(e))
        print("RAW:", raw[:300])
        return jsonify({"error": "AI returned malformed JSON. Try again."}), 500
    except Exception as e:
        print("❌ ERROR:", repr(e))
        return jsonify({"error": "Analysis failed. Try again."}), 500



# ================= CHAT ROUTE =================


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        message          = data.get("message", "").strip()
        history          = data.get("history", [])
        current_code     = data.get("currentCode", "")
        previous_code    = data.get("previousCode", "")
        language         = data.get("language", "code")
        analysis_history = data.get("analysisHistory", [])

        if not message:
            return jsonify({"error": "Message is empty"}), 400

        # Build analysis context summary
        analysis_context = ""
        if analysis_history:
            last = analysis_history[-1]
            analysis_context = f"""
Last analysis result:
- Time complexity: {last.get('current_complexity', {}).get('time', 'N/A')}
- Space complexity: {last.get('current_complexity', {}).get('space', 'N/A')}
- Optimized version: {last.get('optimized_title', 'N/A')}
  (Time: {last.get('optimized_complexity', {}).get('time', 'N/A')}, Space: {last.get('optimized_complexity', {}).get('space', 'N/A')})
- Issues found: {len(last.get('suggestions', []))} suggestions
"""

        # Build system prompt safely
        system_prompt = f"""You are an expert code assistant embedded in an AI-Driven Code Reviewer tool.

Current {language} code the user is working on:
```{language}
{current_code or "(empty)"}
```"""

        if previous_code and previous_code != current_code:
            system_prompt += f"""
Previous version of the code:
```{language}
{previous_code}
```"""

        system_prompt += f"""
{analysis_context}

Answer concisely and helpfully. Reference line numbers when relevant.
Use inline backticks for code. For code examples use triple backticks with language.
Be direct and practical."""

        messages = [{"role": "system", "content": system_prompt}]
        for turn in history:
            role    = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": message})

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.4,
            max_tokens=800,
            top_p=0.9,
        )

        reply = completion.choices[0].message.content.strip()
        print(f"💬 CHAT REPLY: {reply[:100]}...")
        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ CHAT ERROR:", repr(e))
        return jsonify({"error": "Chat failed. Try again."}), 500
