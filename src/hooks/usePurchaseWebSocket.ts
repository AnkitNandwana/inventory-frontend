import { useEffect, useState } from 'react';

interface PurchaseSuggestion {
  suggestion_id: number;
  product_name: string;
  sku: string;
  supplier: string;
  suggested_qty: number;
  total_cost: number;
  reason: string;
  delivered_at: string;
}

export const usePurchaseWebSocket = () => {
  const [suggestions, setSuggestions] = useState<PurchaseSuggestion[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/purchase-suggestions/?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Purchase WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'purchase_suggestion' && data.data) {
          const suggestionData = data.data;
          const newSuggestion = {
            suggestion_id: suggestionData.suggestion_id,
            product_name: suggestionData.product_name,
            sku: suggestionData.sku,
            supplier: suggestionData.supplier,
            suggested_qty: suggestionData.suggested_qty,
            total_cost: suggestionData.total_cost,
            reason: suggestionData.reason,
            delivered_at: data.delivered_at
          };
          setSuggestions(prev => [newSuggestion, ...prev.slice(0, 9)]);
        }
      } catch (error) {
        console.error('Error parsing purchase WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Purchase WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('Purchase WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const clearSuggestion = (id: number) => {
    setSuggestions(prev => prev.filter(suggestion => suggestion.suggestion_id !== id));
  };

  const clearAllSuggestions = () => {
    setSuggestions([]);
  };

  return { suggestions, isConnected, clearSuggestion, clearAllSuggestions };
};