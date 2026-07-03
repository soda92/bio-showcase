# FASTQ Quality Calculator
## Deciphering Phred Quality Scores

Raw next-generation sequencing data is stored in **FASTQ** format. Each read is represented by four lines:
1.  Header starting with `@`
2.  The sequence string
3.  Header starting with `+` (optional comment)
4.  The **Quality score string** (same length as the sequence)

The quality string represents the reliability of each base call using **Phred quality scores**.
*   The Phred score $Q$ is calculated from the base-calling error probability $P$ as:
    $$Q = -10 \log_{10} P$$
*   For example:
    *   $Q = 10 \implies P = 10\%$ error probability (90% accuracy)
    *   $Q = 20 \implies P = 1\%$ error probability (99% accuracy)
    *   $Q = 30 \implies P = 0.1\%$ error probability (99.9% accuracy)

In a FASTQ file, Phred scores are encoded as ASCII characters using the **Sanger (Phred+33)** format. To obtain the score:
$$Q = \text{ord(char)} - 33$$

Trimming low-quality ends of reads is the first step in raw sequence quality control.

## Objective
Implement `fastq_trim(seq: str, qual_str: str, min_qual: int) -> str` that reads a sequence and its corresponding quality string, and trims bases off the right end (3' end) as soon as the base quality drops below `min_qual`. Return the trimmed sequence.
