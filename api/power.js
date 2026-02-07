export default async function handler(req, res) {
  // 🔓 CORS für Frontend (optional)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });

  const { action } = req.body;
  if (!['start','stop','restart'].includes(action)) 
    return res.status(400).json({ error: 'Ungültige Aktion' });

  try {
    // 🔑 DEIN Tick-Hosting API-Key + Server-ID
    const response = await fetch(
      `https://panel.tick-hosting.com/api/client/servers/5e45e278/power`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ptlc_dNKgIvJ0cv5rRE9JJZDCYbW3oYefWSepqCuznW2HzPQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signal: action })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Tick-Hosting API Fehler', text });
    }

    return res.status(200).json({ message: 'Befehl gesendet!' });

  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
