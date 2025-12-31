import { useEffect, useState } from 'react';

export default function FloodAPIComparison() {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComparison();
    // Refresh every 5 minutes
    const interval = setInterval(fetchComparison, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/external-flood/comparison');
      const data = await response.json();
      
      if (data.success) {
        setComparison(data.data);
        setError(null);
      } else {
        setError('Failed to load comparison data');
      }
    } catch (err) {
      console.error('Error fetching comparison:', err);
      setError('Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (prediction) => {
    const pred = prediction.toLowerCase();
    if (pred.includes('emergency') || pred.includes('critical')) return 'red';
    if (pred.includes('warning') || pred.includes('high')) return 'orange';
    if (pred.includes('watch') || pred.includes('medium')) return 'yellow';
    return 'green';
  };

  const getStatusBg = (prediction) => {
    const color = getStatusColor(prediction);
    return `bg-${color}-50 border-${color}-200`;
  };

  const getStatusText = (prediction) => {
    const color = getStatusColor(prediction);
    return `text-${color}-700`;
  };

  if (loading && !comparison) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Multi-Source Flood Analysis</h3>
        <p className="text-gray-500">Loading comparison data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Multi-Source Flood Analysis</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Multi-Source Flood Analysis</h3>
        <button 
          onClick={fetchComparison}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Consensus Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Consensus Prediction</p>
            <p className="text-2xl font-bold text-blue-900">{comparison.consensus}</p>
          </div>
          <div className="text-right">
            <i className="fas fa-check-double text-3xl text-blue-500"></i>
          </div>
        </div>
      </div>

      {/* Individual Sources */}
      <div className="space-y-3">
        {comparison.sources.map((source, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  {source.name.includes('ML Model') && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{source.coverage}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  getStatusColor(source.prediction) === 'green' ? 'text-green-600' :
                  getStatusColor(source.prediction) === 'yellow' ? 'text-yellow-600' :
                  getStatusColor(source.prediction) === 'orange' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {source.prediction}
                </p>
                <p className="text-xs text-gray-500">{(source.confidence * 100).toFixed(0)}% confidence</p>
              </div>
            </div>
            
            {/* Progress bar for confidence */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    source.confidence >= 0.9 ? 'bg-green-500' :
                    source.confidence >= 0.8 ? 'bg-blue-500' :
                    source.confidence >= 0.7 ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${source.confidence * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              <i className="far fa-clock mr-1"></i>
              Updates every {source.nextUpdate}
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          <i className="fas fa-info-circle mr-1"></i>
          Combining multiple data sources for more accurate flood predictions
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Last updated: {new Date(comparison.lastUpdate).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
