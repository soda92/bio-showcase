def count_kmers(seq: str, k: int) -> dict:
    # Write your code here to return a frequency dictionary of K-mers of size k
    # <<< PRACTICE
    frequencies = {}
    if k <= 0 or k > len(seq):
        return frequencies
        
    for i in range(len(seq) - k + 1):
        kmer = seq[i:i+k].upper()
        frequencies[kmer] = frequencies.get(kmer, 0) + 1
        
    return frequencies
    # >>>

seq = "ATGCATGC"
k = 3
print(f"3-mer counts in {seq}: {count_kmers(seq, k)}")
