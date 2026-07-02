// utils.ts (Assuming this is where define comes from)
// You might need to import `define` differently depending on its actual usage.
// For a standard Fresh page, you often don't need a custom `define`.
// Example:
// import { PageProps } from "$fresh/server.ts";
// export default function Home(props: PageProps) { ... }

// Assuming define.page is similar to a standard functional component for Fresh pages
import { Header } from "../components/Header.tsx";
import { Card } from "../components/Card.tsx";

// You might need to adjust 'define' usage if it's a custom helper
// For a standard Fresh page, it would be:
// export default function Home() {
// Or if you need server-side props:
// export default function Home(props: PageProps) {

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col"> {/* Ensure content takes full height */}
      <Header />
      {/* Main content area for cards */}
      <main class="flex-grow container mx-auto px-4 py-8"> {/* Responsive padding, centers cards */}
        <div class="flex flex-wrap justify-center gap-6 md:gap-8"> {/* Centers and spaces cards */}
          {/* <Card
            link="/polls"
            description="Django Polls"
            backgroundImage="/dna-1.png" // Replace with your actual path
          /> */}
          <Card
            link="/primer"
            description="PCR Primer Design"
            backgroundImage="/dna-1.png" // Replace with your actual path
          />
          {/* Add more cards as needed */}
        </div>
      </main>
      {/* Optional: Add a footer if you want */}
      {/* <footer>...</footer> */}
    </div>
  );
}