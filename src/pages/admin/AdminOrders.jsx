import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, MapPin } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';

const AdminOrders = () => {
  const { adminOrders, fetchAllOrders, updateOrderStatus, user } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllOrders();
    }
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (!result.success) {
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20';
      case 'Shipped':
      case 'In Transit':
        return 'text-primary bg-primary/10 border border-primary/20';
      case 'Processing':
        return 'text-amber-600 bg-amber-500/10 border border-amber-500/20';
      case 'Cancelled':
        return 'text-red-600 bg-red-500/10 border border-red-500/20';
      default:
        return 'text-outline-variant bg-surface-container-low border border-outline-variant/20';
    }
  };

  const filteredOrders = (adminOrders || []).filter(order => {
    const orderId = order._id || order.id || '';
    const customerName = order.shippingAddress 
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` 
      : (order.user?.name || 'Guest');

    const matchesSearch = orderId.toLowerCase().includes(search.toLowerCase()) || 
                          customerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        {/* Header Title */}
        <div className="flex justify-between items-center select-none">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
              Order Fulfillment
            </h1>
            <p className="text-on-surface-variant font-light text-sm mt-1">
              Track shipments and adjust processing status.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center bg-surface p-2 rounded-2xl border border-outline-variant/30 shadow-sm w-full md:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant h-5 w-5 pointer-events-none" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-on-surface font-body-md placeholder:text-outline-variant text-sm focus:ring-0" 
                placeholder="Search by Order ID or Customer Name..." 
                type="text" 
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 select-none">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none ${
                  activeFilter === filter 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-surface border border-outline-variant/30 text-outline hover:text-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-on-surface">
              <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Fulfillment Status</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                {filteredOrders.map((order) => {
                  const orderId = order._id || order.id;
                  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                  const customerName = order.shippingAddress 
                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` 
                    : (order.user?.name || 'Guest');

                  return (
                    <tr key={orderId} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6 font-bold text-primary">#{orderId.slice(-6).toUpperCase()}</td>
                      <td className="py-4 px-6">{dateStr}</td>
                      <td className="py-4 px-6 font-semibold">{customerName}</td>
                      <td className="py-4 px-6 font-bold text-secondary">${(order.totalPrice || 0).toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(orderId, e.target.value)}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-surface focus:outline-none focus:ring-1 focus:ring-primary ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setViewingOrder(order)}
                          className="p-2 hover:bg-surface-container text-outline hover:text-primary rounded-lg transition-colors focus:outline-none"
                          aria-label="View Details"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant font-light">
                      No matching transaction logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Drawer */}
        <AnimatePresence>
          {viewingOrder && (() => {
            const orderId = viewingOrder._id || viewingOrder.id;
            const customerName = viewingOrder.shippingAddress 
              ? `${viewingOrder.shippingAddress.firstName} ${viewingOrder.shippingAddress.lastName}` 
              : (viewingOrder.user?.name || 'Guest');
            const contactEmail = viewingOrder.shippingAddress?.email || viewingOrder.user?.email || 'N/A';
            const contactPhone = viewingOrder.shippingAddress?.phone || '20202020';
            
            const shippingStr = viewingOrder.shippingAddress
              ? `${viewingOrder.shippingAddress.address}, ${viewingOrder.shippingAddress.apartment || ''}, ${viewingOrder.shippingAddress.city}, ${viewingOrder.shippingAddress.postalCode}, ${viewingOrder.shippingAddress.country}`
              : 'Digital / In Store pickup';

            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="w-full max-w-md bg-surface h-screen border-l border-outline-variant/30 p-8 flex flex-col justify-between shadow-2xl overflow-y-auto text-left text-on-surface font-sans"
                >
                  <div>
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/20 select-none">
                      <h3 className="font-headline-md text-headline-md text-primary text-xl font-bold font-serif">
                        Order Details
                      </h3>
                      <button 
                        onClick={() => setViewingOrder(null)}
                        className="p-2 text-outline-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-all focus:outline-none"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Status & ID */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-outline uppercase tracking-widest block">Order ID</span>
                          <span className="text-sm font-bold text-primary">#{orderId.toUpperCase()}</span>
                        </div>
                        <div className={`px-4 py-1.5 border rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(viewingOrder.status)}`}>
                          {viewingOrder.status}
                        </div>
                      </div>

                      {/* Contact details */}
                      <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                        <h4 className="font-bold text-[10px] uppercase tracking-widest text-outline">Customer Info</h4>
                        <p className="text-sm font-semibold">{customerName}</p>
                        <p className="text-xs text-on-surface-variant">{contactEmail}</p>
                        <p className="text-xs text-on-surface-variant">{contactPhone}</p>
                      </div>

                      {/* Delivery address */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="font-bold text-[10px] uppercase tracking-widest text-outline">Shipping Address</span>
                        </div>
                        <p className="text-xs leading-relaxed text-on-surface-variant font-light pl-6">
                          {shippingStr}
                        </p>
                      </div>

                      {/* Items table */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-[10px] uppercase tracking-widest text-outline">Items Ordered</h4>
                        <div className="divide-y divide-outline-variant/10">
                          {viewingOrder.orderItems.map((item, idx) => (
                            <div key={idx} className="py-3 flex justify-between items-center text-xs font-light">
                              <div>
                                <p className="font-semibold text-on-surface">{item.title}</p>
                                <p className="text-on-surface-variant text-[10px]">
                                  Size: {item.volume || '500ml'} • Qty: {item.qty}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-secondary block">${(item.price * item.qty).toFixed(2)}</span>
                                <span className="text-[10px] text-outline">${item.price.toFixed(2)} each</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Order Total summary */}
                        <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                          <span className="font-bold text-[10px] uppercase tracking-widest text-outline">Order Total</span>
                          <span className="text-lg font-bold text-secondary">${(viewingOrder.totalPrice || 0.00).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/20 pt-6 mt-8 flex justify-end">
                    <button 
                      onClick={() => setViewingOrder(null)}
                      className="w-full py-3 bg-surface-container hover:bg-primary-container text-primary hover:text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
