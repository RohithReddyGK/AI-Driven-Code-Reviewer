import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { FaReact } from "react-icons/fa";
import { SiTailwindcss, SiFlask } from "react-icons/si";
import { MdOutlineApi } from "react-icons/md";
import { BsStars, BsLightningChargeFill } from "react-icons/bs";
import Footer from "./Footer";

const AboutPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const techCards = [
    {
      title: "React + Vite",
      desc: "Blazing fast frontend with hot module replacement and optimized builds.",
      icon: <FaReact className="text-blue-500 w-12 h-12" />,
      bg: "from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-800",
      border: "border-blue-200 dark:border-blue-700/50",
      badge: "Frontend",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    },
    {
      title: "TailwindCSS",
      desc: "Utility-first CSS framework for a responsive, modern design system.",
      icon: <SiTailwindcss className="text-cyan-500 w-12 h-12" />,
      bg: "from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-800",
      border: "border-cyan-200 dark:border-cyan-700/50",
      badge: "Styling",
      badgeColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300",
    },
    {
      title: "Flask",
      desc: "Lightweight Python backend handling AI requests and delivering insights.",
      icon: <SiFlask className="text-gray-600 dark:text-gray-300 w-12 h-12" />,
      bg: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800",
      border: "border-gray-200 dark:border-gray-600/50",
      badge: "Backend",
      badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    },
    {
      title: "Groq API",
      desc: "llama-3.1-8b-instant model delivers world-class code analysis at lightning speed.",
      icon: <MdOutlineApi className="text-purple-500 w-12 h-12" />,
      bg: "from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-800",
      border: "border-purple-200 dark:border-purple-700/50",
      badge: "AI Engine",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    },
  ];

  const features = [
    { icon: "🤖", title: "AI Agent",           desc: "Answers developer questions in real-time, tracks code context, compares versions, and gives contextual suggestions.", color: "blue"   },
    { icon: "⚡", title: "Quick Analyze",       desc: "Paste any code and get a full AI-powered review instantly — no editor needed.",                                     color: "yellow"  },
    { icon: "🌍", title: "Multi-Language",      desc: "Supports Python, Java, JavaScript, C, C++, and Go with native syntax analysis.",                                    color: "green"   },
    { icon: "📜", title: "History Tracking",    desc: "Keeps all past analyses accessible for reference, learning, and comparison.",                                       color: "orange"  },
    { icon: "📄", title: "PDF Export",          desc: "Download detailed analysis reports as PDFs for sharing or documentation.",                                          color: "red"     },
    { icon: "🔍", title: "Complexity Analysis", desc: "Visualizes time and space complexity with charts to help you understand performance.",                               color: "indigo"  },
  ];

  const colorMap = {
    blue:   { bg: "bg-blue-50 dark:bg-gray-800",   border: "border-blue-200 dark:border-blue-700/50",   icon: "bg-blue-100 dark:bg-blue-900/60",   text: "text-blue-600 dark:text-blue-400"   },
    yellow: { bg: "bg-yellow-50 dark:bg-gray-800", border: "border-yellow-200 dark:border-yellow-700/50", icon: "bg-yellow-100 dark:bg-yellow-900/60", text: "text-yellow-500 dark:text-yellow-400" },
    green:  { bg: "bg-green-50 dark:bg-gray-800",  border: "border-green-200 dark:border-green-700/50", icon: "bg-green-100 dark:bg-green-900/60",  text: "text-green-600 dark:text-green-400"  },
    orange: { bg: "bg-orange-50 dark:bg-gray-800", border: "border-orange-200 dark:border-orange-700/50", icon: "bg-orange-100 dark:bg-orange-900/60", text: "text-orange-600 dark:text-orange-400" },
    red:    { bg: "bg-red-50 dark:bg-gray-800",    border: "border-red-200 dark:border-red-700/50",    icon: "bg-red-100 dark:bg-red-900/60",    text: "text-red-500 dark:text-red-400"      },
    indigo: { bg: "bg-indigo-50 dark:bg-gray-800", border: "border-indigo-200 dark:border-indigo-700/50", icon: "bg-indigo-100 dark:bg-indigo-900/60", text: "text-indigo-600 dark:text-indigo-400" },
  };

  const languages = [
    { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" },
    { name: "C",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
    { name: "C++",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "Go",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" },
  ];

  return (
    // ── outer div: applies dark class ──
    <div className={darkMode ? "dark" : ""}>

      {/* ── page background + content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:bg-gray-950 transition-all"
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="max-w-6xl mx-auto px-6 py-16">

          {/* ── Hero ── */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-blue-100 dark:bg-blue-900/40
                         text-blue-700 dark:text-blue-900
                         text-sm font-medium mb-6 border border-blue-200 dark:border-blue-700"
            >
              <BsStars className="w-4 h-4" />
              Powered by Groq · llama-3.1-8b-instant
            </motion.div>

            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-black mb-6 leading-tight"
            >
              AI-Driven{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Code Reviewer
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              A next-generation developer tool that analyzes, optimizes, and improves your code
              with instant AI feedback — so you can ship better software, faster. 🚀
            </motion.p>
          </div>

          {/* ── Tech Stack ── */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-black mb-2">Tech Stack</h2>
              <p className="text-slate-500 dark:text-slate-400">Built with modern, production-grade technologies</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {techCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-6
                              shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                      {card.icon}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Features Grid ── */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-black mb-2">Key Features</h2>
              <p className="text-slate-500 dark:text-slate-400">Everything you need to write better code</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const c = colorMap[f.color];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className={`${c.bg} border ${c.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                      {f.icon}
                    </div>
                    <h3 className={`text-lg font-bold ${c.text} mb-2`}>{f.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Supported Languages ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-black mb-2">Supported Languages</h2>
              <p className="text-slate-500 dark:text-slate-400">Native syntax analysis for 6 languages</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <div className="flex flex-wrap justify-center gap-10">
                {languages.map((lang, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.15, y: -4 }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <img src={lang.icon} alt={lang.name} className="w-14 h-14 transition-transform" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-300 group-hover:text-blue-500 transition-colors">
                      {lang.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Mission ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-slate-700
                            p-10 shadow-sm text-center">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/40 rounded-2xl flex items-center
                              justify-center text-3xl mx-auto mb-4">💡</div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                We aim to empower developers by providing instant, AI-powered insights into their code.
                Whether you're debugging, optimizing, or learning — the AI-Driven Code Reviewer guides
                you toward cleaner, faster, and more efficient solutions. By leveraging Groq's cutting-edge
                models, we bring enterprise-grade AI analysis directly into your workflow.
              </p>
            </div>
          </motion.div>

          {/* ── Closing Banner ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                       rounded-3xl p-10 text-white text-center shadow-xl"
          >
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-20 translate-y-20" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BsLightningChargeFill className="w-6 h-6 text-yellow-300" />
                <h3 className="text-2xl md:text-3xl font-bold">Powered by Groq + Llama 3.1</h3>
                <BsLightningChargeFill className="w-6 h-6 text-yellow-300" />
              </div>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                At the heart of this tool lies the Groq API and the llama-3.1-8b-instant model,
                enabling world-class code reviews with speed, accuracy, and actionable insights.
              </p>
            </div>
          </motion.div>

        </div>
      </motion.div>

      <Footer />

    </div>
  );
};

export default AboutPage;
