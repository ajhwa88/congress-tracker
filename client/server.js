const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

const GOVINFO_API_KEY = 'YzxTXt00ZgdiY97DSuuje7Y8G4zFAAcMqyQtDOdB';
const GOVINFO_BASE_URL = 'https://api.govinfo.gov/v1';

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API endpoint is working' });
});

// Proxy endpoint for members list
app.get('/api/members', async (req, res) => {
  try {
    console.log('Fetching members list...');
    const response = await fetch(
      `${GOVINFO_BASE_URL}/collections/CDIR/2024`,
      {
        headers: {
          'X-Api-Key': GOVINFO_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error('GovInfo API error:', response.status, response.statusText);
      throw new Error(`GovInfo API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched members data');
    res.json(data);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for member details
app.get('/api/member/:id', async (req, res) => {
  try {
    console.log('Fetching member details for:', req.params.id);
    const response = await fetch(
      `${GOVINFO_BASE_URL}/collections/CDIR/2024/members/${req.params.id}`,
      {
        headers: {
          'X-Api-Key': GOVINFO_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error('GovInfo API error:', response.status, response.statusText);
      throw new Error(`GovInfo API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched member details');
    res.json(data);
  } catch (error) {
    console.error('Error fetching member details:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  - GET /');
  console.log('  - GET /api/test');
  console.log('  - GET /api/members');
  console.log('  - GET /api/member/:id');
}); 