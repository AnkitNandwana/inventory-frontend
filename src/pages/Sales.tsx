import { useState, useEffect } from 'react';
import { salesService, productService } from '../services/apiService';

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '', items: [{ productId: '', qty: '', unitPrice: '' }]
  });

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  const loadSales = async () => {
    const data = await salesService.getAll();
    setSales(data.sales);
  };

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data.products);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await salesService.create(formData);
      loadSales();
      resetForm();
    } catch (error) {
      alert('Error creating sale');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', qty: '', unitPrice: '' }]
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
    await salesService.updateStatus(id, status);
    loadSales();
  };

  const resetForm = () => {
    setFormData({ customerName: '', items: [{ productId: '', qty: '', unitPrice: '' }] });
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sales</h2>
        <button onClick={() => setShowModal(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
          Create Sale
        </button>
      </div>

      <div className="space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{sale.customerName}</h3>
                <p className="text-sm text-gray-600">Sale ID: {sale.id}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-600">${sale.totalAmount}</p>
                <select value={sale.status} onChange={(e) => updateStatus(sale.id, e.target.value)}
                  className="mt-2 px-3 py-1 border rounded text-sm">
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Unit Price</th>
                  <th className="px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item: any) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.product.name}</td>
                    <td className="px-4 py-2">{item.qty}</td>
                    <td className="px-4 py-2">${item.unitPrice}</td>
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
            <h3 className="text-xl font-bold mb-4">Create Sale</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Customer Name" value={formData.customerName} 
                onChange={(e) => setFormData({...formData, customerName: e.target.value})} 
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
                    <input type="number" step="0.01" placeholder="Price" value={item.unitPrice} 
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} 
                      className="w-32 px-3 py-2 border rounded-lg" required />
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="text-red-600">✕</button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">Create</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
