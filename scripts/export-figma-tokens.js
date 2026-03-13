#!/usr/bin/env node
/**
 * export-figma-tokens.js: Convert design-tokens.json into DTCG format
 * for the Microsoft "Variables Import" Figma plugin.
 *
 * Usage:  node scripts/export-figma-tokens.js
 * Output: figma-tokens/ directory with JSON files + manifest.json
 *
 * Then in Figma:
 *   1. Install "Variables Import" plugin (by Microsoft)
 *   2. Run it → choose "From manifest on disk" or paste the JSON
 *   3. Point to figma-tokens/manifest.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'figma-tokens');

mkdirSync(OUT, { recursive: true });

const tokens = JSON.parse(readFileSync(resolve(ROOT, 'design-tokens.json'), 'utf-8'));

// ── Colors (light + dark as separate files) ─────────────────────

function buildColorTokens(colorSet) {
  const out = {};
  for (const [key, token] of Object.entries(colorSet)) {
    out[token.description] = {
      $type: 'color',
      $value: token.value,
    };
  }
  return out;
}

const lightColors = buildColorTokens(tokens.scorecard.colors.light);
const darkColors = buildColorTokens(tokens.scorecard.colors.dark);

writeFileSync(resolve(OUT, 'colors-light.json'), JSON.stringify(lightColors, null, 2) + '\n');
writeFileSync(resolve(OUT, 'colors-dark.json'), JSON.stringify(darkColors, null, 2) + '\n');

// ── Sizing ──────────────────────────────────────────────────────

const sizing = {};
for (const [key, token] of Object.entries(tokens.scorecard.sizing)) {
  sizing[token.description] = {
    $type: 'number',
    $value: token.value,
    $description: key,
  };
}

writeFileSync(resolve(OUT, 'sizing.json'), JSON.stringify(sizing, null, 2) + '\n');

// ── Strokes ─────────────────────────────────────────────────────

const strokes = {};
for (const [key, token] of Object.entries(tokens.scorecard.strokes)) {
  strokes[key] = {
    $type: 'number',
    $value: token.value,
  };
}

writeFileSync(resolve(OUT, 'strokes.json'), JSON.stringify(strokes, null, 2) + '\n');

// ── Typography ──────────────────────────────────────────────────

const typography = {};
for (const [group, groupTokens] of Object.entries(tokens.scorecard.typography)) {
  for (const [key, token] of Object.entries(groupTokens)) {
    const name = `${group}/${key}`;
    if (token.type === 'fontFamilies') {
      typography[name] = { $type: 'string', $value: token.value };
    } else if (token.type === 'fontWeights') {
      typography[name] = { $type: 'number', $value: Number(token.value) };
    } else if (token.type === 'fontSizes') {
      typography[name] = {
        $type: 'number',
        $value: Number(token.value),
        ...(token.description ? { $description: token.description } : {}),
      };
    }
  }
}

writeFileSync(resolve(OUT, 'typography.json'), JSON.stringify(typography, null, 2) + '\n');

// ── Manifest ────────────────────────────────────────────────────

const manifest = {
  name: 'Scorecard',
  collections: {
    'Scorecard/Colors': {
      modes: {
        Light: ['colors-light.json'],
        Dark: ['colors-dark.json'],
      },
    },
    'Scorecard/Sizing': {
      modes: {
        Value: ['sizing.json'],
      },
    },
    'Scorecard/Strokes': {
      modes: {
        Value: ['strokes.json'],
      },
    },
    'Scorecard/Typography': {
      modes: {
        Value: ['typography.json'],
      },
    },
  },
};

writeFileSync(resolve(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log('Exported to figma-tokens/:');
console.log('  manifest.json');
console.log('  colors-light.json');
console.log('  colors-dark.json');
console.log('  sizing.json');
console.log('  strokes.json');
console.log('  typography.json');
console.log('');
console.log('In Figma: Install "Variables Import" plugin (by Microsoft)');
console.log('  → Run plugin → Load manifest → select figma-tokens/manifest.json');
