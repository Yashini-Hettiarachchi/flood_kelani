import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { predictionsAPI, stationsAPI, waterLevelsAPI } from "../lib/api";

export default function Predictions() {
  const [mlForecast, setMlForecast] = useState([]);
  const [showMLData, setShowMLData] = useState(false);
  const [selectedStation, setSelectedStation] = useState("All Stations");
  const [stations, setStations] = useState([]);
  const [currentFloodRisk, setCurrentFloodRisk] = useState([]);
  const [loadingRisk, setLoadingRisk] = useState(true);

  useEffect(() => {
    fetchMLForecast();
    fetchStations();
    fetchCurrentFloodRisk();
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

  const fetchCurrentFloodRisk = async () => {
    try {
      setLoadingRisk(true);
      const result = await waterLevelsAPI.getLatest();
      
      if (result.success) {
        // Transform data to include risk level based on thresholds
        const transformedStations = result.data.map(station => {
          const currentLevel = parseFloat(station.current_level || 0);
          const alertLevel = parseFloat(station.alert_level || 0);
          const minorFloodLevel = parseFloat(station.minor_flood_level || 0);
          const majorFloodLevel = parseFloat(station.major_flood_level || 0);

          let riskLevel = 'LOW';
          let status = 'Normal';
          
          if (currentLevel >= majorFloodLevel && majorFloodLevel > 0) {
            riskLevel = 'CRITICAL';
            status = 'Major Flood';
          } else if (currentLevel >= minorFloodLevel && minorFloodLevel > 0) {
            riskLevel = 'HIGH';
            status = 'Minor Flood';
          } else if (currentLevel >= alertLevel && alertLevel > 0) {
            riskLevel = 'MEDIUM';
            status = 'Alert';
          }

          return {
            ...station,
            currentLevel,
            status,
            riskLevel
          };
        });
        
        setCurrentFloodRisk(transformedStations);
      }
    } catch (error) {
      console.error("Error fetching current flood risk:", error);
    } finally {
      setLoadingRisk(false);
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

  const getRiskLevelColor = (riskLevel) => {
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

          {/* Current Flood Risk Status Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <i className="fas fa-water text-blue-600 mr-3"></i>
                Current Status
              </h3>
              <button
                onClick={fetchCurrentFloodRisk}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            </div>

            {/* Today's Flood Risk Summary */}
            {!loadingRisk && currentFloodRisk.length > 0 && (
              <div className="mb-6">
                {(() => {
                  const criticalStations = currentFloodRisk.filter(s => s.riskLevel === 'CRITICAL');
                  const highRiskStations = currentFloodRisk.filter(s => s.riskLevel === 'HIGH');
                  const mediumRiskStations = currentFloodRisk.filter(s => s.riskLevel === 'MEDIUM');
                  const hasFloodRisk = criticalStations.length > 0 || highRiskStations.length > 0 || mediumRiskStations.length > 0;

                  if (criticalStations.length > 0) {
                    return (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className="fas fa-exclamation-circle text-4xl mr-4"></i>
                            <div>
                              <h4 className="text-2xl font-bold mb-1">⚠️ CRITICAL FLOOD RISK TODAY</h4>
                              <p className="text-red-100">
                                {criticalStations.length} station{criticalStations.length > 1 ? 's' : ''} reporting major flood conditions
                              </p>
                              <p className="text-sm mt-1 font-semibold">
                                Affected: {criticalStations.map(s => s.station_name).join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Today</div>
                            <div className="text-lg font-bold">{new Date().toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (highRiskStations.length > 0) {
                    return (
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className="fas fa-exclamation-triangle text-4xl mr-4"></i>
                            <div>
                              <h4 className="text-2xl font-bold mb-1">⚠️ HIGH FLOOD RISK TODAY</h4>
                              <p className="text-orange-100">
                                {highRiskStations.length} station{highRiskStations.length > 1 ? 's' : ''} at minor flood level
                              </p>
                              <p className="text-sm mt-1 font-semibold">
                                Affected: {highRiskStations.map(s => s.station_name).join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Today</div>
                            <div className="text-lg font-bold">{new Date().toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (mediumRiskStations.length > 0) {
                    return (
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className="fas fa-info-circle text-4xl mr-4"></i>
                            <div>
                              <h4 className="text-2xl font-bold mb-1">⚡ MODERATE FLOOD RISK TODAY</h4>
                              <p className="text-yellow-100">
                                {mediumRiskStations.length} station{mediumRiskStations.length > 1 ? 's' : ''} at alert level - monitor closely
                              </p>
                              <p className="text-sm mt-1 font-semibold">
                                Watch: {mediumRiskStations.map(s => s.station_name).join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Today</div>
                            <div className="text-lg font-bold">{new Date().toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className="fas fa-check-circle text-4xl mr-4"></i>
                            <div>
                              <h4 className="text-2xl font-bold mb-1">✅ NO FLOOD RISK TODAY</h4>
                              <p className="text-green-100">
                                All {currentFloodRisk.length} monitoring stations reporting normal water levels
                              </p>
                              <p className="text-sm mt-1">
                                All systems operating within safe parameters
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Today</div>
                            <div className="text-lg font-bold">{new Date().toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {loadingRisk ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-gray-300 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : currentFloodRisk.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <i className="fas fa-exclamation-circle text-gray-400 text-4xl mb-3"></i>
                <p className="text-gray-600">No current flood risk data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentFloodRisk.map((station, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
                  >
                    {/* Risk Level Header */}
                    <div className={`bg-gradient-to-r ${getRiskLevelColor(station.riskLevel)} p-4`}>
                      <div className="flex items-center justify-between text-white">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold">{station.station_name}</h4>
                          <p className="text-sm opacity-90">{station.tributary_name || 'Kelani Ganga'}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {parseFloat(station.current_level || 0).toFixed(2)}
                          </div>
                          <div className="text-xs opacity-90">meters</div>
                        </div>
                      </div>
                    </div>

                    {/* Station Details */}
                    <div className="p-4">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getStatusIcon(station.status)}</span>
                          <span className="font-semibold text-gray-700">{station.status}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          station.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          station.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          station.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {station.riskLevel} RISK
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Water Level</span>
                          <span>{parseFloat(station.percent_of_alert || 0).toFixed(1)}% of Alert</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              station.riskLevel === 'CRITICAL' ? 'bg-red-600' :
                              station.riskLevel === 'HIGH' ? 'bg-orange-500' :
                              station.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(parseFloat(station.percent_of_alert || 0), 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 text-xs">Alert Level</p>
                          <p className="font-bold text-gray-900">
                            {parseFloat(station.alert_level || 0).toFixed(2)}m
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 text-xs">Minor Flood</p>
                          <p className="font-bold text-gray-900">
                            {station.minor_flood_level ? parseFloat(station.minor_flood_level).toFixed(2) + 'm' : 'N/A'}
                          </p>
                        </div>
                        {station.rainfall_6hr !== null && station.rainfall_6hr !== undefined && (
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
                      {station.trend && station.trend !== 'UNKNOWN' && station.trend !== 'Stable' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center text-sm">
                            <i className={`fas ${
                              station.trend === 'RISING' || station.trend === 'Rising' ? 'fa-arrow-up text-red-500' :
                              station.trend === 'FALLING' || station.trend === 'Falling' ? 'fa-arrow-down text-green-500' :
                              'fa-arrows-alt-h text-gray-500'
                            } mr-2`}></i>
                            <span className="text-gray-600">
                              Trend: <span className="font-semibold">{station.trend}</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Last Update */}
                      {station.measured_at && (
                        <div className="mt-3 text-xs text-gray-500 text-center">
                          <i className="far fa-clock mr-1"></i>
                          Updated: {new Date(station.measured_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
