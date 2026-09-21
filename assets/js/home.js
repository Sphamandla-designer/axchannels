/* AX-Channels — home page behaviour.
   1. Mobile nav panel
   2. Selected-work carousel (arrows page the track)
   3. Motion system: entrance, masked line reveals, scroll reveals, counters,
      scroll depth, inner-image parallax, magnetic buttons, trailing cursor.
   Additive: without JS, or with prefers-reduced-motion, the page renders
   complete and static. Only transform/opacity/translate are animated. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionOK = !reduced && "IntersectionObserver" in window;
  var finePointer = window.matchMedia("(pointer: fine)");
  var deskFine = window.matchMedia("(min-width: 1101px) and (pointer: fine)");

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
    var wide = window.matchMedia("(min-width: 1101px)");
    var sync = function () { if (wide.matches) setOpen(false); };
    wide.addEventListener ? wide.addEventListener("change", sync) : wide.addListener(sync);
  }

  /* -------------------------------------------- selected work carousel -- */
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

  /* ------------------------------------------- masked line reveals ------ */
  /* Big editorial headings reveal line-by-line through masks (split at
     runtime, honouring <br>, and reverted to the original markup after the
     animation so the DOM stays clean for assistive tech and selection). */
  var splitData = new Map();

  var splitLines = function (el) {
    var original = el.innerHTML;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          frag.appendChild(s);
        });
        el.replaceChild(frag, n);
      }
    });
    var lines = [], top = null;
    el.querySelectorAll(".w").forEach(function (s) {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
      lines[lines.length - 1].push(s.textContent);
    });
    if (lines.length < 1) { el.innerHTML = original; return; }
    el.innerHTML = lines.map(function (ws, i) {
      return '<span class="rl"><span class="rl-in" style="--ln:' + i + '">' + ws.join(" ") + "</span></span>";
    }).join("");
    el.classList.add("split-done");
    splitData.set(el, { html: original, lines: lines.length, armed: false });
  };

  var armSplitRevert = function (el) {
    var d = splitData.get(el);
    if (!d || d.armed) return;
    d.armed = true;
    window.setTimeout(function () {
      el.innerHTML = d.html;
      el.classList.remove("split-done");
      splitData.delete(el);
    }, 1000 + d.lines * 90);
  };

  /* ------------------------------------------------------ reveal setup -- */
  var STAGGER = 0.07;

  var setupReveals = function () {
    document.querySelectorAll(".studio__title, .sec-head .h2, .cta__title, #numbers-title")
      .forEach(splitLines);

    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      group.classList.add("m-group");
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (child.classList.contains("split-done")) return;
        child.classList.add("m-child");
        child.style.setProperty("--d", (Math.min(i, 7) * STAGGER).toFixed(2) + "s");
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("m-group")) {
          Array.prototype.forEach.call(el.children, function (child) {
            child.classList.add("is-in");
            if (child.classList.contains("split-done")) armSplitRevert(child);
          });
        } else {
          el.classList.add("is-in");
          if (el.classList.contains("split-done")) armSplitRevert(el);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -7% 0px" });

    document.querySelectorAll("[data-reveal], .m-group").forEach(function (el) { io.observe(el); });
  };

  /* ------------------------------------------------------ hero entrance -- */
  var started = false;
  var kick = function () {
    if (started) return;
    started = true;
    setupReveals(); // measured with the settled webfont
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add("is-in");
      });
    });
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(kick, kick);
  window.setTimeout(kick, 250);

  /* ---------------------------------------------------------- counters -- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var t0 = null, dur = 900;
      var tick = function (now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
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

  /* ---------------------------------------------- scroll depth layers -- */
  var hero = document.querySelector(".hero");
  var workSection = document.querySelector(".work");
  var root = document.documentElement;
  var plxImgs = Array.prototype.map.call(
    document.querySelectorAll(".project__media img, .studio__figure img"),
    function (img) { return { img: img, frame: img.closest(".project__media, .studio__figure") }; }
  );

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
      var vh = window.innerHeight;
      var y = window.scrollY;
      var heroH = hero.offsetHeight || 1;
      if (y <= heroH) {
        var p = y / heroH;
        root.style.setProperty("--par-portrait", (p * heroH * 0.10).toFixed(1) + "px");
        root.style.setProperty("--par-body", (p * heroH * 0.05).toFixed(1) + "px");
        root.style.setProperty("--par-fade", (1 - p * 0.35).toFixed(3));
      }
      if (workSection) {
        var r = workSection.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          var wp = 1 - (r.top + r.height / 2) / (vh / 2 + r.height / 2);
          root.style.setProperty("--par-wm", (wp * 36).toFixed(1) + "px");
        }
      }
      plxImgs.forEach(function (o) {
        var fr = o.frame.getBoundingClientRect();
        if (fr.top < vh && fr.bottom > 0) {
          var off = (fr.top + fr.height / 2 - vh / 2) / vh;
          o.img.style.setProperty("--plx", (off * -22).toFixed(1) + "px");
        }
      });
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    window.addEventListener("resize", apply);
    apply();
  }

  /* --------------------------------------------------- magnetic buttons -- */
  if (finePointer.matches) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.18;
        var dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.translate =
          Math.max(-8, Math.min(8, dx)).toFixed(1) + "px " +
          Math.max(-6, Math.min(6, dy)).toFixed(1) + "px";
      });
      btn.addEventListener("pointerleave", function () { btn.style.translate = ""; });
    });
  }

  /* ---------------------------------------------------- trailing cursor -- */
  if (finePointer.matches) {
    var cur = document.createElement("div");
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    document.body.appendChild(cur);
    root.classList.add("cursor-live");

    var tx = -100, ty = -100, cx = -100, cy = -100, cs = 1, curRaf = null, overLink = false;
    var loop = function () {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cs += ((overLink ? 3.4 : 1) - cs) * 0.2;
      cur.style.transform =
        "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) translate(-50%,-50%) scale(" + cs.toFixed(3) + ")";
      var settled = Math.abs(tx - cx) < 0.2 && Math.abs(ty - cy) < 0.2 &&
        Math.abs((overLink ? 3.4 : 1) - cs) < 0.01;
      curRaf = settled ? null : requestAnimationFrame(loop);
    };
    var wake = function () { if (!curRaf) curRaf = requestAnimationFrame(loop); };

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      cur.classList.add("on");
      wake();
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      overLink = !!e.target.closest("a, button");
      wake();
    });
    document.documentElement.addEventListener("pointerleave", function () {
      cur.classList.remove("on");
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && curRaf) { cancelAnimationFrame(curRaf); curRaf = null; }
    });
  }
})();
