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
        // Calculate statistics from the water levels data
        const waterLevels = result.data.latestWaterLevels || [];
        const normalCount = waterLevels.filter(w => w.status === 'Normal').length;
        const alertCount = waterLevels.filter(w => w.status === 'Alert').length;
        const minorFloodCount = waterLevels.filter(w => w.status === 'Minor Flood').length;
        const majorFloodCount = waterLevels.filter(w => w.status === 'Major Flood').length;
        const totalRainfall = waterLevels.reduce((sum, w) => sum + (parseFloat(w.rainfall) || 0), 0);

        // Transform data to match component expectations
        const transformedData = {
          statistics: {
            total_stations: result.data.stats.totalStations || 0,
            normal_count: normalCount,
            alert_count: alertCount,
            minor_flood_count: minorFloodCount,
            major_flood_count: majorFloodCount,
            flood_count: minorFloodCount + majorFloodCount,
            total_rainfall: totalRainfall
          },
          latest_report: {
            report_title: `${waterLevels.length} Stations Active`,
            report_date: new Date().toISOString()
          },
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
