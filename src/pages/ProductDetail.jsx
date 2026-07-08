import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, ShieldCheck, Plus, Minus, ZoomIn, ChevronDown, Award, Sprout, Heart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Tab-specific luxury contextual images (placeholders to be swapped by user)
const tabImages = {
  'Description': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTPIHgqoCrNuvCJXzR_CiKl3-Xyqy_Up_XO2a81SdKKOiSicpaKBy39ZW71WEiDch5ZcjRTs_A0OmEHSzkVvliqy7LNvLwBp7L5Ajp2YsbpXr5lY7iJ3r8_tk4Rf68l2WY5Tv_sxq1M7vaE2c6DzdmEaSAzZvgrEtGzGdEC92qrR-cg8CI-E3sc4A5crESqcOWIPhRx4DfIKcp85n7te3EfJL9S9HV4uUh8fFzdzMGlJmZQBHHvU4VOg', // Pouring/tasting shot
  'Harvest Info': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvCDTtUsXIuLOLgDKfWQX7TtvAPEiXLW1qHkglddu-DKTduowXMaGrx4h4vqJg17LUTwQamYBF7Qoz7pqfj8IVxgbs7F-CB220KsH86tFELyI94Neq2aFhVRmDMMZdLrgWBoNy-yxI8DoAtFTnveV3UnKh5S2pgqIKyrRLcRZSOSmMkpBCX3oRtDkfVORs4o3qYJiXzRVoXS9n4FxyG9CKt_KkLJir3k0x_-uZq08bNTsskcYTvnqF6w', // Harvest photo
  'Extraction & Storage': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPa_LAL0fQbWlp6v9Z7Oqn2ahe8Tep1vqVbyQGZK_TOlYsX4ssBq98tdYtki3mKan9w4DI4m4fumC3T7RjOSQm-J2Cdk9ureAlY6uvT5mt-Kc8fLBLaKOp-kbCYUd08ukH4UZ4I4G49JCofzs34ARXwTVPanPTeYp6CDr-MuZpzvxgHpLkjEwehNsuy7GH6mUDMi6hAPiOebDmDKTLJtVVQ_pAD2T1j3hfvj8wUTPOFIEuopJF7_ZRrA', // Mill/pressing photo
  'Nutritional Facts': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsmlQn7DSuvj_dNW1Bswa5WWA8dJu7X1rdwsHEhBesk5DRsymX71m5SMe5-4nSRq6Lxdn_mJQp62OuhDyEhyhKccvMp-kfbsVuAOKbXnXBjj0K80WIbDk5Vb99dBZTqYYwirYjfA6zvi9BVxBXdFrfEEhPAG3-qiWQqmWV46EdDB7no8AkRqIqOurJjp9lvTLn37Pm2w9oXCuL4TWv1O2Dgbd_PTsK5CHZJU389-XBhCd2_HuEfzlxLw' // Olive branch / watermark background reference
};

// Linen / paper grain noise SVG background texture (embedded data URI)
const noisePattern = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E";

// Inline Bottle Silhouette Watermark for Nutritional Facts
const BottleWatermark = () => (
  <svg className="absolute right-4 bottom-4 w-32 h-56 text-[#1e3d2f]/3 pointer-events-none select-none -z-10" viewBox="0 0 100 250" fill="currentColor">
    <path d="M45,10 h10 v20 h-10 z M42,30 h16 v10 h-16 z M40,40 C40,40 35,50 35,60 v150 C35,220 40,225 50,225 C60,225 65,220 65,210 V60 C65,50 60,40 60,40 Z" />
  </svg>
);

// Reusable StarRating component
const StarRating = ({ value = 0, size = 'md', interactive = false, onChange }) => {
  const starSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  const sizeClass = starSizes[size] || starSizes.md;

  return (
    <div className={`flex text-secondary select-none ${interactive ? 'gap-1' : ''}`}>
      {[...Array(5)].map((_, i) => {
        const starVal = i + 1;
        const isFilled = value >= starVal;
        const isHalf = !isFilled && value > i && value < starVal;

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange && onChange(starVal)}
              className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
            >
              <span 
                className={`material-symbols-outlined ${sizeClass}`}
                style={{ fontVariationSettings: starVal <= value ? "'FILL' 1" : "" }}
              >
                {starVal <= value ? 'star' : 'star_outline'}
              </span>
            </button>
          );
        }

        if (isFilled) {
          return (
            <span 
              key={i} 
              className={`material-symbols-outlined ${sizeClass}`} 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          );
        } else if (isHalf) {
          return (
            <span 
              key={i} 
              className={`material-symbols-outlined ${sizeClass}`} 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star_half
            </span>
          );
        } else {
          return (
            <span 
              key={i} 
              className={`material-symbols-outlined ${sizeClass}`}
              style={{ fontVariationSettings: "" }}
            >
              star_outline
            </span>
          );
        }
      })}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, loadingProducts, wishlist, toggleWishlist, createProductReview, token, refreshProducts } = useApp();
  
  const product = products.find(p => (p._id || p.id) === id);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [openFaq, setOpenFaq] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isDropletAnimating, setIsDropletAnimating] = useState(false);

  // Set up Variants and sizes
  const hasVariants = !!(product?.variants && product.variants.length > 1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const similarScrollRef = useRef(null);

  // Parallax calculations for the hero main image
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 90]);

  // Load Google Serif font dynamically on component mount
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Auto-scroll to top and reset state on product change
  useEffect(() => {
    setSelectedImgIdx(0);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  // Handle sticky add to cart bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync selected variant when product changes
  useEffect(() => {
    if (hasVariants && product) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product, hasVariants]);

  // Close lightbox modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Early returns are safely declared AFTER all hooks are registered
  if (loadingProducts) {
    return (
      <div className="bg-background text-on-surface min-h-screen font-body-md">
        <main className="pt-32 pb-section-gap-lg max-w-[1440px] mx-auto px-gutter">
          {/* Breadcrumbs Skeleton */}
          <div className="mb-12 h-4 w-48 bg-outline-variant/20 rounded-md animate-pulse"></div>

          {/* Product Hero Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Image Gallery Skeleton */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
              {/* Vertical Thumbnails Skeleton */}
              <div className="order-2 md:order-1 flex md:flex-col gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-24 rounded-lg bg-outline-variant/20 animate-pulse"></div>
                ))}
              </div>
              {/* Main Display Skeleton */}
              <div className="order-1 md:order-2 flex-grow aspect-[3/4] rounded-2xl bg-outline-variant/20 animate-pulse"></div>
            </div>

            {/* Right: Product Details Skeleton */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-outline-variant/20 rounded-full animate-pulse"></div>
                <div className="h-12 w-3/4 bg-outline-variant/20 rounded-md animate-pulse"></div>
                
                <div className="flex items-center gap-4">
                  <div className="h-5 w-24 bg-outline-variant/20 rounded-md animate-pulse"></div>
                  <div className="h-5 w-32 bg-outline-variant/20 rounded-md animate-pulse"></div>
                </div>
                <div className="h-10 w-24 bg-outline-variant/20 rounded-md animate-pulse"></div>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full bg-outline-variant/20 rounded-md animate-pulse"></div>
                <div className="h-4 w-5/6 bg-outline-variant/20 rounded-md animate-pulse"></div>
                <div className="h-4 w-4/5 bg-outline-variant/20 rounded-md animate-pulse"></div>
              </div>

              <div className="space-y-6 pt-4 border-t border-outline-variant/20">
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-outline-variant/20 rounded-md animate-pulse"></div>
                  <div className="flex gap-4">
                    <div className="h-12 w-28 bg-outline-variant/20 rounded-xl animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-12 w-32 bg-outline-variant/20 rounded-xl animate-pulse"></div>
                  <div className="flex-grow h-12 bg-outline-variant/20 rounded-full animate-pulse"></div>
                  <div className="h-12 w-12 bg-outline-variant/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center text-center p-6 pt-32">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">sentiment_dissatisfied</span>
        <h2 className="font-headline-lg text-primary text-2xl mb-4 font-bold">Product Not Found</h2>
        <p className="text-on-surface-variant max-w-md mb-8">The premium olive oil blend you are looking for does not exist or has been removed from our cellars.</p>
        <Link to="/shop" className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const displayPrice = selectedVariant && typeof selectedVariant === 'object' && selectedVariant.price
    ? selectedVariant.price
    : product.price;

  const displayVolume = selectedVariant
    ? (typeof selectedVariant === 'string' ? selectedVariant : selectedVariant.volume || selectedVariant.title)
    : product.volume;

  // Stock status styling
  const renderStockIndicator = () => {
    if (product.stock === undefined || product.stock === null) return null;
    if (product.stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          Out of Stock
        </span>
      );
    }
    if (product.stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Only {product.stock} Left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        In Stock
      </span>
    );
  };

  // Safe image gallery processing
  const productImages = (product.images && product.images.length > 0)
    ? product.images.map(img => typeof img === 'string' ? img : (img?.url || img?.src || galleryImages[0]))
    : (product.image ? [product.image] : galleryImages);

  const isInWishlist = product && (wishlist || []).some(
    item => (item._id || item.id || item) === (product._id || product.id)
  );

  const handleQtyChange = (type) => {
    if (type === 'inc') {
      if (product.stock !== undefined && product.stock !== null) {
        if (quantity < product.stock) {
          setQuantity(prev => prev + 1);
        }
      } else {
        setQuantity(prev => prev + 1);
      }
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const triggerDropletAnimation = () => {
    setIsDropletAnimating(true);
    setTimeout(() => {
      setIsDropletAnimating(false);
    }, 1200);
  };

  const handleAddToCart = () => {
    const productToAddToCart = {
      ...product,
      price: displayPrice,
      volume: displayVolume,
      _id: (selectedVariant && typeof selectedVariant === 'object' && (selectedVariant._id || selectedVariant.id)) || product._id || product.id
    };
    addToCart(productToAddToCart, quantity);
    triggerDropletAnimation();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const scrollSimilar = (direction) => {
    if (similarScrollRef.current) {
      const scrollAmount = 340;
      similarScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please write a comment.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    const res = await createProductReview(product._id || product.id, {
      rating: reviewRating,
      comment: reviewComment
    });

    setSubmittingReview(false);

    if (res.success) {
      setReviewSuccess('Thank you! Your review has been added.');
      setReviewComment('');
      setReviewRating(5);
      if (refreshProducts) {
        refreshProducts();
      }
    } else {
      setReviewError(res.message || 'Failed to submit review.');
    }
  };

  // Dynamic Tab Content with Fallbacks
  const descriptionTitle = product.detailedDescription?.title || 'The Essence of Tunisia';
  const descriptionText = typeof product.detailedDescription === 'string' 
    ? product.detailedDescription 
    : (product.detailedDescription?.text || product.description || `Each drop of our Reserve Collection is a testament to the sun-soaked terroir of the Sahel. We harvest only during the first full moon of October, ensuring the polyphenols are at their peak intensity. The result is a robust, complex oil that dances between bitterness and fruitiness.`);
  
  const descriptionBullet1 = product.detailedDescription?.bullet1 || 'Single-estate origin from Mahdia, Tunisia.';
  const descriptionBullet2 = product.detailedDescription?.bullet2 || 'Acidity level below 0.2%—truly superior grade.';

  const harvestTitle = product.harvestInfo?.title || 'October lunar harvest';
  const harvestText = typeof product.harvestInfo === 'string' 
    ? product.harvestInfo 
    : (product.harvestInfo?.text || `Harvesting by hand at night under a full moon preserves the cool temperature of the fruit, ensuring the delicate flavor volatiles and heavy antioxidant compounds are preserved in their natural state.`);
  
  const harvestVarietal = product.harvestInfo?.varietal || '100% Chemlali olives';
  const harvestOrchard = product.harvestInfo?.orchard || 'Mahdia Coastline, Tunisian Sahel';
  const harvestMethod = product.harvestInfo?.method || '100% Hand-picked';

  const extractionTitle = product.extraction?.title || 'Under 24-Hour Cold Press';
  const extractionText = typeof product.extraction === 'string' 
    ? product.extraction 
    : (product.extraction?.text || `We transport the fruit immediately from the grove to our temperature-regulated local mill. Cold mechanical extraction occurs under nitrogen blanket within 4 hours of arrival to completely eliminate oxidation.`);

  const nutritionTitle = product.nutrition?.title || 'Composition';
  const nutritionFacts = product.nutrition?.facts || (typeof product.nutrition === 'string' ? product.nutrition : [
    { label: 'Serving Size', value: '1 tbsp (15ml)' },
    { label: 'Calories', value: '120' },
    { label: 'Total Fat', value: '14g (22% DV)' },
    { label: 'Saturated Fat', value: '2g' },
    { label: 'Monounsaturated Fat', value: '10g' },
    { label: 'Polyphenols', value: '450 mg/kg' }
  ]);

  const faqs = product.faqs || [
    {
      q: 'How should I store this reserve oil?',
      a: 'Keep in a cool, dark place away from heat sources. Our dark glass protects against UV, but direct sunlight should be avoided to preserve the antioxidant properties.'
    },
    {
      q: 'What is the shelf life?',
      a: 'Best consumed within 18 months of harvest for peak flavor. Once opened, we recommend using it within 3-4 months.'
    },
    {
      q: 'Is it suitable for high-heat cooking?',
      a: 'While EVOO has a stable smoke point, we recommend using the Reserve Collection as a finishing oil to appreciate its complex aromatic profile.'
    }
  ];

  const similarProducts = products
    ? products.filter(p => (p._id || p.id) !== id).slice(0, 6)
    : [];

  // Sort and isolate top review for editorial pull-quote style
  const sortedReviews = product.reviews && product.reviews.length > 0 
    ? [...product.reviews].sort((a, b) => b.rating - a.rating)
    : [];
  const topReview = sortedReviews[0];
  const otherReviews = sortedReviews.slice(1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-background text-on-surface font-body-md min-h-screen"
    >
      <main className="pt-32 pb-section-gap-lg max-w-[1440px] mx-auto px-gutter relative">
        
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-label-sm font-mono text-outline uppercase tracking-widest text-[10px]">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-primary font-semibold">{product.title}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Cinematic Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            
            {/* Vertical Thumbnails */}
            {productImages.length > 1 && (
              <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible scroller-hide select-none">
                {productImages.map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                      selectedImgIdx === idx ? 'border-primary' : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url('${imgUrl}')` }}
                    ></div>
                  </button>
                ))}
              </div>
            )}

            {/* Main Display with Active Thumbnail */}
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="order-1 md:order-2 flex-grow relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low group cursor-zoom-in select-none border border-outline-variant/10 shadow-lg"
            >
              {/* Subtle radial wash behind hero image container */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-[#d4af37]/8 via-transparent to-[#1e3d2f]/8 blur-3xl pointer-events-none -z-10 rounded-full"></div>
              
              <motion.div 
                key={selectedImgIdx}
                style={{ 
                  backgroundImage: `url('${productImages[selectedImgIdx]}')`,
                  y: yParallax
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
              ></motion.div>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              {/* Zoom Button Overlay */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute bottom-6 right-6 bg-surface/85 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:bg-surface transition-colors"
              >
                <ZoomIn className="h-4 w-4 text-primary" />
                <span className="text-label-sm font-mono uppercase tracking-widest text-on-surface text-[10px] font-bold">Zoom</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[10px] uppercase tracking-widest font-bold border border-secondary/15 select-none">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                Limited Release
              </span>
              <h1 
                className="font-serif text-primary leading-none text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <StarRating value={product.rating || 0} size="md" />
                <span className="text-outline font-mono text-[10px] font-semibold uppercase tracking-wider">
                  {(product.rating || 0).toFixed(1)} / 5 ({product.reviews?.length || 0} {product.reviews?.length === 1 ? 'Review' : 'Reviews'})
                </span>
              </div>

              {/* Price and Stock Row */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                <div className="flex items-baseline gap-3 relative pb-2">
                  <span 
                    className="text-3xl font-serif text-primary font-bold" 
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    ${(displayPrice || 0.00).toFixed(2)}
                  </span>
                  {!hasVariants && displayVolume && (
                    <span className="text-outline font-mono text-xs font-semibold uppercase tracking-wider">
                      / {displayVolume}
                    </span>
                  )}
                  {/* Subtle gold to green underline accent on the price */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#d4af37]/60 via-[#1e3d2f]/30 to-transparent"></div>
                </div>
                {renderStockIndicator()}
              </div>
            </div>

            <p className="text-body-lg text-on-surface-variant font-light leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-6 pt-4 border-t border-outline-variant/20">
              
              {/* Variants Selector */}
              {hasVariants && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="font-mono uppercase tracking-wider text-outline text-[10px] font-bold block">
                    Select Size
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {product.variants.map((variant, index) => {
                      const sizeLabel = typeof variant === 'string' ? variant : (variant.volume || variant.title);
                      const isSelected = selectedVariant === variant;
                      return (
                        <button 
                          key={index}
                          onClick={() => setSelectedVariant(variant)}
                          className="px-6 py-3 font-semibold rounded-xl transition-all focus:outline-none text-sm min-w-[100px] cursor-pointer relative"
                        >
                          {isSelected && (
                            <motion.div 
                              layoutId="activeSizeIndicator"
                              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                              className="absolute inset-0 border-2 border-primary bg-primary/10 rounded-xl"
                            />
                          )}
                          <span className={`relative z-10 ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                            {sizeLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Select and Primary CTA Action (Add to Cart) */}
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2 bg-surface">
                  <button 
                    onClick={() => handleQtyChange('dec')}
                    className="p-2 hover:text-primary focus:outline-none transition-colors cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input 
                    className="w-12 text-center bg-transparent border-none focus:ring-0 font-mono text-sm text-primary font-bold focus:outline-none pointer-events-none" 
                    readOnly 
                    type="number" 
                    value={quantity}
                  />
                  <button 
                    onClick={() => handleQtyChange('inc')}
                    className="p-2 hover:text-primary focus:outline-none transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-grow flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-grow bg-primary hover:bg-primary-container text-white py-4 rounded-full font-mono uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[11px] font-bold cursor-pointer relative overflow-hidden flex items-center justify-center min-h-[52px]"
                  >
                    {isDropletAnimating ? (
                      <span className="flex items-center gap-2 relative z-10">
                        {/* Oil droplet splash animation */}
                        <motion.svg 
                          initial={{ y: -25, opacity: 0, scale: 0.5 }}
                          animate={{ 
                            y: [ -25, 0, 4, 0 ], 
                            opacity: [ 0, 1, 1, 0 ],
                            scale: [ 0.5, 1.2, 1.4, 0.9 ] 
                          }}
                          transition={{ duration: 1, times: [0, 0.4, 0.7, 1], ease: "easeInOut" }}
                          className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </motion.svg>
                        <span className="normal-case font-body-md text-xs">Added to Cellar</span>
                      </span>
                    ) : (
                      <span className="relative z-10">Add to Cart</span>
                    )}
                  </button>

                  <button 
                    onClick={() => toggleWishlist(product._id || product.id)}
                    className={`px-5 border-2 rounded-full transition-all focus:outline-none flex items-center justify-center cursor-pointer ${
                      isInWishlist 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-outline-variant text-outline hover:text-primary hover:border-primary'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-primary' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Rebalanced Visually Secondary Checkout Link */}
              <div className="text-center pt-2">
                <button 
                  onClick={handleBuyNow}
                  className="text-secondary hover:text-secondary-container transition-colors text-xs font-mono font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 focus:outline-none py-2 cursor-pointer inline-block"
                >
                  Or Buy Now — Instant Checkout
                </button>
              </div>
            </div>

            {/* Certifications Summary */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-outline-variant/30">
              <div className="flex items-center gap-4">
                <Sprout className="h-8 w-8 text-primary shrink-0" />
                <span className="font-mono leading-tight text-on-surface-variant uppercase tracking-wider text-[9px] font-bold">
                  100% Organic<br />Certified
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-primary shrink-0" />
                <span className="font-mono leading-tight text-on-surface-variant uppercase tracking-wider text-[9px] font-bold">
                  Cold Pressed<br />Extraction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections (Tabs) */}
        <section className="mt-16 text-left">
          <div className="border-b border-outline-variant/30 flex gap-12 overflow-x-auto scroller-hide select-none">
            {['Description', 'Harvest Info', 'Extraction & Storage', 'Nutritional Facts'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 px-2 font-mono uppercase tracking-widest text-[11px] font-bold transition-all duration-300 focus:outline-none whitespace-nowrap relative ${
                  activeTab === tab ? 'text-primary font-semibold' : 'text-outline hover:text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#d4af37] via-[#a3c1ad] to-[#1e3d2f]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-12 px-6 md:px-12 rounded-3xl bg-surface-container/30 border border-outline-variant/10 relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-6">
            {/* Texture background: linen/paper Contours */}
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
            
            <AnimatePresence mode="wait">
              {activeTab === 'Description' && (
                <motion.div 
                  key="Description"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 relative z-10"
                >
                  <h3 
                    className="font-serif text-primary text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {descriptionTitle}
                  </h3>
                  <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                    {descriptionText}
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                      <span className="text-body-md text-on-surface-variant font-light text-sm">
                        {descriptionBullet1}
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                      <span className="text-body-md text-on-surface-variant font-light text-sm">
                        {descriptionBullet2}
                      </span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'Harvest Info' && (
                <motion.div 
                  key="Harvest"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 relative z-10"
                >
                  <h3 
                    className="font-serif text-primary text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {harvestTitle}
                  </h3>
                  <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                    {harvestText}
                  </p>
                  <ul className="space-y-3 text-sm text-on-surface-variant font-light">
                    <li><strong>Varietal:</strong> {harvestVarietal}</li>
                    <li><strong>Orchard:</strong> {harvestOrchard}</li>
                    <li><strong>Method:</strong> {harvestMethod}</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'Extraction & Storage' && (
                <motion.div 
                  key="Extraction"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 relative z-10"
                >
                  <h3 
                    className="font-serif text-primary text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {extractionTitle}
                  </h3>
                  <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                    {extractionText}
                  </p>
                </motion.div>
              )}

              {activeTab === 'Nutritional Facts' && (
                <motion.div 
                  key="Nutrition"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 max-w-md relative z-10"
                >
                  {/* Faint Glass Silhouette Watermark */}
                  <BottleWatermark />

                  <h3 
                    className="font-serif text-primary text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {nutritionTitle}
                  </h3>
                  {Array.isArray(nutritionFacts) ? (
                    <div className="divide-y divide-outline-variant/20 text-sm text-on-surface-variant font-light">
                      {nutritionFacts.map((fact, index) => {
                        const label = typeof fact === 'object' ? fact.label : fact;
                        const value = typeof fact === 'object' ? fact.value : '';
                        return (
                          <div key={index} className="flex justify-between py-2">
                            <span className="font-medium text-primary/80">{label}</span>
                            <span className="font-mono text-xs">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                      {nutritionFacts}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Card: Tab-specific luxury contextual imagery */}
            <div className="bg-surface-container rounded-2xl p-10 flex items-center justify-center relative overflow-hidden h-[300px] border border-outline-variant/10 shadow-sm z-10">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center transition-all duration-700 ease-in-out transform scale-105" 
                style={{ 
                  backgroundImage: `url('${product.tabImages?.[activeTab] || tabImages[activeTab] || tabImages['Description']}')` 
                }}
              ></div>
              
              <div className="relative z-10 text-center space-y-4">
                <div 
                  className="font-serif text-primary opacity-30 text-7xl select-none leading-none" 
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {product.vintageYear || '2024'}
                </div>
                <div 
                  className="font-serif text-secondary text-xl font-bold italic" 
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Reserve Cultivar
                </div>
                <p className="text-label-lg uppercase tracking-[0.2em] text-outline text-[10px] font-mono font-bold bg-[#1e3d2f]/5 px-3 py-1 rounded-full border border-[#1e3d2f]/10">
                  Batch No. {product.batchNumber || '0042'} / {product.totalBatchSize || '1000'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Embossed Wax Seal Medallion section */}
        <section className="mt-12 py-16 px-8 rounded-3xl bg-[#1e3d2f]/5 border border-[#1e3d2f]/10 relative overflow-hidden text-center flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-inner">
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-repeat" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
          
          <div className="text-left space-y-3 z-10 max-w-lg">
            <span className="text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] font-mono block">Certificate of Origin</span>
            <h4 
              className="font-serif text-3xl text-primary font-bold leading-tight" 
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Vintage {product.vintageYear || '2024'} Micro-Harvest
            </h4>
            <p className="text-body-md text-on-surface-variant font-light text-sm leading-relaxed">
              Every bottle is individually hand-filled, sealed with traditional hot wax, and numbered. This select harvest comes exclusively from single-estate cultivars along the Tunisian shoreline.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#8b2635] to-[#5c131e] text-white flex flex-col items-center justify-center shadow-2xl border-4 border-[#d4af37]/30 relative"
            >
              <div className="absolute inset-1.5 rounded-full border border-dashed border-white/20"></div>
              <div className="absolute inset-2.5 rounded-full border border-[#d4af37]/35 flex flex-col items-center justify-center p-2 text-center select-none shadow-inner bg-[#8b2635]/85">
                <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37] mb-1" />
                <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">Reserve</span>
                <span className="font-mono text-sm font-bold tracking-widest text-white/95 mt-1">
                  NO. {product.batchNumber || '0042'}
                </span>
                <span className="text-[8px] text-white/50 tracking-widest font-mono">OF {product.totalBatchSize || '1000'}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Curated FAQ Section */}
        <section className="mt-28 text-left border-t border-outline-variant/10 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block font-bold">
                FAQ
              </span>
              <h3 
                className="font-serif text-primary text-3xl font-bold tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Curated Questions
              </h3>
              <p className="text-body-md text-on-surface-variant font-light text-sm">
                Have questions about our premium harvests, extraction techniques, or proper cellar storage? Find answers here.
              </p>
            </div>
            
            <motion.div layout className="lg:col-span-8 space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div layout key={idx} className="border-b border-outline-variant/30 py-4 cursor-pointer group">
                  <div 
                    onClick={() => toggleFaq(idx)}
                    className="flex justify-between items-center group-hover:text-primary transition-colors select-none"
                  >
                    <span className="font-mono uppercase tracking-wider text-xs md:text-sm font-semibold text-primary">
                      {faq.q || faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-secondary shrink-0"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={false}
                    animate={{ height: openFaq === idx ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-body-md text-on-surface-variant leading-relaxed text-sm font-light">
                      {faq.a || faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-32 text-left border-t border-outline-variant/20 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-8 animate-fadeIn">
              <div>
                <span className="text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block font-bold">
                  Testimonials
                </span>
                <h3 
                  className="font-serif text-primary text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Connoisseur Feedback
                </h3>
              </div>

              {/* Top review styled as large pull-quote */}
              {topReview && (
                <div className="py-8 border-b border-[#d4af37]/20 relative">
                  <span className="absolute -top-4 -left-4 text-7xl font-serif text-[#d4af37]/15 select-none pointer-events-none">“</span>
                  <p 
                    className="font-serif italic text-xl md:text-2xl text-primary leading-relaxed pl-6 relative z-10" 
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {topReview.comment}
                  </p>
                  <div className="mt-4 flex items-center justify-between pl-6 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono" style={{ fontVariant: 'all-small-caps' }}>
                        {topReview.name}
                      </span>
                      {topReview.verified && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/50">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <StarRating value={topReview.rating} size="sm" />
                  </div>
                </div>
              )}

              {/* Other reviews list */}
              <div className="space-y-6 pt-4">
                {otherReviews.length > 0 ? (
                  otherReviews.map((rev) => (
                    <div key={rev._id || rev.id} className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-primary text-sm">{rev.name}</h4>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-semibold border border-emerald-100">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-outline-variant text-[10px] font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                        <StarRating value={rev.rating} size="sm" />
                      </div>
                      <p className="text-body-md text-on-surface-variant leading-relaxed text-sm font-light">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  !topReview && (
                    <p className="text-on-surface-variant font-light text-sm italic">
                      No reviews yet. Be the first to share your experience with this harvest.
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Leave a Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-surface p-8 rounded-2xl border border-outline-variant/10 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
                
                <div className="relative z-10">
                  <h4 
                    className="font-serif text-primary text-xl font-bold" 
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Share Your Experience
                  </h4>
                  <p className="text-[10px] text-outline font-mono uppercase tracking-wider mt-1">Review this heritage oil</p>
                </div>

                {reviewSuccess && (
                  <div className="p-4 bg-primary/10 text-primary rounded-xl text-xs font-semibold relative z-10">
                    {reviewSuccess}
                  </div>
                )}

                {reviewError && (
                  <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold relative z-10">
                    {reviewError}
                  </div>
                )}

                {token ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-outline font-mono uppercase tracking-wider">Rating</label>
                      <StarRating value={reviewRating} size="xl" interactive={true} onChange={setReviewRating} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="comment" className="block text-[10px] font-bold text-outline font-mono uppercase tracking-wider">Your Comment</label>
                      <textarea
                         id="comment"
                         rows="4"
                         value={reviewComment}
                         onChange={(e) => setReviewComment(e.target.value)}
                         placeholder="Describe the notes, aroma, and mouthfeel of this harvest..."
                         className="w-full rounded-xl border border-outline-variant p-4 bg-surface text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                         required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-full font-mono uppercase tracking-widest text-[10px] font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 relative z-10">
                    <p className="text-on-surface-variant font-light text-sm">
                      Only authenticated connoisseurs can submit reviews for our premium harvests.
                    </p>
                    <Link
                      to={`/login?redirect=product/${product._id || product.id}`}
                      className="w-full py-4 text-center border-2 border-primary text-primary hover:bg-primary/5 rounded-full font-mono uppercase tracking-widest text-[10px] font-bold block"
                    >
                      Log in to review
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </section>

        {/* Similar Treasures */}
        <section className="mt-40 text-left">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block font-bold">
                Curation
              </span>
              <h3 
                className="font-serif text-primary text-3xl font-bold tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Similar Treasures
              </h3>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => scrollSimilar('left')}
                className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all focus:outline-none cursor-pointer"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button 
                onClick={() => scrollSimilar('right')}
                className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all focus:outline-none cursor-pointer"
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div 
            ref={similarScrollRef}
            className="flex gap-8 overflow-x-auto scroller-hide pb-10 select-none scroll-smooth"
          >
            {similarProducts.map((prod) => {
              const prodId = prod._id || prod.id;
              const prodImg = prod.images?.[0] || prod.image || galleryImages[0];
              return (
                <Link 
                  to={`/product/${prodId}`} 
                  key={prodId} 
                  className="min-w-[280px] md:min-w-[320px] group cursor-pointer border border-outline-variant/10 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container mb-6 relative flex items-center justify-center p-4">
                    <img 
                      className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" 
                      alt={prod.title}
                      src={prodImg}
                    />
                  </div>
                  <h4 className="font-serif text-primary mb-1 text-lg truncate font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                    {prod.title}
                  </h4>
                  <p className="text-outline font-mono uppercase tracking-widest mb-3 text-[9px] font-semibold">
                    {prod.region} &bull; {prod.volume}
                  </p>
                  <div className="text-secondary font-bold mt-auto">${prod.price.toFixed(2)}</div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

      {/* Sticky Mini Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-outline-variant/20 shadow-xl py-4 px-6 md:px-12 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 max-w-[50%]">
              <img 
                src={productImages[0]} 
                alt={product.title} 
                className="w-12 h-16 object-cover rounded-lg bg-surface-container-low border border-outline-variant/10"
              />
              <div className="text-left hidden sm:block truncate">
                <h4 className="font-serif text-primary text-sm truncate font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{product.title}</h4>
                <p className="text-xs text-outline font-semibold">
                  {displayVolume} &bull; ${(displayPrice || 0.00).toFixed(2)}
                </p>
              </div>
              <div className="text-left sm:hidden">
                <h4 className="font-serif text-primary text-sm truncate font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{product.title}</h4>
                <p className="text-xs text-secondary font-bold">${(displayPrice || 0.00).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center border border-outline-variant rounded-xl px-3 py-1 bg-surface">
                <button 
                  onClick={() => handleQtyChange('dec')}
                  className="p-1 hover:text-primary focus:outline-none transition-colors cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-bold text-xs text-primary">{quantity}</span>
                <button 
                  onClick={() => handleQtyChange('inc')}
                  className="p-1 hover:text-primary focus:outline-none transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-mono uppercase tracking-widest text-[10px] font-bold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[42px]"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors focus:outline-none cursor-pointer"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            
            {productImages.length > 1 && (
              <>
                <button 
                  className="absolute left-6 text-white hover:text-primary transition-colors focus:outline-none cursor-pointer bg-black/30 hover:bg-black/50 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIdx(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
                  }}
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-4xl">chevron_left</span>
                </button>
                <button 
                  className="absolute right-6 text-white hover:text-primary transition-colors focus:outline-none cursor-pointer bg-black/30 hover:bg-black/50 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIdx(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
                  }}
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-4xl">chevron_right</span>
                </button>
              </>
            )}

            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              src={productImages[selectedImgIdx]}
              alt={product.title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetail;
