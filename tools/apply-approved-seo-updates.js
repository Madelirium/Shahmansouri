const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const csvPath = "C:\\Users\\samsh\\Downloads\\seo_title_meta_updates_for_codex.csv";

function parseCsv(content) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(field);
      field = "";
      if (row.some((value) => value !== "")) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((values) => {
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || "";
    });
    return entry;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
}

function setTag(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html;
}

function removeTag(html, pattern) {
  return html.replace(pattern, "");
}

const alternateLinkPattern = /\s*<link[^>]+(?:rel=["']alternate["'][^>]*hreflang=["'][^"']+["']|hreflang=["'][^"']+["'][^>]*rel=["']alternate["'])[^>]*>\s*/gi;

function buildAlternateBlock(file) {
  if (file === "guida-tappeti/index.html") {
    return [
      '<link rel="alternate" hreflang="it" href="https://shahmansouri.com/guida-tappeti/index.html">',
      '<link rel="alternate" hreflang="en" href="https://shahmansouri.com/carpet-guide/index.html">'
    ].join("\n  ");
  }

  if (file === "carpet-guide/index.html") {
    return [
      '<link rel="alternate" hreflang="it" href="https://shahmansouri.com/guida-tappeti/index.html">',
      '<link rel="alternate" hreflang="en" href="https://shahmansouri.com/carpet-guide/index.html">'
    ].join("\n  ");
  }

  if (file.startsWith("guida-tappeti/")) {
    const slug = path.basename(file);
    return [
      `<link rel="alternate" hreflang="it" href="https://shahmansouri.com/guida-tappeti/${slug}">`,
      `<link rel="alternate" hreflang="en" href="https://shahmansouri.com/carpet-guide/${slug}">`
    ].join("\n  ");
  }

  if (file.startsWith("carpet-guide/")) {
    const slug = path.basename(file);
    return [
      `<link rel="alternate" hreflang="it" href="https://shahmansouri.com/guida-tappeti/${slug}">`,
      `<link rel="alternate" hreflang="en" href="https://shahmansouri.com/carpet-guide/${slug}">`
    ].join("\n  ");
  }

  return "";
}

function updateJsonLdText(html, key, value) {
  return html.replace(new RegExp(`("${key}"\\s*:\\s*")[^"]*(")`), `$1${value}$2`);
}

function applyMetadata(file, proposedTitle, proposedDescription) {
  const abs = path.join(root, file);
  let html = fs.readFileSync(abs, "utf8");
  const titleEscaped = escapeHtml(proposedTitle);
  const descEscaped = escapeHtml(proposedDescription);

  html = setTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${titleEscaped}</title>`);
  html = setTag(
    html,
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${descEscaped}">`
  );
  html = setTag(
    html,
    /<meta\s+content=["'][^"']*["']\s+name=["']description["']\s*\/?>/i,
    `<meta name="description" content="${descEscaped}">`
  );
  html = setTag(
    html,
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${titleEscaped}">`
  );
  html = setTag(
    html,
    /<meta\s+content=["'][^"']*["']\s+property=["']og:title["']\s*\/?>/i,
    `<meta property="og:title" content="${titleEscaped}">`
  );
  html = setTag(
    html,
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${descEscaped}">`
  );
  html = setTag(
    html,
    /<meta\s+content=["'][^"']*["']\s+property=["']og:description["']\s*\/?>/i,
    `<meta property="og:description" content="${descEscaped}">`
  );

  if (file.includes("guida-tappeti") || file.includes("carpet-guide") || file === "index.html" || file === "index-en.html") {
    html = updateJsonLdText(html, "description", descEscaped);
    if (file.includes("guida-tappeti") || file.includes("carpet-guide")) {
      html = updateJsonLdText(html, "headline", titleEscaped);
    }
  }

  if (file.startsWith("guida-tappeti/") || file.startsWith("carpet-guide/")) {
    html = removeTag(html, alternateLinkPattern);
    const canonicalMatch = html.match(/<link rel="canonical" href="[^"]+">|<link href="[^"]+" rel="canonical"\/?>/i);
    const alternateBlock = buildAlternateBlock(file);
    if (canonicalMatch && alternateBlock) {
      html = html.replace(canonicalMatch[0], `${canonicalMatch[0]}\n  ${alternateBlock}`);
    }
  }

  fs.writeFileSync(abs, html, "utf8");
}

function updateDuplicateAbadeh() {
  const file = path.join(root, "guida-tappeti", "tappeti-di-abadeh.html");
  let html = fs.readFileSync(file, "utf8");
  const canonical = "https://shahmansouri.com/guida-tappeti/abadeh.html";
  const title = "Tappeti Abadeh | Guida ai Tappeti Persiani";
  const description = "Pagina duplicata della guida ai tappeti Abadeh. Usa la versione canonica della scheda principale.";

  html = setTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = setTag(html, /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="description" content="${description}">`);
  html = setTag(html, /<meta\s+content=["'][^"']*["']\s+name=["']description["']\s*\/?>/i, `<meta name="description" content="${description}">`);
  html = setTag(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  html = removeTag(html, /\s*<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*>\s*/gi);
  html = setTag(html, /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:title" content="${title}">`);
  html = setTag(html, /<meta\s+content=["'][^"']*["']\s+property=["']og:title["']\s*\/?>/i, `<meta property="og:title" content="${title}">`);
  html = setTag(html, /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:description" content="${description}">`);
  html = setTag(html, /<meta\s+content=["'][^"']*["']\s+property=["']og:description["']\s*\/?>/i, `<meta property="og:description" content="${description}">`);
  html = setTag(html, /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:url" content="${canonical}">`);
  html = setTag(html, /<meta\s+content=["'][^"']*["']\s+property=["']og:url["']\s*\/?>/i, `<meta property="og:url" content="${canonical}">`);
  html = removeTag(html, alternateLinkPattern);

  if (/<meta\s+name=["']robots["']/i.test(html)) {
    html = setTag(html, /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i, '<meta name="robots" content="noindex,follow">');
  } else {
    html = html.replace(/<link rel="canonical" href="[^"]+">/i, `$&\n  <meta name="robots" content="noindex,follow">`);
  }

  fs.writeFileSync(file, html, "utf8");
}

function buildSitemap() {
  const baseUrls = [
    { loc: "https://shahmansouri.com/", priority: "1.0" },
    { loc: "https://shahmansouri.com/index-en.html", priority: "0.9" },
    { loc: "https://shahmansouri.com/tappeti.html", priority: "0.9" },
    { loc: "https://shahmansouri.com/carpets.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/artigianato.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/crafts.html", priority: "0.7" },
    { loc: "https://shahmansouri.com/cultura.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/culture-en.html", priority: "0.7" },
    { loc: "https://shahmansouri.com/persia.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/persia-en.html", priority: "0.7" },
    { loc: "https://shahmansouri.com/contatti.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/contacts-en.html", priority: "0.7" },
    { loc: "https://shahmansouri.com/catalogo/index.html", priority: "0.9" },
    { loc: "https://shahmansouri.com/catalogo/index-en.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/guida-tappeti-persiani.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/guida-tappeti/index.html", priority: "0.8" },
    { loc: "https://shahmansouri.com/carpet-guide/index.html", priority: "0.7" },
    { loc: "https://shahmansouri.com/links-consigliati.html", priority: "0.5" },
    { loc: "https://shahmansouri.com/useful-links.html", priority: "0.5" },
    { loc: "https://shahmansouri.com/cookie-policy.html", priority: "0.4" },
    { loc: "https://shahmansouri.com/cookie-policy-en.html", priority: "0.4" },
    { loc: "https://shahmansouri.com/privacy-policy.html", priority: "0.4" },
    { loc: "https://shahmansouri.com/privacy-policy-en.html", priority: "0.4" }
  ];

  const guidePages = fs
    .readdirSync(path.join(root, "guida-tappeti"))
    .filter((name) => name.endsWith(".html") && name !== "index.html" && name !== "tappeti-di-abadeh.html")
    .sort()
    .map((name) => ({ loc: `https://shahmansouri.com/guida-tappeti/${name}`, priority: "0.7" }));

  const carpetGuidePages = fs
    .readdirSync(path.join(root, "carpet-guide"))
    .filter((name) => name.endsWith(".html") && name !== "index.html")
    .sort()
    .map((name) => ({ loc: `https://shahmansouri.com/carpet-guide/${name}`, priority: "0.6" }));

  const productPages = fs
    .readdirSync(path.join(root, "catalogo", "products"))
    .filter((name) => name.endsWith(".html"))
    .sort()
    .map((name) => {
      const isEnglish = name.startsWith("persian-");
      return {
        loc: `https://shahmansouri.com/catalogo/products/${name}`,
        priority: isEnglish ? "0.6" : "0.7"
      };
    });

  const allUrls = [...baseUrls, ...guidePages, ...carpetGuidePages, ...productPages];
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map((entry) => [
      "  <url>",
      `    <loc>${entry.loc}</loc>`,
      `    <priority>${entry.priority}</priority>`,
      "  </url>"
    ].join("\n")),
    "</urlset>",
    ""
  ].join("\n");

  fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
}

const csv = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(csv);

const eligibleRows = rows.filter((row) => {
  const priority = (row.priority || "").toLowerCase();
  if (!["critical", "high"].includes(priority)) {
    return false;
  }
  if (row.file === "index.html") {
    return false;
  }
  if ((row.proposed_title || "").toUpperCase() === "KEEP") {
    return false;
  }
  return /update title\/meta|align with new home metadata/i.test(row.action || "");
});

for (const row of eligibleRows) {
  applyMetadata(row.file, row.proposed_title, row.proposed_description);
}

updateDuplicateAbadeh();
buildSitemap();

console.log(`Updated ${eligibleRows.length} files, duplicate Abadeh, and sitemap.`);
