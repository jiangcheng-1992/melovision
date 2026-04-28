import fs from "fs";
import path from "path";

const convertHtmlToJsx = (html) => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return html;

  return bodyMatch[1]
    .replace(/class=/g, "className=")
    .replace(/for=/g, "htmlFor=")
    .replace(/tabindex=/g, "tabIndex=")
    .replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}")
    .replace(/<(img|input|br|hr|meta|link)([^>]*?)(?<!\/)>/g, "<$1$2 />")
    .replace(/style="([^"]+)"/g, (_, s) => {
      const obj = s
        .split(";")
        .filter(Boolean)
        .map((kv) => {
          const [k, v] = kv.split(":").map((x) => x.trim());
          if (!k || !v) return "";
          const camelKey = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          return `${camelKey}: '${v}'`;
        })
        .filter(Boolean)
        .join(", ");

      return `style={{${obj}}}`;
    });
};

const SRC = "_stitch-source";
const OUT = "_converted";

const walkHtmlFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkHtmlFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
};

if (!fs.existsSync(SRC)) {
  console.error(`Directory ${SRC} does not exist. Put Stitch-exported .html and .png files there first.`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const files = walkHtmlFiles(SRC);

if (files.length === 0) {
  console.error(`No .html files found under ${SRC}.`);
  process.exit(1);
}

for (const file of files) {
  const html = fs.readFileSync(file, "utf-8");
  const jsx = convertHtmlToJsx(html);
  const relativePath = path.relative(SRC, file);
  const outPath = path.join(OUT, relativePath.replace(/\.html$/i, ".jsx"));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    `export default function Page() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`,
  );
  console.log(`Converted ${relativePath} -> ${outPath}`);
}

console.log(`\nDone: converted ${files.length} files.`);
