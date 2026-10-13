import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const script = await readFile(new URL("../public/presentation/architecture-viewer.js", import.meta.url), "utf8");
function runtime({ supported = true } = {}) {
  const events = (extra = {}) => {
    const listeners = new Map();
    return { ...extra, listeners,
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      emit(name, event) { for (const fn of [...(listeners.get(name) ?? [])]) fn(event); },
    };
  };
  let focused = false;
  let opened = false;
  const image = { style: {}, getAttribute: (name) => name === "width" ? "2000" : "1148" };
  const viewport = { clientWidth: 800, clientHeight: 600, querySelector: () => image, scrollTo() {} };
  const buttons = ["out", "fit", "in"].map(value => ({ dataset: { diagramZoom: value } }));
  const dialog = events({ querySelector: () => viewport, querySelectorAll: () => buttons });
  if (supported) dialog.showModal = () => { opened = true; };
  const trigger = events({ dataset: { diagramOpen: "viewer" }, focus() { focused = true; } });
  const window = events();
  vm.runInNewContext(script, { document: { querySelectorAll: () => [trigger], getElementById: () => dialog }, window });
  const click = (overrides = {}) => {
    let prevented = false;
    trigger.emit("click", { button: 0, preventDefault() { prevented = true; }, ...overrides });
    return prevented;
  };
  const zoom = (direction) => dialog.emit("click", { target: { closest: () => buttons.find(button => button.dataset.diagramZoom === direction) } });
  return { click, zoom, dialog, image, viewport, window, buttons, focused: () => focused, opened: () => opened };
}

test("viewer falls back to its original-image link without native dialog support", () => {
  assert.equal(runtime({ supported: false }).click(), false);
  assert.equal(runtime().click({ metaKey: true }), false);
});
test("native viewer fits, zooms, respects limits, and restores its trigger on close", () => {
  const r = runtime();
  assert.equal(r.click(), true);
  assert.equal(r.opened(), true);
  assert.equal(r.image.style.width, "800px");
  assert.equal(r.buttons[0].disabled, true);
  r.zoom("in");
  assert.ok(Math.abs(parseFloat(r.image.style.width) - 1120) < .01);
  for (let i = 0; i < 10; i++) r.zoom("in");
  assert.equal(r.image.style.width, "4000px");
  assert.equal(r.buttons[2].disabled, true);
  r.viewport.clientWidth = 280;
  r.zoom("fit");
  assert.equal(r.image.style.width, "280px");
  r.dialog.emit("close");
  assert.equal(r.focused(), true);
  assert.equal(r.window.listeners.get("resize").size, 0);
});
