import React from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { orders } = useStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Orders</h2>
          <p className="text-3xl font-bold text-amber-600">{orders.length}</p>
          <p className="text-sm text-amber-600 mt-2">Manage all orders</p>
        </Link>

        {/* Add more dashboard cards as needed */}
      </div>
    </div>
  );
};
