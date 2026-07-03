import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Wishlist = () => {
  const { wishlist, products, toggleWishlist, addToCart } = useApp();

  // Resolve wishlist items to full product objects if they are stored as IDs
  const wishlistItems = (wishlist || [])
    .map(item => {
      if (typeof item === 'string') {
        return products.find(p => (p._id || p.id) === item);
      }
      return item;
    })
    .filter(Boolean); // remove any resolved items that are null/undefined

  const removeItem = (id) => {
    toggleWishlist(id);
  };

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    removeItem(item._id || item.id);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item, 1);
      removeItem(item._id || item.id);
    });
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg px-container-padding max-w-7xl mx-auto text-left relative">
        
        {/* Wishlist Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-outline-variant/10 pb-8 gap-4">
            <div>
              <span className="font-label-lg text-label-lg text-primary uppercase tracking-widest mb-4 block text-xs font-bold">
                Curated Selection
              </span>
              <h1 className="font-display-lg text-headline-xl text-on-surface text-3xl md:text-5xl font-bold">
                Your Wishlist
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs md:text-right font-light text-sm">
              A collection of Tunisian treasures, harvested with intention and saved for your next culinary masterpiece.
            </p>
          </div>
        </header>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/10 shadow-sm"
          >
            <Heart className="h-16 w-16 text-outline-variant mx-auto mb-6" />
            <h2 className="font-headline-md text-primary text-2xl mb-2 font-bold">Your Wishlist is Empty</h2>
            <p className="text-on-surface-variant font-light mb-8 max-w-sm mx-auto text-sm">
              Explore our collections and save your favorite extra virgin olive oils here.
            </p>
            <Link to="/shop" className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-full font-label-lg uppercase tracking-widest text-xs font-bold inline-block">
              Shop Collections
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
              <AnimatePresence>
                {wishlistItems.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <motion.article 
                      key={itemId}
                      layout
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } }}
                      className="group relative bg-surface-container-lowest rounded-xl p-4 transition-all duration-300 border border-outline-variant/10 shadow-sm hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <button 
                          onClick={() => removeItem(itemId)}
                          className="absolute top-6 right-6 z-10 text-primary transition-all duration-300 hover:scale-110 focus:outline-none"
                          aria-label="Remove item"
                        >
                          <Heart className="h-5 w-5 fill-primary text-primary" />
                        </button>
                        
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container mb-6 relative p-4 flex items-center justify-center">
                          <img 
                            src={item.images} 
                            alt={item.title} 
                            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>

                        <div className="px-2 pb-2">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <Link to={`/product/${itemId}`}>
                              <h3 className="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors text-base md:text-lg font-bold">
                                {item.title}
                              </h3>
                            </Link>
                            <button 
                              onClick={() => removeItem(itemId)}
                              className="text-on-surface-variant hover:text-error transition-colors focus:outline-none pt-1"
                              aria-label="Delete"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="font-label-sm text-label-sm text-outline mb-4 uppercase tracking-wider text-[10px] font-semibold">
                            {item.region} • {item.volume}
                          </p>
                        </div>
                      </div>
                      
                      <div className="px-2">
                        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                          <span className="font-body-lg text-body-lg text-primary font-bold text-sm">
                            ${(item.price || 0).toFixed(2)}
                          </span>
                          
                          <button 
                            onClick={() => handleMoveToCart(item)}
                            className="bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg px-5 py-2.5 rounded-full font-label-lg text-label-lg transition-all text-[10px] uppercase font-bold tracking-wider"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer Call to Action */}
            <motion.section 
              layout
              className="mt-section-gap-md py-16 px-container-padding bg-surface-container-low rounded-3xl overflow-hidden relative shadow-sm border border-outline-variant/10 text-center"
            >
              <div className="relative z-10 max-w-2xl mx-auto text-on-surface">
                <h2 className="font-headline-lg text-primary text-headline-lg mb-4 text-xl md:text-3xl font-bold">
                  Complete Your Collection
                </h2>
                <p className="font-body-md text-on-surface-variant opacity-80 mb-8 text-sm font-light leading-relaxed">
                  Move your favorites to the cart and enjoy complimentary shipping on all orders over $100.
                </p>
                <button 
                  onClick={handleAddAllToCart}
                  className="bg-primary text-white px-8 py-4 rounded-full font-label-lg text-label-lg shadow-xl hover:bg-primary-container active:scale-95 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  Add All to Cart
                </button>
              </div>
            </motion.section>
          </>
        )}

      </main>
    </div>
  );
};

export default Wishlist;
