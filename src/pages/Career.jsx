"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Award, ShieldCheck, FileCode, ExternalLink, Cpu, Server, CircuitBoard, Layers } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';
import CertificateModal from '../components/ui/CertificateModal';

export default function Career() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  const domainIcons = {
    lowLevel: <Cpu className="w-4 h-4 text-[#FFB000]" />,
    infra: <Server className="w-4 h-4 text-[#FFB000]" />,
    hardware: <CircuitBoard className="w-4 h-4 text-[#FFB000]" />,
    software: <Layers className="w-4 h-4 text-[#FFB000]" />
  };

  const getCertIcon = (idx) => {
    switch (idx) {
      case 0: return <ShieldCheck className="w-5 h-5 text-amber-500" />;
      case 1: return <FileCode className="w-5 h-5 text-red-500" />;
      case 2: return <Award className="w-5 h-5 text-blue-500" />;
      case 3: return <Award className="w-5 h-5 text-emerald-500" />;
      default: return <Award className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] overflow-x-hidden selection:bg-[#FFB000]/30 font-sans antialiased transition-colors duration-300">
      
      {/* ─── TOP NAVIGATION ─── */}
      <div className="pt-12 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t.nav.backHome.toUpperCase()}</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 hidden sm:inline tracking-wider">
          RZ.CAREER · SYSTEMS ARCHITECT
        </span>
      </div>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-24 pt-12 pb-32 flex flex-col space-y-24">
        
        {/* 1. HERO HEADER */}
        <section className="space-y-6 border-b border-zinc-200 dark:border-zinc-800/80 pb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.telemetry.status}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-zinc-950 dark:text-white">
            Richard Zuikov
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-zinc-500 dark:text-zinc-400 font-mono text-xs uppercase tracking-wider">
            <span>{t.career.role}</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>{t.telemetry.experience}</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>{t.telemetry.location}</span>
          </div>

          <p className="text-base sm:text-lg font-light leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-3xl pt-2">
            {t.career.summary}
          </p>
        </section>

        {/* 2. EDITORIAL TECHNICAL STACK DOMAINS */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-950 dark:text-white">
              {t.career.techStackTitle}
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {t.telemetry.domain.toUpperCase()} ARCHITECTURE & ACTIVE TOOLING
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(t.career.domains).map(([key, domain]) => (
              <div 
                key={key} 
                className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#121212]/50 backdrop-blur-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    {domainIcons[key] || <Cpu className="w-4 h-4 text-[#FFB000]" />}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {domain.name}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      {domain.desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {domain.items.map((item, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. VERIFIED CREDENTIALS (WITH HIGH-END INSPECTOR MODAL) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-950 dark:text-white">
                {t.career.credentialsTitle}
              </h2>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {t.career.credentialsSubtitle}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#FFB000] tracking-widest uppercase">
              // VERIFIED_PROFILES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {t.career.certificates.map((cert, idx) => (
              <div 
                key={cert.id} 
                onClick={() => setSelectedCert(cert)}
                className="group relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#121212]/50 hover:bg-zinc-100/70 dark:hover:bg-[#18181b]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                      {getCertIcon(idx)}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-[#FFB000] transition-colors leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        {cert.issuer} · {cert.date}
                      </p>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3 text-[10px] font-mono text-zinc-500">
                  <span>ID: {cert.id}</span>
                  <span className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    INSPECT ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CHRONOLOGY TIMELINE */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-950 dark:text-white">
              {t.career.chronologyTitle}
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              DUALE AUSBILDUNG · INFRASTRUKTUR · FORSCHUNG
            </p>
          </div>

          <div className="space-y-4">
            {t.career.timeline.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#121212]/50 overflow-hidden cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200" 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div className="flex items-center justify-between p-6 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="text-zinc-900 dark:text-white font-mono font-medium text-sm sm:text-base tracking-tight shrink-0">
                        {item.year}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-100 text-base font-normal">
                          {item.title}
                        </span>
                        <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider mt-0.5">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-zinc-400 dark:text-zinc-600 transition-transform duration-300 shrink-0 ml-4 ${isExpanded ? 'rotate-180 text-zinc-900 dark:text-white' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="px-6 sm:px-7 pb-6 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4 space-y-4"
                      >
                        <p>{item.desc}</p>
                        
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.tags.map((tag, tagIdx) => (
                              <span 
                                key={tagIdx} 
                                className="text-[10px] uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded text-zinc-600 dark:text-zinc-400 font-mono border border-zinc-200 dark:border-zinc-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* High-Fidelity Credential Inspector Modal */}
      <CertificateModal 
        certificate={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
      />

    </main>
  );
}