import { useEffect, useState } from 'react';

interface StockAlert {
  id: number;
  product: {
    name: string;
    sku: string;
    currentStock: number;
    lowStockThreshold: number;
  };
  message: string;
  timestamp: string;
}

export const useWebSocket = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/stock-alerts/?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('Raw WebSocket event:', event);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed WebSocket data:', data);
        
        if (data.type === 'stock_alert' && data.data) {
          console.log('Processing stock alert:', data.data);
          const alertData = data.data;
          const newAlert = {
            id: alertData.product_id || Date.now(),
            product: {
              name: alertData.product_name,
              sku: alertData.sku,
              currentStock: alertData.current_stock,
              lowStockThreshold: alertData.threshold
            },
            message: `${alertData.product_name} (${alertData.sku}) is running low - Only ${alertData.current_stock} left!`,
            timestamp: alertData.timestamp
          };
          console.log('Final alert to display:', newAlert);
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const clearAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return { alerts, isConnected, clearAlert, clearAllAlerts };
};