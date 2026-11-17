// Generates the profile's SVG artwork in dark and light variants: node tools/build-assets.mjs
// Fonts are embedded as data URIs because GitHub renders README images without loading external files.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = (name) => `${root}assets/${name}`;

const W = 1280;

const THEMES = {
  dark: { bg: "#000000", fg: "#ffffff", soft: "#c4c4c4", dim: "#8f8f8f", faint: "#4d4d4d", line: "#262626", dot: "#2a2a2a", chip: "#0b0b0b" },
  light: { bg: "#ffffff", fg: "#000000", soft: "#3a3a3a", dim: "#6b6b6b", faint: "#b4b4b4", line: "#dcdcdc", dot: "#d9d9d9", chip: "#f7f7f7" },
};

const FONTS = {
  serif: "instrument-serif-normal-400-latin.woff2",
  serifItalic: "instrument-serif-italic-400-latin.woff2",
  mono: "geist-mono-normal-400-latin.woff2",
};
const fontData = Object.fromEntries(
  Object.entries(FONTS).map(([key, file]) => [key, readFileSync(`${root}assets/fonts/${file}`).toString("base64")]),
);

// Average advance widths in em, used only to wrap and place text.
const SERIF_EM = 0.42;
const MONO_EM = 0.6;
const MONO_TRACKED_EM = 0.68; // .mono adds .08em letter-spacing

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function fontFaces(used) {
  const face = (family, key, style) =>
    `@font-face{font-family:'${family}';font-style:${style};src:url(data:font/woff2;base64,${fontData[key]}) format('woff2');}`;
  return [
    used.has("serif") && face("Instrument Serif", "serif", "normal"),
    used.has("serifItalic") && face("Instrument Serif", "serifItalic", "italic"),
    used.has("mono") && face("Geist Mono", "mono", "normal"),
  ]
    .filter(Boolean)
    .join("");
}

function svg({ height, label, theme, fonts, body, transparent = false }) {
  const t = THEMES[theme];
  const css = `${fontFaces(new Set(fonts))}
.serif{font-family:'Instrument Serif',Georgia,serif;fill:${t.fg}}
.it{font-style:italic}
.mono{font-family:'Geist Mono',ui-monospace,Menlo,monospace;letter-spacing:.08em;fill:${t.dim}}
.fg{fill:${t.fg}}.soft{fill:${t.soft}}.dim{fill:${t.dim}}.faint{fill:${t.faint}}
.rule{stroke:${t.line};stroke-width:1}
.tight{letter-spacing:0}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<style>${css}</style>
<defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.1" fill="${t.dot}"/></pattern></defs>
${transparent ? "" : `<rect width="${W}" height="${height}" fill="${t.bg}"/>`}
${body(t)}
</svg>
`;
}

// Greedy word wrap by estimated width.
function wrap(text, maxWidth, size, em) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length * size * em > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// Serif text where *words* are set in italic.
function serifRich(text) {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") ? `<tspan class="it">${esc(part.slice(1, -1))}</tspan>` : esc(part)))
    .join("");
}

const hline = (y, x1 = 0, x2 = W) => `<line class="rule" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`;
const vline = (x, y1, y2) => `<line class="rule" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>`;
const frame = (h) => `<rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" fill="none" class="rule"/>`;
// Registration mark where grid lines meet.
const cross = (t, x, y, s = 7) =>
  `<path d="M${x - s} ${y}H${x + s}M${x} ${y - s}V${y + s}" stroke="${t.dim}" stroke-width="1"/>`;
// North-east arrow, drawn because the font subsets have no arrow glyphs.
const arrow = (t, x, y, s = 12) =>
  `<path d="M${x} ${y + s}L${x + s} ${y}M${x + s * 0.3} ${y}H${x + s}V${y + s * 0.7}" fill="none" stroke="${t.fg}" stroke-width="1.4" stroke-linecap="square"/>`;
const pulse = (t, cx, cy, r = 4) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t.fg}" stroke-width="1"><animate attributeName="r" values="${r};${r * 3.2}" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="2s" repeatCount="indefinite"/></circle><circle cx="${cx}" cy="${cy}" r="${r}" fill="${t.fg}"/>`;

// ---------- Hero ----------

const NODES = {
  a: [70, 110], b: [210, 60], c: [330, 160], d: [470, 70], e: [580, 200],
  f: [390, 290], g: [210, 260], h: [60, 300], i: [530, 330],
};
const EDGES = ["ab", "bc", "cd", "de", "cf", "fg", "gh", "ha", "cg", "ei", "fi"];
const ROUTES = [
  { hops: "abcdei", dur: 6.1 },
  { hops: "hgfi", dur: 4.7 },
  { hops: "ahgcf", dur: 5.3 },
];
const routePath = (hops) => [...hops].map((id, i) => `${i ? "L" : "M"}${NODES[id][0]} ${NODES[id][1]}`).join(" ");

function systemGraph(t, x, y, scale) {
  const edges = EDGES.map(([p, q]) => {
    const [x1, y1] = NODES[p];
    const [x2, y2] = NODES[q];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join("");
  const nodes = Object.entries(NODES)
    .map(([id, [cx, cy]], i) => {
      if (id === "c") return pulse(t, cx, cy, 5);
      return `<circle cx="${cx}" cy="${cy}" r="4" fill="${t.bg}" stroke="${t.fg}" stroke-width="1.2"><animate attributeName="opacity" values="1;.4;1" dur="${3 + (i % 4) * 0.7}s" repeatCount="indefinite"/></circle>`;
    })
    .join("");
  const packets = ROUTES.map(
    (route, i) =>
      `<circle r="3.4" fill="${t.fg}" opacity="0"><animateMotion dur="${route.dur}s" begin="${i * 1.3}s" repeatCount="indefinite" path="${routePath(route.hops)}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.9;1" dur="${route.dur}s" begin="${i * 1.3}s" repeatCount="indefinite"/></circle>`,
  ).join("");
  return `<g transform="translate(${x} ${y}) scale(${scale})"><g stroke="${t.faint}" stroke-width="1" fill="none">${edges}</g>${nodes}${packets}</g>`;
}

function hero(theme) {
  const height = 840;
  const panelX = 780; // left edge of the graph panel
  const foldY = 560; // top of the statement band
  const metaX = 940; // left edge of the meta column
  const meta = [
    ["Currently", "D-Tech Solution Integrators"],
    ["Based in", "Bharuch · Surat, India"],
    ["Website", "thepatelsuraj.dev"],
  ];
  const metaRowH = (height - foldY) / meta.length;
  const status = "OPEN TO ROLES";
  const pillW = status.length * 15 * MONO_TRACKED_EM + 52;
  return svg({
    height,
    theme,
    label: "Suraj Patel — DevOps, Cloud and SRE. I build the pipelines that ship code, the telemetry that says it broke, and the systems that work out why.",
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => `
${frame(height)}
<text class="mono" x="32" y="45" font-size="15">SURAJ PATEL — PORTFOLIO</text>
<text class="mono" x="${W / 2}" y="45" font-size="15" text-anchor="middle">DEVOPS · CLOUD · SRE</text>
<rect x="${W - 24 - pillW}" y="20" width="${pillW}" height="34" rx="17" fill="${t.chip}" stroke="${t.line}"/>
${pulse(t, W - 24 - pillW + 22, 37, 3.5)}
<text class="mono fg" x="${W - 24 - pillW + 38}" y="42" font-size="15">${status}</text>
${hline(72)}
<rect x="${panelX}" y="73" width="${W - panelX - 1}" height="${foldY - 73}" fill="url(#dots)"/>
${vline(panelX, 72, foldY)}
${systemGraph(t, panelX - 6, 140, 0.8)}
<text class="mono" x="${panelX + 28}" y="${foldY - 28}" font-size="13">FIG. 01</text>
<text class="mono" x="${W - 28}" y="${foldY - 28}" font-size="13" text-anchor="end">A REQUEST, TRACED</text>
<text class="mono" x="32" y="126" font-size="15">(00)  INTRODUCING</text>
<text class="serif" x="22" y="318" font-size="220" letter-spacing="-5">Suraj</text>
<text class="serif it" x="170" y="510" font-size="220" letter-spacing="-5">Patel</text>
${hline(foldY)}
<text class="mono" x="32" y="606" font-size="15">STATEMENT</text>
<text class="serif" x="30" y="672" font-size="50">${serifRich("I build the *pipelines* that ship code,")}</text>
<text class="serif" x="30" y="732" font-size="50">${serifRich("the *telemetry* that says it broke,")}</text>
<text class="serif" x="30" y="792" font-size="50">${serifRich("and the *systems* that work out why.")}</text>
${vline(metaX, foldY, height)}
${meta
  .map(([k, v], i) => {
    const y = foldY + i * metaRowH;
    return `${i ? hline(y, metaX, W) : ""}
<text class="mono" x="${metaX + 28}" y="${y + 38}" font-size="13">${esc(k.toUpperCase())}</text>
<text class="mono fg" x="${metaX + 28}" y="${y + 68}" font-size="15">${esc(v.toUpperCase())}</text>`;
  })
  .join("")}
${cross(t, panelX, 72)}${cross(t, panelX, foldY)}${cross(t, metaX, foldY)}`,
  });
}

// ---------- Section headers ----------

function section(theme, { index, title, note }) {
  const height = 150;
  const size = 80;
  const titleEnd = title.replace(/\*/g, "").length * size * SERIF_EM;
  const noteW = note.length * 15 * MONO_TRACKED_EM;
  return svg({
    height,
    theme,
    label: title.replace(/\*/g, ""),
    transparent: true,
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => `
${hline(0.5)}
<text class="mono" x="2" y="38" font-size="15">(${index})</text>
<text class="serif" x="0" y="124" font-size="${size}" letter-spacing="-1">${serifRich(title)}</text>
<line x1="${titleEnd + 40}" y1="118" x2="${W - noteW - 28}" y2="118" stroke="${t.faint}" stroke-width="1.6" stroke-dasharray="0 9" stroke-linecap="round"/>
<text class="mono" x="${W - 2}" y="123" font-size="15" text-anchor="end">${esc(note.toUpperCase())}</text>`,
  });
}

// ---------- By the numbers ----------

// [figure, italic suffix, what it measures, where]
const STATS = [
  ["2", "", "production systems owned end to end, every deploy health-checked", "D-Tech"],
  ["<5", "min", "from git push to live, gated on tests and image scans", "CI/CD pipeline"],
  ["0", "", "failed requests during rolling deploys on Kubernetes", "CI/CD pipeline"],
  ["675", "+", "automated tests gate every release of a live portal", "BCCI Bharuch"],
  ["0", "", "long-lived AWS keys; CI authenticates through OIDC", "Terraform ECS"],
  ["1", "", "named human must approve every automated fix", "Aegis"],
  ["27", "×", "faster than realtime lecture transcription on a CPU", "RAG assistant"],
  ["25", "+", "GCP labs run; a 12-member team shipped 8 apps", "GDSC"],
];

function stats(theme) {
  const cols = 4;
  const cellW = W / cols;
  const descSize = 24;
  const descLH = 30;
  const wrapped = STATS.map(([, , what]) => wrap(what, cellW - 64, descSize, SERIF_EM));
  const cellH = 236 + (Math.max(...wrapped.map((l) => l.length)) - 1) * descLH + 78;
  const rows = Math.ceil(STATS.length / cols);
  const height = rows * cellH;
  const cells = STATS.map(([figure, suffix, what, where], i) => {
    const x = (i % cols) * cellW;
    const y = Math.floor(i / cols) * cellH;
    const lines = wrapped[i];
    return `<text class="mono" x="${x + 30}" y="${y + 44}" font-size="13">${String(i + 1).padStart(2, "0")}</text>
<text class="serif" x="${x + 26}" y="${y + 186}" font-size="128" letter-spacing="-3">${esc(figure)}${suffix ? `<tspan class="it dim" font-size="64" dx="6">${esc(suffix)}</tspan>` : ""}</text>
${lines.map((line, j) => `<text class="serif soft" x="${x + 30}" y="${y + 236 + j * descLH}" font-size="${descSize}">${esc(line)}</text>`).join("")}
<text class="mono" x="${x + 30}" y="${y + cellH - 30}" font-size="13">${esc(where.toUpperCase())}</text>`;
  }).join("");
  return svg({
    height,
    theme,
    label: `By the numbers: ${STATS.map(([f, s, what, where]) => `${f}${s} ${what} (${where})`).join("; ")}.`,
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => {
      const grid = [
        ...Array.from({ length: cols - 1 }, (_, c) => vline((c + 1) * cellW, 0, height)),
        ...Array.from({ length: rows - 1 }, (_, r) => hline((r + 1) * cellH)),
      ].join("");
      const marks = Array.from({ length: (cols - 1) * (rows - 1) }, (_, k) =>
        cross(t, ((k % (cols - 1)) + 1) * cellW, (Math.floor(k / (cols - 1)) + 1) * cellH),
      ).join("");
      return `${frame(height)}${grid}${marks}${cells}`;
    },
  });
}

// ---------- Selected work ----------

const PROJECTS = [
  {
    slug: "aegis",
    name: "Aegis",
    repo: "underratedgitter/Aegis",
    year: "2026",
    tagline: "An evidence-first SRE incident-response copilot",
    body: "Watches a checkout-and-inventory service pair, correlates threshold alerts and z-score anomalies into one root-caused incident, investigates it against real metrics, logs and runbooks, then proposes a bounded fix that a named human must approve. Chaos injection and MTTR tracking prove the loop end to end, and it runs fully offline with no API key.",
    stack: ["Python", "FastAPI", "Prometheus", "Grafana", "Loki", "Promtail", "SQLite"],
  },
  {
    slug: "cicd",
    name: "CI/CD Pipeline",
    repo: "underratedgitter/CI-CD-Pipeline-Automation-with-Docker-Cloud-Deployment",
    year: "2026",
    tagline: "Docker, Kubernetes and Helm — push to live in under five minutes",
    body: "Every image is gated on lint, Jest coverage thresholds, npm audit, and Trivy and kubeconform scans, then deployed by digest so what runs is what was scanned. A 12-object Helm chart (HPA, PDB, NetworkPolicy, ServiceMonitor) runs it on a 3-node kind cluster, where a draining readiness probe brought rollouts to zero failed requests. P50/P95/P99 dashboards and 11 alert rules watch it.",
    stack: ["Docker", "Kubernetes", "Helm", "GitHub Actions", "Trivy", "Prometheus", "Grafana"],
  },
  {
    slug: "terraform",
    name: "Terraform ECS Platform",
    repo: "underratedgitter/terraform-aws-ecs-platform",
    year: "2026",
    tagline: "The infrastructure under the pipeline",
    body: "A multi-module platform: VPC across two AZs, an ECS cluster, ALB, ECR with image scanning, and CloudWatch alarms, with state in S3 and DynamoDB locking. CI plans every pull request through GitHub OIDC, so there is not one long-lived AWS key; hosts enforce IMDSv2 and are reached through SSM, never SSH.",
    stack: ["Terraform", "AWS ECS", "ALB", "VPC", "IAM", "GitHub OIDC"],
  },
  {
    slug: "rag",
    name: "RAG Teaching Assistant",
    repo: "underratedgitter/RAG-teaching-assistant",
    year: "2026",
    tagline: "Lecture video in, answers with timestamps out",
    body: "Ask a question about a lecture recording and get the answer and the moment it was said, in under a second across 1,000+ chunks. Runs fully local with faster-whisper and Ollama: int8 quantization, greedy decoding and VAD take transcription to roughly 18–27× realtime on a plain CPU.",
    stack: ["faster-whisper", "Ollama", "CUDA", "vector search"],
  },
];

function projectCard(theme, project, n) {
  const stackX = 900;
  const bodySize = 23;
  const bodyLH = 34;
  const lines = wrap(project.body, stackX - 100, bodySize, SERIF_EM);
  const bodyTop = 290;
  const stackTop = 160;
  const stackLH = 38;
  const height = Math.max(bodyTop + (lines.length - 1) * bodyLH, stackTop + (project.stack.length - 1) * stackLH) + 56;
  const cta = "VIEW REPOSITORY";
  return svg({
    height,
    theme,
    label: `${project.name} (${project.year}) — ${project.tagline}. ${project.body} Stack: ${project.stack.join(", ")}.`,
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => `
${frame(height)}
<text class="mono" x="32" y="45" font-size="15">(${String(n).padStart(2, "0")})</text>
<text class="mono" x="104" y="45" font-size="15">${project.year}</text>
<text class="mono fg" x="${W - 58}" y="45" font-size="15" text-anchor="end">${cta}</text>
${arrow(t, W - 44, 33)}
${hline(72)}
<text class="serif" x="28" y="178" font-size="84" letter-spacing="-2">${esc(project.name)}</text>
<text class="serif it dim" x="32" y="228" font-size="32">${esc(project.tagline)}</text>
${lines.map((line, j) => `<text class="serif soft" x="32" y="${bodyTop + j * bodyLH}" font-size="${bodySize}">${esc(line)}</text>`).join("")}
${vline(stackX - 32, 72, height)}${cross(t, stackX - 32, 72)}
<rect x="${stackX - 31}" y="73" width="${W - stackX + 30}" height="${height - 74}" fill="url(#dots)" opacity=".55"/>
<text class="mono" x="${stackX}" y="118" font-size="13">STACK</text>
${project.stack
  .map((item, j) => {
    const y = stackTop + j * stackLH;
    return `<rect x="${stackX}" y="${y - 10}" width="7" height="7" fill="${t.fg}"/><text class="mono fg tight" x="${stackX + 22}" y="${y}" font-size="17">${esc(item)}</text>`;
  })
  .join("")}`,
  });
}

// ---------- Experience ----------

const EXPERIENCE = [
  {
    when: ["AUG 2026", "PRESENT"],
    role: "Software & Solutions Architect Intern",
    org: "D-Tech Solution Integrators · Bharuch",
    current: true,
    points: [
      "Platform owner for dtechindia.com and bccibharuch.in, the BCCI membership portal: infrastructure, delivery, security and data protection.",
      "Re-platformed D-Tech from Vercel serverless to a non-root, read-only Node.js container behind Nginx on a self-managed Ubuntu VPS.",
      "GitHub Actions CI/CD with test and CSP gates, smoke tests and digest-pinned images; health-checked rollouts roll back automatically.",
      "Nightly AES-256 encrypted off-site backups with a scripted restore, behind hash-based CSP, strict sessions, rate limiting and HMAC-signed links.",
      "Built the BCCI portal to run on Vercel or Docker, Redis or Postgres, with 675+ automated tests gating CI across its membership lifecycle.",
    ],
  },
  {
    when: ["FEB 2026"],
    role: "Open-source contributor",
    org: "Bindu",
    points: ["Merged Python error-handling fixes: broad exception catches replaced with specific types."],
  },
  {
    when: ["AUG 2023", "JAN 2024"],
    role: "Cloud Event Manager",
    org: "Google Developer Student Club · P.P. Savani University",
    points: ["Ran 25+ hands-on GCP labs and mentored a 12-member team that deployed 8 applications on GCP."],
  },
  {
    when: ["2023", "2027"],
    role: "B.Tech, Computer Science & Engineering",
    org: "P.P. Savani University · Surat",
    points: ["AWS Cloud Foundations, May 2026."],
  },
];

function experience(theme) {
  const railX = 250;
  const textX = 300;
  const pointSize = 22;
  const pointLH = 31;
  let y = 56;
  const entries = [];
  for (const [i, e] of EXPERIENCE.entries()) {
    const points = e.points.map((p) => wrap(p, W - textX - 70, pointSize, SERIF_EM));
    entries.push({ ...e, y, points, last: i === EXPERIENCE.length - 1 });
    const pointLines = points.reduce((n, p) => n + p.length, 0);
    y += 112 + pointLines * pointLH + (points.length - 1) * 10 + 56;
  }
  const height = y - 16;
  return svg({
    height,
    theme,
    label: `Experience: ${EXPERIENCE.map((e) => `${e.role}, ${e.org} (${e.when.join(" to ")}): ${e.points.join(" ")}`).join(" ")}`,
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => `
${frame(height)}
${vline(railX, 0, height)}
${entries
  .map((e, i) => {
    let py = e.y + 128;
    const points = e.points
      .map((lines) => {
        const block = lines
          .map((line, j) => `${j ? "" : `<rect x="${textX}" y="${py - 9}" width="12" height="1.4" fill="${t.dim}"/>`}<text class="serif soft" x="${textX + 26}" y="${py + j * pointLH}" font-size="${pointSize}">${esc(line)}</text>`)
          .join("");
        py += lines.length * pointLH + 10;
        return block;
      })
      .join("");
    const node = e.current
      ? pulse(t, railX, e.y + 34, 6)
      : `<circle cx="${railX}" cy="${e.y + 34}" r="6" fill="${t.bg}" stroke="${t.fg}" stroke-width="1.4"/>`;
    return `${i ? hline(e.y - 28, textX, W - 32) : ""}
<text class="mono fg" x="32" y="${e.y + 40}" font-size="15">${e.when[0]}</text>
${e.when[1] ? `<text class="mono" x="32" y="${e.y + 68}" font-size="15">— ${e.when[1]}</text>` : ""}
${node}
<text class="serif" x="${textX}" y="${e.y + 48}" font-size="44" letter-spacing="-.5">${esc(e.role)}</text>
<text class="mono" x="${textX + 2}" y="${e.y + 86}" font-size="14">${esc(e.org.toUpperCase())}</text>
${points}`;
  })
  .join("")}`,
  });
}

// ---------- Toolkit ----------

const TOOLKIT = [
  ["Cloud & IaC", ["AWS", "EC2", "ECS", "ALB", "ECR", "S3", "IAM", "VPC", "CloudWatch", "GCP", "Vercel", "Terraform", "remote state", "OIDC"]],
  ["Containers & CI/CD", ["Docker", "Kubernetes", "Helm", "GitHub Actions", "GHCR", "Trivy", "kubeconform", "test gating", "auto-rollback"]],
  ["Observability & SRE", ["Prometheus", "Grafana", "Loki", "Promtail", "alerting", "P95/P99 latency", "runbooks", "postmortems", "MTTR", "chaos testing"]],
  ["Security", ["hash-based CSP", "HMAC signing", "AES-256", "least-privilege IAM", "secrets management", "image scanning"]],
  ["Linux & Networking", ["Ubuntu", "systemd", "Nginx", "TLS", "Bash", "TCP/IP", "DNS", "HTTP/S", "CIDR", "firewalls"]],
  ["Languages", ["Python", "Bash", "JavaScript", "Node.js", "SQL", "C++"]],
  ["Data", ["PostgreSQL", "Redis", "MySQL", "MongoDB"]],
];
// Column spans out of 12 per row, in reading order.
const TOOLKIT_ROWS = [[7, 5], [5, 7], [4, 4, 4]];

const CHIP = { size: 15, padX: 15, h: 36, gap: 10, rowGap: 12 };
const chipWidth = (label) => label.length * CHIP.size * MONO_EM + CHIP.padX * 2;

// Lays chips out left to right, wrapping at maxWidth; returns positions relative to the cell.
function layoutChips(items, maxWidth) {
  const placed = [];
  let x = 0;
  let row = 0;
  for (const label of items) {
    const w = chipWidth(label);
    if (x && x + w > maxWidth) {
      x = 0;
      row += 1;
    }
    placed.push({ label, x, row, w });
    x += w + CHIP.gap;
  }
  return { placed, rows: row + 1 };
}

function toolkit(theme) {
  const col = W / 12;
  let y = 0;
  let index = 0;
  const cells = [];
  const rowEdges = [];
  for (const spans of TOOLKIT_ROWS) {
    let x = 0;
    const row = spans.map((span) => {
      const [title, items] = TOOLKIT[index];
      const width = span * col;
      const cell = { x, width, title, n: ++index, ...layoutChips(items, width - 64) };
      x += width;
      return cell;
    });
    const rowH = 128 + Math.max(...row.map((c) => c.rows)) * (CHIP.h + CHIP.rowGap) + 24;
    for (const c of row) cells.push({ ...c, y, rowH });
    y += rowH;
    rowEdges.push(y);
  }
  return svg({
    height: y,
    theme,
    label: `Toolkit: ${TOOLKIT.map(([t, items]) => `${t}: ${items.join(", ")}`).join("; ")}`,
    fonts: ["serif", "mono"],
    body: (t) => `${frame(y)}
${rowEdges.slice(0, -1).map((e) => hline(e)).join("")}
${cells
  .map(
    (c) => `${c.x ? `${vline(c.x, c.y, c.y + c.rowH)}${c.y ? cross(t, c.x, c.y) : ""}` : ""}
<text class="mono" x="${c.x + 32}" y="${c.y + 42}" font-size="13">${String(c.n).padStart(2, "0")}</text>
<text class="serif" x="${c.x + 30}" y="${c.y + 98}" font-size="44">${esc(c.title)}</text>
${c.placed
  .map((p) => {
    const px = c.x + 32 + p.x;
    const py = c.y + 124 + p.row * (CHIP.h + CHIP.rowGap);
    return `<rect x="${px}" y="${py}" width="${p.w}" height="${CHIP.h}" rx="${CHIP.h / 2}" fill="${t.chip}" stroke="${t.line}"/><text class="mono fg tight" x="${px + CHIP.padX}" y="${py + 23}" font-size="${CHIP.size}">${esc(p.label)}</text>`;
  })
  .join("")}`,
  )
  .join("")}`,
  });
}

// ---------- Contact ----------

function contact(theme) {
  const height = 540;
  const linksY = 440;
  const links = ["thepatelsuraj.dev", "linkedin.com/in/thepatelsuraj", "23se02cs076@gmail.com"];
  const colW = W / links.length;
  return svg({
    height,
    theme,
    label: "Let's build something reliable. thepatelsuraj.dev",
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => `
${frame(height)}
<rect x="${W * 0.62}" y="1" width="${W * 0.38 - 1}" height="${linksY - 1}" fill="url(#dots)"/>
<text class="mono" x="32" y="48" font-size="15">(05)</text>
${pulse(t, W - 146, 43, 3.5)}
<text class="mono fg" x="${W - 32}" y="48" font-size="15" text-anchor="end">SAY HELLO</text>
<text class="serif" x="22" y="236" font-size="146" letter-spacing="-4">Let’s build</text>
<text class="serif" x="22" y="380" font-size="146" letter-spacing="-4">${serifRich("something *reliable.*")}</text>
${hline(linksY)}
${links
  .map(
    (l, i) => `${i ? `${vline(i * colW, linksY, height)}${cross(t, i * colW, linksY)}` : ""}
<text class="mono fg" x="${32 + i * colW}" y="${linksY + 58}" font-size="16">${esc(l)}</text>
${arrow(t, (i + 1) * colW - 48, linksY + 44)}`,
  )
  .join("")}`,
  });
}

// ---------- Write ----------

const SECTIONS = {
  numbers: { index: "01", title: "By the *numbers*", note: "8 receipts" },
  work: { index: "02", title: "Selected *work*", note: "4 projects" },
  experience: { index: "03", title: "Where I’ve *been*", note: "2023 — now" },
  toolkit: { index: "04", title: "The *toolkit*", note: "7 disciplines" },
};

for (const theme of Object.keys(THEMES)) {
  writeFileSync(out(`hero-${theme}.svg`), hero(theme));
  writeFileSync(out(`numbers-${theme}.svg`), stats(theme));
  writeFileSync(out(`experience-${theme}.svg`), experience(theme));
  writeFileSync(out(`toolkit-${theme}.svg`), toolkit(theme));
  writeFileSync(out(`contact-${theme}.svg`), contact(theme));
  for (const [n, project] of PROJECTS.entries()) writeFileSync(out(`work-${project.slug}-${theme}.svg`), projectCard(theme, project, n + 1));
  for (const [name, spec] of Object.entries(SECTIONS)) writeFileSync(out(`section-${name}-${theme}.svg`), section(theme, spec));
}
console.log("assets written");
