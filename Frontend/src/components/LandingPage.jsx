import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import {
  BsChatDotsFill,
  BsShieldLockFill,
  BsPeopleFill,
  BsLightningChargeFill,
  BsArrowRight,
  BsCheckCircleFill,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";

function LuffyModel(props) {
  const { scene } = useGLTF('/luffy/scene.gltf');
  return <primitive object={scene} {...props} />;
}

const LandingPage = () => {
  const { authUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Responsive 3D Model State
  const [modelScale, setModelScale] = useState(window.innerWidth < 1024 ? 6.5 : 8);
  const [modelY, setModelY] = useState(window.innerWidth < 1024 ? -0.3 : -0.5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setModelScale(6.5);
        setModelY(-0.3);
      } else {
        setModelScale(8);
        setModelY(-0.5);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#7C3AED]/30 overflow-x-hidden">
      
      {/* ── Navbar ── */}
      <nav className="w-full bg-[#0a0a0a] border-b border-[#1f1f1f] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
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
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="bg-[#0a0a0a] min-h-[90vh] flex items-center pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text */}
          <div className="space-y-8">

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
              Talk to your <br />
              <span className="text-[#7C3AED]">
                people
              </span>{" "}
              <br />
              without <br /> the noise.
            </h1>

            <p className="text-[17px] text-[#888888] max-w-md leading-relaxed font-medium">
              A fast, private, real-time chat app that keeps your conversations end-to-end encrypted and clutter-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-8 py-4 rounded-full font-bold text-[15px] hover:bg-[#6D28D9] transition-colors"
              >
                Start chatting free
                <BsArrowRight />
              </Link>

            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#666666] pt-4">
              <BsShieldLockFill className="text-[#555555]" />
              No ads. No tracking. 100% private.
            </div>
          </div>

          {/* Right: 3D Luffy Model */}
          <div className="relative flex justify-center lg:justify-end items-center h-full w-full mt-8 lg:mt-0">
            <div className="w-full h-[350px] lg:h-[500px]">
              <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <Suspense fallback={null}>
                  <LuffyModel 
                    position={[0, modelY, 0]} 
                    scale={modelScale} 
                    rotation={[0, Math.PI + (scrollY * 0.003), 0]} 
                  />
                  <Environment preset="city" />
                  <ContactShadows position={[0, modelY, 0]} opacity={0.5} scale={10} blur={2} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES & SHOWCASE SECTION ── */}
      <section id="features" className="bg-[#0a0a0a] py-28 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 w-full">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Naami's favourites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/3270425600f6bde5b7f8e4a2917a6339.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              {/* Glare effect */}
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Card 2 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/HB5UAvTX0AAICZW.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Card 3 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.3 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] md:col-span-2 lg:col-span-1 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/thumb-1920-814912.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Card 4 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] lg:col-span-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/cranston-paul-breaking-bad.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Card 5 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/MoneyHeist-Professor-NetflixTVShowMoviePoster_1b532e28-3aee-4650-9f80-aa739308b9a8.webp')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Divider Text */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center py-8">
              <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-[0.2em] uppercase drop-shadow-xl">ALONE'S FAVORITE</span>
            </motion.div>

            {/* Card 6 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/f06257a2d88a1a39bede8d7bb9c44cdf.jpg')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Card 7 */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="relative group overflow-hidden rounded-2xl h-[400px] border border-[#1a1a1a] lg:col-span-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#7C3AED]/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/E06E4B7B-B2B2-4A46-B92C-DC5B672C3B07.webp')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] z-10 skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">ECHO'S FAVOURITE</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE SECTION ── */}
      <section className="bg-[#0a0a0a] py-16 border-t border-[#1a1a1a] overflow-hidden relative">
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 40s linear infinite;
            }
          `}
        </style>
        <div className="w-full flex items-center">
          <div className="animate-marquee">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#888888] uppercase tracking-[0.2em] pr-16">
              THE THREE MONKEYS =&gt; ALONE, NAAMI & ECHO
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#888888] uppercase tracking-[0.2em]">
              THE THREE MONKEYS =&gt; ALONE, NAAMI & ECHO
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
