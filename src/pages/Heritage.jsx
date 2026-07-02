import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Eye, Heart, ScrollText, ShieldCheck, Leaf, ChevronDown } from 'lucide-react';

const Heritage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      {/* Hero Banner */}
      <header className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-bottom" 
            style={{ backgroundImage: "url('/HERI.png')" }}
          ></div>
        </div>
        <div className="relative z-20 text-center px-container-padding max-w-4xl text-white">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-label-lg text-label-lg tracking-[0.2em] mb-6 block uppercase drop-shadow-md text-sm font-semibold"
          >
            Liquid Gold of Tunisia
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display-lg text-display-lg md:text-8xl mb-8 drop-shadow-lg text-4xl md:text-7xl font-bold"
          >
            A Legacy of Liquid Gold
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-0.5 bg-secondary-container mx-auto"
          ></motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white">
          <ChevronDown className="h-6 w-6 opacity-90" />
        </div>
      </header>

      {/* Brand Story */}
      <section className="py-section-gap-lg px-container-padding max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="space-y-6"
        >
          <span className="text-primary font-label-lg uppercase tracking-widest mb-4 block text-xs font-bold">
            Our Origin
          </span>
          <h2 className="font-display-lg text-headline-xl text-primary mb-8 italic text-3xl md:text-5xl">
            Roots in the Sahel
          </h2>
          <div className="space-y-6 font-body-lg text-body-lg text-on-surface-variant text-base md:text-lg font-light">
            <p>
              Born from the sun-drenched coastal plains of the Tunisian Sahel, OLIV'OR is more than a brand; it is a testament to three thousand years of Mediterranean heritage. Our story begins in the ancient groves where the air carries the scent of salt and earth.
            </p>
            <p>
              Tunisia is the world's leading orchard of organic olives, a land where trees are treated as family members and the harvest is a sacred dance. We founded OLIV'OR to bring this unadulterated excellence—once reserved for local masters—to the world's most discerning tables.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] bg-surface-container overflow-hidden rounded-xl shadow-2xl border border-outline-variant/10"
        >
          <div 
            className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7Ik6YPDOG3PYgDGO1tuqycGCxGFQLsTWPDEJd19aLQWcjvCMJpweHbwQEjfB5UOaNLLj4nk3Jswqxyv1tOt__tIwpwtu3vxn7rDzjm-PdyGjGyenqxbtAIOWFVMeeCDAOtJRlMrp7pqqJtXy2rynI8CeBzqaS-Ipbh9SPVsvA_A-7N5e-QIxmY8I-HDN0jO2R-V5JgYRBt8WkLQOYSxaJZ2IEHMKFx-lMZIZKDzv8qxujXmoZf8ly2w')` 
            }}
          ></div>
        </motion.div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-section-gap-lg bg-surface-container-low">
        <div className="px-container-padding max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {/* Mission */}
            <motion.div 
              variants={fadeIn}
              className="bg-surface p-10 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Flag className="h-6 w-6" />
              </div>
              <h3 className="font-display-lg text-headline-md text-primary mb-4 text-xl md:text-2xl font-bold">
                Our Mission
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm font-light leading-relaxed">
                To share the purest expression of Tunisian terroir with the world while preserving the ancestral traditions of our land.
              </p>
            </motion.div>
            
            {/* Vision */}
            <motion.div 
              variants={fadeIn}
              className="bg-surface p-10 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-display-lg text-headline-md text-primary mb-4 text-xl md:text-2xl font-bold">
                Our Vision
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm font-light leading-relaxed">
                To lead the global movement towards sustainable, artisanal olive oil production that honors both nature and grower.
              </p>
            </motion.div>
            
            {/* Values */}
            <motion.div 
              variants={fadeIn}
              className="bg-surface p-10 rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-display-lg text-headline-md text-primary mb-4 text-xl md:text-2xl font-bold">
                Our Values
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm font-light leading-relaxed">
                Integrity in every drop, stewardship of the earth, and profound respect for the heritage of the Sahel.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Pillars of OLIV'OR */}
      <section className="py-section-gap-lg px-container-padding max-w-7xl mx-auto text-center bg-background">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display-lg text-headline-xl text-primary mb-16 text-3xl md:text-5xl"
        >
          The Pillars of OLIV'OR
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-12 text-left"
        >
          <motion.div variants={fadeIn} className="p-8 bg-white border border-outline-variant/20 rounded-2xl hover:shadow-xl transition-all duration-300">
            <ScrollText className="h-12 w-12 text-primary mb-6" />
            <h4 className="font-display-lg text-headline-md mb-4 text-primary text-lg md:text-xl font-bold">
              Heritage
            </h4>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm font-light">
              Three millennia of Tunisian wisdom distilled into every drop. We honor the ancient Carthaginian methods of cultivation, preserving trees that have witnessed centuries of Mediterranean history.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="p-8 bg-white border border-outline-variant/20 rounded-2xl hover:shadow-xl transition-all duration-300">
            <ShieldCheck className="h-12 w-12 text-primary mb-6" />
            <h4 className="font-display-lg text-headline-md mb-4 text-primary text-lg md:text-xl font-bold">
              Quality
            </h4>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm font-light">
              Precision harvesting and 24-hour cold extraction ensure maximum polyphenol content. Our oil represents the pinnacle of chemical purity and sensory complexity.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="p-8 bg-white border border-outline-variant/20 rounded-2xl hover:shadow-xl transition-all duration-300">
            <Leaf className="h-12 w-12 text-primary mb-6" />
            <h4 className="font-display-lg text-headline-md mb-4 text-primary text-lg md:text-xl font-bold">
              Stewardship
            </h4>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm font-light">
              Protecting biodiversity through organic regenerative farming. We empower our local communities and safeguard the Sahel region's ecosystem for future generations.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* A Timeless Journey (Timeline) */}
      <section className="py-section-gap-lg bg-primary text-white overflow-hidden">
        <div className="px-container-padding max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display-lg text-headline-xl text-white mb-24 text-center text-3xl md:text-5xl"
          >
            A Timeless Journey
          </motion.h2>
          
          <div className="relative space-y-24 before:absolute before:left-1/2 before:-translate-x-1/2 before:w-px before:h-full before:bg-white/20">
            
            {/* 1894 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
              <div className="w-full md:w-1/2 px-8">
                <span className="font-display-lg text-6xl md:text-8xl text-white/10 absolute -top-16 left-8 md:left-auto md:right-8 pointer-events-none italic">
                  1894
                </span>
                <h4 className="font-headline-md text-headline-md mb-2 text-secondary-container text-xl md:text-2xl">
                  First Grove Planted
                </h4>
                <p className="text-white/80 font-body-md text-sm font-light leading-relaxed">
                  The Ben Salem family establishes our founding orchard in the Sousse region, planting the resilient Chemlali saplings that form the heart of our legacy.
                </p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container rounded-full border-4 border-primary z-10"></div>
              <div className="hidden md:block w-1/2"></div>
            </div>

            {/* 1950 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
              <div className="w-full md:w-1/2 px-8">
                <span className="font-display-lg text-6xl md:text-8xl text-white/10 absolute -top-16 left-8 md:left-auto md:right-8 pointer-events-none italic">
                  1950
                </span>
                <h4 className="font-headline-md text-headline-md mb-2 text-secondary-container text-xl md:text-2xl">
                  Modern Pressing
                </h4>
                <p className="text-white/80 font-body-md text-sm font-light leading-relaxed">
                  Transitioning from stone mills to early hydraulic pressing, allowing for cleaner, more consistent oil extraction while maintaining the soul of the fruit.
                </p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container rounded-full border-4 border-primary z-10"></div>
              <div className="hidden md:block w-1/2"></div>
            </div>

            {/* 2024 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
              <div className="w-full md:w-1/2 px-8">
                <span className="font-display-lg text-6xl md:text-8xl text-white/10 absolute -top-16 left-8 md:left-auto md:right-8 pointer-events-none italic">
                  2024
                </span>
                <h4 className="font-headline-md text-headline-md mb-2 text-secondary-container text-xl md:text-2xl">
                  Global Recognition
                </h4>
                <p className="text-white/80 font-body-md text-sm font-light leading-relaxed">
                  Launching our boutique label worldwide, combining ancestral wisdom with nitrogen-blanketed storage and sustainable luxury packaging.
                </p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container rounded-full border-4 border-primary z-10"></div>
              <div className="hidden md:block w-1/2"></div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Heritage;
