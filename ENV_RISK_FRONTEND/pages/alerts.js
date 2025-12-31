import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { alertsAPI } from "../lib/api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, acknowledged
  const [severityFilter, setSeverityFilter] = useState("all");

  useEffect(() => {
    fetchAlerts();
    // Auto-refresh every minute
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let result;
      
      if (filter === "active") {
        result = await alertsAPI.getActive();
      } else {
        const filters = {};
        if (filter === "acknowledged") {
          filters.acknowledged = true;
        }
        if (severityFilter !== "all") {
          filters.severity = severityFilter;
        }
        result = await alertsAPI.getAll(filters);
      }

      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await alertsAPI.acknowledge(alertId);
      // Refresh alerts
      fetchAlerts();
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const handleDeactivate = async (alertId) => {
    if (confirm("Are you sure you want to deactivate this alert?")) {
      try {
        await alertsAPI.deactivate(alertId);
        // Refresh alerts
        fetchAlerts();
      } catch (error) {
        console.error("Error deactivating alert:", error);
      }
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Critical: "bg-red-100 border-red-500 text-red-900",
      High: "bg-orange-100 border-orange-500 text-orange-900",
      Medium: "bg-yellow-100 border-yellow-500 text-yellow-900",
      Low: "bg-blue-100 border-blue-500 text-blue-900"
    };
    return colors[severity] || "bg-gray-100 border-gray-500 text-gray-900";
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      Critical: "🚨",
      High: "⚠️",
      Medium: "⚡",
      Low: "ℹ️"
    };
    return icons[severity] || "ℹ️";
  };

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== "all" && alert.severity !== severityFilter) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Head>
        <title>Flood Alerts - Kelani Ganga</title>
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
                    Active Alerts & Warnings
                  </p>
                </div>
              </div>

              <div className="flex space-x-6">
                <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link href="/alerts" className="px-3 py-2 rounded-lg bg-blue-700 font-medium">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Alerts
                </Link>
                <Link href="/predictions" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
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
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              <i className="fas fa-exclamation-triangle mr-3"></i>
              Flood Alerts & Warnings
            </h2>
            <p className="text-red-100">
              Real-time alerts for Kelani Ganga monitoring stations
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Status
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Alerts</option>
                  <option value="active">Active Only</option>
                  <option value="acknowledged">Acknowledged</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Stats */}
              <div className="flex items-end">
                <div className="bg-blue-50 rounded-lg p-3 w-full">
                  <div className="text-sm text-blue-600 font-medium">Total Alerts</div>
                  <div className="text-2xl font-bold text-blue-900">{filteredAlerts.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && alerts.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Loading alerts...</p>
            </div>
          )}

          {/* Alerts List */}
          {!loading && filteredAlerts.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <i className="fas fa-check-circle text-5xl text-green-600 mb-4"></i>
              <h3 className="text-xl font-bold text-green-900 mb-2">All Clear!</h3>
              <p className="text-green-700">No active flood alerts at this time.</p>
            </div>
          )}

          {filteredAlerts.length > 0 && (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-lg p-6 shadow-lg ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{getSeverityIcon(alert.severity)}</div>
                      <div>
                        <h3 className="text-xl font-bold">{alert.title}</h3>
                        <p className="text-sm opacity-75">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {alert.Station?.station_name || "Unknown Station"} • 
                          <i className="fas fa-clock ml-2 mr-1"></i>
                          {new Date(alert.issued_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white bg-opacity-50">
                        {alert.severity}
                      </span>
                      {alert.is_active && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                          Active
                        </span>
                      )}
                      {alert.acknowledged && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500 text-white">
                          Acknowledged
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-semibold mb-2">
                        <i className="fas fa-language mr-2"></i>English
                      </p>
                      <p className="text-sm">{alert.message_en}</p>
                    </div>
                    {alert.message_si && (
                      <div>
                        <p className="font-semibold mb-2">
                          <i className="fas fa-language mr-2"></i>සිංහල
                        </p>
                        <p className="text-sm">{alert.message_si}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-current opacity-75">
                    <div className="text-sm">
                      <i className="fas fa-tag mr-2"></i>
                      Type: {alert.alert_type}
                      {alert.expires_at && (
                        <>
                          <i className="fas fa-hourglass-end ml-4 mr-2"></i>
                          Expires: {new Date(alert.expires_at).toLocaleString()}
                        </>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {!alert.acknowledged && alert.is_active && (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-4 py-2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-lg text-sm font-medium transition-colors"
                        >
                          <i className="fas fa-check mr-2"></i>
                          Acknowledge
                        </button>
                      )}
                      {alert.is_active && (
                        <button
                          onClick={() => handleDeactivate(alert.id)}
                          className="px-4 py-2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-lg text-sm font-medium transition-colors"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
