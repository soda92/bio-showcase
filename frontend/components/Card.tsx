// components/Card.tsx
import { h } from "preact";

export function Card({ link, description, backgroundImage }: {
  link: string;
  description: string;
  backgroundImage?: string; // Optional prop for different backgrounds
}) {
  return (
    <a
      href={link}
      // Make the entire card a clickable link
      class="
        flex flex-col items-center justify-center
        my-2 mx-2 p-4
        w-full sm:w-48 md:w-56 lg:w-64 xl:w-72 // Responsive widths
        h-40 sm:h-48 md:h-56 // Responsive heights
        bg-blue-200 rounded-lg shadow-md
        transition-transform duration-200 hover:scale-105 hover:shadow-lg
        relative overflow-hidden // For background image
        text-center text-lg font-semibold text-gray-800
        group // For styling children on hover
      "
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {/* Overlay for text readability on background image */}
      {backgroundImage && (
        <div class="absolute inset-0 bg-black opacity-30 group-hover:opacity-40 transition-opacity duration-200 rounded-lg"></div>
      )}
      <span class="relative z-10 text-white text-shadow-md"> {/* Ensure text is on top and readable */}
        {description}
      </span>
    </a>
  );
}

// You might need a utility class for text-shadow-md if not already available in your Tailwind config.
// If you don't have it, you can add it to your tailwind.config.js or define it in global CSS:
// .text-shadow-md {
//   text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
// }