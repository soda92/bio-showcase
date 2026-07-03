def fastq_trim(seq: str, qual_str: str, min_qual: int) -> str:
    # Write your code here to trim the sequence at the first occurrence
    # of a low-quality base (quality score < min_qual) starting from the left.
    # In molecular biology, quality trimming is done from the 3' (right) end.
    # So we scan from left to right, and as soon as we see a base below min_qual,
    # we truncate the sequence there (returning everything before it).
    # <<< PRACTICE
    trim_index = len(seq)
    for i, char in enumerate(qual_str):
        q_score = ord(char) - 33
        if q_score < min_qual:
            trim_index = i
            break
    return seq[:trim_index]
    # >>>

# Let's test it on a sample sequence
seq = "ATGCATGC"
qual_str = "IIII###I" # 'I' is ord(73)-33 = 40, '#' is ord(35)-33 = 2
print(f"Original: {seq} with qualities {qual_str}")
print(f"Trimmed (min Q=20): {fastq_trim(seq, qual_str, 20)}")
