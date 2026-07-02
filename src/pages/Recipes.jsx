import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart2, Bookmark, ArrowRight } from 'lucide-react';

const recipesData = [
  {
    id: 'saffron-risotto',
    title: 'Saffron Infused Risotto',
    time: '45 MIN',
    difficulty: 'Advanced',
    category: 'Main Course',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAusxsWRLqM5suGdnNlXHseWnSsxmm4qecZFlEdgCWtJtIfq8gGUowG7MUv40mZguWkU0h0hd-f7WziV-7QDBBnGYKPlEMV0PNPATudgNiJRaulAD6KNJ7W5irlirrrpm2veTkCARlXRekf1b2i-LRFVc0zU9JQpp599tDxcaoiRRs7U_aIGIghXOR1YXfmIX_4r2JqQVEBEo8mPVlsTfGGMt_0mWlJ1digj4Ynx0iSz86zMcmHp9AF2A'
  },
  {
    id: 'garlic-focaccia',
    title: 'Roasted Garlic Focaccia',
    time: '3 HOURS',
    difficulty: 'Intermediate',
    category: 'Appetizers',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQAE-PlLOm2NI_ezZwUy6nMhMH28iVHoRoS9FI9QK2ICYKiZcijY35DXhyn5j6LsqiFth-K4RKGOV9raGcfAyvwuXQKyLzZWpvwRK5n9UCubWj3zO3uZIL0P3CkW7GPrqtu-Jk4otED15a6OaD1ITHDbnQF6kMJt4i-GXbu2m4wLSjmomSUzDwzBC_Z7Wm-rcUBwdM-aU0dfCeMz86TQ4AoW94YN51YQYTHTHv_bseH3q_vt_4vgf9qA'
  },
  {
    id: 'burrata-heirloom',
    title: 'Burrata & Heirloom',
    time: '15 MIN',
    difficulty: 'Easy',
    category: 'Appetizers',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxPyO-MkED81xdK5ro-GaT3tawLeebr2AD5pYrDJ9qVEn3jO2bbCMAtc030Tt5681uWuNFKw6EbZinhRCHHaSBbTk652NT4-OhO3IcjqaeXK1WnLStHTCuX72zWvlz8HOKE_Jmu9hCXdH9aLg9XpRgj61IYI7amODTQ0O9bNkStPX1w4mGVIgXA8ZqPfgMSBfjUpad1osjNqmYq0KoOLO401IfTv2o-bZDHFY-_4VXTCFa1qzNeIF-w'
  }
];

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarked, setBookmarked] = useState({});

  const toggleBookmark = (id) => {
    setBookmarked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredRecipes = activeCategory === 'All'
    ? recipesData
    : recipesData.filter(r => r.category === activeCategory);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Mediterranean salad olive oil drizzle"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yqbZbz6_wp91bbvZHulUnqL4oMR_2cVa8kwB9moX4Jm6aoE4AQYTRo4Ovxnl6b8jbUDklX3eXndzeTKJUzw5JrlMsH7E_npR3BAEkl5XKLcsOPxx0Po3ZIlAeRGwPjvHBks2wcf5ThHcmX-_IDTjlW7ZrzzdwRib1ht6ISDBYM5iXOWEZaSxm--Skoa0gcq-RRJRTXtnAAVppDrQ21nw801gq0U8osveZjNnZsXIfqhdpl44H3dcgA"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent opacity-70"></div>
        </div>
        <div className="relative z-10 px-container-padding max-w-screen-2xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-left"
          >
            <span className="font-label-lg text-label-lg text-secondary mb-4 block tracking-[0.2em] uppercase text-sm font-semibold">
              Volume IV — The Harvest
            </span>
            <h1 className="font-display-lg text-display-lg text-primary mb-6 text-4xl md:text-6xl lg:text-7xl font-bold">
              The Soul of the Mediterranean
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-8 text-base md:text-lg">
              Explore our curated selection of seasonal recipes, where every drop of Liquid Gold tells a story of heritage and sun-drenched Tunisian soil.
            </p>
            <button className="px-8 py-4 bg-primary hover:bg-primary-container text-white rounded-full font-label-lg text-label-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-primary/20">
              Explore the Journal
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Category Bar */}
      <section className="py-12 border-b border-surface-container">
        <div className="max-w-screen-2xl mx-auto px-container-padding">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12">
            {['All', 'Appetizers', 'Main Course', 'Desserts', 'Infusions'].map((category) => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-label-lg text-label-lg px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipe Section */}
      <section className="py-section-gap-md max-w-screen-2xl mx-auto px-container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] shadow-2xl border border-outline-variant/10"
          >
            <img 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              alt="Citrus sea bass food styling"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdFSdxg0s1bE_LX22IV6zrFPuknQHAyxuQrkroDUzp9vP4Pv58p_LoWgkjDNOXjMphmAvU6Wz1LCYiNwsFEmUrVP2axCQ5FzbQNrcH20gwogFy_b8ESYmK5cyBKJVKXXjtjz7oa9riIJzr2kMTR2ovgv_wv23LstmLrAGiIudsORMh0ohrNw9rAHF8aHlmCZrbfcFG5z0elBv6wBVVcuo3ewJE-XhEzpzijxwMS0HW5UF_OWumMnPp6g"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-8 text-left"
          >
            <div>
              <span className="font-label-lg text-label-lg text-secondary block mb-2 text-xs font-bold tracking-widest">
                FEATURED RECIPE
              </span>
              <h2 className="font-headline-xl text-headline-xl text-primary leading-tight text-2xl md:text-4xl">
                Summer Citrus & Herb Sea Bass
              </h2>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-widest border-b border-outline-variant/30 pb-2 text-xs font-bold">
                Ingredients
              </h3>
              <ul className="space-y-3 font-body-md text-on-surface-variant font-light text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  2 Fresh Whole Sea Bass, butterfly cut
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  100ml OLIV'OR Reserve Selection Olive Oil
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Blood Orange & Meyer Lemon slices
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Sprigs of fresh Oregano and Dill
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Flaky Sea Salt & Pink Peppercorns
                </li>
              </ul>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider text-xs">Prep Time</span>
                <span className="font-headline-md text-headline-md text-primary text-lg md:text-xl font-bold">25 MIN</span>
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider text-xs">Difficulty</span>
                <span className="font-headline-md text-headline-md text-primary text-lg md:text-xl font-bold">Intermediate</span>
              </div>
            </div>
            
            <button className="w-full py-4 border border-secondary text-secondary rounded-full font-label-lg text-label-lg hover:bg-secondary hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-xs">
              View Full Recipe
            </button>
          </motion.div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-section-gap-md bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-container-padding">
          <div className="mb-12 flex justify-between items-end">
            <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl lg:text-3xl">
              Seasonal Inspirations
            </h2>
            <a className="text-label-lg font-label-lg text-secondary hover:underline underline-offset-8 text-xs font-bold uppercase tracking-widest" href="#">
              Browse All Recipes
            </a>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
          >
            {filteredRecipes.map((recipe) => (
              <motion.div 
                key={recipe.id}
                variants={fadeIn}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-outline-variant/10"
              >
                <div className="aspect-[3/4] overflow-hidden bg-surface-container">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={recipe.title}
                    src={recipe.image}
                  />
                </div>
                
                <div className="p-8 text-left">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-headline-md text-headline-md text-primary text-lg md:text-xl">
                      {recipe.title}
                    </h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(recipe.id);
                      }}
                      className="text-outline hover:text-primary transition-colors focus:outline-none"
                    >
                      <Bookmark className={`h-5 w-5 ${bookmarked[recipe.id] ? 'fill-primary text-primary' : 'text-outline-variant hover:text-primary'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-6 text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {recipe.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart2 className="h-4 w-4" /> {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Art of the Drizzle (Narrative Section) */}
      <section className="py-section-gap-lg max-w-4xl mx-auto px-container-padding text-center">
        <span className="font-label-lg text-label-lg text-secondary block mb-6 tracking-widest uppercase text-xs font-bold">
          The Essence of Flavor
        </span>
        <h2 className="font-headline-xl text-headline-xl text-primary mb-8 italic text-2xl md:text-4xl lg:text-5xl">
          The Art of the Drizzle
        </h2>
        
        <div className="space-y-6 font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-sm md:text-base font-light">
          <p>
            Much like a master painter selects their brush, the connoisseur selects their oil. The final drizzle is more than a garnish—it is the signature of the dish. Our <strong className="text-primary font-bold">Reserve Selection</strong>, with its peppery finish, awakens the earthy richness of slow-roasted meats and aged cheeses.
          </p>
          <p>
            For delicate salads and fresh citrus pairings, the <strong className="text-primary font-bold">Gentle Harvest</strong> offers a buttery silkiness that bridges the gap between acidity and sweetness. Understanding these profiles is the secret to elevating a simple meal into a Mediterranean masterpiece.
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <div className="w-12 h-[1px] bg-outline-variant self-center"></div>
          <span className="material-symbols-outlined text-secondary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <div className="w-12 h-[1px] bg-outline-variant self-center"></div>
        </div>
      </section>

      {/* Newsletter / Journal Signup */}
      <section className="px-container-padding pb-section-gap-md">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-screen-2xl mx-auto bg-primary py-16 px-8 rounded-[2rem] text-center text-white relative overflow-hidden shadow-md"
        >
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg mb-4 text-xl md:text-3xl">
              Stories from the Grove
            </h2>
            <p className="font-body-md mb-8 opacity-90 text-on-primary-container text-sm font-light">
              Subscribe to receive monthly recipes, heritage stories, and exclusive access to our limited harvest releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm" 
                placeholder="Enter your email" 
                type="email"
              />
              <button className="px-8 py-4 bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-white rounded-full font-label-lg text-label-lg hover:bg-secondary-fixed-dim transition-colors whitespace-nowrap text-xs font-semibold">
                Join the Journal
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Recipes;
