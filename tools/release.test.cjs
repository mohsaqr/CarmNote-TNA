#!/usr/bin/env node
/**
 * Tests for release.cjs — run with:  node tools/release.test.cjs
 * Builds a synthetic source repo in a temp dir and releases from it.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

const { readVersion, findArtifacts, releaseNote } = require('./release.cjs');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log('  ✓ ' + name);
  } catch (err) {
    console.error('  ✖ ' + name + '\n    ' + err.message);
    process.exitCode = 1;
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'carmnote-release-test-'));
const srcDir = path.join(tmp, 'fake-note');
const distDir = path.join(srcDir, 'dist');
const repoRoot = path.join(tmp, 'releases-repo');
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(repoRoot, { recursive: true });

// Synthetic source repo: string-style version file + versioned artifacts.
fs.writeFileSync(path.join(srcDir, 'notebook.version.cjs'), "module.exports = '1.2.3';\n");
fs.writeFileSync(path.join(distDir, 'fake_V1.2.3-full-j.html'), '<html>full v1.2.3</html>');
fs.writeFileSync(path.join(distDir, 'fake_V1.2.3-min-j.html'), '<html>min v1.2.3</html>');
fs.writeFileSync(path.join(distDir, 'fake_V1.2.30-full-j.html'), '<html>DIFFERENT version</html>');
fs.writeFileSync(path.join(distDir, 'fake_V1.2.3.notes.txt'), 'not html');

// Object-style version file (pro-notebook lineage).
const srcDirPro = path.join(tmp, 'fake-pro');
fs.mkdirSync(srcDirPro, { recursive: true });
fs.writeFileSync(path.join(srcDirPro, 'notebook.version.cjs'), "module.exports = { version: '0.1.9' };\n");

const configPath = path.join(tmp, 'notes.config.json');
fs.writeFileSync(configPath, JSON.stringify({
  fake: {
    displayName: 'Fake Note',
    description: 'A synthetic notebook for testing.',
    sourceDir: srcDir,
    versionFile: 'notebook.version.cjs',
    distDir: 'dist',
    artifactPrefix: 'fake_V',
    defaultArtifact: 'fake_V{V}-full-j.html',
  },
}, null, 2));

console.log('release.cjs tests');

test('readVersion handles string exports', () => {
  assert.strictEqual(readVersion(path.join(srcDir, 'notebook.version.cjs')), '1.2.3');
});

test('readVersion handles { version } exports', () => {
  assert.strictEqual(readVersion(path.join(srcDirPro, 'notebook.version.cjs')), '0.1.9');
});

test('findArtifacts matches exact version only (1.2.3 ≠ 1.2.30), html only', () => {
  assert.deepStrictEqual(
    findArtifacts(distDir, 'fake_V', '1.2.3'),
    ['fake_V1.2.3-full-j.html', 'fake_V1.2.3-min-j.html']
  );
});

test('findArtifacts handles letterless artifacts (version followed by .html)', () => {
  const bare = path.join(tmp, 'bare-dist');
  fs.mkdirSync(bare, { recursive: true });
  ['bare_V2.1.22-full.html', 'bare_V2.1.22-min.html', 'bare_V2.1.2-full.html', 'bare_V2.1.2.1-full.html']
    .forEach((f) => fs.writeFileSync(path.join(bare, f), '<html></html>'));
  assert.deepStrictEqual(
    findArtifacts(bare, 'bare_V', '2.1.22'),
    ['bare_V2.1.22-full.html', 'bare_V2.1.22-min.html']
  );
  assert.deepStrictEqual(findArtifacts(bare, 'bare_V', '2.1.2'), ['bare_V2.1.2-full.html']);
});

test('dry run reports artifacts without writing anything', () => {
  const r = releaseNote('fake', { configPath, repoRoot, dryRun: true });
  assert.strictEqual(r.version, '1.2.3');
  assert.strictEqual(r.artifacts.length, 2);
  assert.strictEqual(fs.existsSync(path.join(repoRoot, 'fake')), false);
});

test('release copies artifacts, latest pointer, and writes both READMEs', () => {
  const r = releaseNote('fake', { configPath, repoRoot, today: '2026-07-12' });
  assert.deepStrictEqual(r.artifacts.map((a) => a.status), ['released', 'released']);
  assert.strictEqual(
    fs.readFileSync(path.join(repoRoot, 'fake', 'versions', 'fake_V1.2.3-full-j.html'), 'utf8'),
    '<html>full v1.2.3</html>'
  );
  assert.strictEqual(
    fs.readFileSync(path.join(repoRoot, 'fake', 'index.html'), 'utf8'),
    '<html>full v1.2.3</html>'
  );
  const noteReadme = fs.readFileSync(path.join(repoRoot, 'fake', 'README.md'), 'utf8');
  assert.ok(noteReadme.includes('| 1.2.3 | 2026-07-12 |'), 'note README has version row');
  assert.ok(/`[0-9a-f]{64}`/.test(noteReadme), 'note README has sha256');
  const rootReadme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
  assert.ok(rootReadme.includes('[Fake Note](./fake/) | 1.2.3'), 'root README indexes the note');
});

test('re-releasing the same version is a no-op, not a duplicate row', () => {
  const before = fs.readFileSync(path.join(repoRoot, 'fake', 'README.md'), 'utf8');
  const r = releaseNote('fake', { configPath, repoRoot, today: '2026-07-12' });
  assert.deepStrictEqual(r.artifacts.map((a) => a.status), ['already-released', 'already-released']);
  assert.strictEqual(fs.readFileSync(path.join(repoRoot, 'fake', 'README.md'), 'utf8'), before);
});

test('a released version is immutable — changed bytes abort the release', () => {
  fs.writeFileSync(path.join(distDir, 'fake_V1.2.3-full-j.html'), '<html>TAMPERED</html>');
  assert.throws(
    () => releaseNote('fake', { configPath, repoRoot, today: '2026-07-12' }),
    /immutable/
  );
  fs.writeFileSync(path.join(distDir, 'fake_V1.2.3-full-j.html'), '<html>full v1.2.3</html>');
});

test('a new version appends a row and keeps the old one', () => {
  fs.writeFileSync(path.join(srcDir, 'notebook.version.cjs'), "module.exports = '1.2.4';\n");
  fs.writeFileSync(path.join(distDir, 'fake_V1.2.4-full-j.html'), '<html>full v1.2.4</html>');
  const r = releaseNote('fake', { configPath, repoRoot, today: '2026-07-13' });
  assert.strictEqual(r.version, '1.2.4');
  const noteReadme = fs.readFileSync(path.join(repoRoot, 'fake', 'README.md'), 'utf8');
  assert.ok(noteReadme.includes('| 1.2.4 | 2026-07-13 |'), 'new row present');
  assert.ok(noteReadme.includes('| 1.2.3 | 2026-07-12 |'), 'old row kept');
  assert.ok(noteReadme.indexOf('1.2.4') < noteReadme.indexOf('| 1.2.3 |'), 'newest first');
  assert.strictEqual(
    fs.readFileSync(path.join(repoRoot, 'fake', 'index.html'), 'utf8'),
    '<html>full v1.2.4</html>'
  );
  const rootReadme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
  assert.strictEqual(rootReadme.match(/Fake Note/g).length, 1, 'root index has exactly one row per note');
});

test('missing default artifact fails with a rebuild hint', () => {
  fs.writeFileSync(path.join(srcDir, 'notebook.version.cjs'), "module.exports = '9.9.9';\n");
  assert.throws(
    () => releaseNote('fake', { configPath, repoRoot }),
    /rebuild the notebook/
  );
});

test('releaseDir "." publishes flat at the repo root with a single README', () => {
  fs.writeFileSync(path.join(srcDir, 'notebook.version.cjs'), "module.exports = '1.2.4';\n");
  const flatRoot = path.join(tmp, 'flat-repo');
  fs.mkdirSync(flatRoot, { recursive: true });
  const flatConfigPath = path.join(tmp, 'flat.config.json');
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  cfg.fake.releaseDir = '.';
  fs.writeFileSync(flatConfigPath, JSON.stringify(cfg, null, 2));

  const r = releaseNote('fake', { configPath: flatConfigPath, repoRoot: flatRoot, today: '2026-07-12' });
  assert.strictEqual(r.isFlat, true);
  assert.ok(fs.existsSync(path.join(flatRoot, 'versions', 'fake_V1.2.4-full-j.html')), 'versions/ at root');
  assert.ok(fs.existsSync(path.join(flatRoot, 'index.html')), 'index.html at root');
  const readme = fs.readFileSync(path.join(flatRoot, 'README.md'), 'utf8');
  assert.ok(readme.startsWith('# Fake Note'), 'root README is the note README');
  assert.ok(readme.includes('| 1.2.4 | 2026-07-12 |'), 'version row present');
  assert.ok(!readme.includes('| Notebook | Latest |'), 'no multi-note index table');
  assert.deepStrictEqual(
    fs.readdirSync(flatRoot).sort(),
    ['README.md', 'index.html', 'versions'],
    'nothing else written at the root'
  );
});

fs.rmSync(tmp, { recursive: true, force: true });
console.log(process.exitCode ? '\nFAILED' : `\nAll ${passed} tests passed.`);
