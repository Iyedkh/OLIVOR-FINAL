import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Leaf, Hand, Droplet, ArrowLeft, ArrowRight, ChevronDown, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Tab/section background texture (embedded data URI)
const noisePattern = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E";

// Consistent StarRating component
const StarRating = ({ value = 0, size = 'sm' }) => {
  const starSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4.5 w-4.5',
    lg: 'h-6 w-6'
  };
  const sizeClass = starSizes[size] || starSizes.sm;

  return (
    <div className="flex text-secondary select-none gap-0.5">
      {[...Array(5)].map((_, i) => {
        const isFilled = i < value;
        return (
          <Star 
            key={i} 
            className={`${sizeClass} ${isFilled ? 'fill-secondary text-secondary font-bold' : 'text-outline'}`} 
          />
        );
      })}
    </div>
  );
};

const Home = () => {
  const { products, addToCart, wishlist, toggleWishlist } = useApp();
  const scrollerRef = useRef(null);
  const navigate = useNavigate();
  
  const [bgIndex, setBgIndex] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroScrolled, setIsHeroScrolled] = useState(false);

  // Rotating luxury backgrounds with unique title overlays and details
  const heroBackgrounds = [
    { 
      url: '/bg.png', 
      position: 'center -20%',
      label: 'Reserve Collection Harvest',
      subline: 'First Full Moon of October'
    },
    { 
      url: '/mediterranean_olive_grove_1782986766051.jpg', 
      position: 'center',
      label: 'The Sahel Terraces',
      subline: 'Sustained by Sea Breezes Since Antiquity'
    }
  ];

  // Rotating customer review quotes
  const testimonials = [
    {
      quote: "This isn't just olive oil; it's a sensory journey to Tunisia. The complexity of the Reserve Collection changed how I approach my cooking forever.",
      author: "Elena Rossi",
      title: "Executive Chef",
      rating: 5
    },
    {
      quote: "Liquid gold. The texture is velvety, and the peppery finish indicates the incredibly high polyphenol content. Truly world-class.",
      author: "Marcus Vane",
      title: "Private Chef & Sommelier",
      rating: 5
    },
    {
      quote: "The organic integrity and craftsmanship are evident in every drop. Our guests immediately note the difference in flavor profile.",
      author: "Sofia Al-Jamil",
      title: "Restaurateur",
      rating: 5
    }
  ];

  // Load Google Font and prefetch hero backgrounds
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Prefetch images
    heroBackgrounds.forEach((bg) => {
      const img = new Image();
      img.src = bg.url;
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Background rotators
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestiIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Window scroll listener for scroll-down indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsHeroScrolled(true);
      } else {
        setIsHeroScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollerScroll = () => {
    if (scrollerRef.current) {
      const element = scrollerRef.current;
      const totalWidth = element.scrollWidth - element.clientWidth;
      if (totalWidth > 0) {
        const progress = (element.scrollLeft / totalWidth) * 100;
        setScrollProgress(progress);
      }
    }
  };

  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Badge mapping helper for catalog scroller
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="overflow-hidden bg-surface-container-low">
      
      {/* Hero Section */}
      <section className="relative h-[103vh] flex items-center justify-center overflow-hidden rounded-b-[3.5rem] md:rounded-b-[5rem] lg:rounded-b-[8rem]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {heroBackgrounds.map((bgObj, idx) => (
            <div 
              key={bgObj.url}
              className={`absolute inset-0 w-full h-full bg-cover transition-opacity duration-[1800ms] ease-in-out ${
                bgIndex === idx ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                backgroundImage: `url('${bgObj.url}')`,
                backgroundPosition: bgObj.position 
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-container-padding mt-20 text-center mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white flex flex-col items-center justify-center space-y-6"
          >
            {/* Short dynamic sub-line badge per rotating image */}
            <AnimatePresence mode="wait">
              <motion.span 
                key={`label-${bgIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4af37] mb-2 block font-bold bg-[#1e3d2f]/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#d4af37]/25 select-none"
              >
                {heroBackgrounds[bgIndex].label}
              </motion.span>
            </AnimatePresence>

            <h1 
              className="font-serif leading-tight text-4xl md:text-6xl lg:text-7xl max-w-3xl mx-auto font-bold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              From the Heart of Tunisia to Your Table
            </h1>

            {/* Dynamic details overlay content */}
            <AnimatePresence mode="wait">
              <motion.p 
                key={`sub-${bgIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="font-body-lg text-body-lg text-white/90 leading-relaxed max-w-2xl mx-auto mb-6 font-light"
              >
                {heroBackgrounds[bgIndex].subline} &bull; Experience the liquid gold of the Mediterranean, cold-pressed with ancestral devotion.
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full sm:w-auto">
              <Link 
                to="/shop" 
                className="bg-primary hover:bg-primary-container text-white font-mono text-[10px] uppercase tracking-widest px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20 text-center min-w-[200px] font-bold"
              >
                Shop Collection
              </Link>
              
              {/* Differentiated discover link with animated hover underline */}
              <Link 
                to="/heritage" 
                className="group flex items-center justify-center gap-2 text-white font-mono text-[10px] uppercase tracking-widest py-4 relative focus:outline-none min-w-[200px]"
              >
                <span className="relative z-10 font-bold">Discover Our Story</span>
                <span className="absolute bottom-1 w-12 group-hover:w-full h-[1.5px] bg-[#d4af37] transition-all duration-300"></span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll-down indicators */}
        <AnimatePresence>
          {!isHeroScrolled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/70 select-none cursor-pointer"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight * 0.92,
                  behavior: 'smooth'
                });
              }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-[#d4af37]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Why Choose OLIV'OR Section */}
      <section className="pt-16 pb-12 px-container-padding bg-surface-container-low relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative"
        >
          {/* Curved Dotted sequence path line */}
          <div className="absolute top-12 left-[15%] right-[15%] h-6 hidden md:block z-0 pointer-events-none">
            <svg className="w-full h-full text-[#d4af37]/35" viewBox="0 0 800 20" preserveAspectRatio="none" fill="none">
              <motion.path 
                d="M 0 10 Q 200 0, 400 10 T 800 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeDasharray="5 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              />
            </svg>
          </div>

          <motion.div variants={fadeIn} className="group relative z-10">
            {/* Embossed textured wax-seal medallion */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative text-[#d4af37] shadow-xl border-2 border-[#d4af37]/20 bg-gradient-to-br from-[#1e3d2f] to-[#12241c] overflow-hidden group-hover:scale-108 transition-all duration-500">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/25"></div>
              <Leaf className="w-8 h-8 relative z-10" />
            </div>
            <h3 
              className="font-serif text-headline-md text-primary mb-4 font-bold"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              100% Organic
            </h3>
            <p className="text-on-surface-variant leading-relaxed text-body-md font-light text-sm">
              Certified organic farming practices that respect the Tunisian soil and promote biodiversity.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="group relative z-10">
            {/* Embossed textured wax-seal medallion */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative text-[#d4af37] shadow-xl border-2 border-[#d4af37]/20 bg-gradient-to-br from-[#1e3d2f] to-[#12241c] overflow-hidden group-hover:scale-108 transition-all duration-500">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/25"></div>
              <Hand className="w-8 h-8 relative z-10" />
            </div>
            <h3 
              className="font-serif text-headline-md text-primary mb-4 font-bold"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Hand-Harvested
            </h3>
            <p className="text-on-surface-variant leading-relaxed text-body-md font-light text-sm">
              Each olive is gently hand-picked at peak ripeness to ensure zero bruising and maximum flavor profile.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="group relative z-10">
            {/* Embossed textured wax-seal medallion */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative text-[#d4af37] shadow-xl border-2 border-[#d4af37]/20 bg-gradient-to-br from-[#1e3d2f] to-[#12241c] overflow-hidden group-hover:scale-108 transition-all duration-500">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/25"></div>
              <Droplet className="w-8 h-8 relative z-10" />
            </div>
            <h3 
              className="font-serif text-headline-md text-primary mb-4 font-bold"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              First Cold Pressed
            </h3>
            <p className="text-on-surface-variant leading-relaxed text-body-md font-light text-sm">
              Extracted without heat or chemicals, preserving the antioxidants and polyphenols for pure health.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Scroller */}
      <section className="py-20 overflow-hidden bg-background">
        <div className="max-w-[1440px] mx-auto px-container-padding mb-12 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[10px] text-secondary uppercase tracking-widest block mb-2 font-bold">
              Curated Selection
            </span>
            <h2 
              className="font-serif text-headline-xl text-primary font-bold tracking-tight text-3xl md:text-4xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Seasonal Collections
            </h2>
          </motion.div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollLeft}
              className="p-4 rounded-full border border-[#1e3d2f]/20 hover:border-transparent text-primary hover:bg-gradient-to-br hover:from-[#d4af37] hover:to-[#1e3d2f] hover:text-white transition-all focus:outline-none cursor-pointer"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-4 rounded-full border border-[#1e3d2f]/20 hover:border-transparent text-primary hover:bg-gradient-to-br hover:from-[#d4af37] hover:to-[#1e3d2f] hover:text-white transition-all focus:outline-none cursor-pointer"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div 
          ref={scrollerRef}
          onScroll={handleScrollerScroll}
          className="flex gap-6 px-container-padding overflow-x-auto scroller-hide snap-x scroll-smooth"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {products && products.slice(0, 6).map((product) => {
            const productId = product._id || product.id;
            const isInWishlist = (wishlist || []).some(
              item => (item._id || item.id || item) === productId
            );
            return (
              <motion.div 
                key={productId}
                variants={fadeIn}
                className="w-[280px] md:w-[340px] flex-shrink-0 bg-white rounded-[1.5rem] p-4 group cursor-pointer snap-start border border-outline-variant/20 hover:border-primary/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative text-left">
                  {/* Image frame */}
                  <Link to={`/product/${productId}`}>
                    <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/5] bg-surface-container-low border border-outline-variant/10">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                        alt={product.title}
                        src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                      />
                      {product.badge && (
                        <div className={`absolute top-3 left-3 font-mono text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${getBadgeStyle(product.badge)}`}>
                          {product.badge}
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Quick wishlist button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(productId);
                    }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isInWishlist ? 'fill-primary text-primary' : 'text-outline hover:text-primary'}`} />
                  </button>

                  <Link to={`/product/${productId}`}>
                    <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block mb-1">
                      {product.region || 'Sahel, Tunisia'}
                    </span>
                    <h4 
                      className="font-serif text-base md:text-lg text-primary mb-2 font-bold group-hover:text-secondary transition-colors truncate"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {product.title}
                    </h4>
                    <p className="text-on-surface-variant text-xs mb-4 leading-relaxed font-body-md line-clamp-2 font-light">
                      {product.description}
                    </p>
                  </Link>
                </div>

                <div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-outline font-bold uppercase tracking-widest font-mono">Price</span>
                      <span className="font-serif text-base text-primary font-bold" style={{ fontFamily: "'Fraunces', serif" }}>${product.price.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      Add <ShoppingBag className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Custom Scroller Progress Bar */}
        <div className="max-w-xs mx-auto mt-8 h-[2.5px] bg-outline-variant/20 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#d4af37] to-[#1e3d2f]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </section>

      {/* Our Heritage Section */}
      <section className="py-24 px-container-padding bg-background relative">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
        
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container/10 rounded-full blur-2xl"></div>
            
            {/* Responsive Images Layout: side-by-side on mobile, overlapping on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:block">
              
              {/* Main Image with Vignette & Grain */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-2xl overflow-hidden shadow-2xl relative z-10 aspect-[4/3] md:aspect-square group"
              >
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" 
                  alt="Tunisian olive harvester hands"
                  src='/story.png'
                />
                {/* Vignette filter and noise overlays */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/10 mix-blend-multiply z-20"></div>
                <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              </motion.div>

              {/* Second Image with Vignette & Grain */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-xl z-20 aspect-[4/3] sm:aspect-auto lg:absolute lg:-bottom-12 lg:-right-12 lg:w-64 lg:h-80 border-4 sm:border-8 border-white group relative"
              >
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" 
                  alt="Tunisian olive grove terraced landscape"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4aqtLENqgIEYtg6mYYkXmvtke5uwQVf7-8sPoJcSg9wsll_Zfg5hx3af8xSYuvuecxRWvMgBOj-1KnXXxSW96WnMi95dbfuX-9oh8Su3xZPF3xvVu3d0nCophi0TjCtaq84QDqnw4dKuYqkLusVBVns7u2Nkns-VyjVY-le-kXeR1LLRudRfZYszx4bNSeXMqLC7ly27mHk8NL4Rq9rU0x1i7jrg-y-AJGY8qzwj0z7Arb2rz3A1Pw"
                />
                {/* Vignette filter and noise overlays */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/10 mix-blend-multiply z-20"></div>
                <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left"
          >
            <span className="font-mono text-[10px] text-secondary uppercase tracking-widest block font-bold">
              Our Legacy
            </span>
            <div className="relative pb-2">
              <h2 
                className="font-serif text-headline-xl text-primary leading-tight font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Ancestral devotion, modern precision.
              </h2>
              {/* Gold-to-green gradient accent underline */}
              <div className="h-[2px] w-32 bg-gradient-to-r from-[#d4af37] to-[#1e3d2f] mt-4"></div>
            </div>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-light text-sm md:text-base">
              For generations, the OLIV'OR family has tended to the sun-drenched groves of the Tunisian Sahel. Our methods haven't changed much since the days of Carthage — we still listen to the trees, we still harvest under the Mediterranean sun, and we still honor the liquid gold that has sustained our culture for millennia.
            </p>

            {/* Pull-quote style timeline stats */}
            <div className="flex gap-10 pt-4 flex-wrap">
              <div className="border-l-2 border-[#d4af37] pl-4">
                <span className="font-serif text-3xl font-bold text-primary block" style={{ fontFamily: "'Fraunces', serif" }}>
                  EST. 1954
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-outline font-bold">Since Carthage Groves</span>
              </div>
              <div className="border-l-2 border-[#d4af37] pl-4">
                <span className="font-serif text-3xl font-bold text-primary block" style={{ fontFamily: "'Fraunces', serif" }}>
                  4th GEN
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-outline font-bold">Family Orchard</span>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/heritage" className="inline-flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest group font-bold">
                <span>Read the full story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Bento Grid */}
      <section className="py-28 bg-surface-container relative">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
        
        <div className="max-w-[1440px] mx-auto px-container-padding text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 
              className="font-serif text-headline-xl text-primary font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Customer Favorites
            </h2>
            <p className="text-on-surface-variant mt-4 font-body-md font-light text-sm">
              The bottles that define the Mediterranean palate.
            </p>
          </motion.div>
        </div>

        <div className="max-w-[1440px] mx-auto px-container-padding grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[800px] relative z-10">
          {/* Large Card */}
          {(() => {
            const p1 = products.find(p => p.title === 'Reserve Collection') || products[0];
            const p1Id = p1 ? (p1._id || p1.id) : '';
            return (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-2 md:row-span-2 bg-white rounded-3xl overflow-hidden group relative flex flex-col justify-end p-10 cursor-pointer min-h-[400px] md:min-h-auto shadow-sm border border-outline-variant/10"
              >
                {p1 && (
                  <>
                    <img 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                      alt={p1.title}
                      src={p1.images && p1.images.length > 0 ? p1.images[0] : p1.image}
                    />
                    {/* Standardized gradient-to-black overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
                    
                    <div className="relative z-10 text-white text-left">
                      <span className="font-mono text-[9px] font-bold tracking-widest uppercase bg-secondary px-3.5 py-1.5 rounded-full mb-4 inline-block text-white border border-secondary/20 shadow-sm">
                        Best Seller
                      </span>
                      <h3 
                        className="font-serif text-white mb-2 text-2xl md:text-4xl font-bold tracking-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        {p1.title}
                      </h3>
                      <p className="opacity-80 mb-6 font-body-md line-clamp-2 text-sm font-light">
                        {p1.description}
                      </p>
                      <Link to={`/product/${p1Id}`} className="inline-block bg-white text-primary px-8 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container transition-colors text-center font-bold">
                        Shop {p1.title}
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })()}

          {/* Side Card 1 */}
          {(() => {
            const p2 = products.find(p => p.title === 'Chemlali Gold') || products[1];
            const p2Id = p2 ? (p2._id || p2.id) : '';
            return (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-2 bg-white rounded-3xl overflow-hidden group relative p-10 flex items-center justify-between cursor-pointer min-h-[200px] md:min-h-auto shadow-sm border border-outline-variant/10"
              >
                {p2 && (
                  <>
                    <div className="z-10 w-1/2 text-left">
                      <h3 
                        className="font-serif text-primary mb-2 text-xl md:text-2xl font-bold"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        {p2.title}
                      </h3>
                      <p className="text-on-surface-variant mb-6 font-body-md text-sm line-clamp-2 font-light">
                        {p2.description}
                      </p>
                      <span className="font-serif text-primary text-xl md:text-2xl block mb-2 font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                        ${p2.price.toFixed(2)}
                      </span>
                      <Link to={`/product/${p2Id}`} className="inline-block bg-primary text-white px-6 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-primary-container transition-colors text-center font-bold mt-2">
                        Buy Now
                      </Link>
                    </div>
                    <img 
                      className="absolute right-0 top-0 h-full w-1/2 object-contain group-hover:scale-105 transition-transform duration-700 p-4" 
                      alt={p2.title}
                      src={p2.images && p2.images.length > 0 ? p2.images[0] : p2.image}
                    />
                  </>
                )}
              </motion.div>
            );
          })()}

          {/* Side Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            onClick={() => navigate('/shop?category=servingware')}
            className="bg-white rounded-3xl overflow-hidden group relative p-8 flex flex-col justify-end cursor-pointer min-h-[200px] md:min-h-auto shadow-sm border border-outline-variant/10"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Servingware accessories"
              src="/cera.png"
            />
            {/* Standardized gradient-to-black overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
            
            <div className="relative z-10 text-white text-center space-y-2">
              <h4 className="font-serif text-white text-xl md:text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                Servingware
              </h4>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore Collection <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

          {/* Side Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            onClick={() => navigate('/shop?category=gifts')}
            className="bg-white rounded-3xl overflow-hidden group relative p-8 flex flex-col justify-end cursor-pointer min-h-[200px] md:min-h-auto shadow-sm border border-outline-variant/10"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Gifts box set"
              src="/gift.jpeg"
            />
            {/* Standardized gradient-to-black overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
            
            <div className="relative z-10 text-white text-center space-y-2">
              <h4 className="font-serif text-white text-xl md:text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                Gifts
              </h4>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore Collection <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-36 px-container-padding bg-background border-t border-outline-variant/10 relative overflow-hidden">
        {/* Linen texture background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
        
        <div className="max-w-[1000px] mx-auto text-center relative min-h-[360px] flex items-center justify-center">
          {/* Large Low-opacity Gold Quotation Mark Watermark */}
          <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-[15rem] font-serif text-[#d4af37]/8 select-none pointer-events-none leading-none z-0">“</span>
          
          <div className="relative z-10 w-full">
            {testimonials.map((testi, idx) => (
              <div 
                key={idx}
                className={`transition-opacity duration-1000 ease-in-out absolute inset-0 flex flex-col justify-center items-center ${
                  testiIndex === idx ? 'opacity-100 relative z-10' : 'opacity-0 absolute pointer-events-none z-0'
                }`}
              >
                <blockquote 
                  className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-primary leading-relaxed px-4 max-w-4xl font-light"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  "{testi.quote}"
                </blockquote>
                <div className="space-y-2 mt-8">
                  <p className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">
                    — {testi.author}, {testi.title}
                  </p>
                  <div className="flex justify-center">
                    <StarRating value={testi.rating} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
