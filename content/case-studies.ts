export type CaseStudySlug = "inspectiq" | "terragate" | "clearpath";

export type DemoBoundary =
  | {
      kind: "live-readonly";
      href: `https://${string}`;
      infrastructure: "AWS-backed";
      authorization: "app-level JWT/RBAC";
      writes: "read-only";
      disclosure: string;
    }
  | {
      kind: "live-constrained";
      href: `https://${string}`;
      checks: "deterministic Python";
      writes: "mocked";
      disclosure: string;
    }
  | {
      kind: "validated-and-torn-down";
      lifecycle: "torn-down after validation";
      disclosure: string;
    };

export interface EvidenceItem {
  value: string;
  label: string;
  qualifier: string;
  href: `https://${string}`;
}

export interface Artifact {
  id: string;
  kind:
    | "architecture"
    | "product"
    | "iac"
    | "ci"
    | "tests"
    | "runtime"
    | "runbook"
    | "security"
    | "limitations";
  title: string;
  href: `https://${string}`;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    mobile?: { src: string; width: number; height: number };
  };
}

export interface WorkflowStep {
  title: string;
  copy: string;
}

export interface ProductVisual {
  id: string;
  title: string;
  copy: string;
  href: `https://${string}`;
  layout: "portrait" | "landscape" | "wide";
  focalPoint: "top" | "capture" | "center";
  image: { src: string; alt: string; width: number; height: number };
}

export interface CaseStudy {
  slug: CaseStudySlug;
  title: string;
  benefitHeading: string;
  summary: string;
  role: "Independent builder";
  demo: DemoBoundary;
  frame?: {
    eyebrow: string;
    problemHeading: string;
    constraintsHeading: string;
  };
  workflow?: {
    heading: string;
    steps: readonly WorkflowStep[];
  };
  visuals?: {
    heading: string;
    items: readonly ProductVisual[];
  };
  development?: {
    heading: string;
    boundary: string;
    items: readonly string[];
    href: `https://${string}`;
  };
  problem: readonly string[];
  constraints: readonly string[];
  decisions: readonly { title: string; rationale: string; tradeoff: string }[];
  evidence: readonly EvidenceItem[];
  artifacts: readonly Artifact[];
  limitations: readonly string[];
  productionPath: readonly string[];
  technologies: readonly string[];
  seo: { title: string; description: string };
}

export const inspectiq = {
  slug: "inspectiq",
  title: "InspectIQ",
  benefitHeading: "Turn vehicle evidence into condition reports people can trust.",
  summary:
    "A production-shaped platform for wholesale, auction, fleet, and offsite inspection teams. It connects guided photo capture, AI-assisted review, human-confirmed damage, grading, and buyer-ready condition reporting.",
  role: "Independent builder",
  demo: {
    kind: "live-readonly",
    href: "https://inspectiq.pages.dev/?review=1",
    infrastructure: "AWS-backed",
    authorization: "app-level JWT/RBAC",
    writes: "read-only",
    disclosure:
      "Live AWS-backed application. The no-login Evaluation Workspace lets reviewers accept, edit, or reject findings within their browser session; those interactions do not modify persistent inspection records. Cognito JWT/RBAC protects authenticated workflow actions at the application layer; this does not establish API Gateway authorizer enforcement.",
  },
  frame: {
    eyebrow: "01 / Product",
    problemHeading: "What InspectIQ is for",
    constraintsHeading: "What the system must protect",
  },
  problem: [
    "Wholesale, auction, fleet, and offsite teams need complete, consistent photo evidence before a vehicle can be graded, routed to reconditioning, or presented to a buyer.",
    "Missing angles, unreadable VIN or odometer photos, poor image quality, and inconsistent damage review create retakes, slower reports, recon uncertainty, and avoidable disputes.",
    "InspectIQ turns capture, AI-assisted inspection, human review, grading, and report release into one accountable workflow with an audit trail.",
  ],
  constraints: [
    "AI can suggest required angles, image-quality problems, OCR values, and visible damage, but a reviewer remains accountable for every buyer-visible fact.",
    "Original photos, model output, and reviewer decisions must remain separate and traceable when a condition is questioned.",
    "Offline capture, failed analysis jobs, and incomplete evidence must recover visibly without losing inspection state or releasing an unfinished report.",
  ],
  workflow: {
    heading: "From field capture to a report a buyer can rely on.",
    steps: [
      {
        title: "Capture",
        copy: "An Inspector gathers the required angles on web or mobile; offline capture stays queued until a connection returns.",
      },
      {
        title: "Protect",
        copy: "Photos upload to private S3 with stable operation IDs, checksums, and short-lived preview access.",
      },
      {
        title: "Analyze",
        copy: "SQS and a Lambda worker isolate model latency before Bedrock output is accepted through a strict schema.",
      },
      {
        title: "Decide",
        copy: "A Reviewer compares each suggestion with its source image, then accepts, edits, rejects, or requests a retake.",
      },
      {
        title: "Release",
        copy: "Confirmed evidence drives grading and report approval; unresolved blockers keep the condition report from release.",
      },
      {
        title: "Operate",
        copy: "Audit records, outbox events, queue health, projections, alarms, and replay controls keep the workflow inspectable.",
      },
    ],
  },
  visuals: {
    heading: "The workflow exists in the product, not only in the diagram.",
    items: [
      {
        id: "inspectiq-mobile-capture",
        title: "Inspector capture",
        copy: "Required-angle evidence, offline-aware upload state, retake guidance, and workflow status in the mobile path.",
        href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/images/regression/mobile-capture.png",
        layout: "portrait",
        focalPoint: "capture",
        image: {
          src: "/case-studies/inspectiq-mobile-capture.webp",
          alt: "InspectIQ mobile inspection view showing required evidence, workflow status, uploaded vehicle images, and review actions",
          width: 390,
          height: 6810,
        },
      },
      {
        id: "inspectiq-review-queue",
        title: "Reviewer decisioning",
        copy: "A prioritized queue keeps the source evidence, confidence, owner, SLA, and accept-or-reject decision together.",
        href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/images/regression/suggestions-queue.png",
        layout: "landscape",
        focalPoint: "top",
        image: {
          src: "/case-studies/inspectiq-review-queue.webp",
          alt: "InspectIQ reviewer suggestions queue with evidence, confidence, status, SLA, and accept or reject controls",
          width: 1440,
          height: 1393,
        },
      },
      {
        id: "inspectiq-platform-health",
        title: "Platform Health",
        copy: "Runtime mode, role separation, queues, service levels, alerts, cost controls, and failed-work recovery are visible to operators.",
        href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/images/regression/platform-health.png",
        layout: "wide",
        focalPoint: "top",
        image: {
          src: "/case-studies/inspectiq-platform-health.webp",
          alt: "InspectIQ Platform Health view showing runtime proof, role separation, queue metrics, service levels, alerts, and recovery controls",
          width: 1440,
          height: 3920,
        },
      },
    ],
  },
  decisions: [
    {
      title: "Keep AI advisory and human decisions authoritative",
      rationale:
        "Bedrock can accelerate angle, quality, OCR, and damage review, but only a Reviewer can turn a suggestion into a buyer-visible fact.",
      tradeoff:
        "Human review adds time and operating cost, but it prevents model output from silently becoming disclosure truth.",
    },
    {
      title: "Keep business truth in Postgres and operations state disposable",
      rationale:
        "Neon Postgres owns inspections, evidence, decisions, reports, and audit facts; EventBridge and DynamoDB support projections, idempotency, and model-usage reservations.",
      tradeoff:
        "Projected operational views can lag and require replay, so they must never become a second business system of record.",
    },
    {
      title: "Move image analysis behind a durable queue",
      rationale:
        "Private S3 uploads, SQS jobs, and a bounded Lambda worker keep model latency and provider failure outside the interactive capture request.",
      tradeoff:
        "The workflow becomes eventually consistent and needs idempotency, job states, DLQs, visible blockers, and recovery controls.",
    },
  ],
  evidence: [
    {
      value: "No fallback",
      label: "Marketplace damage workflow",
      qualifier: "One Ford photo reached Bedrock, schema validation, and Reviewer acceptance; this is not an accuracy benchmark.",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/evals/marketplace-bedrock-proof.json",
    },
    {
      value: "108 / 12",
      label: "Inputs / independent sources",
      qualifier: "Controlled contract and promotion-gate evidence; deterministic results do not establish Bedrock model accuracy.",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/model-evaluation-report.md",
    },
    {
      value: "3 roles",
      label: "Inspector, Reviewer, Admin",
      qualifier: "Capture, approval, and recovery responsibilities are separated in the UI, API permissions, and proof path.",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/role-separated-proof.md",
    },
    {
      value: "Live path",
      label: "AWS-backed evidence processing",
      qualifier: "Cognito, S3, SQS, Lambda, Bedrock, Neon, audit events, and operational projections are documented together.",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/live-production-proof.md",
    },
  ],
  artifacts: [
    {
      id: "inspectiq-architecture",
      kind: "architecture",
      title: "System map / guided capture to a human-confirmed report",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/architecture.md",
      image: {
        src: "/case-studies/originals/inspectiq-system-map.svg",
        alt: "InspectIQ system map from guided vehicle photo capture through application-layer JWT and role checks, private S3 evidence, queued Bedrock suggestions, human review, and report release; Neon owns inspection records, while separate event projections and monitoring support operations",
        width: 1600,
        height: 1120,
        mobile: { src: "/case-studies/originals/inspectiq-system-map-mobile.svg", width: 720, height: 2550 },
      },
    },
    {
      id: "inspectiq-product-workflow",
      kind: "product",
      title: "Product workflow and mobile capture boundary",
      href: "https://github.com/manynames3/inspectiq#workflow",
    },
    {
      id: "inspectiq-infrastructure",
      kind: "iac",
      title: "Terraform infrastructure",
      href: "https://github.com/manynames3/inspectiq/tree/ec5474c543ab1e069533e19f85d63c5e0c239136/infra/terraform",
    },
    {
      id: "inspectiq-ci",
      kind: "ci",
      title: "Application CI workflow",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/.github/workflows/ci.yml",
    },
    {
      id: "inspectiq-evaluation",
      kind: "tests",
      title: "Model evaluation report and accuracy boundary",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/model-evaluation-report.md",
    },
    {
      id: "inspectiq-marketplace-proof",
      kind: "runtime",
      title: "No-fallback marketplace Bedrock trace",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/evals/marketplace-bedrock-proof.json",
    },
    {
      id: "inspectiq-role-proof",
      kind: "security",
      title: "Role-separated workflow proof",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/role-separated-proof.md",
    },
    {
      id: "inspectiq-runtime-proof",
      kind: "runtime",
      title: "Live runtime proof",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/live-production-proof.md",
    },
    {
      id: "inspectiq-security",
      kind: "security",
      title: "Security boundary notes",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/security.md",
    },
    {
      id: "inspectiq-runbook",
      kind: "runbook",
      title: "Operator runbook",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/runbook.md",
    },
    {
      id: "inspectiq-readiness",
      kind: "limitations",
      title: "Readiness and remaining work",
      href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/production-readiness.md",
    },
  ],
  limitations: [
    "The 108-image challenge set derives from 12 independent sources, and one marketplace result does not establish Bedrock precision or recall.",
    "Mobile angle selection remains Inspector-driven; there is no deployed on-device classifier or reviewer-adjustable damage region.",
    "The buyer export is not yet a polished PDF and photo package, and generic CSV or signed-webhook integrations are not implemented.",
    "The system has not accumulated sustained production workload, SLO, cost, or real-inspector pilot evidence.",
    "Some Postgres flows still hydrate the in-memory domain store; high-concurrency use needs aggregate-specific DB-first repositories.",
    "Public review interactions are session-only; persistent inspection data remains read-only. The documented application boundary does not prove API Gateway authorizer enforcement.",
    "The October 2 condition-report QC source checkpoint is implemented development work, not a verified deployed release. No field-run results or measured reviewer-time savings are published.",
  ],
  development: {
    heading: "Condition-report quality control, before a report leaves the system.",
    boundary: "Development checkpoint / October 2, 2026. Implemented on the published development branch; deployment of these QC changes has not been verified. Local security fixes are not presented as a deployed release.",
    items: [
      "Missing views and incomplete uploads block release rather than becoming overridable model judgments. VIN and mileage retain separate verified, discrepancy, and unable-to-verify states.",
      "Reviewers record reasons for acknowledged limitations or overridden judgments. Evidence fingerprints preserve what each decision applied to; changed facts require a fresh grade or report approval.",
      "The field protocol separates held-out vehicles, independent labels, real inference, and paired reviewer time. It defines how to measure value; it does not claim achieved accuracy or time savings.",
    ],
    href: "https://github.com/manynames3/inspectiq/blob/b4b7b3ea9baa3209709f2cf1930bedeb5d856d8b/docs/condition-qc-product.md",
  },
  productionPath: [
    "Build an independently adjudicated field corpus and measure precision, recall, calibration, override rate, latency, and cost by model and prompt version.",
    "Replace the hydration bridge with aggregate-specific repositories and prove transaction, concurrency, and tenant-isolation behavior under load.",
    "Run soak tests, controlled queue and event recovery drills, rollback exercises, and a seven-day idle-cost and SLO observation window.",
    "Pilot with working Inspectors and Reviewers, then refine capture speed, reports, photo packages, and the integrations customers actually require.",
    "Split public and protected gateway routes, attach the JWT authorizer to protected routes, and complete a production security and data-retention review.",
  ],
  technologies: [
    "AWS",
    "Cloudflare Pages",
    "React",
    "TypeScript",
    "Expo / React Native",
    "Cognito",
    "API Gateway",
    "Lambda",
    "S3",
    "SQS",
    "Bedrock",
    "Neon Postgres",
    "EventBridge",
    "DynamoDB",
    "CloudWatch / X-Ray",
    "Python",
    "Terraform",
    "GitHub Actions",
  ],
  seo: {
    title: "InspectIQ — AWS vehicle inspection platform | Aiden Rhaa",
    description:
      "InspectIQ case study: a production-shaped AWS vehicle inspection platform with mobile capture, asynchronous Bedrock analysis, human review, Postgres state, and recovery controls.",
  },
} satisfies CaseStudy;

export const terragate = {
  slug: "terragate",
  title: "TerraGate",
  benefitHeading: "Terraform reviews, grounded in evidence.",
  summary:
    "An evidence-first Terraform review workspace. Inspect plan changes, understand deterministic findings, and record scoped human decisions against the exact review snapshot—without giving the public demo permission to deploy infrastructure.",
  role: "Independent builder",
  demo: {
    kind: "live-constrained",
    href: "https://terragate.hangi87.workers.dev",
    checks: "deterministic Python",
    writes: "mocked",
    disclosure:
      "Live constrained demo on Cloudflare Workers, AWS API Gateway/Lambda, and Neon PostgreSQL. Deterministic Python checks assess bounded uploaded or sample plans. Public authentication uses shared dev identities; GitHub writes are mocked and Terraform execution is disabled. Risk exceptions and comment approvals do not authorize merge or deployment.",
  },
  frame: {
    eyebrow: "01 / Product",
    problemHeading: "What a Terraform reviewer needs to know",
    constraintsHeading: "What a review must not authorize",
  },
  problem: [
    "A dense Terraform diff can hide exposed services, excessive permissions, destructive changes, or uncertain inputs. A score alone does not explain which resource changed or why it matters.",
    "Teams need findings tied to saved evidence, a record of who accepted which risk, and a visible distinction between reviewing a change and authorizing it to ship.",
    "TerraGate brings the plan, findings, provenance, scoped exceptions, comment approval, and audit history into one review workspace.",
  ],
  constraints: [
    "Deterministic Python checks establish findings. Unknown or redacted inputs require verification rather than an invented pass or failure.",
    "Raw risk, policy decisions, comment approval, and external GitHub checks remain separate; none is a verified merge-enforcement signal.",
    "The public environment uses shared dev identities and mocked GitHub writes. Terraform execution and infrastructure-changing credentials stay outside the demo.",
  ],
  workflow: {
    heading: "From a plan diff to an accountable review.",
    steps: [
      { title: "Intake", copy: "Upload a bounded Terraform plan JSON or choose a sample. The review queue makes incomplete and failed work visible." },
      { title: "Assess", copy: "Deterministic rules evaluate normalized inputs and save findings, evaluated policy inputs, and source hashes." },
      { title: "Inspect", copy: "Trace each finding to redacted before/after values, unknown inputs, and the integrity-checked saved plan." },
      { title: "Decide", copy: "Request an expiring exception for one finding in one snapshot; a different administrator records the decision." },
      { title: "Approve", copy: "Approve the exact saved comment separately. Changed review content invalidates stale approval rather than inheriting it." },
      { title: "Hand off", copy: "Export review evidence or remediation snippets. Public GitHub posting stays mocked; merge and apply are not authorized." },
    ],
  },
  visuals: {
    heading: "The evidence stays beside the decision.",
    items: [
      {
        id: "terragate-review-workspace",
        title: "An actionable review queue",
        copy: "Local controlled capture / October 10. Search, filters, status, and scoped review context organize the next decision; repository context is not a verified GitHub installation.",
        href: "https://github.com/manynames3/terragate/blob/main/docs/screenshots/reviews-desktop.png",
        layout: "landscape", focalPoint: "top",
        image: { src: "/case-studies/terragate-reviews.webp", alt: "TerraGate review workspace with a searchable Terraform review queue, status filters, and saved review rows", width: 1440, height: 1000 },
      },
      {
        id: "terragate-finding-evidence",
        title: "A finding with inspectable evidence",
        copy: "Local controlled capture / October 10. A sample security finding keeps its rule, resource, evidence excerpt, and blocked policy state visible. Displayed confidence is not a measured accuracy result.",
        href: "https://github.com/manynames3/terragate/blob/main/docs/screenshots/finding-desktop.png",
        layout: "landscape", focalPoint: "top",
        image: { src: "/case-studies/terragate-finding.webp", alt: "TerraGate sample security review showing an exposed RDS finding, its deterministic rule, redacted evidence, and a blocked policy decision", width: 1440, height: 1000 },
      },
    ],
  },
  decisions: [
    {
      title: "Keep the evidence and its provenance with the finding",
      rationale:
        "Saved redacted values, unknown masks, artifact digests, and rule-source hashes let a reviewer inspect what was evaluated rather than trust a score in isolation.",
      tradeoff:
        "Encoded checks cover only their defined scope. Free-form secrets can evade redaction, and the live Lambda's plan files remain ephemeral rather than durable evidence storage.",
    },
    {
      title: "Bind human decisions to the exact review snapshot",
      rationale:
        "Finding-specific exceptions require justification, expiry, and a different administrator. Comment approval applies to its saved snapshot; changed content cannot reuse an old decision.",
      tradeoff:
        "More explicit decisions add review steps. Risk acceptance does not lower raw risk, synchronize a GitHub check, or authorize merge and apply.",
    },
    {
      title: "Separate useful review from deployment authority",
      rationale:
        "The public workflow can assess plans, retain audit history, and demonstrate approval without holding live repository write credentials or executing Terraform.",
      tradeoff:
        "Shared dev identities and mocked writes are a demonstration boundary. Private identity, durable workers, and trusted GitHub installation ownership need separate qualification.",
    },
  ],
  evidence: [
    {
      value: "Hosted",
      label: "October 10 review journey",
      qualifier: "Fixture-based hosted checks covered plan upload, redacted evidence, a scoped exception, separate comment approval, and mocked posting—not live GitHub writes.",
      href: "https://github.com/manynames3/terragate/blob/main/docs/deployment.md#workspace-and-stratum-release-october-10-2026",
    },
    {
      value: "One snapshot",
      label: "Scoped, expiring risk acceptance",
      qualifier: "An exception belongs to one finding and immutable snapshot. Expiry, revocation, or changed content removes acceptance; it is not deployment approval.",
      href: "https://github.com/manynames3/terragate/blob/main/docs/enterprise-workspace.md#decisions-are-different",
    },
    {
      value: "13 tables",
      label: "Isolated recovery rehearsal",
      qualifier: "A hosted-database backup was restored into local PostgreSQL; upgrade, downgrade, and re-upgrade preserved row digests in the 13 existing tables. Not a production restore or concurrent migration test.",
      href: "https://github.com/manynames3/terragate/blob/main/docs/deployment.md#workspace-and-stratum-release-october-10-2026",
    },
  ],
  artifacts: [
    {
      id: "terragate-architecture",
      kind: "architecture",
      title: "System map / snapshot-bound review without deployment authority",
      href: "https://github.com/manynames3/terragate/blob/main/docs/deployment.md#verified-public-demo-release",
      image: {
        src: "/case-studies/originals/terragate-system-map.svg",
        alt: "TerraGate system map: a bounded Terraform plan moves from the Cloudflare review UI through API Gateway and deterministic Python checks to snapshot-bound Neon records, separate human decisions, and an export-only handoff; the public demo mocks GitHub writes and disables Terraform execution",
        width: 1600,
        height: 1120,
        mobile: { src: "/case-studies/originals/terragate-system-map-mobile.svg", width: 720, height: 2580 },
      },
    },
    {
      id: "terragate-infrastructure",
      kind: "iac",
      title: "RDS/VPC Terraform reference—not the live inventory",
      href: "https://github.com/manynames3/terragate/tree/main/infra/terraform/aws-public-demo",
    },
    {
      id: "terragate-ci",
      kind: "ci",
      title: "Repository CI workflow",
      href: "https://github.com/manynames3/terragate/blob/main/.github/workflows/ci.yml",
    },
    {
      id: "terragate-tests",
      kind: "tests",
      title: "Workspace, integrity, and migration validation",
      href: "https://github.com/manynames3/terragate/blob/main/docs/testing.md",
    },
    {
      id: "terragate-runbook",
      kind: "runbook",
      title: "Operator runbook",
      href: "https://github.com/manynames3/terragate/blob/main/docs/runbook.md",
    },
    {
      id: "terragate-threat-model",
      kind: "security",
      title: "Threat model",
      href: "https://github.com/manynames3/terragate/blob/main/docs/threat-model.md",
    },
    {
      id: "terragate-public-boundary",
      kind: "limitations",
      title: "Public-demo boundary",
      href: "https://github.com/manynames3/terragate/blob/main/docs/public-demo.md",
    },
    {
      id: "terragate-workspace", kind: "product",
      title: "Evidence workspace and scoped decision contract",
      href: "https://github.com/manynames3/terragate/blob/main/docs/enterprise-workspace.md",
    },
    {
      id: "terragate-release", kind: "runtime",
      title: "Exact release, runtime recovery, and backup rehearsal",
      href: "https://github.com/manynames3/terragate/blob/main/docs/deployment.md#workspace-and-stratum-release-october-10-2026",
    },
  ],
  limitations: [
    "The public demo uses shared dev identities, deterministic Python checks, mocked GitHub writes, and disabled Terraform execution. Private Cognito and live GitHub integrations were not verified in the hosted release.",
    "Findings and audit history persist in Neon, but raw/redacted plans in Lambda /tmp can expire with HTTP 410. Successful retrieval in one run does not establish durable artifact storage.",
    "The GitHub installation-to-CI-plan lifecycle and merge enforcement remain incomplete. Remediation snippets are export-only; policy decisions do not authorize deployment.",
    "Cost estimates are heuristic, not measured bills. Compliance mappings are review context, not certification; no sustained workload or service SLO is established.",
    "The RDS/VPC Terraform stack is a reference alternative. Reconcile it with the live Neon/outside-VPC configuration before any future apply.",
  ],
  productionPath: [
    "Move plan artifacts to private durable object storage with retention, deletion, encryption, and integrity checks; qualify expired and missing evidence recovery.",
    "Qualify private identity and organization membership, trusted GitHub installation ownership, revision reconciliation, and delivery deduplication before enabling live writes.",
    "Use durable review workers with lease/retry recovery, alarms, bounded workloads, and separately tested migration concurrency.",
    "Introduce organization-owned approved policy revisions and evaluate rule coverage against representative plans; retain the input snapshot and rule provenance with each decision.",
  ],
  technologies: [
    "Python",
    "FastAPI",
    "Next.js",
    "Terraform plan JSON",
    "Neon PostgreSQL",
    "Cloudflare Workers",
    "OpenNext",
    "API Gateway",
    "Lambda / Mangum",
    "CodeBuild / ECR",
    "GitHub Actions",
  ],
  seo: {
    title: "TerraGate — Safer Terraform review | Aiden Rhaa",
    description:
      "TerraGate case study: evidence-backed Terraform review, snapshot-scoped decisions, and a verified Cloudflare/AWS/Neon demo with GitHub writes mocked and execution disabled.",
  },
} satisfies CaseStudy;

export const clearpath = {
  slug: "clearpath",
  title: "Clearpath",
  benefitHeading: "Turn lead operations into a system that can fail clearly and recover cleanly.",
  summary:
    "A containerized AWS lead-intelligence API translated from operating workflows, validated during a short-lived AWS deployment, and then deliberately torn down.",
  role: "Independent builder",
  demo: {
    kind: "validated-and-torn-down",
    lifecycle: "torn-down after validation",
    disclosure:
      "Short-lived AWS validation was followed by teardown. No live demo is maintained, and the recorded evidence is point-in-time validation.",
  },
  problem: [
    "Lead intake, source research, scoring, and follow-up become fragile when workflow rules live across spreadsheets and one-off handoffs.",
    "A replacement needs durable API contracts, observable container behavior, and a documented exit path for cost control.",
  ],
  constraints: [
    "Validation had to prove the AWS path without turning a portfolio workload into an indefinite hosting commitment.",
    "GHL-compatible intake describes a payload shape, not a verified third-party integration.",
    "Cost figures are estimates, not billing records.",
  ],
  decisions: [
    {
      title: "Model the operating workflow as an API contract",
      rationale:
        "Explicit intake, scoring, and reporting boundaries make the workflow testable and easier to hand off.",
      tradeoff:
        "Real provider integrations still need account-specific authentication and acceptance testing.",
    },
    {
      title: "Validate the container path on AWS",
      rationale:
        "A short-lived deployment exercised the edge, load balancer, Fargate, data, secret, and alarm boundaries together.",
      tradeoff:
        "Healthy tasks during that window are point-in-time evidence, not an uptime record.",
    },
    {
      title: "Make teardown part of completion",
      rationale:
        "A documented destroy path treats cost recovery and resource inventory as operating responsibilities.",
      tradeoff:
        "There is no live-demo CTA after teardown; reviewers use the retained artifacts instead.",
    },
  ],
  evidence: [
    {
      value: "93",
      label: "validated resources later destroyed",
      qualifier: "Inventory and teardown evidence; not a long-term availability claim.",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/teardown.md",
    },
    {
      value: "36",
      label: "API tests",
      qualifier: "Recorded application test result for the validated revision.",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/test-results.md",
    },
    {
      value: "339",
      label: "Checkov passes",
      qualifier: "0 failed, 44 skipped; static analysis evidence for the recorded revision.",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/test-results.md",
    },
    {
      value: "2",
      label: "healthy tasks during validation",
      qualifier: "Point-in-time deployment evidence, not a continuing availability statement.",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/live-validation-summary.md",
    },
  ],
  artifacts: [
    {
      id: "clearpath-architecture",
      kind: "architecture",
      title: "System map / lead analytics and the temporary AWS validation topology",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/architecture.md",
      image: {
        src: "/case-studies/originals/clearpath-system-map.svg",
        alt: "Clearpath system map from paid lead sources and existing CRM workflows to FastAPI intake, PostgreSQL analytics, and read-focused reporting, followed by the documented CloudFront, WAF, ALB, private ECS Fargate, RDS Proxy, and RDS PostgreSQL topology that was torn down after validation",
        width: 1600,
        height: 1220,
        mobile: { src: "/case-studies/originals/clearpath-system-map-mobile.svg", width: 720, height: 3280 },
      },
    },
    {
      id: "clearpath-infrastructure",
      kind: "iac",
      title: "Terraform infrastructure",
      href: "https://github.com/manynames3/clearpath-fargate-api/tree/main/terraform",
    },
    {
      id: "clearpath-ci",
      kind: "ci",
      title: "Terraform validation CI",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/.github/workflows/terraform-validate.yml",
    },
    {
      id: "clearpath-validation",
      kind: "runtime",
      title: "Live-validation summary",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/live-validation-summary.md",
    },
    {
      id: "clearpath-tests",
      kind: "tests",
      title: "API and infrastructure test results",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/test-results.md",
    },
    {
      id: "clearpath-runbook",
      kind: "runbook",
      title: "Operator runbook",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/runbook.md",
    },
    {
      id: "clearpath-teardown",
      kind: "limitations",
      title: "Teardown record",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/teardown.md",
    },
    {
      id: "clearpath-cost-estimate",
      kind: "limitations",
      title: "Cost estimate",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/cost-estimate.md",
    },
  ],
  limitations: [
    "Two healthy tasks were observed during validation; they do not establish long-term availability.",
    "GHL-compatible intake is not a verified GHL integration.",
    "The cost model is an estimate, not billing evidence.",
    "The AWS environment was torn down after validation, so there is no live-demo CTA.",
  ],
  productionPath: [
    "Run provider-specific acceptance tests with real credentials held in a controlled secret boundary.",
    "Add scheduled restore exercises and retain recovery-time evidence with the runbook.",
    "Reconcile estimates against billing data and define scaling alarms before sustained operation.",
  ],
  technologies: [
    "AWS ECS Fargate",
    "FastAPI",
    "PostgreSQL",
    "RDS Proxy",
    "Terraform",
    "CloudFront",
    "WAF",
    "CloudWatch",
  ],
  seo: {
    title: "Clearpath — Recoverable lead operations | Aiden Rhaa",
    description:
      "Clearpath case study: a lead-intelligence API validated on AWS Fargate with API tests, infrastructure checks, runbooks, and documented teardown.",
  },
} satisfies CaseStudy;

export const caseStudySlugs = [
  "inspectiq",
  "terragate",
  "clearpath",
] as const;

export const caseStudies: Readonly<Record<CaseStudySlug, CaseStudy>> = {
  inspectiq,
  terragate,
  clearpath,
};

export interface CaseOperations {
  reliability: {
    heading: string;
    copy: string;
    artifactId: string;
  };
  recovery: {
    heading: string;
    copy: string;
    artifactId: string;
  };
}

export const caseOperations: Readonly<Record<CaseStudySlug, CaseOperations>> = {
  inspectiq: {
    reliability: {
      heading: "No model finding becomes a buyer-visible fact without human approval.",
      copy:
        "Raw and validated output remain separate, invalid output fails closed, and Reviewer decisions, corrections, and report finalization stay in the audit history. Cognito roles and object authorization restrict who can act on each inspection.",
      artifactId: "inspectiq-security",
    },
    recovery: {
      heading: "Incomplete evidence and failed analysis block release, then route to the right recovery.",
      copy:
        "A low-quality image requests a field retake; a provider or schema failure can be retried or moved through DLQ and replay controls. Platform Health exposes queues, outbox delivery, projections, alarms, and recovery state so the operator sees the right next action.",
      artifactId: "inspectiq-runbook",
    },
  },
  terragate: {
    reliability: {
      heading: "A decision never outlives the evidence it applies to.",
      copy:
        "Integrity-checked redacted artifacts and saved policy inputs support deterministic findings. Exceptions are scoped, expiring, independently decided, and audited. Risk, policy state, comment approval, and GitHub checks remain separate; the public environment has no merge or apply authority.",
      artifactId: "terragate-threat-model",
    },
    recovery: {
      heading: "A successful build was not enough to prove a working deployment.",
      copy:
        "The October 10 frontend initially returned HTTP 500 despite building successfully. It was rolled back, a compatible bundle was deployed, and CI gained a Worker-runtime smoke check. An isolated backup/migration rehearsal preserved existing table digests. Neither result removes the live /tmp artifact-expiry limitation or establishes sustained availability.",
      artifactId: "terragate-release",
    },
  },
  clearpath: {
    reliability: {
      heading: "Point-in-time health qualified by tests and teardown records.",
      copy:
        "API and infrastructure checks support the validated revision. Healthy tasks from the short-lived run remain deployment evidence, not a continuing availability statement.",
      artifactId: "clearpath-tests",
    },
    recovery: {
      heading: "Early task failures became a corrected startup path.",
      copy:
        "Initial ECS tasks failed health checks during early revisions. After the image and startup path were corrected, the service stabilized at two healthy tasks for validation; the record preserves that sequence without turning it into a long-term availability claim.",
      artifactId: "clearpath-validation",
    },
  },
};

export const caseRepositories: Readonly<
  Record<CaseStudySlug, `https://${string}`>
> = {
  inspectiq: "https://github.com/manynames3/inspectiq",
  terragate: "https://github.com/manynames3/terragate",
  clearpath: "https://github.com/manynames3/clearpath-fargate-api",
};

export function isCaseStudySlug(value: string): value is CaseStudySlug {
  return caseStudySlugs.includes(value as CaseStudySlug);
}

export function getCaseStudy(value: string): CaseStudy | undefined {
  return isCaseStudySlug(value) ? caseStudies[value] : undefined;
}

export function getNextCaseStudy(slug: CaseStudySlug): CaseStudy {
  const currentIndex = caseStudySlugs.indexOf(slug);
  const nextSlug = caseStudySlugs[(currentIndex + 1) % caseStudySlugs.length];
  return caseStudies[nextSlug];
}
