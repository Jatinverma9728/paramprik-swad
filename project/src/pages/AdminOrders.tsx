import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Eye, Calendar, User, MapPin, X, ChevronDown, ChevronUp } from 'lucide-react';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const ordersPerPage = 7; // Adjusted for better spacing
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortColumn === 'customer') {
      const nameA = a.customerInfo.name.toUpperCase();
      const nameB = b.customerInfo.name.toUpperCase();
      if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else if (sortColumn === 'total') {
      const totalA = a.orderSummary.total;
      const totalB = b.orderSummary.total;
      return sortDirection === 'asc' ? totalA - totalB : totalB - totalA;
    } else {
      return 0;
    }
  });

  const filteredOrders = sortedOrders
    .filter(order => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        order.customerInfo.name.toLowerCase().includes(searchLower) ||
        order.id.includes(searchLower) ||
        order.customerInfo.email.toLowerCase().includes(searchLower);

      return statusFilter ? order.status === statusFilter && matchesSearch : matchesSearch;
    });

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
        <div className="bg-white rounded-3xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-amber-900">Order #{order.id}</h3>
                <p className="text-amber-600">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Details */}
              <div>
                <h4 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Customer Details
                </h4>
                <div className="bg-amber-50 p-5 rounded-xl shadow-inner">
                  <div className="space-y-3 text-sm">
                    <p><span className="font-medium">Name:</span> {order.customerInfo.name}</p>
                    <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
                    <p><span className="font-medium">Phone:</span> {order.customerInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2" />
                  Shipping Address
                </h4>
                <div className="bg-amber-50 p-5 rounded-xl shadow-inner">
                  <p className="text-sm">
                    {order.customerInfo.address}<br />
                    {order.customerInfo.city}, {order.customerInfo.pincode}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-amber-900 mb-4">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{(item.selectedSize?.price || item.sizes[0].price).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{((item.selectedSize?.price || item.sizes[0].price) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-amber-900 mb-4">Order Summary</h4>
              <div className="bg-amber-50 p-5 rounded-xl shadow-inner">
                <div className="space-y-3 text-sm">
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
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-amber-900 mb-4">Update Status</h4>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                className="w-full rounded-md border-amber-200 text-amber-900 p-3"
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
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-4 md:mb-0">Order Management</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 border border-amber-200 rounded-md md:w-auto w-full"
          />
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-amber-200 rounded-md md:w-auto w-full"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('customer')}>
                  Customer
                  {sortColumn === 'customer' && (
                    sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Total Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('total')}>
                  Total
                  {sortColumn === 'total' && (
                    sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />
                  )}
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
                <tr key={order.id} className="hover:bg-amber-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-amber-900">{order.customerInfo.name}</div>
                    <div className="text-sm text-amber-600">{order.customerInfo.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                    {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                    ₹{order.orderSummary.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
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
            className="px-4 py-2 bg-amber-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-amber-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {selectedOrder && renderOrderDetails(selectedOrder)}
    </div>
  );
};
