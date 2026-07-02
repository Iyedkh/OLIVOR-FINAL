import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Filter, Download, ChevronRight, User, Receipt, RefreshCw, Heart, Settings, HelpCircle, Package, ArrowRight, Clock, Box } from 'lucide-react';

const initialOrders = [
  {
    id: 'ORD-7721',
    title: 'The Sahel Autumn Harvest',
    date: 'October 12, 2023',
    status: 'Delivered',
    statusBg: 'bg-primary/10 text-primary',
    statusDot: 'bg-primary',
    items: [
      {
        name: 'Reserve Collection',
        spec: '500ml • Glass Cask',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhQk1-2Psf_06amlvJMA1emVa_y663K8OXN3RU5r1pKxuZmtkRZg7JAu0SMDrXXeBkQhQWoAfrCZhHeL9UxQ4eynxXUMrwxSvNSpOvE8JB0bKklPA9RDMKLPVRewGOdMqQ-lXLVw7FgfbWPfGF445fiw1hXfVKd0GDvYNYLprU5E4qMW6pnIuKCoDqAcZdGG7YzA7gcfSOnYk32K9nrdlwL2my2m9eHylPLRFw9YbsdeL1leAS4xEKkQ'
      },
      {
        name: 'Heritage Blend',
        spec: '250ml • Limited Edition',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY2erfSA8g6Y0PPxCA7CI51b6gPAfBaeJONvPAr81dxk8673zS2TyL2naAenxwjnnJA-bZRFC4dJ4F3s-i3XiW6KUFSv5Qiq20JmDssMk3qQinoe2Q6f2MbLRo8MKn4n5kRrvJsDGObm-IimSW1Dz_v7-TqYZxSfEkL04iLgIxpiONvo3GQ0p9ciCEql-8JjVxcm3geUtDa2U_V7Hl9NvYuqWYoNP3uHuDJYzVAvtUjgybYP7pdtuAYg'
      }
    ],
    timeline: [
      { title: 'Delivered', desc: 'Signature received at 2:45 PM • Oct 15', active: true },
      { title: 'In Transit', desc: 'Carrier: Global Express • Tunis Port', active: false },
      { title: 'Harvested & Bottled', desc: 'Estate Mill • Sousse District', active: false }
    ]
  },
  {
    id: 'ORD-8944',
    title: 'Spring Culinary Select',
    date: 'March 04, 2024',
    status: 'In Transit',
    statusBg: 'bg-secondary/15 text-secondary',
    statusDot: 'bg-secondary animate-pulse',
    items: [
      {
        name: 'Sommelier Discovery Set',
        spec: '3x 100ml • Trio',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy_lNAKYNlZeC_SpV95mC5nJVZ4BedQ0nvtNXR1oMkYcJN2pLU-qWUhePE2kJopmMmNKimfT_kusupY2jzb0-HFAkCyh3nJ1AFK0szkRclnZYg-QTY4vU0rqIqIdudrNeprqp9vI3TyOGGep554Ph8VOTB2ZDFjxZHmwCfzSgE517XsxpKbhAimwwbM151F70BwAQ1xePmgV3BvKUDqhGpPAPLqAA7qVZXXeHTw8dS5DkHATS1QTf0Nw'
      }
    ],
    timeline: [
      { title: 'Delivered', desc: 'Pending arrival', active: false, opacity: 'opacity-40' },
      { title: 'In Transit', desc: 'Arriving Tomorrow by 8 PM', active: true },
      { title: 'Harvested & Bottled', desc: 'Certified Organic Estate • Mar 05', active: true }
    ]
  }
];

const OrderHistory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.title.toLowerCase().includes(search.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      
      {/* Wrapper */}
      <div className="pt-24 max-w-[1440px] mx-auto px-gutter relative flex flex-col md:flex-row gap-12">
        
        {/* Left Sidebar (Sticky Sidebar) */}
        <aside className="w-full md:w-72 shrink-0 bg-surface p-8 rounded-2xl border border-outline-variant/10 md:h-[calc(100vh-140px)] sticky top-24 self-start flex flex-col justify-between text-left select-none">
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <span className="font-headline-md text-headline-md text-primary text-xl font-bold">Alessandro Rossi</span>
              <p className="font-label-sm text-on-surface-variant opacity-70 text-xs font-semibold uppercase tracking-wider">Connoisseur Member</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container rounded-full transition-transform hover:translate-x-1 duration-200 text-sm font-semibold group"
              >
                <User className="h-4.5 w-4.5 text-outline group-hover:text-primary transition-colors" />
                <span>My Profile</span>
              </Link>
              
              <Link 
                to="/orders" 
                className="flex items-center gap-3 py-3 px-4 bg-secondary-container text-on-secondary-container rounded-full transition-transform hover:translate-x-1 duration-200 text-sm font-bold"
              >
                <Receipt className="h-4.5 w-4.5 text-secondary" />
                <span>Order History</span>
              </Link>
              
              <a 
                href="#" 
                className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container rounded-full transition-transform hover:translate-x-1 duration-200 text-sm font-semibold group"
              >
                <RefreshCw className="h-4.5 w-4.5 text-outline group-hover:text-primary transition-colors" />
                <span>Subscriptions</span>
              </a>

              <a 
                href="#" 
                className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container rounded-full transition-transform hover:translate-x-1 duration-200 text-sm font-semibold group"
              >
                <Heart className="h-4.5 w-4.5 text-outline group-hover:text-primary transition-colors" />
                <span>Saved Harvests</span>
              </a>

              <a 
                href="#" 
                className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container rounded-full transition-transform hover:translate-x-1 duration-200 text-sm font-semibold group"
              >
                <Settings className="h-4.5 w-4.5 text-outline group-hover:text-primary transition-colors" />
                <span>Settings</span>
              </a>
            </nav>
          </div>

          <div className="mt-8 md:mt-auto p-4 bg-surface-container-high/30 rounded-2xl border border-outline-variant/10 text-left">
            <p className="font-label-sm text-on-surface-variant mb-3 text-xs font-semibold uppercase tracking-wider">Need assistance?</p>
            <button className="w-full py-2 bg-primary hover:bg-primary-container text-white rounded-full font-label-lg hover:scale-[1.02] active:scale-95 transition-all text-xs font-bold uppercase tracking-wider shadow shadow-primary/10">
              Contact Sommelier
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pb-section-gap-lg text-left">
          
          <header className="mb-12">
            <h1 className="font-display-lg text-headline-xl text-primary mb-8 text-3xl md:text-5xl font-bold">
              Your Archives
            </h1>
            
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant h-5 w-5 pointer-events-none" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-on-surface font-body-md placeholder:text-outline-variant text-sm focus:ring-0" 
                  placeholder="Search by Order ID or Product" 
                  type="text" 
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto px-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl font-label-lg whitespace-nowrap hover:bg-surface-variant transition-colors text-xs font-semibold">
                  <Calendar className="h-4 w-4" />
                  Past 6 Months
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl font-label-lg whitespace-nowrap hover:bg-surface-variant transition-colors text-xs font-semibold">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>
          </header>

          <section className="space-y-8">
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <p className="text-on-surface-variant font-light text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-sm">
                  No orders found matching your search.
                </p>
              ) : (
                filteredOrders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 hover:border-outline-variant/30 transition-all duration-300 shadow-sm"
                  >
                    
                    {/* Order header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-outline-variant/10 pb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1 text-xs">
                          <span className="font-bold text-primary tracking-wider">{order.id}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                          <span className="font-light text-on-surface-variant">{order.date}</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-primary font-bold text-lg md:text-xl">
                          {order.title}
                        </h2>
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-full font-label-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${order.statusBg}`}>
                        <span className={`w-2 h-2 rounded-full ${order.statusDot}`}></span>
                        {order.status}
                      </div>
                    </div>

                    {/* Order content */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Products Summary */}
                      <div className="md:col-span-6 flex flex-col gap-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 group">
                            <div className="w-16 h-20 bg-surface-container-low rounded-lg overflow-hidden shrink-0 border border-outline-variant/10 select-none">
                              <img 
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                                alt={item.name}
                                src={item.image}
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-primary text-sm">{item.name}</p>
                              <p className="font-light text-on-surface-variant text-xs">{item.spec}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Timeline Tracking */}
                      <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-outline-variant/20 pt-6 md:pt-0 md:pl-8 text-left">
                        <div className="flex flex-col gap-6 relative">
                          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-outline-variant/20"></div>
                          
                          {order.timeline.map((step, sIdx) => (
                            <div 
                              key={sIdx} 
                              className={`flex gap-4 items-start relative z-10 ${step.opacity || ''}`}
                            >
                              <div className={`w-[15px] h-[15px] rounded-full mt-1 border-4 border-white ${
                                step.active ? 'bg-primary' : 'bg-outline-variant'
                              }`}></div>
                              <div>
                                <p className={`font-semibold text-sm ${step.active ? 'text-primary' : 'text-on-surface-variant'}`}>
                                  {step.title}
                                </p>
                                <p className="text-on-surface-variant text-xs font-light">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Order card footer actions */}
                    <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <a 
                        className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider hover:underline underline-offset-4 focus:outline-none" 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Invoice download has been requested.');
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download Invoice
                      </a>
                      
                      <div className="flex gap-4 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-8 py-3 border border-secondary text-secondary rounded-full font-label-lg hover:bg-secondary/5 transition-all hover:scale-[1.02] text-xs font-bold uppercase tracking-wider">
                          Track Package
                        </button>
                        <button className="flex-1 sm:flex-none px-8 py-3 bg-primary hover:bg-primary-container text-white rounded-full font-label-lg hover:scale-[1.02] transition-all text-xs font-bold uppercase tracking-wider shadow">
                          Reorder
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </section>

          {/* Load More */}
          <div className="mt-16 text-center">
            <button className="group flex items-center gap-2 mx-auto px-8 py-4 bg-surface hover:bg-surface-container border border-outline-variant/30 text-on-surface-variant rounded-full font-label-lg hover:text-primary transition-all text-xs font-bold uppercase tracking-widest">
              View Complete History
              <ChevronRight className="h-4 w-4 rotate-90 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

        </main>
      </div>

    </div>
  );
};

export default OrderHistory;
