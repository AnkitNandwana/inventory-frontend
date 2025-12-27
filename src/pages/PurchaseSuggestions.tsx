import { useState, useEffect } from 'react';
import { purchaseSuggestionService } from '../services/apiService';

interface PurchaseSuggestion {
  id: number;
  product: { name: string; sku: string };
  supplier: { name: string };
  suggestedQty: number;
  unitCost: number;
  totalCost: number;
  reason: string;
  status: string;
  createdAt: string;
}

interface PurchaseSuggestionsProps {
  purchaseData: {
    suggestions: any[];
    isConnected: boolean;
    clearSuggestion: (id: number) => void;
    clearAllSuggestions: () => void;
  };
}

export default function PurchaseSuggestions({ purchaseData }: PurchaseSuggestionsProps) {
  const { isConnected, suggestions: wsMessages } = purchaseData;
  const [pendingSuggestions, setPendingSuggestions] = useState<PurchaseSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadPendingSuggestions();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (wsMessages.length > 0) {
      loadPendingSuggestions();
    }
  }, [wsMessages]);

  const loadPendingSuggestions = async () => {
    try {
      setLoading(true);
      const data = await purchaseSuggestionService.getPending(currentPage, itemsPerPage);
      const result = data.purchaseSuggestions;
      setPendingSuggestions(result.suggestions || []);
      setTotalCount(result.totalCount || 0);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (suggestionId: number) => {
    try {
      await purchaseSuggestionService.approve(suggestionId, 1);
      await loadPendingSuggestions();
    } catch (error) {
      console.error('Error approving suggestion:', error);
    }
  };

  const handleReject = async (suggestionId: number) => {
    try {
      await purchaseSuggestionService.reject(suggestionId, 1);
      await loadPendingSuggestions();
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchase Suggestions</h2>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <button onClick={loadPendingSuggestions} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Loading suggestions...</p>
        </div>
      ) : totalCount === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Purchase Suggestions</h3>
          <p className="text-gray-500">All suggestions have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-lg shadow border-l-4 border-blue-500 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      📦 PURCHASE SUGGESTION
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(suggestion.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{suggestion.product.name}</h3>
                  <p className="text-gray-600 mb-3">SKU: {suggestion.product.sku}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Suggested Qty</p>
                      <p className="text-2xl font-bold text-blue-800">{suggestion.suggestedQty}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Total Cost</p>
                      <p className="text-2xl font-bold text-green-800">${suggestion.totalCost}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Supplier</p>
                      <p className="text-lg font-bold text-gray-800">{suggestion.supplier.name}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 font-medium">{suggestion.reason}</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleApprove(suggestion.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(suggestion.id)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {totalCount > 0 && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount} suggestions
          </div>
          <div className="flex items-center gap-4">
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-3 py-2 border rounded-lg">
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}