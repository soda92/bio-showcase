def needleman_wunsch(seq1: str, seq2: str, match=1, mismatch=-1, gap=-1) -> int:
    # Write your code here to calculate the optimal global alignment score
    # <<< PRACTICE
    n, m = len(seq1), len(seq2)
    # Initialize the DP grid
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i * gap
    for j in range(m + 1):
        dp[0][j] = j * gap
        
    # Fill the grid
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = match if seq1[i-1] == seq2[j-1] else mismatch
            dp[i][j] = max(
                dp[i-1][j-1] + s,  # Match/Mismatch
                dp[i-1][j] + gap,   # Gap in seq2
                dp[i][j-1] + gap    # Gap in seq1
            )
            
    # Return the optimal alignment score (bottom-right cell)
    return dp[n][m]
    # >>>

seq1 = "GATTACA"
seq2 = "GCATACU"
print(f"Aligning: {seq1} and {seq2}")
print(f"Alignment Score: {needleman_wunsch(seq1, seq2)}")
