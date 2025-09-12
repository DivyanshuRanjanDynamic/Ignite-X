import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, CheckCircle, AlertCircle, RefreshCw, 
  Database, Cpu, TrendingUp, Info
} from 'lucide-react';
import api from '../api/client.js';

const MLStatusIndicator = ({ userId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMLStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/ml-status/status');
      const data = response.data;

      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.error || 'Failed to fetch ML status');
      }
    } catch (err) {
      console.error('ML Status fetch error:', err);
      setError('Failed to connect to ML status service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMLStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchMLStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Checking ML service status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-4 border border-red-200">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">ML Service Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { service, testResults, dataFlow } = status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    >
      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">ML Service</span>
          </div>
          <div className="flex items-center space-x-2">
            {service.available ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Active</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MLStatusIndicator;
