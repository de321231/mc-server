export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { action } = req.body;
  if (!["start","stop","restart","kill"].includes(action)) {
    return res.status(400).json({ error: "Ungültige Aktion" });
  }

  try {
    const response = await fetch(
      `https://panel.tick-hosting.com/api/client/servers/5e45e278/power`,
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer ptlc_dNKgIvJ0cv5rRE9JJZDCYbW3oYefWSepqCuznW2HzPQ",
          "Accept": "application/vnd.pterodactyl.v1+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ signal: action })
      }
    );

    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch(e) { json = null; }

    // API gibt oft 204 No Content bei Erfolg
    if (response.status === 204) {
      return res.status(200).json({ message: "Befehl gesendet! (204)" });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: "TickHosting API Antwort war kein OK",
        status: response.status,
        response: json || text
      });
    }

    return res.status(200).json({
      message: "Befehl gesendet!",
      response: json || text
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
