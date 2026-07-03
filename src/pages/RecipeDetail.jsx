import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChefHat, ArrowLeft, Bookmark, Heart, Share2, Sparkles, Check, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const { recipes, products, loadingRecipes } = useApp();
  
  const recipe = recipes.find(r => (r._id || r.id) === id);

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  if (loadingRecipes) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center text-center p-6 pt-32">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">sentiment_dissatisfied</span>
        <h2 className="font-headline-lg text-primary text-2xl mb-4 font-bold">Recipe Not Found</h2>
        <p className="text-on-surface-variant max-w-md mb-8">The culinary masterpiece you are looking for is not in our archives.</p>
        <Link to="/recipes" className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-xs">
          Return to Recipe Journal
        </Link>
      </div>
    );
  }

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // Suggest a product pairing based on recipe description / category
  // Search products for matching olive oil names mentioned in ingredients or match default
  const suggestedProduct = products && products.length > 0 
    ? (products.find(p => p.title.toLowerCase().includes('reserve')) || products[0])
    : null;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg max-w-[1280px] mx-auto px-gutter text-left">
        
        {/* Navigation & Actions */}
        <div className="mb-12 flex justify-between items-center">
          <Link 
            to="/recipes" 
            className="inline-flex items-center gap-2 text-label-sm font-label-sm text-outline hover:text-primary transition-colors uppercase tracking-widest text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Link>
          
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                isLiked 
                  ? 'bg-red-500/10 border-red-500 text-red-500' 
                  : 'border-outline-variant hover:text-red-500 hover:border-red-500 text-outline'
              }`}
              aria-label="Like recipe"
            >
              <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-red-500' : ''}`} />
            </button>
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                isBookmarked 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'border-outline-variant hover:text-primary hover:border-primary text-outline'
              }`}
              aria-label="Bookmark recipe"
            >
              <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-primary' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 rounded-3xl overflow-hidden aspect-[16/10] bg-surface-container border border-outline-variant/10 shadow-lg relative">
            <img 
              className="w-full h-full object-cover" 
              alt={recipe.title} 
              src={recipe.image} 
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider text-xs font-bold border border-secondary/15">
                {recipe.category}
              </span>
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-secondary font-label-lg uppercase tracking-[0.2em] text-xs font-bold block">
                Gourmet Journal
              </span>
              <h1 className="font-display-lg text-headline-xl text-primary leading-tight text-3xl md:text-5xl font-bold">
                {recipe.title}
              </h1>
            </div>
            
            <p className="text-body-lg text-on-surface-variant font-light leading-relaxed text-sm md:text-base">
              Elevate your home dining experience with this carefully curated Mediterranean masterpiece, showcasing the robust notes of our cold-pressed extra virgin olive oils.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-outline font-bold uppercase tracking-wider">Time</span>
                  <span className="font-semibold text-sm text-primary">{recipe.time}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-outline font-bold uppercase tracking-wider">Level</span>
                  <span className="font-semibold text-sm text-primary">{recipe.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-outline font-bold uppercase tracking-wider">Likes</span>
                  <span className="font-semibold text-sm text-primary">{likes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-20">
          
          {/* Left Column: Interactive Checklist of Ingredients */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20 shadow-sm space-y-6">
            <h3 className="font-display-lg text-headline-md text-primary text-xl font-bold border-b border-outline-variant/30 pb-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-secondary" /> Ingredients
            </h3>
            
            <p className="text-xs text-outline font-light">Click on ingredients to mark them off as you prepare your workspace.</p>
            
            <ul className="space-y-4">
              {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                <li 
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`flex items-start gap-4 cursor-pointer select-none group transition-all duration-300 ${
                    checkedIngredients[idx] ? 'opacity-50 line-through' : ''
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    checkedIngredients[idx] 
                      ? 'bg-secondary border-secondary text-white' 
                      : 'border-outline-variant group-hover:border-primary bg-white'
                  }`}>
                    {checkedIngredients[idx] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-body-md text-on-surface-variant font-light text-sm group-hover:text-primary transition-colors">
                    {ing}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column: Step-by-Step Instructions */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="font-display-lg text-headline-md text-primary text-xl font-bold border-b border-outline-variant/30 pb-4">
              Instructions
            </h3>
            
            <div className="space-y-8">
              {recipe.instructions && recipe.instructions.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-6 group transition-all duration-300 ${
                    completedSteps[idx] ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => toggleStep(idx)}
                      className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                        completedSteps[idx] 
                          ? 'bg-secondary text-white border-2 border-secondary shadow-md scale-95' 
                          : 'bg-primary/10 text-primary border border-primary/20 hover:bg-secondary hover:text-white hover:border-secondary'
                      }`}
                    >
                      {completedSteps[idx] ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : idx + 1}
                    </button>
                    {idx < recipe.instructions.length - 1 && (
                      <div className="w-0.5 h-full bg-outline-variant/35 min-h-[50px] mt-2"></div>
                    )}
                  </div>
                  
                  <div className="text-left space-y-2 pt-0.5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-wider text-outline">Step {idx + 1}</span>
                      <button 
                        onClick={() => toggleStep(idx)}
                        className="text-[10px] uppercase font-bold text-secondary opacity-0 group-hover:opacity-100 hover:underline transition-opacity"
                      >
                        {completedSteps[idx] ? 'Mark Incomplete' : 'Mark Done'}
                      </button>
                    </div>
                    <p className="text-body-lg text-on-surface-variant font-light leading-relaxed text-sm md:text-base">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Product Pairing */}
        {suggestedProduct && (
          <section className="bg-surface-container rounded-3xl p-10 border border-outline-variant/10 shadow-sm relative overflow-hidden mb-16">
            <div 
              className="absolute inset-0 opacity-[0.03] bg-cover bg-center" 
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVOhZBK2x00SxuS4gDeJjwKNHPvcS0mituRgfeKcNoNabVhhpkduKENcIQtcygkZHvqYCyFC1lF9eQ72deWOgTsYGzeeeMQ05KJ2wb7e6Rx9pnotqEREdBB23Df9d_X0zwcisiypqQcV3Q-3_ylk6fV9DUTxp-QcBMcqfHYXDDdzlDAUbFg_j0T50Ior8hsuqLlG5y_y4Ist345uCUmXSyW8hoOgTZZzYPl0NvyDUh_t0uXY4nQtkvSw')` 
              }}
            ></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4 text-left">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/15 px-3 py-1.5 rounded-full border border-secondary/20 select-none">
                  Expert Sommelier Recommendation
                </span>
                <h4 className="font-display-lg text-headline-lg text-primary text-xl md:text-2xl font-bold mt-2">
                  Featured Drizzle Pairing
                </h4>
                <p className="text-body-md text-on-surface-variant font-light text-sm max-w-xl">
                  For this recipe, we highly recommend finishing the dish with a generous drizzle of our premium <strong>{suggestedProduct.title}</strong>, harvested from organic groves in {suggestedProduct.region}.
                </p>
                <div className="pt-2">
                  <Link 
                    to={`/product/${suggestedProduct._id || suggestedProduct.id}`} 
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-label-lg transition-transform hover:scale-105 active:scale-95 text-xs uppercase font-bold tracking-widest shadow-md"
                  >
                    Discover the Oil
                  </Link>
                </div>
              </div>
              <div className="md:col-span-4 flex justify-center">
                <div className="w-28 h-36 bg-white rounded-2xl overflow-hidden border border-outline-variant/30 p-4 shadow-sm flex items-center justify-center">
                  <img 
                    className="max-h-full max-w-full object-contain" 
                    alt={suggestedProduct.title} 
                    src={suggestedProduct.images && suggestedProduct.images.length > 0 ? suggestedProduct.images[0] : suggestedProduct.image} 
                  />
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default RecipeDetail;
