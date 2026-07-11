import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { bundleWorker, preparePagesBundle } from "../scripts/prepare-pages.mjs";
import { createPagesWorker } from "../scripts/pages-worker-shell.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

test("stages Vinext client assets and a bundled Worker for Pages advanced mode", async () => {
  const root = await mkdtemp(join(tmpdir(), "cloudresume-pages-"));
  const clientDir = join(root, "client");
  const workerBundleDir = join(root, "worker-bundle");
  const workerBundleFile = join(workerBundleDir, "_worker.js");
  const outputDir = join(root, "pages");

  try {
    await mkdir(workerBundleDir, { recursive: true });
    await mkdir(clientDir, { recursive: true });
    await writeFile(join(clientDir, "index.html"), "client");
    await writeFile(join(clientDir, "_headers"), "headers");
    await writeFile(workerBundleFile, "worker");

    await preparePagesBundle({ clientDir, workerBundleFile, outputDir });

    assert.equal(await readFile(join(outputDir, "index.html"), "utf8"), "client");
    assert.equal(await readFile(join(outputDir, "_worker.js"), "utf8"), "worker");
    await assert.rejects(access(join(outputDir, "index.js")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("prebundles relative Worker modules into one Pages entry file", async () => {
  const root = await mkdtemp(join(tmpdir(), "cloudresume-worker-bundle-"));
  const entryFile = join(root, "index.js");
  const dependencyFile = join(root, "dependency.js");
  const outputFile = join(root, "bundle", "_worker.js");

  try {
    await writeFile(dependencyFile, 'export const value = "bundled-value";');
    await writeFile(
      entryFile,
      'import { value } from "./dependency.js"; export default { fetch() { return new Response(value); } };',
    );

    await bundleWorker({
      esbuildPath: join(projectRoot, "node_modules", ".bin", "esbuild"),
      entryFile,
      outputFile,
    });

    const bundle = await readFile(outputFile, "utf8");
    assert.match(bundle, /bundled-value/);
    assert.doesNotMatch(bundle, /from\s*["']\.\/dependency\.js["']/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("serves hashed client assets through the Pages ASSETS binding", async () => {
  const calls = [];
  const app = {
    fetch(request) {
      calls.push(["app", new URL(request.url).pathname]);
      return new Response("app");
    },
  };
  const assets = {
    fetch(request) {
      calls.push(["assets", new URL(request.url).pathname]);
      return new Response("asset");
    },
  };
  const worker = createPagesWorker(app);

  assert.equal(
    await (await worker.fetch(new Request("https://example.com/assets/site.css"), { ASSETS: assets })).text(),
    "asset",
  );
  assert.equal(
    await (await worker.fetch(new Request("https://example.com/case-studies/inspectiq"), { ASSETS: assets })).text(),
    "app",
  );
  assert.deepEqual(calls, [
    ["assets", "/assets/site.css"],
    ["app", "/case-studies/inspectiq"],
  ]);
});
