# V3 Architecture Preview Release

## Objective

Preserve the approved Precision Monograph portfolio while making the architecture of InspectIQ, TerraGate, and Clearpath visible from the homepage. Release this revision independently as v3 without changing the existing `manynames3/cloudresume` GitHub Pages site.

## Homepage Design

Each flagship project row becomes a two-stage editorial plate:

1. The existing project number, title, lifecycle boundary, summary, and case-study link remain the first scan layer.
2. A visible architecture figure follows within the same project article.

The figure uses the existing audited architecture artifact from the typed case-study record. It includes:

- the complete architecture image, never cropped;
- explicit intrinsic width and height;
- descriptive alternative text already maintained with the case study;
- lazy loading and asynchronous decoding;
- a compact `Architecture / retained review evidence` caption;
- a link to the case study and a direct HTTPS link to the maintained architecture source.

There is no lightbox, carousel, tab, hover dependency, animation dependency, or new client-side JavaScript. All three diagrams are present in server-rendered HTML.

## Visual Treatment

- Reuse the ivory, ink, muted-ink, signal-red, serif, monospace, and thin-rule system.
- The figure spans the editorial width beneath the project summary and is separated by a thin rule.
- Landscape diagrams use the available width. TerraGate’s portrait diagram remains complete and centered with a maximum display height rather than being cropped.
- A faint neutral field separates the white architecture canvas from the ivory page.
- On mobile, the caption, links, and diagram stack in source order with no horizontal overflow.
- The project index remains qualitative; no metrics or evidence ledger are added to the opening view.

## Content and Claim Boundaries

- Architecture previews are visual evidence, not proof of unverified runtime behavior.
- InspectIQ retains the warning that the source diagram’s gateway-authorizer label is not evidence of gateway enforcement.
- TerraGate retains deterministic-Python, mocked-write, and disabled-execution boundaries.
- Clearpath remains a torn-down validation with no live-demo CTA.
- No case-study evidence, lifecycle language, certification language, résumé content, social card, or supporting-system hierarchy changes.

## Reproducible Cloudflare Pages Build

Add a dependency-free Pages staging script and `build:pages` command:

1. Run the existing Vinext production build.
2. Copy `dist/client` into `dist/pages`.
3. Prebundle the Vinext Worker entry into one self-contained module with the pinned `esbuild` development dependency.
4. Copy the client output and bundled Worker to `dist/pages/_worker.js` for Pages advanced mode.
5. Preserve relative imports, client assets, `_headers`, and the résumé PDF.

The deployment uses Cloudflare Pages advanced mode with `nodejs_compat` and the project’s existing compatibility date. The public Pages project is `cloudresumev3` with production branch `main`.

Canonical URLs, structured-data identifiers, Open Graph image URLs, sitemap entries, and robots metadata move to `https://cloudresumev3.pages.dev` in the same release so the published site does not advertise the superseded Sites hostname.

## GitHub Release

- Create the new public repository `manynames3/cloudresume-v3`.
- Seed `main` from the validated pre-v3 source commit.
- Push the diagram and Pages-build revision as branch `v3`.
- Open and merge a pull request from `v3` into `main`.
- Do not modify `manynames3/cloudresume` or its GitHub Pages deployment.

## Acceptance Checks

- Homepage HTML contains exactly three architecture-preview figures, one for each unique flagship slug.
- Every preview uses the typed case-study image, alt text, width, height, case link, and architecture-source link.
- No architecture preview appears in the hero.
- All existing claim-boundary and route tests remain green.
- The Pages staging tests prove client assets and a self-contained `_worker.js` are produced without deploy-time relative module dependencies.
- `npm test`, lint, typecheck, `npm run build:pages`, and `git diff --check` pass.
- Rendered metadata and structured data use `https://cloudresumev3.pages.dev` as the canonical origin.
- Desktop, tablet, 390px mobile, and 320px reflow show complete diagrams without horizontal overflow.
- The merged GitHub `main` SHA matches the deployed Cloudflare Pages source SHA.
- `/`, the three case-study routes, the résumé PDF, and the three architecture images return successful responses on the Pages URL.
