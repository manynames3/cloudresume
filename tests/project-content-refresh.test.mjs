import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

let worker;
async function page(route = "/") {
  worker ??= (await import(new URL(`../dist/server/index.js?refresh=${process.pid}`, import.meta.url))).default;
  const response = await worker.fetch(new Request(`https://portfolio.test${route}`, { headers: { accept: "text/html", host: "portfolio.test" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  return response.text();
}

test("selected projects follow the approved order without duplicating ShiftClarity in supporting work", async () => {
  const html = await page();
  const selected = [...html.matchAll(/data-architecture-preview="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(selected, ["shiftclarity", "inspectiq", "terragate"]);
  const supporting = html.slice(html.indexOf('id="supporting"'), html.indexOf('id="experience"'));
  assert.doesNotMatch(supporting, /<h3>ShiftClarity<\/h3>/);
  assert.match(supporting, /<h3>Clearpath<\/h3>/);
  assert.match(html, /Independent projects/);
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = data["@graph"].find(item => item["@type"] === "ItemList");
  assert.deepEqual(list.itemListElement.map(item => item.name), ["ShiftClarity", "InspectIQ", "TerraGate"]);
});

test("ShiftClarity separates memory-only demonstration, persistent synthetic pilot, and real-data gates", async () => {
  const html = await page("/case-studies/shiftclarity");
  for (const phrase of ["synthetic-pilot", "fictional records", "roles are simulated", "server-side membership", "shared TypeScript engine", "exact decimal arithmetic", "Unknown terms stay unknown", "Isolated Neon/S3-to-local rehearsal", "not a full rerun", "No customer adoption, recovered revenue"]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /href="https:\/\/shiftclarity.pages.dev\/demo\/"/);
  assert.match(html, /href="https:\/\/shiftclarity.pages.dev\/pilot\/"/);
  assert.match(html, /assigned account required/);
  assert.match(html, /data-reliability-artifact="shiftclarity-security"/);
  assert.match(html, /data-recovery-artifact="shiftclarity-tests"/);
});

test("InspectIQ preserves historical proof and independently labels frontend, backend and unmerged work", async () => {
  const html = await page("/case-studies/inspectiq");
  for (const phrase of ["9d10913", "f0c8697", "apply was skipped", "Unmerged draft PR #1", "historical evidence", "current-QC unverified", "physical-device", "Deterministic tests do not establish model accuracy"]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /b4b7b3ea9baa3209709f2cf1930bedeb5d856d8b\/docs\/condition-qc-product.md/);
  assert.match(html, /ec5474c543ab1e069533e19f85d63c5e0c239136\/docs\/live-production-proof.md/);
});

test("native Android work links the actual merged CI and retains offline and distribution limits", async () => {
  const html = await page();
  for (const phrase of ["Market Scout Android", "versioned public JSON contract", "five API 35 emulator cases", "previously downloaded", "not synchronized across devices", "no Google Play release", "2022 ACS estimate", "38361037385"]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /8accc6d1dabb7644c09175ef6d0d08e50d1a2741\/docs\/android.md/);
});

test("engineering experiments cannot be mistaken for production Kubernetes or real-agent benchmarks", async () => {
  const home = await page();
  assert.match(home, /draft PR #1 records a local Kubernetes evaluation/);
  assert.match(home, /not deployed EKS, high availability/);
  assert.match(home, /SQLite chart rejects more than one API replica/);
  const terra = await page("/case-studies/terragate");
  for (const phrase of ["unmerged draft PR #8", "synthetic harness tests", "makes no AI calls", "not hardened OS isolation", "real agent benchmarks"]) assert.ok(terra.includes(phrase), phrase);
  assert.doesNotMatch(home + terra, /DriftGuard|Scrollcraft/i);
});

test("original diagrams show the actual reviewed paths and social copy matches the new positioning", async () => {
  const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const terra = await read("public/case-studies/originals/terragate-live-architecture.svg");
  for (const name of ["Cloudflare", "API Gateway", "Lambda", "Neon", "Mocked in public demo", "Can expire"]) assert.ok(terra.includes(name), name);
  assert.doesNotMatch(terra.replace(/<image\b[^>]*>/g, ""), /\bRDS\b|private subnets/);
  const shift = await read("public/case-studies/originals/shiftclarity-architecture.svg");
  for (const name of ["Cognito", "Private S3", "SQS FIFO", "Worker Lambda", "Neon", "fictional", "SYNTHETIC PILOT"]) assert.ok(shift.toLowerCase().includes(name.toLowerCase()), name);
  const social = await read("public/case-studies/originals/portfolio-social.svg");
  assert.match(social, /AI APPLICATIONS &amp; CLOUD ENGINEER/);
  assert.match(social, /can understand, operate,/);
  assert.doesNotMatch(social, /AWS INFRASTRUCTURE|can operate, inspect/);
});
