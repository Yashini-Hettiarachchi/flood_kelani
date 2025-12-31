// API Base URL - Update this based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ========================================
// STATIONS API
// ========================================

export const stationsAPI = {
  /**
   * Get all stations
   */
  getAll: async () => {
    return apiRequest('/stations');
  },

  /**
   * Get station by ID
   */
  getById: async (id) => {
    return apiRequest(`/stations/${id}`);
  },

  /**
   * Create new station
   */
  create: async (stationData) => {
    return apiRequest('/stations', {
      method: 'POST',
      body: JSON.stringify(stationData),
    });
  },

  /**
   * Update station
   */
  update: async (id, stationData) => {
    return apiRequest(`/stations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stationData),
    });
  },
};

// ========================================
// WATER LEVELS API
// ========================================

export const waterLevelsAPI = {
  /**
   * Get latest water levels for all stations
   */
  getLatest: async () => {
    return apiRequest('/water-levels/latest');
  },

  /**
   * Get water levels by station ID
   */
  getByStation: async (stationId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/water-levels/station/${stationId}?${queryParams}`);
  },

  /**
   * Get historical data for charts
   */
  getHistory: async (stationId, days = 7) => {
    return apiRequest(`/water-levels/history/${stationId}?days=${days}`);
  },

  /**
   * Add new water level reading
   */
  add: async (readingData) => {
    return apiRequest('/water-levels', {
      method: 'POST',
      body: JSON.stringify(readingData),
    });
  },
};

// ========================================
// PREDICTIONS API
// ========================================

export const predictionsAPI = {
  /**
   * Get all forecasts
   */
  getAllForecasts: async (days = 7) => {
    return apiRequest(`/predictions/forecasts?days=${days}`);
  },

  /**
   * Get forecast by station
   */
  getForecastByStation: async (stationId, days = 7) => {
    return apiRequest(`/predictions/forecast/${stationId}?days=${days}`);
  },

  /**
   * Generate single prediction
   */
  predict: async (predictionData) => {
    return apiRequest('/predictions/predict', {
      method: 'POST',
      body: JSON.stringify(predictionData),
    });
  },

  /**
   * Generate multi-day forecast
   */
  forecast: async (forecastData) => {
    return apiRequest('/predictions/forecast', {
      method: 'POST',
      body: JSON.stringify(forecastData),
    });
  },

  /**
   * Get ML-generated 7-day forecast from CSV
   */
  getMLForecast: async () => {
    return apiRequest('/predictions/ml-forecast');
  },

  /**
   * Get station-specific CSV data
   */
  getStationData: async (stationName) => {
    return apiRequest(`/predictions/station-data/${encodeURIComponent(stationName)}`);
  },
};

// ========================================
// ALERTS API
// ========================================

export const alertsAPI = {
  /**
   * Get all active alerts
   */
  getAll: async () => {
    return apiRequest('/alerts');
  },

  /**
   * Get active alerts only (alias for compatibility)
   */
  getActive: async () => {
    return apiRequest('/alerts');
  },

  /**
   * Get alerts by station
   */
  getByStation: async (stationId) => {
    return apiRequest(`/alerts/station/${stationId}`);
  },

  /**
   * Create new alert
   */
  create: async (alertData) => {
    return apiRequest('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  /**
   * Deactivate alert
   */
  deactivate: async (id) => {
    return apiRequest(`/alerts/${id}/deactivate`, {
      method: 'PUT',
    });
  },

  /**
   * Delete alert
   */
  delete: async (id) => {
    return apiRequest(`/alerts/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========================================
// USERS API
// ========================================

export const usersAPI = {
  /**
   * Get all users
   */
  getAll: async () => {
    return apiRequest('/users');
  },

  /**
   * Get user by ID
   */
  getById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update user
   */
  update: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete user
   */
  delete: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========================================
// DASHBOARD API (Combined data)
// ========================================

export const dashboardAPI = {
  /**
   * Get dashboard overview data
   */
  getOverview: async () => {
    try {
      // Fetch multiple endpoints in parallel
      const [stationsRes, latestLevelsRes, activeAlertsRes, forecastsRes] = await Promise.all([
        stationsAPI.getAll(),
        waterLevelsAPI.getLatest(),
        alertsAPI.getActive(),
        predictionsAPI.getAllForecasts(7),
      ]);

      return {
        success: true,
        data: {
          stations: stationsRes.data || [],
          latestWaterLevels: latestLevelsRes.data || [],
          activeAlerts: activeAlertsRes.data || [],
          forecasts: forecastsRes.data || [],
          stats: {
            totalStations: (stationsRes.data || []).length,
            activeAlerts: (activeAlertsRes.data || []).length,
            monitoringPoints: (latestLevelsRes.data || []).length,
            criticalStations: (latestLevelsRes.data || []).filter(l => l.status === 'Major Flood' || l.status === 'Minor Flood').length,
          },
        },
      };
    } catch (error) {
      console.error('Dashboard API Error:', error);
      throw error;
    }
  },
};

// ========================================
// HEALTH CHECK
// ========================================

export const healthAPI = {
  /**
   * Check API health
   */
  check: async () => {
    return apiRequest('/health', { method: 'GET' });
  },
};

export default {
  stations: stationsAPI,
  waterLevels: waterLevelsAPI,
  predictions: predictionsAPI,
  alerts: alertsAPI,
  users: usersAPI,
  dashboard: dashboardAPI,
  health: healthAPI,
};
