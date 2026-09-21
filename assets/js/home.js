/* AX-Channels — home page behaviour.
   1. Mobile nav panel            (unchanged behaviour, animated by CSS)
   2. Selected-work swapper       (now directional)
   3. Motion system               (entrance, scroll reveals, counters, parallax)
   The motion system is additive: without JS, or with prefers-reduced-motion,
   the page renders complete and static. Only transform/opacity are animated. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionOK = !reduced && "IntersectionObserver" in window;

  /* Gate every pre-reveal style on this class so no-JS visitors see the
     finished page (skill rule: never invisible-by-default without fallback). */
  if (motionOK) document.documentElement.classList.add("js-motion");

  /* ---------------------------------------------------------------- nav -- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.setAttribute("data-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset when the pill nav comes back on wider screens.
    var wide = window.matchMedia("(min-width: 1101px)");
    var sync = function () { if (wide.matches) setOpen(false); };
    wide.addEventListener ? wide.addEventListener("change", sync) : wide.addListener(sync);
  }

  /* -------------------------------------------- selected work carousel -- */
  /* The arrows page the scroll-snapped track: they always reveal the next /
     previous projects, and disable at either end of the list. */
  var track = document.getElementById("work-track");
  var prev = document.querySelector("[data-work-prev]");
  var next = document.querySelector("[data-work-next]");

  if (track && prev && next) {
    var step = function () {
      var first = track.children[0];
      if (!first) return track.clientWidth;
      return first.getBoundingClientRect().width +
        parseFloat(getComputedStyle(track).columnGap || 0);
    };
    var update = function () {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max - 4;
    };
    var go = function (dir) {
      track.scrollBy({ left: dir * step(), behavior: reduced ? "auto" : "smooth" });
    };
    next.addEventListener("click", function () { go(1); });
    prev.addEventListener("click", function () { go(-1); });
    track.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  if (!motionOK) return;

  /* ------------------------------------------------------ hero entrance -- */
  var start = function () {
    // Two frames so the pre-states paint before the transitions run.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add("is-in");
      });
    });
  };
  // Let the webfont settle first when it's quick; never wait longer than 250ms.
  var started = false;
  var kick = function () { if (!started) { started = true; start(); } };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(kick, kick);
  }
  window.setTimeout(kick, 250);

  /* ----------------------------------------------------- scroll reveals -- */
  var STAGGER = 0.07; // seconds between siblings (skill: keep intervals short)

  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var children = Array.prototype.slice.call(group.children);
    group.classList.add("m-group");
    children.forEach(function (child, i) {
      child.classList.add("m-child");
      child.style.setProperty("--d", (Math.min(i, 7) * STAGGER).toFixed(2) + "s");
    });
  });

  var toReveal = document.querySelectorAll("[data-reveal], .m-group");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.classList.contains("m-group")) {
        Array.prototype.forEach.call(el.children, function (child) {
          child.classList.add("is-in");
        });
      } else {
        el.classList.add("is-in");
      }
      io.unobserve(el); // reveal once, keep the page calm on scroll-back
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -7% 0px" });

  toReveal.forEach(function (el) { io.observe(el); });

  /* ---------------------------------------------------------- counters -- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var t0 = null;
      var dur = 900;
      var tick = function (now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ----------------------------------------------------------- parallax -- */
  /* Subtle scroll-linked depth, desktop pointers only. Custom properties are
     consumed by compositor-friendly `translate` rules in the stylesheet. */
  var deskFine = window.matchMedia("(min-width: 1101px) and (pointer: fine)");
  var hero = document.querySelector(".hero");
  var workSection = document.querySelector(".work");
  var root = document.documentElement;

  if (hero) {
    var ticking = false;
    var apply = function () {
      ticking = false;
      if (!deskFine.matches) {
        root.style.removeProperty("--par-portrait");
        root.style.removeProperty("--par-body");
        root.style.removeProperty("--par-fade");
        root.style.removeProperty("--par-wm");
        return;
      }
      var y = window.scrollY;
      var heroH = hero.offsetHeight || 1;
      if (y <= heroH) {
        var p = y / heroH; // 0 → 1 while the hero leaves
        root.style.setProperty("--par-portrait", (p * heroH * 0.10).toFixed(1) + "px");
        root.style.setProperty("--par-body", (p * heroH * 0.05).toFixed(1) + "px");
        root.style.setProperty("--par-fade", (1 - p * 0.35).toFixed(3));
      }
      if (workSection) {
        var r = workSection.getBoundingClientRect();
        var vh = window.innerHeight;
        if (r.top < vh && r.bottom > 0) {
          var wp = 1 - (r.top + r.height / 2) / (vh / 2 + r.height / 2); // -~1 → ~1
          root.style.setProperty("--par-wm", (wp * 36).toFixed(1) + "px");
        }
      }
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    window.addEventListener("resize", apply);
    apply();
  }
})();
