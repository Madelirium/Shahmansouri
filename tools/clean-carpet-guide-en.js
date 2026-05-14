const fs = require("node:fs");
const path = require("node:path");

const guideDir = path.join(process.cwd(), "carpet-guide");

const legacyCopyright = "\u00C2\u00A9";
const legacyRightQuote = "\u00E2\u20AC\u2122";
const legacyLeftQuote = "\u00E2\u20AC\u02DC";
const legacyLeftDoubleQuote = "\u00E2\u20AC\u0153";
const legacyRightDoubleQuote = "\u00E2\u20AC\u009D";
const legacyAgrave = "\u00C3\u00A0";
const legacyUgrave = "\u00C3\u00B9";
const legacyOgrave = "\u00C3\u00B2";
const legacyEgrave = "\u00C3\u00A8";
const legacyEacute = "\u00C3\u00A9";

const replacements = [
  [legacyCopyright, "&copy;"],
  [legacyRightQuote, "'"],
  [legacyLeftQuote, "'"],
  [legacyLeftDoubleQuote, '"'],
  [legacyRightDoubleQuote, '"'],
  [legacyAgrave, "à"],
  [legacyUgrave, "ù"],
  [legacyOgrave, "ò"],
  [legacyEgrave, "è"],
  [legacyEacute, "é"]
];

const repetitiveSnippets = [
  ", including history, materials, motifs, colours, regional variants and practical advice for choosing authentic handmade Persian rugs."
];

function cleanContent(content) {
  let output = content;

  for (const [from, to] of replacements) {
    output = output.split(from).join(to);
  }

  for (const snippet of repetitiveSnippets) {
    output = output.split(snippet).join(".");
  }

  output = output.replace(
    /Guide to ([^.]+?)\.\./g,
    "Guide to $1."
  );

  return output;
}

for (const fileName of fs.readdirSync(guideDir)) {
  if (!fileName.endsWith(".html")) {
    continue;
  }

  const fullPath = path.join(guideDir, fileName);
  const original = fs.readFileSync(fullPath, "utf8");
  const cleaned = cleanContent(original);

  if (cleaned !== original) {
    fs.writeFileSync(fullPath, cleaned, "utf8");
  }
}
