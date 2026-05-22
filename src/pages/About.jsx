"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Cpu, Terminal, Zap, Code, Database, Globe } from 'lucide-react';
// Annahme: Deine Komponenten liegen in "../components/ui/"
// import { Carousel } from "../components/ui/carousel";
// import { Timeline } from "../components/ui/timeline";

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Floating Letters Animation Setup
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <main ref={containerRef} className="bg-black text-white selection:bg-[#00979D]">
      {/* Scroll Bar Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#00979D] origin-left z-[999]" style={{ scaleX }} />

      {/* 1. HERO SECTION */}
      <section className="h-screen flex flex-col justify-center px-12 relative overflow-hidden">
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 right-20 text-[10rem] font-black text-zinc-900 select-none">HARDWARE</motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-40 left-10 text-[8rem] font-black text-zinc-900/30 select-none">CODE</motion.div>
        
        <h1 className="text-[10rem] font-black uppercase leading-[0.8] tracking-tighter">
          RICHARD <br/> <span className="text-[#00979D]">ZUIKOV</span>
        </h1>
        <p className="text-2xl text-zinc-400 mt-10 max-w-2xl">
          Wenn ich code, wird die Hardware heiß. Wenn ich löte, wird der Code präzise. 
          Vom Bit bis zum Deployment – alles aus einer Hand.
        </p>
      </section>

      {/* 2. CAROUSEL SECTION (DEINE BILDER) */}
      <section className="py-32 px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 underline decoration-[#00979D] underline-offset-8">Perspektiven</h2>
        {/* Hier dein Carousel einbauen */}
        <div className="h-[500px] w-full bg-zinc-900/30 rounded-3xl border border-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 italic">[Hier Carousel Implementation einfügen]</span>
        </div>
      </section>

      {/* 3. EXPERIENCE TIMELINE (LÄNGE DURCH SCROLLEN) */}
      <section className="py-32 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto px-12">
           <h2 className="text-5xl font-black mb-20 text-center">Der Pfad.</h2>
           {/* Hier deine Timeline Komponente nutzen */}
           <div className="space-y-24">
              {[
                { year: "2025", title: "Low-Level Kernel Optimierung", desc: "Erste Gehversuche in C++ für eingebettete Systeme." },
                { year: "2026", title: "Full-Stack Hardware Integration", desc: "Projektierung von PCB-Designs mit automatisierten CI/CD Pipelines." },
                { year: "2027", title: "Abschluss IT-Systemelektroniker", desc: "Zertifizierung & Einstieg in hochskalierbare Architekturen." }
              ].map((item, i) => (
                <div key={i} className="flex gap-8">
                    <div className="text-[#00979D] font-mono text-xl pt-1">{item.year}</div>
                    <div>
                        <h4 className="text-2xl font-bold">{item.title}</h4>
                        <p className="text-zinc-400 mt-2">{item.desc}</p>
                    </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. TECH STACK GRID */}
      <section className="py-32 px-12 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { icon: <Code />, label: "C++ / Go" },
            { icon: <Database />, label: "Docker" },
            { icon: <Cpu />, label: "FPGA" },
            { icon: <Globe />, label: "Linux" }
        ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="p-8 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
                <div className="flex justify-center mb-4 text-[#00979D]">{item.icon}</div>
                <div className="font-bold">{item.label}</div>
            </motion.div>
        ))}
      </section>

      {/* 5. RANDOM TECH TRIVIA (LÄNGE!) */}
      <section className="py-32 px-12 text-center border-t border-zinc-900">
        <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-10">// Randnotizen</h3>
        <p className="text-4xl font-light italic max-w-4xl mx-auto leading-tight">
          "Hardware-Fehler sind die einzigen Fehler, bei denen man den Geruch von verbranntem Silizium als Debugging-Tool verwendet."
        </p>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="h-[40vh] flex flex-col items-center justify-center">
        <button className="px-16 py-8 bg-[#00979D] text-white text-2xl font-black rounded-full hover:bg-white hover:text-black transition-all">
          JETZT PROJEKT STARTEN
        </button>
      </section>
    </main>
  );
}