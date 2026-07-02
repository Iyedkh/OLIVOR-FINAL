import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const initialCartItems = [
  {
    id: 'reserve-collection',
    title: 'Reserve Collection',
    price: 85.00,
    subtitle: 'First Cold Press • 500ml',
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqCwuNx50c5IwZDQNtN5F7119nH8JlPLvAswfjKj7P3NM2YI27RioF3r7aGzcNBu5ES6YB1VTFzynN-nQ7FsCwnKxH3UQ2vbTLW7G3H5pXLPffFeTEL59PuqT9qsfvwJSPNiof9B67M8r3abrTga7ueOXlFkq2Kfh6lRopur5nXmGajyPiiQgFfKi3vXdl0xAPE6WvpIhPQv7x211opyB6lpOFnZLHnAG7t7CbZUCQg3RKglyvS1wdew'
  },
  {
    id: 'heritage-blend',
    title: 'Heritage Blend',
    price: 120.00,
    subtitle: 'Multi-Varietal • 750ml',
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhlZ8ksdKhxcz6zekA89FBR5gtSg0cONie5GHDjJvObr5dBUzc9VGCCb84o9JJUfGPvQutc2VaNMdeLXx0hhd_AFDBbqK72YOi1zdIXwDsHoWinmB7yzHD0RFBzId8Yhrfltpkft03yE9dkrO-ZdScKpwX9u1xub1shDOTV-K3U1VYq_BFW4563DXjypmVsgd4jS3kxV8MegfGBWvXmd_Hg1IfWEINLBSwntnDlljEVC4o6N0x-WY9Ag'
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartQty, removeFromCart } = useApp();
  const cartItems = cart;
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const updateQuantity = (id, change) => {
    const item = cart.find(x => x.id === id);
    if (item) {
      const newQty = item.quantity + change;
      if (newQty > 0) {
        updateCartQty(id, newQty);
      }
    }
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'HARVEST10') {
      setDiscount(0.10); // 10% discount
      setPromoSuccess('Promo code HARVEST10 applied: 10% discount!');
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a code.');
    } else {
      setPromoError('Invalid coupon code. Try "HARVEST10".');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.08; // 8% estimated tax
  const total = taxableAmount + tax;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="max-w-[1440px] mx-auto px-container-padding py-32 text-left">
        
        {/* Breadcrumbs & Heading */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-label-sm font-label-sm text-outline-variant mb-4 text-xs tracking-widest uppercase">
            <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary font-semibold">Shopping Bag</span>
          </nav>
          <h2 className="font-headline-xl text-headline-xl text-primary text-3xl md:text-5xl font-bold">
            Your Selection
          </h2>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/10 shadow-sm"
          >
            <ShoppingBag className="h-16 w-16 text-outline-variant mx-auto mb-6" />
            <h3 className="font-headline-md text-primary text-2xl mb-2 font-bold">Your Bag is Empty</h3>
            <p className="text-on-surface-variant font-light mb-8 max-w-sm mx-auto text-sm">
              Discover Tunisia's finest olive oils and curation sets to fill your bag.
            </p>
            <Link to="/shop" className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-full font-label-lg uppercase tracking-widest text-xs font-bold inline-block">
              Shop the Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-8">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }}
                    className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row gap-8 transition-all hover:border-outline-variant/30 group text-left"
                  >
                    <div className="w-full md:w-48 h-64 md:h-48 overflow-hidden rounded-xl bg-surface border border-outline-variant/10 shrink-0 select-none">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" 
                        alt={item.title}
                        src={item.image}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline-md text-headline-md text-primary mb-1 text-lg md:text-xl font-bold">
                            {item.title}
                          </h3>
                          <p className="text-on-surface-variant font-label-lg text-label-lg text-xs font-semibold uppercase tracking-wider">
                            {item.subtitle}
                          </p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-error-container/20 rounded-full transition-colors text-outline hover:text-error focus:outline-none"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center gap-6 bg-surface px-4 py-2 rounded-full border border-outline-variant/20 select-none">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-outline-variant hover:text-primary transition-colors focus:outline-none"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-label-lg text-label-lg w-4 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-outline-variant hover:text-primary transition-colors focus:outline-none"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="font-headline-md text-headline-md text-secondary font-bold text-lg md:text-xl">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="lg:col-span-4 sticky top-32">
              <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
                <h3 className="font-headline-md text-headline-md text-primary mb-8 text-xl font-bold">
                  Summary
                </h3>
                
                {/* Coupon Code */}
                <div className="mb-8">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 block text-xs font-semibold tracking-wider">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-surface border border-outline-variant/30 rounded-lg p-3 flex-1 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                      placeholder="Enter code" 
                      type="text"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="bg-secondary text-white font-label-lg text-label-lg px-6 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-error text-xs mt-2 font-semibold">{promoError}</p>}
                  {promoSuccess && <p className="text-primary text-xs mt-2 font-semibold">{promoSuccess}</p>}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between font-label-lg text-label-lg text-on-surface-variant text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between font-label-lg text-label-lg text-primary text-sm font-semibold">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-label-lg text-label-lg text-on-surface-variant text-sm font-semibold">
                    <span>Shipping</span>
                    <span className="text-primary italic text-xs font-bold">Calculated at next step</span>
                  </div>
                  
                  <div className="flex justify-between font-label-lg text-label-lg text-on-surface-variant text-sm font-semibold">
                    <span>Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-outline-variant/30 flex justify-between">
                    <span className="font-headline-md text-headline-md text-primary font-bold text-lg">Total</span>
                    <span className="font-headline-md text-headline-md text-secondary font-bold text-xl">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg py-5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-md"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <p className="mt-6 text-center text-label-sm font-label-sm text-outline-variant text-[10px] font-bold uppercase tracking-wider">
                  Free shipping on orders over $250.
                </p>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-4 text-outline-variant opacity-70 select-none">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-label-sm text-label-sm text-xs font-semibold uppercase tracking-wider">
                  Secure Tunisian Heritage Sourcing
                </span>
              </div>
            </aside>

          </div>
        )}

      </main>
    </div>
  );
};

export default Cart;
