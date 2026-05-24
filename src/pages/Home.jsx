"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const menuItems = [
    { id: "01", title: "Works", link: "/lab", sub: "Hardware & Systems" },
    { id: "02", title: "Profile", link: "/career", sub: "System Engineer" },
    { id: "03", title: "Contact", link: "/contact", sub: "Get in touch" }
  ];

  return (
    <main className="w-full h-screen bg-black text-white relative overflow-hidden flex flex-col justify-center items-center selection:bg-[#00979D]/30">
      
      {/* ─── HINTERGRUND (GIF / VIDEO / GLOW) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
        {/* Hier dein GIF-Background einfügen. Beispiel: 
            <img src={yourGif} className="w-full h-full object-cover" /> 
        */}
        <motion.div 
          animate={{ x: mousePos.x * -30, y: mousePos.y * -30 }}
          className="w-full h-full bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)] flex items-center justify-center"
        >
            <div className="w-[150%] h-[150%] bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:10rem_10rem]" />
        </motion.div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Name / Title - Zentriert & Mächtig */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h1 className="text-[12vw] sm:text-[8vw] font-normal leading-none tracking-tight">
            Richard Zuikov
          </h1>
          <p className="mt-4 text-zinc-600 font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase">
            Low-Level Architekt / Systems Engineer
          </p>
        </motion.div>

        {/* ─── VERTICAL NAVIGATION (DIE "RUNTERGEBALLERTE" LISTE) ─── */}
        <nav className="flex flex-col items-center space-y-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              <Link to={item.link} className="flex flex-col items-center">
                {/* Die Hauptüberschrift */}
                <span className="text-4xl sm:text-6xl font-light tracking-wide text-zinc-500 group-hover:text-white transition-all duration-500 ease-out">
                  {item.title}
                </span>
                
                {/* Sub-Info (Takyua Style Detail) */}
                <span className={`text-[9px] font-mono tracking-[0.2em] uppercase mt-2 transition-all duration-500 ${hoveredIndex === index ? 'text-[#00979D] opacity-100' : 'text-zinc-800 opacity-0'}`}>
                  {item.sub}
                </span>

                {/* Hover-Line-Animation */}
                <motion.div 
                   className="h-[1px] bg-white mt-1"
                   initial={{ width: 0 }}
                   animate={{ width: hoveredIndex === index ? "100%" : 0 }}
                   transition={{ duration: 0.4 }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* ─── FOOTER INFO ─── */}
      <footer className="absolute bottom-8 w-full max-w-7xl px-8 flex justify-between items-center z-10 font-mono text-[9px] text-zinc-700 tracking-widest uppercase">
        <span>RZ.OS.V1 // 2026</span>
        <span>© Richard Zuikov All rights reserved</span>
      </footer>

    </main>
  );
}