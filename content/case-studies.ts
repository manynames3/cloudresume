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
  image?: { src: string; alt: string; width: number; height: number };
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
    href: "https://inspectiq.pages.dev",
    infrastructure: "AWS-backed",
    authorization: "app-level JWT/RBAC",
    writes: "read-only",
    disclosure:
      "Live AWS-backed application. The public Evaluation Workspace requires no login and is read-only. Cognito JWT/RBAC protects authenticated workflow actions at the application layer; this does not establish API Gateway authorizer enforcement.",
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
        href: "https://github.com/manynames3/inspectiq/blob/main/docs/images/regression/mobile-capture.png",
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
        href: "https://github.com/manynames3/inspectiq/blob/main/docs/images/regression/suggestions-queue.png",
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
        href: "https://github.com/manynames3/inspectiq/blob/main/docs/images/regression/platform-health.png",
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
      href: "https://github.com/manynames3/inspectiq/blob/main/evals/marketplace-bedrock-proof.json",
    },
    {
      value: "108 / 12",
      label: "Inputs / independent sources",
      qualifier: "Controlled contract and promotion-gate evidence; deterministic results do not establish Bedrock model accuracy.",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/model-evaluation-report.md",
    },
    {
      value: "3 roles",
      label: "Inspector, Reviewer, Admin",
      qualifier: "Capture, approval, and recovery responsibilities are separated in the UI, API permissions, and proof path.",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/role-separated-proof.md",
    },
    {
      value: "Live path",
      label: "AWS-backed evidence processing",
      qualifier: "Cognito, S3, SQS, Lambda, Bedrock, Neon, audit events, and operational projections are documented together.",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/live-production-proof.md",
    },
  ],
  artifacts: [
    {
      id: "inspectiq-architecture",
      kind: "architecture",
      title: "Current serverless AWS architecture",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/architecture.md",
      image: {
        src: "/case-studies/inspectiq-architecture.webp",
        alt: "InspectIQ architecture showing web and mobile clients, Cognito, API Gateway, Lambda, Neon Postgres, private S3, SQS and DLQ, Bedrock, EventBridge, a Python projector, DynamoDB, CloudWatch, X-Ray, SNS, Terraform, and GitHub Actions",
        width: 2000,
        height: 1148,
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
      href: "https://github.com/manynames3/inspectiq/tree/main/infra/terraform",
    },
    {
      id: "inspectiq-ci",
      kind: "ci",
      title: "Application CI workflow",
      href: "https://github.com/manynames3/inspectiq/blob/main/.github/workflows/ci.yml",
    },
    {
      id: "inspectiq-evaluation",
      kind: "tests",
      title: "Model evaluation report and accuracy boundary",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/model-evaluation-report.md",
    },
    {
      id: "inspectiq-marketplace-proof",
      kind: "runtime",
      title: "No-fallback marketplace Bedrock trace",
      href: "https://github.com/manynames3/inspectiq/blob/main/evals/marketplace-bedrock-proof.json",
    },
    {
      id: "inspectiq-role-proof",
      kind: "security",
      title: "Role-separated workflow proof",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/role-separated-proof.md",
    },
    {
      id: "inspectiq-runtime-proof",
      kind: "runtime",
      title: "Live runtime proof",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/live-production-proof.md",
    },
    {
      id: "inspectiq-security",
      kind: "security",
      title: "Security boundary notes",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/security.md",
    },
    {
      id: "inspectiq-runbook",
      kind: "runbook",
      title: "Operator runbook",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/runbook.md",
    },
    {
      id: "inspectiq-readiness",
      kind: "limitations",
      title: "Readiness and remaining work",
      href: "https://github.com/manynames3/inspectiq/blob/main/docs/production-readiness.md",
    },
  ],
  limitations: [
    "The 108-image challenge set derives from 12 independent sources, and one marketplace result does not establish Bedrock precision or recall.",
    "Mobile angle selection remains Inspector-driven; there is no deployed on-device classifier or reviewer-adjustable damage region.",
    "The buyer export is not yet a polished PDF and photo package, and generic CSV or signed-webhook integrations are not implemented.",
    "The system has not accumulated sustained production workload, SLO, cost, or real-inspector pilot evidence.",
    "Some Postgres flows still hydrate the in-memory domain store; high-concurrency use needs aggregate-specific DB-first repositories.",
    "The public walkthrough is read-only, and the documented application boundary does not prove API Gateway authorizer enforcement.",
  ],
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
  benefitHeading: "Review infrastructure change before it becomes infrastructure risk.",
  summary:
    "A constrained Terraform review demo that turns plan JSON into explainable findings, while keeping execution and external writes outside the public boundary.",
  role: "Independent builder",
  demo: {
    kind: "live-constrained",
    href: "https://terragate.hangi87.workers.dev",
    checks: "deterministic Python",
    writes: "mocked",
    disclosure:
      "Live constrained demo. Deterministic Python checks run against sample plans; external writes are mocked and Terraform execution is disabled.",
  },
  problem: [
    "Terraform plans are dense review objects, and high-impact changes can be easy to miss in an unstructured diff.",
    "A useful review gate must explain findings without gaining permission to execute the plan it examines.",
  ],
  constraints: [
    "The public demo accepts bounded sample inputs rather than arbitrary infrastructure execution.",
    "External comments, checks, and approval writes remain mocked.",
    "Findings shown publicly come from deterministic Python checks.",
  ],
  decisions: [
    {
      title: "Make deterministic checks the public source of findings",
      rationale:
        "Repeatable Python rules make the same plan produce the same result and keep the evaluation inspectable.",
      tradeoff:
        "The demo covers encoded checks rather than every organization-specific policy.",
    },
    {
      title: "Disable Terraform execution",
      rationale:
        "Separating review from apply keeps the public surface from holding infrastructure-changing authority.",
      tradeoff:
        "The demo proves review flow, not end-to-end deployment.",
    },
    {
      title: "Mock external write integrations",
      rationale:
        "Reviewers can inspect the intended handoff without exposing repository or approval credentials.",
      tradeoff:
        "Live GitHub comments and checks require a separately controlled installation path.",
    },
  ],
  evidence: [
    {
      value: "Live",
      label: "Constrained public review flow",
      qualifier: "Sample inputs only; Terraform execution is disabled.",
      href: "https://github.com/manynames3/terragate/blob/main/docs/public-demo.md",
    },
    {
      value: "Deterministic",
      label: "Python findings",
      qualifier: "No active external policy-engine execution is claimed.",
      href: "https://github.com/manynames3/terragate/blob/main/docs/architecture.md",
    },
    {
      value: "Mocked",
      label: "External writes",
      qualifier: "Repository checks, comments, and approvals are outside the public boundary.",
      href: "https://github.com/manynames3/terragate/blob/main/docs/threat-model.md",
    },
  ],
  artifacts: [
    {
      id: "terragate-architecture",
      kind: "architecture",
      title: "Review-flow architecture",
      href: "https://github.com/manynames3/terragate/blob/main/docs/architecture.md",
      image: {
        src: "/case-studies/terragate-architecture.webp",
        alt: "TerraGate architecture showing the constrained public interface, deterministic review services, data store, and mocked external boundaries",
        width: 1200,
        height: 1299,
      },
    },
    {
      id: "terragate-infrastructure",
      kind: "iac",
      title: "AWS public-demo Terraform",
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
      title: "Testing strategy and commands",
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
  ],
  limitations: [
    "Terraform execution is disabled in the public demo.",
    "External repository writes are mocked.",
    "The public path does not execute an external policy engine.",
  ],
  productionPath: [
    "Run evaluation inside an isolated worker with bounded time, memory, and input size.",
    "Use a narrowly scoped repository installation for checks and comments, with approval required for writes.",
    "Version rule packs and retain the rule version with every decision record.",
  ],
  technologies: [
    "Python",
    "FastAPI",
    "Next.js",
    "Terraform plan JSON",
    "PostgreSQL",
    "Cloudflare Workers",
  ],
  seo: {
    title: "TerraGate — Safer Terraform review | Aiden Rhaa",
    description:
      "TerraGate case study: deterministic Python review of Terraform plans in a constrained live demo with execution disabled and external writes mocked.",
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
      title: "AWS container architecture",
      href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/architecture.md",
      image: {
        src: "/case-studies/clearpath-architecture.webp",
        alt: "Clearpath AWS architecture showing edge protection, load balancing, Fargate services, private data services, secrets, and observability",
        width: 1536,
        height: 691,
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
      heading: "Deterministic review inside a constrained boundary.",
      copy:
        "Repeatable Python checks evaluate bounded inputs while Terraform execution stays disabled and external writes remain mocked. The threat model documents what the public surface cannot do.",
      artifactId: "terragate-threat-model",
    },
    recovery: {
      heading: "A stalled review recovers without gaining write authority.",
      copy:
        "If a review remains queued because the worker and execution mode disagree, the runbook checks REVIEW_EXECUTION_MODE, starts the worker or restores the intended safe mode, and keeps external writes mocked throughout the recovery.",
      artifactId: "terragate-runbook",
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
