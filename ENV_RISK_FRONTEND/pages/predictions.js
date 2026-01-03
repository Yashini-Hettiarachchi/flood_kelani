import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { predictionsAPI, stationsAPI, waterLevelsAPI } from "../lib/api";

export default function Predictions() {
  const [mlForecast, setMlForecast] = useState([]);
  const [showMLData, setShowMLData] = useState(false);
  const [selectedStation, setSelectedStation] = useState("All Stations");
  const [stations, setStations] = useState([]);
  const [currentRiverLevels, setCurrentRiverLevels] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(true);

  useEffect(() => {
    fetchMLForecast();
    fetchStations();
    fetchCurrentRiverLevels();
  }, []);

  const fetchMLForecast = async () => {
    try {
      const result = await predictionsAPI.getMLForecast();
      if (result.success) {
        setMlForecast(result.data);
      }
    } catch (error) {
      console.error("Error fetching ML forecast:", error);
    }
  };

  const fetchStations = async () => {
    try {
      const result = await stationsAPI.getAll();
      if (result.success) {
        setStations(result.data);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const fetchCurrentRiverLevels = async () => {
    try {
      setLoadingLevels(true);
      const result = await predictionsAPI.getMLForecast();
      
      if (result.success && result.data.length > 0) {
        // Get today's date in the format used in the CSV
        const today = new Date().toISOString().split('T')[0];
        
        // Filter for today's predictions and group by station
        const todayData = result.data.filter(row => row.Date === today);
        
        // If no data for today, get the earliest available date
        let currentData = todayData;
        if (currentData.length === 0) {
          const uniqueDates = [...new Set(result.data.map(row => row.Date))].sort();
          const earliestDate = uniqueDates[0];
          currentData = result.data.filter(row => row.Date === earliestDate);
        }
        
        // Get unique stations with their latest prediction
        const stationMap = new Map();
        currentData.forEach(row => {
          if (!stationMap.has(row.Station)) {
            stationMap.set(row.Station, {
              station_name: row.Station,
              current_level: parseFloat(row['Predicted Level (m)'] || 0),
              status: row.Status,
              predicted_level: parseFloat(row['Predicted Level (m)'] || 0),
              message_en: row['Message (English)'],
              message_si: row['පණිවිඩය (සිංහල)'],
              measured_at: row.Date,
              // Set thresholds based on status (approximate values)
              alert_level: row.Status === 'Normal' ? 2.5 : 2.0,
              minor_flood_level: row.Status === 'Minor Flood' || row.Status === 'Major Flood' ? 3.0 : 3.5,
              major_flood_level: row.Status === 'Major Flood' ? 4.0 : 4.5,
              tributary_name: 'Kelani Ganga'
            });
          }
        });
        
        setCurrentRiverLevels(Array.from(stationMap.values()));
      }
    } catch (error) {
      console.error("Error fetching current river levels:", error);
    } finally {
      setLoadingLevels(false);
    }
  };

  // Get unique station names from ML forecast data
  const getUniqueStations = () => {
    const uniqueNames = [...new Set(mlForecast.map(row => row.Station))];
    return uniqueNames.filter(name => name); // Remove any undefined/null values
  };

  const getRiskColor = (status) => {
    const colors = {
      "Major Flood": "bg-red-100 text-red-800 border-red-300",
      "Minor Flood": "bg-orange-100 text-orange-800 border-orange-300",
      "Alert": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Normal": "bg-green-100 text-green-800 border-green-300"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Major Flood": "🚨",
      "Minor Flood": "⚠️",
      "Alert": "⚡",
      "Normal": "✅"
    };
    return icons[status] || "ℹ️";
  };

  return (
    <>
      <Head>
        <title>7-Day Flood Predictions - Kelani Ganga</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <i className="fas fa-water text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Flood Risk Prediction System</h1>
                  <p className="text-blue-100 text-sm">
                    ML-Powered 7-Day Forecast
                  </p>
                </div>
              </div>

              <div className="flex space-x-6">
                <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link href="/alerts" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Alerts
                </Link>
                <Link href="/predictions" className="px-3 py-2 rounded-lg bg-blue-700 font-medium">
                  <i className="fas fa-chart-line mr-2"></i>Predictions
                </Link>
                <Link href="/safety-new" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-shield-alt mr-2"></i>Safety
                </Link>
                <Link href="/about-new" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-info-circle mr-2"></i>About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              <i className="fas fa-chart-line mr-3"></i>
              ML-Powered Flood Predictions
            </h2>
            <p className="text-blue-100">
              View 7-day forecasts from machine learning models
            </p>
          </div>

          {/* Current River Levels Cards */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-water text-blue-600 mr-2"></i>
                Current River Levels
              </h3>
              <button
                onClick={fetchCurrentRiverLevels}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            </div>

            {loadingLevels ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : currentRiverLevels.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <i className="fas fa-exclamation-circle text-gray-400 text-3xl mb-2"></i>
                <p className="text-gray-600">No current river level data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentRiverLevels.map((station, index) => {
                  const currentLevel = parseFloat(station.current_level || 0);
                  const alertLevel = parseFloat(station.alert_level || 0);
                  const minorFloodLevel = parseFloat(station.minor_flood_level || 0);
                  const majorFloodLevel = parseFloat(station.major_flood_level || 0);
                  
                  let statusColor = 'bg-green-500';
                  let statusText = 'Normal';
                  
                  if (currentLevel >= majorFloodLevel && majorFloodLevel > 0) {
                    statusColor = 'bg-red-500';
                    statusText = 'Major Flood';
                  } else if (currentLevel >= minorFloodLevel && minorFloodLevel > 0) {
                    statusColor = 'bg-orange-500';
                    statusText = 'Minor Flood';
                  } else if (currentLevel >= alertLevel && alertLevel > 0) {
                    statusColor = 'bg-yellow-500';
                    statusText = 'Alert';
                  }

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Station Header */}
                      <div className={`${statusColor} text-white p-4`}>
                        <h4 className="font-bold text-lg mb-1">{station.station_name}</h4>
                        <p className="text-sm opacity-90">{station.tributary_name || 'Kelani Ganga'}</p>
                      </div>

                      {/* Level Display */}
                      <div className="p-4">
                        <div className="flex items-baseline justify-center mb-3">
                          <span className="text-4xl font-bold text-gray-800">
                            {currentLevel.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-600 ml-2">meters</span>
                        </div>

                        {/* Status Badge */}
                        <div className="text-center mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            statusText === 'Major Flood' ? 'bg-red-100 text-red-800' :
                            statusText === 'Minor Flood' ? 'bg-orange-100 text-orange-800' :
                            statusText === 'Alert' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {statusText}
                          </span>
                        </div>

                        {/* Thresholds */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Alert Level:</span>
                            <span className="font-semibold text-gray-800">{alertLevel.toFixed(2)}m</span>
                          </div>
                          {minorFloodLevel > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Minor Flood:</span>
                              <span className="font-semibold text-gray-800">{minorFloodLevel.toFixed(2)}m</span>
                            </div>
                          )}
                        </div>

                        {/* Last Update */}
                        {station.measured_at && (
                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                            <i className="far fa-clock mr-1"></i>
                            {new Date(station.measured_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ML-Generated Forecast Data */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-brain text-purple-600 mr-2"></i>
                ML-Generated 7-Day Forecast
              </h3>
              <button
                onClick={() => setShowMLData(!showMLData)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {showMLData ? 'Hide Data' : 'Show Data'}
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Station
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              >
                <option value="All Stations">All Stations</option>
                {getUniqueStations().map((stationName, index) => (
                  <option key={index} value={stationName}>
                    {stationName}
                  </option>
                ))}
              </select>
            </div>

            {showMLData && mlForecast.length > 0 && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-purple-50 text-purple-900 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold border-b border-purple-200">Date</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-purple-200">Station</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-purple-200">Predicted Level (m)</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-purple-200">Status</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-purple-200">Message (English)</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-purple-200">පණිවිඩය (සිංහල)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {mlForecast
                      .filter(row => selectedStation === "All Stations" || row.Station === selectedStation)
                      .map((row, index) => (
                      <tr key={index} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-2">{row.Date}</td>
                        <td className="px-4 py-2 font-medium">{row.Station}</td>
                        <td className="px-4 py-2">{row['Predicted Level (m)']}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(row.Status)}`}>
                            {row.Status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs">{row['Message (English)']}</td>
                        <td className="px-4 py-2 text-xs">{row['පණිවිඩය (සිංහල)']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
