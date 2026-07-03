from solution import needleman_wunsch

def test_needleman_wunsch():
    assert needleman_wunsch("GATTACA", "GCATACU") == 3, f"Expected 3, got {needleman_wunsch('GATTACA', 'GCATACU')}"
    assert needleman_wunsch("A", "A") == 1, "Failed on matching single letter"
    assert needleman_wunsch("A", "T") == -1, "Failed on mismatching single letter"
    assert needleman_wunsch("A", "") == -1, "Failed on gap"
