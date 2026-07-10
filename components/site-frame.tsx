import type { ReactNode } from "react";
import Link from "next/link";
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
        <Link className="wordmark" href="/" aria-label="Aiden Rhaa, portfolio home">
          <span>{profile.name}</span>
          <span>{profile.role}</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#work" aria-current={currentPage === "work" ? "page" : undefined}>
            Work
          </Link>
          <Link href="/#profile">Profile</Link>
          <ExternalLink
            href={profile.resume}
            label="Open Aiden Rhaa résumé PDF in a new tab"
          >
            Résumé
          </ExternalLink>
          <Link href="/#contact">Contact</Link>
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
      <Link href="#top">Back to top</Link>
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
