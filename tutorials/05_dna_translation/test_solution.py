from solution import translate_dna

def test_translate_dna():
    assert translate_dna("ATGGCCATGGCGCCCAGAATGTGA") == "MAMAPRM", "Failed on standard translation"
    assert translate_dna("ATGTAA") == "M", "Failed on immediate stop codon"
    assert translate_dna("ATGGCCTAGCCCGGG") == "MA", "Failed to terminate translation at Stop codon"
