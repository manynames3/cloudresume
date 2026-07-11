# V3 Architecture Preview Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the complete architecture diagrams for all three flagship systems on the homepage and release the validated revision through a new GitHub v3 repository and Cloudflare Pages project.

**Architecture:** Reuse the typed architecture artifacts already consumed by the case-study renderer, keeping homepage claims synchronized with the audited records. Add a dependency-free staging script that adapts the existing Vinext Worker bundle to Cloudflare Pages advanced mode, then release through a `v3` pull request merged into `main`.

**Tech Stack:** React 19, TypeScript, Vinext, CSS, Node test runner, GitHub CLI, Cloudflare Wrangler Pages

---

## File Map

- Modify `tests/rendered-html.test.mjs` for the three previews and new canonical origin.
- Modify `components/home-page.tsx` to render typed architecture figures.
- Modify `app/globals.css` for the editorial figure layout and mobile reflow.
- Modify `lib/site-url.ts` for the Cloudflare Pages canonical origin.
- Create `scripts/prepare-pages.mjs` to stage Pages advanced-mode output.
- Create `tests/prepare-pages.test.mjs` to verify staging.
- Modify `package.json` to expose `build:pages` and run every test file.

### Task 1: Specify visible homepage architecture evidence

**Files:**
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Add the failing architecture-preview test**

Add a test that renders `/`, selects figures with `data-architecture-preview`, and asserts exactly these records:

```js
const expectedArchitecturePreviews = new Map([
  ["inspectiq", ["/case-studies/inspectiq-architecture.webp", "inspectiq-architecture"]],
  ["terragate", ["/case-studies/terragate-architecture.webp", "terragate-architecture"]],
  ["clearpath", ["/case-studies/clearpath-architecture.webp", "clearpath-architecture"]],
]);
```

For every record, assert a nonempty alt, numeric width and height, `loading="lazy"`, the matching case-study link, and the architecture source link carrying `data-artifact-link`. Assert that the hero contains no preview.

- [ ] **Step 2: Verify RED**

Run `npm test`.

Expected: the new test fails because the homepage has no architecture-preview figures.

### Task 2: Render the typed architecture plates

**Files:**
- Modify: `components/home-page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Resolve the typed architecture artifact**

Inside the project loop, find the artifact with an image and throw `Missing architecture preview for ${study.slug}` if it is absent.

- [ ] **Step 2: Render the full figure after the existing project copy**

Render:

```tsx
<figure className="project-entry__architecture" data-architecture-preview={slug}>
  <div className="architecture-preview__meta">
    <p className="label">Architecture / retained review evidence</p>
    <p>{study.title}</p>
    <div className="architecture-preview__links">
      <a className="text-link" href={`/case-studies/${slug}`}>
        Read system case <span aria-hidden="true">→</span>
      </a>
      <ExternalLink
        href={architecture.href}
        className="text-link"
        label={`Open the ${study.title} architecture source in a new tab`}
        dataArtifactLink={architecture.id}
      >
        Architecture source
      </ExternalLink>
    </div>
  </div>
  <div className="architecture-preview__image">
    <img
      src={architecture.image.src}
      alt={architecture.image.alt}
      width={architecture.image.width}
      height={architecture.image.height}
      loading="lazy"
      decoding="async"
    />
  </div>
</figure>
```

- [ ] **Step 3: Add editorial figure CSS**

Use a ten-column subgrid-like layout: metadata in columns 1–3, image in columns 4–10, a faint field and thin border around the image, and `max-height: 46rem; object-fit: contain`. At the tablet breakpoint use a two-column split. At the mobile breakpoint stack metadata and image in source order.

- [ ] **Step 4: Verify GREEN**

Run `npm test` and expect every rendered route and claim-boundary test to pass.

### Task 3: Create the reproducible Pages staging build

**Files:**
- Create: `tests/prepare-pages.test.mjs`
- Create: `scripts/prepare-pages.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add the failing staging test**

Create temporary `client` and `server` fixture directories. After calling `preparePagesBundle`, assert:

```js
assert.equal(await readFile(join(outputDir, "index.html"), "utf8"), "client");
assert.equal(await readFile(join(outputDir, "_worker.js"), "utf8"), "worker");
assert.equal(await readFile(join(outputDir, "__vite_rsc_assets_manifest.js"), "utf8"), "manifest");
assert.equal(await readFile(join(outputDir, "ssr", "index.js"), "utf8"), "ssr");
await assert.rejects(access(join(outputDir, "index.js")));
```

- [ ] **Step 2: Verify staging RED**

Run `node --test tests/prepare-pages.test.mjs` and expect failure because the module is missing.

- [ ] **Step 3: Implement staging**

Export `preparePagesBundle({ clientDir, workerBundleFile, outputDir })` and `bundleWorker({ esbuildPath, entryFile, outputFile })`. Wrap the Vinext Worker with a Pages shell that sends `/assets/*` through `env.ASSETS.fetch`, prebundle the result into one Worker module, remove the output, copy the client tree, place the bundled file at `_worker.js`, and verify `_worker.js` and `_headers`. When executed directly, stage the result into `dist/pages`.

- [ ] **Step 4: Add package commands**

```json
"build:pages": "npm run build && node scripts/prepare-pages.mjs",
"test": "npm run build && node --test tests/*.test.mjs"
```

- [ ] **Step 5: Verify staging GREEN**

Run `node --test tests/prepare-pages.test.mjs` and `npm run build:pages`. Confirm the single self-contained `_worker.js`, `_headers`, assets, diagrams, and the résumé exist under `dist/pages`.

### Task 4: Move canonical metadata and validate v3

**Files:**
- Modify: `lib/site-url.ts`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Change the test origin first**

Set `canonicalOrigin` to `https://cloudresumev3.pages.dev`, run `npm test`, and confirm metadata tests fail against the previous origin.

- [ ] **Step 2: Change the application origin**

Set the application origin in `lib/site-url.ts` to `https://cloudresumev3.pages.dev`.

- [ ] **Step 3: Run final local gates**

Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build:pages`, and `git diff --check`. Every command must exit `0`.

- [ ] **Step 4: Inspect responsive layouts**

At `1440×900`, `1024×768`, `390×844`, and `320×844`, verify all diagrams are complete, labeled, linked, and have no horizontal overflow.

- [ ] **Step 5: Commit v3**

Commit the implementation as `feat: add flagship architecture previews`.

### Task 5: Publish and merge GitHub v3

- [ ] Create public repository `manynames3/cloudresume-v3`.
- [ ] Push pre-v3 commit `f4739372ac200a9a5c9943f64764aa8a1ca972ca` to `main`.
- [ ] Push final `HEAD` to `v3`.
- [ ] Open a pull request from `v3` to `main`, merge with a merge commit, and verify remote `main` contains the final tree.

### Task 6: Deploy and smoke-test Cloudflare Pages

- [ ] Create Pages project `cloudresumev3` with production branch `main`.
- [ ] Build the exact merged GitHub `main` with `npm ci` and `npm run build:pages`.
- [ ] Deploy `dist/pages` with compatibility date `2026-05-15` and `nodejs_compat`.
- [ ] Verify HTTP `200` for `/`, all case-study routes, the résumé, and all architecture images.
- [ ] Verify canonical and structured metadata use `https://cloudresumev3.pages.dev`.
- [ ] Open `https://cloudresumev3.pages.dev` in Codex as the deliverable tab.
