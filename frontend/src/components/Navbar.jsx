import React, { useState } from "react";
import { Sun, Moon, Menu, X, House, Code2, Info, CircleHelp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50
                      flex justify-between items-center px-4 md:px-6 py-3 md:py-4
                      shadow-md bg-white/80 backdrop-blur-md dark:bg-gray-800
                      transition-all">

        {/* LEFT: Logo + Title */}
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer"
          onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }}
        >
          <img
            src="/Logo.png"
            alt="logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-lg hover:scale-125 transition"
          />
          <span className="text-base md:text-2xl font-bold text-blue-600 dark:text-white hover:text-blue-400 transition">
            AI-Driven Code Reviewer
          </span>
        </div>

        {/* CENTER: Nav Links — desktop only */}
        <div className="hidden md:flex items-center gap-10 text-xl font-semibold text-gray-900 dark:text-gray-200">
          <Link to="/" className="flex items-center gap-1.5 hover:text-blue-500 transition">
            <House size={20} /> Home
          </Link>
          <Link to="/analyze" className="flex items-center gap-1.5 hover:text-blue-500 transition">
            <Code2 size={20} /> Analyze Code
          </Link>
          <Link to="/about" className="flex items-center gap-1.5 hover:text-blue-500 transition">
            <Info size={20} /> About
          </Link>
          <Link to="/help" className="flex items-center gap-1.5 hover:text-blue-500 transition">
            <CircleHelp size={20} /> Help
          </Link>
        </div>

        {/* RIGHT: Theme Toggle + Hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-blue-500 text-white dark:bg-gray-700 hover:scale-110 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full
                          bg-white/95 dark:bg-gray-800
                          backdrop-blur-md shadow-xl
                          flex flex-col items-start px-6 py-4 gap-4
                          z-50 md:hidden
                          border-t border-slate-200 dark:border-slate-700">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition w-full"
            >
              <House size={20} /> Home
            </Link>
            <Link
              to="/analyze"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition w-full"
            >
              <Code2 size={20} /> Analyze Code
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition w-full"
            >
              <Info size={20} /> About
            </Link>
            <Link
              to="/help"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition w-full"
            >
              <CircleHelp size={20} /> Help
            </Link>
          </div>
        )}
      </nav>

      <div className="h-[64px] md:h-[72px]" />
    </>
  );
};

export default Navbar;
