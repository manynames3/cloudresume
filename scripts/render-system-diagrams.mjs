// Authoring-only asset generator. SHARP_MODULE points to an existing Sharp installation.
// No dependency or external request is added to the portfolio runtime.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const { default: sharp } = await import(process.env.SHARP_MODULE ? pathToFileURL(process.env.SHARP_MODULE).href : "sharp");
const root = fileURLToPath(new URL("../", import.meta.url));
const originals = join(root, "public/case-studies/originals");
const iconDir = join(originals, "service-icons");
await mkdir(iconDir, { recursive: true });
const iconPaths = {
  cloudflare: "saas/cdn/cloudflare", gateway: "aws/network/api-gateway",
  lambda: "aws/compute/lambda", postgres: "onprem/database/postgresql",
  s3: "aws/storage/simple-storage-service-s3", sqs: "aws/integration/simple-queue-service-sqs",
  cognito: "aws/security/cognito", logs: "aws/management/cloudwatch",
};
const icons = {};
for (const [name, path] of Object.entries(iconPaths)) {
  const file = join(iconDir, `${name}.png`);
  let bytes;
  try { bytes = await readFile(file); } catch {
    const response = await fetch(`https://raw.githubusercontent.com/mingrammer/diagrams/master/resources/${path}.png`);
    if (!response.ok) throw new Error(`Icon ${name}: ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(file, bytes);
  }
  icons[name] = `data:image/png;base64,${bytes.toString("base64")}`;
}
const esc = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const text = (x, y, value, size = 22, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(value)}</text>`;
const card = (x, y, icon, title, lines, width = 300) => `<g>
  <rect x="${x}" y="${y}" width="${width}" height="210" fill="#fff" stroke="#b7b2a6"/>
  <image href="${icons[icon]}" x="${x+22}" y="${y+28}" width="58" height="58"/>
  ${title.map((line,i)=>text(x+96,y+48+i*29,line,21,'font-weight="700"')).join("")}
  ${lines.map((line,i)=>text(x+22,y+116+i*30,line,20,'fill="#5d5a52"')).join("")}
</g>`;
const edge = (d, dashed = false) => `<path d="${d}" fill="none" stroke="#5d5a52" stroke-width="2" ${dashed ? 'stroke-dasharray="7 6"' : ""} marker-end="url(#arrow)"/>`;
const base = (title, subtitle, body, footer) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="960" viewBox="0 0 1600 960" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(subtitle)}. ${esc(footer)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#5d5a52"/></marker></defs>
<rect width="1600" height="960" fill="#fbfaf5"/><g font-family="Arial, sans-serif" fill="#11100d">
${text(60,68,title,34,'font-weight="700"')}${text(60,108,subtitle,21,'fill="#5d5a52"')}
${body}<path d="M60 840H1540" stroke="#c52b22" stroke-width="2"/>
${text(60,879,footer,22,'fill="#c52b22"')}${text(60,920,"Reading view of the documented release · full architecture and verification linked in the case study",18,'fill="#5d5a52"')}
</g></svg>`;

const terra = base("TerraGate / deployed public-demo architecture", "October 10 release record · Cloudflare + AWS + external managed data", `
<rect x="415" y="155" width="730" height="320" fill="#f1eddf" stroke="#b7b2a6"/>
${text(440,187,"AWS request path · Lambda outside a VPC",18,'fill="#5d5a52"')}
${card(60,220,"cloudflare",["Cloudflare","Workers / OpenNext"],["Review + evidence UI","Shared dev identities","Bounded plan uploads"])}
${card(440,220,"gateway",["API Gateway","HTTP API"],["HTTPS request boundary","Lambda proxy integration","No Terraform execution"])}
${card(820,220,"lambda",["Lambda","FastAPI / Mangum"],["Deterministic Python checks","Snapshot-scoped decisions","Inline review processing"])}
${card(1200,220,"postgres",["Neon","PostgreSQL"],["External managed database","TLS connections","Findings, decisions, audit"],340)}
${edge("M360 325H440")}${edge("M740 325H820")}${edge("M1120 325H1200")}
${text(370,308,"HTTPS",16)}${text(751,308,"invoke",16)}${text(1136,308,"TLS",16)}
${card(440,525,"logs",["CloudWatch","Runtime logs"],["Application / build logs","Release diagnostics","No continuous SLO claim"])}
${card(820,525,"lambda",["Lambda /tmp","Plan artifacts"],["Instance-local files","Can expire → HTTP 410","Not durable evidence"])}
<rect x="1200" y="525" width="340" height="210" fill="#f1eddf" stroke="#c52b22" stroke-dasharray="6 5"/>
${text(1222,572,"GitHub writes",24,'font-weight="700"')}${text(1222,616,"Mocked in public demo",21)}${text(1222,653,"No merge / apply authority",20,'fill="#5d5a52"')}
${edge("M820 400H775V630H740")}${edge("M970 430V525")}${edge("M1120 400H1160V630H1200",true)}
${text(994,491,"temporary storage",17)}
${text(60,789,"RELEASE: GitHub CI checks → CodeBuild build → ECR digest → manual AWS update",22)}
`, "PUBLIC BOUNDARY: deterministic checks · shared dev auth · mocked writes · execution disabled");

const shift = base("ShiftClarity / deployed synthetic-pilot architecture", "Fictional records · standalone /demo is memory-only; this diagram shows the assigned-account pilot", `
${card(60,220,"cloudflare",["Cloudflare Pages","Fixed-origin proxy"],["React interface via HTTPS","Secure sessions / CSRF","No private edge caching"])}
${card(440,220,"gateway",["API Gateway","HTTP API"],["Fixed AWS origin","Restricted edge credential","User permission still required"])}
${card(820,220,"lambda",["Web Lambda","FastAPI + Node"],["Server membership checks","Shared exact-decimal engine","Private imports and reviews"])}
${card(1200,220,"postgres",["Neon","PostgreSQL"],["Source / rule / run history","Durable jobs + lease fencing","Transactional publication"],340)}
${edge("M360 325H440")}${edge("M740 325H820")}${edge("M1120 325H1200")}
${text(370,308,"HTTPS",16)}${text(751,308,"invoke",16)}${text(1136,308,"TLS",16)}
${card(60,525,"cognito",["Cognito","Identity + MFA"],["Assigned individual accounts","Authenticator required","Identity ≠ workspace access"])}
${card(440,525,"s3",["Private S3","Original evidence"],["Bounded synthetic JSON","Quarantine / accepted bytes","Gated private downloads"])}
${card(820,525,"sqs",["SQS FIFO","Job notifications"],["Workspace message group","Retry / partial failure","DB controls publication"])}
${card(1200,525,"lambda",["Worker Lambda","Python + Node"],["Same shared engine image","Claims / fences durable jobs","Publishes immutable runs"],340)}
${edge("M210 525V468H848V430",true)}${text(240,460,"identity checks",16)}
${edge("M930 430V489H590V525")}${text(609,511,"source bytes",16)}
${edge("M1030 430V525",true)}${text(1043,490,"notify",16)}
${edge("M1120 630H1200",true)}${text(1130,611,"invoke",16)}
${edge("M1370 525V430")}${text(1390,490,"claim / publish",16)}
${text(60,789,"BUSINESS CONTRACT: approved work + dated terms + invoices → findings and explicit coverage gaps",22)}
`, "SYNTHETIC PILOT: no real customer records · no collected-revenue claim · production acceptance separate");

for (const [name,svg] of [["terragate-live-architecture",terra],["shiftclarity-architecture",shift]]) {
  await writeFile(join(originals,`${name}.svg`),svg);
  const target = name === "terragate-live-architecture" ? "terragate-architecture" : name;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(join(root,"public/case-studies",`${target}.webp`));
}
console.log("Rendered TerraGate and ShiftClarity diagrams from documented request and processing paths.");
