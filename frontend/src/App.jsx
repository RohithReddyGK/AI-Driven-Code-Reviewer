import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./components/LandingPage";
import AnalyzePage from "./components/AnalyzePage";
import EditorPage from "./components/EditorPage";
import QuickAnalyzePage from "./components/QuickAnalyzePage";
import AboutPage from "./components/AboutPage";
import HelpPage from "./components/HelpPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/analyze/editor" element={<EditorPage />} />
        <Route path="/analyze/quick" element={<QuickAnalyzePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
