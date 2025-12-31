# Kelani Ganga Flood Prediction System

Complete flood prediction system with ML-powered forecasting, real-time monitoring, and alert notifications.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│                  http://localhost:3000               │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐          ┌────────────────┐
│  Express API  │          │  FastAPI ML    │
│  Port 5000    │◄─────────┤  Port 8000     │
└───────┬───────┘          └────────────────┘
        │                           │
        ▼                           ▼
┌───────────────┐          ┌────────────────┐
│  PostgreSQL   │          │  ML Model      │
│  Database     │          │  (.pkl file)   │
└───────────────┘          └────────────────┘
```

## Features

✅ **Real-time Monitoring** - Track water levels across 8 stations along Kelani Ganga  
✅ **ML Predictions** - Random Forest model with 98.2% accuracy  
✅ **7-Day Forecasts** - Automated flood risk predictions  
✅ **Bilingual Alerts** - English & Sinhala warning messages  
✅ **Interactive Dashboard** - Visual analytics and charts  
✅ **REST API** - Complete backend API for integrations  

## Tech Stack

**Frontend:**
- Next.js 14
- React
- TailwindCSS

**Backend:**
- Node.js + Express.js
- FastAPI (Python)
- PostgreSQL

**Machine Learning:**
- scikit-learn (Random Forest)
- XGBoost
- pandas, numpy

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL 14+

### Installation

1. **Clone the repository**
```bash
cd flood-prediction/flood
```

2. **Install Backend Dependencies**
```bash
cd ENV_RISK_BACKEND
npm install
pip install -r requirements.txt
```

3. **Install Frontend Dependencies**
```bash
cd ../ENV_RISK_FRONTEND
npm install
```

4. **Setup Database**
```bash
cd ../ENV_RISK_BACKEND
npm run init-db
```

5. **Run the ML Model (Jupyter Notebook)**
- Open `ENV_RISK_BACKEND/Kelani_Ganga_Flood_Prediction.ipynb`
- Run all cells to train the model and generate `flood_prediction_model.pkl`

6. **Start All Services**

**Option 1: Using the startup script (Windows)**
```bash
cd ..
start.bat
```

**Option 2: Manual startup**

Terminal 1 - FastAPI ML Service:
```bash
cd ENV_RISK_BACKEND
python ml_service.py
```

Terminal 2 - Express Backend:
```bash
cd ENV_RISK_BACKEND
npm start
```

Terminal 3 - Next.js Frontend:
```bash
cd ENV_RISK_FRONTEND
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:3000
- Express API: http://localhost:5000
- FastAPI ML: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flood_prediction
DB_USER=postgres
DB_PASSWORD=root
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

## API Endpoints

### Express API (Port 5000)

**Stations**
- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get station by ID
- `PUT /api/stations/:id` - Update station

**Water Levels**
- `GET /api/water-levels/latest` - Latest readings
- `GET /api/water-levels/station/:stationId` - By station
- `POST /api/water-levels` - Add new reading
- `GET /api/water-levels/history/:stationId` - Historical data

**Predictions**
- `POST /api/predictions/predict` - Single prediction
- `POST /api/predictions/forecast` - 7-day forecast
- `GET /api/predictions/forecasts` - All forecasts
- `GET /api/predictions/forecast/:stationId` - By station

**Alerts**
- `GET /api/alerts` - Active alerts
- `GET /api/alerts/station/:stationId` - By station
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/deactivate` - Deactivate
- `DELETE /api/alerts/:id` - Delete

### FastAPI ML Service (Port 8000)

- `GET /` - Service info
- `GET /health` - Health check
- `GET /stations` - Available stations
- `POST /predict` - Make prediction
- `POST /forecast` - Generate forecast

## Database Schema

**Tables:**
- `stations` - Monitoring station information
- `water_levels` - Historical water level data
- `predictions` - ML model predictions
- `alerts` - Active flood alerts

## Development

```bash
# Backend development mode (auto-reload)
cd ENV_RISK_BACKEND
npm run dev

# Frontend development mode
cd ENV_RISK_FRONTEND
npm run dev

# Reinitialize database
cd ENV_RISK_BACKEND
npm run init-db

# Seed historical data
npm run seed
```

## Project Structure

```
flood/
├── ENV_RISK_BACKEND/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── stations.js
│   │   ├── waterLevels.js
│   │   ├── predictions.js
│   │   └── alerts.js
│   ├── scripts/
│   │   ├── initDatabase.js
│   │   └── seedData.js
│   ├── ml_service.py
│   ├── server.js
│   ├── database.sql
│   ├── requirements.txt
│   ├── package.json
│   └── Kelani_Ganga_Flood_Prediction.ipynb
├── ENV_RISK_FRONTEND/
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   └── api.js
│   ├── pages/
│   ├── styles/
│   └── package.json
└── start.bat
```

## Monitoring Stations

1. **Glencourse** - Upper catchment
2. **Kitulgala** - High rainfall zone
3. **Deraniyagala** - Mid-stream
4. **Hanwella** - Critical junction
5. **Nagalagam Street** - Urban area
6. **Colombo** - Coastal endpoint
7. **Norwood** - Tea plantation area
8. **Wakoya** - Tributary junction

## ML Model Details

- **Algorithm:** Random Forest Regressor
- **Accuracy:** 98.2%
- **R² Score:** 0.9983
- **Features:** Water level, rainfall, trend, date/time, station
- **Predictions:** 7-day autoregressive forecast

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is developed for environmental risk management and public safety.

## Support

For issues and questions, please create an issue in the repository.

---

**⚠️ Important:** This system provides predictions based on historical data. Always follow official government warnings and evacuation orders during flood events.
