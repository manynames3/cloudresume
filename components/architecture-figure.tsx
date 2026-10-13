import type { Artifact, CaseStudySlug } from "@/content/case-studies";
import { architectureGuides } from "@/content/architecture-guides";
import { ExternalLink } from "./site-frame";

export function ArchitectureFigure({ slug, title, artifact, preview = false }: {
  slug: CaseStudySlug;
  title: string;
  artifact: Artifact & { image: NonNullable<Artifact["image"]> };
  preview?: boolean;
}) {
  const guide = architectureGuides[slug];
  const viewerId = `architecture-view-${slug}`;
  return (
    <figure className={preview ? "project-entry__architecture" : "architecture-figure"} data-architecture-preview={preview ? slug : undefined}>
      <div className="architecture-toolbar">
        <p className="subsection-label">System architecture <span aria-hidden="true">/</span> {title}</p>
        <a href={artifact.image.src} target="_blank" rel="noreferrer" className="text-link" data-diagram-open={viewerId}>
          Inspect diagram <span aria-hidden="true">↗</span>
        </a>
      </div>
      <a className="architecture-preview__image" href={artifact.image.src} target="_blank" rel="noreferrer" data-diagram-open={viewerId} aria-label={`Inspect the ${title} architecture diagram`}>
        <img src={artifact.image.src} alt={artifact.image.alt} width={artifact.image.width} height={artifact.image.height} loading="lazy" decoding="async" />
        <span className="registration" aria-hidden="true">
          <span className="registration__corner registration__corner--tl" />
          <span className="registration__corner registration__corner--tr" />
          <span className="registration__corner registration__corner--br" />
          <span className="registration__corner registration__corner--bl" />
          <span className="registration__tick registration__tick--x" />
          <span className="registration__tick registration__tick--y" />
        </span>
      </a>
      <figcaption className="architecture-preview__meta">
        <p>{guide.caption}</p>
        <dl className="architecture-guide" aria-label={`How to read the ${title} architecture`}>
          {guide.points.map((point, index) => (
            <div key={point.label}>
              <dt><span aria-hidden="true">0{index + 1} / </span>{point.label}</dt>
              <dd><strong>{point.title}</strong><span>{point.copy}</span></dd>
            </div>
          ))}
        </dl>
        <div className="architecture-preview__links">
          <ExternalLink href={artifact.href} className="caption-link" dataArtifactLink={preview ? artifact.id : undefined}>Architecture source</ExternalLink>
          <ExternalLink href={artifact.image.src} className="architecture-preview__full-size" label={`View the full-size ${title} architecture diagram in a new tab`}>View full-size architecture</ExternalLink>
        </div>
      </figcaption>
      <dialog id={viewerId} className="architecture-viewer" aria-modal="true" aria-labelledby={`${viewerId}-title`} aria-describedby={`${viewerId}-instructions`}>
        <div className="architecture-viewer__header">
          <div><p className="eyebrow">System review / {title}</p><h2 id={`${viewerId}-title`}>Inspect the architecture.</h2></div>
          <form method="dialog"><button className="viewer-close" aria-label="Close architecture viewer">Close <span aria-hidden="true">×</span></button></form>
        </div>
        <div className="architecture-viewer__tools">
          <p id={`${viewerId}-instructions`}>Zoom for service labels. Scroll or swipe to explore the diagram.</p>
          <div className="viewer-zoom" aria-label="Diagram zoom controls">
            <button type="button" data-diagram-zoom="out" aria-label="Zoom out">−</button>
            <button type="button" data-diagram-zoom="fit">Fit</button>
            <button type="button" data-diagram-zoom="in" aria-label="Zoom in">+</button>
          </div>
        </div>
        <div className="architecture-viewer__viewport" tabIndex={0} role="region" aria-label={`${title} diagram; scroll to explore`}>
          <img src={artifact.image.src} alt={artifact.image.alt} width={artifact.image.width} height={artifact.image.height} loading="lazy" decoding="async" />
        </div>
        <div className="architecture-viewer__footer"><span>{guide.caption}</span><ExternalLink href={artifact.image.src}>Open original image</ExternalLink></div>
      </dialog>
    </figure>
  );
}
