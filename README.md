# CarmNote TNA

> **Reference:** Saqr, M., & López-Pernas, S. (2026). *CarmNote: A Portable,
> Reproducible, Single-File Computational Software Purely in JavaScript.*
> The 26th International Symposium on Computers in Education (SIIE 2026).

**A portable, reproducible, single-file computational software for Transition
Network Analysis**

[**Mohammed Saqr**](https://saqr.me) — Professor of Learning Analytics and
Artificial Intelligence, University of Eastern Finland ·
[**Sonsoles López-Pernas**](https://sonsoles.me) — Associate Professor,
University of Eastern Finland

CarmNote TNA is a self-contained JavaScript implementation of Transition
Network Analysis (TNA) and its higher-order extensions delivered as a single
HTML document. The software integrates computation, visualisation, user
interaction, and analysis-state persistence within a single executable file
that requires neither internet connectivity nor server-side infrastructure.
All computation executes locally within the browser, allowing analyses to be
created, distributed, reproduced, and preserved without external dependencies,
software installation, or environment reconstruction.

This repository distributes the compiled software only. Every file under
[`versions/`](./versions/) is the complete software: download one file, open
it in a web browser, load a CSV or TSV of sequence data, and analyse. Nothing
is installed and no data leave the machine. The current build is
[`index.html`](./index.html); the table at the end of this page lists every
published version with its checksum.

## Design

CarmNote belongs to the family of Carm software and stands for **Contained**,
**Architecture**-driven, **Runnable**, and **Model**-based design. Contained
refers to the integration of code, interface, visualisations, data, and
results within a single self-sufficient artefact, so that distribution,
execution, and preservation are unified. Architecture-driven refers to the
fact that guarantees such as reproducibility and confidentiality arise from
structural design rather than external policy or user behaviour. Runnable
refers to execution directly within a standard web browser without
installation, configuration, or elevated privileges. Model-based refers to
the embedding of the complete analytical model — data, parameters,
procedures, and outputs — within the same file, so that the analysis can be
inspected, executed, and reproduced as a single unit.

![CarmNote TNA data flow: data ingestion, the in-memory working document, network construction, the analysis units and numerical engine, the rendering backbone, and local persistence](./assets/dataflow.svg)

Because the whole workflow lives in one file, an analysis can be initiated by
one researcher, extended by another, and redistributed without any shared
computational environment or software stack. Each saved file preserves the
complete analytical state, allowing subsequent users to resume work directly
from the last computed configuration, modify parameters, extend the analysis,
and re-export the updated artefact. All data remain on the client side,
loaded into local memory and processed by the browser's native JavaScript
runtime, which ensures that sensitive data never leave the user's device.

CarmNote TNA is part of [**Dynalytics**](https://dynasite.org/) — an
overarching framework and methodological ecosystem for the analysis and
rigorous validation of the dynamics of dynamical systems. Dynalytics
encompasses a diverse family of models — transition networks, co-occurrence
networks, psychological networks, and higher-order networks — unified by a
single philosophy of scientific rigour, in which analysis and validation are
inseparable: a multi-level confirmatory testing battery validates every
supported model and every analytical claim, through split-half reliability
for internal consistency, bootstrapping for edge-level stability,
case-dropping for centrality stability, and permutation-based comparisons
for groups, conditions, and temporal phases.

---

## Functions and Analytical Workflow

CarmNote TNA features a full end-to-end numerical stack written in pure JavaScript, handling matrix algebra, network topologies, and sequence mathematics directly within the client-side environment.

![The analysis verbs of CarmNote TNA in eight groups — build, describe, validate, analyze, sequences, compare, high-order, and note — over the shared visualisation layer, numerical engine, and local state](./assets/architecture.svg)

### Network Analysis & Community Structure

* **Centrality Metrics:** Includes calculations for degree, betweenness, closeness, and eigenvector centrality.
* **Advanced Centralities:** Supports stationary-distribution centrality (PageRank form), randomized shortest-path betweenness, and diffusion centrality.
* **Algorithmic Framework:** Employs Brandes’ algorithm for computing betweenness centrality and Bron–Kerbosch backtracking with pivoting for maximal-clique enumeration.
* **Community Detection:** Evaluates complex network groupings using multiple community detection algorithms powered by modularity optimization routines.

### Sequence Analysis & Pattern Discovery

* **Sequence-Level Indices:** Computes established sequence metrics including transition rate, state diversity, normalized entropy, complexity, turbulence, and spell-duration statistics.
* **Pattern Discovery:** Provides contiguous and gapped sequence mining architectures.
* **Group Testing:** Executes permutation-based group comparisons for discovered sequential patterns using chi-square tests integrated with Benjamini–Hochberg multiple-testing corrections.

### Higher-Order Modelling & Topology

* **Markov Frameworks:** Implements higher-order Markov networks, parameter-free higher-order refinements, and higher-order embeddings.
* **Anomaly & Order Testing:** Conducts hypergeometric path-anomaly detection, multi-order graphical modeling, and likelihood-ratio tests for evaluating Markov order correctness.
* **Topological Summaries:** Extracts algebraic and topological data from clique complexes, providing face vectors, Euler characteristics, and Betti numbers.

### Statistical Validation & Outcome Modelling

* **Robust Validation:** Integrates block bootstrap confidence intervals, case-dropping stability analysis, permutation-based group comparisons, and edge reliability estimations.
* **Group Network Comparisons:** Supports stratified network construction and formal, structured network comparison tests.
* **Outcome Predictive Modeling:** Computes odds-ratio analysis and runs multivariable logistic regression using iteratively reweighted least squares. Statistical significance is managed via Benjamini–Hochberg or Holm multiple-testing corrections.

### Core Numerical Implementation

* **Native Linear Algebra:** Operates on an internal, explicitly defined numerical stack for basic matrix calculations, bypassing external Fortran or C library requirements.
* **Eigen Decomposition:** Stationary distribution estimations, Kemeny–Snell fundamental matrices, and higher-order embeddings are powered natively by power iteration and Jacobi-based eigen decomposition.
* **Exact Integer Algebra:** Employs fraction-free elimination when processing sparse graph structures and Betti numbers to eliminate rounding artifacts and preserve exact structures.
* **Stable Statistical Functions:** Special statistical test probabilities rely on series expansions, continued fractions, and stable log-space recurrences using log-Gamma as a shared numerical foundation.
* **Stochastic Control:** Manages all probabilistic and stochastic algorithms using a single, seeded pseudo-random number generator.
* **State Persistence:** Implements robust workspace caching through the browser’s local storage layer using isolated, specific keys for the overall notebook library, the active notebook workspace, and distinct document states.

---

## Equivalence to Existing Software

To ensure numerical correctness, CarmNote TNA underwent cross-language verification against the reference R implementation for higher-order Markov analysis:

* **Rigorous Testing:** An equivalence framework evaluated 8 method families across 36 parameterised cases, encompassing roughly 5,000 atomic field comparisons and over 27,000 additional simulated dataset comparisons.
* **Stochastic Identity:** Exact reproducibility for random-number generation was accomplished by index replay, where streams generated by R were injected into the JavaScript client sandbox.
* **Precision Limits:** Across all test profiles, the tool matched the R reference to the order of 10⁻¹⁷, which is well below the double-precision machine epsilon boundary of 2.2 × 10⁻¹⁶.

---

## Technical Appendix: Core Algorithms

The following table summarizes the mathematical and algorithmic framework implemented inside the pure JavaScript runtime environment of CarmNote TNA:

| Functional Category | Core Algorithms / Methods | Mathematical Foundations |
| --- | --- | --- |
| **Linear Algebra** | Power iteration, Jacobi-based eigen decomposition | Stationary distribution estimation, Kemeny–Snell fundamental matrices, higher-order embeddings |
| **Sparse Graph Structures** | Fraction-free elimination | Exact integer structure preservation, Betti number calculations |
| **Statistical Special Functions** | Series expansions, continued fractions, stable log-space recurrences | Chi-square tail probabilities, hypergeometric distributions via log-Gamma base |
| **Graph-Theoretic Routines** | Brandes’ algorithm, Bron–Kerbosch backtracking with pivoting | Betweenness centrality, modularity optimization, maximal-clique enumeration |
| **Stochastic Procedures** | Single seeded pseudo-random generator with index replay | Exact cross-language reproducibility and computational identity matching |
| **Persistence Layer** | Browser local storage API | Segmented state isolation for notebook libraries, active workspaces, and active documents |

---

## Variants

Each version is published in two computationally equivalent variants,
distinguished by the letter after the version number in the filename. The
`j` variant implements the entire numerical engine in pure
TypeScript-compiled JavaScript and is the default — it is the smaller file
and the one `index.html` points to. The `w` variant accelerates the
computational kernels with WebAssembly and is preferable for large datasets.
Files ending in `.beta.min.html` are minified builds of the same variants.

## Releases

Released versions are immutable: a file listed here is never changed or
removed, and each is a byte-exact copy of the build output. Downloads can be
verified against the SHA-256 checksums below.

<!-- releases:begin -->
| Version | Date | File | Size | SHA-256 |
|---|---|---|---|---|
| 2.3.64 | 2026-07-14 | [tna-notebook_V2.3.64j.html](./versions/tna-notebook_V2.3.64j.html) | 1.09 MB | `00844f48d54ebb25d2e54934800a73d7fbba68931468930ea44f8642d0f23bfe` |
| 2.3.64 | 2026-07-14 | [tna-notebook_V2.3.64w.html](./versions/tna-notebook_V2.3.64w.html) | 1.77 MB | `a2be7d1bf0201477ed77f681219d5049a505f5d93208894b89aa09f6577c6bb5` |
| 2.3.64 | 2026-07-14 | [tna-notebook_V2.3.64j.beta.min.html](./versions/tna-notebook_V2.3.64j.beta.min.html) | 0.78 MB | `66bec055320f4ec55f533eca43d2b16b7c034bbf0beab400b281008c82af9b3b` |
| 2.3.64 | 2026-07-14 | [tna-notebook_V2.3.64w.beta.min.html](./versions/tna-notebook_V2.3.64w.beta.min.html) | 1.46 MB | `68f07bb9144fc6b2260f68e260b1e2dd0991e99e723126f7b4dad7ee668070f4` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63j.html](./versions/tna-notebook_V2.3.63j.html) | 1.08 MB | `3ecce4d8f5116b34d1714c028057c00fa3def8d5c3a34412fe03a83bbb3d6809` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63w.html](./versions/tna-notebook_V2.3.63w.html) | 1.76 MB | `c8f78222f73f42fc6d5a1525b09a8f154b1f86b22874abfcd4e9e5b286dd5648` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63j.beta.min.html](./versions/tna-notebook_V2.3.63j.beta.min.html) | 0.78 MB | `988a2f10e207abdad316f359b6d196692bcf051624bbf7812ab5667276bd7cb3` |
| 2.3.63 | 2026-07-12 | [tna-notebook_V2.3.63w.beta.min.html](./versions/tna-notebook_V2.3.63w.beta.min.html) | 1.46 MB | `5acd013ad05649a22c95b50a4ce548f5af49bf13b8abd5d1884ea392c4b90e6e` |
<!-- releases:end -->
