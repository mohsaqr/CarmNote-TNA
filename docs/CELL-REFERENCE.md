# CarmNote TNA Cell Reference

[Documentation index](./INDEX.md) ·
[Downloads and versions](./DOWNLOADS-AND-VERSIONS.md) ·
[User guide](./USER-GUIDE.md) ·
[Menus and interface](./MENUS-AND-INTERFACE.md)

This document follows the same order as the CarmNote TNA analysis menus.

## How to read this reference

Every cell is documented with the same five questions:

- **Purpose** — what analytical question it addresses.
- **Requires** — data/model state needed before it can run.
- **Main controls** — settings that materially affect the analysis.
- **Produces** — the principal tables, plots, or models.
- **Cautions** — interpretation or performance cautions.

Most cells require a built network. Group-aware cells expose a **Source**
selector when group, cluster, or mixture models exist.

## Build menu

### Network

- **Purpose:** Builds the base transition-network model from processed
  sequences. This is the normal first cell.
- **Requires:** Loaded and correctly mapped long- or wide-format sequence
  data.
- **Main controls:** Model type, scaling, ATNA beta, pruning threshold,
  optional synthetic START/END states, and global plot options.
- **Produces:** Transition-network plot, model summary, transition matrix, and
  the model consumed by downstream cells.
- **Cautions:** **Prune** changes the model and therefore downstream
  analyses. Display-only edge filtering in Plot options does not have the
  same meaning.

#### Model types

| Type | Meaning | Typical use |
|---|---|---|
| `tna` | Row-normalized transition probabilities | Default model for relative transition tendencies |
| `ftna` | Raw transition frequencies | When absolute transition volume is the quantity of interest |
| `ctna` | Bidirectional co-occurrence counts | When co-presence/co-occurrence is more relevant than direction |
| `atna` | Attention-weighted transitions with exponential decay | When recent or nearby transitions should carry more weight |

Scaling can be none, min-max, maximum, or rank. ATNA beta controls attention
decay and is ignored by other model types.

### Groups

- **Purpose:** Builds one transition network per value of a grouping column.
- **Requires:** Loaded data containing a valid group/condition/cohort column.
- **Main controls:** Group column, model type, scaling, ATNA beta, and stacked
  versus two- or three-column layout.
- **Produces:** One model and network per group plus group summaries.
- **Cautions:** Each sequence should map to exactly the intended
  group. Small groups can produce unstable networks and misleading visual
  differences.

### Cluster sequences

- **Purpose:** Clusters similar trajectories, then builds one transition network
  per cluster.
- **Requires:** Built sequences.
- **Main controls:** Number of clusters; sequence distance (Hamming,
  Levenshtein, OSA, Damerau-Levenshtein, LCS, Q-gram, cosine, Jaccard, or
  Jaro-Winkler); clustering method (PAM or hierarchical variants); model type;
  layout; optional centralities.
- **Produces:** Cluster assignments, cluster summaries, and cluster-specific
  networks.
- **Cautions:** Hamming is most meaningful for aligned sequences of
  comparable length. Distance-based clustering can be expensive because it
  requires pairwise sequence comparisons.

### Mixture Markov model

- **Purpose:** Finds latent sequence groups whose transition processes differ,
  using a mixture of Markov models fitted by expectation-maximization.
- **Requires:** Built sequences.
- **Main controls:** Number of components, independent restarts, random seed,
  maximum EM iterations, Laplace smoothing alpha, and result layout.
- **Produces:** Posterior cluster assignments, fit diagnostics, component
  transition networks, and state proportions.
- **Cautions:** Multiple restarts reduce sensitivity to initialization.
  Alpha `0` is unsmoothed maximum likelihood and can assign zero probability
  to unseen transitions; the small default smoothing is safer for sparse data.

## Describe menu

### State frequencies

- **Purpose:** Checks how often each state occurs.
- **Requires:** A built model.
- **Main controls:** Treemap, bar chart, and frequency table.
- **Produces:** Area-proportional treemap, colored frequency bars, and/or count
  table. Group models use side-by-side group bars.
- **Cautions:** This describes marginal state prevalence, not transition
  direction or conditional probability.

### State mosaic

- **Purpose:** Shows transition or group-by-state structure using mosaic areas
  and standardized residuals.
- **Requires:** A built model; group models enable group mosaics.
- **Main controls:** No major numeric controls.
- **Produces:** Transition mosaic for a single model or group mosaic with
  chi-square residual coloring.
- **Cautions:** Strong colors indicate departure from an independence
  expectation, not necessarily a large practical effect. Sparse expected
  counts weaken chi-square interpretation.

### Transition weights

- **Purpose:** Inspects the model's transition-weight matrix and the distribution
  of non-zero edge weights.
- **Requires:** A built model.
- **Main controls:** Weight-matrix table and edge-weight histogram.
- **Produces:** Matrix table and/or histogram.
- **Cautions:** The meaning of a weight depends on the model type:
  probability, frequency, co-occurrence, or attention weight.

## Validate menu

### Bootstrap edges

- **Purpose:** Assesses edge stability by resampling sequences with replacement.
- **Requires:** A built model and enough sequences for resampling.
- **Main controls:** Iterations, significance level, edge-filter mode
  (consistency range or probability cutoff), range/cutoff, seed, and
  network/table output.
- **Produces:** Bootstrap edge summaries, stability classifications, table,
  and optional filtered network.
- **Cautions:** More iterations improve Monte Carlo precision but take
  longer. Bootstrap is different from case-dropping because cases are sampled
  with replacement.

### Centrality stability

- **Purpose:** Estimates how centrality rankings change as increasing
  proportions of cases are removed.
- **Requires:** A built model with enough cases and non-degenerate
  centralities.
- **Main controls:** Iterations per drop proportion, drop proportions,
  correlation threshold, certainty, Pearson/Spearman/Kendall correlation,
  self-loops, seed, selected centralities, source, and outputs.
- **Produces:** Case-dropping curves, centrality-stability coefficients, and
  summary tables.
- **Cautions:** A high coefficient means rankings remain correlated under
  case removal; it does not prove that centrality is substantively meaningful.

### Case-dropping edges

- **Purpose:** Measures how edge-weight vectors change when increasing
  proportions of cases are omitted.
- **Requires:** A built model with enough cases.
- **Main controls:** Iterations, drop proportions, correlation method,
  correlation threshold, and seed.
- **Produces:** Rank-correlation and absolute-weight-change summaries across
  drop proportions, including an edge-stability coefficient.
- **Cautions:** This is method 3 of the validation family: it is neither
  with-replacement bootstrap nor split-half whole-model reliability.

### Reliability whole model

- **Purpose:** Estimates internal consistency by repeatedly splitting sequences
  into two parts, rebuilding the model in each part, and comparing them.
- **Requires:** A built model and enough sequences to create informative
  halves.
- **Main controls:** Iterations, split ratio, scaling, ATNA beta when
  applicable, and seed.
- **Produces:** Distributions and summaries of 22 whole-model similarity and
  difference metrics.
- **Cautions:** A 50/50 split is the standard default. START/END boundary
  settings are inherited from the Network cell.

### Markov order test

- **Purpose:** Tests whether order `k-1` is sufficient or order `k` adds
  predictive information.
- **Requires:** Built sequences with enough repeated contexts.
- **Main controls:** Maximum order, within-context permutations, alpha, and
  seed.
- **Produces:** Per-order log likelihood, AIC, BIC, likelihood-ratio statistic,
  permutation null distributions, and selected-order evidence.
- **Cautions:** The context state space grows rapidly. Orders above 2 or
  3 can require substantial memory on large or diverse datasets.

## Analyze menu

### Centrality

- **Purpose:** Ranks states by structural importance in the transition network.
- **Requires:** A built model.
- **Main controls:** Selected measures, normalization, self-loop inclusion,
  group source, charts, and table.
- **Measures:** OutStrength, InStrength, Betweenness, Closeness,
  in/out-closeness, randomized-shortest-path betweenness, clustering,
  diffusion, and PageRank.
- **Produces:** Measure-specific charts and node table.
- **Cautions:** Centralities answer different questions and should not be
  treated as interchangeable. Diffusion can be slow on large graphs.

### Edge betweenness

- **Purpose:** Identifies transition edges that bridge many shortest paths.
- **Requires:** A built model.
- **Main controls:** Network/table output, top number of edges, layout, and
  group source.
- **Produces:** Network whose edge width represents edge betweenness and a
  ranked edge table.
- **Cautions:** The plotted width represents betweenness, not the original
  transition probability.

### Community

- **Purpose:** Finds groups of states that are densely connected relative to
  the rest of the network.
- **Requires:** A built model.
- **Main controls:** Louvain, Walktrap, fast-greedy, label propagation,
  leading eigenvector, or edge-betweenness method; group source; network/table
  output.
- **Produces:** Community-colored network, membership table, and community
  summaries.
- **Cautions:** Methods can return different partitions. The
  selected method is reported and its sensitivity to weak-edge pruning examined.

### Maximal cliques

- **Purpose:** Finds fully connected state subsets in the thresholded network.
- **Requires:** A built model.
- **Main controls:** Minimum clique size, minimum included edge weight, network
  output, and table output.
- **Produces:** Clique-specific views and membership table.
- **Cautions:** Directed transition networks are converted to the
  connectivity definition used by the clique routine. Dense low-threshold
  graphs can contain very many cliques.

## Sequences menu

### Sequence index plot

- **Purpose:** Inspects raw trajectories and their position-wise state
  distribution.
- **Requires:** Built sequences.
- **Main controls:** State distribution, entropy over time, mean time in state,
  sequence index plot, sequence table, and length trimming by percentile,
  fixed cap, or none.
- **Produces:** Selected sequence plots and optional sequence table.
- **Cautions:** Trimming affects display, not the underlying model. The
  trim rule is recorded when a figure is reported.

### Sequence indices

- **Purpose:** Computes per-sequence dynamics such as entropy, complexity,
  turbulence, spell duration, transition rate, and related indices.
- **Requires:** Built sequences.
- **Main controls:** Favorable states for integrative potential, time-weighting
  omega, plots, summary, per-sequence detail, plot type, and group source.
- **Produces:** Up to 24 indices, group comparison plots, summary table, and
  optional sequence-level detail.
- **Cautions:** “Favorable” is a substantive user definition, not a
  property inferred by the software.

## Pattern mining menu

### Discover patterns

- **Purpose:** Finds recurrent contiguous n-grams, gapped pairs, or repeated
  states.
- **Requires:** Built sequences.
- **Main controls:** Pattern type, lengths, gap sizes, minimum frequency,
  minimum sequence support, start/end state filters, top N, and group source.
- **Produces:** Ranked pattern table and top-pattern plot.
- **Cautions:** Searching more lengths and lower thresholds increases the
  number of candidate patterns and the chance of noisy findings.

### Pattern comparison heatmap

- **Purpose:** Compares pattern frequencies across two or more groups.
- **Requires:** A group model, cluster model, or other valid group source.
- **Main controls:** Minimum/maximum pattern length, minimum frequency,
  permutation test, iterations, seed, and group source.
- **Produces:** Standardized-residual heatmap, group pattern-frequency table,
  and optional permutation evidence.
- **Cautions:** Residuals show relative over/under-representation
  and are interpreted together with actual counts and group sizes.

### Pattern comparison pyramid

- **Purpose:** Compares the most discriminating patterns between exactly two
  groups using back-to-back bars.
- **Requires:** Exactly two groups.
- **Main controls:** Pattern-length range, minimum frequency, top N, optional
  p-values, iterations, seed, and source.
- **Produces:** Two-sided pyramid plot with residuals and BH-adjusted
  permutation p-values when enabled.
- **Cautions:** Three or more groups require the heatmap cell.

### Pattern × outcome

- **Purpose:** Describes how top patterns are distributed across categorical
  outcomes.
- **Requires:** Built sequences and a categorical outcome source: last state,
  group column, or cluster label.
- **Main controls:** Outcome source, top N, pattern type, lengths, gaps,
  minimum frequency, and minimum support.
- **Produces:** Horizontal stacked bars, one per pattern, segmented by outcome
  with percentages.
- **Cautions:** This cell is descriptive. **Outcome regression** provides
  inferential modelling.

### Outcome regression

- **Purpose:** Tests or models associations between discovered patterns and an
  outcome.
- **Requires:** Built sequences and a valid categorical or numeric outcome.
- **Main controls:** Outcome source/column, top N, pattern settings, presence
  versus frequency encoding, univariate/multivariable/both, and BH/Holm/no
  adjustment.
- **Produces:** Univariate odds ratios/tests, joint logistic regression, or
  continuous-outcome OLS results as appropriate.
- **Cautions:** Pattern selection and model fitting on the same data can
  overstate evidence. Event counts, multicollinearity, separation, and
  multiplicity require attention.

## Compare menu

### Network properties

- **Purpose:** Compares overall similarity and dissimilarity between group
  networks.
- **Requires:** At least two networks from a group, cluster, or mixture source.
- **Main controls:** Group source.
- **Produces:** Pairwise heatmap of correlations, similarities,
  dissimilarities, and deviations.
- **Cautions:** This is descriptive and summarizes whole matrices; it
  does not identify statistically significant individual edges.

### Difference network

- **Purpose:** Shows where two group networks have different edge weights.
- **Requires:** At least two group networks.
- **Main controls:** Difference-network plots, weight-difference heatmaps, and
  source.
- **Produces:** Pairwise edge-difference networks and/or matrix heatmaps.
- **Cautions:** This cell is descriptive. A visible difference is not a
  significance test.

### Permutation test

- **Purpose:** Tests edge-weight differences between groups by permuting group
  membership.
- **Requires:** Group-labelled sequences and at least two group networks.
- **Main controls:** Iterations, alpha, multiple-comparison adjustment, seed,
  and group source.
- **Produces:** Significant difference networks and edge-level permutation
  results.
- **Cautions:** The grouping/exchangeability assumptions of the study
  design must be preserved. More tested edges require stronger multiplicity control.

### Position-wise JSD

- **Purpose:** Locates sequence positions at which group state distributions
  differ.
- **Requires:** Group-labelled sequences.
- **Main controls:** Minimum/maximum considered length, minimum frequency,
  seed, and group source.
- **Produces:** Position-wise Jensen-Shannon divergence profile.
- **Cautions:** Positions must have comparable meaning across sequences.
  Heavy missingness or variable-length attrition at later positions can drive
  apparent differences.

## Process mining menu

The **Process mining** cell has a **Method** selector. Its form changes to the
chosen method and one **Run** button dispatches the analysis. Both methods read
the same sequences as an **event log**: cases made of activities that directly
follow one another.

### Process map

- **Purpose:** Shows the directly-follows map of the process — every activity a
  box, every hand-off an arrow — annotated with a selected measure.
- **Requires:** Built sequences. Duration measures additionally require a Time
  column mapped in the data panel.
- **Main controls:** Node metric and edge metric, each chosen independently
  from the frequency, case, and duration families; optional secondary metric
  for each, shown in brackets; time units; activity and path simplification
  sliders; flow direction; Start/End boundary nodes; self-loops; tables.
- **Produces:** The map as a vector figure, plus activity and hand-off tables.
- **Cautions:** The simplification sliders change **display only** — every
  reported measure is computed on the full log, and the count of hidden
  activities and paths is stated above the map. Without a Time column the
  duration measures are unavailable; the cell says so and falls back to
  absolute frequency rather than drawing a map of blank labels.

The measures follow the bupaR vocabulary:

| Family | Measure | Meaning |
|---|---|---|
| Frequency | absolute | Number of events |
| Frequency | relative | Share of all events |
| Cases | absolute | Number of cases that reach the activity or hand-off |
| Cases | relative | Share of cases |
| Probability | — | Share of the source activity's outgoing flow (edges only) |
| Duration | mean / median / min / max / total | Dwell time in an activity, or transit time between two |

An activity repeated inside one case counts once under **Cases** but several
times under **Frequency**; comparing the two is often the point.

### Directly-Follows Graph

- **Purpose:** The same directly-follows structure as tables rather than a map.
- **Requires:** A built network.
- **Main controls:** Optional start and end labels, number of top edges.
- **Produces:** State table with activity and case frequencies, and an edge
  table of directly-follows counts.
- **Cautions:** For group models the tables show the first group, named
  above the output.

## High-order menu

The **High-order** cell has a **Method** selector. Its form changes to the
chosen method and one **Run** button dispatches the analysis.

### Simplicial complex (pattern motifs)

- **Purpose:** Represents recurrent k-gram pathways as simplex-like motifs.
- **Requires:** Built sequences.
- **Main controls:** Orders, minimum count, optional HYPA significance, alpha,
  p-adjustment, view, visualization range, anomaly filter, sort, and color.
- **Produces:** Card/panel/combined motif visualization and ranked pathway
  table with optional anomaly statistics.
- **Cautions:** This is a pathway-motif view. It is distinct from the
  clique-complex topology used by Homology.

### Homology — Betti + Euler + q-analysis

- **Purpose:** Treats the thresholded network as a clique complex and summarizes
  its topology.
- **Requires:** A built network.
- **Main controls:** Edge threshold, maximum simplex dimension, persistent
  homology steps, and selected output families.
- **Produces:** f-vector, Betti numbers, Euler characteristic, simplicial
  degrees, Atkin q-analysis, and persistent-homology curves.
- **Cautions:** Threshold zero can make a probability network almost
  complete and topologically uninformative. Threshold sensitivity warrants examination.

### Hypergraph centrality

- **Purpose:** Ranks states in a hypergraph built from network cliques.
- **Requires:** A built network.
- **Main controls:** Edge threshold, maximum hyperedge size, CEC/Z-eigen/H-eigen
  measures, solver iterations, and tolerance.
- **Produces:** Hyperedges and selected centrality tables.
- **Cautions:** CEC reduces the hypergraph to a clique expansion; Z and H
  eigenvectors preserve higher-order structure but can be slower or sensitive
  to solver convergence.

### HYPA — Path Anomaly

- **Purpose:** Tests whether observed higher-order paths occur more or less
  often than expected under a De Bruijn hypergeometric null model.
- **Requires:** Built sequences with repeated paths.
- **Main controls:** Order `k`, alpha, minimum count, p-adjustment, and
  simplicial plot options.
- **Produces:** Observed/expected path counts, adjusted p-values, over/normal/
  under classification, table, and optional motif plot.
- **Cautions:** Results depend on the selected order and minimum count.
  Multiplicity correction is needed when many paths are tested.

### Mogen — Order selection

- **Purpose:** Selects a Markov order using AIC, BIC, or sequential
  likelihood-ratio tests.
- **Requires:** Built sequences.
- **Main controls:** Maximum order, selection criterion, LRT alpha, and
  optional optimal-order motif/HYPA plot.
- **Produces:** Per-order fit summary, selected order, transition models, and
  optional motifs.
- **Cautions:** AIC, BIC, and LRT answer related but different selection
  questions and can select different orders.

### HON — Higher-Order Network

- **Purpose:** Extends states with history only when additional context changes
  their outgoing distribution.
- **Requires:** Built sequences.
- **Main controls:** Maximum order, minimum frequency, HON+ versus classical
  HON, repeat collapsing, table rank range/order/sort, optional HYPA
  significance, and motif display.
- **Produces:** Higher-order nodes/edges, ranked edge table, optional anomaly
  statistics, and simplicial motifs.
- **Cautions:** Higher maximum order increases model size.
  Context-extended nodes represent histories, not new observed states.

### HONEM — HON Embeddings

- **Purpose:** Embeds a higher-order network into a lower-dimensional numerical
  representation.
- **Requires:** Built sequences.
- **Main controls:** HON maximum order, embedding dimension, and maximum
  transition-matrix power.
- **Produces:** Higher-order embedding coordinates and associated summaries.
- **Cautions:** This is an experimental representation. Dimension and
  maximum power affect both computation and interpretation.

### Path Dependence

- **Purpose:** Compares context-specific next-state distributions with the
  first-order distribution.
- **Requires:** Built sequences with enough repeated contexts.
- **Main controls:** Context order, minimum context count, and logarithm base.
- **Produces:** Context-level KL divergence, entropy change, and next-state
  “flip” indicators.
- **Cautions:** This is an information-theoretic comparison, not a
  hypothesis test.

## Note menu

### Text

- **Purpose:** Places research questions, decisions, interpretations, and
  citations beside analytical results.
- **Requires:** Nothing; it can be added at any point.
- **Main controls:** Title, headings, paragraph style, bold/italic/underline/
  strike, super/subscript, lists, blockquote, alignment, image, table,
  horizontal rule, and clear formatting.
- **Produces:** Rich-text narrative embedded in the saved notebook and report
  exports.
- **Cautions:** Active or untrusted HTML should not be pasted. Settings
  and interpretation are recorded without exposing confidential identifiers.

## Recommended cell order for a complete analysis

1. **Network** or **Groups**.
2. **State frequencies**, **State mosaic**, and **Transition weights**.
3. One or more **Validate** cells.
4. Selected **Analyze** cells.
5. **Sequence index plot** and **Sequence indices**.
6. Pattern or group comparisons when justified.
7. Higher-order cells only when the research question requires memory,
   pathway anomaly, or topology.
8. **Text** cells throughout to document decisions.

Completed cells are locked and an editable copy is saved, after which a
locked or sealed distribution copy is created.
