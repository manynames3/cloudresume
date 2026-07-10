import { caseStudies, caseStudySlugs } from "@/content/case-studies";
import {
  credentials,
  education,
  experience,
  principles,
  profile,
  supportingProjects,
} from "@/content/profile";
import { homeStructuredData } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { ExternalLink, SiteFrame } from "@/components/site-frame";
import { absoluteUrl } from "@/lib/site-url";

const lifecycle = {
  inspectiq: "Live AWS-backed application · public walkthrough read-only",
  terragate: "Live constrained demo · deterministic checks · external writes mocked",
  clearpath: "Short-lived AWS validation · torn down after validation",
} as const;

function SectionHeading({
  folio,
  title,
  copy,
  titleId,
}: {
  folio: string;
  title: string;
  copy?: string;
  titleId: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{folio}</p>
      <h2 id={titleId}>{title}</h2>
      {copy ? <p className="section-dek">{copy}</p> : null}
    </div>
  );
}

export function HomePage() {
  return (
    <SiteFrame currentPage="work">
      <link rel="canonical" href={absoluteUrl("/")} />
      <JsonLd value={homeStructuredData()} />

      <section className="hero grid" data-section="hero" aria-labelledby="hero-title">
        <p className="eyebrow hero__folio">Independent systems practice / Atlanta</p>
        <div className="hero__heading">
          <h1 id="hero-title">Cloud systems people can operate, inspect, and trust.</h1>
        </div>
        <div className="hero__dek">
          <p>
            I turn customer and operational workflows into reusable AWS systems—designed
            to deploy cleanly, surface failure, recover predictably, and hand off well.
          </p>
          <a className="text-link" href="#work">
            Read the project index <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="work" className="project-index" aria-labelledby="work-title">
        <SectionHeading
          folio="01 / Selected work"
          title="Three systems, three explicit operating boundaries."
          titleId="work-title"
          copy="The index stays qualitative. Open a case for measured evidence, tradeoffs, and the artifacts behind each claim."
        />
        <ol className="project-list">
          {caseStudySlugs.map((slug, index) => {
            const study = caseStudies[slug];
            return (
              <li key={slug}>
                <article className="project-entry grid">
                  <p className="project-entry__number" aria-hidden="true">
                    0{index + 1}
                  </p>
                  <div className="project-entry__title">
                    <h3>{study.title}</h3>
                    <p className="status-text">{lifecycle[slug]}</p>
                  </div>
                  <div className="project-entry__copy">
                    <p>{study.summary}</p>
                    <a
                      className="text-link"
                      href={`/case-studies/${slug}`}
                      aria-label={`Read the ${study.title} case study`}
                    >
                      Read case study <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="voice-section grid" aria-labelledby="voice-title">
        <div className="voice-section__heading">
          <p className="eyebrow">02 / Voice & customer experience</p>
          <h2 id="voice-title">The workflow starts before the cloud diagram.</h2>
        </div>
        <div className="voice-section__copy prose">
          <p>
            Super Transcriber turns uploads, queued work, completion events, usage records,
            and webhooks into an API-shaped operating path.
          </p>
          <p>
            That technical work is informed by direct CRM and webhook operations, voice-AI
            guardrails, intent capture, transcript summaries, and structured data handoff in
            customer-facing service workflows.
          </p>
          <ExternalLink
            href="https://github.com/manynames3/super-transcriber-api"
            className="text-link"
            label="Review the Super Transcriber repository in a new tab"
          >
            Review Super Transcriber
          </ExternalLink>
        </div>
      </section>

      <section id="profile" className="profile-section grid" aria-labelledby="profile-title">
        <div className="profile-section__portrait">
          <img
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={profile.portrait.width}
            height={profile.portrait.height}
            loading="lazy"
            decoding="async"
          />
          <p className="image-caption">Aiden Rhaa / independent builder and operator</p>
        </div>
        <div className="profile-section__copy prose">
          <p className="eyebrow">03 / Operator profile</p>
          <h2 id="profile-title">Built from the operator’s side of the handoff.</h2>
          <p className="large-copy">
            15+ years of delivery and 200+ client projects taught me to read a system as
            ownership, failure, recovery, communication, and cost—not just implementation.
          </p>
          <p>
            I bring that perspective to AWS, Terraform, containers, serverless workflows,
            CI, observability, security boundaries, and the artifacts that help someone else
            take over responsibly.
          </p>
        </div>
      </section>

      <section className="principles-section" aria-labelledby="principles-title">
        <SectionHeading
          folio="04 / Operating principles"
          title="Deploy. Defend. Observe. Recover. Hand Off."
          titleId="principles-title"
          copy="Each principle points to an artifact, because an operating claim should be inspectable."
        />
        <ol className="principles-list">
          {principles.map((principle, index) => (
            <li key={principle.title} className="principle grid">
              <p className="principle__number">0{index + 1}</p>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
              <ExternalLink
                href={principle.href}
                className="text-link"
                label={`${principle.linkLabel} in a new tab`}
              >
                {principle.linkLabel}
              </ExternalLink>
            </li>
          ))}
        </ol>
      </section>

      <section className="supporting-section" aria-labelledby="supporting-title">
        <SectionHeading
          folio="05 / Supporting index"
          title="More systems, kept in their proper register."
          titleId="supporting-title"
        />
        <ul className="supporting-list">
          {supportingProjects.map((project) => (
            <li key={project.title} className="supporting-entry grid">
              <div>
                <h3>{project.title}</h3>
                <p className="status-text">{project.category}</p>
              </div>
              <p>{project.copy}</p>
              <ExternalLink
                href={project.href}
                className="text-link"
                label={`Review the ${project.title} repository in a new tab`}
              >
                Repository
              </ExternalLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="history-section grid" aria-labelledby="experience-title">
        <div className="history-section__experience">
          <p className="eyebrow">06 / Experience</p>
          <h2 id="experience-title">Professional experience</h2>
          <ol className="history-list">
            {experience.map((item) => (
              <li key={`${item.role}-${item.organization}`}>
                <h3>{item.role}</h3>
                <p className="history-meta">{item.organization}</p>
                <p className="history-meta">
                  {item.period} / {item.location}
                </p>
                <p>{item.summary}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="history-section__education" aria-labelledby="education-title">
          <p className="eyebrow">Credentials & education</p>
          <h2 id="education-title">Cloud credential history</h2>
          <ol className="credential-list">
            {credentials.map((credential, index) => (
              <li key={`${credential.issuer}-${credential.title}`}>
                <p className="credential-index" aria-hidden="true">
                  0{index + 1}
                </p>
                <div>
                  <p className="credential-issuer">{credential.issuer}</p>
                  <h3>{credential.title}</h3>
                </div>
              </li>
            ))}
          </ol>
          <div className="education-block">
            <p className="subsection-label">Education</p>
            <ul className="education-list">
              {education.map((item) => (
                <li key={item.institution}>
                  <h3>{item.institution}</h3>
                  <p>{item.study}</p>
                  <p className="history-meta">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section id="contact" className="contact-section grid" aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">07 / Contact</p>
          <h2 id="contact-title">Need a system the next person can actually operate?</h2>
        </div>
        <div className="contact-section__links">
          <a href={`mailto:${profile.email}`}>Email Aiden Rhaa</a>
          <ExternalLink
            href={profile.linkedin}
            label="Open Aiden Rhaa on LinkedIn in a new tab"
          >
            LinkedIn
          </ExternalLink>
          <ExternalLink
            href={profile.github}
            label="Open Aiden Rhaa on GitHub in a new tab"
          >
            GitHub
          </ExternalLink>
        </div>
      </section>
    </SiteFrame>
  );
}
