/* Crown Faith — main.js */
(function () {
  "use strict";

  var body = document.body;
  var header = document.getElementById("header");
  var menuBtn = document.getElementById("menuBtn");
  var overlay = document.getElementById("navOverlay");
  var offcanvas = document.getElementById("offcanvas");
  var hero = document.getElementById("hero");

  /* ---- Menu open/close ---- */
  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!body.classList.contains("menu-open"));
  });
  overlay.addEventListener("click", function () { setMenu(false); });
  offcanvas.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---- Header scrolled + on-hero state ---- */
  var heroH = hero ? hero.offsetHeight : 600;
  var heroInner = document.querySelector(".hero__inner");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 40);
    header.classList.toggle("on-hero", y < heroH - 120);
    if (heroInner && !reduceMotion && y < heroH) {
      heroInner.style.transform = "translateY(" + (y * 0.28).toFixed(1) + "px)";
      heroInner.style.opacity = String(Math.max(0, 1 - y / (heroH * 0.85)));
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { heroH = hero ? hero.offsetHeight : 600; onScroll(); });
  onScroll();

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Manifesto word-by-word fill on scroll ---- */
  document.querySelectorAll("[data-splitwords]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w + (i < words.length - 1 ? " " : "");
      el.appendChild(span);
    });
  });
  var wordEls = Array.prototype.slice.call(document.querySelectorAll(".manifesto .word"));
  function fillWords() {
    if (!wordEls.length) return;
    var vh = window.innerHeight;
    wordEls.forEach(function (w) {
      var r = w.getBoundingClientRect();
      // fill as the word passes the middle third of the viewport
      if (r.top < vh * 0.72) w.classList.add("is-on");
    });
  }
  window.addEventListener("scroll", fillWords, { passive: true });
  fillWords();

  /* ---- Ensure hero video plays (some mobile browsers) ---- */
  var v = document.querySelector(".hero__media video");
  if (v) {
    var play = v.play();
    if (play && play.catch) { play.catch(function () {}); }
  }
})();
