# Meridian Group: website demo

A demo for a three-company group: **Meridian Build Pvt. Ltd.** (parent, construction), **Meridian Interiors** and **Meridian Glass Studio**. The site is plain HTML/CSS/JS with no build step.

## Run locally
```bash
npx serve .          # or: python -m http.server 4600
```
Open the URL it prints. Paths are root-relative, so serve the folder rather than opening the files directly.

## Swap in the real client details
- **Names, phones, WhatsApp, emails, form keys:** `assets/js/site-config.js`. Each division needs its own [Web3Forms](https://web3forms.com) access key. While a key starts with `YOUR-`, the form runs in demo mode and only opens WhatsApp.
- **Copy and figures:** lines marked `DEMO` in the HTML are placeholders. Replace them with the client's real figures.
- **Photos:** `assets/img/{group,interiors,glass}/`. Replace each file with the same name. Every current image is a stock placeholder (see `CREDITS.md`), and all of them must be replaced before launch.
- **3D videos:** follow `prompts/PROMPTS.md`. Encoded clips placed in `assets/video/` replace the stills automatically.
- **Reviews:** there is a slot on the home page, to be filled from the client's Google Maps reviews. Never use invented testimonials.
- **Map:** `contact.html` has an iframe. Swap in the client's own Google Maps embed.
- **Footer credit:** `SITE.agency` in `site-config.js`.

## Structure
| Path | Purpose |
|---|---|
| `index.html`, `projects.html`, `about.html`, `contact.html` | Group / Build |
| `interiors/` | Interiors division (overview, portfolio, services) |
| `glass-art/` | Glass Art division (overview, gallery, services) |
| `assets/css/site.css` | Design system. `<body data-division>` switches the palette. |
| `assets/js/layout.js` | Header + division switcher, footer, WhatsApp button, filters, form |
| `assets/js/motion-site.js` | Motion + Lenis: zoom-through hero, project reel, room reveal, prismatic light, page wipe, reveals |

## Deploy (after approval)
Push to GitHub, then create a Cloudflare Pages project from the repo: no build command, output directory `/`. The demo gets a `*.pages.dev` URL. Attach the client's domain once the deal closes.
