# Cloud Resume

Static personal brand site for Aiden Rhaa, a Cloud & DevOps Engineer who builds production-style AWS systems from real operator workflows and verified business problems.

- Live site: https://manynames3.github.io/cloudresume/
- Repository: https://github.com/manynames3/cloudresume
- GitHub profile: https://github.com/manynames3
- LinkedIn: https://linkedin.com/in/aidenrhaa

## Overview

This repository hosts a single-page portfolio site built with plain HTML, embedded CSS, a local headshot image, and a downloadable resume PDF. There is no framework, build step, package manager, or runtime dependency.

The page preserves the dark/blue cloud-engineer visual system and presents the brand through these sections:

- Hero
- Why Hiring Managers Should Care
- Story
- Credentials
- Stack
- Systems with evidence-labeled project cards
- Origin
- Connect

## Brand Positioning

The site presents Aiden as an AWS-certified Cloud & DevOps Engineer who builds secure, reviewable AWS systems from real operator workflows. The first read emphasizes business value and operating discipline, while the project cards carry the deeper stack details.

The "Why Hiring Managers Should Care" section focuses on three proof points:

- Translates business workflows into AWS systems
- Builds with reviewability and operations in mind
- Documents enough for another engineer to inspect, run, and trust

## Featured Project

The featured project is **PursuitDesk - GovCon Capture & Proposal Platform**, a business-validated AWS SaaS-style system for client intake, readiness scoring, opportunity triage, async proposal drafting, public data ingestion, PDF/DOCX exports, and cloud workflow automation.

Major project cards use this structure:

- Business problem
- Cloud system built
- Confidence signals
- Evidence labels and links, such as live demo, repo, architecture notes, tests, Terraform, and runbooks

## Project Groups

### Platform & CloudOps Proof

- TerraGate - Terraform PR Risk Gate
- AegisDesk - Self-Hosted CloudOps AI Control Plane
- Clearpath - AWS Fargate Lead Intelligence API
- Pulpit V2 - Validated EKS/GitOps Platform

### Business-Validated Cloud Systems

- ElecBidSpec AI - Electrical Bid Intelligence Platform
- StockSense AI - Expiration-Aware Inventory Optimization
- QueueWatch - Serverless Grid-Capacity Intelligence

### Supporting AWS Patterns

- PhotoScribe AI - Governed Serverless Media Search
- DocuFlow OCR - Step Functions + Textract Workflow
- Super Transcriber API - API-First Serverless Transcription Backend
- Pulpit V1 - Serverless Bedrock RAG Application

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

The site deploys from the root of the `master` branch. GitHub Pages can serve it directly, and Cloudflare Pages can deploy the same repository with no build command.

GitHub Pages:

```text
https://manynames3.github.io/cloudresume/
```

Cloudflare Pages compatible settings:

```text
Build command: none
Build output directory: ./
```

## Editing Notes

- Keep the site static unless a build step becomes necessary.
- Test desktop and mobile widths after changing hero, project cards, or contact sections.
- Keep GitHub, LinkedIn, email, deployed demo, API, and resume links current.
- Compress replacement images before committing them.
- Do not commit secrets, `.env` files, Terraform state, API keys, Cloudflare credentials, or AWS credentials.

## License

No license has been declared. All rights are reserved unless a license file is added.
