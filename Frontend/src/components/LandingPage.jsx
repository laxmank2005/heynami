import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BsChatDotsFill,
  BsShieldLockFill,
  BsPeopleFill,
  BsLightningChargeFill,
  BsArrowRight,
  BsCheckCircleFill,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";

const LandingPage = () => {
  const { authUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="bg-[#0a0a0a] h-screen text-white font-sans selection:bg-[#7C3AED]/30 overflow-hidden flex flex-col">
      
      {/* ── Navbar ── */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-[#0a0a0a] border-b border-[#1f1f1f] sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center">
              <BsChatDotsFill className="text-white text-base" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Ping<span className="text-[#7C3AED]">.</span>
            </span>
          </Link>



          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-bold text-[#d4d4d4] hover:text-white transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#7C3AED] rounded-full hover:bg-[#6D28D9] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO SECTION ── */}
      <section className="bg-[#0a0a0a] flex-1 flex items-center justify-center pb-10">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-3xl"
          >

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
              Talk to your <br />
              <span className={`text-[#7C3AED] transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                {words[wordIndex]}
              </span>{" "}
              <br />
              without <br /> the noise.
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[17px] text-[#888888] mx-auto max-w-md leading-relaxed font-medium"
            >
              A fast, private, real-time chat app that keeps your conversations end-to-end encrypted and clutter-free.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-8 py-4 rounded-full font-bold text-[15px] hover:bg-[#6D28D9] transition-colors"
              >
                Start chatting free
                <BsArrowRight />
              </Link>
            </motion.div>


          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
