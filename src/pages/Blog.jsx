import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, Sparkles, X, ChevronRight } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 'centenary-trees-sfax',
    title: 'The Centenary Groves of Sfax: Living History in Every Drop',
    category: 'Heritage',
    date: 'June 24, 2026',
    author: 'Mohamed Ben Ali',
    readTime: '6 Min Read',
    excerpt: 'Deep in the heart of Sfax, ancient Chemlali olive trees have stood watch for over a century. Discover the stories carved into their gnarled trunks.',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=800',
    content: `
      Much like the ancient temples that dot the Tunisian coast, the centenary olive trees of Sfax are living monuments of history. These trees—some planted over three generations ago—have adapted to the dry, sun-scorched soil of the Sahel, yielding small but intensely concentrated olives.
      
      What makes these ancient trees unique is their root systems, which stretch dozens of meters underground to tap into pristine moisture reservoirs. This survival mechanism results in an olive oil that is incredibly rich in organic polyphenols, boasting a signature peppery finish and an unmatched complexity.
      
      At OLIV'OR, we respect these elders of the grove. Harvesting their fruit requires gentle hands and traditional ladders—no heavy machinery is allowed near their delicate root zones. The result of this patience is our limited-edition Black Label 1904, a tribute to the ancestors who planted these groves.
    `
  },
  {
    id: 'polyphenols-health-benefits',
    title: 'Polyphenols: Decoding the Science of Liquid Gold',
    category: 'Wellness',
    date: 'May 18, 2026',
    author: 'Dr. Sofia Krichen',
    readTime: '8 Min Read',
    excerpt: 'Not all olive oils are created equal. Understand how high-polyphenol extra virgin olive oil supports cardiac health and combats cellular aging.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    content: `
      Polyphenols are the natural organic compounds found in extra virgin olive oil that give it its distinctive bitter and peppery kick. But beyond taste, they represent one of the most powerful anti-inflammatory and antioxidant agents found in nature.
      
      Medical studies suggest that daily consumption of high-polyphenol olive oil helps protect blood lipids from oxidative stress, maintaining flexible arteries and reducing the risk of cardiovascular events. Additionally, these compounds play a significant role in gut health and cellular regeneration.
      
      To preserve these delicate molecules, OLIV'OR employs strict cold-pressing processes. By keeping temperatures strictly below 22°C during extraction and storing our oil in dark glass bottles with nitrogen seals, we ensure the high polyphenol count remains active from our grove to your table.
    `
  },
  {
    id: 'early-vs-late-harvest',
    title: 'Early Harvest vs. Late Harvest: The Flavor Spectrum',
    category: 'Culinary',
    date: 'April 05, 2026',
    author: 'Chef Hassen Karoui',
    readTime: '5 Min Read',
    excerpt: 'From bright green herbaceous notes to smooth, buttery golden finishes. Learn how the picking timeline completely alters the profile of your drizzle.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
    content: `
      The harvest calendar is the culinary dial of the olive farmer. A difference of just three weeks in picking time can completely transform the chemistry and flavor profile of the oil.
      
      Early Harvest olives are picked in mid-October when they are still green. The oil extracted is vibrant green, highly herbaceous, and packed with chlorophyll and bitter polyphenols. It tastes of green tomatoes, fresh-cut grass, and artichokes. It is best used raw as a finishing oil on burrata, grilled vegetables, and warm bread.
      
      Late Harvest olives are harvested in December when they have turned dark purple. The oil is rich yellow, buttery, and incredibly smooth. It pairs wonderfully with delicate fish, baking, or light dressings where you want oil texture without overwhelming pepperiness.
    `
  },
  {
    id: ' Zaghouan-water-sources',
    title: 'The Waters of Zaghouan: Nurturing Our Organic Groves',
    category: 'Harvest Guide',
    date: 'March 12, 2026',
    author: 'Amira Mansour',
    readTime: '7 Min Read',
    excerpt: 'How the natural mineral springs flowing from the Zaghouan mountains feed our certified organic olive farms and shape our unique terroir.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    content: `
      Terrroir is not just about soil; it is about water. In the mountanous region of Zaghouan, our certified organic groves are nurtured by pure mineral springs flowing down from the rugged peaks.
      
      This water, rich in calcium and natural minerals, irrigates the soil in a balanced rhythm, helping the olive trees build robust defenses. As a result, the leaves are healthier and the olives require absolutely no synthetic pesticides or fertilizers.
      
      When you taste our Zaghouan estate selection, you are tasting the mountain air, the mineral soil, and the pure spring water that has flowed through Roman aqueducts for thousands of years.
    `
  }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null); // For detail view overlay/modal

  const categories = ['All', 'Heritage', 'Wellness', 'Culinary', 'Harvest Guide'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      
      {/* Header Banner */}
      <section className="relative pt-32 pb-16 max-w-screen-2xl mx-auto px-container-padding text-left">
        <nav className="mb-8 flex items-center gap-2 text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-outline-variant" />
          <span className="text-primary font-semibold">Gourmet Journal</span>
        </nav>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-outline-variant/30 pb-12">
          <div>
            <span className="text-secondary font-label-lg uppercase tracking-[0.2em] text-xs font-bold block mb-3">
              Grove Stories & Science
            </span>
            <h1 className="font-display-lg text-display-lg text-primary text-3xl md:text-5xl lg:text-6xl font-bold">
              The Gourmet Journal
            </h1>
          </div>
          <p className="text-body-lg text-on-surface-variant max-w-md font-light leading-relaxed text-sm md:text-base">
            Delve into heritage harvest chronicles, culinary pairing guides, and scientific research on the wellness attributes of premium extra virgin olive oil.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {selectedCategory === 'All' && !searchQuery && featuredPost && (
        <section className="max-w-screen-2xl mx-auto px-container-padding pb-16 text-left">
          <div className="bg-surface-container rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto bg-surface overflow-hidden">
              <img 
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" 
                alt={featuredPost.title} 
                src={featuredPost.image} 
              />
            </div>
            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider text-xs font-bold border border-secondary/15 w-fit">
                Featured — {featuredPost.category}
              </span>
              <h2 
                onClick={() => setSelectedPost(featuredPost)}
                className="font-display-lg text-headline-xl text-primary hover:text-secondary cursor-pointer transition-colors text-2xl md:text-4xl font-bold leading-tight"
              >
                {featuredPost.title}
              </h2>
              <p className="text-body-md text-on-surface-variant font-light leading-relaxed text-sm">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center gap-6 text-xs text-outline font-semibold border-t border-outline-variant/20 pt-6">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {featuredPost.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {featuredPost.readTime}</span>
              </div>
              
              <button 
                onClick={() => setSelectedPost(featuredPost)}
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 hover:text-secondary transition-all uppercase tracking-widest text-xs pt-2"
              >
                Read Full Story <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <section className="max-w-screen-2xl mx-auto px-container-padding pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/15">
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'border-outline-variant hover:border-primary text-outline hover:text-primary bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-white text-on-surface border border-outline-variant rounded-full py-3 pl-12 pr-6 text-sm placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-outline-variant" />
          </div>
        </div>
      </section>

      {/* Grid of Articles */}
      <section className="max-w-screen-2xl mx-auto px-container-padding pb-section-gap-lg">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-on-surface-variant">
            <BookOpen className="h-16 w-16 opacity-25 mb-4 text-primary" />
            <p className="font-body-lg text-lg font-light">No articles matched your selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col text-left group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-surface-container">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={post.title} 
                    src={post.image} 
                  />
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-outline font-medium">{post.readTime}</span>
                  </div>
                  
                  <h3 
                    onClick={() => setSelectedPost(post)}
                    className="font-display-lg text-headline-md text-primary group-hover:text-secondary cursor-pointer transition-colors font-bold text-lg md:text-xl mb-3 leading-snug line-clamp-2"
                  >
                    {post.title}
                  </h3>
                  
                  <p className="text-body-md text-on-surface-variant font-light text-sm line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-outline-variant/15 flex justify-between items-center">
                    <span className="text-[11px] text-outline font-semibold">By {post.author}</span>
                    <button 
                      onClick={() => setSelectedPost(post)}
                      className="text-primary font-bold hover:text-secondary text-xs uppercase tracking-widest inline-flex items-center gap-1.5"
                    >
                      Read <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Blog Article Reader Drawer / Overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)}></div>
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-3xl bg-background h-full shadow-2xl flex flex-col text-left overflow-y-auto"
          >
            {/* Header / Sticky Bar */}
            <div className="sticky top-0 bg-background/95 backdrop-blur z-20 border-b border-outline-variant/20 px-8 py-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">{selectedPost.category}</span>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center text-outline hover:text-primary transition-all focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Banner Image */}
            <div className="w-full aspect-[21/9] bg-surface-container relative">
              <img className="w-full h-full object-cover" src={selectedPost.image} alt={selectedPost.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Content Area */}
            <div className="px-8 py-10 space-y-8 flex-grow">
              <div className="space-y-4">
                <h1 className="font-display-lg text-headline-xl text-primary text-2xl md:text-4xl font-bold leading-tight">
                  {selectedPost.title}
                </h1>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-outline font-semibold border-b border-outline-variant/20 pb-6">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> By {selectedPost.author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {selectedPost.readTime}</span>
                </div>
              </div>

              {/* Body Text */}
              <div className="font-body-lg text-on-surface-variant leading-relaxed text-sm md:text-base font-light space-y-6">
                {selectedPost.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>

              {/* Closing Signature */}
              <div className="border-t border-outline-variant/20 pt-8 flex items-center justify-between mt-12 bg-surface-container-lowest p-6 rounded-2xl border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-primary uppercase">OLIV'OR Editorial Board</span>
                    <span className="text-[10px] text-outline">Dedicated to gourmet olive oil heritage</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Blog;
