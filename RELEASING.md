# How to cut a CarmNote TNA release

This repo distributes the **compiled CarmNote TNA only** — no source code.
The source repo (`../carm-tna`) is never touched by this process; the tool
only *reads* its `dist/` folder. The repo root is the release: `README.md`
(version table), `index.html` (latest build), `versions/` (immutable archive).

## One release, four steps

```bash
# 1. In the SOURCE repo (../carm-tna): bump notebook.version.cjs and
#    rebuild, per that repo's own RELEASING.md:
#      cd ../carm-tna && npm run build:notebook

# 2. In THIS repo: publish the current build (use --dry-run to preview)
node tools/release.cjs tna

# 3. Run the tests if you touched the tooling
node tools/release.test.cjs

# 4. Commit + tag + push (the tool never runs git itself)
git add README.md index.html versions
git commit -m "tna v2.3.63"
git tag tna-v2.3.63
git push && git push --tags
```

Optionally also attach the files to a GitHub Release for a nicer download
page:

```bash
gh release create tna-v2.3.63 versions/tna-notebook_V2.3.63-*.html \
  --title "CarmNote TNA v2.3.63" --notes "See README.md for checksums."
```

## What the tool guarantees

- **Version truth:** the released version is read from the source repo's
  `notebook.version.cjs` — the same single source of truth the build stamps
  into the filename and the in-app header.
- **Immutability:** an already-released file is never overwritten. If the
  bytes differ, the release aborts — bump the version upstream and rebuild.
- **Exact bytes:** files are byte-copies of the build output; the README
  records size + SHA-256 for every artifact.
- **Latest pointer:** `index.html` is a copy of the newest default build.
  With GitHub Pages enabled (Settings → Pages → deploy from `main`),
  `https://<user>.github.io/CarmNote-TNA/` opens the live notebook.

## Releasing the other CarmNotes later

The tooling is generic. When another note (tna-pro, sna-pro, pna-pro,
htna-pro, …) is ready for public release, give it its own repo: copy
`tools/` there, write a one-entry `tools/notes.config.json` pointing at its
source repo (`sourceDir`, `versionFile`, `distDir`, `artifactPrefix`,
`defaultArtifact`, `releaseDir: "."`), and run `node tools/release.cjs <id>`.
The first release generates the README and layout automatically. The full
step-by-step playbook (with a worked example, the config field reference,
and the hard rules) is in `Note/RELEASE-MECHANISM.md` in the workspace;
`CarmNote-SNA` was stood up from it.

## Canonical tooling

THIS repo holds the canonical `tools/release.cjs` and
`tools/release.test.cjs`. Fix or extend the tool here first, run the tests,
then copy both files into every other `CarmNote-*` release repo and re-run
their tests.
