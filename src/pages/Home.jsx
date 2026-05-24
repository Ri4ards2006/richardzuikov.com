"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import bossImg from "../assets/Me_Picture.png";
import { MacbookScroll } from "../components/ui/macbook-scroll";
// Globe3D ist auskommentiert, damit die Seite lädt:
// import { Globe3D } from "../components/ui/3d-globe.jsx"; 

export default function Home() {
  const containerRef = useRef(null);

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

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const textLeftX = useTransform(smoothProgress, [0, 0.3], [0, -300]);
  const textRightX = useTransform(smoothProgress, [0, 0.3], [0, 300]);
  const cardRotateX = useTransform(smoothProgress, [0.05, 0.3], [20, 0]);
  const cardScale = useTransform(smoothProgress, [0.05, 0.3], [0.9, 1]);
  const globalBgY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const inverseTickerX = useTransform(smoothProgress, [0.2, 0.6], [-1000, 200]);
  const terminalSkew = useTransform(smoothProgress, [0.3, 0.6], [4, 0]);

const tickerItems = [
  { text: "REGISTER-LEVEL C++", img: bossImg },
  { text: "KERNEL-SPACE DEVELOPMENT", img: bossImg },
  { text: "SYSTEMS PROGRAMMING (GO)", img: bossImg },
  { text: "AVR / ARM FIRMWARE", img: bossImg },
  { text: "BARE-METAL ARCHITECTURE", img: bossImg },
];

  const showcaseImages = [bossImg, bossImg, bossImg, bossImg, bossImg];

  return (
    <main ref={containerRef} className="w-full bg-black text-white relative overflow-x-clip min-h-screen selection:bg-[#00979D]/30">
      <motion.div 
        style={{ y: globalBgY }}
        animate={{ x: mousePos.x * -30, y: mousePos.y * -30 }}
        transition={{ type: "smooth", stiffness: 80, damping: 20 }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_80%,transparent_100%)] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6 pt-36 pb-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 50, damping: 15 }} className="md:col-span-5 flex justify-center md:justify-start">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#00979D] via-purple-600 to-emerald-500 rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition duration-1000 animate-pulse" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-zinc-800/50 bg-zinc-950 shadow-[0_0_50px_rgba(0,151,157,0.1)]">
              <img src={bossImg} alt="Richard" className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 hover:scale-105 transition duration-700 ease-out" />
            </div>
          </div>
        </motion.div>

        <div className="md:col-span-7 space-y-8 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 px-4 py-1.5 rounded-full backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#00979D] animate-ping" />
            <span className="text-xs font-mono text-zinc-400 tracking-wider">SYSTEM STATUS: OPERATIONAL · RZ 20</span>
          </div>
          <div className="space-y-4 overflow-hidden">
            <motion.h1 style={{ x: textLeftX }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">Richard</motion.h1>
            <motion.h1 style={{ x: textRightX }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-500 to-[#00979D]">Zuikov</motion.h1>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-zinc-400 text-lg md:text-xl font-sans max-w-xl leading-relaxed">
            Low-Level Architekt, Hardware Enthusiast & <span className="text-white font-mono font-bold">// System Engineer</span>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/career" className="px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-xs uppercase tracking-widest">Quest Log öffnen</Link>
          </motion.div>
        </div>
      </div>

      <div className="w-full bg-zinc-950/80 border-y border-zinc-900 py-6 overflow-hidden flex whitespace-nowrap select-none relative z-10">
        <motion.div animate={{ x: [0, -2000] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }} className="flex items-center space-x-20 pr-20">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-6">
              <span className="text-sm font-mono tracking-[0.2em] text-zinc-500 uppercase font-black">{item.text}</span>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 bg-black flex-shrink-0 grayscale contrast-120 rotate-3"><img src={item.img} alt="Node" className="w-full h-full object-cover" /></div>
              <span className="text-[#00979D] font-mono font-bold text-sm">///</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-36 relative z-10">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-mono text-[#00979D] tracking-[0.4em] uppercase font-bold block">Specs & Expertise</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Core Architecture</h2>
        </div>
        <motion.div style={{ rotateX: cardRotateX, scale: cardScale }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1200px]">
          {[
            { id: "01", tag: "HARDWARE LAYER", title: "Register & Bitwise Dev", desc: "Entwicklung direkt auf Bare-Metal-Ebene.", color: "border-[#00979D]/30 text-[#00979D]" },
            { id: "02", tag: "SYSTEMS", title: "Go & High-Perf Systems", desc: "Skalierbare Backends und performante System-Tools.", color: "border-purple-500/20 text-purple-400" },
            { id: "03", tag: "SECURITY", title: "Linux Core & Network", desc: "Sichere Architekturen im eigenen System-Lab.", color: "border-emerald-500/20 text-emerald-400" },
            { id: "04", tag: "AUTOMATION", title: "CI/CD Kernel Pipelines", desc: "Automatisierte Builds und Unit-Tests.", color: "border-amber-500/20 text-amber-400" },
            { id: "05", tag: "DIAGNOSTICS", title: "Logic Analyzer Tech", desc: "Fehleranalyse mittels Oszilloskop.", color: "border-blue-500/20 text-blue-400" },
            { id: "06", tag: "STATUS", title: "Quest Open for Co-op", desc: "Bereit für komplexe Tech-Herausforderungen.", color: "border-red-500/20 text-red-400 font-bold" },
          ].map((card) => (
            <div key={card.id} className={`bg-gradient-to-br from-[#090d11]/80 to-zinc-950/90 border ${card.color.split(' ')[0]} p-8 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm shadow-xl`}>
              <div className="absolute top-0 right-0 p-4 font-mono text-zinc-800 text-4xl font-black select-none">{card.id}</div>
              <span className={`text-[10px] font-mono ${card.color.split(' ')[1]} block mb-2 tracking-[0.2em] font-bold`}>{card.tag} //</span>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <div className="w-full relative z-20 py-12 my-6 bg-[#00979D] rotate-2 scale-105 border-y-4 border-black overflow-hidden flex whitespace-nowrap">
        <motion.div style={{ x: inverseTickerX }} className="flex items-center space-x-24 text-black font-black text-2xl md:text-4xl tracking-tighter">
          <span>CRITICAL KERNEL ACCESS</span> <span>BARE METAL ONLY</span> <span>SYSTEM ONLINE</span>
        </motion.div>
      </div>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <motion.div style={{ skewY: terminalSkew }} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 md:p-10 font-mono shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <div className="flex space-x-2"><div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-amber-500/70" /><div className="w-3 h-3 rounded-full bg-emerald-500/70" /></div>
            <div className="text-xs text-zinc-500">richard@guardian-core:~</div>
          </div>
          <p className="text-zinc-300 font-sans leading-relaxed text-base md:text-lg border-l-2 border-[#00979D] pl-4">"Ich bin kein Dev, der nur Buttons verschiebt. Ich arbeite da, wo Fehler teuer werden."</p>
        </motion.div>
      </section>

      <div className="w-full relative z-10 bg-black pt-12">
        <MacbookScroll title={<h2 className="text-3xl font-black text-white">Coding with my Pure Heart</h2>} src={bossImg} />
      </div>






      <section className="w-full bg-zinc-950 border-t border-zinc-900 py-32 relative overflow-hidden">
  {/* Subtile Grid-Linien für den Engineering-Vibe */}
  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
  
  <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
    
    {/* Links: Die Message */}
    <div className="lg:col-span-5 space-y-6">
      <span className="text-[#00979D] font-mono tracking-widest uppercase text-xs">// Infrastructure_Forge</span>
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
        Baltic Roots.<br />
        <span className="text-[#00979D]">German Engineering.</span>
      </h2>
      <p className="text-zinc-400 leading-relaxed text-lg">
        Mein Setup ist kein Standard-Hosting. Auf dem Ugreen-NAS laufen dedizierte Container-Umgebungen, 
        die meine Hardware-Projekte und CI/CD-Pipelines autark steuern.
      </p>
    </div>

    {/* Rechts: Die Live-Infrastructure-Visualisierung */}
    <div className="lg:col-span-7 grid grid-cols-2 gap-4">
      {/* Box 1: Hardware-Stack */}
      <div className="p-6 bg-black border border-zinc-800 rounded-2xl space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
          <span>SERVER_NODE_01</span>
          <span className="text-emerald-500">ONLINE</span>
        </div>
        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className="w-[14%] h-full bg-[#00979D]"></div>
        </div>
        <p className="text-xs text-zinc-300 font-mono">Ugreen NAS / Docker Cluster</p>
      </div>

      {/* Box 2: Network-Stack */}
      <div className="p-6 bg-black border border-zinc-800 rounded-2xl space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
          <span>VPN_GATEWAY</span>
          <span className="text-emerald-500">ACTIVE</span>
        </div>
        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className="w-[42%] h-full bg-[#00979D]"></div>
        </div>
        <p className="text-xs text-zinc-300 font-mono">Cloudflare / WireGuard</p>
      </div>

      {/* Box 3: Lab-Status (Full-Width) */}
      <div className="col-span-2 p-8 bg-black border border-[#00979D]/30 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="font-bold text-lg">Lab Performance</h4>
          <p className="text-zinc-500 text-sm font-mono">Status: Bare-Metal ready</p>
        </div>
        <div className="text-right font-mono text-[#00979D]">
          <span className="text-4xl font-black">99.9</span>
          <span className="text-sm">% Uptime</span>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}