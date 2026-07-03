import { Header } from "../components/Header.tsx";
import TutorialPlayground from "../islands/TutorialPlayground.tsx";

export default function Page() {
  const backendUrl = Deno.env.get("BACKEND_URL") || "http://127.0.0.1:9000";
  return (
    <div class="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <TutorialPlayground backendUrl={backendUrl} />
    </div>
  );
}
