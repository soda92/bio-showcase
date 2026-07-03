# DNA Reverse Complement
## Understanding DNA Strands and Pairing

DNA is double-stranded. The two strands run in opposite directions ($5' \rightarrow 3'$ and $3' \rightarrow 5'$). In molecular biology, when we write down a DNA sequence, we always write it in the $5' \rightarrow 3'$ direction.

For the two strands to bind, their bases must pair specifically:
*   **Adenine (A)** pairs with **Thymine (T)**
*   **Cytosine (C)** pairs with **Guanine (G)**

To find the opposite strand of a sequence like **"ATCG"**, we must:
1. Find its complement: **"TAGC"**
2. Reverse it: **"CGAT"** (so it reads $5' \rightarrow 3'$)

This is a fundamental operation used in designing PCR primers (e.g., the reverse primer must target the complementary strand).

## Objective
Implement a function `reverse_complement(seq: str) -> str` that returns the reversed complementary DNA strand of a given sequence. Support uppercase A, T, C, G bases.
