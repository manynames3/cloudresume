# Portfolio project refresh — October 10, 2026

This is a content and evidence refresh, not a change in visual direction or an application deployment for the featured projects. The three flagship routes and Clearpath's teardown boundary are retained. No production dependencies were added.

## Source and claim boundaries

- **TerraGate:** `docs/enterprise-workspace.md` and the October 10 release in `docs/deployment.md` support the evidence workspace, snapshot-scoped decisions, separate comment approval, and isolated backup/migration rehearsal. Public auth is shared/dev, GitHub writes mocked, Terraform execution disabled. Plan files in Lambda `/tmp` can expire. The live diagram is redrawn from the verified Cloudflare/API Gateway/Lambda/Neon deployment record; it does not depict the RDS/VPC Terraform reference as live infrastructure.
- **Pulpit / Serverless:** `docs/architecture.md` and `docs/s3-vectors-migration.md` support the focused query/publication diagram. The 360-sermon / 8,191-chunk counts are the October 7 migration checkpoint, not a current archive counter. API smoke observations are not benchmarks or retrieval-quality measurements. Ingestion is local; polling is timeout recovery, not a durable job system. The legacy AWS ingest path is intentionally omitted from this focused diagram and remains documented in the linked source.
- **AegisDesk:** `docs/operations/incident-workflow.md` describes the implemented workflow. `docs/evidence/live-operations.md` distinguishes the October 10 AWS readiness/authenticated-read smoke from unverified hosted writes and unconfigured Jira/CloudWatch integrations.
- **InspectIQ:** Existing system artifacts point to published source checkpoint `ec5474c543ab1e069533e19f85d63c5e0c239136`. The QC contract points to its implementing commit `b4b7b3ea9baa3209709f2cf1930bedeb5d856d8b`. A separate development section states that QC deployment is unverified. No field-accuracy, reviewer-time-savings, or deployed-security-clearance claim is added. Sandbox review interactions are session-only; persistent inspection records are unchanged. Application-level Cognito JWT/RBAC is not described as API Gateway authorizer enforcement.
- **WorshipCue:** `verification/STATUS.md` distinguishes current documentation, earlier published code checkpoints, later local work, selected hosted checks, and remaining release/capacity/gesture qualification. No App Store release, customer deployment, or qualified multi-iPad rehearsal is claimed.

## Image provenance

- TerraGate review/finding images: real repository captures under `docs/screenshots/`, explicitly labeled local controlled captures. They are not recast as hosted verification screenshots or measured accuracy evidence.
- AegisDesk image: `docs/evidence/screenshots/incident-actions-controlled-desktop.png`, labeled a controlled local fixture. Its successful local ticket action is not a real Jira integration claim.
- Lumen image: repository `docs/images/showcase/campaign-blossom.png`, a native development campaign capture. It is not labeled as a newly qualified release or a family playtest.
- Belly Float and Neighborhood Tails: fresh browser captures from their public deployments on October 10, after entering gameplay in isolated browser contexts. These captures are visual evidence only, not full-game qualification.
- Lunchbox's existing cover/menu image and Resonance's existing 2.5D keyboard-preview image remain unchanged.
- Diagram SVG originals are retained under `public/case-studies/originals/`; optimized WebP images have explicit intrinsic dimensions. Game originals remain under `public/games/originals/`.

## Gallery availability

Lunchbox links its published browser edition, with desktop/landscape guidance, approximately 71 MB initial download, and browser-local saves. Belly Float remains entry 06; Neighborhood Tails is entry 07. Lumen/Resonance remain development previews, and private repository links retain the user's previously requested behavior.

## Publication target

Push to `manynames3/cloudresume`, branch `v3`, using the existing `Deploy v3 to GitHub Pages` workflow. Do not modify project application repositories, DNS, the separate Cloudflare deployment, or the older Sites deployment.

## Local verification of the shipping content

- Typecheck and configured lint passed; no lint warnings in the final run. Production build and all 23 automated tests passed.
- All 41 checked GitHub artifact paths resolved across seven source references. This does not make private game repositories accessible to anonymous visitors.
- Exact GitHub Pages static output served under `/cloudresume/`: all five routes passed at 1440×900, 1024×768, 390×844, and 320px width with JavaScript disabled and reduced motion. No horizontal overflow or broken images remained. All five routes also passed 200% root text sizing at 390px (25 layout checks total).
- Axe-core 4.14.0 WCAG A/AA scans on all five routes at 1440px and 390px reported zero violations. This is an automated check, not a full WCAG certification or physical-device qualification.
- Six initial keyboard stops had visible focus; Work/Profile/Contact navigation reached the intended sections. The resume returned 200 with PDF content and a PDF file signature.
- Actual desktop/mobile renders and diagram exports were inspected. No new Lighthouse performance benchmark was run for this content refresh.
- Browser checks found and corrected long-word reflow and visible-label/accessibility-name mismatches. The fixes preserve the existing typography and visual design.
