// "NOW / IN PROGRESS" (DESIGN.md §15). Facts only; anything not known yet is a TODO string,
// shown in development and hidden in production. `done`: steps finished, or null while unknown.
export const nowEntries = [
  {
    id: 'trich',
    title: 'TRICH-1',
    kicker: { de: 'Eigene CPU auf FPGA', en: 'Own CPU on FPGA' },
    lines: {
      de: 'Eine Balanced-Ternary-Plattform von der Sprache bis zur Platine: Compiler, Befehlssatz, VM in Go und ein Kern in Verilog auf einem Tang Nano 9K.',
      en: 'A balanced-ternary platform from language to board: compiler, instruction set, a VM in Go and a core in Verilog on a Tang Nano 9K.',
    },
    steps: ['Compiler', 'ISA', 'VM', 'FPGA', 'PCB'],
    done: null,
    todo: { de: 'TODO: Welche Schritte sind fertig? (Fortschrittsbalken)', en: 'TODO: Which steps are done? (progress bar)' },
  },
  {
    id: 'cluster',
    title: 'Home-Lab Cluster',
    kicker: { de: 'Infrastruktur', en: 'Infrastructure' },
    lines: {
      de: 'Proxmox VE und K3s, deployt per GitOps mit ArgoCD, erreichbar über WireGuard und Cloudflare-Tunnel.',
      en: 'Proxmox VE and K3s, deployed through GitOps with ArgoCD, reached through WireGuard and Cloudflare tunnels.',
    },
    steps: ['Proxmox', 'K3s', 'ArgoCD', 'Tunnel'],
    done: null,
    todo: { de: 'TODO: Was läuft schon, was ist offen? (Fortschrittsbalken)', en: "TODO: What already runs, what's open? (progress bar)" },
  },
  {
    id: 'apprenticeship',
    title: { de: 'Ausbildung', en: 'Apprenticeship' },
    kicker: { de: 'IT-Systemelektroniker · R2P GmbH', en: 'IT Systems Electronics Technician · R2P GmbH' },
    lines: {
      de: 'Netzwerke, Sicherheits- und Kamerasysteme, viel Außendienst. 2025 bis 2027.',
      en: 'Networks, security and camera systems, a lot of field work. 2025 to 2027.',
    },
    steps: ['2025', '2026', '2027'],
    // Years started so far, from the calendar.
    done: Math.min(3, Math.max(0, new Date().getFullYear() - 2025 + 1)) - 1,
    current: true,
    todo: { de: 'TODO: Genaue Daten für den Fortschritt (Start-/Prüfungsmonat)', en: 'TODO: Exact dates for the progress (start / exam month)' },
  },
];
