import { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/apiService';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    sku: '', name: '', categoryId: '', costPrice: '', sellingPrice: '', currentStock: '', lowStockThreshold: ''
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data.products);
  };

  const loadCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data.categories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && currentProduct) {
        await productService.update(currentProduct.id, formData);
      } else {
        await productService.create(formData);
      }
      loadProducts();
      resetForm();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const handleEdit = (product: any) => {
    setCurrentProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      categoryId: product.category.id,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      currentStock: product.currentStock,
      lowStockThreshold: product.lowStockThreshold
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) {
      await productService.delete(id);
      loadProducts();
    }
  };

  const resetForm = () => {
    setFormData({ sku: '', name: '', categoryId: '', costPrice: '', sellingPrice: '', currentStock: '', lowStockThreshold: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentProduct(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${product.costPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${product.sellingPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.currentStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="SKU" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required disabled={editMode} />
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required />
              <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required disabled={editMode}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <input type="number" step="0.01" placeholder="Cost Price" value={formData.costPrice} 
                onChange={(e) => setFormData({...formData, costPrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="number" step="0.01" placeholder="Selling Price" value={formData.sellingPrice} 
                onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              {!editMode && <input type="number" placeholder="Current Stock" value={formData.currentStock} 
                onChange={(e) => setFormData({...formData, currentStock: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />}
              <input type="number" placeholder="Low Stock Threshold" value={formData.lowStockThreshold} 
                onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer">Save</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
