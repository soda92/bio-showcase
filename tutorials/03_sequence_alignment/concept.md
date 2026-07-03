# Global Sequence Alignment
## The Needleman-Wunsch Algorithm

To compare two genes or proteins, we align them to find matching regions, insertions, and deletions. The **Needleman-Wunsch** algorithm uses dynamic programming to find the optimal global alignment. 

It constructs a scoring grid $DP[i][j]$ where:
*   $DP[i][j]$ is the score of aligning the prefixes $seq1[0..i]$ and $seq2[0..j]$.
*   Each cell is calculated as:
    $$DP[i][j] = \max(DP[i-1][j-1] + \text{score}, DP[i-1][j] + \text{gap}, DP[i][j-1] + \text{gap})$$

This algorithm is the foundation for search tools like BLAST and multiple sequence alignment.

## Objective
Implement `needleman_wunsch(seq1: str, seq2: str, match=1, mismatch=-1, gap=-1) -> int` that calculates and returns the optimal global alignment score between two sequences.

## Publication
Needleman & Wunsch (1970) J. Mol. Biol.
https://pubmed.ncbi.nlm.nih.gov/5420325/
