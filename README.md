<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=F4F0E8&height=140&section=header&text=richardzuikov.com&fontSize=40&fontColor=1a1a18&theme=light&stroke=1a1a18&strokeWidth=1" width="100%" />

  <br/>

  ### Personal Portfolio — Warm Beige · Serif Typography · Self-Hosted

  <sub>Ugreen NAS · Cloudflare Tunnel · nginx · Pure HTML/CSS/JS · DE/EN</sub>

  <br/>

  [![Status](https://img.shields.io/badge/Status-Live-22C55E?style=flat-square)]()
  [![Host](https://img.shields.io/badge/Host-Self--Hosted_NAS-1a1a18?style=flat-square&logo=docker&logoColor=white)]()
  [![Tunnel](https://img.shields.io/badge/Tunnel-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://cloudflare.com)
  [![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

</div>

---

## What This Is

Personal portfolio and digital business card at **[richardzuikov.com](https://richardzuikov.com)**.

Minimalist warm-beige aesthetic — editorial serif typography (EB Garamond), generous whitespace, dark/light mode toggle, DE/EN language switch. Multi-page structure: Home, About, Projects, Timeline, Work Together, Contact.

Self-hosted on a Ugreen NAS via Cloudflare Tunnel. No public IP, no reverse proxy, no overengineering.

---

## Design Decisions

**Why no framework?**
Static portfolio. React/Vue adds unnecessary build complexity. Pure HTML/CSS/JS loads instantly, is trivial to maintain, and runs happily in an nginx container.

**Why no Nginx as reverse proxy?**
Cloudflare Tunnel points directly at the nginx container. No NPM, no Traefik, no extra hop. One container, one job.

**Why Cloudflare Tunnel?**
No static public IP needed. Configured via Cloudflare API since the new Zero Trust UI removed public hostname management.

**Typography: EB Garamond + DM Sans**
Editorial serif for display text, clean sans-serif for UI. Technical-yet-refined feel without heavy effects.

**Color: #F4F0E8 (warm beige) · #1a1a18 (near-black)**
Light mode default. Dark mode via toggle, stored in `localStorage` across all pages.

---

## Stack

| Layer | Tech |
|:---|:---|
| Web server | nginx (Docker, port 35181) |
| Tunnel | Cloudflare Tunnel (cloudflared, token-based) |
| Host | Ugreen NAS (UGOS), `/volume3/docker/01_Coding/03_Nginx` |
| Fonts | EB Garamond + DM Sans (Google Fonts) |
| JS | Vanilla — cursor, scroll, dark/light toggle, DE/EN i18n |
| Deploy | local → git push → SSH pull on NAS |

---

## Structure

```
portfolio/
├── index.html              # Home — hero, photo, tagline, buttons
├── about.html              # Profile, skills, currently
├── projects.html           # Project cards with images
├── contact.html            # Contact info and links
├── timeline.html           # Full career timeline from CV
├── worktogether.html       # Services offered
├── assets/
│   ├── css/style.css       # All styles — variables, dark mode, responsive
│   ├── js/main.js          # Cursor, scroll, theme toggle, lang toggle
│   └── img/
│       ├── richard-foto.jpg
│       ├── clock.jpg
│       ├── ampel.jpg
│       ├── weather.jpg
│       ├── gocore.jpg
│       ├── homelab.jpg
│       └── messplatz.jpg
├── .gitignore
└── README.md
```

---

## Deploy

### nginx Container (UGOS)

```
Image:   nginx:latest
Port:    35181 → 80 (TCP)
Volume:  /volume3/docker/01_Coding/03_Nginx → /usr/share/nginx/html (rw)
Network: cloudflare-tunnel_default
```

```bash
chmod 755 /volume3/docker/01_Coding/03_Nginx
```

### Cloudflare Tunnel — ingress via API

```bash
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/cfd_tunnel/<TUNNEL_ID>/configurations" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"config":{"ingress":[{"hostname":"richardzuikov.com","service":"http://nginx-1:80"},{"service":"http_status:404"}]}}'
```

### Clone & update

```bash
# First time
ssh Richard@192.168.0.200
cd /volume3/docker/01_Coding/03_Nginx
git clone https://github.com/Ri4ards2006/portfolio.git .

# Update
git add . && git commit -m "update" && git push origin main
ssh Richard@192.168.0.200 "cd /volume3/docker/01_Coding/03_Nginx && git pull"
```

---

## Roadmap

- [ ] Hero photo + project images
- [x] Dark / light mode toggle
- [x] DE / EN language toggle
- [x] Timeline page (full CV)
- [x] Work Together / Services page
- [ ] EN translations for page content
- [ ] Project detail subpages
- [ ] Email via `richardzuikov.com`
- [ ] CV download button
- [ ] `rz-cloud.work` — self-hosted services dashboard

---

## Background

19-year-old IT-Systemelektroniker apprentice at R2P GmbH, Flensburg. Hardware, embedded systems, low-level programming, networking, home lab.

**GitHub:** [Ri4ards2006](https://github.com/Ri4ards2006)

---

MIT — see [LICENSE](LICENSE).
