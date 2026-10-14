import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_PATH = path.resolve(__dirname, '../src/i18n/en.json');
const KM_PATH = path.resolve(__dirname, '../src/i18n/km.json');

function flattenKeys(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, fullKey));
    } else if (typeof value === 'string') {
      result[fullKey] = value;
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

function extractPlaceholders(text) {
  const placeholders = new Set();
  const i18nDoubleRegex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  let match;
  while ((match = i18nDoubleRegex.exec(text)) !== null) {
    placeholders.add(match[1]);
  }
  const singleRegex = /(?<!\{)\{([a-zA-Z0-9_]+)\}(?!\})/g;
  while ((match = singleRegex.exec(text)) !== null) {
    placeholders.add(match[1]);
  }
  return Array.from(placeholders).sort();
}

function main() {
  if (!fs.existsSync(EN_PATH)) {
    console.error(`Error: English dictionary not found at ${EN_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(KM_PATH)) {
    console.error(`Error: Khmer dictionary not found at ${KM_PATH}`);
    process.exit(1);
  }

  let enRaw = {};
  let kmRaw = {};
  try {
    enRaw = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
  } catch (err) {
    console.error(`Error parsing en.json: ${err.message}`);
    process.exit(1);
  }
  try {
    kmRaw = JSON.parse(fs.readFileSync(KM_PATH, 'utf-8'));
  } catch (err) {
    console.error(`Error parsing km.json: ${err.message}`);
    process.exit(1);
  }

  const enFlat = flattenKeys(enRaw);
  const kmFlat = flattenKeys(kmRaw);

  const enKeys = new Set(Object.keys(enFlat));
  const kmKeys = new Set(Object.keys(kmFlat));

  const missingInKm = Array.from(enKeys).filter((k) => !kmKeys.has(k));
  const missingInEn = Array.from(kmKeys).filter((k) => !enKeys.has(k));

  const errors = [];

  for (const key of missingInKm) {
    errors.push(`Missing in km.json: "${key}"`);
  }
  for (const key of missingInEn) {
    errors.push(`Missing in en.json: "${key}"`);
  }

  for (const key of enKeys) {
    if (kmKeys.has(key)) {
      const enVars = extractPlaceholders(enFlat[key]);
      const kmVars = extractPlaceholders(kmFlat[key]);
      if (enVars.join(',') !== kmVars.join(',')) {
        errors.push(
          `Placeholder mismatch in "${key}": en=[${enVars.join(', ')}] vs km=[${kmVars.join(', ')}]`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\ni18n:check failed with ${errors.length} issue(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const count = enKeys.size;
  console.log(`i18n:check passed: ${count} key(s) verified with 100% en/km parity.`);
}

main();
