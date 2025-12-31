import { useEffect, useState } from 'react';
import moment from 'moment';

export default function MLPredictionsTable() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictions();
    // Refresh predictions every 5 minutes
    const interval = setInterval(fetchPredictions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/predictions/7day');
      const result = await response.json();
      
      if (result.success) {
        setPredictions(result.predictions);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch predictions');
      }
    } catch (err) {
      setError('Failed to connect to prediction service: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (waterLevel, station) => {
    // Define threshold levels for each station (in meters)
    const thresholds = {
      Nagalagam: { critical: 4.0, high: 3.5, medium: 3.0 },
      Hanwella: { critical: 5.5, high: 5.0, medium: 4.5 },
      Glencourse: { critical: 3.5, high: 3.0, medium: 2.5 },
      Kithulgala: { critical: 4.0, high: 3.5, medium: 3.0 },
      Holombuwa: { critical: 3.0, high: 2.5, medium: 2.0 },
      Deraniyagala: { critical: 3.5, high: 3.0, medium: 2.5 },
      Norwood: { critical: 2.5, high: 2.0, medium: 1.5 }
    };

    const threshold = thresholds[station];
    if (!threshold || waterLevel === null || waterLevel === undefined) return 'N/A';

    if (waterLevel >= threshold.critical) return 'CRITICAL';
    if (waterLevel >= threshold.high) return 'HIGH';
    if (waterLevel >= threshold.medium) return 'MEDIUM';
    return 'LOW';
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dayIndex) => {
    const date = moment().add(dayIndex, 'days');
    const today = moment().startOf('day');
    
    if (date.isSame(today, 'day')) {
      return { label: 'Today', full: date.format('MMM D') };
    } else if (date.isSame(today.clone().add(1, 'day'), 'day')) {
      return { label: 'Tomorrow', full: date.format('MMM D') };
    } else {
      return { label: date.format('ddd'), full: date.format('MMM D') };
    }
  };

  const stations = ['Nagalagam', 'Hanwella', 'Glencourse', 'Kithulgala', 'Holombuwa', 'Deraniyagala', 'Norwood'];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p className="text-gray-600">Loading ML predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 rounded-xl shadow-lg p-8">
        <div className="flex items-start text-yellow-800">
          <i className="fas fa-exclamation-triangle text-2xl mr-3 mt-1"></i>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">ML Predictions Unavailable</h3>
            <p className="text-sm mb-3">{error}</p>
            <button
              onClick={fetchPredictions}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              <i className="fas fa-sync-alt mr-2"></i>Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!predictions) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-600">No predictions available</p>
      </div>
    );
  }

  // Transform predictions into rows by day
  const rows = [];
  for (let day = 0; day < 7; day++) {
    const row = { day };
    stations.forEach(station => {
      const stationData = predictions[station];
      if (stationData && !stationData.error && stationData.predictions) {
        const prediction = stationData.predictions[day];
        row[station] = prediction ? prediction.yhat : null;
      } else {
        row[station] = null;
      }
    });
    rows.push(row);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="fas fa-brain mr-3"></i>
          ML-Powered 7-Day Water Level Predictions
        </h2>
        <p className="text-purple-100 mt-1">
          AI-generated forecasts for all 7 monitoring stations in Kelani Ganga
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nagalagam Street
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Hanwella
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Glencourse
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Kithulgala
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Holombuwa
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Deraniyagala
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Norwood
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, index) => {
              const dateInfo = formatDate(row.day);
              
              return (
                <tr key={index} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      dateInfo.label === 'Today' 
                        ? 'text-purple-600' 
                        : 'text-gray-900'
                    }`}>
                      {dateInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {dateInfo.full}
                    </div>
                  </td>
                  {stations.map((station) => {
                    const waterLevel = row[station];
                    const riskLevel = getRiskLevel(waterLevel, station);
                    
                    return (
                      <td key={station} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getRiskBadgeColor(riskLevel)
                          }`}>
                            {riskLevel}
                          </span>
                          <span className="text-xs font-medium text-gray-900">
                            {waterLevel !== null && waterLevel !== undefined 
                              ? `${waterLevel.toFixed(2)}m` 
                              : '-'}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"></span>
              <span>Critical</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded-full mr-2"></span>
              <span>High Risk</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full mr-2"></span>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded-full mr-2"></span>
              <span>Low Risk</span>
            </div>
          </div>
          <div className="text-gray-500">
            <i className="fas fa-brain mr-2"></i>
            ML-Powered Predictions
          </div>
        </div>
      </div>
    </div>
  );
}
