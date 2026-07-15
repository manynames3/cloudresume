import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const canonicalOrigin = "https://cloudresumev3.pages.dev";
const routes = [
  "/",
  "/case-studies/inspectiq",
  "/case-studies/terragate",
  "/case-studies/clearpath",
];
const cases = routes.slice(1);
const expectedTitles = new Map([
  ["/", "Aiden Rhaa — AWS Infrastructure & Platform Engineer"],
  ["/case-studies/inspectiq", "InspectIQ — AWS vehicle inspection platform | Aiden Rhaa"],
  ["/case-studies/terragate", "TerraGate — Safer Terraform review | Aiden Rhaa"],
  ["/case-studies/clearpath", "Clearpath — Recoverable lead operations | Aiden Rhaa"],
]);

let workerPromise;

async function worker() {
  workerPromise ??= import(
    new URL(`../dist/server/index.js?test=${process.pid}-${Date.now()}`, import.meta.url)
      .href
  ).then(({ default: builtWorker }) => builtWorker);
  return workerPromise;
}

async function render(pathname, host = "portfolio.test") {
  const builtWorker = await worker();
  return builtWorker.fetch(
    new Request(`https://${host}${pathname}`, {
      headers: {
        accept: "text/html",
        host,
        "x-forwarded-host": host,
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function htmlFor(pathname, host) {
  const response = await render(pathname, host);
  const html = await response.text();
  return { response, html };
}

function tags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1];
}

function canonical(html) {
  const tag = tags(html, "link").find((candidate) => attr(candidate, "rel") === "canonical");
  return tag ? attr(tag, "href") : undefined;
}

function title(html) {
  const value = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  return value?.replaceAll("&amp;", "&");
}

function section(html, selector) {
  const pattern = new RegExp(
    `<section\\b(?=[^>]*${selector})[^>]*>[\\s\\S]*?<\\/section>`,
    "i",
  );
  return html.match(pattern)?.[0] ?? "";
}

function element(html, tagName, selector) {
  const pattern = new RegExp(
    `<${tagName}\\b(?=[^>]*${selector})[^>]*>[\\s\\S]*?<\\/${tagName}>`,
    "i",
  );
  return html.match(pattern)?.[0] ?? "";
}

function jsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
}

function graphTypes(documents) {
  return documents
    .flatMap((document) => document["@graph"] ?? [document])
    .map((entry) => entry["@type"])
    .sort();
}

function visibleText(html) {
  return html
    .replace(/<head\b[\s\S]*?<\/head>/gi, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/<!--.*?-->/g, "")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function source(pathname) {
  const file = new URL(pathname, projectRoot);
  await assert.doesNotReject(access(file), `expected ${pathname} to exist`);
  return readFile(file, "utf8");
}

test("renders the four portfolio routes and a branded unknown-case 404", async () => {
  for (const route of routes) {
    const { response, html } = await htmlFor(route);
    assert.equal(response.status, 200, `${route} should render`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(html, /Aiden Rhaa/);
  }

  const { response, html } = await htmlFor("/case-studies/not-a-project");
  assert.equal(response.status, 404);
  assert.match(html, /That case study is not in the index\./);
  assert.match(html, /Return to the project index/);
});

test("defines exactly three typed case studies with valid artifact links", async () => {
  const caseSource = await source("content/case-studies.ts");
  assert.match(
    caseSource,
    /export const caseStudySlugs\s*=\s*\[\s*"inspectiq",\s*"terragate",\s*"clearpath",?\s*\]\s*as const/,
  );
  assert.equal((caseSource.match(/satisfies CaseStudy/g) ?? []).length, 3);
  for (const record of ["inspectiq", "terragate", "clearpath"]) {
    assert.match(caseSource, new RegExp(`export const ${record}\\s*=`));
  }

  const artifactIds = new Set();
  for (const route of cases) {
    const { html } = await htmlFor(route);
    const artifactTags = tags(html, "li").filter((tag) => attr(tag, "data-artifact-id"));
    assert.ok(artifactTags.length >= 4, `${route} should expose its artifact index`);

    for (const artifactTag of artifactTags) {
      const id = attr(artifactTag, "data-artifact-id");
      assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(!artifactIds.has(id), `artifact id ${id} should be unique`);
      artifactIds.add(id);
    }

    const artifactLinks = tags(html, "a").filter((tag) => attr(tag, "data-artifact-link"));
    assert.equal(artifactLinks.length, artifactTags.length);
    assert.match(html, /<span class="artifact-kind">ci<\/span>/);
    for (const link of artifactLinks) {
      assert.doesNotThrow(() => {
        const url = new URL(attr(link, "href"));
        assert.equal(url.protocol, "https:");
      });
    }
  }
});

test("renders each demo boundary without widening its claims", async () => {
  const inspectiq = (await htmlFor("/case-studies/inspectiq")).html;
  const inspectiqBoundary = section(inspectiq, 'id=["\']demo-boundary["\']');
  assert.match(inspectiqBoundary, /data-demo-kind="live-readonly"/);
  assert.match(inspectiqBoundary, /data-demo-infrastructure="AWS-backed"/);
  assert.match(inspectiqBoundary, /data-demo-authorization="app-level JWT\/RBAC"/);
  assert.match(inspectiqBoundary, /data-demo-writes="read-only"/);
  assert.match(inspectiqBoundary, /Public walkthrough is read-only/);
  assert.match(inspectiqBoundary, /Cognito JWT\/RBAC/);
  assert.match(inspectiqBoundary, /data-demo-href="https:\/\/inspectiq\.pages\.dev"/);
  assert.match(inspectiq, /does not prove API Gateway authorizer enforcement/);
  assert.match(inspectiq, /do not establish Bedrock model accuracy/);
  assert.match(inspectiq, /Current architecture, with every major boundary visible/);
  assert.doesNotMatch(inspectiq, /its &quot;JWT authorizer&quot; label/);

  const terragate = (await htmlFor("/case-studies/terragate")).html;
  const terragateBoundary = section(terragate, 'id=["\']demo-boundary["\']');
  assert.match(terragateBoundary, /data-demo-kind="live-constrained"/);
  assert.match(terragateBoundary, /data-demo-checks="deterministic Python"/);
  assert.match(terragateBoundary, /data-demo-writes="mocked"/);
  assert.match(terragateBoundary, /Terraform execution is disabled/);
  assert.match(terragateBoundary, /data-demo-href="https:\/\/terragate\.hangi87\.workers\.dev"/);

  const clearpath = (await htmlFor("/case-studies/clearpath")).html;
  const clearpathBoundary = section(clearpath, 'id=["\']demo-boundary["\']');
  assert.match(clearpathBoundary, /data-demo-kind="validated-and-torn-down"/);
  assert.match(clearpathBoundary, /data-demo-lifecycle="torn-down after validation"/);
  assert.match(clearpathBoundary, /No live demo/);
  assert.doesNotMatch(clearpathBoundary, /data-demo-href=/);
  assert.match(clearpath, /0 failed, 44 skipped/);
  assert.match(clearpath, /GHL-compatible intake is not a verified GHL integration/);
  assert.match(clearpath, /cost model is an estimate, not billing evidence/i);
  assert.match(clearpath, /point-in-time deployment evidence/i);
});

test("frames InspectIQ around the customer problem before its engineering boundaries", async () => {
  const inspectiq = (await htmlFor("/case-studies/inspectiq")).html;
  const frame = section(inspectiq, 'aria-labelledby=["\']problem-title["\']');

  assert.match(inspectiq, /Turn vehicle evidence into condition reports people can trust/);
  assert.match(frame, /01 \/ Product/);
  assert.match(frame, /What InspectIQ is for/);
  assert.match(frame, /wholesale, auction, fleet, and offsite teams/i);
  assert.match(frame, /retakes, slower reports, recon uncertainty, and avoidable disputes/i);
  assert.match(frame, /What the system must protect/);
  assert.match(frame, /reviewer remains accountable for every buyer-visible fact/i);
  assert.doesNotMatch(frame, /Authorization claims must remain at the application layer/);
});

test("presents the complete InspectIQ product, system, proof, and operating story", async () => {
  const inspectiq = (await htmlFor("/case-studies/inspectiq")).html;
  const text = visibleText(inspectiq);
  const workflow = section(inspectiq, 'aria-labelledby=["\']workflow-title["\']');
  const visuals = section(inspectiq, 'aria-labelledby=["\']visuals-title["\']');
  const evidence = section(inspectiq, 'id=["\']evidence["\']');

  for (const step of ["Capture", "Protect", "Analyze", "Decide", "Release", "Operate"]) {
    assert.match(workflow, new RegExp(`>${step}<`));
  }
  assert.match(workflow, /private S3/);
  assert.match(workflow, /Reviewer compares each suggestion/);

  const productVisuals = tags(visuals, "figure").filter((tag) => attr(tag, "data-product-visual"));
  assert.equal(productVisuals.length, 3);
  for (const id of ["inspectiq-mobile-capture", "inspectiq-review-queue", "inspectiq-platform-health"]) {
    assert.match(visuals, new RegExp(`data-product-visual=["']${id}["']`));
  }
  for (const src of [
    "/case-studies/inspectiq-mobile-capture.webp",
    "/case-studies/inspectiq-review-queue.webp",
    "/case-studies/inspectiq-platform-health.webp",
  ]) {
    assert.match(visuals, new RegExp(`src=["']${src.replaceAll("/", "\\/")}["']`));
  }
  assert.equal(tags(visuals, "img").filter((tag) => attr(tag, "loading") === "lazy").length, 3);

  for (const decision of [
    "Keep AI advisory and human decisions authoritative",
    "Keep business truth in Postgres and operations state disposable",
    "Move image analysis behind a durable queue",
  ]) {
    assert.match(text, new RegExp(decision));
  }

  for (const proof of ["No fallback", "108 / 12", "3 roles", "Live path"]) {
    assert.match(visibleText(evidence), new RegExp(proof.replace("/", "\\/")));
  }
  assert.match(text, /No model finding becomes a buyer-visible fact without human approval/);
  assert.match(text, /one marketplace result does not establish Bedrock precision or recall/i);
  assert.match(text, /Expo \/ React Native/);
  assert.match(text, /Neon Postgres/);
  assert.match(text, /GitHub Actions/);

  for (const folio of [
    "01 / Product",
    "02 / Workflow",
    "03 / System",
    "04 / Product in use",
    "05 / Decisions",
    "06 / Evidence",
    "07 / Reliability & security",
    "08 / Limits",
    "09 / Artifact index",
  ]) {
    assert.match(text, new RegExp(folio.replace("/", "\\/")));
  }
});

test("keeps quantitative Clearpath evidence on the detail route and out of the hero", async () => {
  const home = (await htmlFor("/")).html;
  const hero = section(home, 'data-section=["\']hero["\']');
  assert.ok(hero, "homepage hero should be identifiable");
  for (const value of ["93", "36", "339", "200+"]) {
    assert.doesNotMatch(hero, new RegExp(value.replace("+", "\\+")));
  }

  const clearpath = (await htmlFor("/case-studies/clearpath")).html;
  const evidence = section(clearpath, 'id=["\']evidence["\']');
  const evidenceText = visibleText(evidence);
  const homeText = visibleText(home);
  for (const value of ["93", "36", "339", "0 failed"]) {
    assert.match(evidenceText, new RegExp(value));
    assert.doesNotMatch(homeText, new RegExp(value));
  }
});

test("provides landmarks, one H1, request-aware metadata, and intended JSON-LD", async () => {
  const seenTitles = new Set();
  for (const route of routes) {
    const { response, html } = await htmlFor(route, "folio.example");
    assert.equal(tags(html, "h1").length, 1, `${route} should have one H1`);
    assert.equal(tags(html, "header").length, 1, `${route} should have a header`);
    assert.ok(tags(html, "nav").length >= 1, `${route} should have a nav`);
    assert.equal(tags(html, "main").length, 1, `${route} should have a main`);
    assert.equal(tags(html, "footer").length, 1, `${route} should have a footer`);
    assert.match(html, /href="#main-content"/);
    assert.match(html, /<main\b[^>]*id="main-content"/);
    assert.match(html, /aria-current="page"/);
    for (const match of html.matchAll(/\baria-labelledby="([^"]+)"/g)) {
      for (const id of match[1].split(/\s+/)) {
        assert.match(html, new RegExp(`\\bid="${id}"`), `${route} is missing #${id}`);
      }
    }

    const pageTitle = title(html);
    assert.equal(pageTitle, expectedTitles.get(route));
    assert.ok(!seenTitles.has(pageTitle), `${route} title should be unique`);
    seenTitles.add(pageTitle);
    const metaTags = tags(html, "meta");
    const openGraph = (property) => metaTags.find((tag) => attr(tag, "property") === property);
    const twitter = (name) => metaTags.find((tag) => attr(tag, "name") === name);
    assert.equal(attr(openGraph("og:title"), "content")?.replaceAll("&amp;", "&"), pageTitle);
    assert.equal(attr(openGraph("og:image"), "content"), `${canonicalOrigin}/og.png`);
    assert.equal(attr(openGraph("og:image:width"), "content"), "1200");
    assert.equal(attr(openGraph("og:image:height"), "content"), "630");
    assert.equal(attr(twitter("twitter:card"), "content"), "summary_large_image");
    assert.equal(attr(twitter("twitter:image"), "content"), `${canonicalOrigin}/og.png`);
    assert.equal(canonical(html), new URL(route, canonicalOrigin).href);
    assert.doesNotMatch(response.headers.get("cache-control") ?? "", /no-store/i);

    const documents = jsonLd(html);
    assert.ok(documents.length > 0, `${route} should serialize JSON-LD`);
    const expectedTypes = route === "/"
      ? ["ItemList", "Person", "WebSite"]
      : ["BreadcrumbList", "TechArticle"];
    assert.deepEqual(graphTypes(documents), expectedTypes);

    if (route !== "/") {
      assert.match(html, /<nav\b[^>]*aria-label="Next case study"/);
      const article = documents
        .flatMap((document) => document["@graph"] ?? [document])
        .find((entry) => entry["@type"] === "TechArticle");
      assert.equal(article.author["@id"], `${canonicalOrigin}/#aiden-rhaa`);
      assert.equal(article.isPartOf["@id"], `${canonicalOrigin}/#website`);
    }
  }
});

test("renders exact homepage positioning and résumé-derived profile content", async () => {
  const home = visibleText((await htmlFor("/")).html);
  const required = [
    "AWS Infrastructure & Platform Engineer",
    "Cloud systems people can operate, inspect, and trust.",
    "I design and build AWS infrastructure, delivery pipelines, and platform workflows with Terraform, GitHub Actions, serverless architecture, containers, observability, and explicit recovery paths.",
    "The work starts with real operating needs and ends with systems another team can understand, operate, and own.",
    "Review the cloud systems and decisions behind the work",
    "Independent cloud reference systems",
    "ECS & Serverless",
    "Cloud credential history",
    "Solutions Architect – Associate",
    "Developer – Associate",
    "Terraform Associate",
    "Live AWS-backed application · public walkthrough read-only",
    "Live constrained demo · deterministic checks · external writes mocked",
    "Short-lived AWS validation · torn down after validation",
    "AegisDesk",
    "Pulpit V2",
    "Super Transcriber",
    "PhotoScribe AI",
    "DocuFlow OCR",
    "Berklee College of Music",
    "Saint Louis University",
    "production-shaped platform for wholesale, auction, fleet, and offsite inspection teams",
  ];
  for (const value of required) assert.match(home, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  assert.doesNotMatch(home, /Previously earned credentials, not currently active/i);
  assert.ok(home.indexOf("Solutions Architect – Associate") < home.indexOf("Berklee College of Music"));
  assert.doesNotMatch(home, /document-inspection|search visibility/i);
});

test("keeps customer-workflow context subordinate to the operator profile", async () => {
  const { html } = await htmlFor("/");
  const home = visibleText(html);

  assert.doesNotMatch(html, /voice-section/);
  assert.doesNotMatch(home, /Voice & customer experience/);
  assert.match(home, /Operational context/);
  assert.match(home, /Infrastructure shaped by the workflow it serves\./);
  assert.match(
    home,
    /Direct CRM operations, webhooks, intent capture, transcript summaries, and structured handoff inform how I design integrations and failure paths\./,
  );
  assert.match(html, /href="#supporting"/);
  assert.equal((home.match(/Super Transcriber/g) ?? []).length, 1);

  for (const folio of [
    "01 / Independent cloud reference systems",
    "02 / Operator profile",
    "03 / Operating principles",
    "04 / Supporting index",
    "05 / Experience",
    "06 / Contact",
  ]) {
    assert.match(home, new RegExp(folio.replace("/", "\\/")));
  }
});

test("shows all three flagship architecture diagrams in the homepage project index", async () => {
  const { html } = await htmlFor("/");
  const previews = tags(html, "figure").filter((tag) => attr(tag, "data-architecture-preview"));
  const expected = new Map([
    ["inspectiq", ["/case-studies/inspectiq-architecture.webp", "inspectiq-architecture"]],
    ["terragate", ["/case-studies/terragate-architecture.webp", "terragate-architecture"]],
    ["clearpath", ["/case-studies/clearpath-architecture.webp", "clearpath-architecture"]],
  ]);

  assert.equal(previews.length, 3);
  assert.doesNotMatch(section(html, 'data-section=["\']hero["\']'), /data-architecture-preview/);

  for (const [slug, [src, artifactId]] of expected) {
    const preview = element(html, "figure", `data-architecture-preview=["']${slug}["']`);
    assert.notEqual(preview, "", `${slug} architecture preview should render`);
    assert.match(preview, new RegExp(`src=["']${src.replaceAll("/", "\\/")}["']`));
    assert.match(preview, /alt=["'][^"']+["']/);
    assert.match(preview, /width=["']\d+["']/);
    assert.match(preview, /height=["']\d+["']/);
    assert.match(preview, /loading=["']lazy["']/);
    assert.match(preview, new RegExp(`href=["']\\/case-studies\\/${slug}["']`));
    assert.match(preview, new RegExp(`data-artifact-link=["']${artifactId}["']`));
  }
});

test("renders project-specific reliability and recovery analysis", async () => {
  const expected = new Map([
    ["/case-studies/inspectiq", ["inspectiq-security", "inspectiq-runbook"]],
    ["/case-studies/terragate", ["terragate-threat-model", "terragate-runbook"]],
    ["/case-studies/clearpath", ["clearpath-tests", "clearpath-validation"]],
  ]);

  for (const [route, [reliabilityArtifact, recoveryArtifact]] of expected) {
    const html = (await htmlFor(route)).html;
    const operations = section(html, 'id=["\']operations["\']');
    assert.match(operations, new RegExp(`data-reliability-artifact="${reliabilityArtifact}"`));
    assert.match(operations, new RegExp(`data-recovery-artifact="${recoveryArtifact}"`));
  }

  const inspectiq = (await htmlFor("/case-studies/inspectiq")).html;
  assert.match(inspectiq, /low-quality image requests a field retake/);
  assert.match(inspectiq, /DLQ and replay controls/);
  const terragate = (await htmlFor("/case-studies/terragate")).html;
  assert.match(terragate, /worker and execution mode disagree/);
  const clearpath = (await htmlFor("/case-studies/clearpath")).html;
  assert.match(clearpath, /Initial ECS tasks failed health checks/);
});

test("omits forbidden claims and personal phone data from every rendered route", async () => {
  const forbidden = [
    "AWS-certified",
    "currently certified",
    "production-grade",
    "enterprise-ready",
    "OPA/Rego",
    "Hartford",
    "IE07OE",
    "sponsorship",
    "testimonial",
    "employer endorsement",
    "Amazon Connect",
  ];

  for (const route of routes) {
    const { html } = await htmlFor(route);
    for (const phrase of forbidden) {
      assert.doesNotMatch(html, new RegExp(phrase, "i"), `${route} includes ${phrase}`);
    }
    assert.doesNotMatch(html, /(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}/);
    assert.doesNotMatch(html, /tel:|\b\d{10}\b/i);
  }
});

test("resolves internal routes, public assets, sitemap, robots, and favicon", async () => {
  const home = (await htmlFor("/")).html;
  const resumeLinks = tags(home, "a").filter(
    (tag) => attr(tag, "href") === "/Aiden_Rhaa_Cloud_Platform_Engineer_Resume.pdf",
  );
  assert.equal(resumeLinks.length, 1);
  assert.equal(attr(resumeLinks[0], "target"), "_blank");
  assert.equal(attr(resumeLinks[0], "rel"), "noreferrer");

  const internalCaseLinks = tags(home, "a")
    .map((tag) => attr(tag, "href"))
    .filter((href) => href?.startsWith("/case-studies/"));
  assert.deepEqual([...new Set(internalCaseLinks)].sort(), [...cases].sort());
  for (const href of internalCaseLinks) {
    assert.equal((await render(href)).status, 200);
  }

  const publicAssets = [
    "public/favicon.png",
    "public/fonts/newsreader-latin-variable.woff2",
    "public/fonts/OFL.txt",
    "public/case-studies/aiden-rhaa-portrait.webp",
    "public/case-studies/inspectiq-architecture.webp",
    "public/case-studies/inspectiq-mobile-capture.webp",
    "public/case-studies/inspectiq-review-queue.webp",
    "public/case-studies/inspectiq-platform-health.webp",
    "public/case-studies/terragate-architecture.webp",
    "public/case-studies/clearpath-architecture.webp",
    "public/Aiden_Rhaa_Cloud_Platform_Engineer_Resume.pdf",
    "public/og.png",
  ];
  for (const asset of publicAssets) {
    await assert.doesNotReject(access(new URL(asset, projectRoot)), `${asset} should exist`);
  }
  const socialImage = await readFile(new URL("public/og.png", projectRoot));
  assert.equal(socialImage.subarray(1, 4).toString(), "PNG");
  assert.equal(socialImage.readUInt32BE(16), 1200);
  assert.equal(socialImage.readUInt32BE(20), 630);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  const sitemapPaths = [...sitemapText.matchAll(/<loc>https?:\/\/[^<]+?(\/case-studies\/[^<]+|\/)<\/loc>/g)]
    .map((match) => match[1]);
  assert.deepEqual(sitemapPaths, routes);

  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(
    await robots.text(),
    /Sitemap: https:\/\/cloudresumev3\.pages\.dev\/sitemap\.xml/,
  );
  assert.match(
    home,
    /<link\b[^>]*rel="icon"[^>]*href="https:\/\/cloudresumev3\.pages\.dev\/favicon\.png"/i,
  );
});

test("removes the starter and keeps the site static-first and progressively enhanced", async () => {
  const [
    caseRoute,
    homeRoute,
    caseSource,
    profileSource,
    siteFrameSource,
    homeComponent,
    caseComponent,
    siteUrlSource,
    css,
    packageJson,
  ] = await Promise.all([
    source("app/case-studies/[slug]/page.tsx"),
    source("app/page.tsx"),
    source("content/case-studies.ts"),
    source("content/profile.ts"),
    source("components/site-frame.tsx"),
    source("components/home-page.tsx"),
    source("components/case-study-page.tsx"),
    source("lib/site-url.ts"),
    source("app/globals.css"),
    source("package.json"),
  ]);

  assert.match(caseRoute, /generateStaticParams/);
  assert.match(caseRoute, /notFound\(\)/);
  assert.match(caseRoute, /export const dynamic\s*=\s*"force-static"/);
  assert.match(homeRoute, /export const dynamic\s*=\s*"force-static"/);
  assert.doesNotMatch(caseRoute, /InspectIQ|TerraGate|Clearpath/);
  assert.doesNotMatch(homeRoute, /Cloud systems people can operate/);
  assert.match(caseSource, /export interface CaseStudy/);
  assert.doesNotMatch(`${caseRoute}\n${homeRoute}\n${caseSource}`, /["']use client["']/);
  assert.doesNotMatch(
    `${siteFrameSource}\n${homeComponent}\n${caseComponent}`,
    /next\/(?:link|image)|\bunoptimized\b/,
  );
  assert.doesNotMatch(`${caseSource}\n${profileSource}`, /case-studies\/[^"']+\.(?:png|jpe?g)/i);
  assert.match(`${caseSource}\n${profileSource}`, /case-studies\/[^"']+\.webp/i);
  assert.doesNotMatch(siteUrlSource, /next\/headers|requestOrigin/);
  assert.match(siteUrlSource, /https:\/\/cloudresumev3\.pages\.dev/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(packageJson, /"codex-preview"/);
  assert.match(css, /@font-face/);
  assert.match(css, /font-display:\s*swap/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.doesNotMatch(css, /gradient\(/i);

  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
  const publicFiles = await readdir(new URL("public/", projectRoot));
  assert.ok(!publicFiles.includes("favicon.svg"));
  assert.ok(!publicFiles.includes("file.svg"));
  assert.ok(!publicFiles.includes("globe.svg"));
  assert.ok(!publicFiles.includes("window.svg"));
});
