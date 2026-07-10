import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/orders',
      label: 'Order History',
      icon: Package
    }
  ];

  const currentPath = location.pathname;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <div className="pt-24 max-w-[1440px] mx-auto px-gutter relative flex flex-col md:flex-row gap-12">
        
        {/* Unified Left Sidebar */}
        <aside className="w-full md:w-72 shrink-0 sticky top-24 self-start bg-surface p-8 rounded-2xl border border-outline-variant/10 md:h-[calc(100vh-140px)] flex flex-col justify-between text-left select-none">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30 select-none flex items-center justify-center">
                <img 
                  className="w-full h-full object-cover" 
                  alt="profile"
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'}
                />
              </div>
              <div>
                <p className="font-bold text-sm text-primary">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-outline font-semibold uppercase tracking-wider">{user?.isAdmin ? 'Admin Concierge' : 'Connoisseur'}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path === '/orders' && currentPath === '/order-history');
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/10 font-bold' 
                        : 'text-on-surface-variant hover:bg-surface-container font-semibold group'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-outline group-hover:text-primary'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
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

        {/* Dynamic Nested Child Pages */}
        <main className="flex-grow pb-section-gap-lg text-left">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
