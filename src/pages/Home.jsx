"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import bossImg from '../assets/Me_Picture.png';
import { MacbookScroll } from "../components/ui/macbook-scroll";

export default function Home() {
  const containerRef = useRef(null);

  // MAUS-PARALLAX (Für das reaktive Grid im Hintergrund)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  // ADVANCED SCROLL TRACKING
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth Springs für die Scroll-Werte (kein Ruckeln!)
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Dynamische Dreh- und Verschiebe-Effekte generieren
  const textLeftX = useTransform(smoothProgress, [0, 0.4], [0, -300]);
  const textRightX = useTransform(smoothProgress, [0, 0.4], [0, 300]);
  const cardRotateX = useTransform(smoothProgress, [0.1, 0.4], [20, 0]);
  const cardScale = useTransform(smoothProgress, [0.1, 0.4], [0.9, 1]);
  const globalBgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);

  // NEU: Scroll-Rotation für die Trennlinie & Terminal-Skalierung
  const inverseTickerX = useTransform(smoothProgress, [0.3, 0.8], [-1000, 200]);
  const terminalSkew = useTransform(smoothProgress, [0.4, 0.7], [4, 0]);

  // Tech-Items mit Bildern für den veredelten Endlos-Ticker
  const tickerItems = [
    { text: "C++ HARDWARE LAYER", img: bossImg },
    { text: "GO / SYSTEMS", img: bossImg },
    { text: "LINUX GUARDIAN INFRA", img: bossImg },
    { text: "AVR / ARM ARCHITECTURE", img: bossImg },
    { text: "BARE METAL DEV", img: bossImg },
  ];

  return (
    <main ref={containerRef} className="w-full bg-black text-white relative overflow-x-clip min-h-screen selection:bg-[#00979D]/30">
      
      {/* MECH-GRID BACKGROUND (Maus- & Scroll-gesteuert) */}
      <motion.div 
        style={{ y: globalBgY }}
        animate={{
          x: mousePos.x * -30,
          y: mousePos.y * -30,
        }}
        transition={{ type: "smooth", stiffness: 80, damping: 20 }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_80%,transparent_100%)] pointer-events-none"
      />

      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto px-6 pt-36 pb-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Links: Avatar mit massivem Tiefen-Glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="md:col-span-5 flex justify-center md:justify-start"
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#00979D] via-purple-600 to-emerald-500 rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition duration-1000 animate-pulse" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-zinc-800/50 bg-zinc-950 shadow-[0_0_50px_rgba(0,151,157,0.1)]">
              <img 
                src={bossImg} 
                alt="Richard Zuikov" 
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 hover:scale-105 transition duration-700 ease-out"
              />
            </div>
          </div>
        </motion.div>

        {/* Rechts: Core Typo & CTAs */}
        <div className="md:col-span-7 space-y-8 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 px-4 py-1.5 rounded-full backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-[#00979D] animate-ping" />
            <span className="text-xs font-mono text-zinc-400 tracking-wider">SYSTEM STATUS: OPERATIONAL · SL 19</span>
          </motion.div>

          <div className="space-y-4 overflow-hidden">
            <motion.h1 style={{ x: textLeftX }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Richard
            </motion.h1>
            <motion.h1 style={{ x: textRightX }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-500 to-[#00979D]">
              Zuikov
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-xl font-sans max-w-xl leading-relaxed"
          >
            Low-Level Architekt, Hardware Enthusiast & <span className="text-white font-mono font-bold">// Linux Guardian.</span> Ich übersetze komplexe Hardware-Anforderungen in hochperformanten, ausfallsicheren Code.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <Link to="/career" className="px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-xs uppercase tracking-widest">
              Quest Log öffnen
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-zinc-950 border border-zinc-800 font-bold rounded-xl hover:bg-zinc-900 hover:border-zinc-700 transition duration-300 text-xs uppercase tracking-widest text-zinc-300">
              Beschwörungs-Kanal
            </Link>
          </motion.div>
        </div>
      </div>

      {/* INFINITE IMAGES & TEXT TICKER STREAM */}
      <div className="w-full bg-zinc-950/80 border-y border-zinc-900 py-6 overflow-hidden flex whitespace-nowrap select-none relative z-10">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex items-center space-x-20 pr-20"
        >
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-6">
              <span className="text-sm font-mono tracking-[0.2em] text-zinc-500 uppercase font-black">
                {item.text}
              </span>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 bg-black flex-shrink-0 grayscale contrast-120 rotate-3">
                <img src={item.img} alt="Stream Node" className="w-full h-full object-cover" />
              </div>
              <span className="text-[#00979D] font-mono font-bold text-sm">///</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* DYNAMISCHES 3D-ROTATIONS BENTO-GRID */}
      <section className="max-w-6xl mx-auto px-6 py-36 relative z-10">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-mono text-[#00979D] tracking-[0.4em] uppercase font-bold block">Specs & Expertise</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Core Architecture</h2>
        </div>

        <motion.div 
          style={{ rotateX: cardRotateX, scale: cardScale }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1200px]"
        >
          {[
            { id: "01", tag: "HARDWARE LAYER", title: "Register & Bitwise Dev", desc: "Entwicklung direkt auf Bare-Metal-Ebene. Präzise Registermanipulationen auf AVR- und ARM-Systemen ohne overheadlastige Frameworks.", color: "border-[#00979D]/30 text-[#00979D]" },
            { id: "02", tag: "SYSTEMS", title: "Go & High-Perf Systems", desc: "Skalierbare Backends und performante System-Tools in Go und C++. Maximaler Durchsatz bei minimalem Speicherverbrauch.", color: "border-purple-500/20 text-purple-400" },
            { id: "03", tag: "SECURITY", title: "Linux Core & Network", desc: "Sichere Architekturen im eigenen System-Lab. Docker-Infrastrukturen, abgeschirmt via Cloudflare Tunnels und isolierten VLANs.", color: "border-emerald-500/20 text-emerald-400" },
            { id: "04", tag: "AUTOMATION", title: "CI/CD Kernel Pipelines", desc: "Automatisierte Builds und Unit-Tests direkt für eingebettete Systeme. Jeder Commit wird hardwarenah verifiziert.", color: "border-amber-500/20 text-amber-400" },
            { id: "05", tag: "DIAGNOSTICS", title: "Logic Analyzer Tech", desc: "Fehleranalyse mittels Oszilloskop und Logic Analyzern auf Protokollebene (I2C, SPI, UART). Hardware-Debugging par excellence.", color: "border-blue-500/20 text-blue-400" },
            { id: "06", tag: "STATUS", title: "Quest Open for Co-op", desc: "Bereit für komplexe Tech-Herausforderungen. Verfügbar für zukunftsweisende Projekte in Festanstellung oder Core-Consulting.", color: "border-red-500/20 text-red-400 font-bold" },
          ].map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`bg-gradient-to-br from-[#090d11]/80 to-zinc-950/90 border ${card.color.split(' ')[0]} p-8 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm shadow-xl`}
            >
              <div className="absolute top-0 right-0 p-4 font-mono text-zinc-800 text-4xl font-black select-none group-hover:text-zinc-700 transition duration-300">
                {card.id}
              </div>
              <span className={`text-[10px] font-mono ${card.color.split(' ')[1]} block mb-2 tracking-[0.2em] font-bold`}>
                {card.tag} //
              </span>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans group-hover:text-zinc-300 transition duration-300">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* NEU: INSANE INVERSE INTERACTIVE SCROLL-BARRIER */}
      {/* Dieser Ticker schießt extrem schnell und schräg in die Gegenrichtung beim Scrollen */}
      <div className="w-full relative z-20 py-12 my-6 bg-[#00979D] rotate-2 scale-105 border-y-4 border-black overflow-hidden flex whitespace-nowrap shadow-[0_0_50px_rgba(0,151,157,0.4)]">
        <motion.div 
          style={{ x: inverseTickerX }}
          className="flex items-center space-x-24 text-black font-black text-2xl md:text-4xl tracking-tighter"
        >
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-12">
              <span>CRITICAL KERNEL ACCESS</span>
              <div className="w-12 h-12 bg-black rounded-lg p-1 invert rotate-12 shadow-lg">
                <img src={bossImg} alt="Divider Node" className="w-full h-full object-cover rounded" />
              </div>
              <span>BARE METAL ONLY</span>
              <span className="text-white">✕</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* NEU: HARDCORE INTERACTIVE TERMINAL ENGINE */}
      {/* Ein fetter Beschreibungspunkt im Agency-Stil mit Live-Code-Vibe */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <motion.div 
          style={{ skewY: terminalSkew }}
          className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 md:p-10 font-mono shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <div className="text-xs text-zinc-500">richard@guardian-core:~</div>
            <div className="text-xs text-[#00979D] bg-[#00979D]/10 px-2 py-0.5 rounded">v2.4.16-stable</div>
          </div>

          {/* Terminal Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-sm md:text-base">
              <div className="text-zinc-500"># Initializing strategic protocol...</div>
              <div>
                <span className="text-emerald-400">➜ </span>
                <span className="text-zinc-200 font-bold">cat profile_statement.sh</span>
              </div>
              <p className="text-zinc-300 font-sans leading-relaxed text-base md:text-lg border-l-2 border-[#00979D] pl-4 py-1">
                "Ich bin kein Dev, der nur bunte Buttons verschiebt. Ich arbeite da, wo Fehler teuer werden. Wenn die Hardware streikt, der Stack overflowed oder Datenpakete im Nirgendwo versinken, fängt mein Job erst an."
              </p>
              <div className="text-zinc-500 pt-2">// Core-Vorteile für dein Team:</div>
              <ul className="space-y-1 text-zinc-400 text-xs md:text-sm">
                <li><span className="text-[#00979D]">✔</span> 100% Souveränität über den Linux-Netzwerk-Stack</li>
                <li><span className="text-[#00979D]">✔</span> Keine Angst vor rohen Pointern und Speichermanagement</li>
                <li><span className="text-[#00979D]">✔</span> Codebasen, die auf Performance getrimmt sind</li>
              </ul>
            </div>

            {/* Rechte grafische Spalte im Terminal */}
            <div className="md:col-span-5 border border-zinc-900 bg-zinc-900/20 rounded-xl p-6 text-center space-y-4 relative group-hover:border-zinc-800 transition duration-300">
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Infratructure Node</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00979D]">99.9%</div>
              <div className="text-[11px] text-zinc-400 font-sans leading-tight">
                Garantierte Uptime durch hardened Bare-Metal Environments und kompromisslose Architekturen.
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "99.9%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#00979D] to-emerald-400"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HIGHLIGHT SECTION: ACETERNITY MACBOOK SCROLL */}
      <div className="w-full relative z-10 bg-black pt-12">
        <MacbookScroll 
          title={
            <div className="space-y-3 px-4">
              <span className="font-mono text-xs md:text-sm tracking-[0.4em] text-[#00979D] uppercase block font-black">
                Deploying Solutions · Engineering Systems
              </span>
              <h2 className="font-sans text-3xl md:text-6xl font-black text-white tracking-tighter uppercase max-w-4xl mx-auto leading-none">
                Vom Register bis zur Cloud. <br />
                <span className="text-zinc-600">Ich schmiede die Infrastruktur.</span>
              </h2>
            </div>
          }
          src={bossImg} 
          badge={
            <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-5 py-2 rounded-full font-mono text-xs font-black tracking-widest shadow-xl shadow-red-600/20 uppercase">
              Soul Lvl 19
            </div>
          }
        />
      </div>

    </main>
  );
}