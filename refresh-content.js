#!/usr/bin/env node
/*
 * refresh-content.js
 *
 * Rebuilds content.js from the fallback text/attributes in each index.html file.
 * Usage:
 *   node refresh-content.js
 *   node refresh-content.js --check
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const CONTENT_FILE = path.join(ROOT, "content.js");
const CHECK_ONLY = process.argv.includes("--check");
const WARNINGS = [];

const SKIP_DIRS = new Set([".git", "node_modules"]);
const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function warn(message) {
  WARNINGS.push(message);
}

function toPosix(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function findIndexFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      findIndexFiles(path.join(dir, entry.name), out);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase() === "index.html") {
      out.push(path.join(dir, entry.name));
    }
  }

  return out.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function normalizeQuotes(input) {
  return input.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}

function parseAttrs(openTag) {
  const attrs = {};
  const attrPattern = /([^\s=\/<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attrPattern.exec(openTag))) {
    const name = match[1];
    if (name.startsWith("<")) continue;
    attrs[name.toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attrs;
}

function decodeEntities(input) {
  return input.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, body) => {
    const lower = body.toLowerCase();
    if (lower === "amp") return "&";
    if (lower === "lt") return "<";
    if (lower === "gt") return ">";
    if (lower === "quot") return '"';
    if (lower === "apos") return "'";
    if (lower === "nbsp") return " ";
    if (lower.startsWith("#x")) return String.fromCodePoint(parseInt(lower.slice(2), 16));
    if (lower.startsWith("#")) return String.fromCodePoint(parseInt(lower.slice(1), 10));
    return entity;
  });
}

function stripTags(input) {
  return input
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "");
}

function normalizeText(input, preserveLines) {
  const decoded = decodeEntities(input.replace(/\r\n?/g, "\n"));

  if (preserveLines) {
    return decoded
      .split("\n")
      .map((line) => line.trim().replace(/[\t ]+/g, " "))
      .filter(Boolean)
      .join("\n");
  }

  return decoded.replace(/\s+/g, " ").trim();
}

function extractText(innerHtml, attrs, file, dataPath) {
  const preserveLines = attrs["data-html"] === "true";
  const hasChildTag = /<\s*[a-z][\w:-]*\b/i.test(innerHtml);

  if (hasChildTag && !/^\s*<br\s*\/?>(\s*<br\s*\/?>)*\s*$/i.test(innerHtml)) {
    warn(`${file}: data-text="${dataPath}" contains child HTML; extracted flattened text.`);
  }

  const withLineBreaks = preserveLines ? innerHtml.replace(/<br\s*\/?>/gi, "\n") : innerHtml;
  return normalizeText(stripTags(withLineBreaks), preserveLines);
}

function isIndexSegment(segment) {
  return /^\d+$/.test(segment);
}

function describeValue(value) {
  return JSON.stringify(value);
}

function setPath(root, dataPath, value, source, seen) {
  const parts = dataPath.split(".").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) {
    warn(`${source}: empty content path ignored.`);
    return;
  }

  let cur = root;
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const key = isIndexSegment(part) ? Number(part) : part;
    const isLast = i === parts.length - 1;

    if (isLast) {
      if (Object.prototype.hasOwnProperty.call(cur, key)) {
        const oldValue = cur[key];
        if (describeValue(oldValue) !== describeValue(value)) {
          warn(
            `${source}: duplicate path "${dataPath}" changed from ${describeValue(oldValue)} to ${describeValue(value)}; latest value wins.`
          );
        }
      }
      cur[key] = value;
      seen.set(dataPath, source);
      return;
    }

    const nextPart = parts[i + 1];
    const nextContainer = isIndexSegment(nextPart) ? [] : {};

    if (cur[key] == null) {
      cur[key] = nextContainer;
    } else if (Array.isArray(nextContainer) !== Array.isArray(cur[key]) || typeof cur[key] !== "object") {
      warn(`${source}: path "${parts.slice(0, i + 1).join(".")}" already exists with incompatible shape.`);
      cur[key] = nextContainer;
    }

    cur = cur[key];
  }
}

function extractAttrValue(attrs, attrName) {
  return attrs[attrName.toLowerCase()];
}

function scanHtml(filePath, content, root, seen, stats) {
  const rel = toPosix(filePath);
  const normalized = normalizeQuotes(content);

  if (normalized !== content) {
    warn(`${rel}: curly quotes detected; parsed as normal quotes. Prefer straight quotes in HTML attributes.`);
  }

  const openTagPattern = /<([a-z][\w:-]*)(\s[^<>]*?\bdata-(?:text|attr)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)[^<>]*?)\s*(\/?)>/gim;
  let match;

  while ((match = openTagPattern.exec(normalized))) {
    const tagName = match[1].toLowerCase();
    const openTag = match[0];
    const attrs = parseAttrs(openTag);
    const source = `${rel}:${normalized.slice(0, match.index).split("\n").length}`;

    if (attrs["data-text"] != null) {
      const dataPath = attrs["data-text"].trim();
      stats.text += 1;

      let innerHtml = "";
      if (!VOID_TAGS.has(tagName) && match[3] !== "/") {
        const closePattern = new RegExp(`</\\s*${tagName}\\s*>`, "i");
        const afterOpen = normalized.slice(openTagPattern.lastIndex);
        const closeMatch = closePattern.exec(afterOpen);
        if (closeMatch) {
          innerHtml = afterOpen.slice(0, closeMatch.index);
        } else {
          warn(`${source}: missing closing </${tagName}> for data-text="${dataPath}".`);
        }
      }

      const text = extractText(innerHtml, attrs, rel, dataPath);
      if (!text) warn(`${source}: data-text="${dataPath}" has empty fallback text.`);
      setPath(root, dataPath, text, source, seen);
    }

    if (attrs["data-attr"] != null) {
      const mappings = attrs["data-attr"].split(";");

      for (const rawMapping of mappings) {
        const mapping = rawMapping.trim();
        if (!mapping) continue;

        const colon = mapping.indexOf(":");
        if (colon === -1) {
          warn(`${source}: invalid data-attr mapping "${mapping}".`);
          continue;
        }

        const attrName = mapping.slice(0, colon).trim();
        const dataPath = mapping.slice(colon + 1).trim();
        const value = extractAttrValue(attrs, attrName);
        stats.attr += 1;

        if (!attrName || !dataPath) {
          warn(`${source}: invalid data-attr mapping "${mapping}".`);
          continue;
        }

        if (value == null) {
          warn(`${source}: data-attr="${mapping}" points to missing attribute "${attrName}".`);
          continue;
        }

        setPath(root, dataPath, decodeEntities(value).trim(), source, seen);
      }
    }
  }
}

function findSparseArrays(value, prefix = "") {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      if (!(i in value)) warn(`Sparse array at ${prefix || "<root>"}: missing index ${i}.`);
      else findSparseArrays(value[i], `${prefix}.${i}`.replace(/^\./, ""));
    }
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      findSparseArrays(child, `${prefix}.${key}`.replace(/^\./, ""));
    }
  }
}

function isSafeKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key);
}

function formatKey(key) {
  return isSafeKey(key) ? key : JSON.stringify(key);
}

function formatValue(value, level = 0) {
  const indent = "  ".repeat(level);
  const childIndent = "  ".repeat(level + 1);

  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean" || value == null) return JSON.stringify(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((item) => typeof item === "string")) {
      const joined = value.map((item) => JSON.stringify(item)).join(", ");
      if (joined.length <= 100) return `[${joined}]`;
    }

    return `[` +
      `\n${value.map((item) => `${childIndent}${formatValue(item, level + 1)},`).join("\n")}` +
      `\n${indent}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";

    return `{` +
      `\n${entries.map(([key, child]) => `${childIndent}${formatKey(key)}: ${formatValue(child, level + 1)},`).join("\n")}` +
      `\n${indent}}`;
  }

  return JSON.stringify(value);
}

function replaceContentBlock(currentContent, nextObject) {
  const startMarker = "window.SITE_CONTENT =";
  const hydrateMarker = "/* ══════════════════════════════════════";
  const start = currentContent.indexOf(startMarker);
  const hydrate = currentContent.indexOf(hydrateMarker);

  if (start === -1) throw new Error(`Cannot find "${startMarker}" in content.js.`);
  if (hydrate === -1) throw new Error(`Cannot find hydrate marker in content.js.`);
  if (hydrate <= start) throw new Error("Hydrate marker appears before SITE_CONTENT assignment.");

  const before = currentContent.slice(0, start);
  const after = currentContent.slice(hydrate);
  return `${before}window.SITE_CONTENT = ${formatValue(nextObject, 0)};\n\n${after}`;
}

function main() {
  const htmlFiles = findIndexFiles(ROOT);
  const nextContent = {};
  const seen = new Map();
  const stats = { text: 0, attr: 0 };

  for (const filePath of htmlFiles) {
    scanHtml(filePath, fs.readFileSync(filePath, "utf8"), nextContent, seen, stats);
  }

  findSparseArrays(nextContent);

  const currentContent = fs.readFileSync(CONTENT_FILE, "utf8");
  const nextFileContent = replaceContentBlock(currentContent, nextContent);
  const changed = nextFileContent !== currentContent;

  console.log(`Scanned ${htmlFiles.length} index.html file(s).`);
  console.log(`Extracted ${stats.text} data-text value(s) and ${stats.attr} data-attr value(s).`);

  if (WARNINGS.length) {
    console.log(`\nWarnings (${WARNINGS.length}):`);
    for (const warning of WARNINGS) console.log(`- ${warning}`);
  }

  if (CHECK_ONLY) {
    if (changed) {
      console.error("\ncontent.js is stale. Run: node refresh-content.js");
      process.exitCode = 1;
    } else {
      console.log("\ncontent.js is up to date.");
    }
    return;
  }

  if (changed) {
    fs.writeFileSync(CONTENT_FILE, nextFileContent, "utf8");
    console.log("\nUpdated content.js.");
  } else {
    console.log("\ncontent.js is already up to date.");
  }
}

main();
