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
import { ArchitectureFigure } from "@/components/architecture-figure";

const lifecycle = {
  inspectiq: "Live AWS-backed application · session-only public walkthrough",
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
        <p className="eyebrow hero__folio">Product-minded cloud engineering / Atlanta</p>
        <div className="hero__heading">
          <p className="hero__role">AWS Infrastructure &amp; Platform Engineer</p>
          <div className="hero__title">
            <canvas className="hero__plate" aria-hidden="true" />
            <h1 id="hero-title">Cloud systems people can understand, operate, and trust.</h1>
          </div>
          <div className="hero__actions">
            <a className="text-link" href="#work">Explore the work <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero__dek">
          <p>
            I design and build AWS infrastructure, delivery pipelines, and platform
            workflows with Terraform, GitHub Actions, serverless architecture,
            containers, observability, and explicit recovery paths.
          </p>
          <p className="hero__handoff">
            The work starts with real operating needs and ends with systems another team
            can understand, operate, and own.
          </p>
          <ul className="hero__capabilities" aria-label="Core cloud engineering capabilities">
            <li>AWS</li>
            <li>Terraform</li>
            <li>CI/CD</li>
            <li>ECS &amp; Serverless</li>
            <li>DevSecOps</li>
            <li>Observability</li>
          </ul>
        </div>
      </section>

      <section id="work" className="project-index" aria-labelledby="work-title">
        <SectionHeading
          folio="01 / SELECTED CLOUD SYSTEMS"
          title="Selected AWS systems."
          titleId="work-title"
          copy="Each case study shows the architecture, key decisions, tradeoffs, and implementation behind the system."
        />
        <ol className="project-list">
          {caseStudySlugs.map((slug, index) => {
            const study = caseStudies[slug];
            const architecture = study.artifacts.find((artifact) => artifact.image);

            if (!architecture?.image) {
              throw new Error(`Missing architecture preview for ${study.slug}`);
            }

            return (
              <li key={slug}>
                <article className="project-entry grid">
                  <p className="project-entry__number" aria-hidden="true">
                    0{index + 1}
                  </p>
                  <div className="project-entry__title">
                    <h3>{study.title}</h3>
                  </div>
                  <div className="project-entry__copy">
                    <p>{study.summary}</p>
                    <p className="status-text">{lifecycle[slug]}</p>
                    <a className="text-link" href={`/case-studies/${slug}`} aria-label={`Explore the case study: ${study.title}`}>Explore the case study <span aria-hidden="true">→</span></a>
                  </div>
                  <ArchitectureFigure slug={slug} title={study.title} artifact={{ ...architecture, image: architecture.image }} preview />
                </article>
              </li>
            );
          })}
        </ol>
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
          <aside className="personal-note" aria-label="Outside work">
            <p className="subsection-label">Outside work</p>
            <p>In my spare time, I enjoy creating games with my children and playing guitar at church.</p>
            <a className="text-link" href="/games/">Explore the games we’ve built</a>
          </aside>
        </div>
        <div className="profile-section__copy prose">
          <p className="eyebrow">02 / Operator profile</p>
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
          <aside className="operational-context" aria-labelledby="operational-context-title">
            <p className="subsection-label">Operational context</p>
            <h3 id="operational-context-title">
              Infrastructure shaped by the workflow it serves.
            </h3>
            <p>
              Direct CRM operations, webhooks, intent capture, transcript summaries, and
              structured handoff inform how I design integrations and failure paths. In the
              supporting systems index, that operating model appears in uploads, queues,
              completion events, usage records, and callbacks.
            </p>
            <a className="text-link" href="#supporting">
              See the supporting systems <span aria-hidden="true">↓</span>
            </a>
          </aside>
        </div>
      </section>

      <section className="principles-section" aria-labelledby="principles-title">
        <SectionHeading
          folio="03 / Operating principles"
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

      <section id="supporting" className="supporting-section" aria-labelledby="supporting-title">
        <SectionHeading
          folio="04 / Supporting index"
          title="Supporting cloud systems."
          titleId="supporting-title"
        />
        <ul className="supporting-list">
          {supportingProjects.map((project) => (
            <li key={project.title} className="supporting-entry grid">
              <div className="supporting-entry__heading">
                <h3>{project.title}</h3>
                <p className="status-text">{project.category}</p>
              </div>
              <div className="supporting-entry__copy">
                <p>{project.preview ?? project.copy}</p>
                {project.scope ? <p className="supporting-scope">{project.scope}</p> : null}
              </div>
              {project.boundary ? (
                <details className="supporting-evidence">
                  <summary>Evidence &amp; boundaries <span aria-hidden="true">+</span></summary>
                  <div className="supporting-evidence__body">
                    <p>{project.copy}</p>
                    <p className="supporting-boundary">{project.boundary}</p>
                    <div className="supporting-entry__links">
                      {(project.links ?? [{ label: "Repository", href: project.href }]).map((link) => (
                        <ExternalLink key={link.href} href={link.href} className="text-link" label={`${project.title}: ${link.label} in a new tab`}>
                          {link.label}
                        </ExternalLink>
                      ))}
                    </div>
                    {project.visual ? (
                      <figure className="supporting-entry__visual">
                        <a href={project.visual.src} target="_blank" rel="noreferrer" aria-label={`View the full-size ${project.title} visual in a new tab`}>
                          <img src={project.visual.src} alt={project.visual.alt} width={project.visual.width} height={project.visual.height} loading="lazy" decoding="async" />
                        </a>
                        <figcaption>{project.visual.caption} <ExternalLink href={project.visual.href} className="caption-link" label={`Review the ${project.title} visual source in a new tab`}>Source record</ExternalLink></figcaption>
                      </figure>
                    ) : null}
                  </div>
                </details>
              ) : (
                <div className="supporting-entry__links"><ExternalLink href={project.href} className="text-link" label={`${project.title}: Repository in a new tab`}>Repository</ExternalLink></div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="history-section grid" aria-labelledby="experience-title">
        <div className="history-section__experience">
          <p className="eyebrow">05 / Experience</p>
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
          <p className="eyebrow">06 / Contact</p>
          <h2 id="contact-title">Let’s talk about your cloud engineering team.</h2>
          <p className="contact-dek">AWS infrastructure, delivery pipelines, platform workflows—and the operating context behind them.</p>
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

      {/* Optional enhancement: the page is complete without it. */}
      <script src="/motion/portfolio-motion.js" defer data-portfolio-motion="" />
      <script src="/presentation/architecture-viewer.js" defer data-portfolio-viewer="" />
    </SiteFrame>
  );
}
