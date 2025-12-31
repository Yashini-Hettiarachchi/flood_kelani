# Kelani Ganga Flood Prediction Backend

Backend API system for flood prediction using Node.js, Express, FastAPI, and PostgreSQL.

## Architecture

- **Express.js API** (Port 5000): Main backend API for database operations
- **FastAPI ML Service** (Port 8000): Machine learning prediction service
- **PostgreSQL**: Database for storing stations, water levels, predictions, and alerts

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies for ML service
pip install -r requirements.txt
```

### 2. Configure Database

Make sure PostgreSQL is installed and running. Update `.env` file with your database credentials.

### 3. Initialize Database

```bash
# Create database and tables
npm run init-db
```

### 4. Seed Initial Data (Optional)

```bash
# Import historical data from CSV
npm run seed
```

### 5. Start Services

```bash
# Terminal 1: Start FastAPI ML Service
python ml_service.py

# Terminal 2: Start Express API
npm start

# For development with auto-reload:
npm run dev
```

## API Endpoints

### Express API (http://localhost:5000)

#### Stations
- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get station by ID
- `GET /api/stations/name/:name` - Get station by name
- `PUT /api/stations/:id` - Update station

#### Water Levels
- `GET /api/water-levels/latest` - Get latest readings for all stations
- `GET /api/water-levels/station/:stationId` - Get readings by station
- `POST /api/water-levels` - Add new water level reading
- `GET /api/water-levels/history/:stationId` - Get historical data

#### Predictions
- `POST /api/predictions/predict` - Get single prediction
- `POST /api/predictions/forecast` - Get 7-day forecast
- `GET /api/predictions/forecasts` - Get all forecasts
- `GET /api/predictions/forecast/:stationId` - Get forecast by station

#### Alerts
- `GET /api/alerts` - Get all active alerts
- `GET /api/alerts/station/:stationId` - Get alerts by station
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id/deactivate` - Deactivate alert
- `DELETE /api/alerts/:id` - Delete alert

### FastAPI ML Service (http://localhost:8000)

- `GET /` - Service info
- `GET /health` - Health check
- `GET /stations` - Get available stations
- `POST /predict` - Make single prediction
- `POST /forecast` - Generate multi-day forecast

## Environment Variables

See `.env` file for configuration options:

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: flood_prediction)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: root)
- `PORT` - Express server port (default: 5000)
- `ML_SERVICE_URL` - FastAPI service URL (default: http://localhost:8000)

## Database Schema

- **stations** - River monitoring stations
- **water_levels** - Historical water level measurements
- **predictions** - ML model predictions
- **alerts** - Flood alert notifications

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Initialize database
npm run init-db

# Seed data from CSV
npm run seed
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update database credentials
3. Configure firewall rules
4. Use process manager (PM2 recommended)

```bash
pm2 start server.js --name flood-api
pm2 start ml_service.py --name flood-ml --interpreter python3
```
