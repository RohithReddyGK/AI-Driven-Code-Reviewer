import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import { motion } from "framer-motion";
import animationData from "../assets/coding.json";

/* ================= ORBIT ICON ================= */
const OrbitIcon = ({ src, angle, radius }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`
      }}
    >
      <img
        src={src}
        alt="icon"
        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                   bg-white p-1.5 md:p-2 rounded-full shadow-lg border border-white
                   hover:scale-110 transition"
      />
    </div>
  );
};

/* ================= ORBIT CONTAINER ================= */
const OrbitIcons = ({ radius }) => {
  return (
    <div className="absolute inset-0 animate-[spin_18s_linear_infinite]">
      <OrbitIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"      angle={0}   radius={radius} />
      <OrbitIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" angle={60}  radius={radius} />
      <OrbitIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"           angle={120} radius={radius} />
      <OrbitIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" angle={180} radius={radius} />
      <OrbitIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"                angle={240} radius={radius} />
      <OrbitIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg"     angle={300} radius={radius} />
    </div>
  );
};

/* ================= LEFT PANEL (Lottie animation) ================= */
const LeftPanel = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
    return () => anim.destroy();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full md:w-[48%] flex justify-center md:justify-end"
    >
      <div
        ref={containerRef}
        className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[600px] md:h-[600px]"
      />
    </motion.div>
  );
};

/* ================= RIGHT PANEL (Orbit + Title + Button) ================= */
const RightPanel = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => navigate("/analyze"), 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full md:w-[50%] flex items-center justify-center p-2 md:p-6"
    >
      <div className="flex flex-col items-center text-center w-full max-w-[520px]">

        <div className="relative
                        w-[300px] h-[300px]
                        sm:w-[360px] sm:h-[360px]
                        md:w-[420px] md:h-[420px]
                        flex items-center justify-center">

          {/* Desktop orbit radius */}
          <div className="hidden md:block absolute inset-0">
            <OrbitIcons radius={180} />
          </div>
          {/* Tablet orbit radius */}
          <div className="hidden sm:block md:hidden absolute inset-0">
            <OrbitIcons radius={150} />
          </div>
          {/* Mobile orbit radius */}
          <div className="sm:hidden absolute inset-0">
            <OrbitIcons radius={120} />
          </div>
          <div className="w-[130px] h-[130px]
                          sm:w-[160px] sm:h-[160px]
                          md:w-[200px] md:h-[200px]
                          rounded-full overflow-hidden shadow-2xl border-2 border-white z-10 bg-white">
            <img
              src="/Logo.png"
              alt="logo"
              className="w-full h-full object-cover scale-125"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-4 text-slate-800">
          AI-Driven Code Reviewer
        </h1>

        {/* Description */}
        <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-[380px] leading-relaxed px-2">
          An intelligent platform that analyzes code, detects errors,
          improves code quality, and optimizes performance using advanced AI models.
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-xl shadow-lg
                     hover:bg-blue-600 transition text-base md:text-lg font-semibold"
        >
          Get Started 🚀
        </motion.button>

      </div>
    </motion.div>
  );
};

/* ================= MAIN PAGE ================= */
const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex items-center justify-center
                 bg-gradient-to-br from-slate-50 to-sky-100
                 py-6 md:py-0 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-between
                      w-[95%] max-w-[1400px] gap-0 md:gap-0">
        <LeftPanel />
        <RightPanel />
      </div>
    </motion.div>
  );
};

export default LandingPage;
