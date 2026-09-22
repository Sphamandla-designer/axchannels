/* AX-Channels — About.
   One job: keep the standing index in step with the section being read.
   Everything else on the page (nav panel, reveals, counters, contact
   drawers) comes from home.js. Without this file the index is still a
   working set of anchor links. */
(function () {
  "use strict";

  var links = document.querySelectorAll(".ab-index__link");
  if (!links.length || !("IntersectionObserver" in window)) return;

  var byId = {};
  Array.prototype.forEach.call(links, function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) byId[id] = { link: a, sec: sec };
  });

  var ids = Object.keys(byId);
  if (!ids.length) return;

  var visible = {};

  var mark = function () {
    /* the topmost section still in view wins, so scrolling up and down
       lands on the same answer rather than flickering between neighbours */
    var here = null;
    for (var i = 0; i < ids.length; i++) {
      if (visible[ids[i]]) { here = ids[i]; break; }
    }
    ids.forEach(function (id) {
      byId[id].link.classList.toggle("is-here", id === here);
      if (id === here) { byId[id].link.setAttribute("aria-current", "true"); }
      else { byId[id].link.removeAttribute("aria-current"); }
    });
  };

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    mark();
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });

  ids.forEach(function (id) { io.observe(byId[id].sec); });
})();
