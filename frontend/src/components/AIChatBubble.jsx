import React, { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, Maximize2, Sparkles, Copy, CheckCircle } from "lucide-react";
import BASE_URL from "../config";

/* ─────────────────────────────────────────────
   PARSE AI REPLY → mixed text + code blocks
───────────────────────────────────────────── */
const parseReply = (text) => {
  const parts = [];
  const re = /```(\w+)?\n?([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ type: "text", content: text.slice(last, m.index) });
    }
    parts.push({ type: "code", lang: m[1] || "", content: m[2].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
};


/* ─────────────────────────────────────────────
   INLINE TEXT  (bold + `backtick`)
───────────────────────────────────────────── */
const InlineText = ({ text, dark }) =>
  text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={i} className={`px-1 py-0.5 rounded font-mono text-[11px]
          ${dark ? "bg-slate-700 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
          {p.slice(1, -1)}
        </code>
      );
    return <span key={i}>{p}</span>;
  });


/* ─────────────────────────────────────────────
   CODE BLOCK  (dark terminal, copy button)
───────────────────────────────────────────── */
const CodeBlock = ({ lang, content }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 my-2 text-left">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800">
        <span className="text-[10px] text-slate-400 font-mono">{lang || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded
                     bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
        >
          {copied
            ? <><CheckCircle className="w-3 h-3 text-green-400" /> Copied!</>
            : <><Copy className="w-3 h-3" /> Copy</>
          }
        </button>
      </div>
      <pre className="p-3 text-[11px] font-mono text-emerald-400 bg-[#0d1117] overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
};


/* ─────────────────────────────────────────────
   MESSAGE BUBBLE  (renders parsed parts)
───────────────────────────────────────────── */
const MessageBubble = ({ msg, dark }) => {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] px-3 py-2 rounded-2xl rounded-tr-sm text-xs leading-relaxed
                        bg-blue-600 text-white">
          {msg.text}
        </div>
      </div>
    );
  }

  const parts = parseReply(msg.text);

  return (
    <div className="flex justify-start gap-2">
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5 border border-white/20 shadow-sm">
        <img src="/AI_Agent.png" alt="AI" className="w-full h-full object-cover" />
      </div>
      <div className="max-w-[84%]">
        {parts.map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} lang={part.lang} content={part.content} />
          ) : (
            <div key={i} className={`text-xs leading-relaxed px-3 py-2 rounded-2xl rounded-tl-sm
              ${dark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
              {part.content.split("\n").map((line, j) => (
                <p key={j} className={line.trim() ? "mb-0.5" : "h-2"}>
                  <InlineText text={line} dark={dark} />
                </p>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const AIChatBubble = ({ currentCode = "", previousCode = "", language = "code", darkMode = false, analysisHistory = [] }) => {
  const [open, setOpen] = useState(false);
  const [minimized, setMin] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! 👋 I can see your code. Ask me anything — 'what's wrong?', 'explain line 5', 'compare with my previous version', etc.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open) setPulse(false); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);
  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, minimized]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.text }));
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, currentCode, previousCode, language, analysisHistory }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages((m) => [...m, {
        role: "assistant",
        text: err.message === "Server error"
          ? "⚠️ Backend unreachable. Is Flask running on port 5000?"
          : `⚠️ ${err.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <style>{`
        @keyframes bubblePop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { transform: translateY(16px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0px); }
          30%      { transform: translateY(-8px); }
          60%      { transform: translateY(-3px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 12px 3px rgba(99,102,241,0.55), 0 0 28px 6px rgba(59,130,246,0.35); }
          50%      { box-shadow: 0 0 22px 7px rgba(99,102,241,0.8), 0 0 48px 14px rgba(59,130,246,0.5); }
        }
        .bubble-pop  { animation: bubblePop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .chat-slide  { animation: chatSlideUp 0.25s ease-out forwards; }
        .ripple-ring { animation: ripple 1.6s ease-out infinite; }
        .btn-bounce  { animation: gentleBounce 2.2s ease-in-out infinite; }
        .btn-glow    { animation: glowPulse 2.2s ease-in-out infinite; }
      `}</style>

      {/* ── FLOATING BUTTON ── */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 btn-bounce">
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-full
                       bg-gradient-to-br from-blue-500 to-indigo-600
                       flex items-center justify-center bubble-pop overflow-hidden
                       hover:scale-110 active:scale-95 transition-transform border-2 border-white/30
                       btn-glow"
            title="Ask AI about your code"
          >
            {pulse && <span className="absolute inset-0 rounded-full bg-blue-400 ripple-ring" />}
            <img
              src="/AI_Agent.png"
              alt="AI"
              className="w-10 h-10 rounded-full object-cover relative z-10"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <Sparkles className="w-6 h-6 text-white hidden" />
          </button>
        </div>
      )}

      {/* ── CHAT PANEL ── */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 chat-slide flex flex-col rounded-2xl shadow-2xl overflow-hidden
                        ${minimized ? "w-72 h-12" : "w-[340px] h-[520px]"}
                        transition-all duration-200
                        ${darkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"}`}>

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
              <img src="/AI_Agent.png" alt="AI" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-none">Code AI</p>
              <p className="text-blue-200 text-[10px] mt-0.5 truncate">
                {currentCode ? `Watching your ${language} code` : "No code loaded"}
              </p>
            </div>
            <button onClick={() => setMin(!minimized)} className="text-white/70 hover:text-white transition-colors">
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} dark={darkMode} />
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                      <img src="/AI_Agent.png" alt="AI" className="w-full h-full object-cover" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompt chips — only on first load */}
              {messages.length === 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {["What's wrong?", "Explain the code", "Compare versions", "How to optimize?"].map((q) => (
                    <button key={q}
                      onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors
                        ${darkMode
                          ? "border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400"
                          : "border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                        }`}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div className={`flex items-end gap-2 px-3 py-2.5 border-t flex-shrink-0
                              ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-100 bg-white"}`}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about your code…"
                  rows={1}
                  className={`flex-1 resize-none rounded-xl px-3 py-2 text-xs outline-none border transition-colors
                    ${darkMode
                      ? "bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-500 focus:border-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-400"
                    }`}
                  style={{ maxHeight: "72px" }}
                />
                <button onClick={send} disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40
                             flex items-center justify-center flex-shrink-0 transition-colors">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatBubble;
