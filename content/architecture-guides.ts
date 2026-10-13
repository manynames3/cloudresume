import type { CaseStudySlug } from "./case-studies";

interface ArchitectureGuide {
  caption: string;
  points: readonly { label: string; title: string; copy: string }[];
}

export const architectureGuides = {
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
    caption: "From Terraform plans to evidence-backed review decisions. Live deployment shown; RDS/VPC is a separate reference stack.",
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
