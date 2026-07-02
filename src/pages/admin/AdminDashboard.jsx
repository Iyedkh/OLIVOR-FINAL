import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const statsData = [
  { label: 'Total Revenue', value: '$242,580.00', change: '+12.4%', icon: DollarSign, trend: 'up' },
  { label: 'Total Orders', value: '3,248', change: '+8.2%', icon: ShoppingBag, trend: 'up' },
  { label: 'Average Value', value: '$74.68', change: '-1.5%', icon: TrendingUp, trend: 'down' },
  { label: 'Active Customers', value: '1,894', change: '+14.1%', icon: Users, trend: 'up' }
];

const recentOrders = [
  { id: '#ORD-94042', customer: 'Eleanor M.', product: 'Reserve Collection', total: '$48.00', status: 'Processing', statusColor: 'text-amber-600 bg-amber-500/10 border border-amber-500/20' },
  { id: '#ORD-88902', customer: 'Alessandro R.', product: 'Heritage Blend', total: '$120.00', status: 'In Transit', statusColor: 'text-primary bg-primary/10 border border-primary/20' },
  { id: '#ORD-77215', customer: 'Julian D.', product: 'Tasting Trio', total: '$82.00', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20' },
  { id: '#ORD-65123', customer: 'Marie S.', product: 'Carthage Amphora', total: '$185.00', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20' }
];

const chartBars = [
  { month: 'Jan', val: 40 },
  { month: 'Feb', val: 55 },
  { month: 'Mar', val: 48 },
  { month: 'Apr', val: 70 },
  { month: 'May', val: 85 },
  { month: 'Jun', val: 95 }
];

const AdminDashboard = () => {
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
                  <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-primary' : 'text-red-600'}`}>
                    {stat.change}
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
            <div className="mb-8">
              <h3 className="font-headline-md text-headline-md text-primary text-lg font-bold">Revenue Growth</h3>
              <p className="text-xs text-on-surface-variant font-light mt-1">Monthly earnings overview in USD</p>
            </div>
            
            {/* Visual Bars */}
            <div className="flex justify-between items-end h-48 px-4 border-b border-outline-variant/20 pb-2 gap-4">
              {chartBars.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.val}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="w-full bg-primary rounded-t-md hover:bg-primary-container transition-all relative group cursor-pointer"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none">
                      {bar.val * 30}$
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
                {[
                  { name: 'Reserve Collection', share: 45, color: 'bg-primary' },
                  { name: 'Heritage Blend', share: 30, color: 'bg-secondary' },
                  { name: 'Carthage Amphora', share: 15, color: 'bg-emerald-600' },
                  { name: 'Others', share: 10, color: 'bg-outline-variant' }
                ].map((item, idx) => (
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
                        className={`h-full ${item.color}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Orders Log */}
          <section className="lg:col-span-12">
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-headline-md text-headline-md text-primary text-lg font-bold">Recent Orders</h3>
              <button className="text-xs font-bold text-secondary hover:underline uppercase tracking-wider">
                Manage Operations
              </button>
            </div>
            
            <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm text-on-surface">
                  <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 font-bold text-primary">{order.id}</td>
                        <td className="py-4 px-6">{order.customer}</td>
                        <td className="py-4 px-6">{order.product}</td>
                        <td className="py-4 px-6 font-bold text-secondary">{order.total}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold">
                          <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ml-auto">
                            Manage <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
