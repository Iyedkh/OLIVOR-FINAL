import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Navigation, Trash2, ArrowRight, X, Camera, Loader2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, wishlist, toggleWishlist, orders, fetchMyOrders, updateUserProfile, token, API_URL } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });

  useEffect(() => {
    if (fetchMyOrders) {
      fetchMyOrders();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name || '',
        email: user.email || '',
        password: '',
        avatar: user.avatar || '',
      });
    }
  }, [user, isModalOpen]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsUploading(true);
      const { data } = await axios.post(`${API_URL}/upload/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setFormState(prev => ({ ...prev, avatar: data.url }));
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert(err.response?.data?.message || 'Failed to upload avatar image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) {
      alert('Name and Email are required');
      return;
    }

    const userData = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      avatar: formState.avatar,
    };

    if (formState.password) {
      userData.password = formState.password;
    }

    const result = await updateUserProfile(userData);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const removeWishlistItem = (id) => {
    toggleWishlist(id);
  };

  // Circular progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 3250 / 4000; // 3250 points, target is 4000
  const strokeDashoffset = circumference - (progressPercent * circumference);

  return (
    <DashboardLayout>
      {/* Header / Welcome Card */}
      <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-2 text-2xl md:text-4xl font-bold">
                  Welcome back, {user?.name ? user.name.split(' ')[0] : 'Guest'}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/15 text-secondary rounded-full text-label-sm font-label-sm text-xs font-bold">
                    <Award className="h-4 w-4" />
                    Connoisseur Level
                  </span>
                  <span className="text-on-surface-variant/60 font-label-sm text-label-sm text-xs uppercase font-bold tracking-wider">
                    MEMBER SINCE OCT 2021
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 rounded-full border border-secondary text-secondary font-label-lg hover:bg-secondary/5 transition-colors text-xs font-bold uppercase tracking-wider focus:outline-none"
                >
                  Edit Profile
                </button>
                <Link 
                  to="/shop"
                  className="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-white font-label-lg hover:shadow-lg hover:shadow-primary/20 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  New Order
                </Link>
              </div>
            </div>
          </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Rewards Card */}
            <section className="lg:col-span-8 bg-surface p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-surface-container-high" cx="80" cy="80" fill="transparent" r={radius} stroke="currentColor" strokeWidth="8"></circle>
                  <circle 
                    className="text-secondary" 
                    cx="80" 
                    cy="80" 
                    fill="transparent" 
                    r={radius} 
                    stroke="currentColor" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold text-2xl">3,250</span>
                  <span className="font-label-sm text-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Points</span>
                </div>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="font-headline-md text-headline-md text-primary mb-4 text-lg md:text-xl font-bold">
                  Harvest Rewards
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md text-sm font-light leading-relaxed">
                  You are only 750 points away from your complimentary Reserve Series bottle. Your passion for liquid gold is bearing fruit.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button className="px-6 py-2 rounded-full bg-secondary text-white font-label-sm hover:scale-105 transition-transform text-xs font-bold uppercase tracking-wider">
                    Redeem Rewards
                  </button>
                  <button className="px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm hover:bg-surface-container-low transition-colors text-xs font-semibold">
                    How it works
                  </button>
                </div>
              </div>
            </section>

            {/* Saved Address Card */}
            <section className="lg:col-span-4 bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/30 text-left">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline-md text-headline-md text-primary text-lg font-bold">Primary Address</h3>
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1 text-sm font-light text-on-surface-variant">
                  <p className="font-semibold text-on-surface text-base mb-1">Home Sanctuary</p>
                  <p>Via dei Condotti, 12</p>
                  <p>00187 Roma RM</p>
                  <p>Italy</p>
                </div>
              </div>
              <button className="mt-8 text-primary font-label-lg flex items-center gap-2 group text-xs font-bold uppercase tracking-wider focus:outline-none">
                Manage Addresses 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>

            {/* Recent Orders */}
            <section className="lg:col-span-12 space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold">
                  Recent Order
                </h2>
                <Link to="/orders" className="text-on-surface-variant font-label-lg hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
                  View History
                </Link>
              </div>

              {(!orders || orders.length === 0) ? (
                <div className="bg-surface rounded-[2rem] p-8 text-center border border-outline-variant/10 shadow-sm text-on-surface-variant font-light text-sm">
                  No orders placed yet. Make your first purchase in our shop!
                </div>
              ) : (() => {
                const latestOrder = orders[0];
                const orderId = latestOrder._id || latestOrder.id;
                const orderDate = new Date(latestOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                const firstItem = latestOrder.orderItems?.[0] || {};
                const firstImage = firstItem.image || firstItem.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD40OoiWVv_xnC5dw4-hB_yQVZnH7DePYsUumNALvU3I-9BozEsc-BPnlRwX8iVP6djedR-XmvR-Xb-Qzqu3iEVOemKQPvT9O0Xi8EU1dfhkGrTA-fAaJhwVQ61t-JbTRjtHXzJUlqTlH2jgAU2MYnyxZNOFRv26tgLJ5UYCqShqVgXCOXyubReG95p64TyH5tyoW4gCx42kReNuaOD9BHNWEuui49PB0Gq-Pv-Zl05-Wc0KCNKCGxVg';
                return (
                  <div className="bg-surface rounded-[2rem] p-8 flex flex-col md:flex-row gap-10 items-center border border-outline-variant/10 shadow-sm">
                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 bg-surface-container-low border border-outline-variant/10 select-none">
                      <img 
                        className="w-full h-full object-cover" 
                        alt="Order preview"
                        src={firstImage}
                      />
                    </div>
                    
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-8 w-full text-left">
                      <div className="space-y-1">
                        <span className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Order ID</span>
                        <p className="font-headline-md text-headline-md text-primary font-bold text-base md:text-lg">#{orderId.slice(-6).toUpperCase()}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Status</span>
                        <p className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${latestOrder.status === 'Delivered' ? 'bg-primary' : 'bg-secondary animate-pulse'}`}></span>
                          {latestOrder.status || 'Pending'}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Order Date</span>
                        <p className="text-on-surface font-semibold text-sm">{orderDate}</p>
                      </div>
                      
                      <div className="flex items-center md:justify-end">
                        <Link to="/orders" className="w-full md:w-auto px-8 py-3 rounded-full border border-secondary text-secondary font-label-lg hover:bg-secondary hover:text-white transition-all text-xs font-bold uppercase tracking-widest text-center">
                          View Order
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* Wishlist Preview */}
            <section className="lg:col-span-5 space-y-6">
              <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold text-left">
                Your Wishlist
              </h2>
              
               <div className="space-y-4">
                 {wishlist.length === 0 ? (
                   <p className="text-on-surface-variant font-light text-sm text-left">No items saved.</p>
                 ) : (
                   wishlist.map((item) => {
                     const itemId = item._id || item.id || item;
                     // If item is just an ID (e.g. guest), it might not have details, so we display placeholder or basic info
                     const title = item.title || 'Saved Product';
                     const price = item.price || 0.00;
                     const image = item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS4rOfiT7oTuOTPornemmeYMWdmPc8IHax0hkkhxoZV8mVw9t1sNRhjSoO8qcAiJuzgHg9KjiIH2LWpd5yRYSyEOl2J1U-LjuesU3LduEQheHvqon0ukpnc92RzcJo_H9FnYPYsknDOnN6fkGqQu9EQLC74xD-I5bKUME5iqDS6TZsEjhe8vstBpq4W5bkBP5CAH_mY0yj774fsqm_PvMxSX0TPjzxcMwtPFWtnUveap61lSX8arvI8A';
                     return (
                       <div 
                         key={itemId}
                         className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer border border-outline-variant/10 bg-surface text-left"
                       >
                         <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 select-none">
                           <img 
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                             alt={title}
                             src={image}
                           />
                         </div>
                         
                         <div className="flex-grow">
                           <p className="font-semibold text-primary text-sm">{title}</p>
                           <p className="text-secondary font-bold text-xs">${price.toFixed(2)}</p>
                         </div>
                         
                         <button 
                           onClick={() => removeWishlistItem(itemId)}
                           className="text-outline-variant hover:text-error transition-colors focus:outline-none"
                         >
                           <Trash2 className="h-4.5 w-4.5" />
                         </button>
                       </div>
                     );
                   })
                 )}
                
                <Link 
                  to="/wishlist" 
                  className="w-full py-4 mt-2 text-on-surface-variant hover:text-primary font-label-lg border border-dashed border-outline-variant rounded-2xl hover:bg-surface-container-low transition-colors text-xs font-bold uppercase tracking-wider block text-center"
                >
                  View All Wishlist
                </Link>
              </div>
            </section>

            {/* Curated Recommendations */}
            <section className="lg:col-span-7 space-y-6">
              <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold text-left">
                Curated for You
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6 pb-4">
                
                {/* Product 1 */}
                <div className="flex-1 group border border-outline-variant/10 rounded-2xl p-4 bg-surface text-left shadow-sm">
                  <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-4 relative select-none">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
                      alt="Monovarietal Chetoui"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeUKF_9Uzlt58st7y2OCE47YLCvlNofwDEhlPXwfp7mV3mopuAI2BvxtjzUHhABjva6Zk2sxSOQwI0Qwxo-ngqOSU29RKoVpWfCR-LYsQqT5J7KthmllIPkzWMlc2T6JmGW7Zq3SkgZConxha_EctZNNg9qYB4gFAxokt-6SvmT4aqW9F9K6jJlMZssXZjpz3nbyrrWKTHG7BFfcW0L5TAW7Kpuu64IUpNzCEFzVWpqVH0M8VgIqgmjA"
                    />
                    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur px-3 py-1 rounded-full text-label-sm font-label-sm text-primary text-[10px] font-bold">
                      New Season
                    </div>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-1 text-base font-bold">Monovarietal Chetoui</h4>
                  <p className="text-on-surface-variant font-body-md mb-4 text-xs font-light leading-relaxed">Intense aroma with notes of green almond.</p>
                  <Link to="/shop" className="flex items-center gap-2 text-secondary font-label-lg text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                    Explore Collection <ArrowRight className="h-4.5 w-4.5" />
                  </Link>
                </div>

                {/* Product 2 */}
                <div className="flex-1 group border border-outline-variant/10 rounded-2xl p-4 bg-surface text-left shadow-sm">
                  <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-4 relative select-none">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
                      alt="Sommelier Kit"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoU57zRPrvL_AQZqDWuwUiJCsylZjbGR75X7tm4D2Un37l4fy9v4HYtHyP26eyVvj2L97pGvvvt0ULKlkEd_z70aKGKsgwPXgWwTn1ZCbckkC5DXcA9hBy0Cu_Fm3Zsp5pYZulRJbjNTDtxlaBZDO7nahIghQr7KCBlsIi1AqiZORi-Mmu8wLrEOQFTyvPOPAKoRS9OBG1Bk0XnTiUtDzSkc58ibDWWKyadMMaiiaojy2EqRgBZJA_vg"
                    />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-1 text-base font-bold">Sommelier Kit</h4>
                  <p className="text-on-surface-variant font-body-md mb-4 text-xs font-light leading-relaxed">Master the art of olive oil tasting at home.</p>
                  <Link to="/shop" className="flex items-center gap-2 text-secondary font-label-lg text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                    Explore Collection <ArrowRight className="h-4.5 w-4.5" />
                  </Link>
                </div>

              </div>
            </section>

          </div>

          {/* Profile Editor Drawer Modal */}
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
                  className="w-full max-w-lg h-full bg-surface border-l border-outline-variant/30 p-8 flex flex-col justify-between shadow-2xl relative overflow-y-auto"
                >
                  <div>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/15 px-3 py-1.5 rounded-full border border-secondary/20 select-none">
                          Account Profile
                        </span>
                        <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl mt-4 font-bold">
                          Edit Profile Details
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

                    <form id="profileForm" onSubmit={handleFormSubmit} className="space-y-6">
                      
                      {/* Avatar Upload Container */}
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30 group shadow-md select-none flex items-center justify-center">
                          <img 
                            className="w-full h-full object-cover" 
                            src={formState.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'}
                            alt="Avatar preview" 
                          />
                          {isUploading ? (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                              <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                            </div>
                          ) : (
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-opacity">
                              <Camera className="h-5 w-5 mb-1 text-secondary" />
                              Change Photo
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                        <p className="text-[10px] text-outline uppercase tracking-wider font-bold">Upload avatar image (Cloudinary)</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Full Name</label>
                        <input 
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm font-semibold" 
                          placeholder="Your Name" 
                          required 
                          type="text" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Email Address</label>
                        <input 
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm font-semibold" 
                          placeholder="name@example.com" 
                          required 
                          type="email" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline">New Password (leave blank to keep current)</label>
                        <input 
                          value={formState.password}
                          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary text-sm font-semibold" 
                          placeholder="••••••••" 
                          type="password" 
                        />
                      </div>

                      <div className="flex gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                          Your premium membership status and points history will remain secure when changing profile credentials.
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
                      form="profileForm"
                      type="submit"
                      disabled={isUploading}
                      className="flex-1 py-3 bg-primary hover:bg-primary-container disabled:bg-primary/50 text-white rounded-lg transition-colors font-bold uppercase text-xs tracking-wider shadow"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
