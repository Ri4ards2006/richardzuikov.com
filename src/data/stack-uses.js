// "Used for / where" tags for /stack, one entry per item of career.domains in translations.js, same order.
// Only project or certificate names documented elsewhere on the site. null = no source yet (see the TODO key).
export const stackUses = {
  lowLevel: [
    ['AD-LED Clock', 'Traffic Light System', 'Weather Station 2.0'], // Modern C++
    ['GO-CORE-LAB'], // Go
    null, // C / x86 & AVR ASM
    ['Google IT Automation'], // Python / Automation
    null, // POSIX APIs & Syscalls
  ],
  infra: [
    ['Home Lab'], // Linux
    ['Home Lab'], // Docker & Container Swarm
    ['CKA'], // Kubernetes
    ['Home Lab'], // Proxmox VE
    ['CCNA'], // Cisco CCNA
    ['Home Lab'], // Cloudflare Tunnels & WireGuard
  ],
  hardware: [
    ['AD-LED Clock'], // KiCad PCB Design
    ['AD-LED Clock', 'Weather Station 2.0'], // AVR ATmega & ESP32
    ['Hardware Lab'], // SMD / THT Soldering
    ['Hardware Lab'], // Oscilloscope
    ['GO-CORE-LAB'], // SPI / I2C / UART
  ],
  software: [
    ['Rack Configurator'], // React & TypeScript
    ['richardzuikov.com'], // Tailwind CSS & SCSS
    ['richardzuikov.com'], // Vite & Build Tooling
    null, // REST & WebSocket
    null, // Figma
  ],
};
