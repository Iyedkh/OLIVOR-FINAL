import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cart, wishlist } = useApp();

  const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

  const activeClass = (path) => {
    return location.pathname === path
      ? 'border-b-2 border-secondary-container pb-1 text-primary font-semibold'
      : 'text-on-surface-variant font-medium hover:text-secondary';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant/30 transition-all duration-300">
      <div className="flex justify-between items-center px-container-padding py-6 max-w-[1440px] mx-auto w-full relative">
        
        {/* Left Links & Mobile Menu button */}
        <div className="flex items-center gap-gutter">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/shop" className={`font-label-lg text-label-lg transition-colors duration-300 ${activeClass('/shop')}`}>
              Shop
            </Link>
            <Link to="/collections" className={`font-label-lg text-label-lg transition-colors duration-300 ${activeClass('/collections')}`}>
              Collections
            </Link>
            <Link to="/heritage" className={`font-label-lg text-label-lg transition-colors duration-300 ${activeClass('/heritage')}`}>
              About
            </Link>
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link to="/" className="font-logo text-[#F6BE3C] text-2xl md:text-3xl tracking-widest font-bold hover:scale-105 transition-transform duration-300 select-none">
            OLIV'OR
          </Link>
        </div>

        {/* Right Links & Icons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="hidden md:flex gap-6 items-center mr-6">
            <Link to="/recipes" className={`font-label-lg text-label-lg transition-colors duration-300 ${activeClass('/recipes')}`}>
              Recipes
            </Link>
            <Link to="/blog" className={`font-label-lg text-label-lg transition-colors duration-300 ${activeClass('/blog')}`}>
              Blog
            </Link>
          </div>
          
          <div className="flex items-center gap-4 text-primary">
            <button className="hover:scale-110 transition-transform focus:outline-none" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="hover:scale-110 transition-transform focus:outline-none relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F6BE3C] text-primary text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/bag" className="hover:scale-110 transition-transform focus:outline-none relative" aria-label="Shopping Bag">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F6BE3C] text-primary text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/dashboard" className="hover:scale-110 transition-transform focus:outline-none" aria-label="User Account">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-outline-variant/30 px-container-padding py-6 flex flex-col gap-4 animate-fade-in">
          <Link 
            to="/shop" 
            onClick={() => setIsOpen(false)}
            className="font-label-lg text-label-lg text-primary hover:text-secondary py-2 border-b border-outline-variant/10"
          >
            Shop
          </Link>
          <Link 
            to="/collections" 
            onClick={() => setIsOpen(false)}
            className="font-label-lg text-label-lg text-primary hover:text-secondary py-2 border-b border-outline-variant/10"
          >
            Collections
          </Link>
          <Link 
            to="/heritage" 
            onClick={() => setIsOpen(false)}
            className="font-label-lg text-label-lg text-primary hover:text-secondary py-2 border-b border-outline-variant/10"
          >
            About
          </Link>
          <Link 
            to="/recipes" 
            onClick={() => setIsOpen(false)}
            className="font-label-lg text-label-lg text-primary hover:text-secondary py-2 border-b border-outline-variant/10"
          >
            Recipes
          </Link>
          <Link 
            to="/blog" 
            onClick={() => setIsOpen(false)}
            className="font-label-lg text-label-lg text-primary hover:text-secondary py-2 border-b border-outline-variant/10"
          >
            Blog
          </Link>

          {/* Mobile Utility Actions (Search, Wishlist, Bag, Profile) */}
          <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20 mt-2 text-primary">
            <button 
              onClick={() => { setIsOpen(false); alert('Search requested.'); }} 
              className="flex flex-col items-center gap-1 focus:outline-none flex-1"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-outline">Search</span>
            </button>
            <Link 
              to="/wishlist" 
              onClick={() => setIsOpen(false)} 
              className="flex flex-col items-center gap-1 flex-1 text-center"
              aria-label="Wishlist"
            >
              <div className="relative inline-block">
                <Heart className="h-5 w-5 mx-auto" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F6BE3C] text-primary text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-outline">Wishlist</span>
            </Link>
            <Link 
              to="/bag" 
              onClick={() => setIsOpen(false)} 
              className="flex flex-col items-center gap-1 flex-1 text-center"
              aria-label="Shopping Bag"
            >
              <div className="relative inline-block">
                <ShoppingBag className="h-5 w-5 mx-auto" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F6BE3C] text-primary text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-outline">Bag</span>
            </Link>
            <Link 
              to="/dashboard" 
              onClick={() => setIsOpen(false)} 
              className="flex flex-col items-center gap-1 flex-1 text-center"
              aria-label="User Account"
            >
              <User className="h-5 w-5 mx-auto" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-outline">Account</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
