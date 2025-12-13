import { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export default function NotificationBox() {
  const { alerts, isConnected, clearAlert, clearAllAlerts } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 17h5l-5 5v-5zM11 19H6.414a1 1 0 01-.707-.293L2 15V9a1 1 0 01.293-.707L6 4.586A1 1 0 016.414 4H11v15z" />
        </svg>
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
        <div className={`absolute top-0 right-0 w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Stock Alerts</h3>
            <div className="flex gap-2">
              {alerts.length > 0 && (
                <button onClick={clearAllAlerts} className="text-xs text-red-600 hover:text-red-800 cursor-pointer">
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                ✕
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No stock alerts
              </div>
            ) : (
              alerts.filter(alert => alert && alert.product).map((alert) => (
                <div key={alert.id} className="p-4 border-b hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        <span className="font-medium text-sm text-red-700">Low Stock Alert</span>
                      </div>
                      <div className="mb-2">
                        <p className="font-semibold text-sm text-gray-800">{alert.product?.name || 'Unknown Product'}</p>
                        <p className="text-xs text-gray-500 mb-1">SKU: {alert.product?.sku || 'N/A'}</p>
                        <p className="text-sm text-orange-600 font-medium">
                          Only {alert.product?.currentStock || 0} left in stock!
                        </p>
                        <p className="text-xs text-gray-500">
                          Threshold: {alert.product?.lowStockThreshold || 0} units
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'No timestamp'}
                      </div>
                    </div>
                    <button
                      onClick={() => clearAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}