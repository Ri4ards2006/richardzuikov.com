"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Cpu, Terminal, Zap, Anchor, BookOpen, GitBranch } from 'lucide-react';
import Carousel from "../components/ui/carousel"; 
import bossImg from "../assets/Me_Picture.png";

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const logEntries = [
    { title: "Register Level Thinking", icon: <Cpu />, desc: "Warum ich Abstraktionen hasse, wenn man sie selbst schreiben kann." },
    { title: "Architektur-Struggle", icon: <GitBranch />, desc: "Die Herausforderung, Hardware & Software synchron zu halten." },
    { title: "Warum C++ & Go?", icon: <Terminal />, desc: "Der Konflikt zwischen maximaler Kontrolle und moderner Skalierbarkeit." },
    { title: "Lab-Philosophie", icon: <BookOpen />, desc: "Mein Weg zum IT-Systemelektroniker bis 2027." }
  ];

  return (
    <main ref={containerRef} className="bg-black text-white selection:bg-[#00979D]">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#00979D] origin-left z-[999]" style={{ scaleX }} />

      {/* 1. HERO: Fokus auf DICH */}
      <section className="min-h-[90vh] flex items-center justify-center pt-32 px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00979D] to-zinc-800 rounded-3xl blur opacity-20 group-hover:opacity-40 transition" />
            <img src={bossImg} alt="Richard Zuikov" className="relative z-10 rounded-2xl grayscale hover:grayscale-0 transition duration-700" />
          </div>
          <div className="space-y-6">
            <span className="text-[#00979D] font-mono text-sm tracking-widest">// ABOUT ME</span>
            <h1 className="text-6xl font-black uppercase">Richard Zuikov</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Ich bin nicht nur hier, um zu programmieren. Ich bin hier, um zu verstehen, wie das, 
              was wir benutzen, eigentlich existiert. Vom Transistor-Gate bis zum Kernel-Space.
            </p>
            <div className="flex gap-4 pt-4">
              {['Lötkolben-Enthusiast', 'Kernel-Interessiert', 'Home-Lab Betreiber'].map(tag => (
                <span key={tag} className="px-3 py-1 border border-zinc-800 rounded-md text-xs text-zinc-500 font-mono">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOGBUCH STATT PROJEKTE */}
      <section className="py-32 px-12 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-16">// Aktuelle Gedanken & Tech-Insights</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logEntries.map((entry, i) => (
              <div key={i} className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition">
                <div className="text-[#00979D] mb-6">{entry.icon}</div>
                <h4 className="text-xl font-bold mb-4">{entry.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{entry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WORKBENCH CAROUSEL (Visuelles Setup) */}
      <section className="py-32">
         <div className="text-center mb-16">
            <h3 className="text-3xl font-bold uppercase tracking-widest mb-4">// Mein "Meta" Setup</h3>
            <p className="text-zinc-600">Ein Blick auf die Dinge, die meinen Alltag prägen.</p>
         </div>
         <Carousel slides={[
            { title: "Workbench Chaos", src: bossImg, button: "Details" },
            { title: "Server Rack", src: bossImg, button: "Details" },
            { title: "Deep Focus Mode", src: bossImg, button: "Details" }
         ]} />
      </section>

      {/* 4. METAL MINDSET (Philosophie) */}
      <section className="py-32 px-12 max-w-4xl mx-auto border-t border-zinc-900">
         <h3 className="text-5xl font-black mb-10">// Das Ziel für 2027</h3>
         <p className="text-2xl text-zinc-400 font-light italic">
           "Ich will nicht nur ein IT-Systemelektroniker sein. Ich will die Schnittstelle beherrschen, 
           an der die digitale Illusion auf die physische Realität trifft."
         </p>
         <div className="mt-12 p-8 bg-[#00979D]/5 border border-[#00979D]/20 rounded-2xl">
            <p className="text-[#00979D] font-mono">
              // Aktueller Status: Ausbildungsphase <br/>
              // Fokus: Systemarchitektur & Hardware-Integration <br/>
              // Motto: Keep it low, keep it fast.
            </p>
         </div>
      </section>


{/* 5. ORIGIN STORY & BIO (Unten angehängt) */}
      <section className="py-32 px-12 bg-zinc-900/10 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto space-y-12">
          <h3 className="text-4xl font-bold">// Mein Werdegang</h3>
          
          <div className="flex gap-8 items-start">
            <div className="mt-2 text-[#00979D]">
              <Zap size={32} />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Die Informatik-Wurzeln</h4>
              <p className="text-zinc-400 leading-relaxed">
                Alles begann vor Jahren mit reiner Informatik – Logik, Algorithmen und die Welt des Codes. 
                Doch schnell wurde mir klar: Software ist nur die halbe Miete. Ich wollte verstehen, 
                was unter der Haube passiert, wie Strom in logische Zustände übersetzt wird.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            <div className="mt-2 text-[#00979D]">
              <Cpu size={32} />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Der Pivot zur Hardware</h4>
              <p className="text-zinc-400 leading-relaxed">
                Der Weg zum IT-Systemelektroniker war für mich kein Zufall, sondern die Konsequenz 
                meines Drangs nach Kontrolle. Mit 20 Jahren habe ich nun das Ziel vor Augen: 
                Abschluss 2027. Bis dahin ist mein Lab mein Klassenzimmer.
              </p>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-zinc-800">
            {[
              { label: "Alter", val: "20 Jahre" },
              { label: "Fokus", val: "System-Integration" },
              { label: "Ziel", val: "Abschluss 2027" },
              { label: "Mentalität", val: "Hard- & Software" }
            ].map((fact, i) => (
              <div key={i} className="space-y-1">
                <div className="text-zinc-500 text-xs uppercase tracking-widest">{fact.label}</div>
                <div className="text-xl font-bold text-white">{fact.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="h-[30vh] flex flex-col items-center justify-center border-t border-zinc-900">
        <h3 className="text-2xl font-bold mb-6">Lass uns was bauen.</h3>
        <button className="px-12 py-4 bg-[#00979D] text-white font-bold rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm">
          Kontakt aufnehmen
        </button>
      </section>


      <footer className="py-20 text-center border-t border-zinc-900">
         <button className="text-zinc-500 hover:text-white transition">Nachricht hinterlassen?</button>
      </footer>
    </main>
  );
}
