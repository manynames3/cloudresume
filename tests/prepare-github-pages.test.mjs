import assert from "node:assert/strict";
import test from "node:test";
import {
  githubPagesBasePath,
  githubPagesOrigin,
  transformCssForGitHubPages,
  transformHtmlForGitHubPages,
} from "../scripts/prepare-github-pages.mjs";

test("rewrites the static portfolio for the GitHub Pages project path", () => {
  const html = `<!doctype html>
    <link rel="stylesheet" href="/assets/site.css" data-rsc-css-href="/assets/site.css" data-precedence="vite">
    <link rel="modulepreload" href="/assets/site.js">
    <link rel="canonical" href="https://cloudresumev3.pages.dev/case-studies/inspectiq">
    <a href="/#work">Work</a>
    <a href="/case-studies/inspectiq">InspectIQ</a>
    <a href="https://github.com/manynames3/inspectiq">Source</a>
    <img src="/case-studies/inspectiq-architecture.webp">
    <script type="module" src="/assets/site.js"></script>
    <script>window.__data = { href: "/case-studies/inspectiq" };</script>`;

  const transformed = transformHtmlForGitHubPages(html);

  assert.equal(githubPagesBasePath, "/cloudresume");
  assert.equal(githubPagesOrigin, "https://manynames3.github.io/cloudresume");
  assert.match(transformed, /href="\/cloudresume\/assets\/site\.css"/);
  assert.match(transformed, /href="https:\/\/manynames3\.github\.io\/cloudresume\/case-studies\/inspectiq"/);
  assert.match(transformed, /href="\/cloudresume\/#work"/);
  assert.match(transformed, /href="\/cloudresume\/case-studies\/inspectiq"/);
  assert.match(transformed, /src="\/cloudresume\/case-studies\/inspectiq-architecture\.webp"/);
  assert.match(transformed, /href="https:\/\/github\.com\/manynames3\/inspectiq"/);
  assert.doesNotMatch(transformed, /<script\b/i);
  assert.doesNotMatch(transformed, /rel="modulepreload"/i);
  assert.doesNotMatch(transformed, /data-rsc-css-href|data-precedence/i);
});

test("keeps only the exact optional motion script and rewrites its path", () => {
  const html = `<main>
    <script src="/motion/portfolio-motion.js" defer="" data-portfolio-motion=""></script>
    <script type="module" src="/assets/site.js"></script>
    <script src="/motion/other.js" data-portfolio-motion=""></script>
    <script src="/motion/portfolio-motion.js" defer="" data-portfolio-motion="">window.injected = true;</script>
    <script src="/motion/portfolio-motion.js" defer=""></script>
    <script>window.__data = { href: "/" };</script>
  </main>`;

  const transformed = transformHtmlForGitHubPages(html);

  assert.equal(transformed.match(/<script\b/gi)?.length, 1);
  assert.match(
    transformed,
    /<script src="\/cloudresume\/motion\/portfolio-motion\.js" defer="" data-portfolio-motion=""><\/script>/,
  );
  assert.doesNotMatch(transformed, /assets\/site\.js|other\.js|injected|__data/);
});

test("rewrites root-relative font assets in the generated stylesheet", () => {
  const css = "@font-face{src:url(/fonts/newsreader.woff2)}";
  assert.equal(
    transformCssForGitHubPages(css),
    "@font-face{src:url(/cloudresume/fonts/newsreader.woff2)}",
  );
});
