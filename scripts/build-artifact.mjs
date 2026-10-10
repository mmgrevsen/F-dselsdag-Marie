/**
 * Builds a single, self-contained HTML file with the whole experience in it:
 * one page, no server, no external requests – fonts, styles and scripts are
 * all embedded. Handy for sharing the link somewhere that isn't a Next.js host.
 *
 *   npm run build:artifact   (runs `next build` first – it reuses its CSS)
 *
 * The result lands in out/fodselsdag.html.
 */
import { build } from "esbuild";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chunksDir = path.join(root, ".next/static/chunks");
const mediaDir = path.join(root, ".next/static/media");

/**
 * Danish needs æ, ø and å, which all live in the "latin" subset. Minified,
 * that subset's unicode-range starts with the wildcard `U+??` (= U+0000-00FF),
 * so that marker is what separates it from cyrillic, greek, vietnamese and
 * latin-ext.
 */
const LATIN_SUBSET = "U+??";

async function collectCss() {
  let files;
  try {
    files = (await readdir(chunksDir)).filter((f) => f.endsWith(".css"));
  } catch {
    throw new Error("No .next build found. Run `next build` first.");
  }
  if (files.length === 0) throw new Error("No CSS in .next/static/chunks – run `next build` first.");
  const parts = await Promise.all(files.map((f) => readFile(path.join(chunksDir, f), "utf8")));
  return parts.join("\n");
}

/**
 * Drops the font faces Danish never needs (cyrillic, greek, vietnamese and
 * latin-ext) and turns the remaining font files into data: URIs.
 */
async function embedFonts(css) {
  const fontFiles = new Map();
  for (const name of await readdir(mediaDir)) {
    if (name.endsWith(".woff2")) fontFiles.set(name, path.join(mediaDir, name));
  }

  let kept = 0;
  let dropped = 0;

  const withFonts = await replaceAsync(css, /@font-face\s*{[^}]*}/g, async (block) => {
    if (!block.includes(LATIN_SUBSET)) {
      dropped += 1;
      return "";
    }
    kept += 1;
    return replaceAsync(block, /url\(([^)]+)\)/g, async (whole, rawUrl) => {
      const file = path.basename(rawUrl.replace(/["']/g, "").split("?")[0]);
      const filePath = fontFiles.get(file);
      if (!filePath) return whole;
      const base64 = (await readFile(filePath)).toString("base64");
      return `url(data:font/woff2;base64,${base64})`;
    });
  });

  return { css: withFonts, kept, dropped };
}

async function replaceAsync(input, pattern, replacer) {
  const replacements = [];
  input.replace(pattern, (...args) => {
    replacements.push(replacer(...args));
    return "";
  });
  const resolved = await Promise.all(replacements);
  let i = 0;
  return input.replace(pattern, () => resolved[i++]);
}

async function bundleScript() {
  const result = await build({
    entryPoints: [path.join(root, "scripts/artifact-entry.tsx")],
    bundle: true,
    minify: true,
    format: "iife",
    target: ["es2020"],
    jsx: "automatic",
    platform: "browser",
    write: false,
    define: { "process.env.NODE_ENV": '"production"' },
    alias: { "@": path.join(root, "src") },
    // The components carry "use client" for Next.js; it means nothing here.
    logOverride: { "unsupported-jsx-comment": "silent", "ignored-directive": "silent" },
    legalComments: "none",
  });
  return result.outputFiles[0].text;
}

/**
 * next/font puts its --font-* variables on generated class names that the
 * Next.js layout sets on <html>. There is no such layout here, so lift the
 * declarations onto :root instead.
 */
function hoistFontVariables(css) {
  const declarations = [];
  for (const [, body] of css.matchAll(/\.[A-Za-z0-9_-]+\{((?:--font-[a-z]+:[^;}]*;?)+)\}/g)) {
    declarations.push(body.replace(/;$/, ""));
  }
  if (declarations.length === 0) {
    throw new Error("Found no --font-* variables in the built CSS.");
  }
  return { css: `:root{${declarations.join(";")}}\n${css}`, count: declarations.length };
}

const [rawCss, script] = await Promise.all([collectCss(), bundleScript()]);
const { css: hoistedCss, count: fontVars } = hoistFontVariables(rawCss);
const { css, kept, dropped } = await embedFonts(hoistedCss);

const page = `<title>Maries 11-års fødselsdag</title>
<style>
${css}
/* The artifact host supplies <html> and <body>, so pin the stage to the frame. */
html, body { height: 100%; margin: 0; overflow: hidden; background: #070405; }
#oplevelse { height: 100%; }
</style>
<div id="oplevelse"></div>
<script>
${script}
</script>
`;

const outDir = path.join(root, "out");
await mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, "fodselsdag.html");
await writeFile(outFile, page, "utf8");

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;
console.log(`Skrev ${path.relative(root, outFile)}`);
console.log(`  skrifttyper: ${kept} beholdt, ${dropped} droppet, ${fontVars} variabler`);
console.log(`  css ${kb(css.length)} · js ${kb(script.length)} · i alt ${kb(page.length)}`);
