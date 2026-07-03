from solution import fastq_trim

def test_fastq_trim():
    # 'I' = 73 - 33 = 40 (Good quality)
    # '#' = 35 - 33 = 2 (Bad quality)
    assert fastq_trim("ATGCATGC", "IIII###I", 20) == "ATGC", "Failed on standard trimming"
    assert fastq_trim("AAAA", "IIII", 20) == "AAAA", "Failed when all bases are good"
    assert fastq_trim("GGGG", "####", 20) == "", "Failed when all bases are bad"
