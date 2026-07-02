// components/Header.tsx
import { h } from "preact";

export function Header() {
  return (
    <header
      class="h-[110px] sm:!h-[144px] w-full bg-cover bg-no-repeat relative"
      // You could even add a background image here if desired
      // style={{ backgroundImage: 'url(/path-to-header-bg.jpg)', backgroundSize: 'cover' }}
    >
      <div class="rainfall w-full h-full absolute" /> {/* Assuming 'rainfall' is a visual effect */}
      <nav class="w-11/12 h-24 max-w-5xl mx-auto flex items-center justify-start relative px-4 sm:px-6"> {/* Added px-4 sm:px-6 */}
        <a href="/" class="flex items-center space-x-3"> {/* Use flex to align logo and title */}
          <img
            src="/favicon.ico"
            alt="Site Logo"
            class="h-14 w-14 flex-shrink-0" // flex-shrink-0 prevents shrinking
          />
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"> {/* Larger text, bolder font */}
            Bioinformatics Tools
          </h1>
        </a>
      </nav>
    </header>
  );
}