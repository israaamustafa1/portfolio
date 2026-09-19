/*
 * Israa Mostafa — Portfolio interactions
 * 1. Dark / Light mode toggle (persisted in localStorage)
 * 2. Smooth-scroll anchor navigation
 * 3. Project "Watch Demo" video modal
 *
 * No layout, spacing, or class names are altered by this script — it only
 * toggles the "dark" class on <html> (which the CSS variables in
 * css/style.css respond to) and a couple of "hidden"/"flex" classes on the
 * video modal.
 */

(function () {
  "use strict";

  /* -----------------------------------------------------------
   * 1. Theme toggle
   * --------------------------------------------------------- */
  var root = document.documentElement;
  var lightBtn = document.getElementById("theme-toggle-light");
  var darkBtn = document.getElementById("theme-toggle-dark");

  var ACTIVE_CLASSES = [
    "bg-surface-container-lowest",
    "text-primary",
    "shadow-[0_2px_6px_rgba(0,0,0,0.06)]",
  ];
  var INACTIVE_CLASSES = ["text-on-surface-variant", "hover:text-on-surface"];

  function setActiveButton(theme) {
    if (!lightBtn || !darkBtn) return;

    var isDark = theme === "dark";
    var activeBtn = isDark ? darkBtn : lightBtn;
    var inactiveBtn = isDark ? lightBtn : darkBtn;

    ACTIVE_CLASSES.forEach(function (c) {
      activeBtn.classList.add(c);
      inactiveBtn.classList.remove(c);
    });
    INACTIVE_CLASSES.forEach(function (c) {
      inactiveBtn.classList.add(c);
      activeBtn.classList.remove(c);
    });

    lightBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to Light Mode" : "Light Mode Active"
    );
    darkBtn.setAttribute(
      "aria-label",
      isDark ? "Dark Mode Active" : "Switch to Dark Mode"
    );
  }

  function applyTheme(theme, persist) {
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setActiveButton(theme);
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        /* localStorage unavailable (private mode, etc.) — theme still applies for this session */
      }
    }
  }

  // Sync the toggle UI with whatever the pre-paint inline script already
  // applied to <html>, then wire up the buttons.
  setActiveButton(root.classList.contains("dark") ? "dark" : "light");

  if (lightBtn) {
    lightBtn.addEventListener("click", function () {
      applyTheme("light", true);
    });
  }
  if (darkBtn) {
    darkBtn.addEventListener("click", function () {
      applyTheme("dark", true);
    });
  }

  /* -----------------------------------------------------------
   * 2. Smooth scroll navigation for in-page anchors
   * --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* -----------------------------------------------------------
   * 3. "Watch Demo" video modal
   * --------------------------------------------------------- */
  var modal = document.getElementById("video-modal");
  var modalBackdrop = document.getElementById("video-modal-backdrop");
  var modalClose = document.getElementById("video-modal-close");
  var modalPlayer = document.getElementById("video-modal-player");
  var modalTitle = document.getElementById("video-modal-title");

  function openVideoModal(src, title) {
    if (!modal || !modalPlayer) return;
    modalPlayer.src = src;
    if (modalTitle && title) modalTitle.textContent = title;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    modalPlayer.play().catch(function () {
      /* Autoplay can be blocked by the browser — controls remain available */
    });
  }

  function closeVideoModal() {
    if (!modal || !modalPlayer) return;
    modalPlayer.pause();
    modalPlayer.removeAttribute("src");
    modalPlayer.load();
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  document.querySelectorAll(".js-watch-demo").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openVideoModal(
        btn.getAttribute("data-video-src"),
        btn.getAttribute("data-video-title")
      );
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeVideoModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeVideoModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeVideoModal();
    }
  });
})();
