"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/use-language';

// PLATZHALTER FÜR DEIN GEILES 3D MARQUEE HINTERGRUND-SYSTEM
import bossImg from "../assets/Me_Picture.png";

// Eigene, sichere Hilfsfunktion für Tailwind Klassen
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [theme] = useTheme();
  const [language] = useLanguage();

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
    { 
      id: "01", 
      title: language === 'de' ? "Projekte" : "Works", 
      link: "/lab", 
      sub: language === 'de' ? "Hardware & Systeme" : "Hardware & Systems" 
    },
    { 
      id: "02", 
      title: language === 'de' ? "Werdegang" : "Profile", 
      link: "/career", 
      sub: language === 'de' ? "Systemarchitekt" : "System Engineer" 
    },
    { 
      id: "03", 
      title: language === 'de' ? "Kontakt" : "Contact", 
      link: "/contact", 
      sub: language === 'de' ? "Schreib mir" : "Get in touch" 
    }
  ];

  // Wir füttern das Marquee mit reichlich Bildern für nahtlose Spalten
  const marqueePlaceholderImages = [
    bossImg, bossImg, bossImg, bossImg,
    bossImg, bossImg, bossImg, bossImg,
    bossImg, bossImg, bossImg, bossImg,
    bossImg, bossImg, bossImg, bossImg
  ];

  return (
    <main className="w-full h-screen bg-white text-black dark:bg-[#030303] dark:text-[#F9F9F9] relative overflow-hidden flex flex-col justify-center items-center selection:bg-[#FFB000]/30 transition-colors duration-300">
      
      {/* ─── CRANK AF 3D MARQUEE BACKGROUND ENGINE (JETZT IN FARBE) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.12] dark:opacity-[0.40] select-none transition-opacity duration-300">
        <motion.div 
          animate={{ x: mousePos.x * -40, y: mousePos.y * -40 }}
          transition={{ type: "smooth", stiffness: 40, damping: 25 }}
          className="w-full h-full"
        >
          <ThreeDMarquee images={marqueePlaceholderImages} theme={theme} />
        </motion.div>
      </div>
 
      {/* ─── SOFT BACKDROP SHADOW FÜR BESSERE LESBARKEIT BEI FARBBILDERN ─── */}
      <div className="absolute inset-0 z-0 bg-white/20 dark:bg-black/30 pointer-events-none transition-colors duration-300" />
 
      {/* ─── MAIN CONTENT AREA (TAKUYA LOOK) ─── */}
      <div className="relative z-10 flex flex-col items-center select-none bg-white/40 dark:bg-black/20 border border-zinc-200/30 dark:border-transparent backdrop-blur-[2px] p-10 rounded-2xl transition-all duration-300">
        
        {/* Name / Title - Zentriert & Mächtig */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <h1 className="text-[12vw] sm:text-[7vw] font-light leading-none tracking-tight font-sans text-zinc-900 dark:text-[#F9F9F9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-colors duration-300">
            Richard Zuikov
          </h1>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors duration-300">
            {language === 'de' ? 'Low-Level Architekt' : 'Low-Level Architect'} <span className="text-[#FFB000]/60">//</span> Systems Engineer
          </p>
        </motion.div>
 
        {/* ─── VERTICAL NAVIGATION (RUNTERGEBALLERT) ─── */}
        <nav className="flex flex-col items-center space-y-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex flex-col items-center h-20"
            >
              <Link to={item.link} className="flex flex-col items-center">
                {/* Die Hauptüberschrift */}
                <span className="text-4xl sm:text-5xl font-light tracking-wide text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-[#F9F9F9] transition-all duration-500 ease-out drop-shadow-[0_4px_8px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {item.title}
                </span>
                
                {/* Sub-Info (Amber Terminal Style Detail) */}
                <span className={cn(
                  "text-[9px] font-mono tracking-[0.2em] uppercase mt-2 transition-all duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]",
                  hoveredIndex === index ? 'text-[#FFB000] opacity-100' : 'text-transparent opacity-0'
                )}>
                  [{item.sub}]
                </span>
 
                {/* Hover-Line-Animation */}
                <motion.div 
                   className="h-[1px] bg-zinc-900 dark:bg-[#F9F9F9] mt-1 shadow-xl"
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
      <footer className="absolute bottom-8 w-full max-w-7xl px-8 flex justify-between items-center z-10 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors duration-300">
        <span>RZ.OS.V2 // 2026</span>
        <span>© {language === 'de' ? 'Alle Rechte vorbehalten' : 'All rights reserved'}</span>
      </footer>
 
    </main>
  );
}
 
{/* ─── INTERNAL SUB-COMPONENTS FOR HIGH-END 3D EFFECT ─── */}
 
const ThreeDMarquee = ({ images, className, theme }) => {
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });
 
  return (
    <div className={cn("mx-auto block h-screen w-screen overflow-hidden", className)}>
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{ transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)" }}
            className="relative top-48 right-[10%] grid size-full origin-top-left grid-cols-4 gap-8 style-3d"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? [0, -400] : [-400, 0] }}
                transition={{
                  duration: colIndex % 2 === 0 ? 25 : 30,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" theme={theme} />
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <GridLineHorizontal className="-top-4" offset="20px" theme={theme} />
                    <img
                      src={image}
                      alt={`Blueprint Grid ${imageIndex + 1}`}
                      className="aspect-[970/700] rounded-none object-cover border border-zinc-200 dark:border-zinc-900 shadow-2xl transition-colors duration-300"
                      width={970}
                      height={700} 
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
const GridLineHorizontal = ({ className, offset, theme }) => {
  return (
    <div
      style={{
        "--background": "#ffffff",
        "--color": theme === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(26, 26, 26, 0.06)",
        "--height": "1px",
        "--width": "6px",
        "--fade-stop": "90%",
        "--offset": offset || "200px",
        "--color-dark": theme === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(26, 26, 26, 0.06)",
        maskComposite: "exclude"
      }}
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "z-30",
        className
      )}
    />
  );
};
 
const GridLineVertical = ({ className, offset, theme }) => {
  return (
    <div
      style={{
        "--background": "#ffffff",
        "--color": theme === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(26, 26, 26, 0.06)",
        "--height": "6px",
        "--width": "1px",
        "--fade-stop": "90%",
        "--offset": offset || "150px",
        "--color-dark": theme === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(26, 26, 26, 0.06)",
        maskComposite: "exclude"
      }}
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "z-30",
        className
      )}
    />
  );
};