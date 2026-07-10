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
            <p className="eyebrow">01 / Frame</p>
            <h2 id="problem-title">Problem</h2>
            <ul className="prose-list">
              {study.problem.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Constraints</h3>
            <ul className="prose-list">
              {study.constraints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {architecture?.image ? (
          <section className="case-section architecture-section" aria-labelledby="architecture-title">
            <p className="eyebrow">02 / System</p>
            <h2 id="architecture-title">Real architecture, retained as review evidence.</h2>
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
                {architecture.title}. The diagram is reused from the public project record;
                inspect the source for the maintained context. {" "}
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

        <section className="case-section" aria-labelledby="decisions-title">
          <p className="eyebrow">03 / Decisions</p>
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
          <p className="eyebrow">04 / Evidence</p>
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
            <p className="eyebrow">05 / Reliability & security</p>
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
            <p className="eyebrow">06 / Limits</p>
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
          <p className="eyebrow">07 / Artifact index</p>
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
