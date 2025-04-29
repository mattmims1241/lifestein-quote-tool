// server.mjs
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // make sure this is installed!

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with specific origin settings
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.post('/api/quote', async (req, res) => {
  try {
    // Get the original payload from the request
    const originalPayload = req.body.COMPULIFE;
    
    // Create a reformatted payload with only the needed fields in the exact order needed
    const formattedPayload = {
      BirthMonth: originalPayload.BirthMonth || "1",
      BirthYear: originalPayload.BirthYear || "1990",
      Birthday: originalPayload.Birthday || "1",
      CompRating: originalPayload.CompRating || "4",
      FaceAmount: originalPayload.FaceAmount || "500000",
      Health: originalPayload.Health || "PP",
      LANGUAGE: originalPayload.LANGUAGE || "E",
      ModeUsed: originalPayload.ModeUsed || "M",
      NewCategory: originalPayload.NewCategory || "5",
      REMOTE_IP: "122.182.211.105", // Hard-coded for consistency
      Sex: originalPayload.Sex || "M",
      Smoker: originalPayload.Smoker || "N",
      SortOverride1: "M", // Hard-coded to match curl example
      State: originalPayload.State || "5", // Hard-coded to match curl example
      UserLocation: "json", // Hard-coded to match curl example
      NitocinePouch: originalPayload.NitocinePouch === "Y" ? true:false
    };
    
    // Prepare the API URL with query parameters
    const COMPULIFE_DOMAIN = process.env.COMPULIFE_DOMAIN || 'compulifeapi.com';
    const COMPULIFE_AUTH_ID = process.env.COMPULIFE_AUTH_ID || '760903F14';
    const REMOTE_IP = process.env.REMOTE_IP || '74.113.157.69';
    
    // Convert the payload to a URL-encoded JSON string
    const compulifeParamValue = encodeURIComponent(JSON.stringify(formattedPayload));
    
    // Build the full URL with query parameters
    const url = `https://${COMPULIFE_DOMAIN}/api/request/?COMPULIFEAUTHORIZATIONID=${COMPULIFE_AUTH_ID}&REMOTE_IP=${REMOTE_IP}&COMPULIFE=${compulifeParamValue}`;
    
    // console.log("Sending request to CompuLife API...");
    console.log("Original Payload:", JSON.stringify(originalPayload, null, 2));
    // console.log("Formatted Payload:", JSON.stringify(formattedPayload, null, 2));
    // console.log("API URL (truncated):", url.substring(0, 100) + "...");
    //console.log(url);
    
    // Make the GET request to the CompuLife API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    //console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🛑 CompuLife API Error (${response.status}):`, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to get quote from CompuLife',
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('💥 Server Error:', err.message || err);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err.message || 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
