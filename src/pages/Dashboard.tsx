import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Products from './Products';
import Categories from './Categories';
import Inventory from './Inventory';
import Suppliers from './Suppliers';
import Purchases from './Purchases';
import Sales from './Sales';
import NotificationBox from '../components/NotificationBox';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
            <div className="flex items-center gap-4">
              <NotificationBox />
              <span className="text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('home')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab('products')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
              Products
            </button>
            <button onClick={() => setActiveTab('categories')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'categories' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}>
              Categories
            </button>
            <button onClick={() => setActiveTab('inventory')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'inventory' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}>
              Inventory
            </button>
            <button onClick={() => setActiveTab('suppliers')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'suppliers' ? 'bg-orange-600 text-white' : 'hover:bg-gray-100'}`}>
              Suppliers
            </button>
            <button onClick={() => setActiveTab('purchases')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'purchases' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>
              Purchases
            </button>
            <button onClick={() => setActiveTab('sales')} 
              className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'sales' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}>
              Sales
            </button>
          </nav>
        </aside>

        <main className="flex-1">
          {activeTab === 'home' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Items</h3>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">In Stock</h3>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Low Stock</h3>
                  <p className="text-3xl font-bold text-orange-600">0</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'products' && <Products />}
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'suppliers' && <Suppliers />}
          {activeTab === 'purchases' && <Purchases />}
          {activeTab === 'sales' && <Sales />}
        </main>
      </div>
    </div>
  );
}
