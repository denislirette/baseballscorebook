#!/usr/bin/env node
/**
 * sync-tokens.js: Generate CSS custom properties and layout-config defaults
 * from design-tokens.json (single source of truth for Figma <-> code sync).
 *
 * Usage:
 *   node scripts/sync-tokens.js           # preview to stdout
 *   node scripts/sync-tokens.js --write   # overwrite css/style.css and js/layout-config.js
 *
 * Figma workflow:
 *   1. Edit variables in Figma -> export via Tokens Studio -> design-tokens.json
 *   2. Run: npm run sync-tokens
 *   3. CSS vars + layout constants update automatically
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const tokens = JSON.parse(readFileSync(resolve(ROOT, 'design-tokens.json'), 'utf-8'));
const write = process.argv.includes('--write');

// ── Helpers ─────────────────────────────────────────────────────

function findMatchingBrace(source, openIdx) {
  let depth = 1;
  for (let i = openIdx + 1; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') depth--;
    if (depth === 0) return i;
  }
  return -1;
}

// ── CSS generation ──────────────────────────────────────────────

function buildCSSVars(colorSet) {
  return Object.values(colorSet)
    .map(token => `  ${token.description}: ${token.value};`)
    .join('\n');
}

const lightCSS = buildCSSVars(tokens.scorecard.colors.light);
const darkCSS = buildCSSVars(tokens.scorecard.colors.dark);

// Replace --sc-* vars within a CSS selector block
function replaceScVars(source, selectorStart, newVars) {
  const selectorIdx = source.indexOf(selectorStart);
  if (selectorIdx === -1) {
    console.error(`Could not find selector: ${selectorStart}`);
    return source;
  }

  const braceIdx = source.indexOf('{', selectorIdx);
  const closingBrace = findMatchingBrace(source, braceIdx);
  const block = source.slice(braceIdx + 1, closingBrace);
  const lines = block.split('\n');

  const newLines = [];
  let skipping = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Start skipping at first --sc- line or its preceding comment
    if (!skipping && trimmed.startsWith('--sc-')) {
      skipping = true;
      newLines.push('');
      newLines.push('  /* SVG scorecard: synced from design-tokens.json */');
      newLines.push(newVars);
    }

    if (skipping) {
      // Keep skipping --sc- lines, empty lines, and comments within the block
      if (trimmed.startsWith('--sc-') || trimmed === '' ||
          trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        continue;
      }
      // Hit a non-sc line; stop skipping
      skipping = false;
    }

    newLines.push(line);
  }

  return source.slice(0, braceIdx + 1) + newLines.join('\n') + source.slice(closingBrace);
}

// Patch CSS
const cssPath = resolve(ROOT, 'css/style.css');
let css = readFileSync(cssPath, 'utf-8');
css = replaceScVars(css, ':root {', lightCSS);
css = replaceScVars(css, '[data-theme="dark"]', darkCSS);

// ── Layout config generation ────────────────────────────────────

const configPath = resolve(ROOT, 'js/layout-config.js');
let config = readFileSync(configPath, 'utf-8');

const sizingEntries = Object.values(tokens.scorecard.sizing)
  .map(token => `  ${token.description}: ${token.value},`)
  .join('\n');

const defaultsRegex = /export const DEFAULTS = Object\.freeze\(\{[\s\S]*?\}\);/;
const newDefaults =
  'export const DEFAULTS = Object.freeze({\n' +
  '  // Synced from design-tokens.json\n' +
  sizingEntries + '\n' +
  '});';

config = config.replace(defaultsRegex, newDefaults);

// ── Output ──────────────────────────────────────────────────────

if (write) {
  writeFileSync(cssPath, css);
  writeFileSync(configPath, config);
  console.log('Synced design-tokens.json ->');
  console.log('  css/style.css        (scorecard color variables)');
  console.log('  js/layout-config.js  (sizing defaults)');
} else {
  console.log('=== CSS :root scorecard vars ===');
  console.log(lightCSS);
  console.log('\n=== CSS [data-theme="dark"] scorecard vars ===');
  console.log(darkCSS);
  console.log('\n=== layout-config.js DEFAULTS ===');
  console.log(sizingEntries);
  console.log('\nDry run. Use --write to apply.');
}
