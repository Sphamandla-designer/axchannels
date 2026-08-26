# AX-Channels — Website

**We turn complexity into digital clarity.**

Premium static website for AX-Channels, a digital product & experience studio in
Johannesburg, South Africa. Built as dependency-free HTML/CSS/JS — no build step,
deployable on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Structure

```
index.html               Homepage — locked 13-section narrative
work/                    Portfolio index
work/finos/              Case study — FINOS (financial intelligence)
work/wastemart/          Case study — WasteMart (recycling operations)
work/managem/            Case study — ManaGem (management workspace)
capabilities/            Four capabilities + FAQs
insights/                Editorial essays
johannesburg/            Local context page
start-a-project/         Commercial entry / contact
assets/css/main.css      Design system (palette, type, components, object language)
assets/css/home.css      Homepage compositions & scroll scenes
assets/css/page.css      Interior page layouts
assets/js/main.js        Interaction system (hero assembly, scroll scenes, explorers)
```

## Locked brand system

- Palette: `#020618` `#F8BD00` `#00AFD3` `#FFFFFF` `#FAFAFA` `#6A7181` (only)
- Type: Lexend 400/500/600/700 (Google Fonts)
- Core idea: **Complexity → Connection → Clarity**

## Before go-live

- Confirm/replace contact email `hello@axchannels.co.za` (footer, start-a-project).
- Replace domain `https://www.axchannels.co.za/` in `sitemap.xml` / `robots.txt`
  if the production domain differs.
- ManaGem case copy is written conservatively; drop in approved project detail
  from the strategy documents when available.

## Accessibility & performance

- All motion honours `prefers-reduced-motion` (scenes render in their final state).
- All visuals are inline SVG/CSS — no image payloads, no external JS dependencies.
- All narrative content exists as real HTML text for SEO.
