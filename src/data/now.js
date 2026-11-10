// "NOW / IN PROGRESS" (DESIGN.md §15; v6: the apprenticeship lives in Career, Helm took its slot). Facts only; anything not known yet is a TODO string,
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
    // Richard's AI agent project. Everything but the name comes from translations (atlus.now.helm);
    // summary and progress are TODO keys until Richard supplies them, hidden in production.
    id: 'helm',
    i18n: 'helm',
    steps: [],
    done: null,
  },
];
