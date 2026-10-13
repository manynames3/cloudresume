export const profile = {
  name: "Aiden Rhaa",
  role: "AI Applications & Cloud Engineer",
  email: "aidenrhaacloud@gmail.com",
  github: "https://github.com/manynames3",
  linkedin: "https://linkedin.com/in/aidenrhaa",
  portrait: {
    src: "/case-studies/aiden-rhaa-portrait.webp",
    alt: "Portrait of Aiden Rhaa",
    width: 360,
    height: 360,
  },
} as const;

export const principles = [
  {
    title: "Deploy",
    copy: "Package the change, its infrastructure, and its validation path together.",
    href: "https://github.com/manynames3/clearpath-fargate-api/tree/main/terraform",
    linkLabel: "Review Clearpath Terraform",
  },
  {
    title: "Defend",
    copy: "State the identity and write boundaries at the layer the evidence supports.",
    href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/security.md",
    linkLabel: "Review InspectIQ security notes",
  },
  {
    title: "Observe",
    copy: "Leave runtime proof, alarms, and qualifiers where the next operator can find them.",
    href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/live-production-proof.md",
    linkLabel: "Review InspectIQ runtime proof",
  },
  {
    title: "Recover",
    copy: "Treat rollback, restore, and teardown as designed paths rather than improvised events.",
    href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/runbook.md",
    linkLabel: "Review the Clearpath runbook",
  },
  {
    title: "Hand Off",
    copy: "Pair architecture with limits and procedures so ownership can move without folklore.",
    href: "https://github.com/manynames3/inspectiq/blob/ec5474c543ab1e069533e19f85d63c5e0c239136/docs/runbook.md",
    linkLabel: "Review the InspectIQ runbook",
  },
] as const;

interface SupportingProject {
  title: string;
  category: string;
  copy: string;
  preview?: string;
  scope?: string;
  boundary?: string;
  href: `https://${string}`;
  links?: readonly { label: string; href: `https://${string}` }[];
  visual?: {
    src: string; alt: string; width: number; height: number;
    href: `https://${string}`; caption: string;
  };
}

export const supportingProjects: readonly SupportingProject[] = [
  {
    title: "AegisDesk",
    category: "AWS incident operations / evaluation deployment",
    preview: "Team-scoped incident workspaces with evidence, runbooks, and action-specific human approvals.",
    scope: "Evaluation deployment. Readiness and authenticated case listing verified; external integrations unconfigured.",
    copy: "Keep incident evidence, operator hypotheses, runbooks, and action approvals in one team-scoped case. Independent approval applies to an exact action; uncertain outcomes remain unresolved rather than triggering an automatic redispatch.",
    boundary: "October 10 AWS release: readiness and authenticated DynamoDB-backed case listing verified. Jira and CloudWatch integrations are unconfigured; hosted case writes and real ticket execution were not verified. Separately, draft PR #1 records a local Kubernetes evaluation: FastAPI + OPA in disposable Kind with Helm, readiness, PVC binding and upgrade CI. The SQLite chart rejects more than one API replica; this is not deployed EKS, high availability, or a production Kubernetes service.",
    href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane",
    links: [
      { label: "Incident workflow", href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane/blob/main/docs/operations/incident-workflow.md" },
      { label: "AWS release evidence", href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane/blob/main/docs/evidence/live-operations.md" },
      { label: "Draft Helm/Kind evaluation · local Kubernetes", href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane/pull/1" },
      { label: "Local Kubernetes evidence ledger", href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane/blob/6b5182a394590fecffc2ae2bcbb413edca298ce8/docs/evidence/kubernetes-local.md" },
      { label: "Evaluation workspace", href: "https://d27myiy7bbj1rz.cloudfront.net" },
    ],
    visual: {
      src: "/case-studies/aegisdesk-incident.webp",
      alt: "AegisDesk controlled incident fixture showing an action workflow with approval and outcome boundaries",
      width: 1440, height: 1000,
      href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane/blob/main/docs/evidence/screenshots/incident-actions-controlled-desktop.png",
      caption: "Controlled local incident fixture / not a hosted incident or customer integration. The separate release record documents the verified AWS checks.",
    },
  },
  {
    title: "Super Transcriber API",
    category: "AWS transcription API / independent release",
    preview: "An AWS transcription API for applications that need private uploads, reliable background processing, and completion callbacks. Durable job admission, scoped API keys, measured usage, and signed webhook replay make processing explicit and recoverable.",
    scope: "Independent AWS API release. Synthetic transcription and recovery checks recorded; no customer traffic or SLA claimed.",
    copy: "Durable job admission and an outbox connect private S3 uploads to SQS and Amazon Transcribe. Atomic usage settlement releases concurrency on completion; interrupted work has a reconciliation path. Scoped, revocable API keys, signed webhook retries and replay, an OpenAPI contract, and a TypeScript SDK make integration and ownership explicit. Release evidence records live upload-to-transcript checks, account isolation, and interrupted-job recovery.",
    boundary: "The documented hosted deployment has Stripe billing and Bedrock enrichment disabled. MP3/M4A are supported; source-URL ingestion and real-time streaming are not. Synthetic workflow checks are not accuracy, production-scale, customer-adoption, or service-level evidence.",
    href: "https://github.com/manynames3/super-transcriber-api",
    links: [
      { label: "Architecture & recovery", href: "https://github.com/manynames3/super-transcriber-api/blob/main/docs/architecture.md" },
      { label: "OpenAPI contract", href: "https://github.com/manynames3/super-transcriber-api/blob/main/openapi/openapi.yaml" },
      { label: "TypeScript SDK", href: "https://github.com/manynames3/super-transcriber-api/tree/main/sdk/typescript" },
      { label: "Release verification", href: "https://github.com/manynames3/super-transcriber-api/blob/main/docs/validation-evidence.md" },
      { label: "Product & API reference", href: "https://super-transcriber-api.pages.dev/api-reference" },
    ],
  },
  {
    title: "CareFrame",
    category: "Hospital media workspace / powered by PhotoScribe AI",
    preview: "A private workspace for hospital communications teams to find, upload, and review photos while keeping access permissions, consent status, and usage-rights context attached to each asset.",
    scope: "Independent AWS-backed pilot with a fictional hospital and illustrative media.",
    copy: "Cognito staff roles, private S3 storage, Bedrock embeddings, S3 Vectors search, and DynamoDB asset policies govern the library and its short-lived image links. Approval, consent, rights, and role access remain separate controls. Recorded staff-workflow checks exercised sign-in, private upload and indexing, review-policy validation, and role-restricted access using disposable QA accounts.",
    boundary: "No hospital customer use, buyer acceptance, or regulatory certification is claimed. An approval label does not independently establish consent or usage rights. Invitation email delivery, enterprise SSO, and customer-approved retention and legal policies remain separate acceptance gates.",
    href: "https://github.com/manynames3/photoscribe-ai",
    links: [
      { label: "C4 architecture", href: "https://github.com/manynames3/photoscribe-ai/blob/main/docs/c4.md" },
      { label: "Staff-workflow verification", href: "https://github.com/manynames3/photoscribe-ai/blob/main/docs/staff-workflow-verification.md" },
      { label: "Pilot readiness & limits", href: "https://github.com/manynames3/photoscribe-ai/blob/main/docs/end-user-readiness.md" },
      { label: "Open product · staff sign-in required", href: "https://photoscribe-ai.pages.dev/" },
    ],
  },
  {
    title: "Market Scout Android",
    category: "Native market research / merged Android client",
    preview: "Screen cities, ZIP codes, and counties before deeper property research. Saved lists, notes, favorites, and two- or three-market comparisons stay on the device; downloaded market snapshots support offline research.",
    scope: "Android 1.1.0 source merged into master on October 13. CI builds a debug APK; no Google Play release is claimed.",
    copy: "Native Java views and the web client share a versioned public JSON contract rather than a shared UI or a paid backend. Frozen scan inputs and cancelable requests prevent stale callbacks from replacing new research. Private device storage preserves lists and drafts; atomic, snapshot-matched caching keeps offline readings explicit. The merge-commit Android CI passed JVM fixture tests, lint/build, and five API 35 emulator cases covering persistence and activity recreation.",
    boundary: "Offline lookup requires previously downloaded indexes and relevant shards; cached readings are labeled. Lists and notes are not synchronized across devices. Source freshness follows the generated Redfin snapshot; optional Census income uses the 2022 ACS estimate. Physical-device large-text/TalkBack qualification and Google Play distribution are not established by emulator CI.",
    href: "https://github.com/manynames3/market-scout",
    links: [
      { label: "Android data contract & limits", href: "https://github.com/manynames3/market-scout/blob/8accc6d1dabb7644c09175ef6d0d08e50d1a2741/docs/android.md" },
      { label: "Merged Android work", href: "https://github.com/manynames3/market-scout/pull/1" },
      { label: "Passing merge-commit CI & debug APK", href: "https://github.com/manynames3/market-scout/actions/runs/38361037385" },
      { label: "Open web companion", href: "https://market-scout-anl.pages.dev/" },
    ],
    visual: { src: "/case-studies/market-scout-android.webp", alt: "Market Scout native Android comparison screen with market metrics and saved-research controls", width: 1080, height: 2424, href: "https://github.com/manynames3/market-scout/blob/8accc6d1dabb7644c09175ef6d0d08e50d1a2741/docs/images/market-scout-android-comparison.png", caption: "Repository Android capture / merged client. Emulator checks are separate from physical-device qualification." },
  },
  {
    title: "Clearpath",
    category: "ECS Fargate API / retained validation",
    preview: "A lead-intelligence API with container delivery, Terraform infrastructure, validation, observability, and an explicit teardown path.",
    scope: "Independent reference system. Short-lived AWS validation; torn down after validation. No live demo.",
    copy: "FastAPI, PostgreSQL and RDS Proxy were exercised together on AWS Fargate. The retained case study explains the startup failure and correction, security boundaries, API checks, and operator handoff.",
    boundary: "Retained point-in-time evidence, not a continuing service or long-term availability claim. GHL-compatible intake is not a verified GHL integration; the cost model is an estimate, not billing evidence.",
    href: "https://github.com/manynames3/clearpath-fargate-api",
    links: [
      { label: "Read the retained Clearpath case study", href: "https://manynames3.github.io/cloudresume/case-studies/clearpath/" },
      { label: "Retained validation evidence", href: "https://github.com/manynames3/clearpath-fargate-api/blob/main/docs/live-validation-summary.md" },
    ],
  },
  {
    title: "Pulpit / Serverless",
    category: "AWS bilingual retrieval / deployed migration",
    preview: "Cited Korean-English archive search, with S3 Vectors retrieval and versioned snapshots designed for rollback.",
    scope: "Deployed migration. Local ingestion; recorded smoke checks are not a relevance or performance benchmark.",
    copy: "Search a Korean-English sermon archive with cited answers. S3 Vectors and sharded lexical retrieval keep embeddings out of query-Lambda memory; versioned snapshots publish the manifest last and preserve a rollback path. The October 7 migration retained 360 sermons and 8,191 chunks at that checkpoint.",
    boundary: "Individual API smoke observations, not a relevance or performance benchmark. Ingestion runs locally because the caption path is blocked from AWS IPs; cache-only polling is timeout recovery, not a durable job system. Snapshot cleanup remains manual.",
    href: "https://github.com/manynames3/pulpit",
    links: [
      { label: "Migration & recovery", href: "https://github.com/manynames3/pulpit/blob/main/docs/s3-vectors-migration.md" },
      { label: "Architecture", href: "https://github.com/manynames3/pulpit/blob/main/docs/architecture.md" },
      { label: "Open app · sign-in required", href: "https://pulpit.pages.dev" },
    ],
    visual: {
      src: "/case-studies/pulpit-serverless-architecture.webp",
      alt: "Pulpit serverless query and publication paths: Cognito, API Gateway, Lambda, S3 Vectors, lexical snapshots in S3, DynamoDB cache and audit, Bedrock, and a local ingestion runner",
      width: 1600, height: 960,
      href: "https://github.com/manynames3/pulpit/blob/main/docs/architecture.md",
      caption: "Query and snapshot-publication paths / based on the October 7 architecture and migration record. Local ingestion is distinct from the legacy AWS ingestion path.",
    },
  },
  {
    title: "Pulpit V2",
    category: "Validated EKS and GitOps platform",
    copy: "A migration path from serverless retrieval to Kubernetes with observability, secrets discipline, and teardown artifacts.",
    href: "https://github.com/manynames3/pulpit-v2",
  },
  {
    title: "DocuFlow OCR",
    category: "Document-processing workflow",
    copy: "Presigned intake, orchestration, OCR, parsing and scoring, human review, dead-letter handling, and alarms.",
    href: "https://github.com/manynames3/docuflow-ocr",
  },
  {
    title: "WorshipCue",
    category: "Offline-first iPad workflow / independent development",
    preview: "Offline charts, handwritten notes, and team rehearsal workflows built around exact chart versions.",
    scope: "Independent development. Latest work partly local; no App Store release or qualified multi-iPad pilot.",
    copy: "A music stand for rehearsal: keep charts available offline, preserve handwritten notes, and coordinate exact chart versions, team access, cues, and chat through a cloud workspace. Native usability, permissions, and recovery are designed around the same operating workflow.",
    boundary: "Latest native/backend work remains partly local; published source checkpoints are earlier builds. Selected AWS and managed-session checks are recorded, but there is no App Store release or fully qualified multi-iPad rehearsal pilot. Capacity and final gesture qualification remain open.",
    href: "https://github.com/manynames3/WorshipCue",
    links: [
      { label: "Engineering decisions", href: "https://github.com/manynames3/WorshipCue/blob/main/docs/ENGINEERING.md" },
      { label: "Publication & verification", href: "https://github.com/manynames3/WorshipCue/blob/main/verification/STATUS.md" },
    ],
  },
] as const;

export const experience = [
  {
    role: "Founder / Automation & Systems Lead",
    organization: "Clearpath Property Group / Boston Probate Solutions",
    period: "Dec 2016—Present",
    location: "Atlanta Metropolitan Area",
    summary:
      "Owned lead intake, public-record research, market data, CRM integration, seller communication, and automation; translated those operating requirements into webhook, API, and cloud workflow artifacts.",
  },
  {
    role: "Creative Director / Operations",
    organization: "Aiden Rhaa Photography / Visual Impact Studios",
    period: "Oct 2010—Present",
    location: "Atlanta Metropolitan Area",
    summary:
      "Delivered 200+ client projects while coordinating contractors, vendors, budgets, timelines, technical execution, web properties, deployment workflows, and high-touch client communication.",
  },
  {
    role: "Multimedia Producer / Technical Workflow Lead",
    organization: "ProMedia Productions",
    period: "May 2009—Dec 2016",
    location: "Boston, Massachusetts",
    summary:
      "Managed end-to-end audio and video delivery, automated media-file handling, and designed recording workflows for small-business, corporate, and education clients.",
  },
] as const;

export const education = [
  {
    institution: "Berklee College of Music",
    study: "Music / Songwriting",
    period: "2008—2011",
  },
  {
    institution: "Saint Louis University",
    study: "Engineering Physics",
    period: "2006—2008",
  },
] as const;

export const credentials = [
  {
    issuer: "Amazon Web Services",
    title: "AWS Certified Solutions Architect – Associate",
  },
  {
    issuer: "Amazon Web Services",
    title: "AWS Certified Developer – Associate",
  },
  {
    issuer: "HashiCorp",
    title: "HashiCorp Certified: Terraform Associate",
  },
] as const;
