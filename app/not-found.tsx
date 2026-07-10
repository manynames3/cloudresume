import { SiteFrame } from "@/components/site-frame";

export default function NotFound() {
  return (
    <SiteFrame>
      <section className="not-found" aria-labelledby="not-found-title">
        <p className="eyebrow">404 / Outside the index</p>
        <h1 id="not-found-title">That case study is not in the index.</h1>
        <p>The portfolio keeps a deliberate set of three documented systems.</p>
        <a className="button-link" href="/#work">
          Return to the project index
        </a>
      </section>
    </SiteFrame>
  );
}
