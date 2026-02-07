export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Nur GET erlaubt" });
  }

  try {
    const response = await fetch(
      `https://panel.tick-hosting.com/api/client/servers/5e45e278/resources`,
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer ptlc_dNKgIvJ0cv5rRE9JJZDCYbW3oYefWSepqCuznW2HzPQ",
          "Accept": "application/vnd.pterodactyl.v1+json",
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // In vielen APIs kommt der Status so
    const status = data.attributes?.current_state || "unbekannt";
    return res.status(200).json({ status });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
