import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VENDOR_DIR = path.resolve(__dirname, '../vendor/ekmong-contracts');
const CHECKSUM_FILE = path.join(VENDOR_DIR, 'CHECKSUM');
const SOURCE_COMMIT_FILE = path.join(VENDOR_DIR, 'SOURCE_COMMIT');

function computeFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function getVendoredFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getVendoredFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name !== '.gitkeep' &&
      entry.name !== 'CHECKSUM' &&
      entry.name !== 'SOURCE_COMMIT'
    ) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function main() {
  if (!fs.existsSync(VENDOR_DIR)) {
    console.error(`Error: Vendor contracts directory not found at ${VENDOR_DIR}`);
    process.exit(1);
  }

  const vendoredFiles = getVendoredFiles(VENDOR_DIR);

  if (vendoredFiles.length === 0) {
    console.log(
      'contracts:verify passed: vendor/ekmong-contracts directory is clean and awaiting tagged backend snapshot.',
    );
    return;
  }

  if (!fs.existsSync(CHECKSUM_FILE)) {
    console.error(
      'Error: Vendored contract files exist but CHECKSUM file is missing. Run snapshot-contracts script.',
    );
    process.exit(1);
  }

  const recordedChecksums = fs.readFileSync(CHECKSUM_FILE, 'utf-8').trim().split('\n');
  const expectedMap = new Map();
  for (const line of recordedChecksums) {
    const [hash, relPath] = line.trim().split(/\s+/);
    if (hash && relPath) {
      expectedMap.set(relPath, hash);
    }
  }

  const errors = [];

  for (const file of vendoredFiles) {
    const rel = path.relative(VENDOR_DIR, file);
    const hash = computeFileHash(file);
    const expected = expectedMap.get(rel);
    if (!expected) {
      errors.push(`Unrecorded vendored file: ${rel}`);
    } else if (expected !== hash) {
      errors.push(`Checksum mismatch for ${rel}: expected ${expected}, got ${hash}`);
    }
  }

  for (const rel of expectedMap.keys()) {
    const full = path.join(VENDOR_DIR, rel);
    if (!fs.existsSync(full)) {
      errors.push(`Missing expected vendored file: ${rel}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\ncontracts:verify failed with ${errors.length} issue(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const commit = fs.existsSync(SOURCE_COMMIT_FILE)
    ? fs.readFileSync(SOURCE_COMMIT_FILE, 'utf-8').trim()
    : 'unspecified';

  console.log(
    `contracts:verify passed: verified ${vendoredFiles.length} vendored file(s) against commit ${commit}.`,
  );
}

main();
