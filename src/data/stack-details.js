// Stack detail screen (DESIGN.md §16): "what it is" per item of career.domains, same order as
// stack-uses.js. General descriptions of the tools, not claims about Richard; his experience in
// words is still missing and stays a TODO key.
export const stackWhat = {
  lowLevel: [
    { de: 'C++ mit den Sprachmitteln von C++17/20: RAII, Templates, constexpr. Erzeugt Maschinencode ohne Laufzeitumgebung und eignet sich deshalb bis hinunter zum Mikrocontroller.', en: 'C++ with the features of C++17/20: RAII, templates, constexpr. It compiles to machine code without a runtime, so it reaches all the way down to microcontrollers.' },
    { de: 'Kompilierte Sprache von Google mit eingebauter Nebenläufigkeit (Goroutines, Channels). Erzeugt einzelne statische Binaries, beliebt für Systemwerkzeuge und Netzwerkdienste.', en: "Google's compiled language with built-in concurrency (goroutines, channels). Produces single static binaries; common for system tools and network services." },
    { de: 'C und Assembler für x86 und AVR: direkter Zugriff auf Register, Speicher und Interrupts, ohne Abstraktion dazwischen.', en: 'C and assembly for x86 and AVR: direct access to registers, memory and interrupts, with no abstraction in between.' },
    { de: 'Python als Skriptsprache für Automatisierung: Dateien, Prozesse, APIs und wiederkehrende Admin-Aufgaben.', en: 'Python as a scripting language for automation: files, processes, APIs and recurring admin tasks.' },
    { de: 'Die Unix-Schnittstellen zwischen Programm und Kernel: Prozesse, Dateien, Signale, Sockets über Systemaufrufe.', en: 'The Unix interfaces between a program and the kernel: processes, files, signals and sockets through system calls.' },
  ],
  infra: [
    { de: 'Linux-Distributionen für Server und Container: RHEL im Unternehmen, Debian als Allrounder, Alpine als minimale Basis.', en: 'Linux distributions for servers and containers: RHEL in companies, Debian as the all-rounder, Alpine as a minimal base.' },
    { de: 'Container verpacken eine Anwendung mit allen Abhängigkeiten; Swarm verteilt sie über mehrere Hosts.', en: 'Containers package an application with all its dependencies; Swarm spreads them over several hosts.' },
    { de: 'Kubernetes orchestriert Container im Cluster: Scheduling, Skalierung, Netzwerk und Selbstheilung. Die CKA prüft die Administration.', en: 'Kubernetes orchestrates containers across a cluster: scheduling, scaling, networking and self-healing. The CKA certifies its administration.' },
    { de: 'Proxmox VE ist eine Open-Source-Plattform für virtuelle Maschinen (KVM) und Container (LXC) mit Weboberfläche.', en: 'Proxmox VE is an open-source platform for virtual machines (KVM) and containers (LXC) with a web interface.' },
    { de: 'Cisco CCNA umfasst Netzwerkgrundlagen: Routing, Switching, VLANs, Subnetting, IP-Dienste und Sicherheit.', en: 'Cisco CCNA covers networking fundamentals: routing, switching, VLANs, subnetting, IP services and security.' },
    { de: 'Wege von außen ins eigene Netz: Cloudflare-Tunnel ohne offene Ports, WireGuard als schlankes VPN.', en: 'Ways into a private network from outside: Cloudflare tunnels without open ports, WireGuard as a lean VPN.' },
  ],
  hardware: [
    { de: 'KiCad ist eine Open-Source-Suite für Schaltplan und Platinenlayout, hier für zweilagige Platinen.', en: 'KiCad is an open-source suite for schematics and PCB layout, here for two-layer boards.' },
    { de: 'Mikrocontroller: AVR ATmega als klassischer 8-Bit-Chip, ESP32 als Dual-Core mit WLAN und Bluetooth.', en: 'Microcontrollers: the AVR ATmega as a classic 8-bit chip, the ESP32 as a dual-core with Wi-Fi and Bluetooth.' },
    { de: 'Löten von oberflächenmontierten (SMD) und durchgesteckten (THT) Bauteilen.', en: 'Soldering surface-mount (SMD) and through-hole (THT) components.' },
    { de: 'Mit dem Oszilloskop werden Spannungen über die Zeit sichtbar: Takt, Datenleitungen, Störungen.', en: 'An oscilloscope makes voltages visible over time: clocks, data lines, glitches.' },
    { de: 'Serielle Busse zwischen Chips: SPI (schnell, mit Chip-Select), I2C (zwei Leitungen, adressiert), UART (asynchron).', en: 'Serial buses between chips: SPI (fast, with chip select), I2C (two wires, addressed), UART (asynchronous).' },
  ],
  software: [
    { de: 'React baut Oberflächen aus Komponenten; TypeScript ergänzt JavaScript um statische Typen.', en: 'React builds interfaces from components; TypeScript adds static types to JavaScript.' },
    { de: 'Tailwind CSS setzt Stile über Utility-Klassen, SCSS erweitert CSS um Variablen, Verschachtelung und Mixins.', en: 'Tailwind CSS styles through utility classes; SCSS adds variables, nesting and mixins to CSS.' },
    { de: 'Vite ist ein Build-Werkzeug mit schnellem Dev-Server und gebündelten, aufgeteilten Produktions-Builds.', en: 'Vite is a build tool with a fast dev server and bundled, code-split production builds.' },
    { de: 'Schnittstellen zwischen Programmen: REST über HTTP-Anfragen, WebSocket als dauerhafte Zwei-Wege-Verbindung.', en: 'Interfaces between programs: REST through HTTP requests, WebSocket as a persistent two-way connection.' },
    { de: 'Figma ist ein Design-Werkzeug für Oberflächen, Komponenten und Designsysteme im Browser.', en: 'Figma is a design tool for interfaces, components and design systems in the browser.' },
  ],
};

// "Used in" names from stack-uses.js that are projects in the Work deck (lab.projects ids).
export const useToProject = {
  'Rack Configurator': '01',
  'AD-LED Clock': '02',
  'Traffic Light System': '03',
  'Weather Station 2.0': '04',
  'GO-CORE-LAB': '05',
  'Home Lab': '06',
};
