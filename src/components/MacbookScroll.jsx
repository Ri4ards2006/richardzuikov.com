import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const MacbookScroll = ({ src, title, badge }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // Hier berechnen wir die 3D-Kipp-Animation beim Scrollen
  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, 1]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [1.2, 1]);
  const translateZ = useTransform(scrollYProgress, [0, 0.3], [0, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [45, 0]);

  return (
    <div ref={containerRef} className="macbook-container">
      <div className="macbook-sticky">
        {title && <div className="macbook-title">{title}</div>}
        
        <div className="macbook-3d-wrap">
          <motion.div
            style={{
              scaleX: scaleX,
              scaleY: scaleY,
              rotateX: rotateX,
              translateZ: translateZ,
              transformStyle: "preserve-3d",
            }}
            className="macbook-body-mock"
          >
            {/* Bildschirm / Screen */}
            <div className="macbook-screen">
              {src ? (
                <img src={src} alt="Screen Content" className="macbook-img" />
              ) : (
                <div className="macbook-screen-placeholder">
                  <span>richard@archlinux:~# ready to debug</span>
                </div>
              )}
            </div>

            {/* Tastatur-Basis (Sehr vereinfacht ohne Tailwind-Massen) */}
            <div className="macbook-keyboard-base">
              <div className="keyboard-grid">
                {/* Eine kleine optische Andeutung der Tastatur */}
                <div className="key-row fn-keys"><span>esc</span><span>F1</span><span>F2</span><span>F3</span><span>F4</span><span>F5</span></div>
                <div className="key-row"><span>Q</span><span>W</span><span>E</span><span>R</span><span>T</span><span>Y</span></div>
                <div className="key-row"><span>A</span><span>S</span><span>D</span><span>F</span><span>G</span><span>H</span></div>
                <div className="key-row"><span>Z</span><span>X</span><span>C</span><span>V</span><span>B</span><span>N</span></div>
              </div>
              <div className="trackpad"></div>
            </div>
          </motion.div>
        </div>

        {badge && <div className="macbook-badge">{badge}</div>}
      </div>
    </div>
  );
};