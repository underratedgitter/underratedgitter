// Generates the profile's SVG artwork in dark and light variants: node tools/build-assets.mjs
// Fonts are embedded as data URIs because GitHub renders README images without loading external files.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = (name) => `${root}assets/${name}`;

const W = 1280;

const THEMES = {
  dark: { bg: "#000000", fg: "#ffffff", dim: "#8f8f8f", faint: "#5c5c5c", line: "#2e2e2e" },
  light: { bg: "#ffffff", fg: "#000000", dim: "#666666", faint: "#9a9a9a", line: "#d6d6d6" },
};

const FONTS = {
  serif: "instrument-serif-normal-400-latin.woff2",
  serifItalic: "instrument-serif-italic-400-latin.woff2",
  mono: "geist-mono-normal-400-latin.woff2",
};
const fontData = Object.fromEntries(
  Object.entries(FONTS).map(([key, file]) => [key, readFileSync(`${root}assets/fonts/${file}`).toString("base64")]),
);

// Average advance widths in em, used only to wrap text into lines.
const SERIF_EM = 0.43;
const MONO_EM = 0.6;

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

function svg({ height, label, theme, fonts, body, extraCss = "", transparent = false }) {
  const t = THEMES[theme];
  const css = `${fontFaces(new Set(fonts))}
.serif{font-family:'Instrument Serif',Georgia,serif;fill:${t.fg}}
.it{font-style:italic}
.mono{font-family:'Geist Mono',ui-monospace,Menlo,monospace;letter-spacing:.08em;fill:${t.dim}}
.fg{fill:${t.fg}}.dim{fill:${t.dim}}
.rule{stroke:${t.line};stroke-width:1}
.tight{letter-spacing:0}.loose{letter-spacing:.04em}
${extraCss}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<style>${css}</style>
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
      const r = id === "c" ? 4 : 3;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${t.fg}"><animate attributeName="opacity" values="1;.35;1" dur="${3 + (i % 4) * 0.7}s" repeatCount="indefinite"/></circle>`;
    })
    .join("");
  const packets = ROUTES.map(
    (route, i) =>
      `<circle r="3.2" fill="${t.fg}" opacity="0"><animateMotion dur="${route.dur}s" begin="${i * 1.3}s" repeatCount="indefinite" path="${routePath(route.hops)}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.9;1" dur="${route.dur}s" begin="${i * 1.3}s" repeatCount="indefinite"/></circle>`,
  ).join("");
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity=".55"><g stroke="${t.fg}" stroke-width=".7" fill="none">${edges}</g>${nodes}${packets}</g>`;
}

function hero(theme) {
  const height = 900;
  const meta = [
    ["Discipline", "DevOps · Cloud · SRE", 0],
    ["Currently", "D-Tech Solution Integrators", 290],
    ["Based in", "Bharuch / Surat, India", 720],
    ["Status", "Open to roles", 1040],
  ];
  return svg({
    height,
    theme,
    label: "Suraj Patel — DevOps, Cloud and SRE. I build the pipelines that ship code, the telemetry that says it broke, and the systems that work out why.",
    fonts: ["serif", "serifItalic", "mono"],
    body: (t) => `
${frame(height)}
${meta
  .map(
    ([k, v, x], i) => `${i ? vline(x, 0, 84) : ""}
<text class="mono" x="${x + 28}" y="34" font-size="15">${esc(k.toUpperCase())}</text>
<text class="mono fg" x="${x + 28 + (i === 3 ? 18 : 0)}" y="62" font-size="17">${esc(v.toUpperCase())}</text>`,
  )
  .join("")}
<circle cx="1074" cy="56" r="4.5" fill="${t.fg}"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></circle>
${hline(84)}
${systemGraph(t, 640, 110, 0.98)}
<text class="mono" x="28" y="138" font-size="15">PORTFOLIO — THEPATELSURAJ.DEV</text>
<text class="serif" x="16" y="365" font-size="262" letter-spacing="-4">Suraj</text>
<text class="serif it" x="1256" y="560" font-size="262" letter-spacing="-4" text-anchor="end">Patel</text>
${hline(598)}
<text class="mono" x="28" y="630" font-size="15">STATEMENT</text>
<text class="serif" x="28" y="712" font-size="60">${serifRich("I build the *pipelines* that ship code,")}</text>
<text class="serif" x="28" y="776" font-size="60">${serifRich("the *telemetry* that says it broke,")}</text>
<text class="serif" x="28" y="840" font-size="60">${serifRich("and the *systems* that work out why.")}</text>
${vline(1010, 598, height)}
${["Pipelines", "Telemetry", "Reliability"]
  .map(
    (word, i) => `<text class="mono" x="1038" y="${672 + i * 72}" font-size="15">0${i + 1}</text>
<text class="serif" x="1084" y="${676 + i * 72}" font-size="38">${esc(word)}</text>${i < 2 ? hline(706 + i * 72, 1010, W) : ""}`,
  )
  .join("")}`,
  });
}

// ---------- Section headers ----------

function section(theme, { index, title, note }) {
  const height = 132;
  return svg({
    height,
    theme,
    label: title.replace(/\*/g, ""),
    transparent: true,
    fonts: ["serif", "serifItalic", "mono"],
    body: () => `
${hline(0.5)}
<text class="mono" x="4" y="36" font-size="15">(${index})</text>
<text class="mono" x="${W - 4}" y="36" font-size="15" text-anchor="end">${esc(note.toUpperCase())}</text>
<text class="serif" x="0" y="114" font-size="78" letter-spacing="-1">${serifRich(title)}</text>`,
  });
}

// ---------- Receipts ----------

const RECEIPTS = [
  ["Two production systems; every deploy health-checked and rolled back on failure.", "D-Tech Solution Integrators"],
  ["Every automated fix is bounded, allowlisted, and needs a named human approver.", "Aegis"],
  ["Push to live in under five minutes, with zero failed requests during rollouts.", "CI/CD Pipeline"],
  ["Not one long-lived AWS key. CI plans every pull request through OIDC.", "Terraform AWS ECS Platform"],
  ["675+ automated tests gate every release of a live membership portal.", "BCCI Bharuch portal"],
  ["25+ GCP labs, and a 12-member team that shipped 8 applications.", "GDSC, Cloud Event Manager"],
];

function receipts(theme) {
  const cellH = 250;
  const rows = Math.ceil(RECEIPTS.length / 2);
  const height = rows * cellH;
  const size = 40;
  const cells = RECEIPTS.map(([claim, source], i) => {
    const x = (i % 2) * (W / 2);
    const y = Math.floor(i / 2) * cellH;
    const lines = wrap(claim, W / 2 - 80, size, SERIF_EM);
    const text = lines
      .map((line, j) => `<text class="serif" x="${x + 32}" y="${y + 64 + j * 44}" font-size="${size}">${esc(line)}</text>`)
      .join("");
    return `${text}
<text class="mono" x="${x + 32}" y="${y + cellH - 30}" font-size="15">${esc(source.toUpperCase())}</text>
<text class="mono" x="${x + W / 2 - 32}" y="${y + cellH - 30}" font-size="15" text-anchor="end">0${i + 1}</text>`;
  }).join("");
  const grid = [vline(W / 2, 0, height), ...Array.from({ length: rows - 1 }, (_, r) => hline((r + 1) * cellH))].join("");
  return svg({
    height,
    theme,
    label: `What the work shows: ${RECEIPTS.map(([c, s]) => `${c} (${s})`).join(" ")}`,
    fonts: ["serif", "mono"],
    body: () => `${frame(height)}${grid}${cells}`,
  });
}

// ---------- Toolkit ----------

const TOOLKIT = [
  ["Cloud & IaC", ["AWS (EC2, ECS, ALB, ECR, S3, IAM, VPC, CloudWatch)", "GCP", "Vercel", "Terraform (modules, remote state, OIDC)"]],
  ["Containers & CI/CD", ["Docker", "Kubernetes", "Helm", "GitHub Actions", "GHCR", "Trivy", "kubeconform", "test gating", "auto-rollback"]],
  ["Observability & SRE", ["Prometheus", "Grafana", "Loki", "Promtail", "alerting", "P95/P99 latency", "runbooks", "postmortems", "MTTR", "chaos testing"]],
  ["Security", ["hash-based CSP", "HMAC signing", "AES-256", "least-privilege IAM", "secrets management", "image scanning"]],
  ["Linux & Networking", ["Ubuntu", "systemd", "Nginx (reverse proxy, TLS)", "Bash", "TCP/IP", "DNS", "HTTP/S", "CIDR", "firewalls"]],
  ["Languages", ["Python", "Bash", "JavaScript (Node.js)", "SQL", "C++"]],
  ["Data", ["PostgreSQL", "Redis", "MySQL", "MongoDB"]],
];
// Column spans out of 12 per row, in reading order.
const TOOLKIT_ROWS = [[7, 5], [5, 7], [4, 4, 4]];

function wrapItems(items, maxWidth, size) {
  const lines = [];
  let line = [];
  for (const item of items) {
    const next = [...line, item].join(" · ");
    if (next.length * size * MONO_EM > maxWidth && line.length) {
      lines.push(line.join(" · "));
      line = [item];
    } else line.push(item);
  }
  if (line.length) lines.push(line.join(" · "));
  return lines;
}

function toolkit(theme) {
  const col = W / 12;
  const size = 16;
  const lineH = 27;
  let y = 0;
  let index = 0;
  const parts = [];
  for (const [r, spans] of TOOLKIT_ROWS.entries()) {
    const cells = [];
    let x = 0;
    for (const span of spans) {
      const [title, items] = TOOLKIT[index];
      const width = span * col;
      cells.push({ x, width, title, lines: wrapItems(items, width - 64, size), n: ++index });
      x += width;
    }
    const rowH = 132 + Math.max(...cells.map((c) => c.lines.length)) * lineH;
    for (const c of cells) {
      parts.push(`<text class="mono" x="${c.x + 32}" y="${y + 40}" font-size="15">0${c.n}</text>
<text class="serif" x="${c.x + 32}" y="${y + 100}" font-size="44">${esc(c.title)}</text>
${c.lines.map((line, j) => `<text class="mono fg tight" x="${c.x + 32}" y="${y + 140 + j * lineH}" font-size="${size}">${esc(line)}</text>`).join("")}
${c.x ? vline(c.x, y, y + rowH) : ""}`);
    }
    y += rowH;
    if (r < TOOLKIT_ROWS.length - 1) parts.push(hline(y));
  }
  return svg({
    height: y,
    theme,
    label: `Toolkit: ${TOOLKIT.map(([t, items]) => `${t}: ${items.join(", ")}`).join("; ")}`,
    fonts: ["serif", "mono"],
    body: () => `${frame(y)}${parts.join("")}`,
  });
}

// ---------- Contact ----------

function contact(theme) {
  const height = 520;
  const links = ["thepatelsuraj.dev", "linkedin.com/in/thepatelsuraj", "23se02cs076@gmail.com"];
  const colW = W / links.length;
  return svg({
    height,
    theme,
    label: "Let's build something reliable. thepatelsuraj.dev",
    fonts: ["serif", "serifItalic", "mono"],
    body: () => `
${frame(height)}
<text class="mono" x="28" y="44" font-size="15">(04)</text>
<text class="mono" x="${W - 28}" y="44" font-size="15" text-anchor="end">SAY HELLO</text>
<text class="serif" x="22" y="230" font-size="150" letter-spacing="-3">Let’s build</text>
<text class="serif" x="22" y="370" font-size="150" letter-spacing="-3">${serifRich("something *reliable.*")}</text>
${hline(424)}
${links.map((l, i) => `<text class="mono fg loose" x="${28 + i * colW}" y="478" font-size="16">${esc(l)}</text>${i ? vline(i * colW, 424, height) : ""}`).join("")}`,
  });
}

// ---------- Write ----------

const SECTIONS = {
  receipts: { index: "00", title: "What the work *shows*", note: "6 receipts" },
  work: { index: "01", title: "Selected *work*", note: "4 projects" },
  experience: { index: "02", title: "Where I’ve *been*", note: "2023 — now" },
  toolkit: { index: "03", title: "The *toolkit*", note: "7 disciplines" },
};

for (const theme of Object.keys(THEMES)) {
  writeFileSync(out(`hero-${theme}.svg`), hero(theme));
  writeFileSync(out(`receipts-${theme}.svg`), receipts(theme));
  writeFileSync(out(`toolkit-${theme}.svg`), toolkit(theme));
  writeFileSync(out(`contact-${theme}.svg`), contact(theme));
  for (const [name, spec] of Object.entries(SECTIONS)) writeFileSync(out(`section-${name}-${theme}.svg`), section(theme, spec));
}
console.log("assets written");
