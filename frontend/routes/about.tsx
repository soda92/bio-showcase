import { Header } from "../components/Header.tsx";

export default function AboutPage() {
  const resources = [
    {
      name: "Rosalind",
      url: "https://rosalind.info/",
      category: "Interactive Practice",
      description: "Learn bioinformatics through algorithmic programming problems. Highly recommended for testing your alignment, assembly, and sequence analysis implementations.",
    },
    {
      name: "Biopython Project",
      url: "https://biopython.org/",
      category: "Python Tooling",
      description: "The industry standard Python library for reading sequence files (FASTA, GenBank, FASTQ), interfacing with biological databases, and mapping alignments.",
    },
    {
      name: "NCBI Entrez Database",
      url: "https://www.ncbi.nlm.nih.gov/",
      category: "Reference Database",
      description: "Access the National Center for Biotechnology Information's massive databases containing gene transcripts, protein sequences, and biological publications.",
    },
    {
      name: "Primer3 Reference Manual",
      url: "https://primer3.org/",
      category: "Oligo Design",
      description: "The official documentation on thermodynamic parameters, primer melting points (Tm), dimer/hairpin hybridization loops, and specificity optimization.",
    },
    {
      name: "Dynamic Programming Alignment Guides",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC345097/",
      category: "Theory & Papers",
      description: "Deepen your understanding of sequence similarity matrices, BLOSUM/PAM tables, Needleman-Wunsch global grids, and Smith-Waterman local alignment.",
    }
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-[#070b13] via-[#0f172a] to-[#1e1b4b] text-white flex flex-col font-sans">
      <Header />

      <main class="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        {/* Intro */}
        <div class="mb-12 border-b border-gray-800 pb-8">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-4">
            About the Bioinformatics Workbench
          </h1>
          <p class="text-gray-400 text-sm md:text-base leading-relaxed">
            This workbench is designed as an interactive environment for molecular biology researchers and computer science students alike. By bridging dynamic web UI controls (using Preact/Deno Fresh) with a robust computational engine (using Python/Django), we make abstract mathematical concepts like dynamic programming grids and thermodynamic PCR parameters visual and easy to understand.
          </p>
        </div>

        {/* Learning Resources Heading */}
        <div class="mb-8">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Curated Learning Resources
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            Explore these authoritative sites, libraries, and publications to expand your computational biology skills.
          </p>
        </div>

        {/* Resources Grid/List */}
        <div class="space-y-4">
          {resources.map((res, index) => (
            <a
              key={index}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              class="group block bg-gray-900/35 hover:bg-gray-900/60 border border-gray-800/80 hover:border-indigo-500/40 rounded-xl p-5 transition-all duration-300 shadow-md flex justify-between items-start gap-4"
            >
              <div class="space-y-1.5">
                <div class="flex items-center gap-2.5">
                  <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {res.name}
                  </h3>
                  <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700/50">
                    {res.category}
                  </span>
                </div>
                <p class="text-gray-400 text-xs leading-relaxed max-w-2xl">
                  {res.description}
                </p>
              </div>

              <div class="text-gray-600 group-hover:text-indigo-400 transition-colors pt-0.5">
                <svg class="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer class="border-t border-gray-900 bg-[#04060b] py-6 text-center text-xs text-gray-500 mt-12">
        <p>&copy; {new Date().getFullYear()} Bioinformatics Workbench. Crafted for molecular biology research & learning.</p>
      </footer>
    </div>
  );
}
