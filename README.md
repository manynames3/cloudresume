# Aiden Rhaa — AI Applications & Cloud Engineer

> Cloud systems people can understand, operate, and trust.

A product-minded engineering portfolio connecting business requirements with tested applications, AI-assisted review, web/native data contracts, and the cloud infrastructure beneath them. The case studies explain how each system works, why key decisions were made, and what another engineer needs to operate or extend it.

[Portfolio](https://manynames3.github.io/cloudresume/) · [Current source · v3](https://github.com/manynames3/cloudresume/tree/v3)

The current implementation and release workflow live on `v3`; `master` retains the legacy site.

## Selected cloud systems

These are independent cloud reference systems, presented separately from paid professional experience. Each case study includes product context, architecture, consequential decisions, security and reliability boundaries, recovery paths, implementation artifacts, and known limitations.

- [ShiftClarity](https://manynames3.github.io/cloudresume/case-studies/shiftclarity/) — Contract-to-invoice review with exact calculations, source lineage, independent rule approval, and a deployed synthetic AWS pilot. The public demo is memory-only; the persistent pilot requires an assigned account and authenticator. Fictional results establish no collected revenue, customer adoption, compliance certification, or production RPO/RTO.
- [InspectIQ](https://manynames3.github.io/cloudresume/case-studies/inspectiq/) — A vehicle inspection platform connecting guided photo evidence, asynchronous AI-assisted analysis, human review, grading, and condition reports. The application is live and AWS-backed. Public evaluation decisions stay within the browser session and do not change persistent records. Cognito JWT/RBAC enforcement is at the application layer; API Gateway authorizer enforcement and model-accuracy benchmarks are not claimed.
- [TerraGate](https://manynames3.github.io/cloudresume/case-studies/terragate/) — An evidence-first Terraform review workspace with deterministic Python findings and snapshot-scoped decisions. The hosted Cloudflare/AWS/Neon demo uses shared dev identities and mocked GitHub writes; Terraform execution is disabled. A review decision does not authorize merge or deployment.
- [Clearpath](https://manynames3.github.io/cloudresume/case-studies/clearpath/) is retained in supporting work with its original case-study URL. AWS resources were torn down after short-lived validation; this is not a live service or a long-term availability claim.

Supporting systems cover incident operations, retrieval, transcription, document processing, and offline-first workflows. Market Scout's merged native Android client shares the web data contract and retains research on-device; its linked JVM/emulator CI is not a Google Play release. AegisDesk's draft Helm/Kind evaluation and TerraGate's draft repair harness are labeled as local Kubernetes and synthetic harness experiments, not deployed platform features or measured agent performance. The separate [games page](https://manynames3.github.io/cloudresume/games/) collects personal creative projects without replacing the engineering work.

InspectIQ's October 13 source record distinguishes its newer deployed frontend, older deployed AWS backend, and unmerged QC/recon/reinspection work. Earlier evaluation and runtime artifacts remain historical proof. TerraGate's prominent diagram now follows the deployed Cloudflare → API Gateway → Lambda → Neon path; the RDS/VPC Terraform alternative remains a separately labeled artifact.

## Portfolio implementation

- Server-rendered React and TypeScript with [Vinext](https://github.com/cloudflare/vinext) and typed local content.
- Static GitHub Pages output under `/cloudresume/`, with framework hydration and JavaScript bundles removed.
- Optional authored motion and an in-page architecture viewer. All reading content remains available without JavaScript; original-image links remain a viewer fallback.
- Self-hosted Newsreader typography, original project diagrams and screenshots, explicit image dimensions, and an ivory/ink/signal-red editorial design.
- No portfolio backend, login, analytics, contact form, or third-party font runtime.

## Routes

- `/` — selected systems, operator profile, supporting work, experience, credentials, and contact.
- `/case-studies/shiftclarity/`
- `/case-studies/inspectiq/`
- `/case-studies/terragate/`
- `/case-studies/clearpath/`
- `/games/`

## Local development

Use Node.js `>=22.13.0` and the committed npm lockfile.

```sh
git clone --branch v3 https://github.com/manynames3/cloudresume.git
cd cloudresume
npm ci
npm run dev
```

## Verification and output

```sh
npm run typecheck
npm run lint
npm test
npm run build:github-pages
```

`npm test` performs a build before the tests. The checks cover rendered routes, project boundaries, static export behavior, and authored enhancements. The GitHub Pages artifact is written to `dist/github-pages`.

`npm run build:pages` prepares the alternate Cloudflare Pages output in `dist/pages`. That deployment is separate from the GitHub Pages workflow.

## Where to edit

- `content/case-studies.ts` — flagship narratives, evidence, artifacts, and limitations.
- `content/architecture-guides.ts` — architecture reading guides.
- `content/profile.ts` — profile, experience, supporting systems, and contact.
- `content/games.ts` — personal game entries and links.
- `components/` — page renderers and the shared architecture figure.
- `app/globals.css` — responsive layout and visual system.
- `public/` — original imagery, self-hosted fonts, and optional enhancement scripts. The resume PDF is currently withdrawn.
- `scripts/prepare-github-pages.mjs` — static routes, base-path rewriting, and script allowlist.
- `tests/` — content, rendering, export, and enhancement checks.

## Deployment and branches

`v3` is the current portfolio implementation and GitHub Pages release branch. `master` retains the legacy site and is not the current deployment source.

`.github/workflows/deploy-v3-pages.yml` runs on a push to `v3` or manual dispatch. It installs locked dependencies, verifies the portfolio, builds the static artifact, and publishes `dist/github-pages` with GitHub Pages Actions.

Local previews and review branches do not publish changes. An approved push to `v3` triggers the release workflow.

## Content and evidence rules

- Keep independent systems distinct from paid professional experience.
- State whether evidence is live, constrained, a controlled fixture, local-only, or retained after teardown.
- Link claims to architecture, code, tests, runtime records, and operating documentation.
- Do not turn deterministic tests into AI-accuracy claims, short validation runs into availability claims, or historical credentials into current certification.
- Preserve recovery paths, known limitations, and human authorization boundaries when editing copy.
- Never publish the phone number in page content. Never commit credentials, environment secrets, API keys, certificates, or Terraform state.
