import { useEffect, useState } from "preact/hooks";

interface Poll {
  id: number;
  question_text: string;
}

export function PollsIsland({ backendUrl }: { backendUrl: string }) {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    console.log("useEffect running");
    async function getPolls() {
      console.log("getPolls running");
      try {
        const resp = await fetch(
          `${backendUrl}/api/polls/questions`,
        );
        console.log("fetch response:", resp);
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        const data = await resp.json();
        console.log("fetch data:", data);
        setPolls(data);
      } catch (error) {
        console.error("fetch error:", error);
      }
    }
    getPolls();
  }, []);
  return (
    <div>
      <h1>Polls</h1>
      <ul>
        {polls.map((poll) => <li key={poll.id}>{poll.question_text}</li>)}
      </ul>
    </div>
  );
}
