import fetch from 'node-fetch';

export default async function handler(req, res) {

  // 🔓 CORS HEADERS (DAS FEHLT BEI DIR)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 🛑 Preflight-Request abfangen
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CONFIG = {
    API_KEY: 'ptlc_dNKgIvJ0cv5rRE9JJZDCYbW3oYefWSepqCuznW2HzPQ',
    SERVER_ID: '5e45e278'
  };

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { action } = req.body;
  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).json({ error: 'Ungültige Aktion' });
  }

  try {
    const response = await fetch(
      `https://panel.tick-hosting.com/api/client/servers/${CONFIG.SERVER_ID}/power`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signal: action })
      }
    );

    return res.status(200).json({
      message: response.ok ? 'Befehl gesendet!' : 'Fehler: ' + response.status
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
