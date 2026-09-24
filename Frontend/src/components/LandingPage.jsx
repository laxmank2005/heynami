import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsChatDotsFill, BsArrowRight } from "react-icons/bs";

const LandingPage = () => {
  const { authUser } = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Rotating words for the hero
  const words = ["friends", "team", "family", "people"];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 300);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-[#0d0d0d] min-h-screen text-gray-900 dark:text-white font-[Inter,system-ui,sans-serif] selection:bg-violet-500/30 overflow-hidden flex flex-col transition-colors duration-300">
      
      {/* ── Navbar ── */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-white/50 dark:bg-[#111]/50 backdrop-blur-md border-b border-gray-200/50 dark:border-stone-800 sticky top-0 z-50 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <BsChatDotsFill className="text-white text-base" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
              Ping<span className="text-violet-600">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/login"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-stone-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800/60"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-colors shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION ── */}
      <section className="flex-1 flex items-center justify-center relative pb-10">
        {/* Subtle background blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-200/40 dark:bg-violet-900/10 blur-[120px] pointer-events-none -z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-200/30 dark:bg-indigo-900/10 blur-[100px] pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-3xl"
          >

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight transition-colors">
              Talk to your <br />
              <span className={`text-violet-600 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                {words[wordIndex]}
              </span>{" "}
              <br />
              without <br /> the noise.
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[17px] text-gray-500 dark:text-stone-400 mx-auto max-w-md leading-relaxed font-medium transition-colors"
            >
              A fast, private, real-time chat app that keeps your conversations end-to-end encrypted and clutter-free.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex justify-center pt-2"
            >
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm hover:bg-violet-700 transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-[1.02]"
              >
                Start chatting free
                <BsArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
