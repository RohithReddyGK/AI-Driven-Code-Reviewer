import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { BsQuestionCircle, BsBook, BsChatDots, BsCheckCircle } from "react-icons/bs";
import { MdOutlineKeyboard } from "react-icons/md";
import Footer from "./Footer";

const HelpPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const [activeTab, setActiveTab] = useState("faq");

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [darkMode]);

    const faqs = [
        { q: "How do I switch between Quick Analyze and Editor?", a: "Go to the Analyze page — click the card for Editor or Quick Analyze depending on your need. The Editor gives you full IDE-like features while Quick Analyze is for instant paste-and-review.", icon: "🔄" },
        { q: "Can I download my analysis?", a: "Yes! In the Editor, click the PDF button in the top bar after running an analysis. It generates a complete HTML report with complexity breakdown, optimized code, and all suggestions.", icon: "📄" },
        { q: "Which languages are supported?", a: "Python, Java, JavaScript, C, C++, and Go are fully supported with native syntax highlighting and AI analysis tailored to each language's best practices.", icon: "🌍" },
        { q: "Does the AI Agent track my code?", a: "Yes! The AI Agent watches your current editor code in real-time. You can ask it to explain lines, compare with your previous version, find bugs, or suggest improvements. It always has the latest context.", icon: "🤖" },
        { q: "Is my analysis history saved?", a: "Yes, every time you click Analyze Code, the result is saved in the History panel (top right). Click History to revisit past analyses and restore any previous version.", icon: "📜" },
        { q: "What does the Complexity Chart show?", a: "The line chart shows Time and Space efficiency scores (out of 10) comparing your current code vs the optimized version. Higher scores mean more efficient code.", icon: "📊" },
    ];

    const steps = [
        { step: "01", title: "Open the Editor", desc: "Navigate to Analyze → Editor to open the full code editor.", icon: "💻" },
        { step: "02", title: "Select Language", desc: "Choose your language from the dropdown (JS, Python, Java, C, C++, Go).", icon: "🌍" },
        { step: "03", title: "Write or Paste Code", desc: "Type your code or paste it into the Monaco editor.", icon: "✏️" },
        { step: "04", title: "Click Analyze Code", desc: "Hit the blue Analyze Code button — AI reviews your code in seconds.", icon: "⚡" },
        { step: "05", title: "Review the Results", desc: "See complexity, optimized code, suggestions, and the efficiency chart.", icon: "🔍" },
        { step: "06", title: "Export or Apply", desc: "Apply fixes directly to the editor or export the full report as PDF.", icon: "📄" },
    ];

    const shortcuts = [
        { key: "Ctrl + Enter", desc: "Trigger code analysis" },
        { key: "Ctrl + C", desc: "Copy selected code" },
        { key: "Ctrl + Z", desc: "Undo in editor" },
        { key: "Ctrl + /", desc: "Toggle comment" },
        { key: "Alt + Shift + F", desc: "Format code in editor" },
        { key: "Ctrl + D", desc: "Select next occurrence" },
    ];

    const tabs = [
        { id: "faq", label: "FAQs", icon: <BsQuestionCircle className="w-4 h-4" /> },
        { id: "guide", label: "Quick Guide", icon: <BsBook className="w-4 h-4" /> },
        { id: "shortcuts", label: "Shortcuts", icon: <MdOutlineKeyboard className="w-4 h-4" /> },
        { id: "tips", label: "AI Agent Tips", icon: <BsChatDots className="w-4 h-4" /> },
    ];

    const agentTips = [
        { tip: "what's wrong with my code?", desc: "Get a full bug report with explanations." },
        { tip: "explain line 5", desc: "AI explains any specific line in detail." },
        { tip: "compare with my previous version", desc: "See exactly what changed between versions." },
        { tip: "what is the time complexity?", desc: "Get Big-O analysis of your current code." },
        { tip: "give me my previous code", desc: "Restore the last analyzed snapshot." },
        { tip: "how can I optimize this?", desc: "Get specific optimization suggestions." },
        { tip: "give me my current code", desc: "AI echoes back exactly what's in the editor." },
        { tip: "is there a memory leak?", desc: "AI checks for common memory issues." },
    ];

    return (
        <div className={darkMode ? "dark" : ""}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:bg-gray-950 transition-all"
            >
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

                <div className="max-w-5xl mx-auto px-6 py-16">

                    {/* ── Hero ── */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-blue-500 mb-4"
                        >
                            Help & Support
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
                        >
                            Everything you need to get the most out of AI-Driven Code Reviewer
                        </motion.p>
                    </div>

                    {/* ── Tabs ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 justify-center mb-10"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
                  ${activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40"
                                        : "bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>

                    <AnimatePresence mode="wait">

                        {/* ── FAQ Tab ── */}
                        {activeTab === "faq" && (
                            <motion.div
                                key="faq"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {faqs.map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200
                               dark:border-slate-700 shadow-sm overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                            className="w-full text-left p-5 flex items-center gap-4
                                 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <span className="text-2xl flex-shrink-0">{faq.icon}</span>
                                            <span className="flex-1 text-base font-semibold text-slate-800 dark:text-white">
                                                {faq.q}
                                            </span>
                                            <span className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center
                                        text-sm font-bold transition-all
                        ${openIndex === i
                                                    ? "bg-blue-500 text-white rotate-180"
                                                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"}`}>
                                                ↓
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {openIndex === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="px-5 pb-5 pl-16"
                                                >
                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* ── Quick Guide Tab ── */}
                        {activeTab === "guide" && (
                            <motion.div
                                key="guide"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {steps.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200
                                 dark:border-slate-700 p-5 shadow-sm flex items-start gap-4
                                 hover:border-blue-400 hover:shadow-md transition-all"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center
                                        justify-center text-sm font-bold shadow-md shadow-blue-200
                                        dark:shadow-blue-900/40">
                                                    {s.step}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{s.icon}</span>
                                                    <h3 className="font-bold text-slate-800 dark:text-white">{s.title}</h3>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pro Tip */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-6 p-5 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-700/50
                             rounded-2xl flex items-start gap-3"
                                >
                                    <span className="text-2xl flex-shrink-0">💡</span>
                                    <div>
                                        <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Pro Tip</p>
                                        <p className="text-sm text-blue-600 dark:text-slate-300">
                                            After analyzing, click <strong>Apply</strong> on any suggestion to instantly patch it
                                            into the editor — then analyze again to confirm the improvement!
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ── Shortcuts Tab ── */}
                        {activeTab === "shortcuts" && (
                            <motion.div
                                key="shortcuts"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200
                                dark:border-slate-700 overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700
                                  bg-slate-50 dark:bg-gray-700/50">
                                        <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                                            <MdOutlineKeyboard className="w-5 h-5 text-blue-500" />
                                            Editor Keyboard Shortcuts
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {shortcuts.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.07 }}
                                                className="flex items-center justify-between px-6 py-4
                                   hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <span className="text-slate-700 dark:text-slate-300">{s.desc}</span>
                                                <kbd className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700
                                        dark:text-slate-200 rounded-lg text-sm font-mono border
                                        border-slate-200 dark:border-slate-600 shadow-sm">
                                                    {s.key}
                                                </kbd>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-5 p-5 bg-amber-50 dark:bg-gray-800 border border-amber-200
                             dark:border-amber-700/50 rounded-2xl flex items-start gap-3"
                                >
                                    <span className="text-2xl">⌨️</span>
                                    <p className="text-sm text-amber-700 dark:text-slate-300">
                                        The editor is powered by <strong>Monaco Editor</strong> (same as VS Code),
                                        so most VS Code shortcuts work here too!
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ── AI Agent Tips Tab ── */}
                        {activeTab === "tips" && (
                            <motion.div
                                key="tips"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🤖</span>
                                        <h3 className="text-lg font-bold">How to Talk to the AI Agent</h3>
                                    </div>
                                    <p className="text-blue-100 text-sm">
                                        The AI Agent lives in the bottom-right chat bubble. It always sees your current
                                        editor code and previous version. Try these prompts:
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {agentTips.map((t, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                            className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200
                                 dark:border-slate-700 p-4 shadow-sm hover:border-blue-400
                                 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <BsCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                                        "{t.tip}"
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-300">{t.desc}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-6 p-5 bg-green-50 dark:bg-gray-800 border border-green-200
                             dark:border-green-700/50 rounded-2xl flex items-start gap-3"
                                >
                                    <span className="text-2xl">🎯</span>
                                    <div>
                                        <p className="font-semibold text-green-700 dark:text-green-400 mb-1">Best Practice</p>
                                        <p className="text-sm text-green-600 dark:text-slate-300">
                                            Always <strong>Analyze Code first</strong> before asking the AI Agent —
                                            this gives it the full complexity context, optimized version, and suggestions
                                            to reference in its answers.
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
            <Footer />
        </div>
    );
};

export default HelpPage;
