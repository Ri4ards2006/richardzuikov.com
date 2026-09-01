"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, Terminal, Zap, BookOpen, GitBranch, ArrowLeft, Layers, Compass } from 'lucide-react';
import Carousel from "../components/ui/carousel"; 
import { useLanguage } from '../hooks/use-language';

// Hardware assets
import bossImg from "../assets/Me_Picture.png";
import solderingStationImg from "../assets/Home_Soldering_Station.jpeg";
import homeLabImg from "../assets/Home_Lab.jpeg";
import trafficSystemImg from "../assets/Traffic_System.jpg";

// Lifestyle / engagement assets
import imgChina from "../assets/Me_China.jpg";
import imgDenmark from "../assets/Me_Denmark.jpg";
import imgFirefighter from "../assets/Me_Firefighter.png";
import imgGym from "../assets/Me_Gym.jpg";
import imgKorea from "../assets/Me_Korea.jpg";
import imgMuseum from "../assets/Me_Museum.jpg";
import imgUzbekistan from "../assets/Me_Uzbekistan.jpg";
import imgSundown from "../assets/Mu_Sundown.jpg";

export default function About() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const insightIcons = [
    <Cpu className="w-5 h-5 text-[#FFB000]" />,
    <GitBranch className="w-5 h-5 text-[#FFB000]" />,
    <Terminal className="w-5 h-5 text-[#FFB000]" />,
    <BookOpen className="w-5 h-5 text-[#FFB000]" />
  ];

  const handleSlideButtonClick = (slide) => {
    if (slide.link) {
      navigate(slide.link);
    }
  };

  return (
    <main ref={containerRef} className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] selection:bg-[#FFB000]/30 font-sans antialiased transition-colors duration-300">
      
      {/* Top Scroll Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FFB000] origin-left z-[999]" style={{ scaleX }} />

      {/* ─── TOP NAVIGATION ─── */}
      <div className="pt-12 px-6 sm:px-12 md:px-24 max-w-6xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t.nav.backHome.toUpperCase()}</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 hidden sm:inline tracking-wider">
          RZ.PROFILE · BIOGRAPHY
        </span>
      </div>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="min-h-[80vh] flex items-center justify-center pt-16 pb-24 px-6 sm:px-12 md:px-24 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#FFB000]/20 to-zinc-800/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <img 
              src={bossImg} 
              alt="Richard Zuikov" 
              className="relative z-10 rounded-2xl grayscale hover:grayscale-0 transition duration-700 w-full max-w-md object-cover shadow-xl border border-zinc-200 dark:border-zinc-800" 
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">
              <span>{t.about.tag.toUpperCase()}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extralight uppercase tracking-tight text-zinc-950 dark:text-white">
              Richard<br />Zuikov
            </h1>

            <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
              {t.about.headline}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {t.about.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. SYSTEM INSIGHTS & LOGBOOK ─── */}
      <section className="py-24 px-6 sm:px-12 md:px-24 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="space-y-12">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-950 dark:text-white">
              {t.about.insightsTitle}
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              ARCHITECTURAL FOCUS & HARDWARE OBSERVATIONS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.about.logEntries.map((entry, idx) => (
              <div 
                key={idx} 
                className="p-7 bg-zinc-50/50 dark:bg-[#121212]/50 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300 space-y-4"
              >
                <div className="p-2 w-fit rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  {insightIcons[idx]}
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  {entry.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-mono">
                  {entry.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. WORKBENCH CAROUSEL ─── */}
      <section className="py-24 px-6 sm:px-12 md:px-24 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="text-center md:text-left mb-12 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-950 dark:text-white">
            {t.about.workbenchTitle}
          </h2>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {t.about.workbenchSubtitle}
          </p>
        </div>

        <Carousel 
          slides={[
            { title: language === 'de' ? "Lötplatz & Messgeräte" : "Electronics Workbench", src: solderingStationImg },
            { title: language === 'de' ? "Server Rack Array" : "Server Rack Array", src: homeLabImg },
            { title: language === 'de' ? "RTOS Verkehrssteuerung" : "RTOS Traffic Control", src: trafficSystemImg, button: language === 'de' ? "Labor öffnen" : "Open Lab", link: "/lab" }
          ]} 
          onSlideButtonClick={handleSlideButtonClick}
        />
      </section>

      {/* ─── 4. PHILOSOPHY ─── */}
      <section className="py-24 px-6 sm:px-12 md:px-24 max-w-4xl mx-auto border-b border-zinc-200 dark:border-zinc-800/80 space-y-8">
        <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-950 dark:text-white">
          {t.about.philosophyTitle}
        </h2>
        
        <blockquote className="text-xl sm:text-2xl text-zinc-700 dark:text-zinc-300 font-light italic leading-relaxed border-l-2 border-[#FFB000] pl-6">
          {t.about.philosophyQuote}
        </blockquote>

        <div className="p-6 bg-zinc-50/70 dark:bg-[#121212]/70 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl">
          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t.about.statusNote}
          </p>
        </div>
      </section>

      {/* ─── 5. ORIGIN & BIOGRAPHY ─── */}
      <section className="py-24 px-6 sm:px-12 md:px-24 max-w-4xl mx-auto border-b border-zinc-200 dark:border-zinc-800/80 space-y-12">
        <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-950 dark:text-white">
          {t.about.originTitle}
        </h2>
        
        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#FFB000] shrink-0 mt-1">
              <Zap size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {t.about.originRootsTitle}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                {t.about.originRootsDesc}
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#FFB000] shrink-0 mt-1">
              <Cpu size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {t.about.originHardwareTitle}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                {t.about.originHardwareDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          {t.about.quickFacts.map((fact, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-1">
              <div className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
                {fact.label}
              </div>
              <div className="text-sm sm:text-base font-medium text-zinc-900 dark:text-white">
                {fact.val}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. LIFE BEYOND CONSOLE (TRAVELS & ENGAGEMENTS) ─── */}
      <section className="py-24 px-6 sm:px-12 md:px-24 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800/80 space-y-12">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-zinc-950 dark:text-white">
            {t.about.travelTitle}
          </h2>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {t.about.travelSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { src: imgFirefighter, label: { de: "Feuerwehr Ehrenamt", en: "Volunteer Firefighter" } },
            { src: imgKorea, label: { de: "Reise nach Südkorea", en: "Travel in South Korea" } },
            { src: imgChina, label: { de: "Reise nach China", en: "Travel in China" } },
            { src: imgDenmark, label: { de: "Reise nach Dänemark", en: "Travel in Denmark" } },
            { src: imgUzbekistan, label: { de: "Reise nach Usbekistan", en: "Travel in Uzbekistan" } },
            { src: imgGym, label: { de: "Ausgleich im Gym", en: "Workout / Gym" } },
            { src: imgMuseum, label: { de: "Museum & Geschichte", en: "Museum & History" } },
            { src: imgSundown, label: { de: "Sonnenuntergang", en: "Sundown Moment" } }
          ].map((pic, idx) => (
            <div 
              key={idx} 
              className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#121212]/40 p-2 transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm"
            >
              <div className="overflow-hidden rounded-lg aspect-[4/3] relative bg-zinc-100 dark:bg-zinc-900">
                <img 
                  src={pic.src} 
                  alt={pic.label[language] || pic.label.de} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                />
              </div>
              <div className="mt-2.5 px-1 py-0.5">
                <span className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 block truncate">
                  {pic.label[language] || pic.label.de}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. CALL TO ACTION ─── */}
      <section className="py-24 px-6 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-950 dark:text-white">
          {t.about.ctaTitle}
        </h2>
        <div>
          <button 
            onClick={() => navigate('/contact')}
            className="px-10 py-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-xs font-semibold rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all uppercase tracking-widest cursor-pointer shadow-lg"
          >
            {t.about.ctaButton}
          </button>
        </div>
      </section>

    </main>
  );
}