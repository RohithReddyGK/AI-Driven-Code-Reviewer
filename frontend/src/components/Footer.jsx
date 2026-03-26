import React from "react";
import { BsGithub } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    const handleNav = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="border-t border-slate-300 dark:border-slate-700
                       bg-slate-100 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row
                      items-center justify-between gap-4">

                {/* Left — branding */}
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-semibold text-slate-800 dark:text-white">
                        AI-Driven Code Reviewer
                    </span>{" "}
                    · Built with React, Flask & Groq API
                </p>

                {/* Center — nav links */}
                <div className="flex items-center gap-6 text-lg font-semibold">
                    <button
                        onClick={() => handleNav("/analyze")}
                        className="text-slate-600 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        Analyze Code
                    </button>
                    <button
                        onClick={() => handleNav("/about")}
                        className="text-slate-600 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        About
                    </button>
                    <button
                        onClick={() => handleNav("/help")}
                        className="text-slate-600 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        Help
                    </button>
                </div>

                <a
                    href="https://github.com/RohithReddyGK/AI-Driven-Code-Reviewer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 dark:text-white hover:text-blue-400 dark:hover:text-blue-400 transition-colors"
                >
                    <BsGithub className="w-8 h-8" />
                </a>

            </div>
        </footer>
    );
};

export default Footer;