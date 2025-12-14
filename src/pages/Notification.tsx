interface NotificationProps {
  webSocketData: {
    alerts: any[];
    isConnected: boolean;
    clearAlert: (id: number) => void;
    clearAllAlerts: () => void;
  };
}

export default function Notification({ webSocketData }: NotificationProps) {
  const { alerts, isConnected, clearAlert, clearAllAlerts } = webSocketData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock Alerts</h2>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          {alerts.length > 0 && (
            <button onClick={clearAllAlerts} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer">
              Clear All
            </button>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Stock Alerts</h3>
          <p className="text-gray-500">All products are above their stock thresholds.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.filter(alert => alert && alert.product).map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow border-l-4 border-red-500 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      🚨 LOW STOCK
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{alert.product.name}</h3>
                  <p className="text-gray-600 mb-3">SKU: {alert.product.sku}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Current Stock</p>
                      <p className="text-2xl font-bold text-orange-800">{alert.product.currentStock}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Threshold</p>
                      <p className="text-2xl font-bold text-gray-800">{alert.product.lowStockThreshold}</p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 font-medium">{alert.message}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => clearAlert(alert.id)}
                  className="ml-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}