const fs = require("node:fs");
const path = require("node:path");

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "carpet-guide");

const slugs = [
  "abadeh",
  "afshar",
  "ardabil",
  "bakhtiari",
  "bijar",
  "ferahan",
  "heriz",
  "hosseinabad",
  "isfahan",
  "joshagan",
  "jozan",
  "kashan",
  "kashmar",
  "kaskai",
  "kerman",
  "kom",
  "mashad",
  "nain",
  "nanaj",
  "saruk",
  "senneh",
  "tabriz"
];

const titleOverrides = {
  abadeh: "Abadeh rugs",
  afshar: "Afshar rugs",
  ardabil: "Ardabil rugs",
  bakhtiari: "Bakhtiari rugs",
  bijar: "Bijar rugs",
  ferahan: "Ferahan rugs",
  heriz: "Heriz rugs",
  hosseinabad: "Hosseinabad rugs",
  isfahan: "Isfahan rugs",
  joshagan: "Joshagan rugs",
  jozan: "Jozan rugs",
  kashan: "Kashan rugs",
  kashmar: "Kashmar rugs",
  kaskai: "Qashqai rugs",
  kerman: "Kerman rugs",
  kom: "Qom rugs",
  mashad: "Mashad rugs",
  nain: "Nain rugs",
  nanaj: "Nanaj rugs",
  saruk: "Saruk rugs",
  senneh: "Senneh rugs",
  tabriz: "Tabriz rugs"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildPageHtml(slug, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="../favicon-tappeti-verona-shahmansouri.svg" type="image/svg+xml">
  <link rel="icon" href="../tappeti-verona-favicon-shahmansouri.ico" sizes="any">
  <link rel="icon" href="../tappeti-verona-favicon-64.png" type="image/png" sizes="64x64">
  <title>${escapeHtml(title)} | Carpet Guide | Shahmansouri</title>
  <meta name="description" content="English guide page for ${escapeHtml(title.toLowerCase())}, with an Italian counterpart already available in the Shahmansouri rug guide.">
  <link rel="canonical" href="https://shahmansouri.com/carpet-guide/${slug}.html">
  <link rel="alternate" hreflang="it" href="https://shahmansouri.com/guida-tappeti/${slug}.html">
  <link rel="alternate" hreflang="en" href="https://shahmansouri.com/carpet-guide/${slug}.html">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)} | Shahmansouri">
  <meta property="og:description" content="English guide page for ${escapeHtml(title.toLowerCase())}.">
  <meta property="og:url" content="https://shahmansouri.com/carpet-guide/${slug}.html">
  <meta property="og:image" content="https://shahmansouri.com/images/tappeti-verona-shahmansouri-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="848">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeHtml(title)}",
    "description": "English guide page for ${escapeHtml(title.toLowerCase())}.",
    "mainEntityOfPage": "https://shahmansouri.com/carpet-guide/${slug}.html",
    "author": {
      "@type": "Organization",
      "name": "Shahmansouri Persian Carpets"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shahmansouri Persian Carpets",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shahmansouri.com/images/logo-shahmansouri-tappeti-verona.webp"
      }
    },
    "image": "https://shahmansouri.com/images/tappeti-verona-shahmansouri-og.png",
    "inLanguage": "en-GB"
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
        "item": "https://shahmansouri.com/index-en.html"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Carpets",
        "item": "https://shahmansouri.com/carpets.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Carpet guide",
        "item": "https://shahmansouri.com/carpet-guide/index.html"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "${escapeHtml(title)}",
        "item": "https://shahmansouri.com/carpet-guide/${slug}.html"
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
        <img src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Shahmansouri Persian Carpets" width="1080" height="688" decoding="async">
      </div>
      <div class="tagline">
        <span>carpets</span>
        <span>persian crafts</span>
        <span>washing</span>
        <span>restoration</span>
      </div>
    </header>
    <button class="nav-mobile-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav">
      <ul>
        <li><a href="../index-en.html">home</a></li>
        <li><a href="../catalogo/index-en.html">catalog</a></li>
        <li><a href="../carpets.html" class="active">carpets</a></li>
        <li><a href="../crafts.html">crafts</a></li>
        <li class="dropdown"><span class="nav-parent">iran</span>
          <ul class="submenu">
            <li><a href="../culture-en.html">culture</a></li>
            <li><a href="../persia-en.html">persia</a></li>
          </ul>
        </li>
        <li><a href="../contacts-en.html">contacts</a></li>
        <li class="nav-language-switch"><a href="../guida-tappeti/${slug}.html" class="lang-it">IT</a><span>/</span><a href="${slug}.html" class="lang-en is-active">EN</a></li>
      </ul>
    </nav>
    <main class="content tappeti-content">
      <article class="article">
        <p><a href="index.html">Back to the carpet guide index</a></p>
        <h1>${escapeHtml(title)}</h1>
        <p>
          This English guide page has been prepared as the counterpart of the Italian article already available in the
          Shahmansouri rug guide.
        </p>
        <p>
          For now, the most complete version of this content is the Italian page:
          <a href="../guida-tappeti/${slug}.html">open the Italian guide for ${escapeHtml(title.toLowerCase())}</a>.
        </p>
        <p>
          If you would like direct help choosing a rug, understanding origin, weave, materials or proportions, you can
          also explore the <a href="../catalogo/index-en.html">catalog</a>, visit the main
          <a href="../carpets.html">carpets page</a>, or <a href="../contacts-en.html">contact the shop</a>.
        </p>
      </article>
    </main>
    <footer class="site-footer-global">
      <div class="site-footer-global__grid">
        <div>
          <span class="site-footer-global__logo-badge">
            <img class="site-footer-global__logo" src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Shahmansouri Persian Carpets logo" width="280" height="160" loading="lazy" decoding="async">
          </span>
          <strong>Shahmansouri Persian Carpets</strong>
          <p>Persian carpets, handicrafts, washing and restoration in Verona's historic centre.</p>
        </div>
        <div>
          <p>Stradone Arcidiacono Pacifico, 14 - Verona</p>
          <p><a href="tel:+390458013280">+39 045 801 3280</a></p>
          <p><a href="mailto:shahmansouri@tiscali.it">shahmansouri@tiscali.it</a></p>
          <p><a href="../contacts-en.html">Contacts</a></p>
        </div>
        <div>
          <p><a href="../cookie-policy-en.html">Cookie policy</a></p>
          <p><a href="../privacy-policy-en.html">Privacy policy</a></p>
          <p><a href="#" data-manage-cookies>Manage cookies</a></p>
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
    return `          <li><strong><a href="${entry.slug}.html">${escapeHtml(entry.title)}</a></strong><br>English counterpart of the Italian guide page.</li>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="../favicon-tappeti-verona-shahmansouri.svg" type="image/svg+xml">
  <link rel="icon" href="../tappeti-verona-favicon-shahmansouri.ico" sizes="any">
  <link rel="icon" href="../tappeti-verona-favicon-64.png" type="image/png" sizes="64x64">
  <title>Carpet Guide | Index | Shahmansouri</title>
  <meta name="description" content="Index of English carpet guide pages linked to the Italian Shahmansouri guide to Persian rug schools and regional types.">
  <link rel="canonical" href="https://shahmansouri.com/carpet-guide/index.html">
  <link rel="alternate" hreflang="it" href="https://shahmansouri.com/guida-tappeti/index.html">
  <link rel="alternate" hreflang="en" href="https://shahmansouri.com/carpet-guide/index.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Carpet Guide | Shahmansouri">
  <meta property="og:description" content="Index of English carpet guide pages linked to the Italian Shahmansouri rug guide.">
  <meta property="og:url" content="https://shahmansouri.com/carpet-guide/index.html">
  <meta property="og:image" content="https://shahmansouri.com/images/tappeti-verona-shahmansouri-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="848">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shahmansouri.com/index-en.html"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Carpets",
        "item": "https://shahmansouri.com/carpets.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Carpet guide",
        "item": "https://shahmansouri.com/carpet-guide/index.html"
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
        <img src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Shahmansouri Persian Carpets" width="1080" height="688" decoding="async">
      </div>
      <div class="tagline">
        <span>carpets</span>
        <span>persian crafts</span>
        <span>washing</span>
        <span>restoration</span>
      </div>
    </header>
    <button class="nav-mobile-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav">
      <ul>
        <li><a href="../index-en.html">home</a></li>
        <li><a href="../catalogo/index-en.html">catalog</a></li>
        <li><a href="../carpets.html" class="active">carpets</a></li>
        <li><a href="../crafts.html">crafts</a></li>
        <li class="dropdown"><span class="nav-parent">iran</span>
          <ul class="submenu">
            <li><a href="../culture-en.html">culture</a></li>
            <li><a href="../persia-en.html">persia</a></li>
          </ul>
        </li>
        <li><a href="../contacts-en.html">contacts</a></li>
        <li class="nav-language-switch"><a href="../guida-tappeti/index.html" class="lang-it">IT</a><span>/</span><a href="index.html" class="lang-en is-active">EN</a></li>
      </ul>
    </nav>
    <main class="content tappeti-content">
      <article class="article">
        <h1>Carpet Guide</h1>
        <p>
          This section mirrors the Italian rug guide structure and keeps the English pages grouped in a dedicated
          folder, without adding them to the main site navigation for now.
        </p>
        <p>
          The Italian guide remains the more complete editorial base at this stage. These English pages give the
          structure a clean counterpart and can be expanded one by one over time.
        </p>
        <h2>Index of pages</h2>
        <ul>
${listItems}
        </ul>
      </article>
    </main>
    <footer class="site-footer-global">
      <div class="site-footer-global__grid">
        <div>
          <span class="site-footer-global__logo-badge">
            <img class="site-footer-global__logo" src="../images/logo-shahmansouri-tappeti-verona.webp" alt="Shahmansouri Persian Carpets logo" width="280" height="160" loading="lazy" decoding="async">
          </span>
          <strong>Shahmansouri Persian Carpets</strong>
          <p>Persian carpets, handicrafts, washing and restoration in Verona's historic centre.</p>
        </div>
        <div>
          <p>Stradone Arcidiacono Pacifico, 14 - Verona</p>
          <p><a href="tel:+390458013280">+39 045 801 3280</a></p>
          <p><a href="mailto:shahmansouri@tiscali.it">shahmansouri@tiscali.it</a></p>
          <p><a href="../contacts-en.html">Contacts</a></p>
        </div>
        <div>
          <p><a href="../cookie-policy-en.html">Cookie policy</a></p>
          <p><a href="../privacy-policy-en.html">Privacy policy</a></p>
          <p><a href="#" data-manage-cookies>Manage cookies</a></p>
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

function main() {
  ensureDir(outputDir);
  const entries = slugs.map((slug) => ({
    slug,
    title: titleOverrides[slug]
  }));

  for (const entry of entries) {
    fs.writeFileSync(path.join(outputDir, `${entry.slug}.html`), buildPageHtml(entry.slug, entry.title), "utf8");
  }

  fs.writeFileSync(path.join(outputDir, "index.html"), buildIndexHtml(entries), "utf8");
}

main();
