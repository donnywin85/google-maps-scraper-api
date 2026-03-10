const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main scraper endpoint
app.get('/api/scrape', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    // Validation
    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Query parameter is required'
      });
    }

    const maxLimit = Math.min(parseInt(limit) || 10, 50);

    // Simulate scraping with mock data (replace with actual scraping logic)
    // Note: Real Google Maps scraping requires browser automation (Puppeteer/Playwright)
    // or official Google Places API due to their anti-scraping measures
    const mockResults = generateMockResults(query, maxLimit);

    res.status(200).json({
      success: true,
      query: query,
      resultsCount: mockResults.length,
      data: mockResults
    });

  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to scrape data',
      details: error.message
    });
  }
});

// Generate mock results (replace with actual scraping)
function generateMockResults(query, limit) {
  const results = [];
  const categories = ['Restaurant', 'Cafe', 'Store', 'Service', 'Office'];
  
  for (let i = 0; i < limit; i++) {
    results.push({
      name: `${categories[i % categories.length]} ${i + 1}`,
      address: `${100 + i} Main Street, City, State ${10000 + i}`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      website: `https://example-business-${i}.com`,
      category: categories[i % categories.length],
      priceLevel: '$'.repeat(Math.floor(Math.random() * 4) + 1),
      hours: 'Mon-Fri: 9AM-6PM',
      plusCode: `${Math.random().toString(36).substring(2, 6).toUpperCase()}+${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
      coordinates: {
        lat: (Math.random() * 180 - 90).toFixed(6),
        lng: (Math.random() * 360 - 180).toFixed(6)
      }
    });
  }
  
  return results;
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Google Maps Scraper API running on port ${PORT}`);
});