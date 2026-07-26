# CarmNote TNA User Guide

[Documentation index](./INDEX.md) ·
[Downloads and versions](./DOWNLOADS-AND-VERSIONS.md) ·
[Menus and interface](./MENUS-AND-INTERFACE.md) ·
[Cell reference](./CELL-REFERENCE.md)

This guide explains how to download CarmNote TNA, prepare sequence data, run
an analysis, export results, and save a portable notebook. CarmNote TNA is a
self-contained HTML application: it requires no installation, account,
server, or internet connection after download.

## Download and open CarmNote TNA

[Download the latest recommended build](../index.html?raw=1), keep the
`.html` extension, and open the file in a current web browser.

The recommended build is the full `j` variant. It is the smallest
non-minified release and is suitable for most analyses. The `w` variant uses
WebAssembly to accelerate computational kernels for larger datasets.

If GitHub shows the HTML source instead of downloading the file, use the
**Download raw file** button. Do not copy the displayed source into a new
file.

## Prepare sequence data

CarmNote TNA accepts CSV or TSV in long or wide format.

### Long format

Long format has one event per row. `Action` is required; `Actor` and an
ordering column are strongly recommended.

```csv
Actor,Action,Order,Group
S01,Start,1,Control
S01,Read,2,Control
S01,Quiz,3,Control
S02,Start,1,Treatment
S02,Video,2,Treatment
S02,Quiz,3,Treatment
```

Use `Time` for timestamps, `Order` for an explicit event order, `Session` when
one actor has named sessions, and `Group` for conditions or cohorts. If both
`Time` and `Order` are absent, rows are used in file order. The `Gap` setting
can split an actor's events into sessions based on elapsed seconds.

### Wide format

Wide format has one complete sequence per row and one state per successive
column.

```csv
Actor,Group,T1,T2,T3,T4
S01,Control,Start,Read,Quiz,Finish
S02,Treatment,Start,Video,Quiz,Finish
```

Select the first and last state columns (`T1` to `T4` above). Columns outside
that span remain metadata and can later be used for grouping and comparison.

Use a header row and save spreadsheet data as **CSV UTF-8** or TSV. Excel
files (`.xlsx` and `.xls`) are not read directly. Comma, tab, semicolon, and
pipe delimiters are supported.

## Load the data and build a network

1. Drop the data file on the opening panel, or choose **File → Load Data**.
2. Check the preview and set **Format** to **Long (events)** or
   **Wide (sequences)**.
3. Review the detected mapping. For long data, confirm at least **Action** and
   preferably **Actor** plus **Time** or **Order**. For wide data, confirm the
   optional ID and the state-column span.
4. Select **Group**, **Session**, or adjust **Gap** if the study design needs
   them.
5. Click **Build Network**.

Use **Sequence Data** to inspect the processed sequences. If they do not match
the intended cases or order, expand the data card, correct the mapping, and
rebuild.

## Add and run analyses

A useful first workflow is:

1. **Describe → State frequencies** to check the state distribution.
2. **Validate → Bootstrap (edges)** or **Reliability (whole model)** to assess
   stability.
3. **Analyze → Centrality measures** and **Community detection** to examine
   network structure.
4. **Sequences** and **Pattern mining** to inspect trajectories and recurring
   subsequences.
5. **Compare** for group or network comparisons.
6. **High-order** when first-order transitions do not capture the relevant
   memory or pathway structure.

Configure a cell and use its run button. **Run All** reruns every analysis cell
in notebook order. The flask button reveals experimental methods; keep it off
for the curated default surface.

## Export results

Each result cell has an **Export** menu. Tables can be copied or downloaded in
CSV, TSV, JSON, Markdown, HTML, or Word-compatible form. Plots can be exported
as SVG or PNG, and underlying data can be downloaded where available. Use
**File → HTML Report**, **Word (.doc)**, or **Print / PDF** for a
notebook-level output.

## Save, resume, and share

Rename the notebook in the title field, then click **Save** or press
<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>S</kbd>. This downloads a self-contained
`.html` file with the data, settings, cells, and results embedded. That file
is the portable copy to archive or share.

CarmNote also autosaves a working copy in the current browser and exposes it
through **File → Open Notebook**, but browser storage is not a substitute for
the downloaded file. **Save As** creates another browser-library entry; use
**Save** whenever you need a file on disk.

The lower-left lock control provides four sharing states:

- **Editable** — the notebook can be changed normally.
- **Read-only** — a soft presentation state that can be returned to editable.
- **Locked** — a frozen copy; editing requires **Duplicate to editable copy**.
- **Sealed** — locked with a SHA-256 fingerprint that flags later changes.

Set the intended state first, then click **Save** to download that version.
Keep an editable saved copy before locking or sealing important work.

## Troubleshooting

- **The browser shows code:** return to GitHub and use **Download raw file**.
- **Excel will not load:** export the sheet as CSV UTF-8 or TSV.
- **Sequences look wrong:** verify Long/Wide format, Actor/Action mapping, the
  ordering column, Session, and Gap, then rebuild.
- **Analysis cells say “Build a network first”:** rebuild the network from the
  data card before running downstream cells.
- **A new release restores an unsuitable browser state:** choose
  **File → Reset notebook storage & reload**. This clears CarmNote TNA's
  browser library but does not delete saved `.html` files.
