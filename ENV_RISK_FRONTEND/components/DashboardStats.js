import { useEffect, useState } from 'react';
import moment from 'moment';
import { dashboardAPI, alertsAPI } from '../lib/api';

export default function DashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await dashboardAPI.getOverview();
      
      if (result.success) {
        // Transform data to match component expectations
        const transformedData = {
          totalStations: result.data.stats.totalStations,
          activeAlerts: result.data.stats.activeAlerts,
          monitoringPoints: result.data.stats.monitoringPoints,
          lastUpdate: new Date().toISOString(),
          status: result.data.activeAlerts.length > 0 ? 'warning' : 'normal'
        };
        setData(transformedData);
        setError(null);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div className="flex items-center text-red-800">
          <i className="fas fa-exclamation-triangle text-2xl mr-3"></i>
          <div>
            <h3 className="font-bold">Error Loading Dashboard Data</h3>
            <p className="text-sm">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = data.statistics || {};
  const latestReport = data.latest_report || {};

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Stations */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-broadcast-tower text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Total Stations</p>
              <p className="text-3xl font-bold">{stats.total_stations || 0}</p>
            </div>
          </div>
          <div className="text-sm text-blue-100">Colombo District</div>
        </div>

        {/* Normal Status */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Normal</p>
              <p className="text-3xl font-bold">{stats.normal_count || 0}</p>
            </div>
          </div>
          <div className="text-sm text-green-100">Stations safe</div>
        </div>

        {/* Alert/Warning */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm">Alert</p>
              <p className="text-3xl font-bold">
                {(stats.alert_count || 0) + (stats.flood_count || 0)}
              </p>
            </div>
          </div>
          <div className="text-sm text-orange-100">Requires attention</div>
        </div>

        {/* Total Rainfall */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-cloud-rain text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">Total Rainfall</p>
              <p className="text-3xl font-bold">{parseFloat(stats.total_rainfall || 0).toFixed(0)}</p>
            </div>
          </div>
          <div className="text-sm text-purple-100">mm (6hr period)</div>
        </div>
      </div>

      {/* Last Update Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-info-circle text-blue-600 text-xl mr-3"></i>
            <div>
              <p className="font-semibold text-blue-900">
                Today: {latestReport.report_title}
              </p>
              <p className="text-sm text-blue-700">
                {moment(latestReport.report_date).format('MMMM D, YYYY')} 
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`}></i>
            Refresh
          </button>
        </div>
      </div>
    </>
  );
}
