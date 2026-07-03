# Interactive Bioinformatics Tutorial: Implementation Plan

This plan outlines the architecture and phased roadmap to transform the **Bio-Showcase** project into an interactive, web-based bioinformatics tutorial and code sandbox using **Django** and **Deno Fresh**.

---

## 1. Architecture Overview

Instead of static Jupyter notebooks, we will build a modern, interactive web platform consisting of three layers:

```
  ┌────────────────────────────────────────────────────────┐
  │                  Deno Fresh Frontend                   │
  │  (Interactive Slides, Code Editor, Preact Visualizers)  │
  └───────────────────────────┬────────────────────────────┘
                              │ API Requests
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                     Django Backend                     │
  │     (Tutorial Routing, Execution Sandbox, Grader)      │
  └───────────────────────────┬────────────────────────────┘
                              │ Executes
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 Custom 'bio_core' Lib                  │
  │       (User-implemented algorithms & unit tests)       │
  └────────────────────────────────────────────────────────┘
```

### A. Frontend: Deno Fresh Web GUI
*   **Slide Engine**: A custom component that renders step-by-step tutorial slides (parsed from markdown files) alongside code challenges.
*   **Code Playground**: An embedded code editor (using Monaco Editor or a styled textarea) where the user writes Python code.
*   **Visualizers**: Customized Preact islands to display results:
    *   **GC Profile Chart**: Interactive SVG/Canvas charts mapping sequence positions.
    *   **DP Grid Visualizer**: A dynamic matrix table showing scores, cell backtracks, and optimal alignments.

### B. Backend: Django Execution Sandbox & Grader
*   **Code Execution Engine**: An API endpoint (`/api/sandbox/run/`) that executes Python snippets sent by the frontend, capturing stdout, stderr, and variables.
*   **Sandbox Security**: Since this runs locally, we will implement a lightweight, resource-constrained subprocess runner (using Python's `subprocess` with memory limits, timeouts, and restricted built-ins).
*   **Auto-Grader**: An API endpoint (`/api/sandbox/test/`) that runs predefined unit tests against the user's code to verify correctness.

### C. Custom Library: `bio_core`
*   A localized Python package (`/bio_core/`) where you write your own biological algorithms.
*   We will provide scaffold templates with `TODO` markers and accompanying tests (e.g., `test_alignment.py`) that the Django grader executes.

---

## 2. Component Design & Sandbox Architecture

### The Execution Sandbox Model
To execute code submitted via the Web UI safely, we will build a process-isolated runner:

```python
# Conceptual Django Sandbox Runner (bio_primer/sandbox.py)
import subprocess
import sys

def execute_user_code(code_string: str, timeout_seconds=2.0) -> dict:
    # 1. Write user code to a temp file, wrapping it with resource limits
    # 2. Run in a separate process using the current virtualenv Python interpreter
    try:
        proc = subprocess.run(
            [sys.executable, "-c", code_string],
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
            # (Optional) Run as a restricted user or configure system limits on Linux
        )
        return {
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "exit_code": proc.returncode
        }
    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out (Limit: 2s)"}
```

---

## 3. Phased Implementation Roadmap

### Phase 1: Core Framework & Sandbox Setup
*   **Backend**: 
    *   Create sandbox runner utilities in Django.
    *   Implement `/api/sandbox/run/` and `/api/sandbox/test/` endpoints.
*   **Frontend**:
    *   Add a `/tutorial` route.
    *   Build a responsive split-screen layout: **Slides & Documentation** on the left, **Code Playground & Terminal/Visualizer** on the right.

### Phase 2: Sequence Operations Tutorial (Stage 1)
*   **Custom Library**: Create `bio_core/sequence.py` scaffold:
    ```python
    def reverse_complement(seq: str) -> str:
        # TODO: Implement reverse complement
        pass
    ```
*   **Tutorial Content**: Write slides explaining DNA directionality ($5' \rightarrow 3'$), transcription, and translation codon mapping.
*   **UI integration**: Add an interactive GC-content chart using an SVG path that re-draws dynamically as the user modifies the sequence in the editor.

### Phase 3: Alignment & Dynamic Programming (Stage 2)
*   **Custom Library**: Create `bio_core/alignment.py` scaffold for Needleman-Wunsch and Smith-Waterman.
*   **Tutorial Content**: Write slides explaining score grids, traceback vectors, and substitution matrices (BLOSUM62).
*   **Dynamic Matrix Visualizer**: Build a Preact table component showing the dynamic programming matrix. Cells should highlight when hovered, displaying their traceback origin (Diagonal, Up, or Left).
*   **Reference Links**: Integrate links to the original papers:
    *   *Needleman & Wunsch (1970)* J. Mol. Biol.
    *   *Smith & Waterman (1981)* J. Mol. Biol.

### Phase 4: Primer Design & Thermodynamics (Stage 3)
*   **Custom Library**: Create `bio_core/thermo.py` to calculate melting temperature $T_m$ using the basic formula and the nearest-neighbor thermodynamic parameters.
*   **Tutorial Content**: Explain why secondary structures (hairpins, self-dimers) ruin PCR amplification.
*   **Visualizer**: Design a structural loop renderer showing where the primer sequence binds to itself.

---

## 4. References & Linking to Real Tools

Each tutorial page will feature a dedicated "Industry Standards" section pointing to:
1.  **Production Implementations**: Compare user-built `bio_core` code with high-performance C-based tools like [Biopython](https://biopython.org/) and [Primer3](https://github.com/libprimer3/primer3).
2.  **Benchmark Papers**: Include citations and URLs to the seminal papers defining each algorithm.
3.  **Databases**: Direct API integration challenges query-loading sequences directly from NCBI Entrez database into the sandbox.
