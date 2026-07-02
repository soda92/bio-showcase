import { PollsIsland } from "../islands/PollsIsland.tsx";
import { Header } from "../components/Header.tsx";

export default function Polls() {
  const backendUrl = Deno.env.get("BACKEND_URL") || "http://127.0.0.1:9000";
  return (
    <div>
      <Header />
      <PollsIsland backendUrl={backendUrl} />
    </div>
  );
}
