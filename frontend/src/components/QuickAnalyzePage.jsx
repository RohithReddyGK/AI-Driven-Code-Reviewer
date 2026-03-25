import React, { useState } from "react";
import Navbar from "./Navbar";
import { ChevronDown, Zap, AlertTriangle, Copy, CheckCircle, RotateCcw, X } from "lucide-react";
import AIChatBubble from "./AIChatBubble";

const languages = [
  { name: "JavaScript", value: "javascript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python", value: "python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Java", value: "java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "C++", value: "cpp", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "C", value: "c", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { name: "Go", value: "go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" },
];

/* ── Quick result card ── */
const ResultSection = ({ title, items, color }) => (
  <div className={`rounded-xl border p-4 ${color}`}>
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex gap-2">
          <span className="mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const parseQuickResult = (review, suggestions) => ({ review, suggestions });

const detectLanguage = (code) => {
  const c = code.trim();
  if (/public\s+class\s+\w+|import\s+java\.|System\.out\.print|@Override/.test(c)) return "java";
  if (/#include\s*<|using namespace std|cout\s*<<|cin\s*>>/.test(c)) return "cpp";
  if (/#include\s*<stdio|printf\s*\(|scanf\s*\(/.test(c) && !/cout/.test(c)) return "c";
  if (/^\s*def\s+\w+|^\s*import\s+\w+|^\s*from\s+\w+\s+import|print\s*\(/m.test(c) && !/{/.test(c.split("\n")[0])) return "python";
  if (/package main|func main\(\)|fmt\.Println/.test(c)) return "go";
  if (/\bfunction\s+\w+|\bconst\s+\w+|\blet\s+\w+|\bvar\s+\w+|=>|console\.log/.test(c)) return "javascript";
  return null;
};

const LanguageMismatchBanner = ({ selectedLang, detectedLang, onDismiss }) => (
  <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30
                  border border-amber-200 dark:border-amber-700 rounded-xl mb-5">
    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-700 dark:text-amber-300 flex-1 leading-snug">
      <span className="font-semibold">Language mismatch detected:</span> Selected{" "}
      <span className="font-mono font-bold">{selectedLang}</span> but code looks like{" "}
      <span className="font-mono font-bold">{detectedLang}</span>. AI will explain and suggest a conversion.
    </p>
    <button onClick={onDismiss} className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

const QuickAnalyzePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  const [langMismatch, setLangMismatch] = useState(null);
  const [showMismatchBanner, setShowMismatchBanner] = useState(false);

  const currentLang = languages.find((l) => l.value === language);

  const handleAnalyze = async () => {
    if (!code.trim()) { setError("Paste some code first."); return; }
    setLoading(true); setResult(null); setError("");
    setLangMismatch(null); setShowMismatchBanner(false);

    const detected = detectLanguage(code);
    const mismatchNote =
      detected && detected !== language
        ? `⚠️ IMPORTANT: The user has selected "${language}" as the language, but the code appears to be written in "${detected}". You must: 1) Clearly flag this language mismatch at the top of your review. 2) Explain what language the code actually is and why it won't work as "${language}". 3) Show how to convert this code to valid "${language}" in the optimized/suggestions section.`
        : "";

    if (detected && detected !== language) {
      const selectedName = languages.find((l) => l.value === language)?.name || language;
      const detectedName = languages.find((l) => l.value === detected)?.name || detected;
      setLangMismatch({ selected: selectedName, detected: detectedName });
      setShowMismatchBanner(true);
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, mode: "quick", mismatch_note: mismatchNote }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.error) { setError(data.error); return; }
      setResult(parseQuickResult(data.review, data.suggestions || []));
    } catch {
      setError("Backend unreachable. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setCode(""); setResult(null); setError("");
    setLangMismatch(null); setShowMismatchBanner(false);
  };

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100
                        dark:bg-gray-950 transition-all">

          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* ── max-width container, responsive padding ── */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

            {/* PAGE TITLE */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-blue-500" />
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                  Quick Analyze
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Paste your code, pick a language, and get an instant AI review — no editor needed.
              </p>
            </div>

            {/* INPUT CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md
                            border border-slate-200 dark:border-slate-700 overflow-hidden mb-5">

              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-3
                              border-b border-slate-100 dark:border-slate-800 gap-2 flex-wrap">

                {/* Language picker */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border
                               bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700
                               hover:border-blue-400 transition-colors text-sm"
                  >
                    <img src={currentLang.icon} className="w-4 h-4" alt={currentLang.name} />
                    <span className="text-slate-700 dark:text-slate-200">{currentLang.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform
                                             ${openDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {openDropdown && (
                    <div className="absolute mt-1 w-40 rounded-xl shadow-xl border z-50
                                    bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
                      {languages.map((lang) => (
                        <button key={lang.value}
                          onClick={() => { setLanguage(lang.value); setOpenDropdown(false); }}
                          className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-sm transition-colors
                            hover:bg-blue-50 dark:hover:bg-slate-700
                            ${language === lang.value ? "bg-blue-50 dark:bg-slate-700" : ""}`}
                        >
                          <img src={lang.icon} className="w-4 h-4" alt={lang.name} />
                          <span className="text-slate-700 dark:text-slate-200">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {result && (
                    <button onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg
                                 border border-slate-200 dark:border-slate-700
                                 text-slate-500 dark:text-slate-400
                                 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}
                  <button onClick={handleAnalyze} disabled={loading}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-blue-600
                               hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg
                               text-sm font-medium shadow-sm transition-all active:scale-[0.98]">
                    <Zap className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>{loading ? "Analyzing…" : "Analyze"}</span>
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Paste your ${currentLang.name} code here…`}
                className="w-full min-h-[180px] sm:min-h-[220px] p-4 sm:p-5 font-mono text-sm
                           text-slate-700 dark:text-slate-200 resize-y bg-transparent outline-none
                           placeholder-slate-300 dark:placeholder-slate-600 leading-relaxed"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              />
            </div>

            {/* MISMATCH BANNER */}
            {showMismatchBanner && langMismatch && (
              <LanguageMismatchBanner
                selectedLang={langMismatch.selected}
                detectedLang={langMismatch.detected}
                onDismiss={() => setShowMismatchBanner(false)}
              />
            )}

            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl
                              bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                              text-red-600 dark:text-red-400 text-sm mb-5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* LOADING SKELETON */}
            {loading && (
              <div className="space-y-3 animate-pulse mb-5">
                <div className="h-28 rounded-2xl bg-white dark:bg-slate-800
                                border border-slate-200 dark:border-slate-700" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="h-24 rounded-2xl bg-white dark:bg-slate-800
                                  border border-slate-200 dark:border-slate-700" />
                  <div className="h-24 rounded-2xl bg-white dark:bg-slate-800
                                  border border-slate-200 dark:border-slate-700" />
                </div>
              </div>
            )}

            {/* RESULTS */}
            {result && !loading && (
              <div className="space-y-4">

                {/* Review summary */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl
                                border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">📋</span>
                    <h2 className="font-semibold text-slate-800 dark:text-white text-sm">
                      Review Summary
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.review}
                  </p>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 px-1">
                      💡 {result.suggestions.length} Suggestion{result.suggestions.length > 1 ? "s" : ""}
                    </h2>
                    <div className="space-y-3">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl
                                                border border-slate-200 dark:border-slate-700
                                                shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-4 sm:px-5 py-3
                                          border-b border-slate-100 dark:border-slate-800 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900
                                               flex items-center justify-center text-xs font-bold
                                               text-blue-600 dark:text-blue-400">
                                {i + 1}
                              </span>
                              {/* truncate long titles on mobile */}
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200
                                               truncate">
                                {s.title}
                              </span>
                            </div>
                            <button onClick={() => handleCopy(s.code, i)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg flex-shrink-0
                                         bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                                         hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                              {copied === i
                                ? <CheckCircle className="w-3 h-3 text-green-500" />
                                : <Copy className="w-3 h-3" />}
                              {copied === i ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          {/* horizontal scroll for code on small screens */}
                          <pre className="p-4 sm:p-5 text-xs font-mono text-emerald-400
                                          bg-[#0d1117] overflow-x-auto leading-relaxed whitespace-pre">
                            {s.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* FLOATING AI CHAT BUBBLE */}
      <AIChatBubble
        currentCode={code}
        previousCode=""
        language={language}
        darkMode={darkMode}
      />
    </>
  );
};

export default QuickAnalyzePage;
