# CarmNote TNA Documentation

This documentation applies to the compiled CarmNote TNA release distributed
in this repository.

## Contents

1. [User guide](./USER-GUIDE.md) — data preparation, network construction,
   analysis, export, saving, and sharing.
2. [Menus and interface](./MENUS-AND-INTERFACE.md) — every header, File,
   data, plot, cell, export, and lock control.
3. [Cell reference](./CELL-REFERENCE.md) — every analysis cell, organized in
   the same order as the notebook menus.
4. [Carm Research License](https://github.com/mohsaqr/carm-license) — the
   canonical license, version history, and third-party notices.
5. [Downloads and versions](./DOWNLOADS-AND-VERSIONS.md) — the final guide,
   defining the four JavaScript/WASM and full/minified files.

## Reading paths

### First-time user

The [User guide](./USER-GUIDE.md) is the starting point. The menu and cell
references cover unfamiliar controls and methods, and
[Downloads and versions](./DOWNLOADS-AND-VERSIONS.md) gives the file
definitions.

### Researcher preparing a reproducible analysis

The saving, locking, and sealing sections in
[Menus and interface](./MENUS-AND-INTERFACE.md) are the relevant material,
followed by the [Cell reference](./CELL-REFERENCE.md), which supports
recording the exact settings used by each analysis.

### Instructor or collaborator

The full JavaScript build is suitable unless the dataset is computationally
large. The usual practice is to keep an editable saved copy, distribute a
locked or sealed copy, and share this documentation separately from the
notebook file.

## Documentation scope

The documents describe the current public release and its visible interface.
Older saved notebooks may contain legacy cells that remain executable for
compatibility but are no longer offered in the menus.
