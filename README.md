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

**The work in numbers** is implemented from a separately supplied reference
panel, not from the PDF: a dark inset panel divided by hairlines into a 3 × 3
asymmetric grid (columns 33.4 / 33.2 / 33.4, rows 24.7 / 33.2 / 42.1, panel
ratio 1.763 : 1), with the heading across the two upper left cells, a lit
statement field bottom left, three statistics and a photograph bleeding into
the bottom right corner. Grid ratios, rule positions, the numeral weight
(Archivo 200, from a 0.077 stroke-to-cap measurement), the raised suffix at
26% of the numeral and the gradient stops behind the statement were all
measured off that reference. It replaces the earlier `stats design.png`
"Design Wall" composition. `Industries Served` was dropped at the client's
request; the remaining figures and all copy are unchanged.

*Deliberate deviation.* The reference's own gradient brightens under its last
line of type, which would put white on roughly `#95a4ae` (2.6 : 1). The stops
in `home.css` §21 keep its hue and its flare at the foot of the cell but hold
the band the statement sits on dark enough to clear AA at every width (worst
case measured 9.4 : 1). Restoring the literal ramp is a one-line change to
that `linear-gradient`.

**Images** — extracted from `AX DESIGN HOME PAGE.pdf` and from the uploaded
`AX Background.png`, `AX Image hero.png`, `Mockup 14 (3) 1.png` and
`1758105469086.png`. No stock or placeholder imagery.

**Interactions & motion** — the design is unchanged; a motion layer
(`home.css` §16 + `home.js`) adds life on top of it:

- *Tokens*: fast .22s / medium .45s / slow .85s, two easing curves — every
  animation uses them. Only `transform`/`opacity` are animated.
- *Entrance* (≤1.2s): masthead drops in, the Design+Strategy rail draws,
  the H1 reveals line-by-line through masks, lead → categories → CTAs
  stagger in, the portrait and display type settle last.
- *Scroll reveals*: one IntersectionObserver; `data-reveal` /
  `data-reveal="img"` (frame rises while the image settles from 1.06×) /
  `data-stagger` (children auto-delay 70ms, capped at 8). Reveal once.
- *Counters*: the Work In Numbers values count up (900ms ease-out cubic)
  to exactly the approved figures, once, on entry. The `+` is a separate
  `.num__suffix` element present in the markup, so the panel is already
  correct with JS off and under reduced motion; the counter writes only
  the digits.
- *Depth*: hero portrait lags scroll 10%, hero copy 5% with a gentle fade,
  the AX watermark drifts ±36px — desktop fine-pointers only, one
  rAF-throttled passive listener, custom properties consumed by CSS.
- *Micro*: arrow icons nudge ↗ on button hover/focus, press scales .985,
  service/work imagery scales ≤1.04 on hover, testimonial/stat cards lift,
  the work `SWAP` is a directional crossfade, the mobile nav panel fades
  and staggers its links.
- *Accent layer* (`home.css` §17): art direction from the GEMIS Studio
  reference — one hot accent word per editorial heading (the accent
  `#ff3d8a` / `#e0176b` is the hero's own magenta glow, brightened),
  a JetBrains Mono micro-label system (eyebrows, categories, footer
  heads, legal), underlined mono arrow CTAs on the case-study links,
  a full-bleed marquee word ticker with a Pause Motion control,
  numbered service cards with accent top rules, and a live SAST clock
  in the footer.
- *Living hero* (`home.css` §18): the uploaded `AX Background.png` is the
  untouched hero foundation (served as `hero-bg-ring.jpg`); layered
  overlays give it life — the neon ring's highlights rotate seamlessly
  (22s, linear), cyan/magenta washes slowly trade intensity and position
  (14s/18s alternating), and two soft light bodies drift through the fog
  (9.5s/12.5s). All layers animate transform/opacity only, sit under the
  readability scrim and content, hold a calm lit state under reduced
  motion, and drift a few pixels with the pointer on desktop.
- *Safety nets*: all pre-reveal states are gated on `html.js-motion`
  (added by JS) so no-JS visitors get the finished page, and on
  `prefers-reduced-motion: no-preference` — reduced-motion users get the
  complete static page. The services pages share the same language via
  `site.css`/`site.js`.

**Responsive** — four intentional layouts rather than a shrunk desktop:
large desktop (≥1401), standard desktop (1101–1400), tablet (721–1100,
pill nav becomes a panel, services go 2-up, work shows one project at a time,
the vertical `Design + Strategy` rail becomes a horizontal eyebrow) and
mobile (≤720, single-column cards, stacked CTA links, stacked footer).

## Known deviations from the design

- **Contrast.** Two greys from the design were darkened for WCAG AA: the
  service-card eyebrow `#b4b8bf` → `#73767a` and the testimonial role
  `#aaabae` → `#757678` (both ~2:1 → 4.6:1 on white; the lightest same-hue
  values that pass). Still below AA for normal-size text: the project
  category `#727775` on `#1f1f23` (3.6:1 — passes only the 3:1 large-text
  bar); lightening it (e.g. `#9296a0`) would clear AA if wanted.
- **Case-study pages** do not exist yet, so `View Case Study` and
  `See All Projects` link to the selected-work section.
- **Social URLs** point at linkedin.com / instagram.com — replace with the real
  AX-Channels profile URLs.

## Deployment

Pushes to `claude/ax-channels-website-oycl4p` auto-publish to the `gh-pages`
branch via GitHub Actions → served at GitHub Pages.
