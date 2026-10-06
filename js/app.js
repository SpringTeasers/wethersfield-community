/* ==========================================================================
   Wethersfield Community Site — app.js
   Vanilla JS only. Two behaviours: mobile nav panel, business directory
   filter. No libraries, no build step.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Mobile navigation panel
     ------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-nav");
  var closeBtn = document.querySelector(".mobile-nav__close");

  function openNav() {
    if (!panel) return;
    panel.classList.add("is-open");
    panel.removeAttribute("inert");
    document.body.classList.add("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    var first = panel.querySelector("a, button");
    if (first) first.focus();
  }

  function closeNav() {
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("inert", "");
    document.body.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  }

  if (toggle && panel) {
    panel.setAttribute("inert", "");
    toggle.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener("click", closeNav);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel && panel.classList.contains("is-open")) {
      closeNav();
    }
  });

  // Keep focus inside the panel while it is open.
  if (panel) {
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !panel.classList.contains("is-open")) return;
      var focusables = panel.querySelectorAll("a[href], button:not([disabled])");
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Close the panel if the viewport grows past the mobile breakpoint.
  if (window.matchMedia) {
    var mq = window.matchMedia("(min-width: 768px)");
    var onChange = function (e) {
      if (e.matches && panel && panel.classList.contains("is-open")) closeNav();
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ------------------------------------------------------------------
     Header scroll shadow
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     Business directory: client-side search + category filter
     ------------------------------------------------------------------ */
  var search = document.getElementById("business-search");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".business-card"));
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-category-group]"));
  var countEl = document.getElementById("result-count");
  var emptyEl = document.getElementById("directory-empty");
  var clearBtn = document.getElementById("clear-filters");

  if (cards.length && countEl) {
    var activeCategory = "all";

    function normalise(str) {
      return (str || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    // Precompute the searchable text once.
    cards.forEach(function (card) {
      card.dataset.searchText = normalise(
        (card.dataset.name || "") + " " +
        (card.dataset.category || "") + " " +
        (card.dataset.address || "") + " " +
        (card.dataset.description || "")
      );
    });

    function applyFilters() {
      var q = normalise(search ? search.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var matchesCategory =
          activeCategory === "all" || card.dataset.category === activeCategory;
        var matchesSearch = !q || card.dataset.searchText.indexOf(q) !== -1;
        var show = matchesCategory && matchesSearch;
        card.hidden = !show;
        if (show) visible++;
      });

      // Hide any category group left with no visible cards.
      groups.forEach(function (group) {
        var key = group.getAttribute("data-category-group");
        var matchesCategory = activeCategory === "all" || key === activeCategory;
        var anyVisible = group.querySelectorAll(".business-card:not([hidden])").length > 0;
        group.hidden = !(matchesCategory && anyVisible);
      });

      countEl.textContent =
        visible === 1 ? "1 listing" : visible + " listings";

      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    if (search) {
      search.addEventListener("input", applyFilters);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCategory = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        applyFilters();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        activeCategory = "all";
        if (search) search.value = "";
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", String(c.getAttribute("data-filter") === "all"));
        });
        applyFilters();
        if (search) search.focus();
      });
    }

    applyFilters();
  }
})();
