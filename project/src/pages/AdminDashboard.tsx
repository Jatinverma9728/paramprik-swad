import React from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { orders } = useStore();

  // Calculate order stats
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Orders Card */}
      <Link to="/admin/orders" className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Orders</h2>
            <p className="text-4xl font-bold text-amber-600">{orders.length}</p>
          </div>
          <ShoppingCart className="w-12 h-12 text-amber-600" />
        </div>
      </Link>

      {/* Pending Orders Card */}
      <Link to="/admin/orders?status=pending" className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Pending Orders</h2>
            <p className="text-4xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <AlertTriangle className="w-12 h-12 text-yellow-600" />
        </div>
      </Link>

      {/* Processing Orders Card */}
      <Link to="/admin/orders?status=processing" className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Processing Orders</h2>
            <p className="text-4xl font-bold text-blue-600">{processingOrders}</p>
          </div>
          <Package className="w-12 h-12 text-blue-600" />
        </div>
      </Link>

      {/* Completed Orders Card */}
      <Link to="/admin/orders?status=completed" className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Completed Orders</h2>
            <p className="text-4xl font-bold text-green-600">{completedOrders}</p>
          </div>
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </Link>

      {/* Cancelled Orders Card */}
      <Link to="/admin/orders?status=cancelled" className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Cancelled Orders</h2>
            <p className="text-4xl font-bold text-red-600">{cancelledOrders}</p>
          </div>
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
      </Link>
    </div>
  );
};
