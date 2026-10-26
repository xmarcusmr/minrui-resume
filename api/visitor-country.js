// Vercel adds the visitor's country at its trusted network boundary.
export default function handler(req, res) {
  const value = req.headers['x-vercel-ip-country'];
  const country = typeof value === 'string' && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : null;
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.status(200).json({ country });
}
