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

  /* ---- Language selector + locale/country detection ---- */
  (function () {
    var lang = document.getElementById("lang");
    var btn = document.getElementById("langBtn");
    var label = document.getElementById("langLabel");
    if (!lang || !btn || !label) return;
    function apply(code, lbl, persist) {
      label.textContent = lbl;
      document.documentElement.setAttribute("lang", code);
      if (persist) { try { localStorage.setItem("cf-lang", code); } catch (e) {} }
    }
    var stored = null; try { stored = localStorage.getItem("cf-lang"); } catch (e) {}
    var nav = (navigator.language || "en").toLowerCase();
    var code = "en", lbl = "EN";
    if (stored) {
      code = stored; lbl = stored === "zh-Hans" ? "简" : stored === "zh-Hant" ? "繁" : "EN";
    } else if (nav === "zh-tw" || nav === "zh-hk" || nav === "zh-mo" || nav.indexOf("zh-hant") === 0) {
      code = "zh-Hant"; lbl = "繁";
    } else if (nav === "zh" || nav === "zh-cn" || nav === "zh-sg" || nav.indexOf("zh-hans") === 0) {
      code = "zh-Hans"; lbl = "简";
    }
    apply(code, lbl, false);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = lang.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    lang.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-lang"), b.getAttribute("data-label"), true);
        lang.classList.remove("open");
      });
    });
    document.addEventListener("click", function () { lang.classList.remove("open"); });
  })();

  /* ---- Salboy-style word-fill on scroll ---- */
  (function () {
    if (reduceMotion) return;
    document.querySelectorAll("[data-words]").forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = "";
      words.forEach(function (w, i) {
        var s = document.createElement("span");
        s.className = "w";
        s.textContent = w + (i < words.length - 1 ? " " : "");
        el.appendChild(s);
      });
      el.classList.add("words");
    });
    var all = Array.prototype.slice.call(document.querySelectorAll(".words .w"));
    function fill() {
      var vh = window.innerHeight;
      all.forEach(function (w) {
        var r = w.getBoundingClientRect();
        if (r.top < vh * 0.82 && r.bottom > 0) w.classList.add("on");
      });
    }
    window.addEventListener("scroll", fill, { passive: true });
    window.addEventListener("resize", fill);
    fill();
  })();

  /* ---- Yomied chat + Fabled Flow dictation demos ---- */
  (function () {
    var chat = document.getElementById("yomiedChat");
    if (chat && "IntersectionObserver" in window) {
      var items = chat.querySelectorAll(".bubble, .receipt");
      var played = false;
      function play() {
        if (played) return; played = true;
        items.forEach(function (el, i) { setTimeout(function () { el.classList.add("show"); }, 450 + i * 950); });
      }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); } });
      }, { threshold: 0.35 });
      io.observe(chat);
    }
    var ft = document.getElementById("flowText");
    if (ft) {
      var msg = "Draft a reply to Sarah — confirm the Sea View villa is free 12–16 Aug.";
      var cur = '<span class="cur"></span>';
      function type() {
        var i = 0;
        (function step() {
          if (i <= msg.length) { ft.innerHTML = msg.slice(0, i) + cur; i++; setTimeout(step, 42); }
          else { setTimeout(function () { ft.innerHTML = cur; setTimeout(type, 700); }, 3200); }
        })();
      }
      if (reduceMotion) { ft.textContent = msg; }
      else if ("IntersectionObserver" in window) {
        var io2 = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { type(); io2.disconnect(); } });
        }, { threshold: 0.4 });
        io2.observe(ft);
      } else { type(); }
    }
  })();

  /* ---- Ensure hero video plays (some mobile browsers) ---- */
  var v = document.querySelector(".hero__media video");
  if (v) {
    var play = v.play();
    if (play && play.catch) { play.catch(function () {}); }
  }
})();
