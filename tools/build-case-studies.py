#!/usr/bin/env python3
"""Generate the per-project case-study pages from case-studies/index.html.

    python3 tools/build-case-studies.py

The shared shell (masthead, closing CTA, footer, enquiry drawers, script)
is lifted from case-studies/index.html so the pages never drift from the
rest of the site. Edit the copy in PROJECTS below, then re-run. Output:
case-studies/<slug>/index.html.
"""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = (ROOT / "case-studies/index.html").read_text(encoding="utf-8")
SITE = "https://www.axchannels.co.za"

PROJECTS = [
  {
    "slug": "cmaxx",
    "name": "CMAXX",
    "title_tag": "CMAXX Website Case Study — WiFi, Network & Security | AX-Channels",
    "description": "How AX-Channels restructured and built the CMAXX website so visitors can find their connectivity problem, trust the company and ask for an assessment.",
    "eyebrow": "Case Study · CMAXX",
    "h1": 'Connectivity, Made <span class="mark">Clear</span>',
    "lead": "CMAXX sells WiFi, CCTV, cabling and cloud services to homes and businesses. We restructured the offering so a visitor can recognise their problem, trust the company and ask for an assessment &mdash; then designed and built the site.",
    "hero_img": ("/assets/img/home/work-cmaxx.webp", 1500, 1125),
    "og_img": "/assets/img/home/work-cmaxx.jpg",
    "facts": [("Project", "Client Project &middot; Live"), ("Service", "Website Design &amp; Development"),
              ("Scope", "UX Strategy, IA, UI, WordPress Build"), ("Status", "Live, Still Iterating")],
    "problem": {
      "eyebrow": "The Problem",
      "h2": 'Four Divisions, Five Kinds Of Customer, One <span class="mark">Website</span>',
      "lead": "CMAXX does four different jobs &mdash; WiFi and networks, CCTV and security, cabling and infrastructure, cloud and Microsoft 365 &mdash; for homeowners, offices, restaurants, retailers and events.",
      "body": "Nobody arrives looking for &ldquo;structured cabling&rdquo;. They arrive with a dead zone in the back bedroom, or a connection they pay for and don&rsquo;t get. The site had to close the gap between the customer&rsquo;s symptom and the company&rsquo;s service names.",
      "items": [
        ("Seven service lines, one menu", "Grouped so a stranger can pick their own, without a mega-menu the client&rsquo;s team couldn&rsquo;t maintain."),
        ("Eighteen technology partners", "A real credential, and a layout problem: logos of every shape that had to read as one strip, not a wall of badges."),
        ("A fixed brand", "The mark, orange and navy were set. The tone had to feel technical without feeling aggressive."),
        ("Built to be kept up", "WordPress and Elementor, so the client&rsquo;s own team can keep editing after handover."),
      ],
    },
    "bg_img": ("/assets/img/mockups/cmaxx-dark.webp", 2200, 1650),
    "steps": {
      "h2": 'Four Decisions That Shaped The <span class="mark">Site</span>',
      "sub": "Structure first, interface second. Each one answers a specific problem.",
      "items": [
        ("Lead with the problem, not the catalogue", "A &ldquo;common problems we solve&rdquo; section &mdash; dead zones, slow speed, security gaps, downtime &mdash; sits before the services, so visitors recognise their situation before they meet the company&rsquo;s vocabulary.", "four symptom cards, written in the customer&rsquo;s words."),
        ("Two levels deep, no deeper", "The homepage answers &ldquo;is this relevant to me?&rdquo;. Seven service pages carry the detail for visitors who have already chosen. Sector and location pages are separate ways in.", "nine top-level destinations, one level deep."),
        ("One next step, everywhere", "Every section leads to the same action, a free assessment, with call and WhatsApp beside it. Asking for a diagnosis is a smaller ask than asking for a sale.", "a single enquiry path reachable from every page."),
        ("Design the phone menu first", "Most visitors arrive on a phone, mid-problem. If the deepest menu works in a drawer, desktop is easy &mdash; and service names stay short enough to read at 320px.", "a drawer with services expanding in place and contact details inside it."),
      ],
    },
    "shots": {
      "phones": False,
      "items": [
        ("/assets/img/mockups/cmaxx-dark.webp", 2200, 1650, "The CMAXX homepage on a laptop: headline, trust markers and the assessment action above the fold", "The homepage: positioning, trust markers and the assessment action in the first screen."),
        ("/assets/img/cases/cmaxx-portal.webp", 1600, 1200, "The CMAXX brand on a guest WiFi sign-in screen shown on a phone", "The CMAXX brand carried onto mobile."),
      ],
    },
    "outcome": {
      "h2": 'What Shipped, And What We Would <span class="mark">Measure</span>',
      "sub": "The site is live and still being iterated. No analytics have been shared with us yet, so this page makes no performance claims.",
      "done_t": "Delivered",
      "done": ["Production website, live", "Service structure across seven lines", "Navigation the client&rsquo;s team can maintain", "Responsive from 320px up", "Assessment, call and WhatsApp paths on every page", "Search foundations: headings, titles, clean URLs"],
      "next_t": "Measure next",
      "next": ["Assessment-form completions", "Which call-to-action positions earn their place", "A tree test of the seven service names", "Mobile versus desktop behaviour"],
      "fine": "A backlog, not results.",
    },
    "quote": ("The redesign finally explains our connectivity offering in plain language, and the path from first visit to enquiry is much stronger.", "Lolita", "CMAXX &middot; Website Redesign"),
    "next": ("wastemart", "WasteMart"),
  },
  {
    "slug": "finos",
    "name": "FINOS",
    "title_tag": "FINOS Case Study — AI Financial Decision Product | AX-Channels",
    "description": "FINOS, a self-initiated AX-Channels concept: a financial operating system where AI analyses and explains, and people stay in control of consequential decisions.",
    "eyebrow": "Case Study · FINOS",
    "h1": 'Better Decisions, Not More <span class="mark">Dashboards</span>',
    "lead": "A self-initiated product concept: a financial operating system where AI does the analysis and explains itself, and a person stays in charge of every consequential decision.",
    "hero_img": ("/assets/img/home/work-finos.webp", 1500, 1125),
    "og_img": "/assets/img/home/work-finos.jpg",
    "facts": [("Project", "Exploration &middot; Self-Initiated"), ("Service", "Digital Product Design &middot; AI UX"),
              ("Scope", "Strategy, UX Architecture, AI UX, Prototype"), ("Status", "Interactive Prototype, v1.4.1")],
    "problem": {
      "eyebrow": "The Problem",
      "h2": 'Financial Decisions Are Rarely About One <span class="mark">Number</span>',
      "lead": "Buying a property, moving money or cutting a commitment means joining accounts, investments, bills and goals into one picture, then weighing trade-offs that play out over years.",
      "body": "AI can make that faster, and creates a new problem: a recommendation nobody can see into is one nobody should act on. Our exploratory research kept returning four patterns.",
      "items": [
        ("Context is scattered", "The hard part isn&rsquo;t finding each number. It&rsquo;s assembling them into one picture before deciding."),
        ("Recommendations need reasons", "An answer without its assumptions can&rsquo;t be judged, only obeyed."),
        ("Trust needs room to disagree", "People need to challenge an assumption, not just accept or reject the result."),
        ("Control should scale with risk", "The bigger the commitment, the more deliberate the approval should be."),
      ],
    },
    "bg_img": ("/assets/img/cases/finos-decision.webp", 1600, 1056),
    "steps": {
      "h2": 'One Decision, Designed End To <span class="mark">End</span>',
      "sub": "One question tested the whole system: can I buy a R1.5M property without compromising my financial goals?",
      "items": [
        ("Establish the position first", "The Command Center shows net worth, liquidity, investments and debt &mdash; and what changed since the last visit &mdash; before any question is asked.", "the whole financial picture on one screen."),
        ("Turn the question into a model", "The Scenario Builder turns &ldquo;can I afford it?&rdquo; into inputs you can move &mdash; price, deposit, rate, term, reserve &mdash; and compares conservative, balanced and growth approaches.", "side-by-side strategies with their trade-offs."),
        ("An argument, not an answer", "Each recommendation carries its reasoning, assumptions, risks and confidence. Change an assumption and it recalculates, so you can disagree with the input rather than the system.", "challengeable recommendations in the Decision Room."),
        ("Approval is an act", "Consequential actions need an explicit approval, and the reasoning is stored with the decision so it can be reviewed later.", "approvals and a decision history."),
      ],
    },
    "shots": {
      "phones": False,
      "items": [
        ("/assets/img/cases/finos-decision.webp", 1600, 1056, "FINOS Decision Room asking whether a R1,500,000 property can be bought without compromising financial goals, with a balanced recommendation and its reasoning", "The Decision Room: the question, the assessment, and the recommendation with its reasoning."),
        ("/assets/img/cases/finos-command.webp", 1600, 1056, "FINOS Command Center showing net worth, liquid assets, investments, debt and items that need attention", "Command Center: the position, and what changed since the last visit."),
        ("/assets/img/cases/finos-scenarios.webp", 1600, 1056, "FINOS Scenario Builder with adjustable property price, deposit, interest rate and term, and a comparison of approaches", "Scenario Builder: inputs you can move, and approaches compared."),
      ],
    },
    "outcome": {
      "h2": 'What It Shows, And What It Doesn&rsquo;t <span class="mark">Yet</span>',
      "sub": "FINOS is a prototype. Its AI behaviour is simulated, the research was exploratory, and there are no business metrics to report &mdash; so none are reported.",
      "done_t": "What the prototype demonstrates",
      "done": ["A decision-centred product model", "Explainable, challengeable AI recommendations", "Approval that scales with the consequence", "Decisions that keep their reasoning", "One connected, end-to-end experience"],
      "next_t": "Validate next",
      "next": ["Research with people making real decisions", "Financial accuracy, with qualified experts", "AI reliability and how it handles uncertainty", "Security, privacy and regulation"],
      "fine": "The next phase, not completed work.",
    },
    "quote": None,
    "next": ("cmaxx", "CMAXX"),
  },
  {
    "slug": "wastemart",
    "name": "WasteMart",
    "title_tag": "WasteMart Case Study — Field Operations Mobile App | AX-Channels",
    "description": "WasteMart, a self-initiated AX-Channels concept: a mobile app that guides waste-collection drivers through the working day and leaves a record the office can trust.",
    "eyebrow": "Case Study · WasteMart",
    "h1": 'Software For Work In <span class="mark">Motion</span>',
    "lead": "A self-initiated product concept: a mobile app that guides waste-collection drivers through the working day, and leaves a record the office can trust afterwards.",
    "hero_img": ("/assets/img/home/work-wastemart.webp", 1100, 825),
    "og_img": "/assets/img/home/work-wastemart.jpg",
    "facts": [("Project", "Concept &middot; Self-Initiated"), ("Service", "Digital Product Design &middot; Mobile UX"),
              ("Scope", "Workflow Design, UI, Design System, Prototype"), ("Status", "Working Prototype, 29 Screens")],
    "problem": {
      "eyebrow": "The Problem",
      "h2": 'The Work Happens Outside. The App Has To Keep <span class="mark">Up</span>',
      "lead": "A driver&rsquo;s day is a run of scheduled jobs, check-ins, bin swaps, manifests, photos, barcode scans, customer sign-offs, dump and fuel records &mdash; often with patchy signal.",
      "body": "A mistake in one step can surface hours later, for someone who wasn&rsquo;t there. So we designed for two people: the driver creating the record, and whoever reviews it afterwards. At any moment the app has to answer four questions.",
      "items": [
        ("What am I doing now?", "The active job and its next action are always the first thing on screen."),
        ("What&rsquo;s already done?", "Progress through the day is shown, not remembered."),
        ("What still needs to happen?", "Missing details and pending uploads surface before they become problems."),
        ("What if something goes wrong?", "Mismatches, corrections and lost signal are handled inside the flow, not by stopping it."),
      ],
    },
    "bg_img": ("/assets/img/home/work-wastemart.webp", 1100, 825),
    "steps": {
      "h2": 'One Job. One Next <span class="mark">Action</span>',
      "sub": "The complexity lives in the system, not in the driver&rsquo;s head.",
      "items": [
        ("The workflow drives the screen", "Each job moves from assigned to checked in, captured, manifest saved and completed. The main button changes with the state, so the driver never has to work out what comes next.", "a state-driven job list the driver can reorder mid-shift."),
        ("Four kinds of proof, not one", "Manifest photos, bin photos, scanned recycling bags and a drawn customer signature are separate flows, because each proves something different.", "a manifest that can&rsquo;t be saved without sign-off."),
        ("Flag it, don&rsquo;t block it", "If a scanned bin number doesn&rsquo;t match, the driver can re-check, continue or flag it for review. Finished records lock, and every correction is logged.", "non-blocking checks and an edit history on the record."),
        ("Ending the day is a review", "End Day lists completed jobs, remaining work, pending uploads and failed syncs. Closing early needs a reason, so the office sees why, not just what.", "a two-step close-out, plus a visible offline and sync status."),
      ],
    },
    "shots": {
      "phones": True,
      "items": [
        ("/assets/img/cases/wastemart-scan.webp", 780, 1688, "WasteMart recycling screen with three scanned bag barcodes and waste-type tags", "Scanning recycling bags into a running list."),
        ("/assets/img/cases/wastemart-signoff.webp", 780, 1688, "WasteMart customer sign-off screen with name fields and a drawn signature", "Customer sign-off, drawn on screen."),
        ("/assets/img/cases/wastemart-endday.webp", 780, 1688, "WasteMart End Workday review listing completed jobs, remaining jobs, pending uploads and failed syncs", "Ending the day: a review, not a button."),
      ],
    },
    "outcome": {
      "h2": 'A Complete Workflow, Not A Set Of <span class="mark">Screens</span>',
      "sub": "WasteMart is a working prototype, not a deployed product. No user research, usability results or business metrics are claimed.",
      "done_t": "What we built",
      "done": ["29 interactive screens", "A job flow from assignment to end of day", "Four separate evidence flows", "A logged correction trail", "Offline and sync states", "A token-based design system for field use"],
      "next_t": "Test next",
      "next": ["Put it in front of real drivers and dispatchers", "Find which decisions hold up in the field", "Measure close-out completeness and correction rates"],
      "fine": "The next phase, not completed work.",
    },
    "quote": None,
    "next": ("finos", "FINOS"),
  },
]

# --------------------------------------------------------------------------- shell
def between(a, b):
    i = SRC.index(a); j = SRC.index(b, i)
    return SRC[i:j]

masthead = between('  <div class="masthead">', '  <nav class="crumbs"')
masthead = masthead.replace(' aria-current="page">Case Studies', '>Case Studies')
closing = between('<!-- ===================================================== CONTACT + FOOTER -->', '<script>\n/* Discipline filter')
closing = closing.replace('<a href="/case-studies/" aria-current="page">', '<a href="/case-studies/">')
head_links = between('<link rel="icon"', '\n<script type="application/ld+json">')

e = html.unescape


def page(p):
    url = f"{SITE}/case-studies/{p['slug']}/"
    hi, hw, hh = p["hero_img"]
    bi, bw, bh = p["bg_img"]
    title_plain = re.sub(r"<[^>]+>", "", p["h1"])
    crumbs = json.dumps({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Case Studies", "item": SITE + "/case-studies/"},
            {"@type": "ListItem", "position": 3, "name": p["name"]},
        ]}, indent=2)
    article = json.dumps({
        "@context": "https://schema.org", "@type": "Article",
        "headline": f"{p['name']}: {e(title_plain)}", "description": p["description"],
        "url": url, "image": SITE + p["og_img"],
        "author": {"@type": "Organization", "name": "AX-Channels", "url": SITE + "/"},
        "publisher": {"@type": "Organization", "name": "AX-Channels", "url": SITE + "/"},
    }, indent=2, ensure_ascii=False)

    facts = "\n".join(f"    <div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in p["facts"])
    prob = p["problem"]
    prob_items = "\n".join(f"        <li><h3>{t}</h3><p>{d}</p></li>" for t, d in prob["items"])
    steps = "\n".join(
        f"""        <li class="svc-step">
          <span class="svc-step__n">{i:02d}</span>
          <h3 class="svc-step__t">{t}</h3>
          <p class="svc-step__p">{d}</p>
          <p class="svc-step__out"><span>Shipped</span> {o}</p>
        </li>""" for i, (t, d, o) in enumerate(p["steps"]["items"], 1))
    shots = p["shots"]
    shot_items = "\n".join(
        f"""        <figure data-reveal="fade">
          <img src="{s}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async">
          <figcaption>{cap}</figcaption>
        </figure>""" for s, w, h, alt, cap in shots["items"])
    o = p["outcome"]
    done = "\n".join(f"            <li>{x}</li>" for x in o["done"])
    nxt = "\n".join(f"            <li>{x}</li>" for x in o["next"])
    quote = ""
    if p["quote"]:
        q, who, role = p["quote"]
        quote = f"""
      <figure class="svc-quote cs-pull" data-reveal="fade">
        <blockquote><p>{q}</p></blockquote>
        <figcaption><b>{who}</b><span>{role}</span></figcaption>
      </figure>"""
    nslug, nname = p["next"]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p['title_tag']}</title>
<meta name="description" content="{p['description']}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="article">
<meta property="og:site_name" content="AX-Channels">
<meta property="og:title" content="{p['name']} Case Study | AX-Channels">
<meta property="og:description" content="{p['description']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}{p['og_img']}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{p['name']} Case Study | AX-Channels">
<meta name="twitter:description" content="{p['description']}">
<meta name="twitter:image" content="{SITE}{p['og_img']}">
{head_links}
<script type="application/ld+json">
{crumbs}
</script>
<script type="application/ld+json">
{article}
</script>
</head>
<body class="svc-page">
<!-- Generated by tools/build-case-studies.py. Edit the copy there, not here. -->

<a class="skip-link" href="#main">Skip to content</a>

<header class="svc-hero" id="top">
  <span class="svc-hero__atmo" aria-hidden="true"><i></i><i></i></span>

{masthead}
  <nav class="crumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/case-studies/">Case Studies</a></li>
      <li aria-current="page">{p['name']}</li>
    </ol>
  </nav>

  <div class="svc-hero__in">
    <div class="svc-hero__copy">
      <p class="svc-eyebrow" data-reveal="fade">{p['eyebrow']}</p>
      <h1 class="svc-hero__title" data-reveal>{p['h1']}</h1>
      <p class="svc-hero__lead" data-reveal>{p['lead']}</p>
      <div class="svc-hero__cta" data-reveal="fade">
        <a class="cta-pill cta-pill--accent cta__link" data-form="project" href="/contact/">Start a Project <span class="cta-pill__arr" aria-hidden="true">&#8599;</span></a>
        <a class="cta-pill cta-pill--light" href="/case-studies/">All Case Studies <span class="cta-pill__arr" aria-hidden="true">&#8599;</span></a>
      </div>
    </div>

    <div class="svc-hero__media" aria-hidden="true">
      <img src="{hi}" alt="" width="{hw}" height="{hh}" decoding="async" fetchpriority="high">
    </div>
  </div>

  <dl class="svc-hero__facts" data-stagger>
{facts}
  </dl>
</header>

<main id="main">

  <!-- ============================================================ PROBLEM -->
  <section class="svc-ux" aria-labelledby="problem-t">
    <div class="wrap svc-ux__in">
      <div class="svc-ux__copy" data-stagger>
        <p class="svc-eyebrow">{prob['eyebrow']}</p>
        <h2 class="h2" id="problem-t">{prob['h2']}</h2>
        <p class="svc-ux__lead">{prob['lead']}</p>
        <p class="svc-body">{prob['body']}</p>
      </div>

      <ul class="svc-ux__list" data-stagger>
{prob_items}
      </ul>
    </div>
  </section>

  <!-- ======================================================= WHAT WE DID -->
  <section class="svc-process" aria-labelledby="did-t">
    <div class="svc-process__bg" aria-hidden="true">
      <img src="{bi}" alt="" width="{bw}" height="{bh}" loading="lazy" decoding="async">
    </div>
    <div class="wrap svc-process__in">
      <div class="sec-head" data-stagger>
        <h2 class="h2" id="did-t">{p['steps']['h2']}</h2>
        <p class="sec-head__sub">{p['steps']['sub']}</p>
      </div>

      <ol class="svc-steps cs-steps" data-stagger>
{steps}
      </ol>
    </div>
  </section>

  <!-- ============================================================ SCREENS -->
  <section class="cs-shots" aria-label="Screens from {p['name']}">
    <div class="wrap">
      <div class="cs-shots__grid{' cs-shots__grid--phones' if shots['phones'] else ''}">
{shot_items}
      </div>
    </div>
  </section>

  <!-- ============================================================ OUTCOME -->
  <section class="svc-included cs-outcome" aria-labelledby="outcome-t">
    <div class="wrap">
      <div class="sec-head" data-stagger>
        <h2 class="h2" id="outcome-t">{o['h2']}</h2>
        <p class="sec-head__sub">{o['sub']}</p>
      </div>

      <div class="svc-cols" data-stagger>
        <section class="svc-col" aria-labelledby="done-t">
          <h3 class="svc-col__t" id="done-t">{o['done_t']}</h3>
          <ul class="svc-col__list">
{done}
          </ul>
        </section>

        <section class="svc-col svc-col--note" aria-labelledby="next-t">
          <h3 class="svc-col__t" id="next-t">{o['next_t']}</h3>
          <ul class="svc-col__list">
{nxt}
          </ul>
          <p class="svc-col__fine">{o['fine']}</p>
        </section>
      </div>
{quote}

      <nav class="cs-next" aria-label="Next case study">
        <p class="cs-next__label">Next Case Study</p>
        <a href="/case-studies/{nslug}/">{nname}</a>
      </nav>
    </div>
  </section>

  <!-- ============================================================== START -->
  <section class="svc-redesign page-end" aria-labelledby="start-t">
    <span class="svc-redesign__atmo" aria-hidden="true"><i></i><i></i></span>
    <div class="wrap svc-redesign__in">
      <div data-stagger>
        <p class="svc-eyebrow">Your Project Next</p>
        <h2 class="h2" id="start-t">Have Something Like This To <span class="mark">Untangle</span>?</h2>
        <p class="svc-redesign__p">Tell us what you are building or fixing, and where people get stuck. We will tell you honestly how we would approach it.</p>
      </div>
      <p class="svc-redesign__cta" data-reveal="fade">
        <a class="cta-pill cta-pill--accent cta__link" data-form="project" href="/contact/">Start a Project <span class="cta-pill__arr" aria-hidden="true">&#8599;</span></a>
        <a class="cta-pill cta-pill--light" href="/case-studies/">All Case Studies <span class="cta-pill__arr" aria-hidden="true">&#8599;</span></a>
      </p>
    </div>
  </section>

</main>
{closing}</body>
</html>
"""


for p in PROJECTS:
    out = ROOT / "case-studies" / p["slug"] / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(page(p), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))
