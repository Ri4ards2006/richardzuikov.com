<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=080808&height=140&section=header&text=richardzuikov.com&fontSize=40&fontColor=C9A84C&theme=dark&stroke=C9A84C&strokeWidth=1" width="100%" />

  <br/>

  ### Personal Portfolio — Cinematic Dark · Gold Accent · Self-Hosted

  <sub>Ugreen NAS · Cloudflare Tunnel · nginx · Pure HTML/CSS/JS</sub>

  <br/>

  [![Status](https://img.shields.io/badge/Status-Live-C9A84C?style=flat-square)]()
  [![Host](https://img.shields.io/badge/Host-Self--Hosted_NAS-1a1a1a?style=flat-square&logo=docker&logoColor=C9A84C)]()
  [![Tunnel](https://img.shields.io/badge/Tunnel-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://cloudflare.com)
  [![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

</div>

---

## What This Is

Personal portfolio and digital business card at **[richardzuikov.com](https://richardzuikov.com)**.

Cinematic dark aesthetic — large typography, gold accents, custom cursor, scroll-triggered animations. Designed to work for everyone, not just developers. Built entirely without frameworks — pure HTML, CSS, and vanilla JS.

Self-hosted on a Ugreen NAS via Cloudflare Tunnel. No public IP, no reverse proxy, no overengineering.

---

## Design Decisions

**Why no framework?**
Static portfolio. React/Vue would be overkill and add unnecessary build complexity. Pure HTML/CSS/JS loads faster, is easier to maintain, and lives happily in an nginx container.

**Why no Nginx as reverse proxy?**
Cloudflare Tunnel points directly at the nginx container serving the static files. No NPM, no Traefik, no extra hop. One container, one job.

**Why Cloudflare Tunnel?**
No static public IP needed. The tunnel establishes an outbound connection from the NAS to Cloudflare — traffic comes in through Cloudflare and gets forwarded to the nginx container on the local network.

**Typography: Cormorant Garamond + DM Sans**
Editorial serif for display text, clean sans-serif for body. The contrast creates the luxury/cinematic feel without relying on gradients or heavy effects.

**Color: #C9A84C (Gold) on #080808 (Near-black)**
Warm, refined, not neon. Works for a technical audience and a general audience equally.

---

## Stack

| Layer | Tech |
|:---|:---|
| Web server | nginx (Docker container) |
| Tunnel | Cloudflare Tunnel (cloudflared container) |
| Host | Ugreen NAS (UGOS) |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| Animations | Vanilla JS · IntersectionObserver · requestAnimationFrame |
| Deploy | Git → SSH pull on NAS |

---

## Repository Structure

```
portfolio/
├── index.html              # Single page, all sections
├── assets/
│   ├── css/
│   │   └── style.css       # All styles, CSS variables, responsive
│   ├── js/
│   │   └── main.js         # Custom cursor, scroll animations, nav
│   └── img/
│       └── photo.jpg       # Hero photo (not committed — add your own)
├── .gitignore
└── README.md
```

---

## Deploy

### Requirements

- Ugreen NAS (UGOS) with Docker
- Cloudflare account with a domain
- `git` on the NAS

### 1. nginx Container

In UGOS Container Manager, create a container with:

```
Image:   nginx:latest
Port:    35181 → 80 (TCP)
Volume:  /volume3/docker/01_Coding/03_Nginx → /usr/share/nginx/html (rw)
```

Set permissions on the host folder:

```bash
chmod 755 /volume3/docker/01_Coding/03_Nginx
```

### 2. Clone repo to NAS

```bash
ssh Richard@192.168.0.99
cd /volume3/docker/01_Coding/03_Nginx
git clone https://github.com/Ri4ards2006/portfolio.git .
```

### 3. Cloudflare Tunnel

In [dash.cloudflare.com](https://dash.cloudflare.com) → Zero Trust → Networks → Tunnels → your tunnel → Public Hostname:

```
Domain:  richardzuikov.com
Type:    HTTP
URL:     192.168.0.99:35181
```

### 4. Update workflow

```bash
# Local — develop and push
git add .
git commit -m "update"
git push origin main

# On NAS — pull latest
ssh Richard@192.168.0.99
cd /volume3/docker/01_Coding/03_Nginx
git pull
```

### 5. Add your photo

Drop your photo into `assets/img/photo.jpg`, then in `index.html` replace:

```html
<!-- Remove this block -->
<div class="hero-img-frame">
  <span class="hero-img-label">Your photo here</span>
</div>

<!-- Add this -->
<img src="assets/img/photo.jpg" alt="Richard Zuikov"
     style="width:38%;height:80%;object-fit:cover;object-position:top center;">
```

---

## Roadmap

- [ ] Add hero photo
- [ ] Dark/light mode toggle
- [ ] Project detail pages (per-project subpages)
- [ ] Blog / notes section (markdown-based)
- [ ] Email via `richardzuikov.com` (self-hosted mail server)
- [ ] CV / resume download button
- [ ] `rz-cloud.work` — service dashboard for self-hosted containers

---

## Background

19-year-old IT Systems Electronics apprentice (IT-Systemelektroniker) based in Flensburg, Germany. Working at the intersection of hardware and software — embedded systems, low-level programming, networking, and OpSec.

**GitHub:** [Ri4ards2006](https://github.com/Ri4ards2006)

---

## License

MIT — see [LICENSE](LICENSE).