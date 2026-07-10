import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, Search, ArrowLeft, Loader2, MapPin, CreditCard, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderDetails, trackOrderPublicly, user } = useApp();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Public Form inputs
  const [orderIdInput, setOrderIdInput] = useState(id || '');
  const [emailInput, setEmailInput] = useState('');

  // Fetch order if ID is present in URL
  useEffect(() => {
    if (id) {
      const fetchPrivateOrder = async () => {
        setLoading(true);
        setError('');
        const res = await getOrderDetails(id);
        if (res.success) {
          setOrder(res.order);
        } else {
          // If private fetch fails, prepopulate form and show it
          setOrderIdInput(id);
          setError('Could not find order. If you are not logged in, please enter the order billing email below.');
        }
        setLoading(false);
      };
      fetchPrivateOrder();
    }
  }, [id]);

  const handlePublicTrack = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim() || !emailInput.trim()) {
      setError('Please fill in both Order ID and Email address.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    const res = await trackOrderPublicly(orderIdInput.trim(), emailInput.trim());
    if (res.success) {
      setOrder(res.order);
    } else {
      setError(res.message || 'Tracking failed. Please verify your Order ID and Email.');
    }
    setLoading(false);
  };

  const handleResetSearch = () => {
    setOrder(null);
    setError('');
    if (!id) {
      setOrderIdInput('');
      setEmailInput('');
    } else {
      // If we came from order history link, redirect to public route
      navigate('/track-order');
    }
  };

  // Determine active steps based on order attributes
  const getTrackingSteps = (ord) => {
    const status = ord.status || 'Pending';
    const isPaid = ord.isPaid || false;
    const isDelivered = ord.isDelivered || false;

    const steps = [
      {
        label: 'Order Placed',
        desc: 'We have received your olive cellar order.',
        date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '',
        completed: true,
      },
      {
        label: 'Payment Verified & Processing',
        desc: isPaid ? 'Harvest verification complete.' : 'Pending payment verification.',
        date: ord.paidAt ? new Date(ord.paidAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '',
        completed: isPaid || status === 'Processing' || status === 'Shipped' || status === 'In Transit' || status === 'Delivered',
      },
      {
        label: 'In Transit',
        desc: 'Departed from Mediterranean cellar gates.',
        date: ord.status === 'Shipped' || ord.status === 'In Transit' || ord.status === 'Delivered' ? 'On its way' : '',
        completed: status === 'Shipped' || status === 'In Transit' || status === 'Delivered',
      },
      {
        label: 'Delivered',
        desc: isDelivered ? 'Arrived safely at your estate.' : 'Delivery pending.',
        date: ord.deliveredAt ? new Date(ord.deliveredAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '',
        completed: isDelivered || status === 'Delivered',
      },
    ];

    return steps;
  };

  // Status index to calculate progress percentage
  const getProgressIndex = (ord) => {
    const steps = getTrackingSteps(ord);
    const completedCount = steps.filter(s => s.completed).length;
    return (completedCount - 1) / (steps.length - 1);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pt-28 pb-20 select-none text-left">
      <div className="max-w-4xl mx-auto px-gutter">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to={user ? "/orders" : "/"} 
            className="inline-flex items-center gap-2 text-outline-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            {user ? 'Back to Order History' : 'Back to Store'}
          </Link>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-[2rem] border border-outline-variant/30 shadow">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-on-surface-variant font-light text-sm">Querying premium inventory ledger...</p>
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-700 text-sm font-light">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Tracking Update</p>
              <p className="mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* FORM STATE: Input Order ID and Email */}
        {!loading && !order && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-[2rem] border border-outline-variant/30 p-8 md:p-12 shadow-sm max-w-lg mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/20 mb-4">
                <Truck className="h-7 w-7" />
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">Track Shipment</h1>
              <p className="text-on-surface-variant font-light text-sm mt-1">Review tracking status of your Mediterranean order.</p>
            </div>

            <form onSubmit={handlePublicTrack} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Order ID</label>
                <input 
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm font-semibold tracking-wider" 
                  placeholder="e.g. 64b3c9f28d83..." 
                  required 
                  type="text" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Billing / Shipping Email</label>
                <input 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm font-semibold" 
                  placeholder="name@domain.com" 
                  required 
                  type="email" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-primary hover:bg-primary-container text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider shadow mt-4 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" /> Track Shipment
              </button>
            </form>
          </motion.div>
        )}

        {/* SUCCESS STATE: Display interactive order tracking details */}
        {!loading && order && (() => {
          const steps = getTrackingSteps(order);
          const progressVal = getProgressIndex(order);
          const orderId = order._id || order.id;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Top Summary Card */}
              <div className="bg-surface rounded-[2rem] border border-outline-variant/30 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 text-xs mb-1">
                    <span className="font-bold text-primary tracking-wider uppercase">Order ID: #{orderId.slice(-6).toUpperCase()}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                    <span className="font-light text-on-surface-variant">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-primary font-bold text-2xl md:text-3xl">
                    Shipped to {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </h2>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleResetSearch}
                    className="px-6 py-3 rounded-full border border-secondary text-secondary font-label-lg hover:bg-secondary/5 transition-colors text-xs font-bold uppercase tracking-wider focus:outline-none"
                  >
                    Track another
                  </button>
                </div>
              </div>

              {/* Progress & Stepper Timeline Card */}
              <div className="bg-surface rounded-[2rem] border border-outline-variant/30 p-8 shadow-sm text-left">
                <h3 className="font-headline-md text-headline-md text-primary font-bold text-lg mb-8">Delivery Progress</h3>
                
                {/* Horizontal Progress bar for medium/large screens */}
                <div className="hidden md:block relative mb-12 px-6">
                  {/* Base grey line */}
                  <div className="absolute left-6 right-6 top-[22px] h-[2px] bg-outline-variant/20 -translate-y-1/2"></div>
                  {/* Active gold progress line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressVal * 100}%` }}
                    className="absolute left-6 top-[22px] h-[2px] bg-secondary -translate-y-1/2"
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  ></motion.div>

                  {/* Stepper nodes */}
                  <div className="flex justify-between relative z-10">
                    {steps.map((step, idx) => {
                      let Icon = Package;
                      if (idx === 1) Icon = Clock;
                      if (idx === 2) Icon = Truck;
                      if (idx === 3) Icon = CheckCircle;

                      return (
                        <div key={idx} className="flex flex-col items-center max-w-[180px] text-center">
                          <div className={`w-11 h-11 rounded-full border-4 border-surface flex items-center justify-center shadow-sm transition-all duration-500 ${
                            step.completed ? 'bg-secondary text-white scale-110' : 'bg-surface-container-high text-outline'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs font-bold mt-4 uppercase tracking-wider block ${step.completed ? 'text-primary' : 'text-outline-variant'}`}>
                            {step.label}
                          </span>
                          <span className="text-[10px] font-semibold text-outline block mt-1">
                            {step.date || step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vertical Stepper timeline for mobile screen size */}
                <div className="md:hidden space-y-8 relative pl-6 pb-2">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-outline-variant/20"></div>
                  <div className="absolute left-[7px] top-2 h-full w-[2px] bg-secondary origin-top" style={{ transform: `scaleY(${progressVal})` }}></div>

                  {steps.map((step, idx) => {
                    let Icon = Package;
                    if (idx === 1) Icon = Clock;
                    if (idx === 2) Icon = Truck;
                    if (idx === 3) Icon = CheckCircle;

                    return (
                      <div key={idx} className="flex gap-4 items-start relative z-10">
                        <div className={`w-8 h-8 rounded-full border-4 border-surface flex items-center justify-center shadow-sm shrink-0 ${
                          step.completed ? 'bg-secondary text-white' : 'bg-surface-container-high text-outline'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className={`font-bold text-xs uppercase tracking-wider ${step.completed ? 'text-primary' : 'text-outline-variant'}`}>
                            {step.label}
                          </h4>
                          <p className="text-xs font-light text-on-surface-variant mt-0.5">{step.desc}</p>
                          {step.date && <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">{step.date}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info & Products List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Products Summary Card */}
                <div className="md:col-span-8 bg-surface rounded-[2rem] border border-outline-variant/30 p-8 shadow-sm text-left">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold text-lg mb-6">Package Contents</h3>
                  <div className="divide-y divide-outline-variant/10">
                    {order.orderItems.map((item, idx) => {
                      const firstImage = item.image || (item.images && item.images.length > 0 ? item.images[0] : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD40OoiWVv_xnC5dw4-hB_yQVZnH7DePYsUumNALvU3I-9BozEsc-BPnlRwX8iVP6djedR-XmvR-Xb-Qzqu3iEVOemKQPvT9O0Xi8EU1dfhkGrTA-fAaJhwVQ61t-JbTRjtHXzJUlqTlH2jgAU2MYnyxZNOFRv26tgLJ5UYCqShqVgXCOXyubReG95p64TyH5tyoW4gCx42kReNuaOD9BHNWEuui49PB0Gq-Pv-Zl05-Wc0KCNKCGxVg');
                      return (
                        <div key={idx} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 group">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-surface-container-low rounded-lg overflow-hidden shrink-0 border border-outline-variant/10 select-none">
                              <img 
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                                alt={item.title}
                                src={firstImage}
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-primary text-sm">{item.title}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant font-light">
                                <span>Size: {item.volume || '500ml'}</span>
                                <span>•</span>
                                <span>Qty: {item.qty}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-primary text-sm">${((item.price || 45) * item.qty).toFixed(2)}</p>
                            <p className="text-[10px] text-outline">${(item.price || 45).toFixed(2)} each</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping & Payment Meta Column */}
                <div className="md:col-span-4 space-y-6 text-left">
                  
                  {/* Address Box */}
                  <div className="bg-surface rounded-[2rem] border border-outline-variant/30 p-8 shadow-sm">
                    <div className="flex items-center gap-3 text-primary mb-4">
                      <MapPin className="h-5 w-5" />
                      <h4 className="font-bold text-xs uppercase tracking-wider">Destination</h4>
                    </div>
                    <div className="text-xs font-light text-on-surface-variant space-y-1">
                      <p className="font-semibold text-on-surface text-sm">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-surface rounded-[2rem] border border-outline-variant/30 p-8 shadow-sm">
                    <div className="flex items-center gap-3 text-primary mb-4">
                      <CreditCard className="h-5 w-5" />
                      <h4 className="font-bold text-xs uppercase tracking-wider">Order Summary</h4>
                    </div>
                    <div className="text-xs font-light text-on-surface-variant space-y-2">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-on-surface">${(order.itemsPrice || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping Cost</span>
                        <span className="font-semibold text-on-surface">${(order.shippingPrice || 0).toFixed(2)}</span>
                      </div>
                      {order.discountPrice > 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>Discount Applied</span>
                          <span className="font-semibold">-${(order.discountPrice).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-outline-variant/10 text-sm font-bold text-primary">
                        <span>Total Price</span>
                        <span>${(order.totalPrice || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          );
        })()}

      </div>
    </div>
  );
};

export default TrackOrder;
