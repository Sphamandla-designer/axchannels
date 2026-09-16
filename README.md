# AX-Channels — Website

Implementation of the uploaded AX-Channels design pages (`AX Home page.png`,
`Service page.png`, `web design.png`) as a dependency-free static site.

## Structure

```
index.html                    Home (AX Home page.png)
services/                     Services overview (Service page.png)
services/web-design/          Web design service + packages + FAQ (web design.png)
assets/css/site.css           Design system implementation
assets/js/site.js             Nav, dropdown, carousels, FAQ accordion
assets/img/                   Image assets extracted from the design files
```

Fonts: Poppins (sans) + EB Garamond (serif) via Google Fonts.
Colors: dark #101317/#14181f · light #fafafa · cyan #00afd3.

## Deployment

Pushes to `claude/ax-channels-website-oycl4p` auto-publish to the `gh-pages`
branch via GitHub Actions → served at GitHub Pages.

## Notes

- Copy is implemented verbatim from the design files (including as-designed
  wording such as "How To Optimist Your Website" and "Stranger Brand Authority").
- Contact points use hello@axchannels.co.za — update if the address differs.
- FAQ answers beyond the first (open) one are not visible in the design and
  were written to match the shown copy/pricing.
