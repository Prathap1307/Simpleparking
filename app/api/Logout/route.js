// pages/api/logout.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Clear tokens from client (session, localStorage, etc.)
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  