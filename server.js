require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer();

// Enable CORS for the React development server
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKey: process.env.PLANT_ID_API_KEY ? 'configured' : 'missing' });
});

// Endpoint to handle plant identification
app.post('/api/identify', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  if (!process.env.PLANT_ID_API_KEY) {
    return res.status(500).json({ error: 'Plant.id API key is not configured' });
  }

  try {
    const base64Image = req.file.buffer.toString('base64');
    console.log('Sending request to Plant.id API...');

    const response = await axios.post(
      'https://api.plant.id/v2/identify',
      {
        images: [base64Image],
        modifiers: ['crops_fast', 'similar_images'],
        plant_language: 'en',
        plant_details: [
          'common_names',
          'url',
          'description',
          'taxonomy',
          'rank',
          'gbif_id',
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.PLANT_ID_API_KEY,
        },
      }
    );

    console.log('Received response from Plant.id API');
    res.json(response.data);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to identify plant',
      details: error.response?.data || error.message
    });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Key loaded:', process.env.PLANT_ID_API_KEY ? 'Yes' : 'No');
  console.log('Server URL: http://localhost:' + PORT);
});
