import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Home, ShoppingCart, Users, Settings, Package, ListChecks } from 'lucide-react';
import { AdminOrders } from './pages/AdminOrders';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-amber-800 text-white flex flex-col shadow-lg">
        <div className="p-6 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Paramparik Swad</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-amber-700 transition-colors">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-amber-700 transition-colors">
                <ListChecks className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-amber-700 transition-colors">
                <Package className="w-5 h-5" />
                <span>Products</span>
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>

        <div className="p-4">
          <p className="text-xs text-gray-300">© 2024 Paramparik Swad</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
