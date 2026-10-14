declare const require: (module: string) => any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');

describe('Project setup and configuration', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('AC-1: verifies .env.example exists with Expo public vars and no secrets', () => {
    const envExamplePath = path.join(rootDir, '.env.example');
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const content: string = fs.readFileSync(envExamplePath, 'utf-8');
    const lines = content
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l && !l.startsWith('#'));

    // All active non-comment env keys must start with EXPO_PUBLIC_
    for (const line of lines) {
      const [key] = line.split('=');
      expect(key.trim()).toMatch(/^EXPO_PUBLIC_/);
    }

    expect(content).toContain('EXPO_PUBLIC_FLAVOR=local');
    expect(content).toContain('EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1/mobile');
  });

  it('AC-2: verifies verification scripts exist and are configured in package.json', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    expect(pkg.scripts['i18n:check']).toBe('node scripts/check-i18n.mjs');
    expect(pkg.scripts['contracts:verify']).toBe('node scripts/verify-contracts.mjs');
    expect(pkg.scripts['fixtures:check']).toBe('node scripts/check-fixtures.mjs');

    expect(fs.existsSync(path.join(rootDir, 'scripts/check-i18n.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, 'scripts/verify-contracts.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, 'scripts/check-fixtures.mjs'))).toBe(true);
  });

  it('AC-3: verifies .gitignore excludes agent-kit directories and metadata files', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const gitignore: string = fs.readFileSync(gitignorePath, 'utf-8');
    const requiredPatterns = [
      '.agents/',
      '.opencode/',
      '.tossana/',
      'AGENTS.md',
      'agent.config.json',
      'docs/clickup/',
    ];

    for (const pattern of requiredPatterns) {
      expect(gitignore).toContain(pattern);
    }
  });

  it('AC-4: verifies README.md documents prerequisites, setup, env vars, flavors, and spec links', () => {
    const readmePath = path.join(rootDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);

    const readme: string = fs.readFileSync(readmePath, 'utf-8');
    expect(readme).not.toContain('ek-mobile-test');

    // Setup and prerequisites
    expect(readme).toContain('pnpm install');
    expect(readme).toContain('.env.example');
    expect(readme).toContain('EXPO_PUBLIC_FLAVOR');

    // Flavors
    expect(readme).toContain('start:local');
    expect(readme).toContain('start:dev');
    expect(readme).toContain('start:prod');

    // Documentation links
    expect(readme).toContain('docs/clickup/prd-ekmong-mobile.md');
    expect(readme).toContain('docs/clickup/onboarding.md');
    expect(readme).toContain('docs/clickup/implementation__implementation-01-architecture.md');
    expect(readme).toContain('docs/clickup/implementation__implementation-16-real-time-status-and-push.md');
  });
});
