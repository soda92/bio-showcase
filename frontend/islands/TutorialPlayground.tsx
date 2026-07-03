import { useEffect, useState, useRef } from "preact/hooks";
import { marked } from "marked";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

interface Step {
  id: number;
  folder_name: string;
  title: string;
  subtitle: string;
  concept: string;
  goal: string;
  template: string;
  solution: string;
  tests: string;
  paperTitle?: string;
  paperUrl?: string;
}

function renderMarkdown(md: string) {
  try {
    let content = md;
    
    // Custom Latex/Math math rendering replacements
    content = content.replace(/\$\$DP\[i\]\[j\] = \\max\(.*?\)\$\$/g, () => {
      return `<div class="bg-gray-50 border border-gray-100 p-2.5 rounded font-mono text-xs my-2 text-center text-indigo-900 overflow-x-auto">
        DP[i][j] = max(DP[i-1][j-1] + score, DP[i-1][j] + gap, DP[i][j-1] + gap)
      </div>`;
    });
    content = content.replace(/\$5' \\rightarrow 3'\$/g, "5' → 3'");
    content = content.replace(/\$3' \\rightarrow 5'\$/g, "3' → 5'");
    content = content.replace(/\$DP\[i\]\[j\]\$/g, "<code class='bg-gray-100 text-gray-800 px-1 rounded font-mono text-xs'>DP[i][j]</code>");
    content = content.replace(/\$seq1\[0\.\.i\]\$/g, "<code class='bg-gray-100 text-gray-800 px-1 rounded font-mono text-xs'>seq1[0..i]</code>");
    content = content.replace(/\$seq2\[0\.\.j\]\$/g, "<code class='bg-gray-100 text-gray-800 px-1 rounded font-mono text-xs'>seq2[0..j]</code>");

    // Pass the parsed markdown to marked
    return marked.parse(content) as string;
  } catch (e) {
    console.error("Markdown parsing failed:", e);
    return md;
  }
}

export default function TutorialPlayground(
  { backendUrl }: { backendUrl: string },
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chapters, setChapters] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [fontSize, setFontSize] = useState(14); // Default to 14px

  // Splitter and sidebar states
  const [leftWidth, setLeftWidth] = useState(35); // Default to 35%
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mode, setMode] = useState<"learn" | "practice">("learn");

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Load settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("bio-tutorial-left-width");
      if (savedWidth) {
        const val = parseFloat(savedWidth);
        if (val >= 20 && val <= 70) {
          setLeftWidth(val);
        }
      }
      const savedCollapsed = localStorage.getItem("bio-tutorial-is-collapsed");
      if (savedCollapsed) {
        setIsCollapsed(savedCollapsed === "true");
      }
      const savedMode = localStorage.getItem("bio-tutorial-mode");
      if (savedMode === "learn" || savedMode === "practice") {
        setMode(savedMode);
      }
    }
  }, []);

  // Fetch chapters from the Django backend
  useEffect(() => {
    async function fetchChapters() {
      try {
        const response = await fetch(`${backendUrl}/primer/api/tutorial/chapters/`);
        if (response.ok) {
          const data = await response.json();
          setChapters(data);
        }
      } catch (e) {
        console.error("Failed to load chapters:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [backendUrl]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("bio-tutorial-is-collapsed", String(next));
      return next;
    });
  };

  const handleModeChange = (newMode: "learn" | "practice") => {
    setMode(newMode);
    localStorage.setItem("bio-tutorial-mode", newMode);
  };

  const startResizing = (mouseDownEvent: any) => {
    mouseDownEvent.preventDefault();
    
    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth;
      const newWidthPercent = (mouseMoveEvent.clientX / containerWidth) * 100;
      if (newWidthPercent >= 20 && newWidthPercent <= 70) {
        setLeftWidth(newWidthPercent);
        localStorage.setItem("bio-tutorial-left-width", String(newWidthPercent));
      }
    };
    
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Load font size from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bio-tutorial-font-size");
      if (saved) {
        const val = parseInt(saved, 10);
        if (val >= 10 && val <= 24) {
          setFontSize(val);
        }
      }
    }
  }, []);

  const increaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.min(24, prev + 1);
      localStorage.setItem("bio-tutorial-font-size", String(next));
      return next;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.max(10, prev - 1);
      localStorage.setItem("bio-tutorial-font-size", String(next));
      return next;
    });
  };

  // Synchronize and (re)initialize CodeMirror based on step, mode, or chapters load
  useEffect(() => {
    if (chapters.length === 0 || !editorRef.current) return;

    const currentStep = chapters[currentStepIndex];

    // Destroy existing view
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    const isReadOnly = mode === "learn";
    let targetCode = "";

    if (isReadOnly) {
      targetCode = currentStep.solution;
    } else {
      // Load user's saved practice code from localStorage if available
      const savedCode = localStorage.getItem(`bio-tutorial-practice-code-${currentStep.id}`);
      targetCode = savedCode !== null ? savedCode : currentStep.template;
    }

    // Update local react code state
    setCode(targetCode);
    setOutput("");
    setIsSuccess(null);

    const view = new EditorView({
      state: EditorState.create({
        doc: targetCode,
        extensions: [
          basicSetup,
          python(),
          oneDark,
          EditorState.readOnly.of(isReadOnly),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !isReadOnly) {
              const newValue = update.state.doc.toString();
              setCode(newValue);
              localStorage.setItem(`bio-tutorial-practice-code-${currentStep.id}`, newValue);
            }
          }),
          EditorView.theme({
            "&": { height: "100%" },
            ".cm-scroller": { overflow: "auto" }
          })
        ]
      }),
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [currentStepIndex, mode, chapters]);

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
    if (chapters.length === 0) return;
    const currentStep = chapters[currentStepIndex];
    setIsLoading(true);
    setIsSuccess(null);
    setOutput("Running validation tests via pytest...\n");

    try {
      const response = await fetch(`${backendUrl}/primer/api/sandbox/test/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code, 
          chapter_folder: currentStep.folder_name 
        }),
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
    if (mode === "learn" || chapters.length === 0) return; // Reset does nothing in Learn mode
    const currentStep = chapters[currentStepIndex];

    const targetCode = currentStep.template;
    setCode(targetCode);
    setOutput("");
    setIsSuccess(null);
    localStorage.removeItem(`bio-tutorial-practice-code-${currentStep.id}`);

    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      viewRef.current.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: targetCode }
      });
    }
  };

  if (loading) {
    return (
      <div class="flex-grow w-full flex items-center justify-center bg-gray-50 h-[calc(100vh-56px)]">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <span class="text-gray-500 font-medium text-sm">Loading Bioinformatics Tutorial...</span>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div class="flex-grow w-full flex items-center justify-center bg-gray-50 h-[calc(100vh-56px)]">
        <span class="text-red-500 font-medium text-sm">Error: No tutorial chapters found. Please check backend.</span>
      </div>
    );
  }

  const currentStep = chapters[currentStepIndex];

  return (
    <main class="flex-grow w-full flex flex-row h-[calc(100vh-56px)] overflow-hidden bg-gray-50 relative">
      {/* Left panel: Slide Content */}
      <section
        style={{ width: isCollapsed ? "0px" : `${leftWidth}%`, display: isCollapsed ? "none" : "flex" }}
        class="h-full bg-white border-r border-gray-200 flex-col flex-none overflow-hidden"
      >
        {/* Step Selector Header */}
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 flex-none flex items-center justify-between">
          <div class="flex-grow mr-2">
            <label class="block text-[10px] uppercase tracking-wider text-blue-200 font-semibold mb-0.5">
              Bioinformatics Step {currentStep.id} of {chapters.length}
            </label>
            <select
              value={currentStepIndex}
              onChange={(e) =>
                setCurrentStepIndex(
                  parseInt((e.target as HTMLSelectElement).value),
                )}
              class="bg-indigo-900 text-white font-bold text-xs py-1 px-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full cursor-pointer"
            >
              {chapters.map((step, idx) => (
                <option key={step.id} value={idx}>
                  {step.id}. {step.title}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={toggleCollapse}
            title="Collapse Sidebar"
            class="text-blue-200 hover:text-white p-1 hover:bg-blue-800 rounded transition-colors self-end mt-2"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M17 19l-7-7 7-7" />
            </svg>
          </button>
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
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Biological Concept
            </h4>
            <div 
              class="text-gray-600 leading-relaxed font-sans"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.concept) }}
            />
          </div>

          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg" style={{ fontSize: `${fontSize}px` }}>
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

      {/* Vertical splitter bar */}
      {!isCollapsed && (
        <div
          onMouseDown={startResizing}
          class="w-1.5 hover:w-2 bg-gray-200 hover:bg-indigo-500 active:bg-indigo-600 cursor-col-resize h-full transition-all duration-75 flex-shrink-0 z-10 relative"
          title="Drag to resize sidebar"
        />
      )}

      {/* Right panel: Editor & Terminal */}
      <section class="flex-grow h-full flex flex-col gap-4 overflow-hidden p-4">
        {/* Editor Container */}
        <div class="flex-grow bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div class="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-gray-800">
            <div class="flex items-center space-x-2">
              {isCollapsed && (
                <button
                  onClick={toggleCollapse}
                  title="Expand Tutorial Sidebar"
                  class="text-gray-400 hover:text-white mr-2 bg-[#3a3a3a] p-1 rounded hover:bg-indigo-900 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M7 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <span class="h-3 w-3 rounded-full bg-red-500"></span>
              <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span class="h-3 w-3 rounded-full bg-green-500"></span>
              <span class="text-xs text-gray-400 font-mono ml-2">main.py</span>
            </div>
            <div class="flex items-center space-x-3">
              {/* Learn / Practice Selector */}
              <div class="flex bg-[#1a1a1a] rounded p-0.5 border border-gray-800">
                <button
                  onClick={() => handleModeChange("learn")}
                  class={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    mode === "learn"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => handleModeChange("practice")}
                  class={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    mode === "practice"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Practice
                </button>
              </div>

              {/* Font Size Selector */}
              <div class="flex items-center space-x-1 bg-[#1a1a1a] rounded px-1.5 py-0.5 border border-gray-800 select-none">
                <button
                  onClick={decreaseFontSize}
                  title="Decrease Font Size"
                  class="text-gray-400 hover:text-white font-bold text-xs px-1"
                >
                  A-
                </button>
                <span class="text-[10px] text-gray-500 font-mono px-1">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  title="Increase Font Size"
                  class="text-gray-400 hover:text-white font-bold text-xs px-1"
                >
                  A+
                </button>
              </div>

              {mode === "practice" && (
                <button
                  onClick={handleReset}
                  class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-[#3a3a3a] transition-all hover:bg-red-900"
                >
                  Reset Code
                </button>
              )}
            </div>
          </div>

          {/* CodeMirror Editor Area */}
          <div ref={editorRef} class="flex-grow overflow-hidden font-mono" style={{ fontSize: `${fontSize}px` }} />

          {/* Action Bar */}
          {mode === "practice" && (
            <div class="bg-[#2d2d2d] px-4 py-3 flex gap-3 justify-end border-t border-gray-800 flex-shrink-0">
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
          )}
        </div>

        {/* Terminal/Console Output */}
        {mode === "practice" && (
          <div class="h-44 bg-[#0d0d0d] rounded-xl border border-gray-800 overflow-hidden flex flex-col flex-shrink-0">
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
            <div 
              class="flex-grow p-4 overflow-y-auto font-mono text-[#d4d4d4] whitespace-pre-wrap select-all"
              style={{ fontSize: `${Math.max(10, fontSize - 2)}px` }}
            >
              <span class="text-green-500 mr-1">&gt;</span>
              {output || "Output will be displayed here..."}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
