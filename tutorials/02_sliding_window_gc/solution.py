def sliding_window_gc(seq: str, window_size: int) -> list:
    # Write your code here
    # Return a list of GC percentages for each window
    # <<< PRACTICE
    results = []
    for i in range(len(seq) - window_size + 1):
        window = seq[i:i+window_size]
        gc_count = sum(1 for base in window if base in 'GC')
        results.append((gc_count / window_size) * 100)
    return results
    # >>>

# Let's test it
dna = "ATGCATGC"
win = 4
print(f"DNA: {dna}, Window Size: {win}")
print(f"GC Profile: {sliding_window_gc(dna, win)}")
