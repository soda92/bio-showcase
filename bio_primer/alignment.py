def solve_alignment(seq1: str, seq2: str, match=2, mismatch=-1, gap=-1, align_type="global"):
    """
    Computes global (Needleman-Wunsch) or local (Smith-Waterman) sequence alignment.
    Returns:
        matrix: 2D list of scores (N+1) x (M+1)
        path: list of [i, j] coordinates on the optimal traceback path
        aligned1: aligned string of seq1
        aligned2: aligned string of seq2
        score: final alignment score
    """
    n, m = len(seq1), len(seq2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    
    # 1. Initialize boundary cells
    if align_type == "global":
        for i in range(n + 1):
            dp[i][0] = i * gap
        for j in range(m + 1):
            dp[0][j] = j * gap
    else:
        # Smith-Waterman boundaries are all 0
        for i in range(n + 1):
            dp[i][0] = 0
        for j in range(m + 1):
            dp[0][j] = 0
            
    # 2. Fill the matrix
    max_val = -1
    max_pos = (0, 0)
    
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = match if seq1[i-1] == seq2[j-1] else mismatch
            diag = dp[i-1][j-1] + s
            up = dp[i-1][j] + gap
            left = dp[i][j-1] + gap
            
            if align_type == "global":
                dp[i][j] = max(diag, up, left)
            else:
                val = max(0, diag, up, left)
                dp[i][j] = val
                if val > max_val:
                    max_val = val
                    max_pos = (i, j)
                    
    # 3. Traceback
    path = []
    aligned1_chars = []
    aligned2_chars = []
    
    if align_type == "global":
        i, j = n, m
        score = dp[n][m]
        path.append([i, j])
        while i > 0 or j > 0:
            s = match if (i > 0 and j > 0 and seq1[i-1] == seq2[j-1]) else mismatch
            if i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1] + s:
                aligned1_chars.append(seq1[i-1])
                aligned2_chars.append(seq2[j-1])
                i -= 1
                j -= 1
            elif i > 0 and (j == 0 or dp[i][j] == dp[i-1][j] + gap):
                aligned1_chars.append(seq1[i-1])
                aligned2_chars.append("-")
                i -= 1
            else:
                aligned1_chars.append("-")
                aligned2_chars.append(seq2[j-1])
                j -= 1
            path.append([i, j])
    else:
        # Local
        i, j = max_pos
        score = max_val if max_val != -1 else 0
        path.append([i, j])
        while i > 0 and j > 0 and dp[i][j] > 0:
            s = match if seq1[i-1] == seq2[j-1] else mismatch
            if dp[i][j] == dp[i-1][j-1] + s:
                aligned1_chars.append(seq1[i-1])
                aligned2_chars.append(seq2[j-1])
                i -= 1
                j -= 1
            elif dp[i][j] == dp[i-1][j] + gap:
                aligned1_chars.append(seq1[i-1])
                aligned2_chars.append("-")
                i -= 1
            else:
                aligned1_chars.append("-")
                aligned2_chars.append(seq2[j-1])
                j -= 1
            path.append([i, j])
            
    # Reverse final lists
    aligned1 = "".join(reversed(aligned1_chars))
    aligned2 = "".join(reversed(aligned2_chars))
    
    return {
        "matrix": dp,
        "path": path,
        "aligned1": aligned1,
        "aligned2": aligned2,
        "score": score
    }
