import { execFile } from "node:child_process";
import { access, cp, mkdir, rm } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const execFileAsync = promisify(execFile);

export async function preparePagesBundle({ clientDir, workerBundleFile, outputDir }) {
  await rm(outputDir, { recursive: true, force: true });
  await cp(clientDir, outputDir, { recursive: true });
  await cp(workerBundleFile, join(outputDir, "_worker.js"));
  await access(join(outputDir, "_worker.js"));
  await access(join(outputDir, "_headers"));
}

export async function bundleWorker({ esbuildPath, entryFile, outputFile }) {
  await mkdir(dirname(outputFile), { recursive: true });
  await execFileAsync(
    esbuildPath,
    [
      entryFile,
      "--bundle",
      "--format=esm",
      "--platform=browser",
      "--conditions=workerd,worker,browser",
      "--external:node:*",
      `--outfile=${outputFile}`,
      "--minify",
    ],
    { maxBuffer: 10 * 1024 * 1024 },
  );
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;

if (invokedPath === import.meta.url) {
  const projectRoot = fileURLToPath(new URL("../", import.meta.url));
  const workerBundleDir = join(projectRoot, "dist", ".pages-worker");
  const workerBundleFile = join(workerBundleDir, "_worker.js");
  await rm(workerBundleDir, { recursive: true, force: true });
  await bundleWorker({
    esbuildPath: join(projectRoot, "node_modules", ".bin", "esbuild"),
    entryFile: join(projectRoot, "scripts", "pages-worker-entry.mjs"),
    outputFile: workerBundleFile,
  });
  await preparePagesBundle({
    clientDir: join(projectRoot, "dist", "client"),
    workerBundleFile,
    outputDir: join(projectRoot, "dist", "pages"),
  });
}
