import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AnalyzePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const cards = [
    {
      route: "/analyze/editor",
      img: "/editor.png",
      alt: "editor",
      title: "Code Editor",
      desc: "Write and analyze your code with real-time AI feedback, structured insights, and performance suggestions.",
      glow: "bg-blue-400/20",
    },
    {
      route: "/analyze/quick",
      img: "/quick_analyze.png",
      alt: "quick",
      title: "Quick Analyze",
      desc: "Paste your code and instantly get a complete AI-powered review with suggestions and improvements.",
      glow: "bg-blue-400/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200
                 dark:bg-gray-900 transition-all"
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* MAIN */}
      <div className="flex items-center justify-center min-h-[85vh] px-4 sm:px-8 md:px-10 py-10 md:py-0">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full max-w-[1200px]">

          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -12, scale: 1.04 }}
              onClick={() => navigate(card.route)}
              className="relative group cursor-pointer rounded-3xl"
            >
              {/* Glow Layer */}
              <div className={`absolute -inset-1 ${card.glow} blur-2xl opacity-60
                               group-hover:opacity-100 transition rounded-3xl`} />

              {/* Card */}
              <div className="relative p-5 md:p-6 flex flex-col items-center text-center
                              bg-gradient-to-br from-white/80 to-blue-50/60
                              dark:from-gray-800/90 dark:to-gray-900/80
                              backdrop-blur-lg
                              border border-blue-300/40 dark:border-gray-600
                              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                              ring-1 ring-blue-300/30
                              hover:ring-2 hover:ring-blue-400
                              hover:shadow-[0_25px_80px_rgba(37,99,235,0.5)]
                              transition-all duration-300 rounded-3xl"
              >
                {/* Image — smaller on mobile */}
                <img
                  src={card.img}
                  alt={card.alt}
                  className="w-48 h-40 sm:w-64 sm:h-56 md:w-80 md:h-72 object-contain mb-4"
                />

                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  {card.title}
                </h2>

                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-sm">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </motion.div>
  );
};

export default AnalyzePage;
