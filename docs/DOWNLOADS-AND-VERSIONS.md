# CarmNote TNA Downloads and Versions

[Documentation index](./INDEX.md) · [User guide](./USER-GUIDE.md) ·
[Menus and interface](./MENUS-AND-INTERFACE.md) ·
[Cell reference](./CELL-REFERENCE.md)

Each CarmNote TNA release is provided in four files. They combine two
computational engines (`j` and `w`) with two packaging forms (full and
minified).

## Quick recommendation

Use the full JavaScript file ending in **`-full-j.html`** unless you have a clear
reason to choose another file. It is the default, smallest full build, easiest
to archive and review, and the most broadly compatible.

For the current release, that file is:

`tna-notebook_V2.3.64-full-j.html`

## The four files

| Filename pattern | Engine | Packaging | Best use |
|---|---|---|---|
| `tna-notebook_V…-full-j.html` | JavaScript | Full | Recommended default; routine analysis, teaching, sharing, and archiving |
| `tna-notebook_V…-full-w.html` | WebAssembly | Full | Computationally larger datasets and heavier numerical kernels |
| `tna-notebook_V…-min-j.html` | JavaScript | Minified | Web hosting or bandwidth-sensitive download when the recipient can download directly |
| `tna-notebook_V…-min-w.html` | WebAssembly | Minified | Bandwidth-sensitive delivery of the WASM build; not recommended for email |

The letter belongs to the engine:

- **`j`** means the numerical engine is JavaScript compiled from TypeScript.
- **`w`** means selected numerical kernels use WebAssembly.

The packaging word is explicit:

- **`full`** means the readable, reviewable build.
- **`min`** means the same application has been minified.

## Full versus minified

Minification removes formatting, shortens internal identifiers where safe,
and compresses most JavaScript into very long lines. It changes packaging,
not the scientific method.

The minified build:

- has the same user interface and intended numerical results;
- is smaller to download;
- does not materially speed up the statistical analysis;
- is harder to review, compare, debug, or audit as text;
- is more likely to look suspicious to email gateways and malware scanners
  because it contains dense, obfuscated-looking JavaScript inside HTML.

### Email warning

Do **not** use a minified CarmNote file as an ordinary email attachment.
Many institutional and commercial mail systems block or quarantine HTML with
large minified scripts. Renaming the file does not solve the underlying
security policy and can make the attachment look more suspicious.

Prefer one of these delivery methods:

1. Send a link to the immutable file in the GitHub release repository.
2. Send a link from the approved LaCarm/notes website.
3. Use an institutionally approved file-sharing service.
4. If policy permits attachments, use the full build in an approved archive
   format—but assume that some gateways also scan or block archives.

Even the full `.html` build may be blocked by organizations that prohibit all
HTML attachments. A download link is the most reliable option.

## JavaScript versus WebAssembly

### JavaScript (`j`)

Choose `j` when:

- the dataset is small or moderate;
- maximum browser compatibility matters;
- the notebook will be used for teaching or demonstration;
- the file will be archived for later reference;
- you are unsure which build to use.

### WebAssembly (`w`)

Choose `w` when:

- the dataset has many sequences, states, or transitions;
- resampling, high-order modelling, or other numerical kernels are taking a
  noticeable amount of time;
- the notebook is opened in a current desktop browser;
- the larger notebook file is acceptable.

WASM accelerates selected computational kernels. It does **not**:

- make CSV/TSV parsing or every interface operation faster;
- remove browser memory limits;
- guarantee that every cell will run faster;
- change the statistical model or intended numerical result.

The WASM notebook is larger because the WebAssembly bytes are embedded inside
the self-contained HTML file. Start with `j`; move to `w` when workload, not
file-download size, is the bottleneck.

## How to identify a file

For `tna-notebook_V2.3.64-min-w.html`:

- `tna-notebook` — CarmNote TNA;
- `V2.3.64` — notebook release version;
- `min` — minified packaging;
- `w` — WebAssembly engine;
- `.html` — complete self-contained notebook.

The version shown in the filename should match the version badge inside the
notebook.

## Integrity and archiving

Released files are immutable. Use the SHA-256 value in the release table to
verify a downloaded file. For long-term research archiving:

- keep the exact original release file;
- keep the saved analysis notebook produced from it;
- record the filename, version, engine letter, and checksum;
- prefer the full build unless storage or download constraints require the
  minified form.
