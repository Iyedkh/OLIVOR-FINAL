import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ShoppingBag } from 'lucide-react';

const initialWishlistItems = [
  {
    id: 'reserve-collection',
    title: 'Reserve Collection',
    price: 48.00,
    subtitle: 'Harvest 2024 • Extra Virgin',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Dz8i2OLJOY-8k3G0rhaMPWnEDko1NoLrgDICANP03wACkUTNQxWrBZTMqdLYmagbVOl7kqbkzl-n5uj__ZI6tU9_S4gjW0FSdWFCh8LSyMujDkSqoS3-jtAB0Z2jcFFhZbynvz9hp6bKWDtWI0HEpoCBH1EBwxq6E9fpkQmCpyqrHqaHuA1OlKu4i55NJew_YJ1b3T3O4-s41bXQcD1B32RKBWDSSYv75WBcoCI8KbpD1s59yA52Lg'
  },
  {
    id: 'coastal-infusion',
    title: 'Coastal Infusion',
    price: 36.00,
    subtitle: 'Wild Rosemary • Artisanal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC9PF780pHBHHbuS2NSfc10y_SDWfc9YhbWvxlfjPHEq10PJ83wI4Xer-Aoutd4iHtOxDweYLHgu5cdqFIrrma2ifiyrXnWfc8AyCkURu1nDB8ToCjQstFunYiHdX_8XD1o2MoGbYDZvyoRRm9jaQxakGSwqugT9Jq0AjmhlbMcLUQ4reJtkBVSXUnyH8VkaXgBapJuregBQMXx20fnvKskbMROZErD11cpcOuQhlyW94hnD-0iHaRMg'
  },
  {
    id: 'tasting-trio',
    title: 'Tasting Trio',
    price: 82.00,
    subtitle: 'Curated Set • Heritage Seeds',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU_xVS6kK7Eqaw3fOPztWWdz5X0851BpIRJHWp39trxHKcbIxaDBgXFqJ6SN2Ku2RJpyiL5OlYjPo_OgH1rWFmXHliwQIbTdQIPENVvIhwExBJ4pqRYg1DkKl40cn5nF-OYi1y4lnWHsrTVADz-rSkL9vQ7vrMAb8G33JpFlVOdRZjlma5RuvEFiSai8SJiof4ooVgczSFKJIZ-Rj3AKq-TMLxUFE_0b9L3yV7iXTUyGNWulxN5VzFdw'
  },
  {
    id: 'early-harvest',
    title: 'Early Harvest',
    price: 54.00,
    subtitle: 'Polyphenol Rich • Limited Edition',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASo0V4mO97an7axCdhl4HZFjknYdz37FIvOssoGiLe8-d6-1uGNhXBYlQI0v7D8bcBqqXzK0mEiiyCr354YJ-Cn9_LyBnI3hNrPN73sNh5fxPm53uyfLB-WVCJEWK_wVbW905I_6HN_HxXxJBzic33wdG41zY5QAcArf7mCwcUW4J1NSXPdnMWcRWrHBt85e03bKhxuR0CnSckeASDODg7jRlP__BOSKTC6TVNqyK1PG48VCRQtLa5nA'
  }
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(initialWishlistItems);
  const [alertMessage, setAlertMessage] = useState('');

  const removeItem = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (itemTitle) => {
    setAlertMessage(`"${itemTitle}" has been moved to your cart.`);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const handleAddAllToCart = () => {
    setAlertMessage('All items from your wishlist have been moved to your cart.');
    setWishlist([]);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg px-container-padding max-w-7xl mx-auto text-left relative">
        
        {/* Top Floating Alert */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-primary text-white px-8 py-4 rounded-full shadow-2xl z-50 text-sm font-semibold tracking-wider uppercase border border-primary-container"
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>

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
        {wishlist.length === 0 ? (
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
                {wishlist.map((item) => (
                  <motion.article 
                    key={item.id}
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } }}
                    className="group relative bg-surface-container-lowest rounded-xl p-4 transition-all duration-300 border border-outline-variant/10 shadow-sm hover:shadow-md"
                  >
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-6 right-6 z-10 text-primary transition-all duration-300 hover:scale-110 focus:outline-none"
                      aria-label="Remove item"
                    >
                      <Heart className="h-5 w-5 fill-primary text-primary" />
                    </button>
                    
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container mb-6 relative">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                        style={{ backgroundImage: `url('${item.image}')` }}
                      ></div>
                    </div>

                    <div className="px-2 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-headline-md text-headline-md text-on-surface text-base md:text-lg font-bold">
                          {item.title}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant hover:text-error transition-colors focus:outline-none"
                          aria-label="Delete"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="font-label-sm text-label-sm text-secondary-fixed-variant mb-4 uppercase tracking-tighter text-[10px] font-semibold">
                        {item.subtitle}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                        <span className="font-body-lg text-body-lg text-primary font-bold text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                        
                        <button 
                          onClick={() => {
                            handleMoveToCart(item.title);
                            removeItem(item.id);
                          }}
                          className="bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg px-5 py-2.5 rounded-full font-label-lg text-label-lg transition-all text-[10px] uppercase font-bold tracking-wider"
                        >
                          Move to Cart
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer Call to Action (Contextual) */}
            <motion.section 
              layout
              className="mt-section-gap-md py-16 px-container-padding bg-tertiary-container rounded-3xl overflow-hidden relative shadow-sm border border-outline-variant/10"
            >
              <div className="relative z-10 text-center max-w-2xl mx-auto text-on-tertiary-container">
                <h2 className="font-headline-lg text-headline-lg mb-4 text-xl md:text-3xl font-bold">
                  Complete Your Collection
                </h2>
                <p className="font-body-md text-body-md opacity-80 mb-8 text-sm font-light leading-relaxed">
                  Move your favorites to the cart and enjoy complimentary shipping on all orders over $100.
                </p>
                <button 
                  onClick={handleAddAllToCart}
                  className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-label-lg text-label-lg shadow-xl hover:bg-white active:scale-95 transition-all text-xs font-bold uppercase tracking-wider"
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
