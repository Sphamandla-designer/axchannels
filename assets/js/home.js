/* AX-Channels — home page behaviour.
   Two small pieces only: the mobile nav panel and the selected-work swapper. */
(function () {
  "use strict";

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

  /* ------------------------------------------------- selected work swap -- */
  var track = document.getElementById("work-track");
  var prev = document.querySelector("[data-work-prev]");
  var next = document.querySelector("[data-work-next]");

  if (track && prev && next) {
    var cards = function () {
      return Array.prototype.slice.call(track.children);
    };

    var swap = function (forward) {
      var items = cards();
      if (items.length < 2) return;

      // A horizontally scrolled track moves; otherwise the pair rotates.
      if (track.scrollWidth - track.clientWidth > 8) {
        var step = items[0].getBoundingClientRect().width +
          parseFloat(getComputedStyle(track).columnGap || 0);
        track.scrollBy({ left: forward ? step : -step, behavior: "smooth" });
        return;
      }

      track.classList.add("is-swapping");
      window.setTimeout(function () {
        if (forward) track.appendChild(items[0]);
        else track.insertBefore(items[items.length - 1], items[0]);
        track.classList.remove("is-swapping");
      }, 180);
    };

    next.addEventListener("click", function () { swap(true); });
    prev.addEventListener("click", function () { swap(false); });
  }
})();
