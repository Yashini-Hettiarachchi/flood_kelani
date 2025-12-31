# API Quick Reference

## Base URLs
- **Express API**: `http://localhost:5000/api`
- **FastAPI ML**: `http://localhost:8000`

---

## 📍 Stations API

### Get All Stations
```http
GET /api/stations
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kitulgala",
      "latitude": 6.9833,
      "longitude": 80.4167,
      "alert_level": 3.0,
      "minor_flood_level": 4.0,
      "major_flood_level": 5.0
    }
  ]
}
```

### Get Station by ID
```http
GET /api/stations/:id
```

### Get Station by Name
```http
GET /api/stations/name/:name
```

### Update Station
```http
PUT /api/stations/:id
Content-Type: application/json

{
  "alert_level": 3.2,
  "minor_flood_level": 4.1
}
```

---

## 💧 Water Levels API

### Get Latest Water Levels
```http
GET /api/water-levels/latest
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "station_id": 1,
      "station_name": "Kitulgala",
      "datetime": "2025-12-31T09:00:00Z",
      "water_level": 3.45,
      "rainfall": 12.5,
      "trend": "Rising",
      "status": "Alert"
    }
  ]
}
```

### Get Water Levels by Station
```http
GET /api/water-levels/station/:stationId?limit=100&startDate=2025-01-01
```

### Get Historical Data
```http
GET /api/water-levels/history/:stationId?days=7
```

### Add New Reading
```http
POST /api/water-levels
Content-Type: application/json

{
  "station_id": 1,
  "datetime": "2025-12-31T10:00:00Z",
  "water_level": 3.5,
  "rainfall": 15.2,
  "trend": "Rising",
  "status": "Alert"
}
```

---

## 🔮 Predictions API

### Make Single Prediction
```http
POST /api/predictions/predict
Content-Type: application/json

{
  "station": "Kitulgala",
  "water_level_previous": 3.5,
  "rainfall": 50,
  "trend": 1,
  "alert_level": 3.0,
  "minor_flood_level": 4.0,
  "major_flood_level": 5.0
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "predicted_level": 4.12,
    "status": "Minor Flood",
    "message_en": "Warning: Minor flooding expected...",
    "message_si": "අවවාදය: සුළු ගඟ ජලගර්භයක්...",
    "confidence": 0.88
  }
}
```

### Generate 7-Day Forecast
```http
POST /api/predictions/forecast
Content-Type: application/json

{
  "station": "Kitulgala",
  "current_level": 3.5,
  "alert_level": 3.0,
  "minor_flood_level": 4.0,
  "major_flood_level": 5.0,
  "days": 7
}
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-01",
      "predicted_level": 3.62,
      "status": "Alert",
      "message_en": "Stay alert!...",
      "message_si": "සතුටු වන්න!..."
    }
  ]
}
```

### Get All Forecasts
```http
GET /api/predictions/forecasts?days=7
```

### Get Forecast by Station
```http
GET /api/predictions/forecast/:stationId?days=7
```

---

## 🚨 Alerts API

### Get All Active Alerts
```http
GET /api/alerts
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "station_name": "Kitulgala",
      "alert_type": "Minor Flood",
      "severity": "High",
      "message_en": "Minor flooding expected...",
      "message_si": "සුළු ගඟ ජලගර්භයක්...",
      "issued_at": "2025-12-31T08:00:00Z"
    }
  ]
}
```

### Get Alerts by Station
```http
GET /api/alerts/station/:stationId
```

### Create Alert
```http
POST /api/alerts
Content-Type: application/json

{
  "station_id": 1,
  "alert_type": "Minor Flood",
  "severity": "High",
  "message_en": "Minor flooding expected in Kitulgala area",
  "message_si": "කිතුල්ගල ප්‍රදේශයේ සුළු ගංවතුර බලාපොරොත්තු වේ",
  "expires_at": "2025-12-31T20:00:00Z"
}
```

### Deactivate Alert
```http
PUT /api/alerts/:id/deactivate
```

### Delete Alert
```http
DELETE /api/alerts/:id
```

---

## 🤖 FastAPI ML Service

### Service Info
```http
GET http://localhost:8000/
```

### Health Check
```http
GET http://localhost:8000/health
```

### Get Available Stations
```http
GET http://localhost:8000/stations
```
**Response:**
```json
{
  "stations": [
    "Glencourse",
    "Kitulgala",
    "Deraniyagala",
    "Hanwella",
    "Nagalagam Street",
    "Colombo",
    "Norwood",
    "Wakoya"
  ]
}
```

### Make Prediction
```http
POST http://localhost:8000/predict
Content-Type: application/json

{
  "station": "Kitulgala",
  "water_level_previous": 3.5,
  "rainfall": 50.0,
  "trend": 1,
  "alert_level": 3.0,
  "minor_flood_level": 4.0,
  "major_flood_level": 5.0
}
```

### Generate Forecast
```http
POST http://localhost:8000/forecast
Content-Type: application/json

{
  "station": "Kitulgala",
  "current_level": 3.5,
  "alert_level": 3.0,
  "minor_flood_level": 4.0,
  "major_flood_level": 5.0,
  "days": 7
}
```

---

## 📊 Status Values

**Water Level Trend:**
- `Rising` (1)
- `Falling` (-1)
- `Stable` (0)

**Flood Status:**
- `Normal` - Below alert level
- `Alert` - Above alert level
- `Minor Flood` - Above minor flood level
- `Major Flood` - Above major flood level

**Alert Severity:**
- `Low` - Normal monitoring
- `Medium` - Alert status
- `High` - Minor flood
- `Critical` - Major flood

---

## 🔧 cURL Examples

**Get all stations:**
```bash
curl http://localhost:5000/api/stations
```

**Get latest water levels:**
```bash
curl http://localhost:5000/api/water-levels/latest
```

**Make a prediction:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "station": "Kitulgala",
    "water_level_previous": 3.5,
    "rainfall": 50,
    "trend": 1,
    "alert_level": 3.0,
    "minor_flood_level": 4.0,
    "major_flood_level": 5.0
  }'
```

**Create an alert:**
```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "station_id": 1,
    "alert_type": "Alert",
    "severity": "Medium",
    "message_en": "Water levels rising",
    "message_si": "ජල මට්ටම ඉහළ යමින්"
  }'
```

---

## 📱 Frontend Integration

```javascript
// Import API client
import api from '@/lib/api';

// Get all stations
const stations = await api.stations.getAll();

// Get latest water levels
const levels = await api.waterLevels.getLatest();

// Make prediction
const prediction = await api.predictions.predict({
  station: 'Kitulgala',
  water_level_previous: 3.5,
  rainfall: 50,
  trend: 1,
  alert_level: 3.0,
  minor_flood_level: 4.0,
  major_flood_level: 5.0
});

// Get 7-day forecast
const forecast = await api.predictions.forecast({
  station: 'Kitulgala',
  current_level: 3.5,
  alert_level: 3.0,
  minor_flood_level: 4.0,
  major_flood_level: 5.0,
  days: 7
});
```

---

## 🔐 Authentication

Currently no authentication required (development mode).

For production, add JWT tokens:
```http
Authorization: Bearer <token>
```

---

## ⚡ Rate Limits

Development: Unlimited
Production: 100 requests/minute

---

## 📝 Error Responses

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error
