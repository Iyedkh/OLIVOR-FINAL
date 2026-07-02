import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as dMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const collectionsData = [
  {
    id: 'premium',
    title: 'Premium Collection',
    category: 'Artisan',
    tag: 'Artisan',
    tagColor: 'text-secondary border-secondary/30',
    description: 'The everyday luxury of Tunisian olives. Balanced, vibrant, and essential for the modern kitchen.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfk38iDiNnltXttTi_O8BR_cjBe99uD1Ld9h8yLj95MJNO8XKFZuFiKFHnM-9ggBIPOv7Sf_6xo2vxreWOZi2ij3uppC34c-Jc21mkqIG_XPBpvHHIAX46AJcf2TL3GROS-u2BeUVeU4V-tADpJekmoCxOD7mv6VoCW7Rui9RniPpzkb3zum1OIi4jDhBjEqvn2bmN_3z8UUuhx7f3yOQK8puyyBuLqiefbmMZtfPav2_nAHABn-UgbQ'
  },
  {
    id: 'reserve',
    title: 'Reserve Collection',
    category: 'Artisan',
    tag: 'Estate',
    tagColor: 'text-secondary border-secondary/30',
    description: 'Single-estate, limited harvest liquid gold. Hand-selected for exceptional depth and character.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhaZPqV7PBfmr1i8vwsFeekydrtgmk_WUG08xDxRcjxF5lVffz_K6RQAS5P1s6WzPzU_QgBupBqzrdjFi4v3TX8XVpQz6gEHHIaScPgAhEf58UZDTVtxXhNsIY36gWAeE84LRRqAkuDIhx2HUGKbj9hFG9RTl7pV9caKkC4GSgigGiKvLb3uyVcVD-h8-XxpccYe8LhbE2nUuc3RywBtZ0WU-l6eXP4Wfw-bz0P5oZNJzP9Jet9Li83w'
  },
  {
    id: 'organic',
    title: 'Organic Collection',
    category: 'Artisan',
    tag: 'Bio-Certified',
    tagColor: 'text-tertiary border-tertiary/30',
    description: 'Certified bio-dynamic farming excellence. Purity and sustainability in every single drop.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi6jF9nhiE_1qXxcbtCxjSpBEHLVO6ohHmcUALtlHxI2jpvB_YsqJDV1tMCBijnI1hgFEaWVlIiAXkS0F8stKVP6WTO6EcxJGQ5nClNvT7lqbmqnUNMlb-3fAGNld9An78pKHnN-Fp0_RLgo5JdtSyQXoc3vnbNccis_EQEAftrGHUJ5ZQBVvjkKwwEY4vrO01_Ww2faSUWt_bTaykBPEkQ9hqhkELCwMHcR0lVMb6kckt2irbhZhWJg'
  },
  {
    id: 'gifts',
    title: 'Gift Boxes',
    category: 'Gifts',
    tag: 'Curated',
    tagColor: 'text-secondary border-secondary/30',
    description: 'Curated sets for the discerning palate. The perfect gesture of Mediterranean hospitality.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjNyZSAmruU_FXLu0QvsDUlxaoFYleZ_G2kCm-sbKuuF7yt60Nxy5rk5P3AZB6crOjJ3zT_3r4EK-I0Sun_eEH1TigK8huKYzm1gFBUFU6My4pMEll9zP9p7UTjFCskvY7amNLgB_m3Nvhlg0ZI8zQiJLAej9d9qzyPdCNbepCvM6jjPFKowXhIo29_HzLSPe5pXNAyklWUjjbbeuAqcj2PRor3PwjgO9h07CkUMh53sP39ph8irahiQ'
  },
  {
    id: 'restaurant',
    title: 'Restaurant Collection',
    category: 'Professional',
    tag: 'Professional',
    tagColor: 'text-outline border-outline/30',
    description: 'Professional-grade formats for fine dining. Trusted by world-renowned chefs for culinary perfection.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzhjbMT8uRtSdFIMLRggOD8bCx4nGtYzMjXLUVACIZCsX-xhniYnPnH6R6nAvb8rV5IE3tq6FZ8cJFRio3IM9qGXQT9Xy4lm1xWMmIlYQvqZ7o-hZqMWg2SibEsYC5lredbHdHEjadTtb0E-g3OPnHm2IgYDgoxxX9oXb-gNhocqRFHkFgDyK-VNMOhgwAuf5yYsMU3Xxz9jLwQUNXgG6alfBD_Lq7uMPXjIp1I3IlS2FfUHdsPWfp0Q'
  },
  {
    id: 'limited-editions',
    title: 'Limited Editions',
    category: 'Gifts',
    tag: 'Rare',
    tagColor: 'text-white border-none bg-secondary',
    description: 'Hand-numbered bottles and rare infusions. Exceptional batches that honor the seasons.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClBrMIorxrcMbcaZWZM8HRwXNses6El-n89zK89YI6ieCrWz1NqAc4W2WnzeYFHWeSzETrrKM3ykjrFWP6h3WDHf29mVC5TdK3omTLgv-sObdnlKz40HMwge85tg93oKbTjLnpQLceUcqtqPkgQwOUVicgbFtzdF275_Hw7nJNEGHXzJaZ4STFLDbca1o8WIeJfHEqYdR84YkCLpOjb1ui_UHCd8cnf0XBh5TD_mV099pBcFqBwhpXxw'
  }
];

const Collections = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCollections = activeFilter === 'All' 
    ? collectionsData 
    : collectionsData.filter(c => c.category === activeFilter);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg">
        
        {/* Hero Section & Filters */}
        <section className="max-w-[1440px] mx-auto px-gutter mb-section-gap-md text-center">
          <dMotion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display-lg text-display-lg text-primary mb-8 text-4xl md:text-6xl"
          >
            The Essence of Tunisia
          </dMotion.h1>
          
          <dMotion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-2xl mx-auto font-body-lg text-body-lg text-on-surface-variant text-base md:text-lg"
          >
            A curation of the Mediterranean's finest liquid gold. Each collection tells a story of sun-drenched groves, artisan dedication, and millenia-old heritage.
          </dMotion.p>
          
          {/* Category Filters */}
          <dMotion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-8"
          >
            {['All', 'Artisan', 'Gifts', 'Professional'].map((filter, index, arr) => (
              <React.Fragment key={filter}>
                <button 
                  onClick={() => setActiveFilter(filter)}
                  className="group relative py-2 px-4 transition-all focus:outline-none"
                >
                  <span className={`font-label-lg text-label-lg uppercase tracking-widest text-sm font-semibold transition-colors duration-300 ${
                    activeFilter === filter ? 'text-primary' : 'text-outline hover:text-primary'
                  }`}>
                    {filter}
                  </span>
                  {activeFilter === filter && (
                    <dMotion.div 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full"
                    />
                  )}
                  {activeFilter !== filter && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
                {index < arr.length - 1 && (
                  <div className="hidden sm:block w-px h-4 bg-outline-variant/50"></div>
                )}
              </React.Fragment>
            ))}
          </dMotion.div>
        </section>

        {/* Collections Grid */}
        <section className="max-w-[1440px] mx-auto px-gutter">
          <dMotion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12"
          >
            {filteredCollections.map((col) => (
              <dMotion.div 
                key={col.id}
                variants={cardVariants}
                className="card-hover cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-surface-container mb-6 border border-outline-variant/10 shadow-sm">
                  <img 
                    className="card-image w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                    alt={col.title}
                    src={col.image}
                  />
                  <div className="card-overlay absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl lg:text-3xl">
                      {col.title}
                    </h3>
                    <span className={`font-label-sm text-label-sm uppercase tracking-tighter border px-2 py-0.5 rounded-full text-xs font-semibold ${col.tagColor}`}>
                      {col.tag}
                    </span>
                  </div>
                  
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-sm font-light">
                    {col.description}
                  </p>
                  
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary group-hover:gap-4 transition-all text-xs font-semibold"
                  >
                    Explore Collection <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </dMotion.div>
            ))}
          </dMotion.div>
        </section>

        {/* Newsletter / Heritage Teaser */}
        <section className="mt-section-gap-lg max-w-[1440px] mx-auto px-gutter">
          <dMotion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-surface-container-high rounded-2xl p-12 md:p-24 flex flex-col items-center text-center shadow-sm"
          >
            <span className="font-label-lg text-label-lg uppercase tracking-[0.2em] text-secondary mb-6 text-xs font-bold">
              The Harvest Journal
            </span>
            <h2 className="font-display-lg text-headline-xl text-primary max-w-3xl mb-8 text-2xl md:text-4xl">
              Receive updates from the groves.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-12 text-sm font-light">
              Be the first to know about our upcoming limited harvests and exclusive collection releases.
            </p>
            <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
              <input 
                className="flex-1 bg-surface border border-outline-variant/30 rounded-full px-8 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-primary placeholder:text-outline-variant text-sm" 
                placeholder="Your email address" 
                type="email"
              />
              <button className="bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg uppercase tracking-widest px-10 py-4 rounded-full hover:scale-[1.02] transition-all active:scale-95 text-xs font-semibold shadow-md">
                Subscribe
              </button>
            </div>
          </dMotion.div>
        </section>
      </main>
    </div>
  );
};

export default Collections;
