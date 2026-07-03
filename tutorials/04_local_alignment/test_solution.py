from solution import smith_waterman

def test_smith_waterman():
    assert smith_waterman("HELLOWORLD", "LLOWOR") == 12, "Failed on overlapping substrings"
    assert smith_waterman("A", "T") == 0, "Failed on negative mismatch score (should be 0)"
    assert smith_waterman("AWESOME", "AWESOME") == 14, "Failed on exact matches"
