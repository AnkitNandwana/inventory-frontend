import { useState, useEffect } from 'react';
import { purchaseService, supplierService, productService } from '../services/apiService';

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '', invoiceNo: '', items: [{ productId: '', qty: '', unitCost: '' }]
  });

  useEffect(() => {
    loadPurchases();
    loadSuppliers();
    loadProducts();
  }, []);

  const loadPurchases = async () => {
    const data = await purchaseService.getAll();
    setPurchases(data.purchases);
  };

  const loadSuppliers = async () => {
    const data = await supplierService.getAll();
    setSuppliers(data.suppliers);
  };

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data.products);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await purchaseService.create(formData);
      loadPurchases();
      resetForm();
    } catch (error) {
      alert('Error creating purchase');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', qty: '', unitCost: '' }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const updateStatus = async (id: number, status: string) => {
    await purchaseService.updateStatus(id, status);
    loadPurchases();
  };

  const resetForm = () => {
    setFormData({ supplierId: '', invoiceNo: '', items: [{ productId: '', qty: '', unitCost: '' }] });
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchases</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Create Purchase
        </button>
      </div>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{purchase.supplier.name}</h3>
                <p className="text-sm text-gray-600">Invoice: {purchase.invoiceNo}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">${purchase.totalAmount}</p>
                <select value={purchase.status} onChange={(e) => updateStatus(purchase.id, e.target.value)}
                  className="mt-2 px-3 py-1 border rounded text-sm">
                  <option value="PENDING">PENDING</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Unit Cost</th>
                  <th className="px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchase.items.map((item: any) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.product.name}</td>
                    <td className="px-4 py-2">{item.qty}</td>
                    <td className="px-4 py-2">${item.unitCost}</td>
                    <td className="px-4 py-2">${item.lineTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create Purchase</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={formData.supplierId} onChange={(e) => setFormData({...formData, supplierId: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
              <input type="text" placeholder="Invoice Number" value={formData.invoiceNo} 
                onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold">Items</label>
                  <button type="button" onClick={addItem} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Add Item
                  </button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select value={item.productId} onChange={(e) => updateItem(index, 'productId', e.target.value)} 
                      className="flex-1 px-3 py-2 border rounded-lg" required>
                      <option value="">Select Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" placeholder="Qty" value={item.qty} 
                      onChange={(e) => updateItem(index, 'qty', e.target.value)} 
                      className="w-24 px-3 py-2 border rounded-lg" required />
                    <input type="number" step="0.01" placeholder="Cost" value={item.unitCost} 
                      onChange={(e) => updateItem(index, 'unitCost', e.target.value)} 
                      className="w-32 px-3 py-2 border rounded-lg" required />
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="text-red-600">✕</button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Create</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
