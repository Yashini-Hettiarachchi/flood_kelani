import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SevenDayAnalysisChart() {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecastData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchForecastData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/predictions/ml-forecast');
      const data = await response.json();
      
      if (data.success) {
        setForecastData(data.data);
        setError(null);
      } else {
        setError('Failed to load forecast data');
      }
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      setError('Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  const getStationColor = (stationName) => {
    const colors = {
      'Nagalagam Street': 'rgb(239, 68, 68)',
      'Hanwella': 'rgb(59, 130, 246)',
      'Glencourse': 'rgb(34, 197, 94)',
      'Kitulgala': 'rgb(168, 85, 247)',
      'Holombuwa': 'rgb(251, 146, 60)',
      'Norwood': 'rgb(236, 72, 153)',
      'Deraniyagala': 'rgb(14, 165, 233)'
    };
    return colors[stationName] || 'rgb(100, 116, 139)';
  };

  const prepareChartData = () => {
    if (!forecastData || forecastData.length === 0) return null;

    // Group data by station
    const stationData = {};
    forecastData.forEach((item) => {
      if (!stationData[item.Station]) {
        stationData[item.Station] = [];
      }
      stationData[item.Station].push({
        date: item.Date,
        level: parseFloat(item['Predicted Level (m)']),
        status: item.Status
      });
    });

    // Get all unique dates
    const allDates = [...new Set(forecastData.map(item => item.Date))].sort();

    // Create datasets for each station
    const datasets = Object.keys(stationData).map((stationName) => {
      const data = allDates.map((date) => {
        const entry = stationData[stationName].find(d => d.date === date);
        return entry ? entry.level : null;
      });

      return {
        label: stationName,
        data: data,
        borderColor: getStationColor(stationName),
        backgroundColor: getStationColor(stationName).replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false
      };
    });

    return {
      labels: allDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: datasets
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: '7-Day Water Level Forecast - All Stations',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(3) + ' m';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Water Level (meters)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const getStationStats = () => {
    if (!forecastData || forecastData.length === 0) return null;

    const stats = {};
    forecastData.forEach((item) => {
      if (!stats[item.Status]) {
        stats[item.Status] = 0;
      }
      stats[item.Status]++;
    });

    return stats;
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'Normal': 'bg-green-100 text-green-800 border-green-200',
      'Alert': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Minor Flood': 'bg-orange-100 text-orange-800 border-orange-200',
      'Major Flood': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-red-600">
          <i className="fas fa-exclamation-triangle text-4xl mb-3"></i>
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={fetchForecastData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();
  const stats = getStationStats();

  if (!chartData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-600">
          <i className="fas fa-chart-line text-4xl mb-3"></i>
          <p className="text-lg">No forecast data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          <i className="fas fa-chart-line text-blue-600 mr-2"></i>
          7-Day Forecast Analysis
        </h2>
        <div className="text-sm text-gray-500">
          <i className="fas fa-sync-alt mr-2"></i>
          Auto-updates every 30 minutes
        </div>
      </div>

      {/* Status Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(stats).map(([status, count]) => (
            <div
              key={status}
              className={`border-2 rounded-lg p-3 text-center ${getStatusBadgeColor(status)}`}
            >
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs font-medium mt-1">{status} Predictions</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="h-96">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Legend Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              <i className="fas fa-info-circle text-blue-600 mr-2"></i>
              About This Chart
            </h3>
            <p className="text-gray-600">
              This chart displays the predicted water levels for all monitoring stations
              over the next 7 days based on ML forecasting models.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              <i className="fas fa-broadcast-tower text-blue-600 mr-2"></i>
              Monitoring Stations
            </h3>
            <p className="text-gray-600">
              {Object.keys(forecastData.reduce((acc, item) => ({ ...acc, [item.Station]: true }), {})).length} stations
              actively monitored with real-time forecasting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
