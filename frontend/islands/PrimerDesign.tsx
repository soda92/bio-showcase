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
  // Define the structure of your results from the other server
  data?: PrimerResult;
  error?: string;
}

export default function MyFormPage({ backendUrl }: { backendUrl: string }) {
  const [formParams, setFormParams] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<FormResult>({});

  const [sequence, setSequence] = useState<string>("");
  const [seqStart, setSeqStart] = useState<number | string>(""); // Use string for empty
  const [seqEnd, setSeqEnd] = useState<number | string>(""); // Use string for empty

  useEffect(() => {
    const doFetch = async () => {
      if (Object.keys(formParams).length === 0) return; // Don't fetch if no params

      const queryString = new URLSearchParams(formParams).toString();
      const targetUrl = `${backendUrl}/primer/api/design/?${queryString}`; // Adjust the URL

      try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setResult({ data: jsonData });
        // deno-lint-ignore no-explicit-any
      } catch (error: any) {
        setResult({ error: error.message });
      }
    };

    doFetch();
  }, [formParams]);

  const handleSubmit = (event: Event) => {
    event.preventDefault(); // Prevent default form submission

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
    setFormParams({}); // Clear existing parameters to reset results as well
    setResult({}); // Clear results too
  };

  // Helper function to deduplicate primers
  const getUniquePrimers = (primers: Primer[]) => {
    const seenSequences = new Set<string>();
    return primers.filter((primer) => {
      if (seenSequences.has(primer.SEQUENCE)) {
        return false; // Duplicate
      }
      seenSequences.add(primer.SEQUENCE);
      return true; // Unique
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sequence">DNA Sequence:</label>
          <textarea
            id="sequence"
            name="sequence"
            rows={10}
            cols={50}
            placeholder="Enter your DNA sequence here..."
            className="full-width-textarea"
            value={sequence} // Bind value to state
            onInput={(e) =>
              setSequence((e.target as HTMLTextAreaElement).value)} // Update state on input
          >
          </textarea>
        </div>

        <div className="form-group">
          <label htmlFor="seq_start">Sequence Start:</label>
          <input
            type="number"
            id="seq_start"
            name="seq_start"
            placeholder="0"
            className="small-input"
            value={seqStart} // Bind value to state
            onInput={(e) => setSeqStart((e.target as HTMLInputElement).value)} // Update state on input
          />
        </div>

        <div className="form-group">
          <label htmlFor="seq_end">Sequence End:</label>
          <input
            type="number"
            id="seq_end"
            name="seq_end"
            placeholder="0"
            className="small-input"
            value={seqEnd} // Bind value to state
            onInput={(e) => setSeqEnd((e.target as HTMLInputElement).value)} // Update state on input
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={FillDemoData}
            className="button secondary"
          >
            Fill Demo Data
          </button>
          <button
            type="button"
            onClick={ClearForm}
            className="button secondary"
          >
            Clear
          </button>
          <button type="submit" className="button primary">Submit</button>
        </div>
      </form>
      {result.data && (
        <div>
          <h2>Left Primers</h2>
          <table>
            <thead>
              <tr>
                <th>Sequence</th>
                <th>GC Percent</th>
              </tr>
            </thead>
            <tbody>
              {getUniquePrimers(result.data.PRIMER_LEFT).map((
                primer,
                index,
              ) => (
                <tr key={index}>
                  <td>{primer.SEQUENCE}</td>
                  <td>{primer.GC_PERCENT.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Right Primers</h2>
          <table>
            <thead>
              <tr>
                <th>Sequence</th>
                <th>GC Percent</th>
              </tr>
            </thead>
            <tbody>
              {getUniquePrimers(result.data.PRIMER_RIGHT).map((
                primer,
                index,
              ) => (
                <tr key={index}>
                  <td>{primer.SEQUENCE}</td>
                  <td>{primer.GC_PERCENT.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Internal Primers</h2>
          <table>
            <thead>
              <tr>
                <th>Sequence</th>
                <th>GC Percent</th>
              </tr>
            </thead>
            <tbody>
              {getUniquePrimers(result.data.PRIMER_INTERNAL).map((
                primer,
                index,
              ) => (
                <tr key={index}>
                  <td>{primer.SEQUENCE}</td>
                  <td>{primer.GC_PERCENT.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.error && <p className="error">Error: {result.error}</p>}
    </div>
  );
}
