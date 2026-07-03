from solution import reverse_complement

def test_reverse_complement():
    assert reverse_complement("ATCG") == "CGAT", "Failed on 'ATCG'"
    assert reverse_complement("AAAA") == "TTTT", "Failed on 'AAAA'"
    assert reverse_complement("GCATGC") == "GCATGC", "Failed on 'GCATGC'"
