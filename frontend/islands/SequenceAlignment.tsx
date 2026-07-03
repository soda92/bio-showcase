import { useState, useEffect } from "preact/hooks";

interface AlignmentResponse {
  success: boolean;
  matrix: number[][];
  path: [number, number][];
  aligned1: string;
  aligned2: string;
  score: number;
  error?: string;
}

export default function SequenceAlignment({ backendUrl }: { backendUrl: string }) {
  const [seq1, setSeq1] = useState("GATTACA");
  const [seq2, setSeq2] = useState("GCATACU");
  const [match, setMatch] = useState(2);
  const [mismatch, setMismatch] = useState(-1);
  const [gap, setGap] = useState(-1);
  const [alignType, setAlignType] = useState<"global" | "local">("global");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AlignmentResponse | null>(null);
  const [error, setError] = useState("");
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number; score: number } | null>(null);

  // Solve initial alignment on mount
  useEffect(() => {
    handleSolve();
  }, []);

  const handleSolve = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backendUrl}/primer/api/alignment/solve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seq1,
          seq2,
          match,
          mismatch,
          gap,
          type: alignType
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to solve alignment.");
      }
    } catch (e) {
      setError(`Connection failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if a cell (i, j) is on the traceback path
  const isCellInPath = (i: number, j: number) => {
    if (!result) return false;
    return result.path.some(([pi, pj]) => pi === i && pj === j);
  };

  // Helper to get the traceback direction arrow for a cell
  const getCellArrow = (i: number, j: number) => {
    if (!result) return "";
    const index = result.path.findIndex(([pi, pj]) => pi === i && pj === j);
    if (index === -1 || index === result.path.length - 1) return "";
    const [nextI, nextJ] = result.path[index + 1];
    if (nextI === i - 1 && nextJ === j - 1) return "↖";
    if (nextI === i - 1 && nextJ === j) return "↑";
    if (nextI === i && nextJ === j - 1) return "←";
    return "";
  };

  // Generate alignment match symbols
  const getSymbols = () => {
    if (!result) return [];
    const chars1 = result.aligned1.split("");
    const chars2 = result.aligned2.split("");
    return chars1.map((c1, idx) => {
      const c2 = chars2[idx];
      if (c1 === "-" || c2 === "-") return " ";
      return c1 === c2 ? "|" : "•";
    });
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Sequence Alignment Visualizer</h1>
        <p class="text-sm text-gray-500 mt-1">
          Explore global (Needleman-Wunsch) and local (Smith-Waterman) dynamic programming alignment algorithms in real-time.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Parameters */}
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Parameters</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sequence 1 (Rows)</label>
                <input
                  type="text"
                  value={seq1}
                  onInput={(e) => setSeq1((e.target as HTMLInputElement).value.toUpperCase())}
                  class="w-full border border-gray-300 rounded px-3 py-2 font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. GATTACA"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sequence 2 (Cols)</label>
                <input
                  type="text"
                  value={seq2}
                  onInput={(e) => setSeq2((e.target as HTMLInputElement).value.toUpperCase())}
                  class="w-full border border-gray-300 rounded px-3 py-2 font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. GCATACU"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alignment Mode</label>
                  <select
                    value={alignType}
                    onChange={(e) => setAlignType((e.target as HTMLSelectElement).value as "global" | "local")}
                    class="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-sm"
                  >
                    <option value="global">Global (NW)</option>
                    <option value="local">Local (SW)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Match Score</label>
                  <input
                    type="number"
                    value={match}
                    onInput={(e) => setMatch(parseInt((e.target as HTMLInputElement).value) || 0)}
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mismatch Penalty</label>
                  <input
                    type="number"
                    value={mismatch}
                    onInput={(e) => setMismatch(parseInt((e.target as HTMLInputElement).value) || 0)}
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gap Penalty</label>
                  <input
                    type="number"
                    value={gap}
                    onInput={(e) => setGap(parseInt((e.target as HTMLInputElement).value) || 0)}
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleSolve}
                disabled={loading}
                class="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold py-2.5 rounded text-sm disabled:opacity-50 mt-2"
              >
                {loading ? "Aligning..." : "Solve Alignment"}
              </button>
            </div>
          </div>

          {/* cell info panel */}
          {hoveredCell && result && (
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 class="text-sm font-bold text-gray-800 mb-2.5 border-b border-gray-100 pb-1.5 flex justify-between">
                <span>Cell Analysis</span>
                <span class="font-mono text-indigo-600">({hoveredCell.i}, {hoveredCell.j})</span>
              </h3>
              <div class="space-y-2 text-xs text-gray-600">
                <div class="flex justify-between">
                  <span>Row Base (Seq 1):</span>
                  <span class="font-bold text-gray-800">{hoveredCell.i > 0 ? seq1[hoveredCell.i - 1] : "-"}</span>
                </div>
                <div class="flex justify-between">
                  <span>Col Base (Seq 2):</span>
                  <span class="font-bold text-gray-800">{hoveredCell.j > 0 ? seq2[hoveredCell.j - 1] : "-"}</span>
                </div>
                <div class="flex justify-between border-t border-gray-50 pt-2">
                  <span>Score Value:</span>
                  <span class="font-mono font-bold text-indigo-700">{hoveredCell.score}</span>
                </div>
                {hoveredCell.i > 0 && hoveredCell.j > 0 && (
                  <div class="border-t border-gray-50 pt-2 space-y-1">
                    <p class="font-semibold text-gray-500 mb-1">Recurrence choices:</p>
                    <div class="flex justify-between text-[11px]">
                      <span>Diagonal (Match/Mismatch):</span>
                      <span class="font-mono">{result.matrix[hoveredCell.i-1][hoveredCell.j-1]} + {seq1[hoveredCell.i-1] === seq2[hoveredCell.j-1] ? match : mismatch} = {result.matrix[hoveredCell.i-1][hoveredCell.j-1] + (seq1[hoveredCell.i-1] === seq2[hoveredCell.j-1] ? match : mismatch)}</span>
                    </div>
                    <div class="flex justify-between text-[11px]">
                      <span>Up (Gap in Seq 2):</span>
                      <span class="font-mono">{result.matrix[hoveredCell.i-1][hoveredCell.j]} + {gap} = {result.matrix[hoveredCell.i-1][hoveredCell.j] + gap}</span>
                    </div>
                    <div class="flex justify-between text-[11px]">
                      <span>Left (Gap in Seq 1):</span>
                      <span class="font-mono">{result.matrix[hoveredCell.i][hoveredCell.j-1]} + {gap} = {result.matrix[hoveredCell.i][hoveredCell.j-1] + gap}</span>
                    </div>
                    {alignType === "local" && (
                      <div class="flex justify-between text-[11px] text-green-600 font-medium">
                        <span>Lower Bound:</span>
                        <span class="font-mono">0</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div class="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-xs font-semibold">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Grid and Alignment Results */}
        <div class="lg:col-span-8 space-y-8">
          {/* Alignment Results Display */}
          {result && (
            <div class="bg-[#1e1e1e] rounded-xl shadow-md p-6 border border-gray-800">
              <div class="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Optimal Alignment Results</h3>
                <span class="bg-indigo-900/50 border border-indigo-700 text-indigo-300 font-mono font-bold text-xs px-3 py-1 rounded">
                  Score: {result.score}
                </span>
              </div>
              <div class="bg-[#111] p-4 rounded border border-gray-900 overflow-x-auto text-sm font-mono text-gray-300 space-y-1 select-all">
                <div class="flex tracking-widest">
                  <span class="text-gray-600 w-16 select-none">Seq 1:</span>
                  <span>{result.aligned1.split("").join(" ")}</span>
                </div>
                <div class="flex tracking-widest text-indigo-400 select-none">
                  <span class="text-gray-600 w-16">Match:</span>
                  <span>{getSymbols().join(" ")}</span>
                </div>
                <div class="flex tracking-widest">
                  <span class="text-gray-600 w-16 select-none">Seq 2:</span>
                  <span>{result.aligned2.split("").join(" ")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Programming Grid Visualizer */}
          {result && (
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden flex flex-col">
              <div class="mb-4 flex justify-between items-center">
                <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Dynamic Programming Grid</h3>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1.5">
                    <span class="h-3 w-3 bg-indigo-600 rounded"></span> Traceback Path
                  </span>
                  <span class="flex items-center gap-1.5">
                    <span class="h-3 w-3 border border-indigo-300 bg-indigo-50 rounded"></span> Traceback Origin
                  </span>
                </div>
              </div>

              {/* Matrix Table */}
              <div class="overflow-auto max-h-[500px] border border-gray-100 rounded">
                <table class="w-full border-collapse text-center">
                  <thead>
                    <tr class="bg-gray-50 border-b border-gray-200">
                      {/* Empty top-left cell */}
                      <th class="w-12 h-12 min-w-[3rem] sticky left-0 top-0 bg-gray-100 z-30 border-r border-gray-200 font-mono text-xs text-gray-400">i \ j</th>
                      {/* Boundary cell */}
                      <th class="w-12 h-12 min-w-[3rem] sticky top-0 bg-gray-50 z-20 border-r border-gray-100 font-mono text-xs text-gray-500">-</th>
                      {/* Sequence 2 column bases */}
                      {seq2.split("").map((base, idx) => (
                        <th key={idx} class="w-12 h-12 min-w-[3rem] sticky top-0 bg-gray-50 z-20 border-r border-gray-100 font-mono font-bold text-sm text-indigo-700">
                          {base}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 0 boundary */}
                    <tr class="border-b border-gray-100">
                      <td class="w-12 h-12 min-w-[3rem] bg-gray-50 sticky left-0 z-20 border-r border-gray-200 font-mono text-xs text-gray-500">-</td>
                      {result.matrix[0].map((score, j) => {
                        const inPath = isCellInPath(0, j);
                        const arrow = getCellArrow(0, j);
                        return (
                          <td
                            key={j}
                            onMouseEnter={() => setHoveredCell({ i: 0, j, score })}
                            onMouseLeave={() => setHoveredCell(null)}
                            class={`w-12 h-12 min-w-[3rem] border-r border-gray-100 font-mono text-xs transition-colors cursor-help ${
                              inPath
                                ? "bg-indigo-600 text-white font-bold"
                                : "hover:bg-gray-100 text-gray-400"
                            }`}
                          >
                            <div class="flex flex-col items-center justify-center h-full">
                              <span class="text-[9px] text-opacity-80 leading-none">{arrow}</span>
                              <span class="leading-none">{score}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Sequence 1 rows */}
                    {seq1.split("").map((base, i) => (
                      <tr key={i} class="border-b border-gray-100">
                        {/* Row header base */}
                        <td class="w-12 h-12 min-w-[3rem] bg-gray-50 sticky left-0 z-20 border-r border-gray-200 font-mono font-bold text-sm text-indigo-700">{base}</td>
                        {/* Matrix cells */}
                        {result.matrix[i + 1].map((score, j) => {
                          const inPath = isCellInPath(i + 1, j);
                          const arrow = getCellArrow(i + 1, j);
                          return (
                            <td
                              key={j}
                              onMouseEnter={() => setHoveredCell({ i: i + 1, j, score })}
                              onMouseLeave={() => setHoveredCell(null)}
                              class={`w-12 h-12 min-w-[3rem] border-r border-gray-100 font-mono text-sm transition-colors cursor-help ${
                                inPath
                                  ? "bg-indigo-600 text-white font-bold"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div class="flex flex-col items-center justify-center h-full">
                                <span class="text-[9px] text-opacity-80 leading-none">{arrow}</span>
                                <span class="leading-none">{score}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
