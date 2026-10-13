import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

let worker;
async function home() {
  worker ??= (await import(new URL(`../dist/server/index.js?supporting=${process.pid}`, import.meta.url))).default;
  const response = await worker.fetch(new Request("https://portfolio.test/", { headers: { accept: "text/html", host: "portfolio.test" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  return response.text();
}

function entry(html, title) {
  const rows = html.match(/<li\b[^>]*class="supporting-entry grid"[^>]*>[\s\S]*?<\/li>/g) ?? [];
  const row = rows.find(candidate => candidate.includes(`<h3>${title}</h3>`));
  assert.ok(row, `Missing supporting entry: ${title}`);
  return row;
}

test("features the transcription release without implying optional services or customer adoption", async () => {
  const html = await home();
  const row = entry(html, "Super Transcriber API");
  assert.ok(html.indexOf("<h3>Super Transcriber API</h3>") < html.indexOf("<h3>Pulpit / Serverless</h3>"));
  for (const phrase of ["Independent AWS API release", "Durable job admission", "interrupted-job recovery", "Stripe billing and Bedrock enrichment disabled", "source-URL ingestion and real-time streaming are not"]) assert.ok(row.includes(phrase), phrase);
  for (const path of ["docs/architecture.md", "openapi/openapi.yaml", "sdk/typescript", "docs/validation-evidence.md"]) assert.ok(row.includes(path), path);
  assert.match(row, /<details\b/);
  assert.doesNotMatch(row, /<details\b[^>]*\bopen(?:=|\s|>)/);
});

test("CareFrame retains its source identity and separates pilot checks from hospital adoption", async () => {
  const row = entry(await home(), "CareFrame");
  for (const phrase of ["powered by PhotoScribe AI", "fictional hospital and illustrative media", "Approval, consent, rights, and role access remain separate", "disposable QA accounts", "No hospital customer use, buyer acceptance, or regulatory certification"]) assert.ok(row.includes(phrase), phrase);
  assert.match(row, /docs\/staff-workflow-verification\.md/);
  assert.match(row, /docs\/end-user-readiness\.md/);
  assert.match(row, /https:\/\/github\.com\/manynames3\/photoscribe-ai/);
});

test("promotes ShiftClarity to selected work while keeping a retained Clearpath case", async () => {
  const html = await home();
  assert.match(html, /href="\/case-studies\/shiftclarity"/);
  const row = entry(html, "Clearpath");
  assert.match(row, /torn down after validation/);
  assert.match(row, /https:\/\/manynames3\.github\.io\/cloudresume\/case-studies\/clearpath\//);
  assert.doesNotMatch(html, /DriftGuard|inspectiq-walkthrough|scrollcraft/i);
  const profile = await readFile(new URL("../content/profile.ts", import.meta.url), "utf8");
  const paidExperience = profile.slice(profile.indexOf("export const experience"));
  assert.doesNotMatch(paidExperience, /ShiftClarity|CareFrame|Super Transcriber/);
});
