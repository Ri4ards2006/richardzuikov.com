"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Check, Copy, Calendar, Hash, Award } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';

export default function CertificateModal({ certificate, isOpen, onClose }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Close on Escape & prevent background scrolling while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyId = (e) => {
    e.stopPropagation();
    if (!certificate?.id) return;
    navigator.clipboard.writeText(certificate.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !certificate) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
      >
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] p-6 sm:p-8 shadow-2xl z-10 space-y-6 transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-5">
            <div className="space-y-1.5 pr-2">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFB000]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.telemetry.verified}</span>
              </div>
              <h3 
                id="cert-modal-title" 
                className="text-xl sm:text-2xl font-light tracking-tight text-zinc-950 dark:text-white"
              >
                {certificate.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              aria-label={t.nav.closeMenu}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Telemetry Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            
            {/* Issuer */}
            <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <Award className="w-3 h-3 text-[#FFB000]" />
                <span>{t.telemetry.issuer}</span>
              </div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                {certificate.issuer}
              </span>
            </div>

            {/* Date */}
            <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-[#FFB000]" />
                <span>{t.telemetry.issueDate}</span>
              </div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                {certificate.date}
              </span>
            </div>

            {/* Credential ID */}
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-900/40 flex items-center justify-between gap-3">
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <Hash className="w-3 h-3 text-[#FFB000]" />
                  <span>{t.telemetry.credentialId}</span>
                </div>
                <span className="text-zinc-800 dark:text-zinc-300 select-all block truncate font-mono text-xs">
                  {certificate.id}
                </span>
              </div>

              <button
                onClick={handleCopyId}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all text-[11px] font-mono shrink-0 cursor-pointer"
                title={t.telemetry.copyId}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">{t.telemetry.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.telemetry.copyId}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Validated Skills / Modules */}
          {certificate.skills && certificate.skills.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                {t.telemetry.skillsTitle}
              </span>
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-md border border-zinc-200/90 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verification Portal Action */}
          {certificate.verifyUrl && (
            <div className="pt-2">
              <a
                href={certificate.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-mono text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>{t.telemetry.verifyOnPortal}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

