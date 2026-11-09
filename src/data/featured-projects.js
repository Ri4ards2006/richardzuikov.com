import clockImg from '../assets/AD_DA_Clock.png';
import weatherImg from '../assets/Weather_Station.png';
import goCoreImg from '../assets/Go_Lab_Reworked.png';

// Featured cards on the landing page, in display order. Swap entries here;
// every card needs width/height of its image plus de and en texts.
export const featuredProjects = [
  {
    title: 'AD-LED Clock',
    image: clockImg,
    width: 1075,
    height: 992,
    tags: ['C++', 'ATmega8535', 'KiCad PCB', 'Shift Registers'],
    href: 'https://github.com/Ri4ards2006/Analog-Digital-Clock',
    de: {
      summary: 'AVR RISC Register-Level LED Matrix Uhr.',
      specs: ['ATmega8535 mit 74HC595-Schieberegister-Kaskaden', 'Reines C++ auf Interrupt- und Registerebene, ohne externe Bibliotheken', 'In KiCad geroutete 2-Layer-Platine, 3D-gedrucktes Gehäuse'],
    },
    en: {
      summary: 'AVR RISC Register-Level LED Matrix Clock.',
      specs: ['ATmega8535 with 74HC595 shift register cascades', 'Pure C++ on interrupt and register level, no external libraries', 'Custom 2-layer KiCad PCB, 3D printed housing'],
    },
  },
  {
    title: 'Weather Station 2.0',
    image: weatherImg,
    width: 896,
    height: 1195,
    imageLift: 2.3,
    tags: ['C++', 'ESP32', 'IoT', 'MQTT'],
    href: 'https://github.com/Ri4ards2006/Weather_Station2.0',
    de: {
      summary: 'ESP32 Dual-Core Telemetrie-Station.',
      specs: ['Multi-Sensor-Fusion: BME280, Feuchte, Luftdruck, Licht', 'Energieeffiziente WiFi-Telemetrie an private MQTT-Broker', 'Modularer Aufbau auf ESP32-Basis'],
    },
    en: {
      summary: 'ESP32 Dual-Core Telemetry Node.',
      specs: ['Multi-sensor fusion: BME280, humidity, pressure, ambient light', 'Energy-efficient WiFi telemetry to private MQTT brokers', 'Modular build on ESP32'],
    },
  },
  {
    title: 'GO-CORE-LAB',
    image: goCoreImg,
    width: 1408,
    height: 768,
    tags: ['Go', 'ELF Parser', 'Binary Analysis', 'Hardware Bridge'],
    href: 'https://github.com/Ri4ards2006/GO-CORE-LAB',
    de: {
      summary: 'Statische Go-Binäranalyse & Hardware-Bridge.',
      specs: ['Parsing von ELF/PE-Binärdateien, Extraktion von Symboltabellen', 'Hardware-Bridge für serielle Busdaten (UART/SPI)', 'Statische Binärinspektion'],
    },
    en: {
      summary: 'Static Go Binary Analysis & Hardware Bridge.',
      specs: ['Parses ELF/PE binaries and extracts symbol tables', 'Hardware bus bridges for UART/SPI packet analysis', 'Static code introspection'],
    },
  },
];
