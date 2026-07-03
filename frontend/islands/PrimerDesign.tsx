import { useEffect, useState } from "preact/hooks";

interface Primer {
  PENALTY: number;
  SEQUENCE: string;
  GC_PERCENT: number;
}

interface PrimerResult {
  PRIMER_LEFT: Primer[];
  PRIMER_RIGHT: Primer[];
  PRIMER_INTERNAL: Primer[];
}

interface FormResult {
  data?: PrimerResult;
  error?: string;
}

export default function MyFormPage({ backendUrl }: { backendUrl: string }) {
  const [formParams, setFormParams] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<FormResult>({});
  const [loading, setLoading] = useState(false);

  const [sequence, setSequence] = useState<string>("");
  const [seqStart, setSeqStart] = useState<number | string>(""); 
  const [seqEnd, setSeqEnd] = useState<number | string>(""); 

  useEffect(() => {
    const doFetch = async () => {
      if (Object.keys(formParams).length === 0) return;
      setLoading(true);
      setResult({});
      
      const queryString = new URLSearchParams(formParams).toString();
      const targetUrl = `${backendUrl}/primer/api/design/?${queryString}`;

      try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setResult({ data: jsonData });
      } catch (error: any) {
        setResult({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    doFetch();
  }, [formParams]);

  const handleSubmit = (event: Event) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const params: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });
    setFormParams(params);
  };

  const FillDemoData = () => {
    setSequence(
      "GCTTGCATGCCTGCAGGTCGACTCTAGAGGATCCCCCTACATTTTAGCATCAGTGAGTACAGCATGCTTACTGGAAGAGAGGGTCATGCAACAGATTAGGAGGTAAGTTTGCAAAGGCAGGCTAAGGAGGAGACGCACTGAATGCCATGGTAAGAACTCTGGACATAAAAATATTGGAAGTTGTTGAGCAAGTNAAAAAAATGTTTGGAAGTGTTACTTTAGCAATGGCAAGAATGATAGTATGGAATAGATTGGCAGAATGAAGGCAAAATGATTAGACATATTGCATTAAGGTAAAAAATGATAACTGAAGAATTATGTGCCACACTTATTAATAAGAAAGAATATGTGAACCTTGCAGATGTTTCCCTCTAGTAG",
    );
    setSeqStart(36);
    setSeqEnd(342);
  };

  const ClearForm = () => {
    setSequence("");
    setSeqStart("");
    setSeqEnd("");
    setFormParams({});
    setResult({});
  };

  const getUniquePrimers = (primers: Primer[]) => {
    const seenSequences = new Set<string>();
    return primers.filter((primer) => {
      if (seenSequences.has(primer.SEQUENCE)) {
        return false;
      }
      seenSequences.add(primer.SEQUENCE);
      return true;
    });
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">PCR Primer Design Workbench</h1>
        <p class="text-sm text-gray-500 mt-1">
          Optimize PCR primers by specifying target sequence windows. Designs forward, reverse, and internal hybridizing primers.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Parameters */}
        <div class="lg:col-span-5">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} class="space-y-6">
              <div>
                <label htmlFor="sequence" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DNA Template Sequence</label>
                <textarea
                  id="sequence"
                  name="sequence"
                  rows={8}
                  placeholder="Enter FASTA or raw sequence nucleotides (A, T, C, G)..."
                  class="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-60"
                  value={sequence}
                  onInput={(e) => setSequence((e.target as HTMLTextAreaElement).value)}
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="seq_start" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Target Range Start</label>
                  <input
                    type="number"
                    id="seq_start"
                    name="seq_start"
                    placeholder="e.g. 36"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={seqStart}
                    onInput={(e) => setSeqStart((e.target as HTMLInputElement).value)}
                  />
                </div>

                <div>
                  <label htmlFor="seq_end" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Target Range End</label>
                  <input
                    type="number"
                    id="seq_end"
                    name="seq_end"
                    placeholder="e.g. 342"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={seqEnd}
                    onInput={(e) => setSeqEnd((e.target as HTMLInputElement).value)}
                  />
                </div>
              </div>

              <div class="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={FillDemoData}
                  class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-semibold rounded text-sm cursor-pointer"
                >
                  Fill Demo
                </button>
                <button
                  type="button"
                  onClick={ClearForm}
                  class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-semibold rounded text-sm cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading || !sequence}
                  class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold rounded text-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Designing..." : "Design Primers"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Design Results */}
        <div class="lg:col-span-7 space-y-6">
          {loading && (
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center space-y-4">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
              <span class="text-gray-500 font-medium text-sm">Querying Primer3 engine...</span>
            </div>
          )}

          {!result.data && !result.error && !loading && (
            <div class="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3 class="text-sm font-bold text-gray-700">No Primers Designed</h3>
              <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Fill the demo template sequence or input your own, configure the boundaries, and hit Submit to run optimization.
              </p>
            </div>
          )}

          {result.error && (
            <div class="bg-red-50 text-red-700 border border-red-200 rounded-xl p-6 text-sm font-semibold">
              Error designing primers: {result.error}
            </div>
          )}

          {result.data && !loading && (
            <div class="space-y-8">
              {/* Left Primers (Forward) */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 border-b border-gray-200 px-5 py-3">
                  <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Left Primers (Forward)</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left border-none mb-0">
                    <thead class="bg-gray-100/50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                      <tr>
                        <th class="px-5 py-3 border-none font-semibold">Sequence (5' → 3')</th>
                        <th class="px-5 py-3 border-none font-semibold text-center w-28">GC Content</th>
                        <th class="px-5 py-3 border-none font-semibold text-center w-28">Penalty</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      {getUniquePrimers(result.data.PRIMER_LEFT).map((primer, index) => (
                        <tr key={index} class="hover:bg-gray-50">
                          <td class="px-5 py-3 font-mono text-xs border-none font-semibold text-gray-800 tracking-wider select-all">{primer.SEQUENCE}</td>
                          <td class="px-5 py-3 border-none text-center">
                            <span class="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                              {primer.GC_PERCENT.toFixed(1)}%
                            </span>
                          </td>
                          <td class="px-5 py-3 font-mono text-xs border-none text-center text-gray-500">{primer.PENALTY.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Primers (Reverse) */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 border-b border-gray-200 px-5 py-3">
                  <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Right Primers (Reverse)</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left border-none mb-0">
                    <thead class="bg-gray-100/50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                      <tr>
                        <th class="px-5 py-3 border-none font-semibold">Sequence (5' → 3')</th>
                        <th class="px-5 py-3 border-none font-semibold text-center w-28">GC Content</th>
                        <th class="px-5 py-3 border-none font-semibold text-center w-28">Penalty</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      {getUniquePrimers(result.data.PRIMER_RIGHT).map((primer, index) => (
                        <tr key={index} class="hover:bg-gray-50">
                          <td class="px-5 py-3 font-mono text-xs border-none font-semibold text-gray-800 tracking-wider select-all">{primer.SEQUENCE}</td>
                          <td class="px-5 py-3 border-none text-center">
                            <span class="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                              {primer.GC_PERCENT.toFixed(1)}%
                            </span>
                          </td>
                          <td class="px-5 py-3 font-mono text-xs border-none text-center text-gray-500">{primer.PENALTY.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Internal Oligos (Hybridization Probe) */}
              {result.data.PRIMER_INTERNAL && result.data.PRIMER_INTERNAL.length > 0 && (
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div class="bg-gray-50 border-b border-gray-200 px-5 py-3">
                    <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Internal Hybridization Probes</h3>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border-none mb-0">
                      <thead class="bg-gray-100/50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                        <tr>
                          <th class="px-5 py-3 border-none font-semibold">Sequence (5' → 3')</th>
                          <th class="px-5 py-3 border-none font-semibold text-center w-28">GC Content</th>
                          <th class="px-5 py-3 border-none font-semibold text-center w-28">Penalty</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        {getUniquePrimers(result.data.PRIMER_INTERNAL).map((primer, index) => (
                          <tr key={index} class="hover:bg-gray-50">
                            <td class="px-5 py-3 font-mono text-xs border-none font-semibold text-gray-800 tracking-wider select-all">{primer.SEQUENCE}</td>
                            <td class="px-5 py-3 border-none text-center">
                              <span class="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                                {primer.GC_PERCENT.toFixed(1)}%
                              </span>
                            </td>
                            <td class="px-5 py-3 font-mono text-xs border-none text-center text-gray-500">{primer.PENALTY.toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
