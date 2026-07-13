import type { CaseStudy } from "@/content/case-studies";
import {
  caseOperations,
  caseRepositories,
  getNextCaseStudy,
} from "@/content/case-studies";
import { caseStructuredData } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { ExternalLink, SiteFrame } from "@/components/site-frame";
import { absoluteUrl } from "@/lib/site-url";

function chapter(number: number, label: string) {
  return `${String(number).padStart(2, "0")} / ${label}`;
}

function DemoBoundary({ study }: { study: CaseStudy }) {
  const { demo } = study;
  const repository = caseRepositories[study.slug];

  if (demo.kind === "live-readonly") {
    return (
      <section
        id="demo-boundary"
        className="demo-boundary"
        data-demo-kind={demo.kind}
        data-demo-infrastructure={demo.infrastructure}
        data-demo-authorization={demo.authorization}
        data-demo-writes={demo.writes}
        data-demo-href={demo.href}
        aria-labelledby="demo-title"
      >
        <div>
          <p className="eyebrow">Demo boundary</p>
          <h2 id="demo-title">Live AWS-backed application</h2>
          <p className="status-text">Public walkthrough is read-only</p>
          <p>{demo.disclosure}</p>
        </div>
        <div className="demo-actions">
          <ExternalLink
            href={demo.href}
            className="button-link"
            label={`Open the ${study.title} read-only live walkthrough in a new tab`}
          >
            Open read-only live walkthrough
          </ExternalLink>
          <ExternalLink href={repository} className="text-link" label={`Open the ${study.title} repository in a new tab`}>
            Review repository
          </ExternalLink>
        </div>
      </section>
    );
  }

  if (demo.kind === "live-constrained") {
    return (
      <section
        id="demo-boundary"
        className="demo-boundary"
        data-demo-kind={demo.kind}
        data-demo-checks={demo.checks}
        data-demo-writes={demo.writes}
        data-demo-href={demo.href}
        aria-labelledby="demo-title"
      >
        <div>
          <p className="eyebrow">Demo boundary</p>
          <h2 id="demo-title">Live constrained demo</h2>
          <p className="status-text">Deterministic Python checks / external writes mocked</p>
          <p>{demo.disclosure}</p>
        </div>
        <div className="demo-actions">
          <ExternalLink
            href={demo.href}
            className="button-link"
            label={`Open the constrained ${study.title} live demo in a new tab`}
          >
            Open constrained live demo
          </ExternalLink>
          <ExternalLink href={repository} className="text-link" label={`Open the ${study.title} repository in a new tab`}>
            Review repository
          </ExternalLink>
        </div>
      </section>
    );
  }

  return (
    <section
      id="demo-boundary"
      className="demo-boundary"
      data-demo-kind={demo.kind}
      data-demo-lifecycle={demo.lifecycle}
      aria-labelledby="demo-title"
    >
      <div>
        <p className="eyebrow">Demo boundary</p>
        <h2 id="demo-title">Validated, then torn down</h2>
        <p className="status-text">No live demo</p>
        <p>{demo.disclosure}</p>
      </div>
      <div className="demo-actions">
        <ExternalLink
          href={repository}
          className="button-link"
          label="Review the Clearpath repository and validation artifacts in a new tab"
        >
          Review repository and evidence
        </ExternalLink>
      </div>
    </section>
  );
}

export function CaseStudyPage({
  study,
}: {
  study: CaseStudy;
}) {
  const architecture = study.artifacts.find((artifact) => artifact.image);
  const nextStudy = getNextCaseStudy(study.slug);
  const operations = caseOperations[study.slug];
  const reliabilityArtifact = study.artifacts.find(
    (artifact) => artifact.id === operations.reliability.artifactId,
  );
  const recoveryArtifact = study.artifacts.find(
    (artifact) => artifact.id === operations.recovery.artifactId,
  );
  const workflowShift = study.workflow ? 1 : 0;
  const visualShift = study.visuals ? 1 : 0;
  const architectureChapter = 2 + workflowShift;
  const decisionsChapter = 3 + workflowShift + visualShift;
  const evidenceChapter = 4 + workflowShift + visualShift;
  const operationsChapter = 5 + workflowShift + visualShift;
  const limitsChapter = 6 + workflowShift + visualShift;
  const artifactsChapter = 7 + workflowShift + visualShift;

  if (!reliabilityArtifact || !recoveryArtifact) {
    throw new Error(`Missing operating artifact for ${study.slug}`);
  }

  return (
    <SiteFrame>
      <link rel="canonical" href={absoluteUrl(`/case-studies/${study.slug}`)} />
      <JsonLd value={caseStructuredData(study)} />

      <article className="case-study">
        <div className="case-hero">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/#work">Work</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{study.title}</span>
          </nav>
          <div className="case-hero__title grid">
            <p className="eyebrow">Case study / {study.title}</p>
            <div>
              <h1>{study.benefitHeading}</h1>
              <p className="case-dek">{study.summary}</p>
            </div>
            <dl className="case-role">
              <div>
                <dt>Role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>System</dt>
                <dd>{study.title}</dd>
              </div>
            </dl>
          </div>
        </div>

        <DemoBoundary study={study} />

        <section className="case-section split-section" aria-labelledby="problem-title">
          <div>
            <p className="eyebrow">{study.frame?.eyebrow ?? "01 / Frame"}</p>
            <h2 id="problem-title">{study.frame?.problemHeading ?? "Problem"}</h2>
            <ul className="prose-list">
              {study.problem.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{study.frame?.constraintsHeading ?? "Constraints"}</h3>
            <ul className="prose-list">
              {study.constraints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {study.workflow ? (
          <section className="case-section workflow-section" aria-labelledby="workflow-title">
            <p className="eyebrow">{chapter(2, "Workflow")}</p>
            <h2 id="workflow-title">{study.workflow.heading}</h2>
            <ol className="workflow-list">
              {study.workflow.steps.map((step, index) => (
                <li key={step.title}>
                  <p className="workflow-number">{String(index + 1).padStart(2, "0")}</p>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {architecture?.image ? (
          <section className="case-section architecture-section" aria-labelledby="architecture-title">
            <p className="eyebrow">{chapter(architectureChapter, "System")}</p>
            <h2 id="architecture-title">Current architecture, with every major boundary visible.</h2>
            <figure>
              <img
                src={architecture.image.src}
                alt={architecture.image.alt}
                width={architecture.image.width}
                height={architecture.image.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                {architecture.title}. The source record explains data ownership, failure
                handling, and why deferred services remain outside this version. {" "}
                <ExternalLink
                  href={architecture.href}
                  className="caption-link"
                  label={`Open the ${study.title} architecture source in a new tab`}
                >
                  Architecture source
                </ExternalLink>
              </figcaption>
            </figure>
          </section>
        ) : null}

        {study.visuals ? (
          <section className="case-section product-visuals-section" aria-labelledby="visuals-title">
            <p className="eyebrow">{chapter(3 + workflowShift, "Product in use")}</p>
            <h2 id="visuals-title">{study.visuals.heading}</h2>
            <div className="product-visuals">
              {study.visuals.items.map((visual) => (
                <figure
                  key={visual.id}
                  className={`product-visual product-visual--${visual.layout}`}
                  data-product-visual={visual.id}
                >
                  <a
                    href={visual.href}
                    className="product-visual__frame"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open the full-resolution ${visual.title} source in a new tab`}
                  >
                    <img
                      src={visual.image.src}
                      alt={visual.image.alt}
                      width={visual.image.width}
                      height={visual.image.height}
                      loading="lazy"
                      decoding="async"
                      data-focal-point={visual.focalPoint}
                    />
                  </a>
                  <figcaption>
                    <h3>{visual.title}</h3>
                    <p>{visual.copy}</p>
                    <ExternalLink
                      href={visual.href}
                      className="caption-link"
                      label={`Open the full-resolution ${visual.title} source in a new tab`}
                    >
                      Full-resolution source
                    </ExternalLink>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section className="case-section" aria-labelledby="decisions-title">
          <p className="eyebrow">{chapter(decisionsChapter, "Decisions")}</p>
          <h2 id="decisions-title">Three decisions and the cost of each.</h2>
          <ol className="decision-list">
            {study.decisions.map((decision, index) => (
              <li key={decision.title} className="decision grid">
                <p className="decision__number">0{index + 1}</p>
                <div>
                  <h3>{decision.title}</h3>
                  <p>{decision.rationale}</p>
                </div>
                <div className="tradeoff">
                  <p className="label">Tradeoff</p>
                  <p>{decision.tradeoff}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="evidence" className="case-section evidence-section" aria-labelledby="evidence-title">
          <p className="eyebrow">{chapter(evidenceChapter, "Evidence")}</p>
          <h2 id="evidence-title">What the record supports—and how far it goes.</h2>
          <ul className="evidence-list">
            {study.evidence.map((item) => (
              <li key={`${item.value}-${item.label}`}>
                <p className="evidence-value">{item.value}</p>
                <h3>{item.label}</h3>
                <p>{item.qualifier}</p>
                <ExternalLink
                  href={item.href}
                  className="text-link"
                  label={`Open evidence for ${item.label} in a new tab`}
                >
                  Inspect evidence
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="operations"
          className="case-section split-section"
          aria-labelledby="reliability-title"
          data-reliability-artifact={reliabilityArtifact.id}
          data-recovery-artifact={recoveryArtifact.id}
        >
          <div>
            <p className="eyebrow">{chapter(operationsChapter, "Reliability & security")}</p>
            <h2 id="reliability-title">{operations.reliability.heading}</h2>
            <p>{operations.reliability.copy}</p>
            <ExternalLink
              href={reliabilityArtifact.href}
              className="text-link"
              label={`Open ${reliabilityArtifact.title} in a new tab`}
            >
              {reliabilityArtifact.title}
            </ExternalLink>
          </div>
          <div>
            <h3>{operations.recovery.heading}</h3>
            <p>{operations.recovery.copy}</p>
            <ExternalLink
              href={recoveryArtifact.href}
              className="text-link"
              label={`Open ${recoveryArtifact.title} in a new tab`}
            >
              {recoveryArtifact.title}
            </ExternalLink>
          </div>
        </section>

        <section className="case-section split-section" aria-labelledby="limits-title">
          <div>
            <p className="eyebrow">{chapter(limitsChapter, "Limits")}</p>
            <h2 id="limits-title">Known limits</h2>
            <ul className="prose-list">
              {study.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Path to sustained operation</h3>
            <ol className="numbered-list">
              {study.productionPath.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="case-section artifact-section" aria-labelledby="artifacts-title">
          <p className="eyebrow">{chapter(artifactsChapter, "Artifact index")}</p>
          <h2 id="artifacts-title">Follow the work into the repository.</h2>
          <ul className="artifact-list">
            {study.artifacts.map((artifact) => (
              <li key={artifact.id} data-artifact-id={artifact.id}>
                <span className="artifact-kind">{artifact.kind}</span>
                <ExternalLink
                  href={artifact.href}
                  label={`Open ${study.title}: ${artifact.title} in a new tab`}
                  dataArtifactLink={artifact.id}
                >
                  <span>{artifact.title}</span>
                </ExternalLink>
              </li>
            ))}
          </ul>
          <div className="technology-index" aria-label="Technologies used">
            {study.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </section>

        <nav className="next-case" aria-label="Next case study">
          <p className="eyebrow">Next project</p>
          <a href={`/case-studies/${nextStudy.slug}`}>
            <span>{nextStudy.title}</span>
            <span aria-hidden="true">→</span>
          </a>
        </nav>
      </article>
    </SiteFrame>
  );
}
