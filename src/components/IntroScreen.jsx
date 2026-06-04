import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IntroScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800); // Total duration of the intro: 2.8 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[999999] bg-[#030303] flex flex-col justify-center items-center font-mono select-none"
    >
      <div className="space-y-4 text-center">
        {/* Terminal loading line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ times: [0, 0.1, 0.9, 1], duration: 1.2 }}
          className="text-zinc-600 text-xs tracking-widest"
        >
          // LOADING CORE.SYSTEM.OS.V2...
        </motion.div>

        {/* Main Title fade-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#FFB000] text-lg sm:text-2xl font-light tracking-[0.3em] uppercase"
        >
          a Richard Zuikov portfolio
        </motion.div>
      </div>
    </motion.div>
  );
}
