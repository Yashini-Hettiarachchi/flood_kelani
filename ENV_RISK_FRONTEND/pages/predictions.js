import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { predictionsAPI, stationsAPI } from "../lib/api";

export default function Predictions() {
  const [mlForecast, setMlForecast] = useState([]);
  const [showMLData, setShowMLData] = useState(false);
  const [selectedStation, setSelectedStation] = useState("All Stations");
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchMLForecast();
    fetchStations();
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
