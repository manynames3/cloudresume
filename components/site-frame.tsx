import type { ReactNode } from "react";
import { profile } from "@/content/profile";

export function ExternalLink({
  href,
  children,
  className,
  label,
  dataArtifactLink,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
  dataArtifactLink?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-artifact-link={dataArtifactLink}
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

function Header({ currentPage }: { currentPage?: "work" }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="wordmark" href="/" aria-label="Aiden Rhaa, portfolio home">
          <span>{profile.name}</span>
          <span>{profile.role}</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/#work" aria-current={currentPage === "work" ? "page" : undefined}>
            Work
          </a>
          <a href="/#profile">Profile</a>
          <ExternalLink
            href={profile.resume}
            label="Open Aiden Rhaa résumé PDF in a new tab"
          >
            Résumé
          </ExternalLink>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <span className="folio">AR / 2026</span>
        <span>Cloud systems, operating evidence, and honest boundaries.</span>
      </p>
      <a href="#top">Back to top</a>
    </footer>
  );
}

export function SiteFrame({
  children,
  currentPage,
}: {
  children: ReactNode;
  currentPage?: "work";
}) {
  return (
    <div id="top" className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header currentPage={currentPage} />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
