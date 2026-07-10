import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, X, Ticket, Info } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';

const AdminCoupons = () => {
  const { coupons, fetchCoupons, createCoupon, deleteCoupon } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    code: '',
    discount: '',
    active: true,
    expirationDate: '',
  });

  useEffect(() => {
    const loadCoupons = async () => {
      setLoading(true);
      await fetchCoupons();
      setLoading(false);
    };
    loadCoupons();
  }, [fetchCoupons]);

  const handleOpenAddModal = () => {
    setFormState({
      code: '',
      discount: '',
      active: true,
      expirationDate: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      const result = await deleteCoupon(id);
      if (!result.success) {
        alert(result.message || 'Failed to delete coupon');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.code.trim()) {
      alert('Coupon code is required');
      return;
    }
    const discountVal = parseFloat(formState.discount);
    if (isNaN(discountVal) || discountVal <= 0 || discountVal > 100) {
      alert('Discount must be a number between 1 and 100');
      return;
    }

    const couponData = {
      code: formState.code.trim().toUpperCase(),
      discount: discountVal / 100, // convert percentage (e.g. 10%) to decimal (0.1)
      active: formState.active,
      expirationDate: formState.expirationDate ? new Date(formState.expirationDate) : null,
    };

    const result = await createCoupon(couponData);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  const filteredCoupons = (coupons || []).filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        {/* Header Title */}
        <div className="flex justify-between items-center select-none">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
              Coupon Management
            </h1>
            <p className="text-on-surface-variant font-light text-sm mt-1">
              Create and manage promotional discount codes for your customers.
            </p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-label-lg transition-transform hover:scale-105 active:scale-95 text-xs uppercase font-bold tracking-widest shadow-lg shadow-primary/10 focus:outline-none"
          >
            <Plus className="h-4 w-4" /> Add Coupon
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center bg-surface p-2 rounded-2xl border border-outline-variant/30 shadow-sm max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant h-5 w-5 pointer-events-none" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-on-surface font-body-md placeholder:text-outline-variant text-sm focus:ring-0" 
              placeholder="Search coupons by code..." 
              type="text" 
            />
          </div>
        </div>

        {/* Coupons List Table */}
        <div className="bg-surface rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-on-surface">
              <thead className="bg-surface-container-low text-outline uppercase tracking-widest text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-4 px-6 w-16">Icon</th>
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-6">Discount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Expiration Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-light font-sans">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant font-light">
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant font-light">
                      No active coupons found in the cellars.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => {
                    const couponId = coupon._id;
                    const isExpired = coupon.expirationDate && new Date(coupon.expirationDate) < new Date();
                    const expirationDateFormatted = coupon.expirationDate 
                      ? new Date(coupon.expirationDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Never';

                    return (
                      <tr key={couponId} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 select-none">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                            <Ticket className="h-4.5 w-4.5" />
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-primary tracking-wider">{coupon.code}</td>
                        <td className="py-4 px-6 font-bold text-secondary">{Math.round(coupon.discount * 100)}% OFF</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isExpired 
                              ? 'text-red-600 bg-red-500/10 border border-red-500/20'
                              : coupon.active 
                                ? 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20' 
                                : 'text-outline-variant bg-surface-container-low border border-outline-variant/20'
                          }`}>
                            {isExpired ? 'Expired' : coupon.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-outline">{expirationDateFormatted}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-3 justify-end">
                            <button 
                              onClick={() => handleDelete(couponId, coupon.code)}
                              className="p-2 hover:bg-red-500/10 text-outline hover:text-red-600 rounded-lg transition-colors focus:outline-none"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal (Framer Motion Drawer) */}
        <AnimatePresence>
          {isModalOpen && (
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
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-lg h-full bg-surface border-l border-outline-variant/30 p-8 flex flex-col justify-between shadow-2xl relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/15 px-3 py-1.5 rounded-full border border-secondary/20 select-none">
                        Coupon Creator
                      </span>
                      <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl mt-4 font-bold">
                        Create New Coupon
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors focus:outline-none border border-outline-variant/10"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form id="couponForm" onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Coupon Code</label>
                      <input 
                        value={formState.code}
                        onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm tracking-wider uppercase font-bold" 
                        placeholder="e.g. SUMMER25, FESTIVE15" 
                        required 
                        type="text" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Discount Percentage (%)</label>
                      <input 
                        value={formState.discount}
                        onChange={(e) => setFormState({ ...formState, discount: e.target.value })}
                        className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm" 
                        placeholder="e.g. 10 for 10% off" 
                        required 
                        type="number"
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Expiration Date</label>
                      <div className="relative">
                        <input 
                          value={formState.expirationDate}
                          onChange={(e) => setFormState({ ...formState, expirationDate: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary text-sm" 
                          type="date" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input 
                        id="activeCheckbox"
                        checked={formState.active}
                        onChange={(e) => setFormState({ ...formState, active: e.target.checked })}
                        type="checkbox"
                        className="w-4.5 h-4.5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-opacity-25"
                      />
                      <label htmlFor="activeCheckbox" className="text-xs font-semibold text-on-surface-variant select-none cursor-pointer">
                        Mark Coupon as Active
                      </label>
                    </div>

                    <div className="flex gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                        Coupons can be applied by users at checkout. Active and non-expired coupons will deduct the set percentage from their cart items' subtotal.
                      </p>
                    </div>
                  </form>
                </div>

                <div className="border-t border-outline-variant/20 pt-6 flex gap-4 mt-8">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-outline-variant hover:border-on-surface text-outline hover:text-on-surface rounded-lg transition-colors font-semibold uppercase text-xs tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    form="couponForm"
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider shadow"
                  >
                    Create Coupon
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

export default AdminCoupons;
