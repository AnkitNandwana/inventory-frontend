import { useState, useEffect } from 'react';
import { categoryService } from '../services/apiService';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data.categories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && currentCategory) {
        await categoryService.update(currentCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      loadCategories();
      resetForm();
    } catch (error) {
      alert('Error saving category');
    }
  };

  const handleEdit = (category: any) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this category?')) {
      await categoryService.delete(id);
      loadCategories();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentCategory(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">Slug: {category.slug}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(category)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Edit
              </button>
              <button onClick={() => handleDelete(category.id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Category</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Slug (e.g., electronics)"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Save
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
