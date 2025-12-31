const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { initWeatherScheduler } = require('./services/weatherScheduler');

// Load environment variables
dotenv.config();

// Import routes
const stationsRouter = require('./routes/stations');
const waterLevelsRouter = require('./routes/waterLevels');
const predictionsRouter = require('./routes/predictions');
const alertsRouter = require('./routes/alerts');
const weatherRouter = require('./routes/weather');
const registerRouter = require('./routes/register');
const externalFloodRouter = require('./routes/externalFlood');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Kelani Ganga Flood Prediction API',
    version: '1.0.0',
    endpoints: {
      stations: '/api/stations',
      waterLevels: '/api/water-levels',
      predictions: '/api/predictions',
      alerts: '/api/alerts',
      weather: '/api/weather',
      register: '/api/register',
      externalFlood: '/api/external-flood',
      auth: '/api/auth'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/stations', stationsRouter);
app.use('/api/water-levels', waterLevelsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/register', registerRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/external-flood', externalFloodRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌊 Flood Prediction Backend Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API URL: http://localhost:${PORT}`);
  console.log(`✓ Health: http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(60)}\n`);
  
  // Initialize weather data scheduler
  initWeatherScheduler();
});

module.exports = app;
