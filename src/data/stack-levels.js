// Level tags for /stack, one entry per item of career.domains in translations.js, same order.
// null renders as "not rated". Set a short honest label, e.g. 'LEARNING', 'WORKING', 'SOLID'.
export const stackLevels = {
  lowLevel: [
    null, // Modern C++ (C++17/20)
    null, // Go (Systems / Telemetry)
    null, // C / x86 & AVR ASM
    null, // Python / Automation
    null, // POSIX APIs & Syscalls
  ],
  infra: [
    null, // Linux (RHEL / Debian / Alpine)
    null, // Docker & Container Swarm
    null, // Kubernetes (k8s) / CKA
    null, // Proxmox VE Virtualization
    null, // Cisco CCNA Networking
    null, // Cloudflare Tunnels & WireGuard
  ],
  hardware: [
    null, // KiCad PCB Design (2-Layer)
    null, // AVR ATmega & ESP32 Dual-Core
    null, // SMD / THT Soldering
    null, // Oscilloscope Waveform Analysis
    null, // SPI / I2C / UART Protocols
  ],
  software: [
    null, // React & TypeScript
    null, // Tailwind CSS & SCSS
    null, // Vite & Build Tooling
    null, // REST & WebSocket Pipelines
    null, // Figma UI System Design
  ],
};
