/* ============================================================
   AX-CHANNELS — interaction system
   Complexity → Connection → Clarity
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navigation ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScrollNav = function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    var toggle = nav.querySelector('.nav__toggle');
    var links = nav.querySelector('.nav__links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in-view');
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* draw-in SVG paths marked individually */
  var drawEls = document.querySelectorAll('svg [data-draw]');
  if (drawEls.length) {
    drawEls.forEach(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 400; }
      p.style.setProperty('--len', len);
      p.classList.add('draw-path');
    });
    if ('IntersectionObserver' in window && !reduceMotion) {
      var dro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in-view');
            dro.unobserve(en.target);
          }
        });
      }, { threshold: 0.4 });
      drawEls.forEach(function (p) { dro.observe(p); });
    } else {
      drawEls.forEach(function (p) { p.classList.add('in-view'); });
    }
  }

  /* ---------- Hero: system assembly + parallax ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    // assembly sequence
    window.requestAnimationFrame(function () {
      setTimeout(function () { hero.classList.add('is-assembled'); }, reduceMotion ? 0 : 250);
    });

    // pointer parallax on layered visual
    var layers = hero.querySelectorAll('.hv-layer');
    if (layers.length && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      var rx = 0, ry = 0, tx = 0, ty = 0, raf = null;
      var loop = function () {
        tx += (rx - tx) * 0.06;
        ty += (ry - ty) * 0.06;
        layers.forEach(function (layer, i) {
          var depth = (i + 1) * 5;
          layer.style.transform = 'translate3d(' + (tx * depth) + 'px,' + (ty * depth) + 'px,0)';
        });
        raf = requestAnimationFrame(loop);
      };
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        rx = ((e.clientX - r.left) / r.width - 0.5);
        ry = ((e.clientY - r.top) / r.height - 0.5);
        if (!raf) loop();
      });
      hero.addEventListener('pointerleave', function () { rx = 0; ry = 0; });
    }
  }

  /* ---------- Complexity: scroll-scrubbed reorganisation ---------- */
  var cx = document.querySelector('.cx-stage');
  if (cx) {
    var frags = Array.prototype.slice.call(cx.querySelectorAll('.cx-frag'));
    var lines = cx.querySelector('.cx-lines');
    var word = cx.querySelector('.cx-word span');
    var stateLabel = document.querySelector('.cx-progress b');
    var labels = ['Fragmented', 'Connecting', 'Organising', 'Clear'];

    var setProgress = function (p) {
      // p: 0 fragmented → 1 organised
      var ease = p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p);
      frags.forEach(function (f) {
        var k = 1 - ease;
        f.style.transform =
          'translate(' + (parseFloat(f.dataset.dx || 0) * k) + 'px,' +
          (parseFloat(f.dataset.dy || 0) * k) + 'px) rotate(' +
          (parseFloat(f.dataset.dr || 0) * k) + 'deg)';
        f.style.opacity = String(0.55 + 0.45 * ease);
      });
      if (lines) {
        var lp = Math.max(0, (ease - 0.35) / 0.4);
        lines.style.setProperty('--lp', Math.min(1, lp));
        lines.querySelectorAll('path').forEach(function (path) {
          path.style.opacity = Math.min(1, lp);
        });
      }
      if (word) {
        var wp = Math.max(0, (ease - 0.78) / 0.22);
        word.style.setProperty('--wp', wp);
        word.style.opacity = wp;
        word.style.transform = 'scale(' + (0.92 + 0.08 * wp) + ')';
      }
      if (stateLabel) {
        stateLabel.textContent = labels[Math.min(3, Math.floor(ease * 3.6))];
      }
    };

    if (reduceMotion) {
      setProgress(1);
    } else {
      var ticking = false;
      var onScrollCx = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var r = cx.getBoundingClientRect();
          var vh = window.innerHeight;
          // progress across the stage's journey through the viewport
          var p = (vh * 0.9 - r.top) / (vh * 0.75 + r.height * 0.35);
          setProgress(p);
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScrollCx, { passive: true });
      window.addEventListener('resize', onScrollCx);
      onScrollCx();
    }
  }

  /* ---------- Ecosystem explorer ---------- */
  var eco = document.querySelector('.eco');
  if (eco) {
    var ecoData = {
      people: {
        title: 'People',
        body: 'The customers, employees and decision-makers every experience ultimately serves. We design for how people actually think, decide and work.',
        rel: 'Every channel in the system starts and ends with a person.'
      },
      business: {
        title: 'Business',
        body: 'Commercial goals, constraints and the model behind the product. Design decisions are business decisions made visible.',
        rel: 'Connects strategy to what people experience day to day.'
      },
      process: {
        title: 'Process',
        body: 'Workflows, decisions and operational context. The way work really happens — not the way the org chart says it does.',
        rel: 'Turns operations into structures software can support.'
      },
      data: {
        title: 'Data',
        body: 'The information a business runs on: records, metrics, signals and history. Useful only once it is structured and legible.',
        rel: 'Feeds the product, the systems and the intelligence layer.'
      },
      product: {
        title: 'Product',
        body: 'The digital products people touch — interfaces, journeys and features shaped around real problems, not feature lists.',
        rel: 'Where people, process and technology meet in one surface.'
      },
      technology: {
        title: 'Technology',
        body: 'The platforms and architecture that make experiences dependable. Chosen to fit the problem, never the other way round.',
        rel: 'Carries every channel in the system reliably at scale.'
      },
      ai: {
        title: 'AI',
        body: 'Intelligence applied deliberately: assisting decisions, surfacing insight, automating the repetitive — with people in control.',
        rel: 'Amplifies data and process. Never a substitute for judgement.'
      }
    };

    var nodes = eco.querySelectorAll('.eco-node');
    var linksSvg = eco.querySelectorAll('.eco-link');
    var detail = eco.querySelector('.eco__detail-card');
    var setEco = function (key) {
      var d = ecoData[key];
      if (!d || !detail) return;
      nodes.forEach(function (n) {
        var on = n.dataset.node === key;
        n.classList.toggle('active', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      linksSvg.forEach(function (l) {
        l.classList.toggle('active', l.dataset.link === key);
      });
      detail.querySelector('h3').textContent = d.title;
      detail.querySelector('.eco__detail-body').textContent = d.body;
      detail.querySelector('.eco__detail-rel b').textContent = d.rel;
    };
    nodes.forEach(function (n) {
      n.addEventListener('mouseenter', function () { setEco(n.dataset.node); });
      n.addEventListener('focus', function () { setEco(n.dataset.node); });
      n.addEventListener('click', function () { setEco(n.dataset.node); });
    });
    setEco('process');
  }

  /* ---------- Approach stepper ---------- */
  var ap = document.querySelector('.approach');
  if (ap) {
    var apData = {
      understand: {
        title: 'Understand',
        body: 'We start inside the complexity: the people, the operations, the data and the constraints. No assumptions, no template thinking.',
        note: 'Research, stakeholder conversations, systems mapping.'
      },
      define: {
        title: 'Define',
        body: 'Insight becomes structure. We frame the real problem, agree what matters and set the direction the design must serve.',
        note: 'Problem framing, priorities, information architecture.'
      },
      design: {
        title: 'Design',
        body: 'Structure becomes experience. Journeys, interfaces and systems designed around how people actually decide and work.',
        note: 'Experience design, product interfaces, system design.'
      },
      validate: {
        title: 'Validate',
        body: 'We test the design against reality — with the people who will use it — and refine until it holds up.',
        note: 'Prototyping, testing, evidence-led iteration.'
      },
      enable: {
        title: 'Enable',
        body: 'We carry the design into the world: build-ready systems, implementation support and the clarity to keep it evolving.',
        note: 'Design systems, delivery support, enablement.'
      }
    };
    var order = ['understand', 'define', 'design', 'validate', 'enable'];
    var steps = ap.querySelectorAll('.ap-step');
    var desc = ap.querySelector('.ap-desc');
    var visual = ap.querySelector('.ap-visual');
    var timer = null;
    var idx = 0;

    var setStep = function (key, fromUser) {
      var d = apData[key];
      if (!d) return;
      idx = order.indexOf(key);
      steps.forEach(function (s) {
        var on = s.dataset.step === key;
        s.classList.toggle('active', on);
        s.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (desc) {
        desc.querySelector('h3').textContent = d.title;
        desc.querySelector('.ap-body').textContent = d.body;
        desc.querySelector('.ap-note span').textContent = d.note;
      }
      if (visual) visual.dataset.stage = key;
      if (fromUser && timer) { clearInterval(timer); timer = null; }
    };
    steps.forEach(function (s) {
      s.addEventListener('click', function () { setStep(s.dataset.step, true); });
    });
    setStep('understand');

    if (!reduceMotion && 'IntersectionObserver' in window) {
      var seen = false;
      var apo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !seen) {
            seen = true;
            timer = setInterval(function () {
              idx = (idx + 1) % order.length;
              setStep(order[idx]);
            }, 3400);
          } else if (!en.isIntersecting && timer) {
            clearInterval(timer); timer = null; seen = false;
          }
        });
      }, { threshold: 0.35 });
      apo.observe(ap);
    }
  }

  /* ---------- Commercial entry: guided decision ---------- */
  var entry = document.querySelector('.entry');
  if (entry) {
    var entryData = {
      experience: {
        title: 'A digital experience problem',
        body: 'Customers or users are struggling to understand, navigate or complete something. We redesign the journey around how people actually think — so the experience becomes the clearest part of your business.',
        cap: { label: 'Capability', text: 'Digital Experiences', href: 'capabilities/#experiences' },
        proof: { label: 'Relevant work', text: 'WasteMart — operational experience', href: 'work/wastemart/' },
        next: { label: 'Typical start', text: 'Experience discovery & journey mapping' }
      },
      product: {
        title: 'A digital product problem',
        body: 'You need a product designed, rethought or matured — from first concept to a coherent, scalable interface system that people actually want to use.',
        cap: { label: 'Capability', text: 'Digital Products', href: 'capabilities/#products' },
        proof: { label: 'Relevant work', text: 'FINOS — financial intelligence platform', href: 'work/finos/' },
        next: { label: 'Typical start', text: 'Product discovery & definition sprint' }
      },
      system: {
        title: 'A business system problem',
        body: 'Operations live in spreadsheets, silos and inboxes. We design the internal systems — dashboards, workflows, data structures — that make the business legible and controllable.',
        cap: { label: 'Capability', text: 'Business Systems', href: 'capabilities/#systems' },
        proof: { label: 'Relevant work', text: 'WasteMart — recycling operations system', href: 'work/wastemart/' },
        next: { label: 'Typical start', text: 'Operations & systems mapping' }
      },
      ai: {
        title: 'An AI opportunity',
        body: 'You suspect intelligence could sharpen decisions or remove repetitive work — but it has to be useful, trustworthy and humane. We design AI where it genuinely belongs in your system.',
        cap: { label: 'Capability', text: 'AI & Intelligent Experiences', href: 'capabilities/#ai' },
        proof: { label: 'Relevant work', text: 'FINOS — intelligence in decision-making', href: 'work/finos/' },
        next: { label: 'Typical start', text: 'AI opportunity assessment' }
      },
      unsure: {
        title: 'Not sure yet — that’s normal',
        body: 'Most complex problems don’t arrive neatly labelled. Bring us the situation as it really is; the first thing we do together is make the problem clear.',
        cap: { label: 'How we work', text: 'Understand first. Design second.', href: 'index.html#approach' },
        proof: { label: 'See the range', text: 'Explore selected work', href: 'work/' },
        next: { label: 'Typical start', text: 'A conversation — then a clarity session' }
      }
    };
    var opts = entry.querySelectorAll('.entry-opt');
    var detailBox = entry.querySelector('.entry__detail');
    var setEntry = function (key) {
      var d = entryData[key];
      if (!d || !detailBox) return;
      opts.forEach(function (o) {
        o.setAttribute('aria-pressed', o.dataset.entry === key ? 'true' : 'false');
      });
      detailBox.querySelector('h3').textContent = d.title;
      detailBox.querySelector('.entry__body').textContent = d.body;
      var pathEls = detailBox.querySelectorAll('.entry__paths > *');
      var rows = [d.cap, d.proof, d.next];
      pathEls.forEach(function (el, i) {
        var row = rows[i];
        if (!row) return;
        el.querySelector('.lbl').textContent = row.label;
        el.querySelector('b').textContent = row.text;
        if (el.tagName === 'A') {
          if (row.href) { el.href = (detailBox.dataset.root || '') + row.href; el.style.display = ''; }
          else { el.removeAttribute('href'); }
        }
      });
    };
    opts.forEach(function (o) {
      o.addEventListener('click', function () { setEntry(o.dataset.entry); });
    });
    setEntry('product');
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', open ? 'false' : 'true');
      a.style.maxHeight = open ? '0px' : a.scrollHeight + 'px';
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
