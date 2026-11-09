# richardzuikov.com

Personal portfolio website of Richard Zuikov. A single-page app, German/English, light/dark theme.

## Pages

| Route | Content |
|---|---|
| `/` | Menu home (placeholder for now) |
| `/quick` | Quick Read: long-scroll landing |
| `/lab` | Projects |
| `/impressum` | Legal notice / privacy (also served at `/datenschutz` and `/legal`) |

`/about`, `/career` and `/contact` redirect to the matching section of `/quick`.
`/works`, `/portfolio` and `/dev` redirect to `/lab`.

## Stack

From `package.json`:

- React 18, React Router 6
- Vite 5 (`@vitejs/plugin-react`)
- Tailwind CSS 3 + Sass (`src/css/style.scss`)
- framer-motion (animations), lucide-react (icons)
- clsx + tailwind-merge (`cn()` in `src/lib/utils.js`)

## Development

```sh
npm i
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build` (output in `dist/`), `npm run preview`.

## Deployment

Deployed on Vercel from this repository. Vercel runs `npm run build` and serves `dist/`.
`.npmrc` sets `legacy-peer-deps=true`, which the Vercel install relies on.

## Structure

```
public/            static files (CV PDF)
src/
  main.jsx         entry point
  App.jsx          router and routes
  pages/           one file per route
  components/      layout, header, menu, footer, intro screen, terminal
  components/ui/   carousel, certificate modal
  hooks/           language, theme, outside-click
  lib/             translations (DE/EN), cn() helper
  css/             global styles
  assets/          images
```
