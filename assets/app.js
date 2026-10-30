/* Franks24 progressive enhancement: browser-only, no API keys or personal data. */
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Accessible mobile navigation: dismiss on Escape, outside click, link navigation and desktop resize.
  const menuButton = $("#menu-toggle");
  const menu = $("#primary-nav");
  const closeMenu = (restoreFocus = false) => {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
    if (restoreFocus) menuButton.focus();
  };

  if (menu && menuButton) {
    menuButton.addEventListener("click", () => {
      const opening = menuButton.getAttribute("aria-expanded") !== "true";
      menu.classList.toggle("is-open", opening);
      menuButton.setAttribute("aria-expanded", String(opening));
      menuButton.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("menu-open", opening && window.innerWidth <= 820);
    });
    menu.addEventListener("click", event => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("click", event => {
      if (menuButton.getAttribute("aria-expanded") === "true" &&
          !menu.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  // Motion graphics are illustrative. Nothing shown in the demo is a live job or KPI.
  const scene = $("#motion-scene");
  const route = $("#route-progress");
  const progress = $("#demo-progress");
  const progressFill = $("#demo-progress-fill");
  const playButton = $("#demo-play");
  const resetButton = $("#demo-reset");
  const label = $("#demo-label");
  const routeSvg = $(".route-art");
  const states = ["Opportunity found", "People connected", "Work in motion"];
  let current = 0;
  let playing = false;
  let completed = false;
  let intervalId = null;
  let routeLength = 0;

  if (route && typeof route.getTotalLength === "function") {
    routeLength = route.getTotalLength();
    route.style.strokeDasharray = String(routeLength);
  }

  const pauseSvg = () => {
    if (routeSvg && typeof routeSvg.pauseAnimations === "function") routeSvg.pauseAnimations();
  };
  const unpauseSvg = () => {
    if (!reducedMotion.matches && routeSvg && typeof routeSvg.unpauseAnimations === "function") {
      routeSvg.unpauseAnimations();
    }
  };

  const renderDemo = () => {
    if (!label || !progress || !progressFill || !playButton) return;
    label.textContent = completed ? "Preview complete" : states[current];
    progress.setAttribute("aria-valuenow", String(current + 1));
    progressFill.style.width = String(((current + 1) / states.length) * 100) + "%";
    if (routeLength) route.style.strokeDashoffset = String(routeLength * (1 - ((current + 1) / states.length)));
    playButton.innerHTML = playing ? 'Pause <span aria-hidden="true">Ⅱ</span>' :
      completed ? 'Replay <span aria-hidden="true">↻</span>' :
      'Play <span aria-hidden="true">▶</span>';
    playButton.setAttribute("aria-label", playing ? "Pause animation" : completed ? "Replay animation" : "Play animation");
    if (scene) scene.setAttribute("data-demo-stage", String(current + 1));
  };

  const stopDemo = (finished = false) => {
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
    playing = false;
    completed = finished;
    pauseSvg();
    renderDemo();
  };

  const startDemo = () => {
    if (completed) {
      current = 0;
      completed = false;
    }
    playing = true;
    unpauseSvg();
    renderDemo();
    intervalId = window.setInterval(() => {
      if (current === states.length - 1) {
        stopDemo(true);
        return;
      }
      current += 1;
      renderDemo();
    }, 1800);
  };

  if (playButton && resetButton) {
    pauseSvg();
    renderDemo();
    playButton.addEventListener("click", () => {
      if (playing) stopDemo();
      else startDemo();
    });
    resetButton.addEventListener("click", () => {
      stopDemo();
      current = 0;
      completed = false;
      renderDemo();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && playing) stopDemo();
    });
    const motionChanged = () => {
      if (reducedMotion.matches) pauseSvg();
      else if (playing) unpauseSvg();
    };
    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", motionChanged);
    } else if (typeof reducedMotion.addListener === "function") {
      reducedMotion.addListener(motionChanged);
    }
  }

  // Tabs allow keyboard arrows, Home and End, and always keep one visible panel.
  const tabs = $$(".choice-tabs [role=tab]");
  const activateTab = (nextTab, focus = false) => {
    if (!nextTab) return;
    for (const tab of tabs) {
      const active = tab === nextTab;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !active;
    }
    if (focus) nextTab.focus();
  };
  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", event => {
      let destination = index;
      if (event.key === "ArrowRight") destination = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") destination = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") destination = 0;
      else if (event.key === "End") destination = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[destination], true);
    });
  }

  // Scroll effects are progressive enhancement; content stays visible when JavaScript is disabled.
  const reveals = $$("[data-reveal]");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    for (const el of reveals) el.classList.add("in-view");
  } else {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });
    for (const el of reveals) observer.observe(el);
  }

  // Keep FAQ concise without forcing a single open question.
  const toTop = $("#back-to-top");
  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    });
  }
})();
