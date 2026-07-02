# Bioinformatics & Web Development: Advanced Learning Plan

This is a bioinformatics programming learning plan tailored for you. You will leverage the existing **Django backend + Deno Fresh frontend** architecture of this project to transition from basic primer design to sequence manipulation, classic alignment algorithms, thermodynamic characterization, and NCBI public database integration.

---

## Stage 1: Foundations — Sequence Manipulation & Physical Properties

Extend your current project structure by adding basic DNA/RNA sequence manipulation logic in the backend, and designing interactive UI pages in the frontend to showcase them.

### 1. Learning Objectives
*   Understand how DNA sequences are represented and their core properties (Reverse Complement, Transcription, Translation).
*   Understand the biological significance of **GC Content** in primer design and genomic region analysis (e.g., CpG islands).

### 2. Practical Tasks
*   **Task 1: Reverse Complement & Transcription/Translation Calculator**
    *   **Backend**: Implement a Django API that receives a DNA sequence and returns its reverse complement, transcribed RNA sequence, and translated protein amino acid sequence (by implementing a codon table map).
    *   **Frontend**: Add a new page in Fresh routes to accept DNA input and display these conversion results in real-time.
*   **Task 2: Sliding-Window GC Content Profile**
    *   **Backend**: Calculate the global GC percentage of a DNA sequence. As an optional advanced step, implement a sliding-window algorithm to return an array of local GC percentages along the sequence.
    *   **Frontend**: Use a simple charting library (or Deno-compatible SVG rendering) to dynamically plot the GC content curve.

---

## Stage 2: Algorithms — Sequence Alignment

Sequence alignment is the cornerstone of bioinformatics, used to find similarities and evolutionary relationships between genes or proteins.

### 1. Learning Objectives
*   Master the application of **Dynamic Programming** in sequence alignment.
*   Understand the difference between Global Alignment (Needleman-Wunsch) and Local Alignment (Smith-Waterman).
*   Understand substitution matrices (e.g., BLOSUM62, PAM250) and gap penalties.

### 2. Practical Tasks
*   **Task 3: Implement the Needleman-Wunsch (Global Alignment) Algorithm**
    *   **Backend**: Write the Needleman-Wunsch algorithm in Python from scratch without using third-party alignment libraries. The API should accept two sequences and return the score matrix, the traceback path, and the final aligned sequences.
    *   **Frontend**: Render the dynamic programming alignment matrix as an interactive grid, highlighting the traceback path and indicating match (`|`) and gap (`-`) characters.
*   **Task 4: Implement the Smith-Waterman (Local Alignment) Algorithm**
    *   Modify the global alignment code to handle local alignment by adjusting the boundary scoring rules and traceback termination conditions.

---

## Stage 3: Thermodynamic Properties & Primer Specificity

Delve deeper into the biological and thermodynamic constraints used by `primer3` under the hood.

### 1. Learning Objectives
*   Understand primer dimers (hairpins, self-dimerization, and cross-dimerization) and their thermodynamic principles.
*   Understand melting temperature ($T_m$) calculations using basic formulas (e.g., Wallace formula) and the nearest-neighbor thermodynamic model.
*   Understand the necessity of **specificity checks** to avoid off-target amplification.

### 2. Practical Tasks
*   **Task 5: Hairpin & Dimer Detection Tool**
    *   **Backend**: Write an algorithm to scan a primer sequence for self-complementary regions, calculate the Gibbs free energy ($\Delta G$), and predict whether it is prone to forming hairpin loops.
*   **Task 6: Primer Specificity BLAST Check**
    *   Use the `Biopython` library to query NCBI servers remotely or set up a local `blastn` installation. BLAST your designed primers against a reference genome (e.g., Human or Mouse) to check for potential off-target amplification and display warnings in the frontend.

---

## Stage 4: Integration — Public Databases & Entrez APIs

Real-world bioinformatics relies heavily on querying and downloading data from public biological databases.

### 1. Learning Objectives
*   Familiarize yourself with databases like NCBI and Ensembl, and standard file formats (FASTA, GenBank).
*   Learn to retrieve gene, protein, and literature data programmatically using the NCBI Entrez API.

### 2. Practical Tasks
*   **Task 7: Gene Query & Automated Primer Design Pipeline**
    *   **Backend**: Use the `Entrez` module in `Biopython` to allow users to search by gene ID (e.g., `BRCA1`) or Accession Number and retrieve the FASTA sequence directly from NCBI.
    *   **Pipeline Integration**: Feed the retrieved sequence automatically into your existing PCR primer design API, creating a seamless workflow: **Search Gene -> Auto-Retrieve -> Design PCR Primers**.
    *   **Frontend**: Build a clean, modern search and workflow dashboard interface.

---

## Recommended Learning Resources

### 1. Theoretical & Hands-on Practice
*   **Rosalind**: [rosalind.info](https://rosalind.info/) – A platform for learning bioinformatics through problem-solving. Strongly recommended to implement algorithms from scratch.
*   **Textbook**: *Bioinformatics: Sequence and Genome Analysis* (by David W. Mount).
*   **Book**: *Bioinformatics Programming Using Python* (by Mitchell L Model).

### 2. Essential Python Libraries
*   **[Biopython](https://biopython.org/)**: The industry standard library for parsing formats (FASTA, GenBank), interfacing with NCBI Entrez, and performing simple biological operations.
*   **[primer3-py](https://pypi.org/project/primer3-py/)**: The core wrapper package used in this project for designing PCR primers.
