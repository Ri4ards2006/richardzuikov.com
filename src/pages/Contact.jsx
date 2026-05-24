"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const socialLinks = [
    { label: "GITHUB", value: "Ri4ards2006", href: "https://github.com/Ri4ards2006" },
    { label: "LINKEDIN", value: "Richard Zuikov", href: "https://www.linkedin.com/in/richard-zuikov-526745343" },
    { label: "EMAIL", value: "contact@richardzuikov.com", href: "mailto:contact@richardzuikov.com" },
    { label: "LINE", value: "+49 171 ( email me ..)", href: "tel:+4915168102377" }
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-4 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Minimalistischer Header */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16"
        >
          LET'S <span className="text-[#00979D]">ENGINEER.</span>
        </motion.h1>

        {/* Das Terminal Interface */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 font-mono shadow-2xl">
          <div className="flex items-center gap-2 mb-10 border-b border-zinc-900 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-zinc-500">terminal@richard-arch-lab:~$ connection_init</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {socialLinks.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-[#00979D] text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                <a 
                  href={item.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-lg md:text-xl font-bold text-white hover:text-[#00979D] transition-colors"
                >
                  {item.value}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-zinc-600 font-mono text-xs uppercase tracking-[0.2em] text-center">
          Available for technical co-op · Engineering base: Flensburg
        </div>
      </div>
    </main>
  );
}