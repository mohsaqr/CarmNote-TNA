# CarmNote TNA User Guide

[Documentation index](./INDEX.md) ·
[Downloads and versions](./DOWNLOADS-AND-VERSIONS.md) ·
[Menus and interface](./MENUS-AND-INTERFACE.md) ·
[Cell reference](./CELL-REFERENCE.md)

This guide describes how CarmNote TNA is downloaded, how sequence data are
prepared, and how an analysis is run, exported, and saved as a portable
notebook. CarmNote TNA is a self-contained HTML application: it requires no
installation, account, server, or internet connection after download.

## Downloading and opening CarmNote TNA

The [latest recommended build](../index.html?raw=1) is downloaded with its
`.html` extension kept and is opened in a current web browser.

The recommended build is the full `j` variant. It is the smallest
non-minified release and is suitable for most analyses. The `w` variant uses
WebAssembly to accelerate computational kernels for larger datasets.

If GitHub shows the HTML source instead of downloading the file, the
**Download raw file** button retrieves the file itself. Copying the displayed
source into a new file is not a substitute.

## Sequence data preparation

CarmNote TNA accepts CSV or TSV in long or wide format.

### Long format

When no dataset is at hand, **Generate sample data…** (the button under the
drop card, or **File → Generate sample data…** at any time) opens a dialog
with settings for the vocabulary, the number of students, sessions per
student, sequence length and a seed — the dialog shows what it will produce —
followed by **Generate & load** or **Download CSV** (the same long-format
file, one row per event, for R or another notebook). Default: 1,000
learning sessions (100 students × 10 sessions, eight learning actions — Plan,
Read, Watch, Discuss, Practice, Write, Review, Reflect — with timestamps and a
High/Low achievement group; the **verbs** menu swaps in one of Saqrlab's
learning-state categories — metacognitive, cognitive, behavioral, social,
motivational, affective, group regulation (SSRL), LMS events — or one of two
profile-based sets: **Engagement** (Active / Moderate / Disengaged) and
**Collaborative roles** (Leader / Active / Moderator / Isolate), where students
are split evenly across the profiles, each student's own state has a high
self-transition, and the `group` column is the profile), created in the
browser from a seeded model at the moment of the click. Nothing is bundled in
the file; the small **seed** box next to the link (default 14) fixes the draw,
so the same seed always yields the same data and a different seed a different
cohort, and the result loads exactly like a dropped CSV (auto-detected as
Actor = student, Action = action, Time = timestamp, Session = session,
Group = achievement).

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

`Time` holds timestamps, `Order` an explicit event order, `Session` named
sessions within one actor, and `Group` conditions or cohorts. If both `Time`
and `Order` are absent, rows are used in file order. The `Gap` setting can
split an actor's events into sessions based on elapsed seconds.

`Session` is nested in `Actor`: with `Actor = student` and `Session =
submission`, each student × submission pair becomes one sequence, exactly as
`Nestimate::build_network(actor =, session =)` builds it. (Releases up to
2.3.69 ignored the `Session` choice and built one sequence per actor.)

`Order` is **sorted on**, as R's `tna::prepare_data()` and Nestimate do. That
is right when the column is a step index within each sequence, and wrong when
it restarts inside a sequence — a "position within line" column, for
example — because sorting then pulls every step-1 row together and inflates
the self-loops. For that reason `Order` is never auto-selected (from 2.3.70):
it is a deliberate choice, equivalent to passing `order =` in R. When a
chosen `Order` changes any sequence relative to file order, the data card
shows *"Order column … changed the event order in N of M sequences"*; if that
is not intended, `Order` is set back to none and the network is rebuilt.

### Wide format

Wide format has one complete sequence per row and one state per successive
column.

```csv
Actor,Group,T1,T2,T3,T4
S01,Control,Start,Read,Quiz,Finish
S02,Treatment,Start,Video,Quiz,Finish
```

The first and last state columns (`T1` to `T4` above) define the state span.
Columns outside that span remain metadata and can later be used for grouping
and comparison.

Files require a header row; spreadsheet data are saved as **CSV UTF-8** or
TSV. Excel files (`.xlsx` and `.xls`) are not read directly. Comma, tab,
semicolon, and pipe delimiters are supported.

## Loading the data and building a network

1. The data file is dropped on the opening panel, or loaded with
   **File → Load Data**.
2. The preview is checked and **Format** is set to **Long (events)** or
   **Wide (sequences)**.
3. The detected mapping is reviewed. For long data, at least **Action** and
   preferably **Actor** plus **Time** or **Order** are confirmed. For wide
   data, the optional ID and the state-column span are confirmed.
4. **Group**, **Session**, or **Gap** are set if the study design needs them.
5. **Build Network** is selected.

**Sequence Data** displays the processed sequences. If they do not match the
intended cases or order, the data card is expanded, the mapping corrected,
and the network rebuilt.

## Adding and running analyses

A typical first workflow is:

1. **Describe → State frequencies** for the state distribution.
2. **Validate → Bootstrap (edges)** or **Reliability (whole model)** for
   stability.
3. **Analyze → Centrality measures** and **Community detection** for network
   structure.
4. **Sequences** and **Pattern mining** for trajectories and recurring
   subsequences.
5. **Compare** for group or network comparisons.
6. **High-order** when first-order transitions do not capture the relevant
   memory or pathway structure.

Each cell is configured and then executed with its run button. **Run All**
reruns every analysis cell in notebook order. The flask button reveals
experimental methods; with it off, the curated default surface is shown.

## Exporting results

Each result cell has an **Export** menu. Tables can be copied or downloaded in
CSV, TSV, JSON, Markdown, HTML, or Word-compatible form. Plots can be exported
as SVG or PNG, and underlying data can be downloaded where available.
**File → HTML Report**, **Word (.doc)**, and **Print / PDF** produce
notebook-level output.

## Saving, resuming, and sharing

The notebook is named in the title field and saved with **Save** or
<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>S</kbd>. This downloads a self-contained
`.html` file with the data, settings, cells, and results embedded. That file
is the portable copy to archive or share.

CarmNote also autosaves a working copy in the current browser and exposes it
through **File → Open Notebook**, but browser storage is not a substitute for
the downloaded file. **Save As** creates another browser-library entry;
**Save** is the command that produces a file on disk.

The lower-left lock control provides four sharing states:

- **Editable** — the notebook can be changed normally.
- **Read-only** — a soft presentation state that can be returned to editable.
- **Locked** — a frozen copy; editing requires **Duplicate to editable copy**.
- **Sealed** — locked with a SHA-256 fingerprint that flags later changes.

The intended state is set first, and **Save** then downloads that version.
An editable saved copy should be kept before important work is locked or
sealed.

## Troubleshooting

- **The browser shows code:** the file is downloaded again from GitHub with
  **Download raw file**.
- **Excel will not load:** the sheet is exported as CSV UTF-8 or TSV.
- **Sequences look wrong:** the Long/Wide format, Actor/Action mapping, the
  ordering column, Session, and Gap are verified, and the network is rebuilt.
- **Analysis cells say “Build a network first”:** the network is rebuilt from
  the data card before downstream cells are run.
- **A new release restores an unsuitable browser state:**
  **File → Reset notebook storage & reload** clears CarmNote TNA's browser
  library but does not delete saved `.html` files.
