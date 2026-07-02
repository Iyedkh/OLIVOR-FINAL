import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, MapPin, CreditCard, Settings, LogOut, Award, Navigation, Trash2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([
    {
      id: 'carthage-reserve',
      title: 'Carthage Reserve',
      price: 45.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS4rOfiT7oTuOTPornemmeYMWdmPc8IHax0hkkhxoZV8mVw9t1sNRhjSoO8qcAiJuzgHg9KjiIH2LWpd5yRYSyEOl2J1U-LjuesU3LduEQheHvqon0ukpnc92RzcJo_H9FnYPYsknDOnN6fkGqQu9EQLC74xD-I5bKUME5iqDS6TZsEjhe8vstBpq4W5bkBP5CAH_mY0yj774fsqm_PvMxSX0TPjzxcMwtPFWtnUveap61lSX8arvI8A'
    },
    {
      id: 'infusion-trio',
      title: 'Infusion Trio',
      price: 62.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrkek1qbk5FWFWil2kAOqTwl45kvdKeIJhoii4m6zrR4ScQ3jjtNOiYtg1fMxp0ISJ_mjvBp7iUvCH6sFgbhBdD6_boumzygicF8BFtrAN1vLY9FF0kSawGG03KqXYS_EjI5LHx8DpIpRdsfxrBZbbtf3DUDZjQc9KJ6jJZmwTyunUCWgm0dT0WGJa6DSm0zzqCAqqNS8EU6WaO6Ru0Jh_YAk7C6H8hx2JvmB_tkJdVM3xE5d7d0qDzg'
    }
  ]);

  const handleLogout = () => {
    navigate('/login');
  };

  const removeWishlistItem = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  // Circular progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 3250 / 4000; // 3250 points, target is 4000
  const strokeDashoffset = circumference - (progressPercent * circumference);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      
      {/* Wrapper */}
      <div className="pt-24 max-w-[1440px] mx-auto px-gutter relative flex flex-col md:flex-row gap-12">
        
        {/* Left Sidebar (Sticky Sidebar) */}
        <aside className="w-full md:w-72 shrink-0 sticky top-24 self-start bg-surface p-8 rounded-2xl border border-outline-variant/10 md:h-[calc(100vh-140px)] flex flex-col justify-between text-left">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30 select-none">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Alessandro profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1KAi9GR0BkFg0H-_lvt1xszFfyCuyAqzQeR-6vkd0QHU-VL0IYnciKwKc5VynAVcxCgZ3hXbBUrpw-MEQaVbHyazADXz3dC80s5VMwXNGjCS_VSpKWUcxyFWzTcq8fvHv66cbmk5Rvr1Peg6gy5SseASF4ccVY4DzXjju2gkHzToVjEWJJd2WxG7CQ7cNClWj0bmqbd82zFWoh0L6pVbWTxBMqBog1z-pHNZrzSz3s1kLbOimKVHK3w"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-primary">Alessandro Rossi</p>
                <p className="text-xs text-outline font-semibold uppercase tracking-wider">Connoisseur</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-4 text-primary bg-primary/10 px-4 py-3 rounded-lg font-bold text-sm transition-all"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0 text-primary" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/orders" 
                className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container px-4 py-3 rounded-lg font-semibold text-sm transition-all group"
              >
                <Package className="h-4 w-4 shrink-0 text-outline group-hover:text-primary transition-colors" />
                <span>Orders</span>
              </Link>
              
              <a 
                href="#" 
                className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container px-4 py-3 rounded-lg font-semibold text-sm transition-all group"
              >
                <MapPin className="h-4 w-4 shrink-0 text-outline group-hover:text-primary transition-colors" />
                <span>Addresses</span>
              </a>

              <a 
                href="#" 
                className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container px-4 py-3 rounded-lg font-semibold text-sm transition-all group"
              >
                <CreditCard className="h-4 w-4 shrink-0 text-outline group-hover:text-primary transition-colors" />
                <span>Payment Methods</span>
              </a>

              <a 
                href="#" 
                className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container px-4 py-3 rounded-lg font-semibold text-sm transition-all group"
              >
                <Settings className="h-4 w-4 shrink-0 text-outline group-hover:text-primary transition-colors" />
                <span>Settings</span>
              </a>
            </nav>
          </div>

          <div className="pt-6 border-t border-outline-variant/30 mt-8 md:mt-auto space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-4 text-on-surface-variant hover:bg-surface-container px-4 py-3 rounded-lg font-semibold text-sm transition-all group focus:outline-none"
            >
              <LogOut className="h-4 w-4 shrink-0 text-outline group-hover:text-error transition-colors" />
              <span>Logout</span>
            </button>
            <button className="w-full py-4 px-6 rounded-full bg-primary hover:bg-primary-container text-white font-label-lg transition-all active:scale-95 shadow shadow-primary/10 text-xs font-bold uppercase tracking-wider">
              Contact Concierge
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow pb-section-gap-lg text-left">
          
          {/* Header / Welcome Card */}
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-2 text-2xl md:text-4xl font-bold">
                  Welcome back, Alessandro
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
                <button className="px-6 py-3 rounded-full border border-secondary text-secondary font-label-lg hover:bg-secondary/5 transition-colors text-xs font-bold uppercase tracking-wider">
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

              <div className="bg-surface rounded-[2rem] p-8 flex flex-col md:flex-row gap-10 items-center border border-outline-variant/10 shadow-sm">
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 bg-surface-container-low border border-outline-variant/10 select-none">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Reserve collection order preview"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD40OoiWVv_xnC5dw4-hB_yQVZnH7DePYsUumNALvU3I-9BozEsc-BPnlRwX8iVP6djedR-XmvR-Xb-Qzqu3iEVOemKQPvT9O0Xi8EU1dfhkGrTA-fAaJhwVQ61t-JbTRjtHXzJUlqTlH2jgAU2MYnyxZNOFRv26tgLJ5UYCqShqVgXCOXyubReG95p64TyH5tyoW4gCx42kReNuaOD9BHNWEuui49PB0Gq-Pv-Zl05-Wc0KCNKCGxVg"
                  />
                </div>
                
                <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-8 w-full text-left">
                  <div className="space-y-1">
                    <span className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Order ID</span>
                    <p className="font-headline-md text-headline-md text-primary font-bold text-base md:text-lg">#OL-88902</p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Status</span>
                    <p className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0"></span>
                      In Transit
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest text-[9px] font-bold">Est. Delivery</span>
                    <p className="text-on-surface font-semibold text-sm">May 24, 2024</p>
                  </div>
                  
                  <div className="flex items-center md:justify-end">
                    <button className="w-full md:w-auto px-8 py-3 rounded-full border border-secondary text-secondary font-label-lg hover:bg-secondary hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                      Track Package
                    </button>
                  </div>
                </div>
              </div>
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
                  wishlist.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer border border-outline-variant/10 bg-surface text-left"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 select-none">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={item.title}
                          src={item.image}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <p className="font-semibold text-primary text-sm">{item.title}</p>
                        <p className="text-secondary font-bold text-xs">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <button 
                        onClick={() => removeWishlistItem(item.id)}
                        className="text-outline-variant hover:text-error transition-colors focus:outline-none"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))
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
        </main>
      </div>

    </div>
  );
};

export default Dashboard;
