#!/usr/bin/env node
/**
 * CarmNote release tool — publishes COMPILED notebooks only, never source.
 *
 * Usage:
 *   node tools/release.cjs <note-id> [--dry-run]
 *
 * <note-id> is a key of tools/notes.config.json (e.g. "tna").
 *
 * What it does, for the note's CURRENT version (read from the source repo's
 * notebook.version.cjs — the single source of truth):
 *   1. Finds every built HTML in the source repo's dist/ stamped with that
 *      version (full, minified, wasm variant — whatever exists).
 *   2. Copies them into  <note-id>/versions/  in this repo.
 *      IMMUTABLE: an already-released version is never overwritten. If the
 *      bytes differ the tool aborts — bump the version in the source repo.
 *   3. Copies the default artifact to  <note-id>/index.html  (the "latest"
 *      pointer; with GitHub Pages enabled it opens live in the browser).
 *   4. Updates the version table in  <note-id>/README.md  (created on first
 *      release) and the notes index table in the root README.md.
 *
 * It never modifies the source repo, and it deliberately runs NO git
 * commands. After a release, commit + tag by hand (or via CI):
 *   git add <note-id> README.md && git commit -m "<note-id> v<V>"
 *   git tag <note-id>-v<V>
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..');

function fail(msg) {
  throw new Error(msg);
}

function loadConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/** notebook.version.cjs exports either '2.3.63' or { version: '0.1.21' }. */
function readVersion(versionFilePath) {
  delete require.cache[require.resolve(versionFilePath)];
  const exported = require(versionFilePath);
  const version = typeof exported === 'string' ? exported : exported && exported.version;
  if (!version || !/^\d+\.\d+(\.\d+)?$/.test(version)) {
    fail(`Could not read a semver-like version from ${versionFilePath} (got: ${JSON.stringify(exported)})`);
  }
  return version;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * All built .html files in distDir stamped with exactly this version.
 * The boundary forbids a following digit or dot-digit (so 2.1.2 matches
 * neither 2.1.22 nor 2.1.2.1) while allowing ".html" and variant letters.
 */
function findArtifacts(distDir, artifactPrefix, version) {
  const stamp = new RegExp('^' + escapeRegExp(artifactPrefix + version) + '(?!\\d|\\.\\d)');
  return fs.readdirSync(distDir)
    .filter((f) => f.endsWith('.html') && stamp.test(f))
    .sort();
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function formatSize(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Copy one artifact into versionsDir, enforcing immutability.
 * Returns 'released' | 'already-released'.
 */
function copyArtifact(srcPath, versionsDir) {
  const destPath = path.join(versionsDir, path.basename(srcPath));
  if (fs.existsSync(destPath)) {
    if (sha256(destPath) !== sha256(srcPath)) {
      fail(
        `${path.basename(destPath)} is already released with DIFFERENT content. ` +
        'Released versions are immutable — bump the version in the source repo and rebuild.'
      );
    }
    return 'already-released';
  }
  fs.copyFileSync(srcPath, destPath);
  return 'released';
}

const TABLE_BEGIN = '<!-- releases:begin -->';
const TABLE_END = '<!-- releases:end -->';

function noteReadmeTemplate(noteId, cfg) {
  return `# ${cfg.displayName}

${cfg.description}

**This repository distributes compiled releases only — no source code.**
Each release is a single self-contained HTML file: download it, double-click
it, and it runs fully offline in your browser.

## Get the latest version

- **Open live:** [index.html](./index.html) (via GitHub Pages, if enabled)
- **Download:** pick the newest file under [versions/](./versions/) below,
  open it on GitHub and use *Download raw file*.

## Releases

Released versions are immutable — a file listed here is never changed or
removed. Verify downloads against the SHA-256 checksums.

${TABLE_BEGIN}
| Version | Date | File | Size | SHA-256 |
|---|---|---|---|---|
${TABLE_END}
`;
}

function rootReadmeTemplate() {
  return `# CarmNote releases

Compiled, versioned releases of the CarmNote family — self-contained HTML
notebooks for network and sequence analysis. **This repository contains no
source code**, only final built notebooks. Each one runs fully offline:
download the HTML file, double-click it, load your CSV/TSV, analyze.

## Notebooks

${TABLE_BEGIN}
| Notebook | Latest | Released | Open | Download |
|---|---|---|---|---|
${TABLE_END}

## Versioning

- Every release keeps the version stamped in its filename and in-app header.
- Released files are **immutable**: never overwritten, never deleted.
- Each note's README lists every version with size and SHA-256 checksum.
- Git tags follow \`<note>-v<version>\` (e.g. \`tna-v2.3.63\`).
`;
}

/** Replace the rows between the release-table markers using updateRows(). */
function updateMarkedTable(markdown, updateRows) {
  const begin = markdown.indexOf(TABLE_BEGIN);
  const end = markdown.indexOf(TABLE_END);
  if (begin === -1 || end === -1 || end < begin) {
    fail(`README is missing the ${TABLE_BEGIN} … ${TABLE_END} markers.`);
  }
  const block = markdown.slice(begin + TABLE_BEGIN.length, end);
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2 || !lines[1].includes('---')) {
    fail('README release table must start with a header row and a |---| separator row.');
  }
  const header = lines.slice(0, 2);
  const rows = lines.slice(2);
  const newRows = updateRows(rows);
  const newBlock = '\n' + header.concat(newRows).join('\n') + '\n';
  return markdown.slice(0, begin + TABLE_BEGIN.length) + newBlock + markdown.slice(end);
}

function releaseNote(noteId, options) {
  const opts = options || {};
  const configPath = opts.configPath || path.join(__dirname, 'notes.config.json');
  const repoRoot = opts.repoRoot || REPO_ROOT;
  const dryRun = Boolean(opts.dryRun);
  const today = opts.today || new Date().toISOString().slice(0, 10);

  const config = loadConfig(configPath);
  const cfg = config[noteId];
  if (!cfg) {
    fail(`Unknown note "${noteId}". Known notes: ${Object.keys(config).join(', ')}`);
  }

  const sourceDir = path.resolve(repoRoot, cfg.sourceDir);
  const distDir = path.join(sourceDir, cfg.distDir);
  if (!fs.existsSync(distDir)) fail(`dist directory not found: ${distDir}`);

  const version = readVersion(path.join(sourceDir, cfg.versionFile));
  const artifacts = findArtifacts(distDir, cfg.artifactPrefix, version);
  const defaultArtifact = cfg.defaultArtifact.replace('{V}', version);
  if (!artifacts.includes(defaultArtifact)) {
    fail(
      `Default artifact ${defaultArtifact} not found in ${distDir}. ` +
      `The source version file says ${version} — rebuild the notebook in the source repo first ` +
      `(found for this version: ${artifacts.length ? artifacts.join(', ') : 'nothing'}).`
    );
  }

  // releaseDir "." publishes at the repo root (single-note repo such as
  // CarmNote-TNA); omitting it publishes into a <note-id>/ subfolder.
  const noteDir = path.resolve(repoRoot, cfg.releaseDir || noteId);
  const isFlat = noteDir === path.resolve(repoRoot);
  const versionsDir = path.join(noteDir, 'versions');
  const result = { noteId, version, artifacts: [], dryRun, isFlat };

  if (dryRun) {
    result.artifacts = artifacts.map((f) => ({ file: f, status: 'would-release' }));
    return result;
  }

  fs.mkdirSync(versionsDir, { recursive: true });

  artifacts.forEach((f) => {
    const srcPath = path.join(distDir, f);
    const status = copyArtifact(srcPath, versionsDir);
    result.artifacts.push({
      file: f,
      status,
      size: fs.statSync(srcPath).size,
      sha256: sha256(srcPath),
    });
  });

  fs.copyFileSync(path.join(distDir, defaultArtifact), path.join(noteDir, 'index.html'));

  // Note README: prepend one row per newly released artifact.
  const noteReadmePath = path.join(noteDir, 'README.md');
  if (!fs.existsSync(noteReadmePath)) {
    fs.writeFileSync(noteReadmePath, noteReadmeTemplate(noteId, cfg));
  }
  const newRows = result.artifacts
    .filter((a) => a.status === 'released')
    .map((a) =>
      `| ${version} | ${today} | [${a.file}](./versions/${encodeURIComponent(a.file)}) | ${formatSize(a.size)} | \`${a.sha256}\` |`
    );
  if (newRows.length) {
    fs.writeFileSync(
      noteReadmePath,
      updateMarkedTable(fs.readFileSync(noteReadmePath, 'utf8'), (rows) => newRows.concat(rows))
    );
  }

  // Multi-note repos also keep an index table in the root README. In a
  // flat (single-note) repo the note README IS the root README — skip it.
  if (!isFlat) {
    const rootReadmePath = path.join(repoRoot, 'README.md');
    if (!fs.existsSync(rootReadmePath)) {
      fs.writeFileSync(rootReadmePath, rootReadmeTemplate());
    }
    const indexRow =
      `| [${cfg.displayName}](./${noteId}/) | ${version} | ${today} ` +
      `| [open](./${noteId}/index.html) | [versions](./${noteId}/versions/) |`;
    fs.writeFileSync(
      rootReadmePath,
      updateMarkedTable(fs.readFileSync(rootReadmePath, 'utf8'), (rows) => {
        const marker = `[${cfg.displayName}](`;
        const kept = rows.filter((r) => !r.includes(marker));
        return kept.concat(indexRow).sort();
      })
    );
  }

  return result;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const noteId = args.find((a) => !a.startsWith('--'));
  if (!noteId) {
    console.error('Usage: node tools/release.cjs <note-id> [--dry-run]');
    process.exit(1);
  }
  try {
    const result = releaseNote(noteId, { dryRun });
    console.log(`\n${result.noteId} v${result.version}${dryRun ? ' (dry run)' : ''}`);
    result.artifacts.forEach((a) => console.log(`  ${a.status.padEnd(17)} ${a.file}`));
    if (!dryRun) {
      const released = result.artifacts.some((a) => a.status === 'released');
      const addPaths = result.isFlat ? 'README.md index.html versions' : `${result.noteId} README.md`;
      console.log(released
        ? `\nNext: git add ${addPaths} && git commit -m "${result.noteId} v${result.version}" && git tag ${result.noteId}-v${result.version}`
        : '\nNothing new to release — this version is already published.');
    }
  } catch (err) {
    console.error('✖ ' + err.message);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { readVersion, findArtifacts, copyArtifact, updateMarkedTable, releaseNote, sha256 };
