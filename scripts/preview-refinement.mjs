import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/github-pages/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf" };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname === "/") { res.writeHead(302, { Location: "/cloudresume/" }); return res.end(); }
    let file = resolve(root, "." + pathname.replace(/^\/cloudresume(?=\/|$)/, ""));
    const directory = root.replace(/\/$/, "");
    if (file !== directory && !file.startsWith(directory + sep)) { res.writeHead(403); return res.end(); }
    const info = await stat(file);
    if (info.isDirectory()) file = resolve(file, "index.html");
    const bytes = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(bytes);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(3125, "127.0.0.1", () => console.log("Local review: http://127.0.0.1:3125/cloudresume/"));
