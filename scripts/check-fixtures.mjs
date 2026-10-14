import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIRS = [
  path.resolve(__dirname, '../tests/fixtures'),
  path.resolve(__dirname, '../vendor/ekmong-contracts/fixtures'),
];

function findJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const allJsonFixtures = [];
  for (const dir of FIXTURE_DIRS) {
    allJsonFixtures.push(...findJsonFiles(dir));
  }

  if (allJsonFixtures.length === 0) {
    console.log(
      'fixtures:check passed: no custom fixtures found yet; fixtures directory structure is ready.',
    );
    return;
  }

  const errors = [];
  for (const file of allJsonFixtures) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      JSON.parse(content);
    } catch (err) {
      errors.push(`Invalid JSON fixture in ${file}: ${err.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nfixtures:check failed with ${errors.length} issue(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`fixtures:check passed: verified ${allJsonFixtures.length} fixture file(s).`);
}

main();
