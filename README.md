# Cloud Resume

Static cloud resume and portfolio site for Aiden Rhaa, focused on AWS cloud engineering, DevOps automation, Terraform infrastructure, platform tooling, serverless systems, CI/CD, containers, and production-style cloud project documentation.

- Live site: https://manynames3.github.io/cloudresume/
- Repository: https://github.com/manynames3/cloudresume
- GitHub profile: https://github.com/manynames3
- LinkedIn: https://linkedin.com/in/aidenrhaa

## Overview

This repository hosts a single-page resume portfolio deployed with GitHub Pages. The page highlights cloud engineering positioning, certifications, technical skills, public project work, professional experience, and contact links.

The site is intentionally simple: plain HTML, embedded CSS, lightweight JavaScript, and a local headshot image. There is no framework, build step, package manager, or external hosting dependency beyond GitHub Pages.

## Featured Content

- AWS-focused cloud and DevOps engineer profile.
- Public cloud projects using Terraform, Terraform plan review, ECS Fargate, Lambda, API Gateway, Cognito, DynamoDB, S3, RDS PostgreSQL, Bedrock, EKS, Docker, GitHub Actions, OPA/Rego, OpenTelemetry, and CloudWatch.
- Featured infrastructure project: Clearpath AWS Fargate Lead Intelligence API.
- Top project cards for TerraGate, AegisDesk, Pulpit V2, PhotoScribe AI, Pulpit, FaceID, Super Transcriber, DocuFlow OCR, and Market Scout.
- Downloadable ATS/human-optimized resume PDF.
- Skills, certifications, experience, target roles, and contact links.

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

The site is deployed with GitHub Pages from the `master` branch root.

Current public URL:

```text
https://manynames3.github.io/cloudresume/
```

To publish an update:

```sh
git add index.html Aiden_Rhaa_AWS_Cloud_Engineer_Resume_2026.pdf aiden_rhaa_headshot__resized_.jpg README.md
git commit -m "Update cloud resume"
git push origin master
```

GitHub Pages will rebuild the static site after the push.

## Editing Notes

- Keep the site self-contained unless a build step becomes necessary.
- Update project cards when public project repos change.
- Keep links current for GitHub, LinkedIn, email, and deployed demos.
- Compress any replacement images before committing them.
- Test mobile layout after changing hero, project cards, or contact sections.

## License

No license has been declared. All rights are reserved unless a license file is added.
