import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d1117] border-t border-zinc-800/60 mt-auto pt-16 pb-8 px-6 md:px-12 font-sans text-zinc-400">
      <div className="max-w-6xl mx-auto">
        
        {/* Haupt-Grid-System */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/40">
          
          {/* Brand-Block (Nimmt 4 von 12 Spalten ein) */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00979D] shadow-[0_0_8px_#00979D]" />
              <span className="text-white text-base font-bold tracking-tight">
                Richard Zuikov
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Low-Level Architekt & Embedded Systems Engineer. Spezialisiert auf hardwarenahe Entwicklung, Signal-Analyse und modulare IoT-Infrastrukturen.
            </p>
            
            {/* Social Icons / Quick Connect */}
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://github.com/Ri4ards2006" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white transition-colors"
                title="GitHub"
              >
                <GitHubIcon />
              </a>
              <a 
                href="https://linkedin.com/in/dein-profil" // TODO: Deinen LinkedIn Link einfügen!
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-[#0077b5] transition-colors"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a 
                href="mailto:deine.email@domain.com" // TODO: Deine E-Mail einfügen!
                className="hover:text-[#00979D] transition-colors"
                title="E-Mail"
              >
                <EmailIcon />
              </a>
            </div>
          </div>

          {/* Spacer für optische Balance (2 Spalten frei) */}
          <div className="hidden md:block md:col-span-2" />

          {/* Links-Sektionen (3 Spalten à 2 Grid-Einheiten) */}
          
          {/* Spalte 1: Navigation */}
          <div className="md:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Sitemap
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/career" className="hover:text-white transition-colors">Career</Link></li>
              <li><Link to="/lab" className="hover:text-white transition-colors">Lab / Projects</Link></li>
              <li><Link to="/dev" className="hover:text-white transition-colors">Dev Hub</Link></li>
            </ul>
          </div>

          {/* Spalte 2: Tech Stacks */}
          <div className="md:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Core Tech
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="hover:text-zinc-400 transition-colors cursor-default">C++ / Register-Level</li>
              <li className="hover:text-zinc-400 transition-colors cursor-default">Go / Systems</li>
              <li className="hover:text-zinc-400 transition-colors cursor-default">AVR / ARM Architectures</li>
              <li className="hover:text-zinc-400 transition-colors cursor-default">Docker / Linux Infra</li>
            </ul>
          </div>

          {/* Spalte 3: Professional / Status */}
          <div className="md:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Status
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for Co-op</span>
              </li>
              <li>
                <a 
                  href="https://github.com/Ri4ards2006?tab=repositories" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  All Repositories <span className="text-xs">↗</span>
                </a>
              </li>
              <li className="text-xs text-zinc-500 font-mono pt-1">
                RZ 20 · Level 20
              </li>
            </ul>
          </div>

        </div>

        {/* Untere Bar: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-zinc-500 font-mono space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} Richard Zuikov. Built with Vite & React.
          </div>
          <div className="flex space-x-6">
            <span className="text-zinc-600">Environment: Production</span>
            <span className="text-zinc-600">Ugreen NAS Hosted</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

// ==========================================
// Strukturierte SVG Icons (Keine Pakete nötig)
// ==========================================

const GitHubIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.058.069-.058 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);