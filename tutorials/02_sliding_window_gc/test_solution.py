from solution import sliding_window_gc

def test_sliding_window_gc():
    res = sliding_window_gc("ATGCATGC", 4)
    assert len(res) == 5, f"Expected 5 windows, got {len(res)}"
    assert res[0] == 50.0, f"Expected 50.0 for 'ATGC', got {res[0]}"
    assert res[2] == 50.0, f"Expected 50.0 for 'GCAT', got {res[2]}"
    assert sliding_window_gc("GGGG", 2) == [100.0, 100.0, 100.0], "Failed on 'GGGG'"
