/* AX-Channels — site interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile nav */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* services dropdown */
  document.querySelectorAll('.nav__drop').forEach(function (drop) {
    var trigger = drop.querySelector('.nav__link');
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      drop.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) drop.classList.remove('open');
    });
    drop.addEventListener('mouseenter', function () {
      if (window.matchMedia('(pointer: fine)').matches) drop.classList.add('open');
    });
    drop.addEventListener('mouseleave', function () {
      if (window.matchMedia('(pointer: fine)').matches) drop.classList.remove('open');
    });
  });

  /* generic carousel: [data-carousel] containing .car-track + controls */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-track]');
    var slides = track.children;
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var pause = root.querySelector('[data-pause]');
    var count = root.querySelector('[data-count]');
    var perView = function () {
      var mode = root.getAttribute('data-carousel');
      if (mode !== 'cards') return 1;
      var w = root.clientWidth;
      return w > 1360 ? 3 : w > 900 ? 2 : 1;
    };
    var i = 0, timer = null, playing = true;
    var max = function () { return Math.max(0, slides.length - perView()); };
    var render = function () {
      var offset = 0;
      for (var k = 0; k < i; k++) {
        offset += slides[k].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
      }
      track.style.transform = 'translateX(' + (-offset) + 'px)';
      if (count) count.textContent = (i + 1) + '/' + (max() + 1);
      if (prev) prev.disabled = i === 0;
    };
    var go = function (n) { i = (n + max() + 1) % (max() + 1); render(); };
    if (next) next.addEventListener('click', function () { go(i + 1); stop(); });
    if (prev) prev.addEventListener('click', function () { go(i - 1); stop(); });
    var start = function () {
      if (reduce || timer) return;
      timer = setInterval(function () { go(i + 1); }, 5000);
      playing = true;
      if (pause) pause.innerHTML = '&#10074;&#10074;';
    };
    var stop = function () {
      clearInterval(timer); timer = null; playing = false;
      if (pause) pause.innerHTML = '&#9654;';
    };
    if (pause) pause.addEventListener('click', function () { playing ? stop() : start(); });
    window.addEventListener('resize', function () { i = Math.min(i, max()); render(); });
    render();
    start();
  });

  /* FAQ */
  document.querySelectorAll('.faq-item').forEach(function (item, idx) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    var set = function (open) {
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    };
    q.addEventListener('click', function () {
      set(q.getAttribute('aria-expanded') !== 'true');
    });
    if (q.getAttribute('aria-expanded') === 'true') set(true);
  });

  /* year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
