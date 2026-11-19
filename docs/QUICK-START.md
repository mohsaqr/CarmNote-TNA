# CarmNote TNA at a glance

Transition network analysis represents a process as a network in which the
nodes are the states that occur in a set of sequences and the directed edges
carry the probability of moving from one state to the next. CarmNote TNA
estimates such networks, tests their stability and compares them across
groups, and it does so inside a single HTML file that runs in the browser
without a server or an internet connection. This page follows one worked
example through CarmNote TNA 2.5.5, from raw events to a sealed,
shareable analysis; the [full user guide](./USER-GUIDE.md) documents every
menu, cell and setting in detail.

The example asks whether students with high and low achievement organize
their learning sessions differently. The data are the seeded sample that the
notebook generates itself: 100 students, each observed in 10 sessions of 10
learning actions (planning, reading, watching, discussing, practising,
writing, reviewing and reflecting), with every student classified as a high
or a low achiever.

## From events to sequences

A transition network is estimated from sequences, so the first task is to
state how the rows of a data file form them. CarmNote TNA reads CSV or TSV
files in long format, with one row per event, or in wide format, with one row
per sequence. The notebook's file can be downloaded from the
[CarmNote Store](https://carmstore.lacarm.com/#/note/tna) or the
[release repository](https://github.com/mohsaqr/CarmNote-TNA) and opened with
a double-click; the standard build serves most analyses, and the WebAssembly
build shortens long computations on large data. When no dataset is at hand,
the sample generator draws one from a fixed seed, so that the same settings
always reproduce the same data.

<figure>
<a href="guide/03-sample-dialog.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/03-sample-dialog.webp?v=2.5.5" alt="" width="600" height="362" loading="lazy"></a>
<figcaption>The sample-data generator. A vocabulary of states, the number of students, sessions and events, and a seed determine the dataset completely.</figcaption>
</figure>

Once the file is loaded, the data card asks which column plays which role.
The action column supplies the states and is the only one required. The
actor column assigns events to persons, the time column orders each person's
events, and the session column divides a person's events into separate
sequences, which matters because a transition from the last action of one
session to the first action of the next is not a transition that any student
made. The group column carries the achievement level that the comparison will
rest on.

<figure>
<a href="guide/04-data-card.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/04-data-card.webp?v=2.5.5" alt="" width="860" height="284" loading="lazy"></a>
<figcaption>The sample data mapped: student as Actor, action as Action, timestamp as Time, session as Session and achievement as Group. Each student × session pair becomes one sequence, which yields 1,000 sequences of 10 events.</figcaption>
</figure>

## Estimating the network

Build Network turns the mapped rows into sequences and adds a Network cell,
the first analysis of the notebook. Every analysis in CarmNote TNA is such a
cell: its settings sit above a run button, and its result appears below with
a figure, a table and export controls. The default model estimates, for each
pair of states, the conditional probability that the second follows the
first, so that the outgoing edges of every state sum to one. A pruning
threshold of 0.05 removes the weakest transitions from the model; in the
sample data all 61 edges that remain lie above it.

<figure>
<a href="guide/05-network-cell.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/05-network-cell.webp?v=2.5.5" alt="" width="860" height="961" loading="lazy"></a>
<figcaption>The transition network of all 1,000 sequences. Edge labels are transition probabilities, and the arc around each node shows the proportion of sequences that begin in that state. The strongest self-loop is Watch → Watch (.31).</figcaption>
</figure>

Because the research question concerns two groups, a Groups cell then
estimates one network for each achievement level. The cells added after it
analyse the two networks side by side.

<figure class="fig-tall">
<a href="guide/cell-group.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/cell-group.webp?v=2.5.5" alt="" width="860" height="2768" loading="lazy"></a>
<figcaption>Separate networks for the 530 sequences of high achievers and the 470 sequences of low achievers.</figcaption>
</figure>

## Establishing what can be interpreted

A network estimated from a sample contains edges that would change under a
different sample, and interpretation therefore begins with stability rather
than with the most striking edges. The bootstrap resamples the sequences with
replacement, re-estimates the network each time, and retains an edge as
stable when its weight stays close to the original across the resamples. In
the high-achiever network 35 of the 64 edges meet this criterion; the others
are drawn dashed and are not interpreted.

<figure class="fig-tall">
<a href="guide/cell-bootstrap.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/cell-bootstrap.webp?v=2.5.5" alt="" width="860" height="2644" loading="lazy"></a>
<figcaption>Bootstrap validation with 1,000 resamples. Stable edges are drawn solid; unstable edges are dashed.</figcaption>
</figure>

The same reasoning applies to centralities. Centrality stability drops
increasing proportions of sequences and records how long the ranking of
states remains correlated with the ranking in the full data. InStrength keeps
a correlation-stability coefficient of 0.9 in both groups, so the ranking of
states by the flow they receive is robust. Betweenness reaches 0.6 among high
achievers and only 0.2 among low achievers, which places the betweenness
ranking of the low-achiever network below the commonly accepted minimum of
0.25. A Markov order test completes the checks: it selects order 1, which
indicates that the next action depends on the current one and that a
first-order transition network is an adequate summary of these data.

<figure class="fig-tall">
<a href="guide/cell-stability.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/cell-stability.webp?v=2.5.5" alt="" width="860" height="1560" loading="lazy"></a>
<figcaption>Centrality stability. Each curve traces the correlation between full-data and reduced-data centralities as cases are dropped; the dashed line marks the 0.7 threshold.</figcaption>
</figure>

## Reading the structure

With stability established, centralities describe the role of each state.
InStrength, the total probability flowing into a state, is the measure the
stability analysis supports in both groups. Among high achievers Write
receives the most flow (an InStrength of 1.225), which places writing at the
convergence point of their sessions.

<figure class="fig-tall">
<a href="guide/cell-centrality.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/cell-centrality.webp?v=2.5.5" alt="" width="860" height="2488" loading="lazy"></a>
<figcaption>Centralities of the high and low achiever networks.</figcaption>
</figure>

## Comparing the groups

A visual difference between two networks is not yet evidence of a difference
between the populations they represent. The permutation test addresses this
by reassigning the group labels at random many times and comparing the
observed edge differences with the distribution that random assignment
produces. After Benjamini–Hochberg adjustment for the number of edges tested,
40 transitions differ between the groups.

<figure class="fig-tall">
<a href="guide/cell-compare-perm.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/cell-compare-perm.webp?v=2.5.5" alt="" width="860" height="1405" loading="lazy"></a>
<figcaption>The permutation test with 1,000 permutations. Green edges are stronger among high achievers and red edges among low achievers; asterisks mark the adjusted significance.</figcaption>
</figure>

Sequence patterns show where the difference lies. Watching accounts for 24.6%
of the actions of low achievers and 8.7% of those of high achievers, and the
pattern comparison identifies repeated watching, Watch → Watch, as the
pattern most over-represented among low achievers, with a standardized
residual of 17.6. Low achievers thus not only watch more often but also tend
to remain in watching once they have begun.

<figure>
<a href="guide/cell-compare.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/cell-compare.webp?v=2.5.5" alt="" width="860" height="1271" loading="lazy"></a>
<figcaption>Standardized residuals of pattern frequencies. Positive residuals mark patterns that are more frequent in a group than independence predicts.</figcaption>
</figure>

## Recording and sharing the analysis

The notebook keeps every step of this example as a cell with its settings,
its seed and its result, and a Note cell can hold the research question and
the analytic decisions beside the results they refer to. Save downloads the
whole notebook, data included, as one `.html` file that opens on any computer
with a browser. Before a notebook is shared, the lock menu can make it
read-only, freeze it, or seal it with a fingerprint over its content, so that
a reader can confirm that the analysis has not changed since it was saved.

<figure>
<a href="guide/13-lock-menu.webp?v=2.5.5" aria-label="Full-size screenshot"><img src="guide/13-lock-menu.webp?v=2.5.5" alt="" width="520" height="480" loading="lazy"></a>
<figcaption>The notebook lock menu. A sealed notebook carries a SHA-256 fingerprint and reports any later change when it is opened.</figcaption>
</figure>

The estimators follow the R packages tna and Nestimate. The notebook is
cited as Saqr and López-Pernas (2026) and the method as Saqr et al. (2025);
the complete references, and the remaining analyses (sequence indices,
community detection, process mining and the higher-order models), are in the
[full user guide](./USER-GUIDE.md).
