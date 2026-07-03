import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';

const AdminDashboard = () => {
  const { 
    adminOrders, 
    fetchAllOrders, 
    adminUsers, 
    fetchAllUsers,
    products,
    refreshProducts,
    user
  } = useApp();

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllOrders();
      fetchAllUsers();
      refreshProducts();
    }
  }, [user]);

  // Compute Metrics from Real Backend Data
  const totalRevenue = adminOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const totalOrders = adminOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeCustomers = adminUsers.length;

  const statsData = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: 'up' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, trend: 'up' },
    { label: 'Average Value', value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, trend: 'up' },
    { label: 'Active Customers', value: activeCustomers.toString(), icon: Users, trend: 'up' }
  ];

  // Compute Recent Orders
  const recentOrders = [...adminOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Compute Revenue Growth (Last 6 Months)
  const monthlyRevenue = {};
  adminOrders.forEach(order => {
    if (order.createdAt) {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.totalPrice || 0);
    }
  });

  const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const past6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    past6Months.push(monthsOrder[idx]);
  }

  const chartBars = past6Months.map(month => ({
    month,
    val: monthlyRevenue[month] || 0
  }));

  const maxRevenue = Math.max(...chartBars.map(b => b.val), 1);
  const normalizedChartBars = chartBars.map(b => ({
    month: b.month,
    rawVal: b.val,
    val: Math.round((b.val / maxRevenue) * 100)
  }));

  // Compute Popular Demands Share
  const productSales = {};
  let totalItemsSold = 0;
  adminOrders.forEach(order => {
    order.orderItems.forEach(item => {
      const title = item.title;
      productSales[title] = (productSales[title] || 0) + item.qty;
      totalItemsSold += item.qty;
    });
  });

  const popularDemands = Object.entries(productSales)
    .map(([name, qty]) => ({
      name,
      share: totalItemsSold > 0 ? Math.round((qty / totalItemsSold) * 100) : 0
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 4);

  // Fallback if there are no sales records yet
  if (popularDemands.length === 0 && products && products.length > 0) {
    products.slice(0, 4).forEach((p, idx) => {
      popularDemands.push({
        name: p.title,
        share: idx === 0 ? 50 : idx === 1 ? 30 : idx === 2 ? 15 : 5
      });
    });
  }

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header Title */}
        <div className="flex justify-between items-center select-none">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
              Overview Dashboard
            </h1>
            <p className="text-on-surface-variant font-light text-sm mt-1">
              Real-time transaction monitors and metrics analysis.
            </p>
          </div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/15 border border-secondary/20 px-3 py-1.5 rounded-full">
            Live Updates
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-outline uppercase tracking-wider">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xl md:text-2xl font-bold text-on-surface">{stat.value}</span>
                  <span className="text-xs font-bold text-primary">
                    +0.0%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics & Recent Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Revenue Chart Panel */}
          <section className="lg:col-span-7 bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col justify-between">
            <div className="mb-8 text-left">
              <h3 className="font-headline-md text-headline-md text-primary text-lg font-bold">Revenue Growth</h3>
              <p className="text-xs text-on-surface-variant font-light mt-1">Monthly earnings overview in USD</p>
            </div>
            
            {/* Visual Bars */}
            <div className="flex justify-between items-end h-48 px-4 border-b border-outline-variant/20 pb-2 gap-4">
              {normalizedChartBars.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.val || 5}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="w-full bg-primary rounded-t-md hover:bg-primary-container transition-all relative group cursor-pointer"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none whitespace-nowrap z-20">
                      ${bar.rawVal.toFixed(2)}
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-semibold text-outline mt-2 block">{bar.month}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Products Shares */}
          <section className="lg:col-span-5 bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col justify-between text-left">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary text-lg font-bold mb-6">Popular Demands</h3>
              <div className="space-y-4">
                {popularDemands.map((item, idx) => {
                  const colors = ['bg-primary', 'bg-secondary', 'bg-emerald-600', 'bg-outline-variant'];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                        <span>{item.name}</span>
                        <span>{item.share}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.share}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${color}`}
                        ></motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recent Orders Log */}
          <section className="lg:col-span-12">
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-headline-md text-headline-md text-primary text-lg font-bold">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs font-bold text-secondary hover:underline uppercase tracking-wider">
                Manage Operations
              </a>
            </div>
            
            <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm text-on-surface">
                  <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Products</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                    {recentOrders.map((order) => {
                      const orderId = order._id || order.id;
                      const customerName = order.shippingAddress 
                        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` 
                        : (order.user?.name || 'Guest');
                      const itemsSummary = order.orderItems.map(i => `${i.title} (x${i.qty})`).join(', ');

                      return (
                        <tr key={orderId} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-4 px-6 font-bold text-primary">#{orderId.slice(-6).toUpperCase()}</td>
                          <td className="py-4 px-6">{customerName}</td>
                          <td className="py-4 px-6 truncate max-w-xs">{itemsSummary}</td>
                          <td className="py-4 px-6 font-bold text-secondary">${(order.totalPrice || 0).toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-semibold">
                            <a href="/admin/orders" className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ml-auto justify-end w-fit">
                              Manage <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-on-surface-variant font-light">
                          No transactions recorded yet in the cellars.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
