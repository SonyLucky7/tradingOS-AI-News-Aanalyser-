export default async function handler(req, res) {
  // Set CORS headers so the browser allows the request from the Vercel app domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // req.url will be something like "/api/yahoo/v8/finance/chart/BTC-USD?interval=15m&range=1d"
    // We strip the "/api/yahoo" prefix and append it to the real Yahoo Finance domain
    const targetUrl = 'https://query2.finance.yahoo.com' + req.url.replace(/^\/api\/yahoo/, '');

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Yahoo API error: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Vercel Yahoo Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error fetching Yahoo Data' });
  }
}
