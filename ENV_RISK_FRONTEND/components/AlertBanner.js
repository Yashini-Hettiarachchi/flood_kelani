import { useEffect, useState } from 'react';
import { alertsAPI } from '../lib/api';

export default function AlertBanner() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const result = await alertsAPI.getActive();
      if (result.success) {
        // Transform alert data to match component expectations
        const transformedAlerts = result.data.map(alert => ({
          id: alert.id,
          level: alert.severity,
          title: alert.alert_type,
          message: alert.message_en,
          station: alert.station_name || 'Unknown',
          time: alert.issued_at,
          type: alert.alert_type
        }));
        setAlerts(transformedAlerts);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      // Set empty alerts on error to prevent continuous loading
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level) => {
    const colors = {
      'Critical': 'bg-red-600 border-red-800 text-white',
      'High': 'bg-orange-500 border-orange-700 text-white',
      'Medium': 'bg-yellow-400 border-yellow-600 text-gray-900',
      'Low': 'bg-blue-400 border-blue-600 text-white',
      'Normal': 'bg-green-100 border-green-500 text-green-800'
    };
    return colors[level] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getAlertIcon = (level) => {
    const icons = {
      'Critical': '🚨',
      'High': '⚠️',
      'Medium': '⚡',
      'Low': 'ℹ️',
      'Normal': '✓'
    };
    return icons[level] || 'ℹ️';
  };

  const getCriticalCount = () => {
    return alerts.filter(a => a.level === 'Critical' || a.level === 'High').length;
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold text-green-800">All Clear</p>
              <p className="text-sm text-green-700">No active flood alerts</p>
            </div>
          </div>
          <button
            onClick={fetchAlerts}
            className="text-green-600 hover:text-green-800"
            title="Refresh alerts"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Summary Header */}
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="font-bold text-red-800">
                {getCriticalCount() > 0 ? `${getCriticalCount()} Critical/High Alert${getCriticalCount() > 1 ? 's' : ''}` : `${alerts.length} Active Alert${alerts.length > 1 ? 's' : ''}`}
              </p>
              <p className="text-sm text-red-700">
                {alerts.length} monitoring station{alerts.length > 1 ? 's' : ''} affected
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAlerts}
              className="text-red-600 hover:text-red-800 px-2"
              title="Refresh alerts"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-red-600 hover:text-red-800 px-2"
              title={collapsed ? "Expand alerts" : "Collapse alerts"}
            >
              <i className={`fas fa-chevron-${collapsed ? 'down' : 'up'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Individual Alerts */}
      {!collapsed && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.level)}`}
              role="alert"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-2xl">{getAlertIcon(alert.level)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-lg">{alert.level}</p>
                      <span className="text-sm opacity-75">• {alert.station}</span>
                    </div>
                    <p className="mb-2">{alert.message}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="opacity-75">Current: </span>
                        <span className="font-semibold">{alert.waterLevel}m</span>
                      </div>
                      <div>
                        <span className="opacity-75">Normal: </span>
                        <span className="font-semibold">{alert.normalLevel}m</span>
                      </div>
                      <div>
                        <span className="opacity-75">Above: </span>
                        <span className="font-semibold">+{alert.deviation}m</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs opacity-75">
                      <i className="fas fa-clock mr-1"></i>
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="text-center">
        <a
          href="/alerts"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          View All Alerts & Details
          <i className="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </div>
  );
}
