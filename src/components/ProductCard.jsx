import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

// Texture noise pattern for image fallback
const noisePattern = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E";

// Badge mapping utility
const getBadgeStyle = (badgeText) => {
  if (!badgeText) return '';
  const cleanBadge = badgeText.toLowerCase().trim();
  if (cleanBadge === 'best seller') {
    return 'bg-secondary text-white border border-secondary/20 shadow-sm';
  } else if (cleanBadge === 'new') {
    return 'bg-emerald-700 text-white border border-emerald-800 shadow-sm';
  } else if (cleanBadge.includes('limited')) {
    return 'bg-gradient-to-r from-[#d4af37] to-[#1e3d2f] text-white shadow-md border border-[#d4af37]/35';
  }
  return 'bg-primary text-white border border-primary/20';
};

const ProductCard = ({ product, isFavorite, onToggleWishlist, onAddToCart, onQuickView }) => {
  const productId = product._id || product.id;
  const prodImg = product.images?.[0] || product.image || '';

  const [imageError, setImageError] = useState(false);

  // Reset image error state when image URL changes
  useEffect(() => {
    setImageError(false);
  }, [prodImg]);

  // Retrieve rating and review count
  const ratingValue = product.rating || 0;
  const reviewCount = product.reviews?.length || product.reviewCount || 0;

  // Limited release visual check
  const isLimited = !!(product.badge && product.badge.toLowerCase().trim().includes('limited'));

  // Stock status text
  const renderStockIndicator = () => {
    if (product.stock === undefined || product.stock === null) return null;
    if (product.stock <= 0) {
      return <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider font-mono">Out of Stock</span>;
    }
    if (product.stock <= 5) {
      return <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider font-mono">Only {product.stock} Left</span>;
    }
    return <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider font-mono">In Stock</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="product-card flex flex-col bg-white rounded-[1.5rem] p-4 group cursor-pointer border border-outline-variant/10 hover:border-primary/20 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 justify-between h-full"
    >
      <div className="relative text-left flex-grow">
        {/* Image frame */}
        <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/5] bg-surface-container-low border border-outline-variant/10">
          {imageError ? (
            /* Branded placeholder fallback */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e3d2f]/10 to-[#d4af37]/5 text-primary/40 relative">
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat animate-fadeIn" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              <Leaf className="w-12 h-12 stroke-[1.2] text-[#d4af37] mb-2 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">OLIV'OR RESERVE</span>
            </div>
          ) : (
            <Link to={`/product/${productId}`} className="w-full h-full block">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                alt={product.title}
                src={prodImg}
                onError={() => setImageError(true)}
              />
            </Link>
          )}
          
          {product.badge && (
            <div className={`absolute top-3 left-3 font-mono text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </div>
          )}
        </div>
        
        {/* Quick actions panel */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Wishlist tactile feedback animation */}
          <motion.button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist && onToggleWishlist(productId);
            }}
            whileTap={{ scale: 0.85 }}
            animate={{ scale: isFavorite ? [1, 1.25, 1] : 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 220 }}
            className="w-9 h-9 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-110 focus:outline-none cursor-pointer"
            aria-label="Toggle Wishlist"
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-outline hover:text-primary'}`} />
          </motion.button>

          {onQuickView && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-9 h-9 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
              aria-label="Quick View"
            >
              <Eye className="h-4.5 w-4.5 text-outline hover:text-primary" />
            </button>
          )}
        </div>

        <Link to={`/product/${productId}`}>
          <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block mb-1">
            {product.region || 'Sahel, Tunisia'}
          </span>
          <h4 className="font-serif text-base md:text-lg text-primary mb-2 font-bold group-hover:text-secondary transition-colors truncate">
            {product.title}
          </h4>
          <p className="text-on-surface-variant text-xs mb-4 leading-relaxed line-clamp-2 font-light">
            {product.description}
          </p>
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
          <div className="flex flex-col text-left">
            {/* Rating, review, and stock indicator */}
            <div className="flex items-center gap-1 text-secondary mb-1 flex-wrap">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="text-[10px] font-bold mr-1">
                {ratingValue.toFixed(1)} {reviewCount > 0 && `(${reviewCount})`}
              </span>
              {product.stock !== undefined && product.stock !== null && (
                <>
                  <span className="text-outline-variant text-[10px] select-none mr-1">&bull;</span>
                  {renderStockIndicator()}
                </>
              )}
            </div>
            <span className="font-serif text-base text-primary font-bold">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart && onAddToCart(product, 1);
            }}
            className={`px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 ${
              isLimited 
                ? 'bg-gradient-to-r from-[#d4af37] to-[#1e3d2f] text-white border border-[#d4af37]/35' 
                : 'bg-primary hover:bg-primary-container text-white'
            }`}
          >
            Add <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
