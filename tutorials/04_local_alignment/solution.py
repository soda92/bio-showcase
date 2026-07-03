def smith_waterman(seq1: str, seq2: str, match=2, mismatch=-1, gap=-1) -> int:
    # Write your code here to return the highest local alignment score
    # <<< PRACTICE
    n, m = len(seq1), len(seq2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    max_score = 0
    
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = match if seq1[i-1] == seq2[j-1] else mismatch
            dp[i][j] = max(
                0,
                dp[i-1][j-1] + s,
                dp[i-1][j] + gap,
                dp[i][j-1] + gap
            )
            max_score = max(max_score, dp[i][j])
            
    return max_score
    # >>>

seq1 = "HELLOWORLD"
seq2 = "LLOWOR"
print(f"Local alignment score between {seq1} and {seq2}: {smith_waterman(seq1, seq2)}")
