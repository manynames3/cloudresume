# Operational Context Rebalance

## Objective

Keep the portfolio centered on AWS infrastructure and platform engineering while preserving the product-minded advantage of experience with customer-facing workflows, CRM operations, webhooks, and voice systems.

## Approved Direction

Remove the standalone “Voice & customer experience” chapter. It gives Super Transcriber the same narrative weight as the three flagship cloud reference systems even though it belongs in the supporting portfolio.

Move the cross-cutting insight into the Operator Profile as a compact, unnumbered “Operational context” note. Super Transcriber remains a supporting project and is not promoted into a fourth case study.

## Page Structure

The homepage sequence becomes:

1. Hero
2. Independent cloud reference systems
3. Operator profile, including the compact operational-context note
4. Operating principles
5. Supporting index
6. Experience and credentials
7. Contact

Visible folio numbers are renumbered consecutively from `01` through `06` after the standalone chapter is removed.

## Operator Profile Treatment

The existing portrait, primary profile heading, delivery history, and AWS/platform copy remain unchanged.

After the primary profile copy, add a thin-rule note with:

- Label: `Operational context`
- Heading: `Infrastructure shaped by the workflow it serves.`
- Concise copy connecting CRM operations, webhooks, intent capture, transcript summaries, structured handoff, queues, completion events, and callbacks to integration and failure-path design.
- A quiet in-page link to the supporting index, where Super Transcriber retains its repository link and full supporting-project description.

The note must read as context for engineering judgment, not as a separate project feature or chapter.

## Visual Behavior

- Reuse the existing ivory, ink, muted-ink, signal-red, typography, and thin-rule system.
- Do not add a new full-width section, metric treatment, image, icon, card background, or client-side interaction.
- Keep the note visually subordinate to the operator-profile heading and large delivery statement.
- On desktop, the note stays within the profile copy column.
- On mobile, it follows the AWS/platform paragraph and reflows without horizontal overflow.

## Content Boundaries

- Super Transcriber remains in `supportingProjects` and is linked only from the supporting index.
- Do not imply Amazon Connect experience.
- Do not widen any infrastructure, production, authorization, certification, or lifecycle claim.
- Do not change the flagship case studies, résumé, hero, social card, project evidence, or public deployment configuration.

## Acceptance Checks

- The rendered homepage contains no `Voice & customer experience` chapter and no `voice-section` markup.
- The Operator Profile contains the new operational-context label, heading, copy, and in-page supporting-index link.
- Super Transcriber appears once as a supporting-project entry, without a dedicated chapter CTA.
- Folios render as `01` reference systems, `02` operator profile, `03` operating principles, `04` supporting index, `05` experience, and `06` contact.
- Existing claim-boundary tests remain green.
- The production build, lint, typecheck, 1440px desktop layout, 390px mobile layout, and 320px reflow pass without horizontal overflow.
