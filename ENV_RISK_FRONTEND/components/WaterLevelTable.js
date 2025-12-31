import { useEffect, useState } from 'react';
import moment from 'moment';

export default function WaterLevelTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/river-basins/kelani/daily-forecast?days=7');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
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

  const formatDate = (dateString) => {
    const date = moment(dateString);
    const today = moment().startOf('day');
    
    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(today.clone().add(1, 'day'), 'day')) {
      return 'Tomorrow';
    } else {
      return date.format('ddd');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p className="text-gray-600">Loading water level data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-lg p-8">
        <div className="flex items-center text-red-800">
          <i className="fas fa-exclamation-triangle text-2xl mr-3"></i>
          <div>
            <h3 className="font-bold">Error Loading Data</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <i className="fas fa-chart-line mr-3"></i>
          Kelani Ganga Water Level Monitoring
        </h2>
        <p className="text-blue-100 mt-1">Real-time data from 7 monitoring stations in Colombo District</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Day
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
            {data.map((row, index) => {
              const nagalagam = row.stations?.Nagalagam || {};
              const hanwella = row.stations?.Hanwella || {};
              const glencourse = row.stations?.Glencourse || {};
              const kithulgala = row.stations?.Kithulgala || {};
              const holombuwa = row.stations?.Holombuwa || {};
              const deraniyagala = row.stations?.Deraniyagala || {};
              const norwood = row.stations?.Norwood || {};
              
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {moment(row.report_date).format('YYYY-MM-DD')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {moment(row.report_time, 'HH:mm:ss').format('h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      formatDate(row.report_date) === 'Today' 
                        ? 'text-blue-600' 
                        : 'text-gray-900'
                    }`}>
                      {formatDate(row.report_date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(nagalagam.risk_level)
                      }`}>
                        {nagalagam.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {nagalagam.water_level ? parseFloat(nagalagam.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(hanwella.risk_level)
                      }`}>
                        {hanwella.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {hanwella.water_level ? parseFloat(hanwella.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(glencourse.risk_level)
                      }`}>
                        {glencourse.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {glencourse.water_level ? parseFloat(glencourse.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(kithulgala.risk_level)
                      }`}>
                        {kithulgala.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {kithulgala.water_level ? parseFloat(kithulgala.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(holombuwa.risk_level)
                      }`}>
                        {holombuwa.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {holombuwa.water_level ? parseFloat(holombuwa.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(deraniyagala.risk_level)
                      }`}>
                        {deraniyagala.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {deraniyagala.water_level ? parseFloat(deraniyagala.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getRiskBadgeColor(norwood.risk_level)
                      }`}>
                        {norwood.risk_level || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {norwood.water_level ? parseFloat(norwood.water_level).toFixed(2) : '-'}m
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <i className="fas fa-inbox text-4xl mb-4"></i>
          <p>No water level data available</p>
        </div>
      )}

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
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
            <i className="fas fa-sync-alt mr-2"></i>
            Last updated: {data[0] ? moment(data[0].report_date).format('MMM D, YYYY') : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
