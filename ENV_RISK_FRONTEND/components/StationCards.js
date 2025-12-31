import { useEffect, useState } from 'react';
import { waterLevelsAPI, stationsAPI } from '../lib/api';

export default function StationCards() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStations();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStations = async () => {
    try {
      const result = await waterLevelsAPI.getLatest();
      
      if (result.success) {
        // Transform data to include risk level based on thresholds
        const transformedStations = result.data.map(station => {
          const currentLevel = station.current_level || 0;
          const alertLevel = station.alert_level || 0;
          const minorFloodLevel = station.minor_flood_level || 0;
          const majorFloodLevel = station.major_flood_level || 0;

          let riskLevel = 'LOW';
          let status = 'Normal';
          
          if (currentLevel >= majorFloodLevel) {
            riskLevel = 'CRITICAL';
            status = 'Major Flood';
          } else if (currentLevel >= minorFloodLevel) {
            riskLevel = 'HIGH';
            status = 'Minor Flood';
          } else if (currentLevel >= alertLevel) {
            riskLevel = 'MEDIUM';
            status = 'Alert';
          }

          return {
            id: station.station_id,
            name: station.station_name,
            currentLevel: currentLevel,
            previousLevel: station.previous_level || 0,
            trend: station.trend || 'Stable',
            rainfall: station.rainfall || 0,
            status: status,
            riskLevel: riskLevel,
            lastUpdate: station.measured_at,
            thresholds: {
              alert: alertLevel,
              minorFlood: minorFloodLevel,
              majorFlood: majorFloodLevel
            }
          };
        });
        
        setStations(transformedStations);
        setError(null);
      } else {
        setError('Failed to load station data');
      }
    } catch (err) {
      setError('Failed to fetch station data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'from-red-600 to-red-700';
      case 'HIGH':
        return 'from-orange-500 to-orange-600';
      case 'MEDIUM':
        return 'from-yellow-500 to-yellow-600';
      case 'LOW':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NORMAL':
        return 'fa-check-circle text-green-500';
      case 'ALERT':
        return 'fa-exclamation-triangle text-yellow-500';
      case 'MINOR FLOOD':
        return 'fa-exclamation-circle text-orange-500';
      case 'MAJOR FLOOD':
        return 'fa-times-circle text-red-500';
      default:
        return 'fa-question-circle text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stations.map((station, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          {/* Risk Level Header */}
          <div className={`bg-gradient-to-r ${getRiskColor(station.risk_level)} p-4`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-lg font-bold">{station.station_name}</h3>
                <p className="text-sm opacity-90">{station.tributary_name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {parseFloat(station.water_level).toFixed(2)}
                </div>
                <div className="text-xs opacity-90">{station.unit}</div>
              </div>
            </div>
          </div>

          {/* Station Details */}
          <div className="p-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <i className={`fas ${getStatusIcon(station.status)} text-xl mr-2`}></i>
                <span className="font-semibold text-gray-700">{station.status}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                station.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                station.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                station.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {station.risk_level} RISK
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Water Level Progress</span>
                <span>{parseFloat(station.percent_of_alert).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    station.risk_level === 'CRITICAL' ? 'bg-red-600' :
                    station.risk_level === 'HIGH' ? 'bg-orange-500' :
                    station.risk_level === 'MEDIUM' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(parseFloat(station.percent_of_alert), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs">Alert Level</p>
                <p className="font-bold text-gray-900">
                  {parseFloat(station.alert_level).toFixed(2)}m
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs">Flood Level</p>
                <p className="font-bold text-gray-900">
                  {station.minor_flood_level ? parseFloat(station.minor_flood_level).toFixed(2) + 'm' : 'N/A'}
                </p>
              </div>
              {station.rainfall_6hr !== null && (
                <div className="bg-blue-50 rounded-lg p-3 col-span-2">
                  <p className="text-blue-700 text-xs">Rainfall (6hr)</p>
                  <p className="font-bold text-blue-900">
                    <i className="fas fa-cloud-rain mr-1"></i>
                    {parseFloat(station.rainfall_6hr).toFixed(1)}mm
                  </p>
                </div>
              )}
            </div>

            {/* Trend Indicator */}
            {station.trend && station.trend !== 'UNKNOWN' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center text-sm">
                  <i className={`fas ${
                    station.trend === 'RISING' ? 'fa-arrow-up text-red-500' :
                    station.trend === 'FALLING' ? 'fa-arrow-down text-green-500' :
                    'fa-arrows-alt-h text-gray-500'
                  } mr-2`}></i>
                  <span className="text-gray-600">
                    Trend: <span className="font-semibold">{station.trend}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
