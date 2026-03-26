import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Editor from "@monaco-editor/react";
import {
  ChevronDown, Copy, Wand2, CheckCircle, AlertTriangle,
  Lightbulb, Zap, Pencil, Download, Clock, Database,
  TrendingUp, History, X
} from "lucide-react";
import AIChatBubble from "./AIChatBubble";
import BASE_URL from "../config";

/* ═══════════════════════════════════════════
   TINY HELPERS
═══════════════════════════════════════════ */
const RenderLine = ({ line }) => {
  if (!line.trim()) return <div className="h-2" />;
  const isHeading = /^(#{1,3} |[🚀⚠️💡✅❌🔍🛠️🎯🧠⚡🔥])/.test(line.trim());
  const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  const rendered = parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={i} className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-xs">{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
  if (isHeading) return <p className="font-semibold text-slate-800 dark:text-slate-100 mt-3 mb-1 text-sm">{rendered}</p>;
  return <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{rendered}</p>;
};

const parseOutput = (text) => {
  const sections = [];
  const re = /💡\s*(.+?)\n```(?:\w+)?\n([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) sections.push({ type: "text", content: text.slice(last, m.index).trim() });
    sections.push({ type: "code", title: m[1].trim(), code: m[2].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) sections.push({ type: "text", content: text.slice(last).trim() });
  return sections;
};

/* ─── Editable filename ─── */
const EditableFilename = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  return (
    <div className="flex items-center gap-1 group">
      {editing ? (
        <input ref={inputRef} value={value} onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)} onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-transparent border-b border-blue-400 outline-none w-36 pb-0.5" />
      ) : (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{value}</span>
      )}
      <button onClick={() => setEditing(true)} title="Rename"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 ml-0.5">
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
};

/* ─── Complexity Row ─── */
const ComplexityRow = ({ current, optimized }) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Current Code</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">{current.time}</span>
        </div>
        <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-snug">{current.time_explanation}</p>
        <div className="flex items-center gap-2 mt-1">
          <Database className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">{current.space}</span>
        </div>
        <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-snug">{current.space_explanation}</p>
      </div>
    </div>
    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
      <p className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Optimized</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
          <span className="font-mono text-sm font-bold text-green-700 dark:text-green-300">{optimized.time}</span>
        </div>
        <p className="text-[10px] text-green-600 dark:text-green-400 leading-snug">{optimized.time_explanation}</p>
        <div className="flex items-center gap-2 mt-1">
          <Database className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
          <span className="font-mono text-sm font-bold text-green-700 dark:text-green-300">{optimized.space}</span>
        </div>
        <p className="text-[10px] text-green-600 dark:text-green-400 leading-snug">{optimized.space_explanation}</p>
      </div>
    </div>
  </div>
);

/* ─── SVG Line Chart ─── */
const ComplexityChart = ({ chartData }) => {
  if (!chartData) return null;
  const { labels, time_values, space_values } = chartData;
  const W = 300, H = 100, padL = 24, padR = 16, padT = 16, padB = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = 10;
  const xPos = (i) => padL + (i / (labels.length - 1)) * innerW;
  const yPos = (v) => padT + innerH - (v / maxVal) * innerH;
  const toPath = (values) => values.map((v, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yPos(v)}`).join(" ");
  const toArea = (values) =>
    `${toPath(values)} L ${xPos(values.length - 1)} ${padT + innerH} L ${xPos(0)} ${padT + innerH} Z`;
  const colors = {
    time: { stroke: "#f59e0b", fill: "rgba(245,158,11,0.12)", dot: "#f59e0b", label: "#d97706" },
    space: { stroke: "#34d399", fill: "rgba(52,211,153,0.12)", dot: "#34d399", label: "#059669" },
  };
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Efficiency Comparison</span>
        <div className="flex gap-3 ml-auto">
          {[["Time", colors.time.dot], ["Space", colors.space.dot]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {[0, 5, 10].map((v) => (
          <g key={v}>
            <line x1={padL} y1={yPos(v)} x2={padL + innerW} y2={yPos(v)} stroke="#e5e7eb" strokeWidth={0.8} strokeDasharray="3 3" />
            <text x={padL - 4} y={yPos(v) + 3} textAnchor="end" fontSize={7} fill="#9ca3af">{v}</text>
          </g>
        ))}
        <path d={toArea(time_values)} fill={colors.time.fill} />
        <path d={toArea(space_values)} fill={colors.space.fill} />
        <path d={toPath(time_values)} fill="none" stroke={colors.time.stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={toPath(space_values)} fill="none" stroke={colors.space.stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {labels.map((label, i) => (
          <g key={i}>
            <circle cx={xPos(i)} cy={yPos(time_values[i])} r={3.5} fill={colors.time.dot} stroke="white" strokeWidth={1.5} />
            <text x={xPos(i)} y={yPos(time_values[i]) - 7} textAnchor="middle" fontSize={8} fill={colors.time.label} fontWeight="600">{time_values[i]}</text>
            <circle cx={xPos(i)} cy={yPos(space_values[i])} r={3.5} fill={colors.space.dot} stroke="white" strokeWidth={1.5} />
            <text x={xPos(i)} y={yPos(space_values[i]) - 7} textAnchor="middle" fontSize={8} fill={colors.space.label} fontWeight="600">{space_values[i]}</text>
            <text x={xPos(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">{label}</text>
          </g>
        ))}
        <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke="#e5e7eb" strokeWidth={1} />
      </svg>
      <p className="text-[10px] text-slate-400 text-center mt-1">Score out of 10 — higher is more efficient</p>
    </div>
  );
};

/* ─── Suggestion Card ─── */
const SuggestionCard = ({ title, issue, code, index, onApply, onCopy, copied }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{title}</p>
        {issue && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">{issue}</p>}
      </div>
      {/* Stack buttons vertically on very small screens */}
      <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
        <button onClick={onCopy}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700
                     text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button onClick={onApply}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors font-medium">
          <Wand2 className="w-3 h-3" /> Apply
        </button>
      </div>
    </div>
    <pre className="p-4 text-xs font-mono text-emerald-400 bg-[#0d1117] overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
  </div>
);

/* ─── Optimized Code Card ─── */
const OptimizedCodeCard = ({ title, code, onApply, onCopy, copied }) => (
  <div className="rounded-xl border-2 border-green-400 dark:border-green-600 overflow-hidden shadow-md">
    <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700 flex-wrap gap-y-2">
      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
      <span className="text-sm font-semibold text-green-700 dark:text-green-300 flex-1 min-w-0 truncate">{title || "Optimized Version"}</span>
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={onCopy}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white dark:bg-slate-800
                     text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 transition-colors">
          {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button onClick={onApply}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors font-medium">
          <Wand2 className="w-3 h-3" /> Use This
        </button>
      </div>
    </div>
    <pre className="p-4 text-xs font-mono text-emerald-400 bg-[#0d1117] overflow-x-auto leading-relaxed whitespace-pre max-h-64">{code}</pre>
  </div>
);

/* ─── Review Text Block ─── */
const ReviewText = ({ content }) => (
  <div className="space-y-0.5 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
    {content.split("\n").map((line, i) => <RenderLine key={i} line={line} />)}
  </div>
);

/* ─── Language Mismatch Banner ─── */
const LanguageMismatchBanner = ({ selectedLang, detectedLang, onDismiss }) => (
  <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-700">
    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-700 dark:text-amber-300 flex-1 leading-snug">
      <span className="font-semibold">Language mismatch:</span> Editor set to{" "}
      <span className="font-mono font-bold">{selectedLang}</span> but code looks like{" "}
      <span className="font-mono font-bold">{detectedLang}</span>.
    </p>
    <button onClick={onDismiss} className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

/* ─── History Sidebar ─── */
const HistorySidebar = ({ history, onSelect, onClose, darkMode }) => (
  <div className={`fixed top-[64px] md:top-[72px] right-0 h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] w-full sm:w-72 z-40 shadow-2xl flex flex-col
    ${darkMode ? "bg-slate-900 border-l border-slate-700" : "bg-white border-l border-slate-200"}`}>
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-blue-500" />
        <span className="font-semibold text-sm text-slate-800 dark:text-white">Analysis History</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {history.length === 0 ? (
        <div className="text-center text-slate-400 text-xs mt-8">
          <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No analyses yet
        </div>
      ) : (
        history.slice().reverse().map((item, i) => (
          <button key={i} onClick={() => { onSelect(item); onClose(); }}
            className={`w-full text-left p-3 rounded-xl border transition-all hover:border-blue-400
              ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200 hover:bg-blue-50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                {item.language}
              </span>
              <span className="text-[10px] text-slate-400">{item.timestamp}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-mono leading-snug">
              {item.codePreview}
            </p>
            <div className="flex gap-2 mt-1.5">
              <span className="text-[10px] text-amber-600 dark:text-amber-400">⏱ {item.time}</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">💾 {item.space}</span>
            </div>
          </button>
        ))
      )}
    </div>
  </div>
);

/* ─── PDF Export ─── */
const exportToPDF = (analysisData, code, language) => {
  const { review, current_complexity, optimized_complexity, optimized_title, optimized_code, suggestions } = analysisData;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Code Analysis Report</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1e293b;padding:40px;line-height:1.6}
  h1{font-size:24px;color:#2563eb;margin-bottom:4px}.meta{font-size:12px;color:#64748b;margin-bottom:28px}
  h2{font-size:16px;color:#1e40af;margin:24px 0 10px;border-bottom:2px solid #dbeafe;padding-bottom:4px}
  p{font-size:13px;color:#475569;margin-bottom:8px}.complexity-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0}
  .box{padding:14px;border-radius:10px;border:1px solid}.box-amber{background:#fffbeb;border-color:#fcd34d}
  .box-green{background:#f0fdf4;border-color:#86efac}.box-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
  .amber-label{color:#d97706}.green-label{color:#16a34a}.metric{display:flex;align-items:center;gap:8px;margin:4px 0}
  .badge{font-family:monospace;font-size:14px;font-weight:700}.amber-badge{color:#b45309}.green-badge{color:#15803d}
  .explain{font-size:11px;color:#94a3b8;margin-left:4px;margin-bottom:6px}
  pre{background:#0d1117;color:#34d399;font-family:'Courier New',monospace;font-size:11px;padding:14px;border-radius:8px;overflow-x:auto;white-space:pre-wrap;margin:8px 0}
  .suggestion{border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin:10px 0}
  .suggestion-title{font-size:13px;font-weight:600;color:#1e40af;margin-bottom:4px}
  .suggestion-issue{font-size:11px;color:#94a3b8;margin-bottom:8px}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8}</style>
  </head><body>
  <h1>🔍 AI Code Analysis Report</h1>
  <p class="meta">Language: ${language.toUpperCase()} | Generated: ${new Date().toLocaleString()}</p>
  <h2>📋 Review Summary</h2><p>${review}</p>
  <h2>⚡ Complexity Analysis</h2>
  <div class="complexity-grid">
    <div class="box box-amber"><div class="box-label amber-label">Current Code</div>
    <div class="metric">⏱ <span class="badge amber-badge">${current_complexity?.time || "N/A"}</span></div>
    <div class="explain">${current_complexity?.time_explanation || ""}</div>
    <div class="metric">💾 <span class="badge amber-badge">${current_complexity?.space || "N/A"}</span></div>
    <div class="explain">${current_complexity?.space_explanation || ""}</div></div>
    <div class="box box-green"><div class="box-label green-label">Optimized: ${optimized_title || ""}</div>
    <div class="metric">⏱ <span class="badge green-badge">${optimized_complexity?.time || "N/A"}</span></div>
    <div class="explain">${optimized_complexity?.time_explanation || ""}</div>
    <div class="metric">💾 <span class="badge green-badge">${optimized_complexity?.space || "N/A"}</span></div>
    <div class="explain">${optimized_complexity?.space_explanation || ""}</div></div>
  </div>
  <h2>🚀 Optimized Code — ${optimized_title || ""}</h2>
  <pre>${(optimized_code || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
  <h2>💡 Suggestions (${suggestions?.length || 0})</h2>
  ${(suggestions || []).map((s, i) => `<div class="suggestion"><div class="suggestion-title">${i + 1}. ${s.title}</div>
  <div class="suggestion-issue">${s.issue || ""}</div>
  <pre>${(s.code || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>`).join("")}
  <h2>📝 Original Code</h2>
  <pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
  <div class="footer">Generated by AI-Driven Code Reviewer | ${new Date().toLocaleDateString()}</div>
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) { win.onload = () => { win.print(); URL.revokeObjectURL(url); }; }
};

/* ─── Language Detection ─── */
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

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const EditorPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedOptimized, setCopiedOptimized] = useState(false);
  const [connected, setConnected] = useState(true);
  const [filename, setFilename] = useState("main.js");
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");
  const [langMismatch, setLangMismatch] = useState(null);
  const [showMismatchBanner, setShowMismatchBanner] = useState(false);
  // ── Mobile: which panel is active ──
  const [mobilePanel, setMobilePanel] = useState("editor"); // "editor" | "review"

  const [previousCode, setPreviousCode] = useState("");
  const previousCodeRef = useRef("");
  const lastAnalyzedRef = useRef("");
  const editorRef = useRef(null);

  const languages = [
    { name: "JavaScript", value: "javascript", ext: "js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Python", value: "python", ext: "py", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java", value: "java", ext: "java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "C++", value: "cpp", ext: "cpp", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "C", value: "c", ext: "c", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
    { name: "Go", value: "go", ext: "go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" },
  ];
  const currentLang = languages.find((l) => l.value === language);

  const defaultCode = {
    javascript: `// Write your JavaScript code here\n\nfunction example() {\n  console.log("Hello World");\n}`,
    python: `# Write your Python code here\n\ndef example():\n    print("Hello World")`,
    java: `// Write your Java code here\n\nclass Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}`,
    cpp: `// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World";\n  return 0;\n}`,
    c: `// Write your C code here\n\n#include <stdio.h>\n\nint main() {\n  printf("Hello World");\n  return 0;\n}`,
    go: `// Write your Go code here\n\npackage main\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello World")\n}`,
  };

  useEffect(() => {
    setCode(defaultCode[language]);
    setAnalysisData(null); setError("");
    setLangMismatch(null); setShowMismatchBanner(false);
    previousCodeRef.current = "";
    lastAnalyzedRef.current = "";
    setPreviousCode("");
    const base = filename.replace(/\.[^.]+$/, "");
    setFilename(`${base}.${currentLang.ext}`);
  }, [language]);

  const flashEditor = (fixedCode) => {
    setCode(fixedCode);
    if (editorRef.current) {
      const editor = editorRef.current;
      const n = fixedCode.split("\n").length;
      const dec = editor.deltaDecorations([], [{
        range: { startLineNumber: 1, startColumn: 1, endLineNumber: n, endColumn: 1 },
        options: { isWholeLine: true, className: "editor-highlight-flash" },
      }]);
      setTimeout(() => editor.deltaDecorations(dec, []), 1200);
      editor.focus();
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyOptimized = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedOptimized(true);
    setTimeout(() => setCopiedOptimized(false), 2000);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true); setAnalysisData(null); setError("");
    setLangMismatch(null); setShowMismatchBanner(false);
    // Auto-switch to review panel on mobile after clicking analyze
    setMobilePanel("review");

    previousCodeRef.current = lastAnalyzedRef.current;
    lastAnalyzedRef.current = code;
    setPreviousCode(previousCodeRef.current);

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
      const response = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, mismatch_note: mismatchNote }),
      });
      setConnected(response.ok);
      if (!response.ok) throw new Error("backend");
      const data = await response.json();
      if (data.error) { setError(data.error); return; }
      setAnalysisData(data);
      const entry = {
        timestamp: new Date().toLocaleTimeString(),
        language,
        codePreview: code.trim().split("\n").slice(0, 2).join(" ").slice(0, 60) + "…",
        code,
        time: data.current_complexity?.time || "N/A",
        space: data.current_complexity?.space || "N/A",
        ...data,
      };
      setAnalysisHistory((h) => [...h, entry]);
    } catch (e) {
      setConnected(false);
      setError(e.message === "backend" ? "__error__" : e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    setAnalysisData(item);
  };

  const Skeleton = () => (
    <div className="space-y-3 animate-pulse p-4">
      {[75, 55, 90, 40, 65].map((w, i) => (
        <div key={i} className="h-3 rounded-full bg-slate-200 dark:bg-slate-700" style={{ width: `${w}%` }} />
      ))}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-32 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100" />
        <div className="h-32 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100" />
      </div>
      <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-700/50" />
      <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-700/50" />
    </div>
  );

  const suggestionCount = analysisData?.suggestions?.length || 0;

  return (
    <>
      <style>{`.editor-highlight-flash { background: rgba(59,130,246,0.15) !important; }`}</style>

      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100
                        dark:bg-gray-950 transition-all flex flex-col">

          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* ── TOP BAR ── */}
          <div className="flex justify-between items-center px-3 sm:px-6 py-3 flex-wrap gap-2">

            {/* Language Picker */}
            <div className="relative">
              <button onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-lg shadow-sm border cursor-pointer
                           bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors">
                <img src={currentLang.icon} className="w-4 h-4 sm:w-5 sm:h-5" alt={currentLang.name} />
                <span className="text-slate-800 dark:text-white text-sm font-medium">{currentLang.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
              </button>
              {openDropdown && (
                <div className="absolute mt-2 w-44 rounded-xl shadow-xl border z-50
                                bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
                  {languages.map((lang) => (
                    <button key={lang.value} onClick={() => { setLanguage(lang.value); setOpenDropdown(false); }}
                      className={`flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors
                        hover:bg-blue-50 dark:hover:bg-slate-700 ${language === lang.value ? "bg-blue-50 dark:bg-slate-700" : ""}`}>
                      <img src={lang.icon} className="w-5 h-5" alt={lang.name} />
                      <span className="text-slate-700 dark:text-slate-200 text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`} />
                {connected ? "Backend connected" : "Backend offline"}
              </div>

              <button onClick={() => setShowHistory(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-white dark:bg-slate-800
                           border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-600 dark:text-slate-300
                           text-sm transition-colors relative">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
                {analysisHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {analysisHistory.length}
                  </span>
                )}
              </button>

              {analysisData && (
                <button onClick={() => exportToPDF(analysisData, code, language)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-white dark:bg-slate-800
                             border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-600 dark:text-slate-300
                             text-sm transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}

              <button onClick={handleAnalyze} disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700
                           disabled:opacity-60 text-white rounded-lg font-medium text-sm shadow-md
                           shadow-blue-200 dark:shadow-blue-900/40 transition-all hover:shadow-lg active:scale-[0.98]">
                <Zap className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden xs:inline">{loading ? "Analyzing…" : "Analyze Code"}</span>
                <span className="xs:hidden">{loading ? "…" : "Analyze"}</span>
              </button>
            </div>
          </div>

          {/* ── MOBILE PANEL TOGGLE ── */}
          <div className="flex md:hidden mx-3 mb-2 rounded-xl overflow-hidden border border-slate-200
                          dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <button
              onClick={() => setMobilePanel("editor")}
              className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5
                ${mobilePanel === "editor"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Pencil className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              onClick={() => setMobilePanel("review")}
              className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5
                ${mobilePanel === "review"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> AI Review
              {suggestionCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/30 text-xs font-bold">
                  {suggestionCount}
                </span>
              )}
            </button>
          </div>

          {/* ── PANELS ── */}
          {/* Desktop: side by side | Mobile: toggled single panel */}
          <div className="flex-1 flex flex-col md:flex-row gap-3 px-3 sm:px-6 pb-6
                          md:h-[calc(100vh-130px)] md:overflow-hidden">

            {/* EDITOR PANEL */}
            <div className={`
              md:w-1/2 flex flex-col rounded-xl overflow-hidden shadow-md
              border border-slate-200 dark:border-slate-700
              ${mobilePanel === "editor" ? "flex" : "hidden"} md:flex
              h-[60vh] md:h-auto
            `}>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 dark:bg-slate-800
                              border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <img src={currentLang.icon} className="w-4 h-4 flex-shrink-0" alt={currentLang.name} />
                <EditableFilename value={filename} onChange={setFilename} />
              </div>
              {showMismatchBanner && langMismatch && (
                <LanguageMismatchBanner
                  selectedLang={langMismatch.selected}
                  detectedLang={langMismatch.detected}
                  onDismiss={() => setShowMismatchBanner(false)}
                />
              )}
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  language={language}
                  theme={darkMode ? "vs-dark" : "light"}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  options={{
                    minimap: { enabled: false }, fontSize: 13, lineHeight: 21,
                    padding: { top: 12 }, scrollBeyondLastLine: false,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  }}
                  onMount={(editor) => { editorRef.current = editor; }}
                />
              </div>
            </div>

            {/* AI REVIEW PANEL */}
            <div className={`
              md:w-1/2 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-md
              border border-slate-200 dark:border-slate-700 overflow-hidden
              ${mobilePanel === "review" ? "flex" : "hidden"} md:flex
              min-h-[60vh] md:min-h-0
            `}>
              <div className="flex items-center justify-between px-4 sm:px-5 py-3
                              border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800 dark:text-white text-sm leading-none">AI Review</h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">In-depth analysis</p>
                  </div>
                </div>
                {suggestionCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50
                                   text-blue-700 dark:text-blue-300 text-xs font-medium">
                    {suggestionCount} fix{suggestionCount > 1 ? "es" : ""}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <Skeleton />
                ) : error === "__error__" ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Backend unreachable</p>
                      <p className="text-slate-400 text-xs mt-1">Make sure Flask is running on port 5000</p>
                    </div>
                    <button onClick={handleAnalyze}
                      className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200
                                 text-slate-600 dark:text-slate-300 rounded-lg text-xs transition-colors">
                      Retry
                    </button>
                  </div>
                ) : analysisData ? (
                  <>
                    {analysisData.review && <ReviewText content={analysisData.review} />}

                    {analysisData.current_complexity && analysisData.optimized_complexity && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Complexity Analysis</span>
                        </div>
                        <ComplexityRow
                          current={analysisData.current_complexity}
                          optimized={analysisData.optimized_complexity}
                        />
                      </div>
                    )}

                    {analysisData.optimized_code && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Most Efficient Version</span>
                        </div>
                        <OptimizedCodeCard
                          title={analysisData.optimized_title}
                          code={analysisData.optimized_code}
                          onApply={() => flashEditor(analysisData.optimized_code)}
                          onCopy={() => handleCopyOptimized(analysisData.optimized_code)}
                          copied={copiedOptimized}
                        />
                      </div>
                    )}

                    {analysisData.suggestions?.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {analysisData.suggestions.length} Improvement{analysisData.suggestions.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        {analysisData.suggestions.map((s, i) => (
                          <SuggestionCard
                            key={i} index={i}
                            title={s.title} issue={s.issue} code={s.code}
                            onApply={() => flashEditor(s.code)}
                            onCopy={() => handleCopy(s.code, i)}
                            copied={copiedIndex === i}
                          />
                        ))}
                      </div>
                    )}

                    {analysisData.chart_data && (
                      <ComplexityChart chartData={analysisData.chart_data} />
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100
                                    dark:border-slate-700 flex items-center justify-center">
                      <Zap className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ready to review</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Click "Analyze Code" for in-depth analysis with complexity breakdown
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {showHistory && (
        <>
          <div className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <HistorySidebar
            history={analysisHistory}
            onSelect={handleSelectHistory}
            onClose={() => setShowHistory(false)}
            darkMode={darkMode}
          />
        </>
      )}

      <AIChatBubble
        currentCode={code}
        previousCode={previousCode}
        language={language}
        darkMode={darkMode}
        analysisHistory={analysisHistory}
      />
    </>
  );
};

export default EditorPage;
