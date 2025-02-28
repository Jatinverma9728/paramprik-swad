import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Eye, Download, Calendar, User, MapPin, Phone, Filter } from 'lucide-react';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const ordersPerPage = 10;

  const filteredOrders = orders
    .filter(order => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        order.customerInfo.name.toLowerCase().includes(searchLower) ||
        order.id.includes(searchLower) ||
        order.customerInfo.email.toLowerCase().includes(searchLower);
      
      return statusFilter ? order.status === statusFilter && matchesSearch : matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const paginatedOrders = filteredOrders
    .slice((page - 1) * ordersPerPage, page * ordersPerPage);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-amber-900">Order #{order.id}</h3>
                <p className="text-amber-600">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {order.customerInfo.name}</p>
                    <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
                    <p><span className="font-medium">Phone:</span> {order.customerInfo.phone}</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Shipping Address
                  </h4>
                  <p className="text-sm">
                    {order.customerInfo.address}<br />
                    {order.customerInfo.city}, {order.customerInfo.pincode}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.orderItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{((item.selectedSize?.price || item.sizes[0].price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{order.orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{order.orderSummary.shipping.toFixed(2)}</span>
                    </div>
                    {order.orderSummary.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{order.orderSummary.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-2 border-t border-amber-200">
                      <span>Total</span>
                      <span>₹{order.orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Status</h4>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    className="w-full rounded-md border-amber-200 text-amber-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add stats section
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-amber-600">{orderStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
        </div>
        {/* ... add similar cards for other stats ... */}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-900">Order Management</h1>
          <div className="flex gap-4">
            <input
              type="search"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-amber-200 rounded-lg"
            />
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-amber-200 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-amber-900">{order.customerInfo.name}</div>
                      <div className="text-sm text-amber-600">{order.customerInfo.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-amber-900">
                        {order.orderItems.map(item => (
                          <div key={item.id}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                      ₹{order.orderSummary.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="text-amber-600 hover:text-amber-700 mr-2"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="rounded-md border-amber-200 text-amber-900 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-amber-700">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-amber-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-amber-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
        {selectedOrder && renderOrderDetails(selectedOrder)}
      </div>
    </div>
  );
};
