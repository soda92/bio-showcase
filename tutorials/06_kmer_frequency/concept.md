# K-mer Frequency Analysis
## Understanding Sequence Complexity and Signatures

A **K-mer** is a biological sequence substring of length $k$. Evaluating K-mer frequencies is a core computational step in:
1.  **De Novo Genome Assembly**: Using overlapping K-mers to build de Bruijn graphs.
2.  **Metagenomic Classification**: Matching K-mer signatures against database organisms.
3.  **Sequence Complexity Profiling**: Finding repetitive sequences (like microsatellites) and low-complexity regions.

For a sequence of length $L$, there are exactly $L - k + 1$ overlapping K-mers.

## Objective
Implement `count_kmers(seq: str, k: int) -> dict` that accepts a sequence and returns a dictionary mapping each unique K-mer substring to its occurrence count.
