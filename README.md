# CarmNote TNA

Self-contained HTML notebook for Transition Network Analysis, powered by tnaj. Load a CSV/TSV of sequence data and run TNA model construction, pruning, communities, centralities, bootstrap, permutation and stability analyses — fully offline, no install.

**This repository distributes compiled releases only — no source code.**
Each release is a single self-contained HTML file: download it, double-click
it, and it runs fully offline in your browser.

## Get the latest version

- **Open live:** [index.html](./index.html) (via GitHub Pages, if enabled)
- **Download:** pick the newest file under [versions/](./versions/) below,
  open it on GitHub and use *Download raw file*.

## Variants

Each version ships in two variants, marked by the letter after the version
number in the filename:

- **`j` — pure TypeScript** (default, smaller file). This is what
  `index.html` points to.
- **`w` — WASM-accelerated** kernels (faster on large datasets, larger file).
- `.beta.min` files are minified builds of the same variant (beta).

## Releases

Released versions are immutable — a file listed here is never changed or
removed. Verify downloads against the SHA-256 checksums.

<!-- releases:begin -->
| Version | Date | File | Size | SHA-256 |
|---|---|---|---|---|
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63w.beta.min.html](./versions/tna-notebook_V2.3.63w.beta.min.html) | 1.46 MB | `5acd013ad05649a22c95b50a4ce548f5af49bf13b8abd5d1884ea392c4b90e6e` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63w.html](./versions/tna-notebook_V2.3.63w.html) | 1.76 MB | `c8f78222f73f42fc6d5a1525b09a8f154b1f86b22874abfcd4e9e5b286dd5648` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63j.beta.min.html](./versions/tna-notebook_V2.3.63j.beta.min.html) | 0.78 MB | `988a2f10e207abdad316f359b6d196692bcf051624bbf7812ab5667276bd7cb3` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63j.html](./versions/tna-notebook_V2.3.63j.html) | 1.08 MB | `3ecce4d8f5116b34d1714c028057c00fa3def8d5c3a34412fe03a83bbb3d6809` |
<!-- releases:end -->
