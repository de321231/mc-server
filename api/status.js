export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://tickhosting.com/api/client/servers/5e45e278/resources",
      {
        headers: {
          "Authorization": "Bearer ptlc_dNKgIvJ0cv5rRE9JJZDCYbW3oYefWSepqCuznW2HzPQ",
          "Accept": "application/json"
        }
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "TickHosting API error",
        raw: text
      });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.toString()
    });
  }
}
