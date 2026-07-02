import MyFormPage from "../islands/PrimerDesign.tsx";
import { Header } from "../components/Header.tsx";

export default function Page() {
  const backendUrl = Deno.env.get("BACKEND_URL") || "http://127.0.0.1:9000";
  return (
    <div>
      <Header />
      <MyFormPage backendUrl={backendUrl} />
    </div>
  );
}
