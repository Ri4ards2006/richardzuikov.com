import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../utils/cn";


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

  // Flüssige 3D-Drehung beim Runterscrollen
  const scaleX = useTransform(scrollYProgress, [0, 0.4], [1.1, 1]);
  const scaleY = useTransform(scrollYProgress, [0, 0.4], [1.1, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [55, 0]);

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
              transformStyle: "preserve-3d",
            }}
            className="macbook-body-mock"
          >
            {/* Der eigentliche Laptop-Bildschirm */}
            <div className="macbook-screen">
              <div className="macbook-screen-content">
                {src ? (
                  <img src={src} alt="Screen Content" className="macbook-img" />
                ) : (
                  <div className="macbook-screen-placeholder">
                    <span>richard@archlinux:~# ready to debug</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tastatur-Unterseite */}
            <div className="macbook-keyboard-base">
              <div className="keyboard-inner-wrap">
                <div className="keyboard-grid-mock">
                  <div className="key-line"></div>
                  <div className="key-line"></div>
                  <div className="key-line"></div>
                </div>
                <div className="trackpad-mock"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {badge && <div className="macbook-badge">{badge}</div>}
      </div>
    </div>
  );
};