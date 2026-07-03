# Sliding-Window GC Content
## Analyzing Local Sequence Chemistry

GC content represents the percentage of Guanine (G) and Cytosine (C) bases in a DNA molecule. Unlike AT pairs (linked by 2 hydrogen bonds), GC pairs are linked by **3 hydrogen bonds**. This means regions with high GC content require more energy (higher temperature) to separate.

In genomes, GC content is not uniform. Promoters and active gene regions often reside in high-GC regions called **CpG islands**. A **sliding window** analysis slides a fixed-size window across the sequence, calculating the GC content for each window to identify local genomic features.

## Objective
Implement `sliding_window_gc(seq: str, window_size: int) -> list` that returns a list of GC content percentages (from 0.0 to 100.0) for every window of size `window_size` in the sequence.
