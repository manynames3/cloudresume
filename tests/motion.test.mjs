import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const motionSource = await read("public/motion/portfolio-motion.js");

// Runs the real script against a minimal document that has nothing to enhance.
function runMotion({ reduce = false, querySelectorAll, withObserver = false } = {}) {
  const attributes = new Map();
  const media = { matches: reduce, addEventListener() {}, removeEventListener() {} };
  const sandbox = {
    document: {
      readyState: "complete",
      hidden: false,
      documentElement: {
        hasAttribute: (name) => attributes.has(name),
        setAttribute: (name, value) => attributes.set(name, String(value)),
        removeAttribute: (name) => attributes.delete(name),
      },
      querySelector: () => null,
      querySelectorAll: querySelectorAll ?? (() => []),
      addEventListener() {},
    },
    matchMedia: () => media,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
    addEventListener() {},
    removeEventListener() {},
  };
  if (withObserver) sandbox.IntersectionObserver = function IntersectionObserver() {};
  sandbox.window = sandbox;
  vm.runInNewContext(motionSource, sandbox);
  return attributes;
}

// Exercise the actual enhancement lifecycle, not just source-token matches.
// Layout/canvas are small fixtures; no browser or performance result is implied.
async function heroRuntime({ reduce = false, finePointer = true, failIndex = false, failMeasure = false } = {}) {
  const eventTarget = (extra = {}) => {
    const listeners = new Map();
    return {
      ...extra,
      listeners,
      addEventListener(type, fn) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(fn);
      },
      removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
      emit(type, event = {}) { for (const fn of [...(listeners.get(type) ?? [])]) fn(event); },
    };
  };
  const attributes = () => {
    const values = new Map();
    return {
      values,
      hasAttribute: (name) => values.has(name),
      setAttribute: (name, value) => values.set(name, String(value)),
      removeAttribute: (name) => values.delete(name),
    };
  };
  const rect = { left: 100, right: 800, top: 200, bottom: 300, width: 700, height: 100 };
  const h1 = eventTarget({ textContent: "Cloud systems people can understand, operate, and trust.", getBoundingClientRect: () => rect });
  let draws = 0;
  let segments = 0;
  const context = {
    setTransform() {}, clearRect() {}, beginPath() {}, moveTo() {}, lineTo() { segments++; }, stroke() {},
    save() {}, restore() {}, translate() {}, rotate() {}, scale() {}, fillText() { draws++; },
    measureText: () => ({ fontBoundingBoxAscent: 66 }),
  };
  const canvas = { style: {}, width: 0, height: 0, getContext: () => context,
    parentElement: { getBoundingClientRect: () => rect }, getBoundingClientRect: () => rect };
  const hero = eventTarget({ ...attributes(), contains: () => false,
    querySelector: (selector) => selector === "h1" ? h1 : canvas });
  const root = { ...attributes(), clientWidth: 1440 };
  const reduced = eventTarget({ matches: reduce });
  const fine = eventTarget({ matches: finePointer });
  const frames = new Map();
  const timers = new Map();
  const observers = [];
  let now = 0;
  let id = 0;
  const document = eventTarget({
    documentElement: root, readyState: "complete", hidden: false,
    querySelector: () => hero,
    querySelectorAll: () => { if (failIndex) throw new Error("index setup failed"); return []; },
    createTreeWalker() {
      let read = false;
      return { nextNode: () => { if (read) return null; read = true; return { nodeValue: h1.textContent }; } };
    },
    createRange() {
      if (failMeasure) throw new Error("layout failed after font readiness");
      let offset = 0;
      return { setStart(_node, i) { offset = i; }, setEnd() {},
        getClientRects: () => [{ left: 100 + offset * 10, right: 110 + offset * 10, top: 200, width: 10, height: 80 }] };
    },
  });
  const sandbox = eventTarget({
    document, NodeFilter: { SHOW_TEXT: 4 }, innerHeight: 900, devicePixelRatio: 1,
    performance: { now: () => now },
    matchMedia: (query) => query.includes("reduced-motion") ? reduced : fine,
    getComputedStyle: () => ({ fontStyle: "normal", fontWeight: "400", fontSize: "80px", fontFamily: "serif" }),
    requestAnimationFrame(fn) { const next = ++id; frames.set(next, fn); return next; },
    cancelAnimationFrame(frame) { frames.delete(frame); },
    setTimeout(fn, delay) { const next = ++id; timers.set(next, { fn, at: now + delay }); return next; },
    clearTimeout(timer) { timers.delete(timer); },
    IntersectionObserver: class {
      constructor(fn) { this.fn = fn; this.targets = []; this.disconnected = false; observers.push(this); }
      observe(target) { this.targets.push(target); }
      disconnect() { this.disconnected = true; }
    },
  });
  sandbox.window = sandbox;
  vm.runInNewContext(motionSource, sandbox);
  await Promise.resolve();
  const advance = (ms) => {
    now += ms;
    for (const [key, timer] of [...timers]) if (timer.at <= now) { timers.delete(key); timer.fn(); }
    const queue = [...frames];
    frames.clear();
    for (const [, fn] of queue) fn(now);
  };
  return { sandbox, document, hero, root, reduced, frames, timers, observers, advance, draws: () => draws, segments: () => segments };
}

test("settled hero and cursor interaction draw no grid or baseline underscores", async () => {
  const runtime = await heroRuntime();
  for (let frame = 0; frame < 250; frame++) runtime.advance(16);
  const before = runtime.segments();
  runtime.hero.emit("pointermove", { pointerType: "mouse", clientX: 400, clientY: 240 });
  runtime.advance(16);
  runtime.hero.emit("pointermove", { pointerType: "mouse", clientX: 450, clientY: 260 });
  for (let frame = 0; frame < 150; frame++) runtime.advance(16);
  assert.equal(runtime.segments(), before, "pointer motion must not draw decorative lines");
});

test("partial initialization and asynchronous layout failures release the hero", async () => {
  for (const options of [{ failIndex: true }, { failMeasure: true }]) {
    const runtime = await heroRuntime(options);
    assert.equal(runtime.root.hasAttribute("data-motion"), false);
    assert.equal(runtime.frames.size, 0);
    assert.equal(runtime.timers.size, 0);
    assert.equal(runtime.hero.listeners.get("pointermove")?.size ?? 0, 0);
    assert.ok(runtime.observers.every((observer) => observer.disconnected));
  }
});

test("hero choreography settles without an idle animation loop", async () => {
  const runtime = await heroRuntime();
  assert.equal(runtime.root.values.get("data-motion"), "on");
  assert.ok(runtime.frames.size > 0);
  for (let frame = 0; frame < 250; frame++) runtime.advance(16);
  assert.ok(runtime.draws() > 0, "the real plate renderer should have drawn glyphs");
  assert.equal(runtime.frames.size, 0);
  assert.equal(runtime.timers.size, 0);
});

test("no-hover devices receive one finite pass rather than an ambient loop", async () => {
  const runtime = await heroRuntime({ finePointer: false });
  for (let frame = 0; frame < 650; frame++) runtime.advance(16);
  assert.ok(runtime.draws() > 0);
  assert.equal(runtime.frames.size, 0);
  assert.equal(runtime.timers.size, 0);
});

test("reduced motion starts static and live preference changes cancel motion", async () => {
  const staticRuntime = await heroRuntime({ reduce: true });
  assert.equal(staticRuntime.root.values.get("data-motion"), "static");
  assert.equal(staticRuntime.frames.size, 0);
  assert.equal(staticRuntime.draws(), 0);
  assert.equal(staticRuntime.hero.listeners.get("pointermove")?.size ?? 0, 0);

  const runtime = await heroRuntime();
  runtime.reduced.matches = true;
  runtime.reduced.emit("change");
  await Promise.resolve();
  assert.equal(runtime.root.values.get("data-motion"), "static");
  assert.equal(runtime.frames.size, 0);
  assert.equal(runtime.hero.listeners.get("pointermove")?.size ?? 0, 0);
  assert.equal(runtime.hero.hasAttribute("data-hero"), false);
});

test("hidden and offscreen heroes stop frames; cache restoration does not replay", async () => {
  const hidden = await heroRuntime();
  hidden.document.hidden = true;
  hidden.document.emit("visibilitychange");
  assert.equal(hidden.frames.size, 0);

  const offscreen = await heroRuntime();
  offscreen.observers[0].fn([{ isIntersecting: false }]);
  assert.equal(offscreen.frames.size, 0);

  const cached = await heroRuntime();
  cached.sandbox.emit("pagehide");
  assert.equal(cached.frames.size, 0);
  assert.equal(cached.timers.size, 0);
  assert.equal(cached.reduced.listeners.get("change")?.size ?? 0, 0);
  assert.equal(cached.root.hasAttribute("data-motion"), false);
  cached.sandbox.emit("pageshow", { persisted: true });
  await Promise.resolve();
  assert.equal(cached.root.values.get("data-motion"), "on");
  assert.equal(cached.hero.hasAttribute("data-hero"), false);
  assert.equal(cached.frames.size, 0);
});

test("motion script fails open when there is nothing to enhance", () => {
  assert.equal(runMotion().has("data-motion"), false);
  assert.equal(runMotion({ reduce: true }).has("data-motion"), false);
});

test("motion script removes its flag and swallows errors if enhancement throws", () => {
  const attributes = runMotion({
    withObserver: true,
    querySelectorAll() {
      throw new Error("boom");
    },
  });
  assert.equal(attributes.has("data-motion"), false);
});

test("motion script honours reduced motion, pauses, and cleans up", () => {
  assert.match(motionSource, /prefers-reduced-motion: reduce/);
  assert.match(motionSource, /visibilitychange/);
  assert.match(motionSource, /IntersectionObserver/);
  assert.match(motionSource, /cancelAnimationFrame/);
  assert.match(motionSource, /removeEventListener/);
  assert.match(motionSource, /\.disconnect\(\)/);
  assert.doesNotMatch(motionSource, /setInterval|\bimport\s|\brequire\(/);
});

test("hidden or displaced states exist only once the script has flagged success", async () => {
  const css = await read("app/globals.css");
  const selectors = [...css.matchAll(/([^{}]*\[data-reg-(?:head|frame)="pending"\][^{}]*)\{/g)].map(
    (match) => match[1],
  );
  assert.ok(selectors.length > 0, "pending states should be styled");
  for (const list of selectors) {
    for (const selector of list.split(",")) {
      assert.match(selector.trim(), /^html\[data-motion="on"\]/, selector.trim());
    }
  }
  assert.doesNotMatch(css, /animation-iteration-count:\s*infinite|animation:[^;]*\binfinite\b/);
  assert.match(css, /--registration-travel:[^;]*var\(--page-pad\)/);
});

test("homepage renders the optional script and decorative layers without new content", async () => {
  const source = await read("components/home-page.tsx");
  assert.match(source, /<script src="\/motion\/portfolio-motion\.js" defer data-portfolio-motion="" \/>/);
  assert.match(source, /<canvas className="hero__plate" aria-hidden="true" \/>/);
  assert.match(await read("components/architecture-figure.tsx"), /className="registration" aria-hidden="true"/);
  assert.equal(source.match(/<h1\b/g)?.length, 1);
  assert.doesNotMatch(source, /["']use client["']/);
});

test("diagram graduations stay bounded by their current container after resize", async () => {
  const css = await read("app/globals.css");
  assert.match(css, /\.registration\s*\{[^}]*container-type:\s*size/s);
  assert.match(css, /clamp\(0px, var\(--cx, 0px\), calc\(100cqw - 1px\)\)/);
  assert.match(css, /clamp\(0px, var\(--cy, 0px\), calc\(100cqh - 1px\)\)/);
});
