# Local Sequence Alignment
## The Smith-Waterman Algorithm

While global alignment (Needleman-Wunsch) aligns sequences from end to end, **local alignment** (Smith-Waterman) identifies regions of high similarity within longer, diverging sequences. This is essential for finding conserved domains or genes in chromosomes.

The algorithm uses dynamic programming with the following key differences:
1.  **Lower Bound**: The grid values $DP[i][j]$ cannot be negative. If all options yield a negative score, the cell defaults to `0`.
    $$DP[i][j] = \max(0, DP[i-1][j-1] + \text{score}, DP[i-1][j] + \text{gap}, DP[i][j-1] + \text{gap})$$
2.  **Traceback Origin**: The traceback begins at the **highest value anywhere in the grid** (not necessarily the bottom-right).
3.  **Traceback Terminus**: The traceback stops as soon as it reaches a cell with a value of `0`.

## Objective
Implement `smith_waterman(seq1: str, seq2: str, match=2, mismatch=-1, gap=-1) -> int` that calculates and returns the optimal local alignment score.

## Publication
Smith & Waterman (1981) J. Mol. Biol.
https://pubmed.ncbi.nlm.nih.gov/7265238/
