import { useEffect, useState } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // First try to get latest from database
      const latestResponse = await fetch('http://localhost:5000/api/weather/latest');
      const latestData = await latestResponse.json();
      
      // If no data or data is old (more than 1 hour), fetch new data
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const needsUpdate = !latestData.data || 
                          new Date(latestData.data.recorded_at) < oneHourAgo;
      
      if (needsUpdate) {
        const currentResponse = await fetch('http://localhost:5000/api/weather/current');
        const currentData = await currentResponse.json();
        setWeather(currentData.data);
      } else {
        setWeather(latestData.data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getFloodRiskLevel = () => {
    if (!weather) return 'Unknown';
    
    const rainfall = weather.rainfall_1h || 0;
    const humidity = weather.humidity || 0;
    
    if (rainfall > 10 || (rainfall > 5 && humidity > 85)) {
      return 'High';
    } else if (rainfall > 5 || humidity > 80) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weather Conditions</h3>
        <p className="text-gray-500">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weather Conditions</h3>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchWeather}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const floodRisk = getFloodRiskLevel();
  const recordedTime = new Date(weather.recorded_at).toLocaleString();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Weather Conditions</h3>
        <button 
          onClick={fetchWeather}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Location and Description */}
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Kelani Ganga Basin</p>
          <p className="text-xl font-semibold capitalize">{weather.weather_description}</p>
        </div>

        {/* Temperature */}
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm text-gray-600">Temperature</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(weather.temperature)}°C
          </p>
          <p className="text-xs text-gray-500">Feels like {Math.round(weather.feels_like)}°C</p>
        </div>

        {/* Rainfall */}
        <div className="bg-cyan-50 p-3 rounded">
          <p className="text-sm text-gray-600">Rainfall (1h)</p>
          <p className="text-2xl font-bold text-cyan-600">
            {weather.rainfall_1h || 0} mm
          </p>
          <p className="text-xs text-gray-500">3h: {weather.rainfall_3h || 0} mm</p>
        </div>

        {/* Humidity */}
        <div className="bg-indigo-50 p-3 rounded">
          <p className="text-sm text-gray-600">Humidity</p>
          <p className="text-2xl font-bold text-indigo-600">
            {weather.humidity}%
          </p>
        </div>

        {/* Wind Speed */}
        <div className="bg-teal-50 p-3 rounded">
          <p className="text-sm text-gray-600">Wind Speed</p>
          <p className="text-2xl font-bold text-teal-600">
            {weather.wind_speed} m/s
          </p>
          <p className="text-xs text-gray-500">Direction: {weather.wind_direction}°</p>
        </div>

        {/* Pressure */}
        <div className="bg-purple-50 p-3 rounded">
          <p className="text-sm text-gray-600">Pressure</p>
          <p className="text-2xl font-bold text-purple-600">
            {weather.pressure} hPa
          </p>
        </div>

        {/* Cloudiness */}
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Cloudiness</p>
          <p className="text-2xl font-bold text-gray-600">
            {weather.cloudiness}%
          </p>
        </div>
      </div>

      {/* Flood Risk Indicator */}
      <div className={`p-4 rounded-lg ${getRiskColor(floodRisk)}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Weather-Based Flood Risk</p>
            <p className="text-xs mt-1">Based on rainfall and humidity levels</p>
          </div>
          <p className="text-2xl font-bold">{floodRisk}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Last updated: {recordedTime}
      </p>
    </div>
  );
}
