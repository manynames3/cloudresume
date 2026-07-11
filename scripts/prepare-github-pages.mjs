import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const githubPagesBasePath = "/cloudresume";
export const githubPagesOrigin = `https://manynames3.github.io${githubPagesBasePath}`;

const cloudflareOrigin = "https://cloudresumev3.pages.dev";

export function transformHtmlForGitHubPages(html) {
  return html
    .replaceAll(cloudflareOrigin, githubPagesOrigin)
    .replace(/\s*<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(
      /\s*<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*\/?\s*>/gi,
      "",
    )
    .replace(/\sdata-(?:rsc-css-href|precedence)=["'][^"']*["']/gi, "")
    .replace(
      /(\s)(href|src)=(["'])\/(?!\/)/gi,
      (_match, whitespace, attribute, quote) =>
        `${whitespace}${attribute}=${quote}${githubPagesBasePath}/`,
    );
}

export function transformCssForGitHubPages(css) {
  return css.replaceAll("url(/", `url(${githubPagesBasePath}/`);
}

async function builtWorker(projectRoot) {
  const entry = pathToFileURL(join(projectRoot, "dist", "server", "index.js"));
  entry.searchParams.set("github-pages", `${process.pid}-${Date.now()}`);
  return import(entry.href).then(({ default: worker }) => worker);
}

async function render(worker, pathname, accept) {
  return worker.fetch(
    new Request(`https://portfolio.test${pathname}`, {
      headers: {
        accept,
        host: "portfolio.test",
        "x-forwarded-host": "portfolio.test",
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

async function writeRoute(worker, outputDir, pathname, relativeOutput, expectedStatus = 200) {
  const response = await render(worker, pathname, "text/html");
  if (response.status !== expectedStatus) {
    throw new Error(`${pathname} rendered ${response.status}; expected ${expectedStatus}`);
  }

  const outputFile = join(outputDir, relativeOutput);
  await mkdir(join(outputFile, ".."), { recursive: true });
  await writeFile(outputFile, transformHtmlForGitHubPages(await response.text()));
}

export async function prepareGitHubPages({ projectRoot, outputDir }) {
  const clientDir = join(projectRoot, "dist", "client");
  const worker = await builtWorker(projectRoot);

  await rm(outputDir, { recursive: true, force: true });
  await cp(clientDir, outputDir, { recursive: true });
  await Promise.all([
    rm(join(outputDir, ".assetsignore"), { force: true }),
    rm(join(outputDir, ".vite"), { recursive: true, force: true }),
    rm(join(outputDir, "_headers"), { force: true }),
  ]);

  await writeRoute(worker, outputDir, "/", "index.html");
  await writeRoute(
    worker,
    outputDir,
    "/case-studies/inspectiq",
    "case-studies/inspectiq/index.html",
  );
  await writeRoute(
    worker,
    outputDir,
    "/case-studies/terragate",
    "case-studies/terragate/index.html",
  );
  await writeRoute(
    worker,
    outputDir,
    "/case-studies/clearpath",
    "case-studies/clearpath/index.html",
  );
  await writeRoute(
    worker,
    outputDir,
    "/case-studies/not-a-project",
    "404.html",
    404,
  );

  for (const [pathname, filename, accept] of [
    ["/robots.txt", "robots.txt", "text/plain"],
    ["/sitemap.xml", "sitemap.xml", "application/xml"],
  ]) {
    const response = await render(worker, pathname, accept);
    if (response.status !== 200) {
      throw new Error(`${pathname} rendered ${response.status}; expected 200`);
    }
    await writeFile(
      join(outputDir, filename),
      (await response.text()).replaceAll(cloudflareOrigin, githubPagesOrigin),
    );
  }

  const assetsDir = join(outputDir, "assets");
  for (const filename of await readdir(assetsDir)) {
    if (filename.endsWith(".js")) {
      await rm(join(assetsDir, filename));
      continue;
    }
    if (!filename.endsWith(".css")) continue;
    const cssFile = join(assetsDir, filename);
    await writeFile(cssFile, transformCssForGitHubPages(await readFile(cssFile, "utf8")));
  }

  await writeFile(join(outputDir, ".nojekyll"), "");
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;

if (invokedPath === import.meta.url) {
  const projectRoot = fileURLToPath(new URL("../", import.meta.url));
  await prepareGitHubPages({
    projectRoot,
    outputDir: join(projectRoot, "dist", "github-pages"),
  });
}
