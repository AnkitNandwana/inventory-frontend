import { useState, useEffect } from 'react';
import { inventoryService, productService } from '../services/apiService';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'lots'>('transactions');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stockLots, setStockLots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'transaction' | 'lot'>('transaction');
  const [formData, setFormData] = useState({
    productId: '', qty: '', type: 'IN', referenceType: 'Purchase', unitCost: '', note: '', reference: ''
  });

  useEffect(() => {
    loadData();
    loadProducts();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'transactions') {
      const data = await inventoryService.getTransactions();
      setTransactions(data.inventoryTransactions);
    } else {
      const data = await inventoryService.getStockLots();
      setStockLots(data.stockLots);
    }
  };

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data.products);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'transaction') {
        await inventoryService.createTransaction(formData);
      } else {
        await inventoryService.createStockLot(formData);
      }
      loadData();
      resetForm();
    } catch (error) {
      alert('Error creating record');
    }
  };

  const openModal = (type: 'transaction' | 'lot') => {
    setModalType(type);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ productId: '', qty: '', type: 'IN', referenceType: 'Purchase', unitCost: '', note: '', reference: '' });
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex gap-2">
          <button onClick={() => openModal('transaction')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Add Transaction
          </button>
          <button onClick={() => openModal('lot')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Add Stock Lot
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setActiveTab('transactions')} 
          className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'transactions' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          Transactions
        </button>
        <button onClick={() => setActiveTab('lots')} 
          className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'lots' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
          Stock Lots
        </button>
      </div>

      {activeTab === 'transactions' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{txn.product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{txn.product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{txn.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${txn.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{txn.referenceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${txn.unitCost}</td>
                  <td className="px-6 py-4 text-sm">{txn.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockLots.map((lot) => (
                <tr key={lot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{lot.product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{lot.product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{lot.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{lot.remainingQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${lot.unitCost}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{lot.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add {modalType === 'transaction' ? 'Transaction' : 'Stock Lot'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none" required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
              <input type="number" placeholder="Quantity" value={formData.qty} 
                onChange={(e) => setFormData({...formData, qty: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none" required />
              <input type="number" step="0.01" placeholder="Unit Cost" value={formData.unitCost} 
                onChange={(e) => setFormData({...formData, unitCost: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none" required />
              
              {modalType === 'transaction' ? (
                <>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none">
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                  <input type="text" placeholder="Reference Type" value={formData.referenceType} 
                    onChange={(e) => setFormData({...formData, referenceType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none" required />
                  <textarea placeholder="Note" value={formData.note} 
                    onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none" rows={3} />
                </>
              ) : (
                <input type="text" placeholder="Reference (e.g., PO-001)" value={formData.reference} 
                  onChange={(e) => setFormData({...formData, reference: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none" required />
              )}
              
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Save</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
