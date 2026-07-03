import { Header } from "../components/Header.tsx";
import { Card } from "../components/Card.tsx";

export default function Home() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-[#070b13] via-[#0f172a] to-[#1e1b4b] text-white flex flex-col font-sans">
      <Header />
      
      <main class="flex-grow container mx-auto px-6 py-16 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div class="text-center max-w-3xl mb-16 animate-fade-in">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 uppercase tracking-wider">
            <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Bioinformatics Workbench
          </span>
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-6">
            Computational Biology Showcase
          </h1>
          <p class="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            An interactive laboratory for biological sequence analysis, automated PCR primer design, and dynamic programming alignment visualizers.
          </p>
        </div>

        {/* Catalog Cards Grid */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <Card
            link="/primer"
            title="PCR Primer Design"
            description="Input DNA sequences and optimize forward, reverse, and internal primers using thermodynamic parameters."
            icon="primer"
          />
          <Card
            link="/alignment"
            title="Sequence Alignment Solver"
            description="Compare sequences side-by-side using Needleman-Wunsch global or Smith-Waterman local alignment."
            icon="alignment"
          />
          <Card
            link="/tutorial"
            title="Bioinformatics Tutorial"
            description="Learn core algorithms interactively with a full python sandbox workspace and automated unit tests."
            icon="tutorial"
          />
        </div>
      </main>

      {/* Footer */}
      <footer class="border-t border-gray-900 bg-[#04060b] py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Bioinformatics Workbench. Crafted for molecular biology research & learning.</p>
      </footer>
    </div>
  );
}
