import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    setLoading(true);
    const res = await fetch("/api/status");
    const json = await res.json();
    setStatus(json);
    setLoading(false);
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>TickHosting Server Status</h1>

      <button onClick={loadStatus} disabled={loading}>
        {loading ? "Lade..." : "Status abrufen"}
      </button>

      {status && (
        <pre style={{ marginTop: 20, background: "#eee", padding: 20 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}
