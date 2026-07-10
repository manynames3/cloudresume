export const profile = {
  name: "Aiden Rhaa",
  role: "Cloud Platform & Reliability Engineer",
  email: "aidenrhaacloud@gmail.com",
  github: "https://github.com/manynames3",
  linkedin: "https://linkedin.com/in/aidenrhaa",
  resume:
    "https://manynames3.github.io/cloudresume/Aiden_Rhaa_AWS_Cloud_Engineer_Resume_2026.pdf",
  portrait: {
    src: "/case-studies/aiden-rhaa-portrait.jpg",
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
    href: "https://github.com/manynames3/inspectiq/blob/main/docs/security.md",
    linkLabel: "Review InspectIQ security notes",
  },
  {
    title: "Observe",
    copy: "Leave runtime proof, alarms, and qualifiers where the next operator can find them.",
    href: "https://github.com/manynames3/inspectiq/blob/main/docs/live-production-proof.md",
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
    href: "https://github.com/manynames3/inspectiq/blob/main/docs/runbook.md",
    linkLabel: "Review the InspectIQ runbook",
  },
] as const;

export const supportingProjects = [
  {
    title: "AegisDesk",
    category: "Cloud operations control plane",
    copy: "Governed incident, access, cost, policy, and trusted-answer workflows with explicit approval paths.",
    href: "https://github.com/manynames3/aegisdesk-cloudops-control-plane",
  },
  {
    title: "Pulpit V2",
    category: "Validated EKS and GitOps platform",
    copy: "A migration path from serverless retrieval to Kubernetes with observability, secrets discipline, and teardown artifacts.",
    href: "https://github.com/manynames3/pulpit-v2",
  },
  {
    title: "Super Transcriber",
    category: "Serverless transcription API",
    copy: "API-key access, queued workers, transcription events, webhooks, OpenAPI, an SDK, and infrastructure as code.",
    href: "https://github.com/manynames3/super-transcriber-api",
  },
  {
    title: "PhotoScribe AI",
    category: "Governed media search",
    copy: "Private media, policy and audit records, queued failure handling, search, and cost documentation on AWS.",
    href: "https://github.com/manynames3/photoscribe-ai",
  },
  {
    title: "DocuFlow OCR",
    category: "Document-processing workflow",
    copy: "Presigned intake, orchestration, OCR, parsing and scoring, human review, dead-letter handling, and alarms.",
    href: "https://github.com/manynames3/docuflow-ocr",
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

export const credentialStatement =
  "Previously earned credentials, not currently active: AWS Certified Solutions Architect – Associate; AWS Certified Developer – Associate; HashiCorp Certified: Terraform Associate.";
