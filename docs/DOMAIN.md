# Connecting www.axchannels.co.za

**Current state: not connected.** There is no `CNAME` file in this repository,
so GitHub Pages serves the site at its project URL. Every page's `canonical`
and `og:url` already point at `https://www.axchannels.co.za/`, and
`robots.txt` and `sitemap.xml` point search engines there too.

That mismatch is a launch blocker. Until the domain is connected, the site
tells Google the authoritative copy lives at an address that does not resolve,
which is worse than having no canonical at all.

It could not be checked from the environment this audit ran in — outbound
requests to the domain and to github.io are blocked by that environment's
network policy — so **nothing below has been verified live.** Treat it as the
sequence to follow, then verify each step yourself.

## Order matters

Do these in order. Adding the `CNAME` file before DNS resolves takes the site
off the project URL without putting anything in its place.

### 1. DNS first, at your registrar

For `www` (the address the whole site canonicalises to), add one CNAME record:

| Type  | Name  | Value                          |
|-------|-------|--------------------------------|
| CNAME | `www` | `sphamandla-designer.github.io` |

For the apex (`axchannels.co.za` with no `www`), add four A records so it
redirects to `www`:

| Type | Name | Value             |
|------|------|-------------------|
| A    | `@`  | `185.199.108.153` |
| A    | `@`  | `185.199.109.153` |
| A    | `@`  | `185.199.110.153` |
| A    | `@`  | `185.199.111.153` |

Confirm those four addresses against GitHub's own page first — they are
GitHub's published Pages addresses, but check rather than trust this file:
<https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>

Wait for propagation, then check from a machine with open networking:

```
dig +short www.axchannels.co.za
dig +short axchannels.co.za
```

`www` should answer with `sphamandla-designer.github.io` and then GitHub's
addresses. Do not continue until it does.

### 2. Then the CNAME file

Create a file named `CNAME` at the root of this repository — no extension, one
line, no trailing spaces:

```
www.axchannels.co.za
```

The deploy workflow already keeps `CNAME` when it publishes to `gh-pages`
(`.github/workflows/pages.yml`). Before this audit it did not, and a deploy
would have stripped the file and silently unset the domain.

### 3. Then HTTPS, in GitHub

Repository **Settings → Pages**. The custom domain should show
`www.axchannels.co.za` with a green tick. Tick **Enforce HTTPS**.

The tick box stays greyed out until GitHub has issued the certificate, which
can take up to 24 hours after DNS resolves. Do not launch before it is ticked:
without it the site is reachable over plain HTTP.

### 4. Then verify, live

```
curl -sSI https://www.axchannels.co.za/            # expect 200
curl -sSI http://www.axchannels.co.za/             # expect 301 to https
curl -sSI https://axchannels.co.za/                # expect 301 to www
curl -sS  https://www.axchannels.co.za/robots.txt  # expect the sitemap line
curl -sS  https://www.axchannels.co.za/sitemap.xml # expect nine URLs
```

Then open each of the nine URLs in the sitemap and confirm each returns a page
rather than a 404, including `/privacy/` and `/terms/`.

### 5. Then tell Google

Add the property in Google Search Console, verify it, and submit
`https://www.axchannels.co.za/sitemap.xml`. Use the URL Inspection tool on the
homepage to confirm Google sees the canonical you intend.

## If the domain is not going to be connected at launch

Then the canonicals are wrong and must be changed rather than left pointing at
an address that does not resolve. Every `<link rel="canonical">`, every
`og:url`, `robots.txt` and `sitemap.xml` would need to carry the project URL
instead. Do not leave them pointing at an unconnected domain.
