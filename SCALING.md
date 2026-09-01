# Lightweight Modularity & External Integration Strategy
**richardzuikov.com — Editorial Systems Portfolio**
*Version: 2.0.0 · Role: Principal Design Technologist & Senior Frontend Architect*

---

## 1. Type-Safe Static Content Architecture (Zod & JSON)

To scale the portfolio without manual JSX refactoring, all project logs, credentials, and career milestones are decoupled into typed static datasets validated with **Zod**.

### Data Schemas (`src/schemas/content.js`)

```typescript
import { z } from 'zod';

export const LocalizedStringSchema = z.object({
  de: z.string().min(1),
  en: z.string().min(1),
});

export const ProjectSchema = z.object({
  id: z.string().regex(/^[0-9]{2}$/),
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: LocalizedStringSchema,
  category: z.enum(['hardware', 'systems', 'infrastructure', 'research']),
  summary: LocalizedStringSchema,
  technicalSpecs: z.array(z.string()),
  tags: z.array(z.string()),
  previewImage: z.string(),
  repositoryUrl: z.string().url().nullable().optional(),
  sandboxUrl: z.string().url().nullable().optional(),
  status: z.enum(['completed', 'active', 'archived']),
  date: z.string(),
});

export const CertificateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.string(),
  verificationId: z.string(),
  verifyUrl: z.string().url().optional(),
  skills: z.array(z.string()),
  badgeImage: z.string().optional(),
});

export const CareerEventSchema = z.object({
  period: z.string(),
  role: LocalizedStringSchema,
  organization: z.string(),
  description: LocalizedStringSchema,
  tags: z.array(z.string()),
  type: z.enum(['employment', 'education', 'research', 'volunteer']),
});
```

### Static Dataset Example (`src/data/projects.json`)

```json
[
  {
    "id": "01",
    "slug": "ad-led-clock",
    "title": "AD-LED Clock Architecture",
    "tagline": {
      "de": "AVR RISC Register Level LED-Matrix Uhr",
      "en": "AVR RISC Register-Level LED Matrix Clock"
    },
    "category": "hardware",
    "summary": {
      "de": "ATmega8535 getriebene LED-Matrix mit Schieberegister-Kaskaden. Reines C++ auf Interrupt- und Registerebene ohne externe Bibliotheken. Vollständig in KiCad geroutet und im 3D-Druck verpackt.",
      "en": "ATmega8535 driven LED matrix with shift register cascades. Pure C++ on interrupt and register level without external libraries. Custom KiCad PCB design and 3D printed chassis."
    },
    "technicalSpecs": ["ATmega8535 @ 16MHz", "74HC595 Shift Registers", "Custom KiCad 2-Layer PCB"],
    "tags": ["C++", "AVR", "KiCad", "Register-Level"],
    "previewImage": "/assets/projects/ad_led_clock.webp",
    "repositoryUrl": "https://github.com/Ri4ards2006/Analog-Digital-Clock",
    "sandboxUrl": null,
    "status": "completed",
    "date": "2024"
  },
  {
    "id": "02",
    "slug": "go-core-lab",
    "title": "GO-CORE-LAB Framework",
    "tagline": {
      "de": "Statische Go-Binäranalyse & Hardware-Bus Bridge",
      "en": "Static Go Binary Analysis & Hardware Bus Bridge"
    },
    "category": "systems",
    "summary": {
      "de": "Low-Level Forschungsframework in Go zum Parsen von ELF/PE Binärdateien und zur direkten UART/SPI Telemetrieerfassung aus Embedded-Targets.",
      "en": "Low-level research framework in Go for parsing ELF/PE binaries and capturing direct UART/SPI telemetry from embedded hardware targets."
    },
    "technicalSpecs": ["Go 1.22", "ELF Parser Engine", "UART / SPI Telemetry"],
    "tags": ["Go", "Systems", "Binary Analysis", "Hardware Bridge"],
    "previewImage": "/assets/projects/go_core_lab.webp",
    "repositoryUrl": "https://github.com/Ri4ards2006/GO-CORE-LAB",
    "sandboxUrl": null,
    "status": "active",
    "date": "2025"
  }
]
```

---

## 2. Dual-Domain Showcase Architecture

To maintain the strict `< 50 KB` bundle budget on `richardzuikov.com`, complex 3D applications (e.g., Three.js webgl rack visualizers or compiler sandboxes) live strictly on dedicated standalone domains.

```
┌─────────────────────────────────────────────────────────────┐
│                 DUAL-DOMAIN ECOSYSTEM BOUNDARY              │
├──────────────────────────────┬──────────────────────────────┤
│ PRIMARY HUB                  │ EXTERNAL SANDBOX APPS        │
│ richardzuikov.com            │ *.richardzuikov.com          │
├──────────────────────────────┼──────────────────────────────┤
│ • Zero Heavy WebGL Bundles   │ • Dedicated Three.js / R3F   │
│ • Sub-100ms FCP              │ • Heavy Asset Textures & GLB │
│ • Static Editorial Previews  │ • Full Canvas WebGL Runtimes │
│ • Clean Outbound Hyperlinks  │ • Complex State Management   │
└──────────────────────────────┴──────────────────────────────┘
```

### Showcase Preview Card Component (`src/components/ui/ProjectCard.jsx`)

```jsx
import React from 'react';
import { ExternalLink, Github, Cpu } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';

export default function ProjectCard({ project }) {
  const { lang } = useLanguage();

  return (
    <article className="group relative rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-[#12100e] p-6 sm:p-8 space-y-6 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300">
      
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between font-mono text-[10px] text-stone-500 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
          <span>// ID_{project.id} · {project.category}</span>
        </div>
        <span className="text-stone-400">{project.date}</span>
      </div>

      {/* Static Optimized Preview Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
        <img 
          src={project.previewImage} 
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500"
        />
        {project.sandboxUrl && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full border border-stone-900/40 bg-stone-950/80 backdrop-blur-md text-[10px] font-mono text-white tracking-wider">
            3D SANDBOX
          </div>
        )}
      </div>

      {/* Title & Editorial Summary */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-stone-900 dark:text-stone-100">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400 leading-relaxed">
          {project.summary[lang]}
        </p>
      </div>

      {/* Technical Specifications */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {project.tags.map((tag, idx) => (
          <span 
            key={idx}
            className="px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 font-mono text-[10px] text-stone-600 dark:text-stone-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800/80 font-mono text-xs">
        {project.repositoryUrl ? (
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-950 dark:hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>SOURCE</span>
          </a>
        ) : <div />}

        {project.sandboxUrl && (
          <a
            href={project.sandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <span>LAUNCH 3D ENGINE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

    </article>
  );
}
```

---

## 3. Edge Infrastructure & Security Governance

### Production Edge Headers (`vercel.json`)

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).(html|json)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800"
        }
      ]
    }
  ]
}
```

### Lighthouse CI Enforcement (`.lighthouserc.json`)

Automated validation ensuring strict 100/100 Core Web Vitals across every commit:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.98 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 1.0 }],
        "categories:seo": ["error", { "minScore": 1.0 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 150 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 800 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.00 }]
      }
    }
  }
}
```

### Continuous Integration Workflow (`.github/workflows/ci.yml`)

```yaml
name: Production Quality & Security CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  audit-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Validate Code Standards & Lints
        run: npm run build

      - name: Run Lighthouse CI Audit
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './.lighthouserc.json'
          upload залишитьArtifacts: true
```
