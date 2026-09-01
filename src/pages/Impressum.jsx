"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Scale, Mail, MapPin, Copy, Check } from 'lucide-react';
import { useLanguage } from '../hooks/use-language';

// Obfuscated email component to thwart automated bot scraping while maintaining full accessibility
function ProtectedEmail() {
  const [copied, setCopied] = useState(false);
  const [emailString, setEmailString] = useState('');

  // Reassemble email in memory after mount
  useEffect(() => {
    const user = 'contact';
    const domain = 'richardzuikov.com';
    setEmailString(`${user}@${domain}`);
  }, []);

  const handleCopy = (e) => {
    e.preventDefault();
    if (!emailString) return;
    navigator.clipboard.writeText(emailString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      {emailString ? (
        <a
          href={`mailto:${emailString}`}
          className="text-zinc-900 dark:text-zinc-100 hover:text-[#FFB000] dark:hover:text-[#FFB000] font-mono text-sm transition-colors duration-200 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 hover:decoration-[#FFB000]"
        >
          {emailString}
        </a>
      ) : (
        <span className="font-mono text-zinc-500 text-sm">// decrypting...</span>
      )}

      <button
        onClick={handleCopy}
        type="button"
        title="Copy email to clipboard"
        aria-label="Copy email"
        className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

// Obfuscated Address rendering with structured markup
function ProtectedAddress() {
  return (
    <div className="font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Richard Zuikov</p>
      <p>Friedrichstraße 1</p>
      <p>24937 Flensburg</p>
      <p className="text-xs text-zinc-500 mt-1">Deutschland · Germany</p>
    </div>
  );
}

export default function Impressum() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'impressum' | 'privacy'

  const t = {
    de: {
      back: 'ZURÜCK · START',
      tag: 'RECHTLICHE HINWEISE · § 5 DDG & DSGVO',
      title: 'Impressum & Datenschutz',
      subtitle: 'Transparenz, gesetzliche Pflichtangaben (§ 5 DDG) und Datenschutzerklärung für richardzuikov.com',
      tabAll: 'Alles anzeigen',
      tabImpressum: 'Impressum (§ 5 DDG)',
      tabPrivacy: 'Datenschutz (DSGVO)',
      
      // Impressum
      secProvider: 'Angaben gemäß § 5 DDG',
      secContact: 'Kontakt',
      secEditor: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      secDisclaimer: 'Haftungsausschluss & Urheberrecht',
      
      disclaimerContent: [
        {
          title: 'Haftung für Inhalte',
          text: 'Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
        },
        {
          title: 'Haftung für Links',
          text: 'Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
        },
        {
          title: 'Urheberrecht',
          text: 'Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors bzw. Erstellers.'
        }
      ],

      // Privacy
      privacyTitle: 'Datenschutzerklärung',
      privacySummary: 'Der Schutz Ihrer Daten ist mir wichtig. Diese Website fungiert als persönliches Entwickler-Portfolio und verzichtet vollständig auf Tracking, Cookies und Drittanbieter-Marketing.',
      privacySections: [
        {
          title: '1. Datenschutz auf einen Blick (Zero-Tracker)',
          text: 'Auf dieser Website werden KEINE Tracking-Cookies, KEINE Werbenetzwerke und KEINE zustimmungspflichtigen Tracking-Tools (wie Google Analytics) eingesetzt. Es findet kein Profiling statt.'
        },
        {
          title: '2. Verantwortliche Stelle',
          text: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist:\nRichard Zuikov (Kontaktdaten und Anschrift siehe Impressum oben).'
        },
        {
          title: '3. Server-Log-Dateien & Hosting',
          text: 'Beim Aufruf dieser Website erhebt und speichert der Webserver automatisch technische Informationen in Server-Log-Dateien:\n• Browsertyp und Version\n• Verwendetes Betriebssystem\n• Referrer URL (zuvor besuchte Seite)\n• IP-Adresse / Hostname des anfragenden Rechners\n• Datum und Uhrzeit der Serveranfrage\n\nRechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technischen Stabilität, Sicherheit und fehlerfreien Bereitstellung des Dienstes).'
        },
        {
          title: '4. Kontaktaufnahme per E-Mail',
          text: 'Wenn Sie mir eine Nachricht an die angegebene E-Mail-Adresse senden, werden Ihre Angaben inklusive der Kontaktdaten zur Bearbeitung der Anfrage und für etwaige Anschlussfragen verarbeitet (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Diese Daten werden niemals ohne Ihre ausdrückliche Zustimmung an Dritte weitergegeben.'
        },
        {
          title: '5. Ihre Rechte als betroffene Person',
          text: 'Sie haben im Rahmen der DSGVO jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch (Art. 21 DSGVO). Zudem steht Ihnen ein Beschwerderecht bei der zuständigen Datenschutzaufsichtsbehörde (Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein - ULD) zu.'
        }
      ]
    },
    en: {
      back: 'BACK · HOME',
      tag: 'LEGAL NOTICE · § 5 DDG & GDPR',
      title: 'Legal Notice & Privacy',
      subtitle: 'Mandatory provider disclosure (§ 5 DDG) and privacy notice for richardzuikov.com',
      tabAll: 'Show All',
      tabImpressum: 'Legal Notice (§ 5 DDG)',
      tabPrivacy: 'Privacy Policy (GDPR)',
      
      // Impressum
      secProvider: 'Information pursuant to § 5 DDG (German Digital Services Act)',
      secContact: 'Contact',
      secEditor: 'Responsible for Content pursuant to § 18 (2) MStV',
      secDisclaimer: 'Disclaimer & Copyright',
      
      disclaimerContent: [
        {
          title: 'Liability for Content',
          text: 'As a service provider, I am responsible for my own content on these pages in accordance with general statutory law pursuant to § 7 (1) DDG. Pursuant to §§ 8 to 10 DDG, I am not obligated to monitor transmitted or stored external information or investigate circumstances indicating unlawful activity.'
        },
        {
          title: 'Liability for Links',
          text: 'This website contains links to external third-party websites over whose content I have no control. Therefore, I cannot accept liability for this external content. The respective operator of the linked pages is solely responsible.'
        },
        {
          title: 'Copyright',
          text: 'The contents and works published on these pages are governed by German copyright law. Duplication, processing, distribution, or any form of commercialization requires prior written consent of the creator.'
        }
      ],

      // Privacy
      privacyTitle: 'Privacy Policy',
      privacySummary: 'Data privacy is taken seriously. This portfolio operates on a privacy-first basis without third-party tracking, profiling, or tracking cookies.',
      privacySections: [
        {
          title: '1. Privacy at a Glance (Zero Trackers)',
          text: 'This website does NOT use tracking cookies, analytics trackers (such as Google Analytics), or behavioral profiling tools. Your visit is strictly private.'
        },
        {
          title: '2. Data Controller',
          text: 'The controller responsible for data processing on this website is:\nRichard Zuikov (see address and contact in the Legal Notice above).'
        },
        {
          title: '3. Server Log Files & Hosting',
          text: 'The hosting server automatically logs technical information when you visit this website:\n• Browser type and version\n• Operating system\n• Referrer URL\n• Host name / IP address\n• Timestamp of the request\n\nLegal basis: Art. 6 (1) (f) GDPR (legitimate interest in security and proper operation of the service).'
        },
        {
          title: '4. Contacting via Email',
          text: 'If you send an email query, your message and contact details are stored solely for processing the communication and possible follow-ups (Art. 6 (1) (b) & (f) GDPR). Information is never shared without consent.'
        },
        {
          title: '5. Your Rights under GDPR',
          text: 'You have the right to information regarding your stored data (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and objection (Art. 21 GDPR), as well as the right to lodge a complaint with a competent supervisory authority.'
        }
      ]
    }
  };

  const content = t[language] || t.de;

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 dark:bg-[#09090b] dark:text-[#f4f4f5] selection:bg-[#FFB000]/30 font-sans antialiased transition-colors duration-300">
      
      {/* ─── TOP NAVIGATION ─── */}
      <div className="pt-12 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{content.back}</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 hidden sm:inline tracking-wider">
          RZ.LEGAL // § 5 DDG
        </span>
      </div>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-12 md:px-24 pt-10 pb-24 space-y-10">
        
        {/* Header Title Section */}
        <header className="space-y-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">
            <Scale className="w-3 h-3 text-[#FFB000]" />
            <span>{content.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-zinc-950 dark:text-white">
            {content.title}
          </h1>
          <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {content.subtitle}
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-3">
            {[
              { id: 'all', label: content.tabAll },
              { id: 'impressum', label: content.tabImpressum },
              { id: 'privacy', label: content.tabPrivacy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-semibold shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-200/50 dark:border-zinc-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* ─── SECTION 1: IMPRESSUM (§ 5 DDG) ─── */}
        {(activeTab === 'all' || activeTab === 'impressum') && (
          <motion.section 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#FFB000]" />
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                {language === 'de' ? 'Impressum (§ 5 DDG)' : 'Legal Notice (§ 5 DDG)'}
              </h2>
            </div>

            {/* Grid for Provider Info & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Provider Details */}
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#121212]/70 backdrop-blur-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB000]" />
                  <span>{content.secProvider}</span>
                </div>
                <ProtectedAddress />
              </div>

              {/* Card 2: Contact & Editor Details */}
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#121212]/70 backdrop-blur-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-[#FFB000]" />
                  <span>{content.secContact}</span>
                </div>
                
                <div className="space-y-4">
                  <ProtectedEmail />
                  
                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/60">
                    <span className="text-[11px] font-mono text-zinc-500 block mb-1">
                      {content.secEditor}:
                    </span>
                    <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      Richard Zuikov (Friedrichstraße 1, 24937 Flensburg)
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Disclaimer Subsections */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {content.secDisclaimer}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {content.disclaimerContent.map((disc, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-[#121212]/40 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-1.5"
                  >
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono text-xs">
                      {disc.title}
                    </h4>
                    <p>{disc.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </motion.section>
        )}

        {/* Divider if all tabs are visible */}
        {activeTab === 'all' && (
          <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-2" />
        )}

        {/* ─── SECTION 2: DATENSCHUTZ (PRIVACY / GDPR) ─── */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <motion.section 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                {content.privacyTitle}
              </h2>
            </div>

            {/* Highlight Banner: No-Tracking */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 text-xs font-mono text-emerald-700 dark:text-emerald-300 flex items-start gap-3">
              <span className="font-bold text-sm leading-none">✓</span>
              <div>
                <span className="font-semibold block uppercase tracking-wider mb-0.5">Privacy First // Zero Tracking</span>
                {content.privacySummary}
              </div>
            </div>

            {/* Privacy Breakdown Cards */}
            <div className="space-y-4">
              {content.privacySections.map((sec, idx) => (
                <div 
                  key={idx} 
                  className="p-5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-[#121212]/40 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-2"
                >
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono text-xs">
                    {sec.title}
                  </h4>
                  <p className="whitespace-pre-line">{sec.text}</p>
                </div>
              ))}
            </div>

          </motion.section>
        )}

        {/* ─── MINIMAL PAGE FOOTER ─── */}
        <footer className="pt-12 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} RICHARD ZUIKOV · FLENSBURG, GERMANY
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              {language === 'de' ? 'KONTAKT' : 'CONTACT'}
            </Link>
            <span>·</span>
            <a href="https://github.com/Ri4ards2006" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              GITHUB
            </a>
          </div>
        </footer>

      </div>

    </main>
  );
}

