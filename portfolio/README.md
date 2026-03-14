# richardzuikov.com

Personal portfolio site — static HTML/CSS/JS, served via nginx on a self-hosted Ugreen NAS through a Cloudflare Tunnel.

## Stack
- Pure HTML5 / CSS3 / Vanilla JS
- Fonts: Cormorant Garamond + DM Sans (Google Fonts)
- Hosted: nginx container on Ugreen NAS
- Tunnel: Cloudflare Tunnel (cloudflared)
- Domain: richardzuikov.com

## Structure
```
portfolio/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/          ← put your photo here
├── .gitignore
└── README.md
```

## Adding your photo
Replace the placeholder in `index.html`:
```html
<!-- Remove this: -->
<div class="hero-img-frame">
  <span class="hero-img-label">Your photo here</span>
</div>

<!-- Add this: -->
<img src="assets/img/photo.jpg" alt="Richard Zuikov" style="width:38%;height:80%;object-fit:cover;object-position:top center;">
```

## Deploy to NAS
```bash
# On NAS via SSH
cd /volume3/docker/01_Coding/03_Nginx
git pull
```
