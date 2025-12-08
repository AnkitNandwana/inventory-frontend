import { useState, useEffect } from 'react';
import { supplierService } from '../services/apiService';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', code: '', contactPerson: '', phone: '', email: '', address: ''
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const data = await supplierService.getAll();
    setSuppliers(data.suppliers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && currentSupplier) {
        await supplierService.update(currentSupplier.id, formData);
      } else {
        await supplierService.create(formData);
      }
      loadSuppliers();
      resetForm();
    } catch (error) {
      alert('Error saving supplier');
    }
  };

  const handleEdit = (supplier: any) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      code: supplier.code,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address
    });
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', contactPerson: '', phone: '', email: '', address: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentSupplier(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <button onClick={() => setShowModal(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
          Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{supplier.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{supplier.contactPerson}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{supplier.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{supplier.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleEdit(supplier)} className="text-blue-600 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Supplier</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required disabled={editMode} />
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" required />
              <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" rows={3} required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">Save</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
