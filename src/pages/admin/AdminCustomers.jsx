import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Award, UserCheck, Calendar, X, ShoppingBag, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const initialCustomers = [
  { id: 'CUST-1002', name: 'Alessandro Rossi', email: 'alessandro@rossi.it', level: 'Connoisseur', levelBg: 'bg-secondary/10 text-secondary border-secondary/20', joined: 'Oct 2021', totalOrders: 14, spent: 1240.00, points: 3250 },
  { id: 'CUST-1045', name: 'Eleanor M.', email: 'eleanor@connoisseur.com', level: 'Connoisseur', levelBg: 'bg-secondary/10 text-secondary border-secondary/20', joined: 'Jan 2022', totalOrders: 9, spent: 848.00, points: 1980 },
  { id: 'CUST-1192', name: 'Julian D.', email: 'julian@chef.com', level: 'Collector', levelBg: 'bg-primary/10 text-primary border-primary/20', joined: 'May 2022', totalOrders: 5, spent: 432.00, points: 1120 },
  { id: 'CUST-1248', name: 'Marie S.', email: 'marie@sommelier.fr', level: 'Explorer', levelBg: 'bg-slate-400/10 text-slate-500 border-slate-400/20', joined: 'Aug 2023', totalOrders: 2, spent: 185.00, points: 450 }
];

const AdminCustomers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        {/* Header Title */}
        <div className="flex justify-between items-center select-none">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
              Customer Directory
            </h1>
            <p className="text-on-surface-variant font-light text-sm mt-1">
              Analyze member demographics and loyalty logs.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center bg-surface p-2 rounded-2xl border border-outline-variant/30 shadow-sm w-full md:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant h-5 w-5 pointer-events-none" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-on-surface font-body-md placeholder:text-outline-variant text-sm focus:ring-0" 
              placeholder="Search by customer name or email..." 
              type="text" 
            />
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-on-surface">
              <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Loyalty Status</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6">Acquisitions</th>
                  <th className="py-4 px-6">Spent Volume</th>
                  <th className="py-4 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-6 font-bold text-outline-variant">{cust.id}</td>
                    <td className="py-4 px-6 font-bold text-primary">{cust.name}</td>
                    <td className="py-4 px-6">{cust.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${cust.levelBg}`}>
                        {cust.level}
                      </span>
                    </td>
                    <td className="py-4 px-6">{cust.joined}</td>
                    <td className="py-4 px-6 font-semibold">{cust.totalOrders} orders</td>
                    <td className="py-4 px-6 font-bold text-secondary">${cust.spent.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-semibold">
                      <button 
                        onClick={() => setViewingCustomer(cust)}
                        className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ml-auto"
                      >
                        Profile <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Customer Details Drawer */}
        <AnimatePresence>
          {viewingCustomer && (
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
                      Customer Profile
                    </h3>
                    <button 
                      onClick={() => setViewingCustomer(null)}
                      className="p-2 text-outline-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-all focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* ID & Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center font-bold text-primary select-none text-lg">
                        {viewingCustomer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-on-surface">{viewingCustomer.name}</h4>
                        <span className="text-[10px] text-outline font-bold uppercase tracking-widest block mt-0.5">{viewingCustomer.id}</span>
                      </div>
                    </div>

                    {/* Member Level & Points Card */}
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-widest block">Loyalty Tier</span>
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-secondary" />
                          <span className="text-sm font-bold text-secondary">{viewingCustomer.level} Level</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-widest block">Points balance</span>
                        <span className="text-base font-bold text-on-surface">{viewingCustomer.points} pts</span>
                      </div>
                    </div>

                    {/* Statistics list */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-[10px] uppercase tracking-widest text-outline">Sales Record</h5>
                      <div className="divide-y divide-outline-variant/10">
                        <div className="py-3 flex justify-between text-xs font-light">
                          <span className="text-outline flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Total Purchases</span>
                          <span className="font-bold text-on-surface">{viewingCustomer.totalOrders} orders</span>
                        </div>
                        <div className="py-3 flex justify-between text-xs font-light">
                          <span className="text-outline flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address</span>
                          <span className="text-on-surface-variant font-semibold">{viewingCustomer.email}</span>
                        </div>
                        <div className="py-3 flex justify-between text-xs font-light">
                          <span className="text-outline flex items-center gap-2"><Calendar className="h-4 w-4" /> Member Since</span>
                          <span className="text-on-surface-variant font-semibold">{viewingCustomer.joined}</span>
                        </div>
                        <div className="py-3 flex justify-between text-xs font-light">
                          <span className="text-outline flex items-center gap-2"><UserCheck className="h-4 w-4" /> Total Contributions</span>
                          <span className="font-bold text-secondary">${viewingCustomer.spent.toFixed(2)} spent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-6 mt-8 flex justify-end">
                  <button 
                    onClick={() => setViewingCustomer(null)}
                    className="w-full py-3 bg-surface-container hover:bg-primary-container text-primary hover:text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
