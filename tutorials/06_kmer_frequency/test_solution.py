from solution import count_kmers

def test_count_kmers():
    res = count_kmers("ATGCATGC", 3)
    assert res.get("ATG") == 2, "Failed to count repeat 'ATG'"
    assert res.get("TGC") == 2, "Failed to count repeat 'TGC'"
    assert res.get("GCA") == 1, "Failed to count single 'GCA'"
    assert len(res) == 4, "Incorrect number of unique K-mers"
