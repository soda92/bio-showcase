# Translation & the Genetic Code
## From DNA to Protein Sequences

In biological systems, DNA is transcribed into messenger RNA (mRNA), which is then translated into proteins. This process is called the Central Dogma of Molecular Biology.

Translation reads mRNA nucleotides in groups of three called **codons**. Each codon maps to a specific **amino acid** or indicates the termination of translation (a **Stop codon**).

Key details:
1.  **Transcription**: Thymine (T) in DNA maps to Uracil (U) in RNA. However, in bioinformatics, translation calculators often translate DNA directly.
2.  **Genetic Code**: The standard codon table maps triplets to amino acids (e.g., `ATG` is Methionine, the Start codon).
3.  **Stop Codons**: `TAA`, `TAG`, and `TGA` terminate translation. The translated sequence should stop immediately upon hitting any of these.

## Objective
Implement `translate_dna(seq: str) -> str` that accepts a DNA sequence, translates it from the start index (reading frame 1), and returns the resulting single-letter amino acid protein string (excluding the stop codon itself).
