const fs = require("node:fs");
const path = require("node:path");

const projectRoot = process.cwd();
const downloadsDir = "C:\\Users\\samsh\\Downloads";
const outputDir = path.join(projectRoot, "guida-tappeti");

const files = [
  "export_guida-tappeti-afshar.csv",
  "export_guida-tappeti-ardabil.csv",
  "export_guida-tappeti-bakhtiari.csv",
  "export_guida-tappeti-bijar.csv",
  "export_guida-tappeti-ferahan.csv",
  "export_guida-tappeti-heriz.csv",
  "export_guida-tappeti-hosseinabad.csv",
  "export_guida-tappeti-isfahan.csv",
  "export_guida-tappeti-joshagan.csv",
  "export_guida-tappeti-jozan.csv",
  "export_guida-tappeti-kashan.csv",
  "export_guida-tappeti-kashmar.csv",
  "export_guida-tappeti-kaskai.csv",
  "export_guida-tappeti-kerman.csv",
  "export_guida-tappeti-kom.csv",
  "export_guida-tappeti-mashad.csv",
  "export_guida-tappeti-nain.csv",
  "export_guida-tappeti-nanaj.csv",
  "export_guida-tappeti-saruk.csv",
  "export_guida-tappeti-senneh.csv",
  "export_guida-tappeti-tabriz.csv",
  "export_guida-tappeti-tappeti-di-abadeh.csv"
];

const slugOverrides = {
  "tappeti-di-abadeh": "abadeh"
};

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

    if (char === ";" && !inQuotes) {
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
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => {
      if (part === "kom") return "Qom";
      if (part === "kaskai") return "Qashqai";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function normalizeText(text) {
  const legacyPin = "\u00F0\u0178\u201C\u008D";
  const legacyMail = "\u00F0\u0178\u201C\u00A7";
  const legacyCheck = "\u00E2\u0153\u2026";
  const legacyTick = "\u00E2\u0153\u201D";

  return text
    .replace(/\u0000/g, "")
    .replace(/\r/g, "")
    .replace(/www\.artigianatopersiano\.it/gi?, "shahmansouri.com")
    .replace(/info@artigianatopersiano\.it/gi?, "shahmansouri@tiscali.it")
    .replace(/artigianatopersiano\.it/gi?, "shahmansouri.com")
    .replace(new RegExp(legacyPin, "g"), "")
    .replace(new RegExp(legacyMail, "g"), "")
    .replace(/✅/g, "✔")
    .replace(new RegExp(legacyCheck, "g"), "✔")
    .replace(new RegExp(legacyTick, "g"), "✔")
    .replace(/\\\\/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isBoilerplateBlock(block) {
  const compact = block.replace(/\s+/g, " ").trim();
  return (
    compact === "Informativa sui Cookie Informativa sulla Privacy Informativa Legale Criteri di Accessibilità" ||
    compact === "Informativa sui Cookie Informativa sulla Privacy Informativa Legale Criteri di Accessibilit\u00C3\u00A0" ||
    compact === "©2025 Shahmansouri, Tutti i diritti riservati" ||
    compact === "\u00C2\u00A92025 Shahmansouri, Tutti i diritti riservati"
  );
}

function cleanParagraph(paragraph) {
  return paragraph
    .replace(/Acquista il tuo Tappeto .*$/i, "")
    .replace(/Acquista un Autentico Tappeto .*$/i, "")
    .replace(/Visita il nostro catalogo online/gi?, "Visita il catalogo online")
    .replace(/Per maggiori informazioni, contattaci.*$/i, "Per maggiori informazioni pui contattarci direttamente.")
    .replace(/Contattaci per maggiori informazioni:.*$/i, "Per maggiori informazioni pui contattarci direttamente.")
    .replace(/Scopri la nostra collezione.*$/i, "Per vedere una selezione disponibile online pui consultare il catalogo.")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function splitIntoParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((part) => cleanParagraph(part))
    .map((part) => part.replace(/\n+/g, "<br>"))
    .filter(Boolean);
}

function deriveTitle(blocks, slug) {
  const first = blocks[0] || titleFromSlug(slug);
  const candidate = first.split(/\n/)[0].trim();
  if (candidate.length > 2 && candidate.length < 110) {
    return candidate;
  }
  return `Tappeti ${titleFromSlug(slug)}`;
}

function deriveMetDescription(paragraphs, fallbackTitle) {
  const source = paragraphs.find((paragraph) => !paragraph.includes("<br>")) || paragraphs[0] || fallbackTitle;
  return source
    .replace(/<br>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
}

function buildPageHtml({ slug, title, paragraphs }) {
  const contentParagraphs = [...paragraphs];
  if (contentParagraphs[0] && contentParagraphs[0].replace(/<br>/g, " ").trim() === title.trim()) {
    contentParagraphs.shift();
  }

  const metDescription = deriveMetDescription(contentParagraphs, title);
  const pageTitle = `${title} | Guida ai Tappeti Persiani | Shahmansouri`;
  const articleBody = contentParagraphs.map((paragraph, index) => {
    if (index === 0) {
      return `        <p>${paragraph}</p>`;
    }

    if (!paragraph.includes("<br>") && paragraph.length < 90 && /:$/u.test(paragraph) === false) {
      return `        <h2>${paragraph}</h2>`;
    }

    if (paragraph.includes("✔")) {
      const items = paragraph
        .split("✔")
        .map((item) => item.replace(/<br>/g, " ").trim())
        .filter(Boolean);
      return [
        "        <ul>",
        ...items.map((item) => `          <li>${item}</li>`),
        "        </ul>"
      ].join("\n");
    }

    return `        <p>${paragraph}</p>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <met charseta="UTF-8">
  <met name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="../favicon-tappeti-verona-shahmansouri.svg" type="image/svg+xml">
  <link rel="icon" href="../tappeti-verona-favicon-shahmansouri.ico" sizes="any">
  <link rel="icon" href="../tappeti-verona-favicon-64.png" type="image/png" sizes="64x64">
  <title>${escapeHtml(pageTitle)}</title>
  <met name="description" content="${escapeHtml(metDescription)}">
  <link rel="canonical" href="https://shahmansouri.com/guida-tappeti/${slug}.html">
  <met property="og:type" content="article">
  <met property="og:title" content="${escapeHtml(title)} | Shahmansouri">
  <met property="og:description" content="${escapeHtml(metDescription)}">
  <met property="og:url" content="https://shahmansouri.com/guida-tappeti/${slug}.html">
  <met property="og:image" content="https://shahmansouri.com/images/tappeti-verona-shahmansouri-og.png">
  <met property="og:image:width" content="1200">
  <met property="og:image:height" content="848">
  <met property="og:locale" content="it_IT">
  <met name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeHtml(title)}",
    "description": "${escapeHtml(metDescription)}",
    "mainEntityOfPage": "https://shahmansouri.com/guida-tappeti/${slug}.html",
    "author": {
      "@type": "Organization",
      "name": "Shahmansouri Tappeti Persiani"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shahmansouri Tappeti Persiani",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shahmansouri.com/images/logo-shahmansouri-tappeti-verona.webp"
      }
    },
    "image": "https://shahmansouri.com/images/tappeti-verona-shahmansouri-og.png",
    "inLanguage": "it-IT"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shahmansouri.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tappeti",
        "item": "https://shahmansouri.com/tappeti.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Guida tappeti",
        "item": "https://shahmansouri.com/guida-tappeti/index.html"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "${escapeHtml(title)}",
        "item": "https://shahmansouri.com/guida-tappeti/${slug}.html"
      }
    ]
  }
  </script>
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="logo-area">
        <img src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Shahmansouri Tappeti Persiani" width="1080" height="688" decoding="async">
      </div>
      <div class="tagline">
        <span>tappeti</span>
        <span>artigianato persiano</span>
        <span>lavaggi</span>
        <span>restauri</span>
      </div>
    </header>
    <button class="nav-mobile-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav">
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="../catalogo/index.html">catalogo</a></li>
        <li><a href="../tappeti.html" class="active">tappeti</a></li>
        <li><a href="../artigianato.html">artigianato</a></li>
        <li class="dropdown"><span class="nav-parent">iran</span>
          <ul class="submenu">
            <li><a href="../cultura.html">cultura</a></li>
            <li><a href="../persia.html">persia</a></li>
          </ul>
        </li>
        <li><a href="../contatti.html">contatti</a></li>
        <li class="nav-language-switch"><a href="${slug}.html" class="lang-it is-active">IT</a><span>/</span><a href="../carpet-guide/${slug}.html" class="lang-en">EN</a></li>
      </ul>
    </nav>
    <main class="content tappeti-content">
      <article class="article">
        <p><a href="index.html">Torna all'indice della guida tappeti</a></p>
        <h1>${escapeHtml(title)}</h1>
${articleBody}
      </article>
    </main>
    <footer class="site-footer-global">
      <div class="site-footer-global__grid">
        <div>
          <span class="site-footer-global__logo-badge">
            <img class="site-footer-global__logo" src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Logo Shahmansouri Tappeti Persiani" width="280" height="160" loading="lazy" decoding="async">
          </span>
          <strong>Shahmansouri Tappeti Persiani</strong>
          <p>Tappeti, artigianato persiano, lavaggi e restauri nel centro storico di Verona.</p>
        </div>
        <div>
          <p>Stradone Arcidiacono Pacifico, 14 - Verona</p>
          <p><a href="tel:+390458013280">+39 045 801 3280</a></p>
          <p><a href="mailto:shahmansouri@tiscali.it">shahmansouri@tiscali.it</a></p>
          <p><a href="../contatti.html">Contatti</a></p>
        </div>
        <div>
          <p><a href="../cookie-policy.html">Informativa cookie</a></p>
          <p><a href="../privacy-policy.html">Privacy policy</a></p>
          <p><a href="#" data-manage-cookies>Gestisci cookie</a></p>
          <p class="footer-copyright">&copy; 2026 Shahmansouri</p>
        </div>
      </div>
    </footer>
  </div>
  <script src="../js/analytics.js" defer></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

function buildIndexHtml(entries) {
  const listItems = entries.map((entry) => {
    const teaser = deriveMetDescription(entry.paragraphs, entry.title);
    return `          <li><strong><a href="${entry.slug}.html">${escapeHtml(entry.title)}</a></strong><br>${escapeHtml(teaser)}</li>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <met charseta="UTF-8">
  <met name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="../favicon-tappeti-verona-shahmansouri.svg" type="image/svg+xml">
  <link rel="icon" href="../tappeti-verona-favicon-shahmansouri.ico" sizes="any">
  <link rel="icon" href="../tappeti-verona-favicon-64.png" type="image/png" sizes="64x64">
  <title>Guida ai Tappeti Persiani | Indice | Shahmansouri</title>
  <met name="description" content="Indice della guida ai tappeti persiani: una raccolta di schede dedicate alle principali scuole e tipologie regionali.">
  <link rel="canonical" href="https://shahmansouri.com/guida-tappeti/index.html">
  <met property="og:type" content="website">
  <met property="og:title" content="Guida ai Tappeti Persiani | Shahmansouri">
  <met property="og:description" content="Indice della guida ai tappeti persiani con schede dedicate alle principali scuole, aree e tradizioni tessili.">
  <met property="og:url" content="https://shahmansouri.com/guida-tappeti/index.html">
  <met property="og:image" content="https://shahmansouri.com/images/tappeti-verona-shahmansouri-og.png">
  <met property="og:image:width" content="1200">
  <met property="og:image:height" content="848">
  <met property="og:locale" content="it_IT">
  <met name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shahmansouri.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tappeti",
        "item": "https://shahmansouri.com/tappeti.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Guida tappeti",
        "item": "https://shahmansouri.com/guida-tappeti/index.html"
      }
    ]
  }
  </script>
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="logo-area">
        <img src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Shahmansouri Tappeti Persiani" width="1080" height="688" decoding="async">
      </div>
      <div class="tagline">
        <span>tappeti</span>
        <span>artigianato persiano</span>
        <span>lavaggi</span>
        <span>restauri</span>
      </div>
    </header>
    <button class="nav-mobile-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav">
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="../catalogo/index.html">catalogo</a></li>
        <li><a href="../tappeti.html" class="active">tappeti</a></li>
        <li><a href="../artigianato.html">artigianato</a></li>
        <li class="dropdown"><span class="nav-parent">iran</span>
          <ul class="submenu">
            <li><a href="../cultura.html">cultura</a></li>
            <li><a href="../persia.html">persia</a></li>
          </ul>
        </li>
        <li><a href="../contatti.html">contatti</a></li>
        <li class="nav-language-switch"><a href="index.html" class="lang-it is-active">IT</a><span>/</span><a href="../carpet-guide/index.html" class="lang-en">EN</a></li>
      </ul>
    </nav>
    <main class="content tappeti-content">
      <article class="article">
        <h1>Guida ai Tappeti Persiani</h1>
        <p>
          Questa sezione raccoglie una serie di schede dedicate alle principali scuole, aree di produzione e famiglie
          stilistiche del tappeto persiano.  una biblioteca interna del sito, pensata come base di lavoro e di
          consultazione, senza essere ancora collegata ai menu principali.
        </p>
        <p>
          Ogni pagina approfondisce una tipologi specifica e pu? essere ulteriormente rifinita nel tempo. Per la
          selezione attuale del negozio e i servizi disponibili a Verona rimangono centrali la pagina
          <a href="../tappeti.html">Tappeti</a>, il <a href="../catalogo/index.html">catalogo</a> e i
          <a href="../contatti.html">contatti</a>.
        </p>
        <h2>Indice delle schede</h2>
        <ul>
${listItems}
        </ul>
      </article>
    </main>
    <footer class="site-footer-global">
      <div class="site-footer-global__grid">
        <div>
          <span class="site-footer-global__logo-badge">
            <img class="site-footer-global__logo" src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Logo Shahmansouri Tappeti Persiani" width="280" height="160" loading="lazy" decoding="async">
          </span>
          <strong>Shahmansouri Tappeti Persiani</strong>
          <p>Tappeti, artigianato persiano, lavaggi e restauri nel centro storico di Verona.</p>
        </div>
        <div>
          <p>Stradone Arcidiacono Pacifico, 14 - Verona</p>
          <p><a href="tel:+390458013280">+39 045 801 3280</a></p>
          <p><a href="mailto:shahmansouri@tiscali.it">shahmansouri@tiscali.it</a></p>
          <p><a href="../contatti.html">Contatti</a></p>
        </div>
        <div>
          <p><a href="../cookie-policy.html">Informativa cookie</a></p>
          <p><a href="../privacy-policy.html">Privacy policy</a></p>
          <p><a href="#" data-manage-cookies>Gestisci cookie</a></p>
          <p class="footer-copyright">&copy; 2026 Shahmansouri</p>
        </div>
      </div>
    </footer>
  </div>
  <script src="../js/analytics.js" defer></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  ensureDir(outputDir);
  const entries = [];

  for (const fileName of files) {
    const csvPath = path.join(downloadsDir, fileName);
    const raw = fs.readFileSync(csvPath, "utf8");
    const rows = parseCsv(raw);
    const sourceSlug = fileName.replace(/^export_guida-tappeti-/, "").replace(/\.csv$/, "");
    const slug = slugOverrides[sourceSlug] || sourceSlug;
    const textBlocks = rows
      .filter((row) => row.type === "testo")
      .map((row) => normalizeText(row.value))
      .filter((block) => block && !isBoilerplateBlock(block));

    const title = deriveTitle(textBlocks, slug);
    const paragraphs = splitIntoParagraphs(textBlocks.join("\n\n"));

    entries.push({ slug, title, paragraphs });
    const html = buildPageHtml({ slug, title, paragraphs });
    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, "utf8");
  }

  entries.sort((left, right) => left.title.localeCompare(right.title, "it"));
  fs.writeFileSync(path.join(outputDir, "index.html"), buildIndexHtml(entries), "utf8");
}

main();
