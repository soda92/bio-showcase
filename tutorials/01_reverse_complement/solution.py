def reverse_complement(seq: str) -> str:
    # Write your code here to return the reverse complement
    # <<< PRACTICE
    complement = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    return "".join(complement[base] for base in reversed(seq))
    # >>>

# Let's test it on a sample DNA sequence
dna_seq = "ATCGGCAT"
print(f"Original DNA: {dna_seq}")
print(f"Reverse Complement: {reverse_complement(dna_seq)}")
