import type { CaseStudySlug } from "./case-studies";

interface ArchitectureGuide {
  caption: string;
  points: readonly { label: string; title: string; copy: string }[];
}

export const architectureGuides = {
  shiftclarity: {
    caption: "From approved work and dated terms to evidence-backed review. Deployed synthetic pilot / fictional records only; the standalone demo is a separate memory-only mode.",
    points: [
      { label: "Entry", title: "Identity is not permission", copy: "Cognito MFA identifies a person; server-side memberships govern the persistent workspace." },
      { label: "Processing", title: "One calculation contract", copy: "React and FastAPI share the exact-decimal engine. Private imports feed Lambda/SQS jobs." },
      { label: "Data ownership", title: "Sources stay with the decision", copy: "Neon transactions preserve revisions, rules, immutable runs and audit. S3 retains private originals." },
      { label: "Recovery", title: "Publish once, recover explicitly", copy: "Job claims, lease fencing, retries and a matched restore rehearsal support the synthetic workflow—not a production RPO/RTO." },
    ],
  },
  inspectiq: {
    caption: "From inspection photos to reviewed condition reports.",
    points: [
      { label: "Entry", title: "Capture & identity", copy: "Web and mobile clients. Cognito JWT/RBAC is enforced by the application." },
      { label: "Processing", title: "Queued image analysis", copy: "Private S3 → SQS → Lambda → Bedrock. Human review remains authoritative." },
      { label: "Data ownership", title: "Postgres is the record", copy: "Neon owns business facts; DynamoDB holds operational projections and idempotency state." },
      { label: "Recovery", title: "Failed work stays visible", copy: "DLQs, replay controls, CloudWatch and X-Ray support investigation and recovery." },
    ],
  },
  terragate: {
    caption: "From Terraform plans to evidence-linked decisions. The deployed path is Cloudflare Workers → API Gateway → Lambda outside a VPC → Neon. Plan files remain ephemeral; GitHub writes are mocked and Terraform execution is disabled. The RDS/private-VPC alternative is not shown as live infrastructure.",
    points: [
      { label: "Entry", title: "A bounded review workspace", copy: "Cloudflare Workers serves the UI. The public demo uses shared dev identities." },
      { label: "Processing", title: "Deterministic checks", copy: "API Gateway → Python Lambda. Encoded Python rules produce the findings." },
      { label: "Data ownership", title: "Evidence-linked decisions", copy: "Neon retains findings and audit history. Lambda /tmp plan files remain ephemeral." },
      { label: "Recovery", title: "No deployment authority", copy: "Expired plan evidence is explicit. GitHub writes are mocked; Terraform execution is disabled." },
    ],
  },
  clearpath: {
    caption: "From lead intake to scoring and reporting on AWS Fargate.",
    points: [
      { label: "Entry", title: "An explicit API contract", copy: "Lead intake, scoring and reporting behind the validated AWS edge and load balancer." },
      { label: "Processing", title: "Containerized workflows", copy: "FastAPI on ECS Fargate, provisioned with Terraform." },
      { label: "Data ownership", title: "PostgreSQL & RDS Proxy", copy: "The recorded deployment exercised the data, secrets and container boundaries together." },
      { label: "Recovery", title: "A documented exit path", copy: "CloudWatch, validation artifacts and runbooks. The AWS environment was torn down after validation." },
    ],
  },
} satisfies Record<CaseStudySlug, ArchitectureGuide>;
