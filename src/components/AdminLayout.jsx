import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut, ArrowLeft, Shield } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingCart },
    { name: 'Orders', path: '/admin/orders', icon: Shield },
    { name: 'Customers', path: '/admin/customers', icon: Users },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col md:flex-row text-left">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-outline-variant/30 p-6 shrink-0 flex flex-col justify-between select-none">
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-primary tracking-wider">OLIV'OR</p>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all duration-300 font-semibold ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-outline'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-outline-variant/30 mt-8 md:mt-auto space-y-4">
          <Link
            to="/"
            className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container hover:text-primary px-4 py-3 rounded-lg font-semibold text-sm transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5 shrink-0 text-outline" />
            <span>Return to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-4 text-on-surface-variant hover:bg-surface-container hover:text-error px-4 py-3 rounded-lg font-semibold text-sm transition-all focus:outline-none"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0 text-outline" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-surface border-b border-outline-variant/30 px-8 flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase tracking-wider text-outline">
            Concierge Management Desk
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-on-surface">Admin Concierge</span>
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Superuser</span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 border border-primary/45 flex items-center justify-center font-bold text-primary select-none text-sm">
              AC
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="p-8 flex-grow">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
