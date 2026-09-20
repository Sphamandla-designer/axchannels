# AX-Channels — Website

Static, dependency-free site for AX-Channels.

The home page is a direct implementation of the uploaded design,
**`AX DESIGN HOME PAGE.pdf`** (1920 × 9066 desktop artboard). Section order,
copy, imagery, colour and spacing are taken from that file — it is the source
of truth for the home page.

## Structure

```
index.html                    Home — implementation of AX DESIGN HOME PAGE.pdf
assets/css/home.css           Home design system (tokens + components)
assets/js/home.js             Mobile nav panel + selected-work swap
assets/img/home/              Images taken from the uploaded design materials
services/                     Services overview  (Service page.png)
services/web-design/          Web design service (web design.png)
assets/css/site.css           Design system for the services pages
assets/js/site.js             Behaviour for the services pages
```

## Home page implementation notes

**Typeface** — Archivo (variable, Google Fonts). Weights were matched to the
design by measuring stem widths and line widths in the PDF: headings 500,
body 400, hero H1 700 with `perform` at 880, service titles 700.

**Sizing** — every size is the design value expressed fluidly,
`design px / 1920 × 100 = vw`, clamped so small screens stay readable
(e.g. the 55px section heading is `clamp(27px, 2.8646vw, 55px)`). The vertical
rhythm tokens in `home.css` (`--sp-203`, `--sp-91`, …) are gaps measured
directly off the artboard, so the rendered page is 9067px tall against the
design's 9066px, with every section landing within ~15px of its design
position.

**Sections** (in design order): hero · UX-led studio introduction ·
experience/clients stats · services (4 cards) · selected work · testimonials ·
the work in numbers · contact CTA · footer.

**Images** — extracted from `AX DESIGN HOME PAGE.pdf` and from the uploaded
`AX Background.png`, `AX Image hero.png`, `Mockup 14 (3) 1.png` and
`1758105469086.png`. No stock or placeholder imagery.

**Interactions** — restrained, as in the design: nav/button/link hover states,
a project-card image zoom, the `SWAP` control on selected work (rotates the
pair on desktop, scrolls the track on smaller screens) and a mobile nav panel.
Testimonials and selected work are scroll-snapped and keyboard reachable.

**Responsive** — four intentional layouts rather than a shrunk desktop:
large desktop (≥1401), standard desktop (1101–1400), tablet (721–1100,
pill nav becomes a panel, services go 2-up, work shows one project at a time,
the vertical `Design + Strategy` rail becomes a horizontal eyebrow) and
mobile (≤720, single-column cards, stacked CTA links, stacked footer).

## Known deviations from the design

- **Contrast.** Two greys taken verbatim from the design fall below WCAG AA for
  normal-size text: the service-card eyebrow `#b4b8bf` and the testimonial role
  `#aaabae` on white (~2:1), and the project category `#727775` on `#1f1f23`
  (3.6:1). They were kept because the design is the source of truth; darkening
  them (e.g. `#8c9098` and `#848985`) would clear AA with a small visual change.
- **Case-study pages** do not exist yet, so `View Case Study` and
  `See All Projects` link to the selected-work section.
- **Social URLs** point at linkedin.com / instagram.com — replace with the real
  AX-Channels profile URLs.

## Deployment

Pushes to `claude/ax-channels-website-oycl4p` auto-publish to the `gh-pages`
branch via GitHub Actions → served at GitHub Pages.
