// src/lib/translations.js
// Centralized, production-grade bilingual dictionary for richardzuikov.com

export const translations = {
  de: {
    nav: {
      home: "Start",
      about: "Über mich",
      career: "Werdegang",
      lab: "Labor & Systeme",
      contact: "Kontakt",
      portfolio: "Portfolio",
      impressum: "Impressum",
      datenschutz: "Datenschutz",
      legal: "Impressum & Datenschutz",
      back: "Zurück",
      backHome: "Zurück · Start",
      menu: "Menü",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      switchLang: "Wechsle zu Englisch",
      switchTheme: "Theme wechseln"
    },
    telemetry: {
      location: "Flensburg, Deutschland",
      experience: "5+ Jahre Erfahrung",
      status: "Verfügbar für Projekte",
      coop: "Verfügbar für technische Kooperationen",
      engineeringBase: "Engineering Base: Flensburg, DE 🇩🇪",
      allRightsReserved: "Alle Rechte vorbehalten",
      sourceCode: "Quellcode",
      liveDemo: "Live Anwendung",
      sandbox: "3D Sandbox",
      verified: "Verifiziertes Zertifikat",
      copyId: "ID kopieren",
      copied: "Kopiert!",
      verifyOnPortal: "Zertifikat auf Portal prüfen",
      skillsTitle: "Validierte Kernkompetenzen",
      issuer: "Aussteller",
      issueDate: "Abschlussdatum",
      credentialId: "Zertifikats-ID",
      domain: "Fachbereich",
      specs: "Technische Spezifikationen",
      overview: "Übersicht"
    },
    home: {
      title: "Richard Zuikov",
      subtitle: "Low-Level Architekt · Systems Engineer",
      worksTitle: "Projekte",
      worksSub: "Hardware & Systeme",
      careerTitle: "Werdegang",
      careerSub: "Systemarchitekt",
      contactTitle: "Kontakt",
      contactSub: "Schreib mir"
    },
    about: {
      tag: "Über mich",
      title: "Richard Zuikov",
      headline: "Software ist die Abstraktion, Hardware ist die Realität. Ich arbeite an der Schnittstelle, wo beides kollidiert.",
      tags: ["Systemarchitektur", "Low-Level C++ & Go", "Hardware & PCB Design", "Home-Lab Infrastruktur"],
      insightsTitle: "Aktuelle Schwerpunkte & Systemgedanken",
      logEntries: [
        {
          title: "Register-Level Architektur",
          desc: "Direkte Manipulation von Peripherie-Registern und Interrupt-Service-Routinen statt aufgeblähter Abstraktionsschichten."
        },
        {
          title: "Hardware-Software Synchronisation",
          desc: "Präzises Timing und Bus-Kommunikation (SPI/I2C/UART) zwischen Mikrocontrollern und Host-Systemen."
        },
        {
          title: "Warum C++ & Go?",
          desc: "Die ideale Balance zwischen maximaler Hardwarekontrolle auf Register-Ebene und hochgradig nebenläufigen Netzwerk-Pipelines."
        },
        {
          title: "Lab- & Ausbildungspfad",
          desc: "Gezielter Weg zum IT-Systemelektroniker bis 2027 mit Fokus auf industrielle Sicherheitssysteme und Netzwerkinfrastruktur."
        }
      ],
      workbenchTitle: "Hardware Labor & Werkbank",
      workbenchSubtitle: "Einblick in Messplatz, Lötstation und Rack-Infrastruktur.",
      philosophyTitle: "Das Ziel für 2027",
      philosophyQuote: "\"Ich will nicht nur Systeme konfigurieren. Ich will die Schnittstelle beherrschen, an der die digitale Logik auf die physische Elektronik trifft.\"",
      statusNote: "Aktueller Status: Ausbildungsphase · Fokus: Systemarchitektur & Hardware-Integration · Prinzip: Keep it lean, robust, and deterministic.",
      originTitle: "Werdegang & Wurzeln",
      originRootsTitle: "Die Informatik-Wurzeln",
      originRootsDesc: "Fundierte Ausbildung in Netzwerktechnik, Digitaltechnik und Algorithmen. Das Verlangen nach tieferem Verständnis führte vom Code direkt zur Hardware.",
      originHardwareTitle: "Der Schritt zur Hardware-Integration",
      originHardwareDesc: "Entwicklung eigener Schaltungen in KiCad, Signalanalyse mit dem Oszilloskop und die Beherrschung industrieller Schaltanlagen.",
      quickFacts: [
        { label: "Alter", val: "20 Jahre" },
        { label: "Fokus", val: "System- & Hardware-Architektur" },
        { label: "Ziel", val: "Abschluss 2027" },
        { label: "Standort", val: "Flensburg, DE" }
      ],
      travelTitle: "Impressionen & Aktivitäten",
      travelSubtitle: "Einblicke in Ehrenamt bei der Feuerwehr, internationale Reisen und Ausgleich.",
      ctaTitle: "Lass uns etwas bauen.",
      ctaButton: "Kontakt aufnehmen",
      ctaSub: "Nachricht hinterlassen?"
    },
    career: {
      role: "System Engineer & Architekt",
      summary: "Spezialisiert auf die Schnittstelle zwischen Hardware und Low-Level-Software. Konzeption robuster IT- & Elektronik-Systeme von der Register-Ebene über automatisiertes Linux-Deployment bis zur industriellen Netzwerkinfrastruktur.",
      techStackTitle: "Technologischer Stack & Domänen",
      credentialsTitle: "Zertifikate & Qualifikationen",
      credentialsSubtitle: "Klicken Sie auf ein Zertifikat, um den Verifizierungsprüfer zu öffnen.",
      chronologyTitle: "Chronologischer Werdegang",
      domains: {
        lowLevel: {
          name: "Low-Level & Sprachen",
          desc: "Registerprogrammierung, Binäranalyse und Systemautomatisierung.",
          items: ["Modern C++ (C++17/20)", "Go (Systems / Telemetrie)", "C / x86 & AVR ASM", "Python / Automation", "POSIX APIs & Syscalls"]
        },
        infra: {
          name: "Systeme & Infrastruktur",
          desc: "Enterprise-Netzwerke, Virtualisierung und Container-Orchestrierung.",
          items: ["Linux (RHEL / Debian / Alpine)", "Docker & Container Swarm", "Proxmox VE Virtualisierung", "Cisco CCNA Netzwerktechnik", "Cloudflare Tunnels & WireGuard"]
        },
        hardware: {
          name: "Hardware & Elektronik",
          desc: "Schaltungsentwurf, Signalanalyse und Mikrocontroller.",
          items: ["KiCad PCB Design (2-Layer)", "AVR ATmega & ESP32 Dual-Core", "SMD / THT Löttechnik", "Oszilloskop Signalanalyse", "SPI / I2C / UART Bus-Protokolle"]
        },
        software: {
          name: "Software & Web Engineering",
          desc: "Performante Frontend-Architektur und Schnittstellen.",
          items: ["React & TypeScript", "Tailwind CSS & SCSS", "Vite & Build Tooling", "REST & WebSocket Schnittstellen", "Figma UI System Design"]
        }
      },
      certificates: [
        {
          id: "7Y5OLV313LZX",
          title: "AZ-900: Microsoft Azure Fundamentals",
          issuer: "Microsoft",
          date: "Mai 2026",
          verifyUrl: "https://learn.microsoft.com/en-us/users/richardzuikov/credentials",
          skills: ["Cloud Architecture", "Azure Security & Identity", "Network Virtualization", "SLA Governance"]
        },
        {
          id: "T6LTXVIVD8PF",
          title: "Linux & Private Cloud Admin on IBM Power Systems",
          issuer: "Red Hat & IBM",
          date: "Mai 2026",
          verifyUrl: "https://www.credly.com",
          skills: ["RHEL Administration", "IBM PowerVM Virtualization", "Storage Area Networks", "Kernel Tuning"]
        },
        {
          id: "P9EALFL0QGOT",
          title: "Google IT Automation with Python",
          issuer: "Google",
          date: "Apr. 2026",
          verifyUrl: "https://www.coursera.org/verify/professional-cert/P9EALFL0QGOT",
          skills: ["Python Scripting", "Configuration Management", "Git & GitHub Automation", "Troubleshooting & Debugging"]
        },
        {
          id: "ZXZ4ANI6JFX4",
          title: "IBM Systems and Solutions Architect",
          issuer: "IBM",
          date: "Apr. 2026",
          verifyUrl: "https://www.credly.com",
          skills: ["Enterprise Systems Design", "High Availability Clusters", "Disaster Recovery", "Hybrid Infrastructure"]
        }
      ],
      timeline: [
        {
          year: "2025–2027",
          type: "Aktuell · Duale Entwicklung",
          title: "IT-Systemelektroniker — R2P GmbH",
          desc: "Verkürzter Ausbildungsgang aufgrund hoher Vorkenntnisse. Montage, Inbetriebnahme und Wartung von video- und netzwerkbasierten Sicherheitssystemen. Technische Fehlersuche auf Hardware- und Systemebene. Nebenher IT-Support (Helpdesk, Tickets, Enterprise-Netzwerke).",
          tags: ["Enterprise Network", "Hardware Diagnostics", "CCNA Systems", "Flensburg"]
        },
        {
          year: "2024–2025",
          type: "Infrastruktur-Fokus",
          title: "Fachinformatiker Systemintegration — R2P GmbH",
          desc: "Aufbau, Reparatur und Provisionierung von IT-Arbeitsplätzen. Linux-basierte Systemarbeit: Entwicklung von Bash-Workflows, automatisierten Deployment-Prozessen und maßgeschneiderten, bootfähigen USB-Images.",
          tags: ["Linux", "Bash Scripting", "Automated Deployment"]
        },
        {
          year: "2025",
          type: "Forschung & Software",
          title: "GO-CORE-LAB Framework",
          desc: "Persönliches Low-Level Forschungsframework in Go. Parsing von ELF/PE Binaries, direkte Hardware-Bridges für serielle Busse (SPI/I2C/UART) und Netzwerk-Probes. Statisch kompiliert für universelle Infrastruktur-Kompatibilität.",
          tags: ["Go", "Binary Analysis", "Hardware Bridge", "Self-Hosted"]
        },
        {
          year: "2024",
          type: "Hardware-Labor",
          title: "Embedded Systems & Messtechnik",
          desc: "Entwicklung einer AD-LED Clock auf ATmega8535 (KiCad PCB-Layout, 3D-gedrucktes Gehäuse, ISR-Level C++). Simulation von Verkehrskreuzen per Arduino Mega & Sensorik. Aufbau eines professionellen Messplatzes (Oszilloskop, Labornetzteil, Signalgenerator).",
          tags: ["C++", "AVR / ATmega", "KiCad PCB Design", "Lab Gear"]
        },
        {
          year: "2022–2025",
          type: "Akademisches Fundament",
          title: "Informationstechnischer Assistent — RBZ-Eckener",
          desc: "3-jährige vollschulische Ausbildung gekoppelt mit der Fachhochschulreife. Fundierte Ausbildung in Netzwerktechnik, Elektrotechnik, Digitaltechnik und Kommunikationstechnik. Angewandte Programmierung in Kotlin, Java, Jetpack Compose und Docker.",
          tags: ["Network Tech", "Digital & E-Tech", "Docker", "Java / Kotlin"]
        },
        {
          year: "2023",
          type: "Industrie-Praktikum",
          title: "Elektroniker für Betriebstechnik — M. Jürgensen",
          desc: "Löten und messtechnische Reparatur komplexer elektronischer Baugruppen und Industriemaschinen. Fehleranalyse in Heizöfen und erste praktische Berührungspunkte mit speicherprogrammierbaren Steuerungen (SPS).",
          tags: ["Löten / Reparatur", "SPS Basics", "Industrial Electronics"]
        },
        {
          year: "2021",
          type: "Anlagen-Praktikum",
          title: "Elektroniker für Gebäudetechnik — ETS GmbH",
          desc: "Planung, Strukturierung und physische Montage von industriellen Schaltanlagen. Erste praxisnahe Berührungen mit Steuerungstechnik und ESMR-Infrastrukturen.",
          tags: ["Schaltanlagen", "SPS", "ESMR-Technik"]
        }
      ]
    },
    lab: {
      title: "Labor & Systeme",
      subtitle: "Hardware-Entwicklung, Low-Level Software, Embedded R&D und Server-Infrastruktur.",
      inspectHint: "Wählen Sie ein Projekt für Detailinformationen und externe Anwendungen aus.",
      viewCode: "Quellcode auf GitHub",
      launchApp: "Live-System starten",
      launch3d: "3D Sandkasten öffnen",
      projects: [
        {
          id: "01",
          tag: "Hardware · 3D Sandbox",
          title: "19\" Server Rack Configurator",
          desc: "Interaktiver 3D Server-Rack-Konfigurator für Rechenzentren und Home-Labs.",
          fullText: "Echtzeit-3D-Planungsmodul für 19-Zoll Server-Racks. Erlaubt die visuelle Platzierung von Server-Einschüben, Patchfeldern, USV-Einheiten und Switch-Konfigurationen mit exakter Höheneinheiten-Berechnung (HE) und thermischer Leistungsanalyse. Ausgelagert als eigenständige WebGL-Anwendung.",
          tags: ["Three.js", "WebGL", "React", "3D Architecture"],
          repo: "https://github.com/Ri4ards2006",
          liveUrl: "https://rack.richardzuikov.com",
          isLiveApp: true
        },
        {
          id: "02",
          tag: "Embedded · Hardware",
          title: "AD-LED Clock",
          desc: "AVR RISC Register-Level LED Matrix Uhr.",
          fullText: "ATmega8535 getriebene LED-Matrix mit Schieberegister-Kaskaden (74HC595). Reines C++ auf Interrupt- und Registerebene ohne externe Bibliotheken. Vollständig in KiCad geroutete 2-Layer Platine im maßgeschneiderten 3D-Druck Gehäuse.",
          tags: ["C++", "ATmega8535", "KiCad PCB", "Shift Registers"],
          repo: "https://github.com/Ri4ards2006/Analog-Digital-Clock",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "03",
          tag: "Embedded · Automation",
          title: "Traffic Light System",
          desc: "Arduino Mega 2560 Kreuzungssimulation.",
          fullText: "Vollständige Verkehrskreuzungs-Simulation mit KFZ- und Fußgängerampeln, Tag-/Nachtmodus und Ultraschall-Abstandserkennung. Hardware-Interrupts für Fußgängertaster, LN298 Motortreiberanbindung und Signalphasen-Zustandsautomat.",
          tags: ["C++", "Arduino Mega", "Ultraschall", "3D Print"],
          repo: "https://github.com/Ri4ards2006/Traffic-Light",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "04",
          tag: "Embedded · IoT",
          title: "Weather Station 2.0",
          desc: "ESP32 Dual-Core Telemetrie-Station.",
          fullText: "Modulare IoT-Wetterstation auf ESP32 Basis mit Multi-Sensor-Fusion (BME280, Feuchte, Luftdruck, Licht). Energieeffiziente WiFi-Telemetrieübertragung an private MQTT Broker mit lokaler Datenspeicherung.",
          tags: ["C++", "ESP32", "IoT Telemetrie", "MQTT"],
          repo: "https://github.com/Ri4ards2006/Weather_Station2.0",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "05",
          tag: "Software · Research",
          title: "GO-CORE-LAB",
          desc: "Statische Go-Binäranalyse & Hardware-Bridge.",
          fullText: "Persönliches Low-Level Forschungsframework in Go. Parsing von ELF/PE Binärdateien, Extraktion von Symboltabellen, Hardware-Bridge zur Erfassung serieller Busdaten (UART/SPI) von Mikrocontrollern und statische Binärinspektion.",
          tags: ["Go", "ELF Parser", "Binary Analysis", "Hardware Bridge"],
          repo: "https://github.com/Ri4ards2006/GO-CORE-LAB",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "06",
          tag: "Infrastruktur",
          title: "Home Lab Infrastructure",
          desc: "Privater Server- & Switch-Betrieb.",
          fullText: "Vollständig selbst gehostete Server-Infrastruktur auf UGREEN NAS und Linux Servern. Docker Container-Stacks, Proxmox VE, Cloudflare Tunnels, VLAN Segmentierung und lokales WireGuard VPN für sichere Fernwartung.",
          tags: ["Docker", "Linux", "Cloudflare", "Proxmox"],
          repo: null,
          liveUrl: null,
          isLiveApp: false
        }
      ]
    },
    contact: {
      tag: "Direktkontakt",
      title: "Kontaktieren Sie mich",
      subtitle: "Kontaktieren Sie mich für Projektanfragen. Von Systemarchitektur und Low-Level-Software über Web-Engineering bis hin zu Elektronik und Hardware-Integration.",
      emailLabel: "Direkte E-Mail",
      socialLabel: "Netzwerke & Repositories",
      statusText: "Verfügbar für technische Zusammenarbeit · Flensburg, DE 🇩🇪"
    }
  },

  en: {
    nav: {
      home: "Home",
      about: "About",
      career: "Career",
      lab: "Lab & Systems",
      contact: "Contact",
      portfolio: "Portfolio",
      impressum: "Legal Notice",
      datenschutz: "Privacy Policy",
      legal: "Legal & Privacy",
      back: "Back",
      backHome: "Back · Home",
      menu: "Menu",
      openMenu: "Open Menu",
      closeMenu: "Close Menu",
      switchLang: "Switch to German",
      switchTheme: "Switch Theme"
    },
    telemetry: {
      location: "Flensburg, Germany",
      experience: "5+ Years Experience",
      status: "Available for Projects",
      coop: "Available for technical co-op",
      engineeringBase: "Engineering Base: Flensburg, DE 🇩🇪",
      allRightsReserved: "All rights reserved",
      sourceCode: "Source Code",
      liveDemo: "Live Application",
      sandbox: "3D Sandbox",
      verified: "Verified Credential",
      copyId: "Copy ID",
      copied: "Copied!",
      verifyOnPortal: "Verify on Issuer Portal",
      skillsTitle: "Validated Core Competencies",
      issuer: "Issuer",
      issueDate: "Completion Date",
      credentialId: "Credential ID",
      domain: "Domain",
      specs: "Technical Specifications",
      overview: "Overview"
    },
    home: {
      title: "Richard Zuikov",
      subtitle: "Low-Level Architect · Systems Engineer",
      worksTitle: "Works",
      worksSub: "Hardware & Systems",
      careerTitle: "Profile",
      careerSub: "System Engineer",
      contactTitle: "Contact",
      contactSub: "Get in touch"
    },
    about: {
      tag: "About Me",
      title: "Richard Zuikov",
      headline: "Software is the abstraction, hardware is the reality. I work at the boundary where both collide.",
      tags: ["Systems Architecture", "Low-Level C++ & Go", "Hardware & PCB Design", "Home-Lab Infrastructure"],
      insightsTitle: "Current Focus & Systems Philosophy",
      logEntries: [
        {
          title: "Register-Level Architecture",
          desc: "Direct manipulation of hardware peripheral registers and interrupt handlers instead of bloated abstraction layers."
        },
        {
          title: "Hardware-Software Sync",
          desc: "Deterministic timing and bus communication (SPI/I2C/UART) between microcontrollers and host architectures."
        },
        {
          title: "Why C++ & Go?",
          desc: "The ideal equilibrium between bare-metal register control and highly concurrent network telemetry pipelines."
        },
        {
          title: "Lab & Development Path",
          desc: "Targeted journey toward IT Systems Electronics certification by 2027 with focus on enterprise network arrays."
        }
      ],
      workbenchTitle: "Hardware Lab & Workbench",
      workbenchSubtitle: "Inspection of the electronics workbench, soldering station, and server rack array.",
      philosophyTitle: "The Goal for 2027",
      philosophyQuote: "\"I don't just want to configure systems. I want to master the boundary where digital logic meets physical electronics.\"",
      statusNote: "Current Status: Apprenticeship Phase · Focus: System Architecture & Hardware Integration · Principle: Keep it lean, robust, and deterministic.",
      originTitle: "Trajectory & Roots",
      originRootsTitle: "Computer Science Foundations",
      originRootsDesc: "Grounded education in network technology, digital logic, and algorithms. The drive for deeper understanding led directly from software code to hardware silicon.",
      originHardwareTitle: "The Pivot to Hardware Integration",
      originHardwareDesc: "Designing custom PCB layouts in KiCad, oscilloscope waveform analysis, and assembling industrial control units.",
      quickFacts: [
        { label: "Age", val: "20 Years" },
        { label: "Focus", val: "Systems & Hardware Architecture" },
        { label: "Target", val: "Graduation 2027" },
        { label: "Location", val: "Flensburg, DE" }
      ],
      travelTitle: "Impressions & Engagements",
      travelSubtitle: "Volunteer engagements with the fire department, international travels, and balance away from the keyboard.",
      ctaTitle: "Let's build something robust.",
      ctaButton: "Get in touch",
      ctaSub: "Leave a message?"
    },
    career: {
      role: "System Engineer & Architect",
      summary: "Specialized at the intersection of hardware and low-level software. Engineering resilient IT & electrical systems from bare-metal register interaction to automated Linux deployment and industrial network commissioning.",
      techStackTitle: "Technology Stack & Domains",
      credentialsTitle: "Certifications & Credentials",
      credentialsSubtitle: "Click on any credential card to inspect verified metadata and badges.",
      chronologyTitle: "Chronological Trajectory",
      domains: {
        lowLevel: {
          name: "Low-Level & Languages",
          desc: "Register manipulation, binary disassembly, and system automation.",
          items: ["Modern C++ (C++17/20)", "Go (Systems / Telemetry)", "C / x86 & AVR ASM", "Python / Automation", "POSIX APIs & Syscalls"]
        },
        infra: {
          name: "Systems & Infrastructure",
          desc: "Enterprise networks, virtualization, and container clustering.",
          items: ["Linux (RHEL / Debian / Alpine)", "Docker & Container Swarm", "Proxmox VE Virtualization", "Cisco CCNA Networking", "Cloudflare Tunnels & WireGuard"]
        },
        hardware: {
          name: "Hardware & Electronics",
          desc: "Schematic design, waveform inspection, and microcontrollers.",
          items: ["KiCad PCB Design (2-Layer)", "AVR ATmega & ESP32 Dual-Core", "SMD / THT Soldering", "Oscilloscope Waveform Analysis", "SPI / I2C / UART Protocols"]
        },
        software: {
          name: "Software & Web Engineering",
          desc: "High-performance frontend architecture and interface pipelines.",
          items: ["React & TypeScript", "Tailwind CSS & SCSS", "Vite & Build Tooling", "REST & WebSocket Pipelines", "Figma UI System Design"]
        }
      },
      certificates: [
        {
          id: "7Y5OLV313LZX",
          title: "AZ-900: Microsoft Azure Fundamentals",
          issuer: "Microsoft",
          date: "May 2026",
          verifyUrl: "https://learn.microsoft.com/en-us/users/richardzuikov/credentials",
          skills: ["Cloud Architecture", "Azure Security & Identity", "Network Virtualization", "SLA Governance"]
        },
        {
          id: "T6LTXVIVD8PF",
          title: "Linux & Private Cloud Admin on IBM Power Systems",
          issuer: "Red Hat & IBM",
          date: "May 2026",
          verifyUrl: "https://www.credly.com",
          skills: ["RHEL Administration", "IBM PowerVM Virtualization", "Storage Area Networks", "Kernel Tuning"]
        },
        {
          id: "P9EALFL0QGOT",
          title: "Google IT Automation with Python",
          issuer: "Google",
          date: "Apr. 2026",
          verifyUrl: "https://www.coursera.org/verify/professional-cert/P9EALFL0QGOT",
          skills: ["Python Scripting", "Configuration Management", "Git & GitHub Automation", "Troubleshooting & Debugging"]
        },
        {
          id: "ZXZ4ANI6JFX4",
          title: "IBM Systems and Solutions Architect",
          issuer: "IBM",
          date: "Apr. 2026",
          verifyUrl: "https://www.credly.com",
          skills: ["Enterprise Systems Design", "High Availability Clusters", "Disaster Recovery", "Hybrid Infrastructure"]
        }
      ],
      timeline: [
        {
          year: "2025–2027",
          type: "Current · Dual Career",
          title: "IT Systems Electronics Technician — R2P GmbH",
          desc: "Accelerated apprenticeship due to advanced pre-qualifications. Installation, commissioning, and maintenance of video and network-based security systems. Hardware-level diagnostic troubleshooting and enterprise IT support.",
          tags: ["Enterprise Network", "Hardware Diagnostics", "CCNA Systems", "Flensburg"]
        },
        {
          year: "2024–2025",
          type: "Infrastructure Focus",
          title: "IT Specialist in System Integration — R2P GmbH",
          desc: "Setup, repair, and provisioning of IT workstations. Linux-based system engineering: Bash automated workflows, deployment pipelines, and customized bootable USB deployment images.",
          tags: ["Linux", "Bash Scripting", "Automated Deployment"]
        },
        {
          year: "2025",
          type: "Research & Software",
          title: "GO-CORE-LAB Framework",
          desc: "Personal low-level research framework in Go. ELF/PE binary parsing, direct hardware telemetry bridges for SPI/I2C/UART, and network probes. Statically compiled for universal infrastructure portability.",
          tags: ["Go", "Binary Analysis", "Hardware Bridge", "Self-Hosted"]
        },
        {
          year: "2024",
          type: "Hardware Lab",
          title: "Embedded Systems & Signal Analysis",
          desc: "Development of an AD-LED Clock on ATmega8535 (KiCad PCB layout, 3D printed housing, ISR-level C++). Traffic intersection simulation on Arduino Mega. Setup of electronics measurement workbench (oscilloscope, power supply, signal generator).",
          tags: ["C++", "AVR / ATmega", "KiCad PCB Design", "Lab Gear"]
        },
        {
          year: "2022–2025",
          type: "Academic Foundation",
          title: "Information Technology Assistant — RBZ-Eckener",
          desc: "3-year vocational state diploma coupled with university entrance qualification. Grounded education in network tech, digital electronics, and communications. Programming in Kotlin, Java, and Docker.",
          tags: ["Network Tech", "Digital & E-Tech", "Docker", "Java / Kotlin"]
        },
        {
          year: "2023",
          type: "Industrial Internship",
          title: "Industrial Electronics Technician — M. Jürgensen",
          desc: "Soldering and precision electronic repairs of machine components. Thermal kiln diagnostic project and practical introduction to Programmable Logic Controllers (PLC/SPS).",
          tags: ["Soldering / Repair", "PLC Basics", "Industrial Electronics"]
        },
        {
          year: "2021",
          type: "Systems Internship",
          title: "Facility Systems Technician — ETS GmbH",
          desc: "Planning, layout, and physical wiring of industrial control cabinets. First practical exposure to control technology and industrial measurement loops.",
          tags: ["Control Cabinets", "PLC", "Instrumentation"]
        }
      ]
    },
    lab: {
      title: "Lab & Systems",
      subtitle: "Hardware engineering, low-level software, embedded R&D, and server infrastructure.",
      inspectHint: "Select any module to inspect detailed architecture and external live applications.",
      viewCode: "Source Code on GitHub",
      launchApp: "Launch Live System",
      launch3d: "Launch 3D Sandbox",
      projects: [
        {
          id: "01",
          tag: "Hardware · 3D Sandbox",
          title: "19\" Server Rack Configurator",
          desc: "Interactive 3D Server Rack Configurator for data centers and home labs.",
          fullText: "Real-time 3D spatial planning engine for 19-inch server racks. Enables visual mounting of chassis units, patch panels, UPS modules, and enterprise switches with exact Rack Unit (RU) calculations and thermal distribution analysis. Deployed as a dedicated WebGL application.",
          tags: ["Three.js", "WebGL", "React", "3D Architecture"],
          repo: "https://github.com/Ri4ards2006",
          liveUrl: "https://rack.richardzuikov.com",
          isLiveApp: true
        },
        {
          id: "02",
          tag: "Embedded · Hardware",
          title: "AD-LED Clock",
          desc: "AVR RISC Register-Level LED Matrix Clock.",
          fullText: "ATmega8535 driven LED matrix with shift register cascades (74HC595). Pure C++ on interrupt and register level without external libraries. Custom 2-layer PCB designed in KiCad with 3D printed housing.",
          tags: ["C++", "ATmega8535", "KiCad PCB", "Shift Registers"],
          repo: "https://github.com/Ri4ards2006/Analog-Digital-Clock",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "03",
          tag: "Embedded · Automation",
          title: "Traffic Light System",
          desc: "Arduino Mega 2560 Intersection Simulation.",
          fullText: "Full street crossing simulation with vehicle and pedestrian signals, day/night modes, and ultrasonic vehicle detection. Hardware interrupt triggers for pedestrian call buttons, LN298 driver stage, and finite state machine.",
          tags: ["C++", "Arduino Mega", "Ultrasonic", "3D Print"],
          repo: "https://github.com/Ri4ards2006/Traffic-Light",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "04",
          tag: "Embedded · IoT",
          title: "Weather Station 2.0",
          desc: "ESP32 Dual-Core Telemetry Node.",
          fullText: "Modular IoT weather station on ESP32 with multi-sensor fusion (BME280, humidity, barometric pressure, ambient light). Energy-efficient telemetry transmission over WiFi to private MQTT brokers.",
          tags: ["C++", "ESP32", "IoT Telemetry", "MQTT"],
          repo: "https://github.com/Ri4ards2006/Weather_Station2.0",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "05",
          tag: "Software · Research",
          title: "GO-CORE-LAB",
          desc: "Static Go Binary Analysis & Hardware Bridge.",
          fullText: "Personal low-level research framework in Go. Disassembles and parses ELF/PE binaries, extracts symbol tables, provides hardware bus bridges for UART/SPI packet analysis, and performs static code introspection.",
          tags: ["Go", "ELF Parser", "Binary Analysis", "Hardware Bridge"],
          repo: "https://github.com/Ri4ards2006/GO-CORE-LAB",
          liveUrl: null,
          isLiveApp: false
        },
        {
          id: "06",
          tag: "Infrastructure",
          title: "Home Lab Infrastructure",
          desc: "Private Server & Switch Administration.",
          fullText: "Self-hosted private server infrastructure on UGREEN NAS and Linux clusters. Docker container stacks, Proxmox VE hypervisors, Cloudflare Tunnels, VLAN isolation, and private WireGuard VPN tunnels.",
          tags: ["Docker", "Linux", "Cloudflare", "Proxmox"],
          repo: null,
          liveUrl: null,
          isLiveApp: false
        }
      ]
    },
    contact: {
      tag: "Direct Channel",
      title: "Get in Touch",
      subtitle: "Contact me for technical inquiries. From system architecture and low-level software to web engineering, electronics, and hardware integration.",
      emailLabel: "Direct Email",
      socialLabel: "Networks & Repositories",
      statusText: "Available for technical co-op · Flensburg, DE 🇩🇪"
    }
  }
};

