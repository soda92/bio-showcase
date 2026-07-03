import SequenceAlignment from "../islands/SequenceAlignment.tsx";
import { Header } from "../components/Header.tsx";

export default function Page() {
  const backendUrl = Deno.env.get("BACKEND_URL") || "http://127.0.0.1:9000";
  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main class="flex-grow">
        <SequenceAlignment backendUrl={backendUrl} />
      </main>
    </div>
  );
}
