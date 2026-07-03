export function Header() {
  return (
    <header class="h-14 w-full bg-white border-b border-gray-200 flex items-center shadow-sm">
      <nav class="w-full max-w-7xl mx-auto flex items-center justify-between px-6">
        <a href="/" class="flex items-center space-x-2.5">
          <img
            src="/favicon.ico"
            alt="Site Logo"
            class="h-8 w-8 flex-shrink-0"
          />
          <h1 class="text-lg font-bold text-gray-800 tracking-wide">
            Bioinformatics Tools
          </h1>
        </a>
        <div class="flex items-center space-x-6 text-sm font-medium text-gray-500">
          <a href="/tutorial" class="hover:text-indigo-600 transition-colors">Tutorial</a>
          <a href="/primer" class="hover:text-indigo-600 transition-colors">PCR Primer</a>
          <a href="/about" class="hover:text-indigo-600 transition-colors">About</a>
        </div>
      </nav>
    </header>
  );
}
