/*
 * Registration proof: optional motion for the Precision Monograph homepage.
 *
 * The page is complete without this file. It only toggles attributes on
 * server-rendered elements and draws on the hero's aria-hidden <canvas>, so it
 * never adds or removes nodes React owns. If anything throws, it removes
 * html[data-motion] and every state it set, and the static page remains.
 *
 * Hero:  a red second plate (drawn per glyph from real text layout, so the H1
 *        stays one plain text node) starts out of register. A signal rule reads
 *        each baseline in turn and the plate locks as it passes. Pointer speed
 *        later pushes the plate out of register around the cursor; it springs
 *        back when the pointer rests. Touch, keyboard focus and no-hover
 *        devices get the same response from a tap, a focus pass or one
 *        automatic pass.
 * Index: flagship entries register once as they scroll into view.
 * Diagrams stay still; only graduations in their margin follow the pointer.
 */
(() => {
  "use strict";

  const root = document.documentElement;
  if (!root || root.hasAttribute("data-motion") || !("requestAnimationFrame" in window)) return;

  const SIGNAL = "197, 43, 34";
  const EPS_MAX = 0.018; // plate scale slip about the pointer
  const TH_MAX = 0.016; // plate rotation slip about the pointer, radians
  const LINE_START = 260;
  const LINE_STEP = 200;
  const RULE_MS = 520;
  const LOCK_MS = 900;
  const REST = { head: 1, tail: 1, amp: 0, alpha: 0 };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const clamp01 = (v) => clamp(v, 0, 1);
  const smooth = (t) => t * t * (3 - 2 * t);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  function createHero(config) {
    const hero = document.querySelector('[data-section="hero"]');
    const canvas = hero && hero.querySelector(".hero__plate");
    const h1 = hero && hero.querySelector("h1");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    if (!hero || !canvas || !h1 || !ctx || !canvas.parentElement) return null;

    const wrap = canvas.parentElement;
    const interactive = !config.reduce;
    const cleanups = [];
    const ptr = { x: 0, y: 0, px: 0, py: 0, t: 0, active: false, fresh: false, tap: 0 };
    const vel = { x: 0, y: 0 };
    const eps = { x: 0, v: 0 };
    const th = { x: 0, v: 0 };
    const cross = { x: 0, y: 0, a: 0 };

    let stopped = false;
    let live = false; // true once fonts are ready and layout has been measured
    let visible = true;
    let frame = 0;
    let relayoutFrame = 0;
    let readyTimer = 0;
    let autoTimer = 0;
    let last = 0;
    let box = null;
    let inner = { x: 0, w: 0 };
    let lines = [];
    let font = "";
    let fontSize = 80;
    let ascent = 66;
    let dpr = 1;
    let entrance = null;
    let auto = null;

    const guard = (handler) => (...args) => {
      if (stopped) return;
      try {
        return handler(...args);
      } catch {
        config.onError();
      }
    };

    const listen = (target, type, handler, options) => {
      const guarded = guard(handler);
      target.addEventListener(type, guarded, options);
      cleanups.push(() => target.removeEventListener(type, guarded, options));
    };

    function stop() {
      stopped = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(relayoutFrame);
      clearTimeout(readyTimer);
      clearTimeout(autoTimer);
      frame = relayoutFrame = 0;
      cleanups.splice(0).forEach((fn) => fn());
      hero.removeAttribute("data-hero");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /* ---- layout: real glyph positions from the live H1, no DOM changes ---- */

    function measure() {
      const r = h1.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return false;
      const w = wrap.getBoundingClientRect();
      const space = (edge) => clamp(edge - 2, 8, 48);
      const padL = space(r.left);
      const padR = space(root.clientWidth - r.right);
      const padY = 40;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const cssW = r.width + padL + padR;
      const cssH = r.height + padY * 2;
      const pxW = Math.round(cssW * dpr);
      const pxH = Math.round(cssH * dpr);
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      canvas.style.left = r.left - padL - w.left + "px";
      canvas.style.top = r.top - padY - w.top + "px";

      box = { w: cssW, h: cssH, left: r.left - padL, top: r.top - padY };
      inner = { x: padL, w: r.width };

      const cs = getComputedStyle(h1);
      fontSize = parseFloat(cs.fontSize) || 80;
      font = [cs.fontStyle, cs.fontWeight, cs.fontSize, cs.fontFamily].join(" ");
      ctx.font = font;
      const metrics = ctx.measureText("Hg");
      ascent = metrics.fontBoundingBoxAscent || fontSize * 0.82;
      lines = collectLines();
      return lines.length > 0;
    }

    function collectLines() {
      const out = [];
      const range = document.createRange();
      const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      let current = null;
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.nodeValue || "";
        for (let i = 0; i < text.length; i++) {
          const ch = text.charAt(i);
          if (!ch.trim()) continue;
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const g = range.getClientRects()[0];
          if (!g || !g.width) continue;
          if (!current || Math.abs(g.top - current.top) > g.height * 0.4) {
            current = {
              top: g.top,
              glyphs: [],
              left: g.left - box.left,
              right: 0,
              base: g.top + ascent - box.top,
            };
            out.push(current);
          }
          current.glyphs.push({ ch, x: g.left - box.left });
          current.right = g.right - box.left;
        }
      }
      return out;
    }

    function relayout() {
      if (relayoutFrame || !live || stopped) return;
      relayoutFrame = requestAnimationFrame(guard(() => {
        relayoutFrame = 0;
        if (stopped) return;
        if (measure() && canRun()) render(performance.now());
      }));
    }

    /* ---- entrance timeline ---- */

    function lineState(i, t) {
      const t0 = LINE_START + i * LINE_STEP;
      const head = easeInOut(clamp01((t - t0) / RULE_MS));
      const tail = easeInOut(clamp01((t - t0 - 170) / RULE_MS));
      const u = clamp01((t - t0 - RULE_MS) / LOCK_MS);
      const amp = u >= 1 ? 0 : Math.exp(-5.2 * u) * Math.cos(u * Math.PI * 2.6);
      const fadeIn = clamp01(t / 240);
      const fadeOut = 1 - smooth(clamp01((u - 0.72) / 0.28));
      return { head, tail, amp, alpha: u >= 1 ? 0 : 0.92 * fadeIn * fadeOut };
    }

    function inView() {
      const r = h1.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }

    function beginEntrance() {
      if (!lines.length || !inView() || document.hidden) {
        render(performance.now());
        return;
      }
      entrance = {
        t0: performance.now(),
        end: LINE_START + (lines.length - 1) * LINE_STEP + RULE_MS + LOCK_MS + 60,
      };
      hero.setAttribute("data-hero", "play");
      wake();
    }

    function finishEntrance() {
      if (!entrance) return;
      entrance = null;
      if (interactive && !fineQuery.matches && !autoTimer) {
        autoTimer = setTimeout(guard(() => {
          autoTimer = 0;
          startAuto(800);
        }), 200);
      }
    }

    /* A virtual pointer pass: the same physics as a real one, for devices
       without a fine pointer and for keyboard focus. Runs once per trigger. */
    function startAuto(duration) {
      if (!box || !lines.length || stopped || !visible || document.hidden || entrance) return;
      const rect = canvas.getBoundingClientRect();
      const first = lines[0].base;
      const lastBase = lines[lines.length - 1].base;
      const y = (first + lastBase) / 2 - fontSize * 0.3;
      auto = { t0: performance.now(), dur: duration, x0: inner.x - 6, x1: inner.x + inner.w + 6, y };
      ptr.x = ptr.px = rect.left + auto.x0;
      ptr.y = ptr.py = rect.top + y;
      ptr.t = auto.t0;
      ptr.active = true;
      ptr.fresh = true;
      wake();
    }

    /* ---- input ---- */

    function onMove(e) {
      auto = null;
      if (!ptr.active) {
        ptr.px = e.clientX;
        ptr.py = e.clientY;
        ptr.fresh = true;
      }
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.t = performance.now();
      ptr.active = true;
      wake();
    }

    function onLeave() {
      ptr.active = false;
      wake();
    }

    function onDown(e) {
      if (e.pointerType === "mouse") return;
      onMove(e);
      ptr.tap = performance.now() + 170;
    }

    function onFocus(e) {
      if (entrance || auto || !box) return;
      if (e.relatedTarget && hero.contains(e.relatedTarget)) return;
      let keyboard = false;
      try {
        keyboard = e.target.matches(":focus-visible");
      } catch {
        keyboard = false;
      }
      if (keyboard) startAuto(1000);
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        auto = null;
        ptr.active = false;
        finishEntrance();
        zero();
      } else if (live) {
        render(performance.now());
      }
    }

    /* ---- frame loop: runs only while something is moving ---- */

    function canRun() {
      return live && !stopped && !!box && visible && !document.hidden;
    }

    function wake() {
      if (frame || !canRun()) return;
      last = performance.now();
      frame = requestAnimationFrame(guard(tick));
    }

    function zero() {
      eps.x = eps.v = th.x = th.v = 0;
      cross.a = 0;
      vel.x = vel.y = 0;
      if (canRun()) render(performance.now());
    }

    function step(s, target, h) {
      s.v += (170 * (target - s.x) - 12 * s.v) * h;
      s.x += s.v * h;
    }

    function isActive(now) {
      const recent = ptr.active && now - ptr.t < 1700;
      return !!(
        entrance ||
        auto ||
        recent ||
        ptr.tap > now ||
        cross.a > 0.012 ||
        Math.abs(eps.x) > 2e-4 ||
        Math.abs(eps.v) > 2e-3 ||
        Math.abs(th.x) > 2e-4 ||
        Math.abs(th.v) > 2e-3
      );
    }

    function tick(now) {
      frame = 0;
      if (!canRun()) return;
      const dt = clamp((now - last) / 1000, 0.001, 0.034);
      last = now;
      const rect = canvas.getBoundingClientRect();

      if (auto) {
        const u = clamp01((now - auto.t0) / auto.dur);
        ptr.x = rect.left + auto.x0 + (auto.x1 - auto.x0) * easeInOut(u);
        ptr.y = rect.top + auto.y;
        ptr.t = now;
        if (u >= 1) {
          auto = null;
          ptr.active = false;
        }
      }
      if (entrance && now - entrance.t0 > entrance.end) finishEntrance();

      const cx = ptr.x - rect.left;
      const cy = ptr.y - rect.top;
      if (ptr.fresh) {
        cross.x = cx;
        cross.y = cy;
        ptr.fresh = false;
      }

      // Velocity of the pointer, smoothed, drives how far the plate slips.
      const dx = ptr.active ? ptr.x - ptr.px : 0;
      const dy = ptr.active ? ptr.y - ptr.py : 0;
      ptr.px = ptr.x;
      ptr.py = ptr.y;
      const k = 1 - Math.exp(-dt / 0.07);
      vel.x += (dx / dt - vel.x) * k;
      vel.y += (dy / dt - vel.y) * k;
      const speed = Math.hypot(vel.x, vel.y);

      // Influence fades with distance from the headline block.
      const ex = Math.max(inner.x - cx, 0, cx - (inner.x + inner.w));
      const ey = Math.max(-cy, 0, cy - box.h);
      const influence = ptr.active ? 1 - smooth(clamp01(Math.hypot(ex, ey) / 280)) : 0;

      let tEps = clamp(speed * 1.1e-5, 0, EPS_MAX) * influence;
      let tTh = clamp(vel.x * 0.9e-5, -TH_MAX, TH_MAX) * influence;
      if (ptr.tap > now) {
        const side = cx < inner.x + inner.w / 2 ? -1 : 1;
        tEps = Math.max(tEps, EPS_MAX * 0.9 * influence);
        tTh = side * TH_MAX * 0.7 * influence;
      }
      step(eps, tEps, dt / 2);
      step(th, tTh, dt / 2);
      step(eps, tEps, dt / 2);
      step(th, tTh, dt / 2);

      const showing = ptr.active && now - ptr.t < 1600;
      cross.a += ((showing ? 1 : 0) - cross.a) * (1 - Math.exp(-dt / 0.14));
      if (ptr.active) {
        const kk = 1 - Math.exp(-dt / 0.05);
        cross.x += (cx - cross.x) * kk;
        cross.y += (cy - cross.y) * kk;
      }

      if (isActive(now)) {
        render(now);
        frame = requestAnimationFrame(guard(tick));
      } else {
        zero();
      }
    }

    /* ---- drawing ---- */

    function render(now) {
      if (!box || !lines.length) return;
      const t = entrance ? Math.max(0, now - entrance.t0) : null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.w, box.h);
      ctx.lineWidth = 1;

      const states = lines.map((_, i) => (t === null ? REST : lineState(i, t)));
      lines.forEach((line, i) => drawRule(line, states[i]));

      const slip = clamp01((Math.abs(eps.x) / EPS_MAX + Math.abs(th.x) / TH_MAX) * 1.6);
      if (slip > 0.02 || states.some((s) => s.alpha > 0.02)) drawPlate(states, slip);
    }

    function drawRule(line, s) {
      const y = Math.round(line.base) + 0.5;
      const xs = line.left - 15;
      const xe = line.right + 10;
      ctx.strokeStyle = `rgba(${SIGNAL},0.95)`;
      ctx.beginPath();
      if (s.head > 0 && s.tail < 1) {
        const hx = xs + (xe - xs) * s.head;
        const tx = xs + (xe - xs) * s.tail;
        ctx.moveTo(tx, y);
        ctx.lineTo(hx, y);
        if (s.head < 1) {
          const hxp = Math.round(hx) + 0.5;
          ctx.moveTo(hxp, y - 6);
          ctx.lineTo(hxp, y + 6);
        }
      }
      ctx.stroke();
    }

    function drawPlate(states, slip) {
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.font = font;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      const px = clamp(cross.x, 0, box.w);
      const py = clamp(cross.y, 0, box.h);

      lines.forEach((line, i) => {
        const s = states[i];
        const alpha = Math.max(s.alpha, slip * 0.92);
        if (alpha < 0.02) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (slip > 0.02) {
          ctx.translate(px, py);
          ctx.rotate(th.x);
          ctx.scale(1 + eps.x, 1 + eps.x);
          ctx.translate(-px, -py);
        }
        if (s.amp !== 0) {
          ctx.translate(line.left + s.amp * 0.11 * fontSize, line.base - s.amp * 0.035 * fontSize);
          ctx.rotate(s.amp * 0.012);
          ctx.scale(1 + s.amp * 0.018, 1 + s.amp * 0.018);
          ctx.translate(-line.left, -line.base);
        }
        for (let g = 0; g < line.glyphs.length; g++) {
          ctx.fillText(line.glyphs[g].ch, line.glyphs[g].x, line.base);
        }
        ctx.restore();
      });
    }

    /* ---- start ---- */

    function release() {
      if (live || stopped) return;
      live = true;
      if (!measure()) return;
      if (config.entrance) beginEntrance();
      else render(performance.now());
    }

    try {
      listen(window, "resize", relayout);
      listen(document, "visibilitychange", onVisibility);
      if (typeof ResizeObserver === "function") {
        const resizeObserver = new ResizeObserver(guard(relayout));
        resizeObserver.observe(h1);
        cleanups.push(() => resizeObserver.disconnect());
      }
      if (typeof IntersectionObserver === "function") {
        const visibility = new IntersectionObserver(guard((entries) => {
          visible = entries[entries.length - 1].isIntersecting;
          if (!visible) {
            cancelAnimationFrame(frame);
            frame = 0;
            auto = null;
            ptr.active = false;
            entrance = null;
            eps.x = eps.v = th.x = th.v = 0;
            cross.a = 0;
          } else if (live) {
            render(performance.now());
          }
        }));
        visibility.observe(hero);
        cleanups.push(() => visibility.disconnect());
      }
      if (document.fonts) listen(document.fonts, "loadingdone", relayout);
      if (interactive) {
        listen(hero, "pointermove", onMove, { passive: true });
        listen(hero, "pointerdown", onDown, { passive: true });
        listen(hero, "pointerleave", onLeave);
        listen(hero, "pointercancel", onLeave);
        listen(hero, "focusin", onFocus);
      }

      // Measure after the display face has loaded so glyph positions are real.
      const cs = getComputedStyle(h1);
      const face = [cs.fontStyle, cs.fontWeight, cs.fontSize, cs.fontFamily].join(" ");
      const loading =
        document.fonts && document.fonts.load
          ? Promise.all([document.fonts.load(face, h1.textContent || ""), document.fonts.ready])
          : Promise.resolve();
      const complete = guard(release);
      loading.then(complete, complete);
      readyTimer = setTimeout(complete, 900);
    } catch {
      stop();
      return null;
    }

    return { stop };
  }

  /* Flagship entries register once as they arrive. Entries already on screen
     (or scrolled past) are left in their finished state. */
  function createIndex() {
    if (!("IntersectionObserver" in window)) return null;
    const items = Array.from(document.querySelectorAll(".project-list > li"));
    if (!items.length) return null;

    const jobs = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const job = jobs.get(entry.target);
          if (!job || !entry.isIntersecting) continue;
          job.item.setAttribute(job.attribute, "in");
          jobs.delete(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0.12 },
    );

    const fold = window.innerHeight * 0.84;
    const arm = (item, target, attribute) => {
      if (!target || target.getBoundingClientRect().top <= fold) return;
      item.setAttribute(attribute, "pending");
      jobs.set(target, { item, attribute });
      observer.observe(target);
    };
    items.forEach((item) => {
      arm(item, item.querySelector(".project-entry__title"), "data-reg-head");
      arm(item, item.querySelector(".architecture-preview__image"), "data-reg-frame");
    });

    return {
      stop() {
        observer.disconnect();
        jobs.clear();
        items.forEach((item) => {
          item.removeAttribute("data-reg-head");
          item.removeAttribute("data-reg-frame");
        });
      },
    };
  }

  /* Graduations in the diagram margin follow the pointer (or sit centred on
     keyboard focus). The diagram itself is never covered or moved. */
  function createInspect() {
    const links = Array.from(document.querySelectorAll(".architecture-preview__image"));
    if (!links.length) return null;
    const disposers = [];

    links.forEach((link) => {
      let raf = 0;
      let x = 0;
      let y = 0;
      const place = () => {
        raf = 0;
        const r = link.getBoundingClientRect();
        link.style.setProperty("--cx", clamp(x - r.left, 0, r.width) + "px");
        link.style.setProperty("--cy", clamp(y - r.top, 0, r.height) + "px");
      };
      const onMove = (e) => {
        x = e.clientX;
        y = e.clientY;
        if (!raf) raf = requestAnimationFrame(place);
      };
      const onFocus = () => {
        const r = link.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
        place();
      };
      link.addEventListener("pointerenter", onMove, { passive: true });
      link.addEventListener("pointermove", onMove, { passive: true });
      link.addEventListener("focus", onFocus);
      disposers.push(() => {
        cancelAnimationFrame(raf);
        link.removeEventListener("pointerenter", onMove);
        link.removeEventListener("pointermove", onMove);
        link.removeEventListener("focus", onFocus);
        link.style.removeProperty("--cx");
        link.style.removeProperty("--cy");
      });
    });

    return { stop: () => disposers.splice(0).forEach((fn) => fn()) };
  }

  /* ---- lifecycle ---- */

  let session = [];
  let entrancePlayed = false;

  function teardown() {
    session.splice(0).forEach((part) => {
      try {
        part.stop();
      } catch {
        /* keep tearing down */
      }
    });
  }

  function failOpen() {
    teardown();
    root.removeAttribute("data-motion");
  }

  function begin() {
    teardown();
    const reduce = reduceQuery.matches;
    const entrance = !reduce && !entrancePlayed;
    entrancePlayed = true;
    root.setAttribute("data-motion", reduce ? "static" : "on");
    try {
      // Register each disposer before starting the next enhancement. A later
      // setup failure must not orphan an already-created hero or observer.
      const add = (part) => { if (part) session.push(part); };
      add(createHero({ reduce, entrance, onError: failOpen }));
      if (!reduce) {
        add(createIndex());
        add(createInspect());
      }
      if (!session.length) root.removeAttribute("data-motion");
    } catch {
      failOpen();
    }
  }

  const attachPreference = () => {
    if (reduceQuery.addEventListener) reduceQuery.addEventListener("change", begin);
    else if (reduceQuery.addListener) reduceQuery.addListener(begin);
  };

  const detachPreference = () => {
    if (reduceQuery.removeEventListener) reduceQuery.removeEventListener("change", begin);
    else if (reduceQuery.removeListener) reduceQuery.removeListener(begin);
  };

  const boot = () => {
    begin();
    attachPreference();
  };

  // Release the enhancement on navigation, including back-forward cache
  // entries. Restoring a cached page does not replay the entrance.
  window.addEventListener("pagehide", () => {
    detachPreference();
    failOpen();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) boot();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
