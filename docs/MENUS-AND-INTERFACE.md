# CarmNote TNA Menus and Interface

[Documentation index](./INDEX.md) ·
[Downloads and versions](./DOWNLOADS-AND-VERSIONS.md) ·
[User guide](./USER-GUIDE.md) · [Cell reference](./CELL-REFERENCE.md)

This reference follows the interface from top to bottom. Cell-specific
controls are documented separately in the
[Cell reference](./CELL-REFERENCE.md).

## Header: identity and display

### Carm TNA and version badge

The brand and version badge identify the notebook type, release version, and
engine variant. The filename and in-app version should agree.

### Notebook title

Edit the title before saving. The title becomes the basis of the downloaded
notebook filename.

### Saved indicator and build tag

The saved indicator reports browser-workspace persistence and save errors. The
build tag identifies the exact compiled notebook build. A browser-storage
message is not a replacement for downloading a portable file with **Save**.

### Container width

Cycles through:

- **Standard** — compact reading width;
- **Wide** — more room for grouped results and tables;
- **Full** — uses the available browser width.

The preference is remembered in browser storage.

### Flask: experimental mode

The flask toggles experimental-mode visibility and marks the version badge
when active. Experimental methods may be slower, less settled, or intended
for specialist use. The unified **High-order** cell groups higher-order
methods in one adaptive form; consult the cell reference before interpreting
them.

### Save

Downloads the current notebook as a self-contained `.html` file. The file
includes data, settings, cells, and saved results. The keyboard shortcut is
<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>S</kbd>.

## Workspace row

### New

Creates a blank notebook with a new identity. The current workspace is first
persisted in the browser library.

### File menu

#### New Notebook

Creates a new blank notebook.

#### Open Notebook

Opens the browser-local CarmNote TNA notebook library. Entries can be opened,
renamed, or deleted. This library belongs to the current browser/profile and
should not be treated as the only research archive.

#### Load Data

Opens the CSV/TSV file picker. Loading a new dataset replaces the active data
context; review the mapping and rebuild the network.

#### Save As

Duplicates the notebook under a new title and identifier in the browser
library. It does **not** replace the need to click **Save** for a portable file
on disk.

#### Publish

Creates a presentation-oriented saved copy with editing controls hidden.
Keep an editable saved copy before publishing.

#### Copy All

Copies notebook results in a form suitable for pasting into another document,
subject to browser clipboard permissions.

#### Word (.doc)

Downloads a Word-compatible document containing notebook content and results.

#### HTML Report

Downloads a report-oriented HTML export. This is an output report, not the
same as the editable self-contained notebook produced by **Save**.

#### Print / PDF

Opens the browser print flow. Select a PDF printer to create a static PDF.

#### Clear data & cells

Removes the active data, model, and cells while keeping the current notebook
identity in the browser library. This is destructive for the current
workspace; save a portable copy first.

#### Delete notebook

Deletes the current entry from the browser library. It does not delete
`.html` files already saved on disk.

#### Privacy & network access

Shows the notebook's privacy and network-access statement. CarmNote TNA
performs analysis locally in the browser.

#### Reset notebook storage & reload

Clears CarmNote TNA's browser-library state and reloads a clean notebook. Use
this when an incompatible or damaged cached workspace is being restored.
Downloaded `.html` files are not deleted.

#### Clear browser analysis history

Clears Carm-related browser storage, including saved notebooks and
preferences. This has a wider scope than resetting only the active notebook
storage. Read the confirmation carefully.

## Analysis menus

Selecting an item adds a new cell to the notebook.

| Menu | Purpose |
|---|---|
| **Build** | Create the base transition model, grouped models, or data-driven clusters |
| **Describe** | Inspect state frequencies, mosaics, and transition weights |
| **Validate** | Assess edge, centrality, and whole-model stability |
| **Analyze** | Compute centralities, edge betweenness, communities, and cliques |
| **Sequences** | Inspect trajectories and per-sequence indices |
| **Pattern mining** | Discover, compare, visualize, and model recurring patterns |
| **Compare** | Compare group networks and position-wise sequence distributions |
| **High-order** | Run higher-order, path-anomaly, topology, and memory analyses |
| **Note** | Add formatted narrative text between analysis cells |

The [Cell reference](./CELL-REFERENCE.md) documents every item in menu order.

## Sequence Data

Opens a processed-data inspector after the network has been built. Use it to
confirm:

- the number of sequences;
- actor and group alignment;
- sequence lengths;
- the state order actually used by the model.

This is the most important check when the raw file could be interpreted in
more than one way.

## Run All

Runs every unlocked executable cell from top to bottom. It is useful after a
data or model-setting change. Large resampling and high-order cells can make a
full run slow; lock completed cells or run expensive cells individually when
appropriate.

## Lock/Unlock All

Locks all analysis cells so their settings and cached results cannot be
changed or rerun accidentally. It is a cell-level control and is distinct
from the notebook-wide sharing tiers in the lower-left lock menu.

## Opening and data-import panel

### Drop zone

Drop a CSV, TSV, semicolon-delimited, or pipe-delimited text file, or click to
browse. Excel workbooks must first be exported as CSV UTF-8 or TSV.

### Data preview

Shows the filename, dimensions, column names, detected types, and first rows.
Always inspect it before building.

### Format

- **Long (events)** — one row per event.
- **Wide (sequences)** — one row per sequence.

### Long-format mapping

- **Actor** — case/person/sequence identifier.
- **Action** — state or event label; required.
- **Time** — timestamp used to order and optionally sessionize events.
- **Order** — explicit event position when timestamps are absent or unsuitable.
- **Session** — explicit session identifier.
- **Group** — condition, cohort, class, or other comparison group.
- **Gap** — elapsed seconds after which a new session is created.

### Wide-format mapping

- **ID column** — optional sequence identifier.
- **States from … to …** — inclusive span of state columns.

Columns outside the state span are preserved as metadata and can be used by
group and pattern/outcome analyses.

### Build Network

Processes the mapping and creates the initial transition model.

### Clear All

Keeps the loaded data but removes the built model and all analysis cells.

### Change dataset

Replaces the loaded dataset. Recheck mappings and rerun dependent cells.

## Global plot options

The **Plot options** control affects transition-network plots across the
notebook.

### Filter

Controls which edges and numeric edge labels are displayed. Display filtering
does not necessarily alter the underlying model; the **Prune** setting in a
Build cell does.

### Layout

Selects a geometric or force-based network layout, including circular,
spring, concentric, radial, grid, shell, hierarchical, arc, and grouped
layouts. Force-based layouts use deterministic seeding where supported.

### Color and background

Colors nodes by category, community, centrality, or one selected color.
Community coloring exposes a community-method selector.

### Edge style

Controls line style, weight-based color, minimum/maximum width, and opacity.

### Labels

Controls node and edge label visibility, size, and color.

### Size

Scales nodes by a chosen centrality measure and adjusts node, edge, and arrow
sizes.

### Reset to defaults

Restores the standard global plot appearance.

## Cell controls

Every analysis cell has a header and a form/result area.

- **Drag handle** — reorder the cell.
- **Minimize** — collapse or expand the cell.
- **Duplicate** — create a copy with the same settings.
- **Lock** — preserve settings and cached output; a locked cell is skipped by
  Run All.
- **Remove** — delete the cell from the notebook.
- **Run button** — execute the cell with current settings.
- **Export** — export tables, plots, or underlying data when offered.

Cells are evaluated against the current built model. Rebuilding the model can
change all downstream results.

## Result exports

Depending on result type, exports include:

- tables: CSV, TSV, JSON, Markdown, HTML, Word-compatible output, or clipboard;
- plots: SVG or PNG;
- underlying plot data: JSON where offered;
- whole notebook: Word, HTML report, Print/PDF, or portable notebook Save.

SVG is preferred for editable publication-quality vector graphics. PNG is
useful for slides and raster workflows.

## Lower-left notebook lock menu

### Editable

Normal working state. Data, settings, and cells can be changed.

### Read-only

Soft presentation state. It can be returned to editable without duplicating
the notebook.

### Locked

Frozen state. The original cannot be returned directly to editable; use
**Duplicate to editable copy**.

### Sealed

Frozen state with a SHA-256 reproducibility fingerprint over canonical
notebook state. A mismatch is flagged when the notebook is reopened.

### Copy fingerprint

Copies the seal metadata and fingerprint for external recording.

### Duplicate to editable copy

Creates a new editable notebook while preserving the locked/sealed original.

Always click **Save** after selecting the intended sharing tier so the
downloaded file contains that state.

## Footer: About, License, and How to cite

Opens the bundled information panel. It is available offline and contains the
software description, research-license terms, citation text, BibTeX, and
contact details.
