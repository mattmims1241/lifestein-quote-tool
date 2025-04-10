// server.mjs
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({
  origin: process.env.CLIENT_URL, // Allow your origins host
  credentials: true,
}));
app.use(express.json());

app.post('/api/quote', async (req, res) => {
  const compulifePayload = req.body.COMPULIFE;

  const url = process.env.COMPULIFE_URL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ COMPULIFE: compulifePayload }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CompuLife API Error:', errorText);
      return res.status(500).json({ error: 'Failed to get quote from CompuLife' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Server Error:', err.message || err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
