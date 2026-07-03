import { useEffect, useState } from "preact/hooks";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  concept: string;
  goal: string;
  template: string;
  tests: string;
  paperTitle?: string;
  paperUrl?: string;
}

const TUTORIAL_STEPS: Step[] = [
  {
    id: 1,
    title: "DNA Reverse Complement",
    subtitle: "Understanding DNA Strands and Pairing",
    concept:
      `DNA is double-stranded. The two strands run in opposite directions ($5' \\rightarrow 3'$ and $3' \\rightarrow 5'$). 
In molecular biology, when we write down a DNA sequence, we always write it in the $5' \\rightarrow 3'$ direction.

For the two strands to bind, their bases must pair specifically:
*   **Adenine (A)** pairs with **Thymine (T)**
*   **Cytosine (C)** pairs with **Guanine (G)**

To find the opposite strand of a sequence like **"ATCG"**, we must:
1. Find its complement: **"TAGC"**
2. Reverse it: **"CGAT"** (so it reads $5' \\rightarrow 3'$)

This is a fundamental operation used in designing PCR primers (e.g., the reverse primer must target the complementary strand).`,
    goal:
      "Implement a function `reverse_complement(seq: str) -> str` that returns the reversed complementary DNA strand of a given sequence. Support uppercase A, T, C, G bases.",
    template: `def reverse_complement(seq: str) -> str:
    # Write your code here to return the reverse complement
    complement = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    return "".join(complement[base] for base in reversed(seq))

# Let's test it on a sample DNA sequence
dna_seq = "ATCGGCAT"
print(f"Original DNA: {dna_seq}")
print(f"Reverse Complement: {reverse_complement(dna_seq)}")
`,
    tests: `assert reverse_complement("ATCG") == "CGAT", "Failed on 'ATCG'"
assert reverse_complement("AAAA") == "TTTT", "Failed on 'AAAA'"
assert reverse_complement("GCATGC") == "GCATGC", "Failed on 'GCATGC'"
print("SUCCESS: All unit tests passed!")
`,
  },
  {
    id: 2,
    title: "Sliding-Window GC Content",
    subtitle: "Analyzing Local Sequence Chemistry",
    concept:
      `GC content represents the percentage of Guanine (G) and Cytosine (C) bases in a DNA molecule. 
Unlike AT pairs (linked by 2 hydrogen bonds), GC pairs are linked by **3 hydrogen bonds**. This means regions with high GC content require more energy (higher temperature) to separate.

In genomes, GC content is not uniform. Promoters and active gene regions often reside in high-GC regions called **CpG islands**.
A **sliding window** analysis slides a fixed-size window across the sequence, calculating the GC content for each window to identify local genomic features.`,
    goal:
      "Implement `sliding_window_gc(seq: str, window_size: int) -> list` that returns a list of GC content percentages (from 0.0 to 100.0) for every window of size `window_size` in the sequence.",
    template: `def sliding_window_gc(seq: str, window_size: int) -> list:
    # Write your code here
    # Return a list of GC percentages for each window
    results = []
    for i in range(len(seq) - window_size + 1):
        window = seq[i:i+window_size]
        gc_count = sum(1 for base in window if base in 'GC')
        results.append((gc_count / window_size) * 100)
    return results

# Let's test it
dna = "ATGCATGC"
win = 4
print(f"DNA: {dna}, Window Size: {win}")
print(f"GC Profile: {sliding_window_gc(dna, win)}")
`,
    tests: `res = sliding_window_gc("ATGCATGC", 4)
assert len(res) == 5, f"Expected 5 windows, got {len(res)}"
assert res[0] == 50.0, f"Expected 50.0 for 'ATGC', got {res[0]}"
assert res[2] == 50.0, f"Expected 50.0 for 'GCAT', got {res[2]}"
assert sliding_window_gc("GGGG", 2) == [100.0, 100.0, 100.0], "Failed on 'GGGG'"
print("SUCCESS: All unit tests passed!")
`,
  },
  {
    id: 3,
    title: "Global Sequence Alignment",
    subtitle: "The Needleman-Wunsch Algorithm",
    concept:
      `To compare two genes or proteins, we align them to find matching regions, insertions, and deletions. 
The **Needleman-Wunsch** algorithm uses dynamic programming to find the optimal global alignment. 

It constructs a scoring grid $DP[i][j]$ where:
*   $DP[i][j]$ is the score of aligning the prefixes $seq1[0..i]$ and $seq2[0..j]$.
*   Each cell is calculated as:
    $$DP[i][j] = \\max(DP[i-1][j-1] + \\text{score}, DP[i-1][j] + \\text{gap}, DP[i][j-1] + \\text{gap})$$

This algorithm is the foundation for search tools like BLAST and multiple sequence alignment.`,
    goal:
      "Implement `needleman_wunsch(seq1: str, seq2: str, match=1, mismatch=-1, gap=-1) -> int` that calculates and returns the optimal global alignment score between two sequences.",
    template:
      `def needleman_wunsch(seq1: str, seq2: str, match=1, mismatch=-1, gap=-1) -> int:
    n, m = len(seq1), len(seq2)
    # Initialize the DP grid
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i * gap
    for j in range(m + 1):
        dp[0][j] = j * gap
        
    # Fill the grid
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = match if seq1[i-1] == seq2[j-1] else mismatch
            dp[i][j] = max(
                dp[i-1][j-1] + s,  # Match/Mismatch
                dp[i-1][j] + gap,   # Gap in seq2
                dp[i][j-1] + gap    # Gap in seq1
            )
            
    # Return the optimal alignment score (bottom-right cell)
    return dp[n][m]

seq1 = "GATTACA"
seq2 = "GCATACU"
print(f"Aligning: {seq1} and {seq2}")
print(f"Alignment Score: {needleman_wunsch(seq1, seq2)}")
`,
    tests:
      `assert needleman_wunsch("GATTACA", "GCATACU") == 3, f"Expected 3, got {needleman_wunsch('GATTACA', 'GCATACU')}"
assert needleman_wunsch("A", "A") == 1, "Failed on matching single letter"
assert needleman_wunsch("A", "T") == -1, "Failed on mismatching single letter"
assert needleman_wunsch("A", "") == -1, "Failed on gap"
print("SUCCESS: All unit tests passed!")
`,
    paperTitle: "Needleman & Wunsch (1970) J. Mol. Biol.",
    paperUrl: "https://pubmed.ncbi.nlm.nih.gov/5420325/",
  },
];

export default function TutorialPlayground(
  { backendUrl }: { backendUrl: string },
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const [code, setCode] = useState(currentStep.template);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // Sync editor when step changes
  useEffect(() => {
    setCode(currentStep.template);
    setOutput("");
    setIsSuccess(null);
  }, [currentStepIndex]);

  const handleRun = async () => {
    setIsLoading(true);
    setIsSuccess(null);
    setOutput("Running script...\n");

    try {
      const response = await fetch(`${backendUrl}/primer/api/sandbox/run/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.success) {
        setOutput(data.stdout || "Execution completed with empty output.");
      } else {
        setOutput(
          `Exit Code: ${data.exit_code}\n\nError:\n${
            data.stderr || data.error
          }`,
        );
      }
    } catch (e) {
      setOutput(`Error connecting to sandbox server: ${(e as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setIsSuccess(null);
    setOutput("Running validation tests...\n");

    try {
      const response = await fetch(`${backendUrl}/primer/api/sandbox/test/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, tests: currentStep.tests }),
      });
      const data = await response.json();
      if (data.success && data.stdout.includes("SUCCESS")) {
        setOutput(data.stdout);
        setIsSuccess(true);
      } else {
        setOutput(
          `Test validation failed!\n\nDetails:\n${
            data.stderr || data.error || data.stdout
          }`,
        );
        setIsSuccess(false);
      }
    } catch (e) {
      setOutput(
        `Error connecting to validation server: ${(e as Error).message}`,
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCode(currentStep.template);
    setOutput("");
    setIsSuccess(null);
  };

  const lines = code.split("\n");

  return (
    <main class="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Left panel: Slide Content */}
      <section class="w-full md:w-5/12 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        {/* Step Selector Header */}
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 flex-none">
          <label class="block text-xs uppercase tracking-wider text-blue-200 font-semibold mb-1">
            Bioinformatics Step {currentStep.id} of {TUTORIAL_STEPS.length}
          </label>
          <select
            value={currentStepIndex}
            onChange={(e) =>
              setCurrentStepIndex(
                parseInt((e.target as HTMLSelectElement).value),
              )}
            class="bg-blue-800 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full cursor-pointer"
          >
            {TUTORIAL_STEPS.map((step, idx) => (
              <option key={step.id} value={idx}>
                {step.id}. {step.title}
              </option>
            ))}
          </select>
        </div>

        {/* Content Body */}
        <div class="p-6 flex-grow overflow-y-auto space-y-6">
          <div>
            <h2 class="text-2xl font-extrabold text-gray-800">
              {currentStep.title}
            </h2>
            <h3 class="text-sm font-medium text-indigo-600 mt-1">
              {currentStep.subtitle}
            </h3>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <h4 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
              Biological Concept
            </h4>
            <div class="text-gray-600 leading-relaxed text-sm whitespace-pre-line font-sans">
              {currentStep.concept}
            </div>
          </div>

          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
            <h4 class="text-sm font-bold text-indigo-900 mb-1">
              Your Objective
            </h4>
            <p class="text-indigo-800 text-sm">{currentStep.goal}</p>
          </div>

          {currentStep.paperTitle && (
            <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Seminal Publication
              </h4>
              <a
                href={currentStep.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 text-sm font-semibold underline flex items-center gap-1"
              >
                {currentStep.paperTitle}
                <span class="text-xs">↗</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Right panel: Editor & Terminal */}
      <section class="w-full md:w-7/12 flex flex-col h-[calc(100vh-220px)] min-h-[500px] gap-4">
        {/* Editor Container */}
        <div class="flex-grow bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div class="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-gray-800">
            <div class="flex items-center space-x-2">
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="text-xs text-gray-400 font-mono ml-4">main.py</span>
            </div>
            <button
              onClick={handleReset}
              class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-[#3a3a3a] transition-all hover:bg-red-900"
            >
              Reset Code
            </button>
          </div>

          {/* Editor Textarea with Line Numbers */}
          <div class="flex-grow flex font-mono text-sm overflow-hidden bg-[#1e1e1e]">
            {/* Line Numbers strip */}
            <div class="flex-none w-10 text-right pr-3 select-none text-gray-600 font-mono text-sm border-r border-gray-800 pt-3 bg-[#1a1a1a]">
              {lines.map((_, i) => (
                <div key={i} class="h-6 leading-6">{i + 1}</div>
              ))}
            </div>
            {/* Editor Area */}
            <textarea
              value={code}
              onInput={(e) => setCode((e.target as HTMLTextAreaElement).value)}
              class="flex-grow bg-transparent text-[#f8f8f2] p-3 focus:outline-none resize-none font-mono text-sm leading-6 selection:bg-indigo-900 caret-white outline-none overflow-y-auto"
              spellcheck={false}
            />
          </div>

          {/* Action Bar */}
          <div class="bg-[#2d2d2d] px-4 py-3 flex gap-3 justify-end border-t border-gray-800">
            <button
              onClick={handleRun}
              disabled={isLoading}
              class="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold py-2 px-4 rounded text-sm disabled:opacity-50"
            >
              {isLoading ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={handleVerify}
              disabled={isLoading}
              class="bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white font-semibold py-2 px-4 rounded text-sm disabled:opacity-50 flex items-center gap-1"
            >
              Verify Solution
            </button>
          </div>
        </div>

        {/* Terminal/Console Output */}
        <div class="h-44 bg-[#0d0d0d] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
          <div class="bg-[#181818] px-4 py-2 border-b border-gray-800 flex justify-between items-center">
            <span class="text-xs uppercase tracking-wider text-gray-400 font-bold font-mono">
              Console Output
            </span>
            {isSuccess === true && (
              <span class="text-xs font-bold bg-green-950 text-green-400 px-2 py-0.5 rounded border border-green-700 animate-bounce">
                ✔ Success
              </span>
            )}
            {isSuccess === false && (
              <span class="text-xs font-bold bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-700">
                ✘ Failed
              </span>
            )}
          </div>
          <div class="flex-grow p-4 overflow-y-auto font-mono text-xs text-[#d4d4d4] whitespace-pre-wrap select-all">
            <span class="text-green-500 mr-1">&gt;</span>
            {output || "Output will be displayed here..."}
          </div>
        </div>
      </section>
    </main>
  );
}
