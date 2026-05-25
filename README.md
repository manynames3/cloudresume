# Cloud Resume

Static personal portfolio site for Aiden Rhaa, positioned as a product-minded AWS infrastructure engineer focused on production-style AWS systems, infrastructure automation, platform engineering, governance, observability, and business workflow automation.

- GitHub Pages site: https://manynames3.github.io/cloudresume/
- Cloudflare Pages site: https://cloudresume-91x.pages.dev/
- Repository: https://github.com/manynames3/cloudresume
- GitHub profile: https://github.com/manynames3
- LinkedIn: https://linkedin.com/in/aidenrhaa

## Overview

This repository hosts a single-page branding portfolio deployed from GitHub. The page presents Aiden's workflow-first cloud infrastructure point of view, operating model, proof systems, operator background, technical capabilities, and contact links.

The visual system is adapted toward an Untitled UI-style B2B/SaaS foundation: neutral surfaces, restrained accent color, clear hierarchy, simple cards, and proof-led sections instead of a resume-template layout.

The site is intentionally simple: plain HTML, embedded CSS, and a local headshot image. There is no framework, build step, package manager, or runtime dependency.

## Featured Content

- Product-minded AWS infrastructure engineering brand.
- Hero built around a workflow-first operating model rather than a resume-style credential header.
- Operating-model section covering workflow discovery, reviewability, governance, observability, cost controls, and durable handoff.
- Operator-lens section connecting business workflow ownership to infrastructure decisions.
- Public cloud projects using Terraform, Terraform plan review, ECS Fargate, EKS/GitOps, Lambda, API Gateway, Cognito, DynamoDB, S3, RDS PostgreSQL, Bedrock, Docker, GitHub Actions, OPA/Rego, OpenTelemetry, CloudWatch, SQS, EventBridge, and platform governance workflows.
- Proof-system case studies for AegisDesk, Pulpit Platform Evolution, and Clearpath Fargate API.
- Supporting proof library for TerraGate, GrantStack, PursuitDesk, BrokerOps Platform, InvoiceBridge API, PhotoScribe AI, Super Transcriber API, and DocuFlow OCR.
- Downloadable ATS/human-optimized resume PDF.
- Capability map, certifications, GitHub, LinkedIn, email, and contact links.

## Repository Structure

```text
.
├── index.html
├── Aiden_Rhaa_AWS_Cloud_Engineer_Resume_2026.pdf
├── aiden_rhaa_headshot__resized_.jpg
└── README.md
```

## Local Preview

Because this is a static site, it can be opened directly in a browser:

```sh
open index.html
```

For a local HTTP server, use Python:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Deployment

The site is a static deploy from the `master` branch root. GitHub Pages can serve it directly, and Cloudflare Pages can deploy the same repository with no build command.

GitHub Pages URL:

```text
https://manynames3.github.io/cloudresume/
```

Suggested Cloudflare Pages settings:

```text
Build command: none
Build output directory: ./
```

Current Cloudflare Pages deployment:

```text
Project: cloudresume
URL: https://cloudresume-91x.pages.dev/
Deployment method: Wrangler direct upload from the pushed Git commit
```

To publish an update through Git:

```sh
git add index.html Aiden_Rhaa_AWS_Cloud_Engineer_Resume_2026.pdf aiden_rhaa_headshot__resized_.jpg README.md
git commit -m "Update portfolio landing page"
git push origin master
```

GitHub Pages will rebuild after the push. A connected Cloudflare Pages project will also deploy from the pushed branch.

## Editing Notes

- Keep the site self-contained unless a build step becomes necessary.
- Update project cards when public project repos change.
- Keep links current for GitHub, LinkedIn, email, deployed apps, and live project URLs.
- Compress any replacement images before committing them.
- Test mobile layout after changing hero, project cards, or contact sections.

## License

No license has been declared. All rights are reserved unless a license file is added.
