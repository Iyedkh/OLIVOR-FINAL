import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flag, Eye, Heart, ScrollText, ShieldCheck, Leaf, ChevronDown, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const Heritage = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
      <header className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center" 
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

      {/* Brand Story / Our History */}
      <section className="py-section-gap-lg px-container-padding max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="space-y-6"
          >
            <span className="text-primary font-label-lg uppercase tracking-widest mb-2 block text-xs font-bold">
              Our History
            </span>
              <div className="space-y-6 font-body-lg text-body-lg text-on-surface-variant text-base md:text-lg font-light leading-relaxed">
              <p>
                For generations, at the heart of the sun-drenched lands of Tunisia, our family has cultivated the olive tree with passion, patience, and respect for Mediterranean traditions.
              </p>
              <p>
                Much more than a tree, the olive tree represents a living heritage for us, passed down from generation to generation. Each harvest tells a story of expertise, authenticity, and love for the land.
              </p>
              <p>
                It is from this family tradition that <strong>OlivOr</strong> was born: an exceptional extra virgin olive oil, crafted from olives carefully selected and harvested at the peak of their maturity.
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
                backgroundImage: `url('/H1.png')` 
              }}
            ></div>
          </motion.div>
        </div>

        {/* Second Part: Methods & Reflections */}
        <div className="grid md:grid-cols-2 gap-16 items-start mt-20 pt-16 border-t border-outline-variant/20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="space-y-6"
          >
            <h3 className="font-display-lg text-headline-lg text-primary italic text-2xl md:text-3xl">
              Our Sacred Methods
            </h3>
            <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
              Our methods remain faithful to the values that have always guided us:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-on-surface-variant">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">✓</span>
                <span className="font-light">Careful, selective harvesting</span>
              </li>
              <li className="flex items-center space-x-3 text-on-surface-variant">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">✓</span>
                <span className="font-light">First cold pressing to retain all nutrients</span>
              </li>
              <li className="flex items-center space-x-3 text-on-surface-variant">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">✓</span>
                <span className="font-light">Preserved natural, unadulterated quality</span>
              </li>
              <li className="flex items-center space-x-3 text-on-surface-variant">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">✓</span>
                <span className="font-light">Deep respect for the unique Tunisian terroir</span>
              </li>
            </ul>

            <div className="pt-6 font-body-lg text-body-lg text-on-surface-variant text-base md:text-lg font-light leading-relaxed">
              <p>
                Inspired by the richness of the Mediterranean and driven by a modern vision of luxury, OlivOr today combines tradition and elegance to offer a refined olive oil destined for lovers of authentic and high-end products.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="space-y-8 bg-surface-container-low p-8 md:p-12 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="font-display-lg text-headline-lg text-primary italic text-2xl md:text-3xl">
              A Reflection of Excellence
            </h3>
            <p className="font-body-md text-on-surface-variant font-light leading-relaxed">
              Each bottle of OlivOr is a reflection of:
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-container text-amber-700 font-bold shrink-0">I</div>
                <div>
                  <h4 className="font-semibold text-primary">An Ancestral Heritage</h4>
                  <p className="text-sm font-light text-on-surface-variant mt-1">Passed down from generation to generation, keeping our family customs alive.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-container text-amber-700 font-bold shrink-0">II</div>
                <div>
                  <h4 className="font-semibold text-primary">An Exceptional Terroir</h4>
                  <p className="text-sm font-light text-on-surface-variant mt-1">Sourced from the sun-drenched fields of Tunisia, famous for superior olive growing.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-container text-amber-700 font-bold shrink-0">III</div>
                <div>
                  <h4 className="font-semibold text-primary">A Family Passion</h4>
                  <p className="text-sm font-light text-on-surface-variant mt-1">A deep, unconditional love for the land and the olive trees that transcends time.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/20 text-center">
              <span className="font-logo text-xl md:text-2xl text-primary tracking-wider block">
                OlivOr
              </span>
              <span className="text-secondary text-xs uppercase tracking-widest block mt-1 font-bold">
                The Gold of the Mediterranean
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-section-gap-lg bg-surface-container-lowest overflow-hidden">
        <div className="px-container-padding max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <span className="text-primary font-label-lg uppercase tracking-widest mb-2 block text-xs font-bold">
              Cinematic Experience
            </span>
            <h2 className="font-display-lg text-headline-xl text-primary mb-6 italic text-3xl md:text-5xl">
              The Essence in Motion
            </h2>
            <div className="h-0.5 w-24 bg-secondary-container mx-auto mb-6"></div>
            <p className="font-body-md text-on-surface-variant font-light leading-relaxed text-base md:text-lg">
              Step into our groves and experience the patience, tradition, and artistry that goes into every single drop of OlivOr liquid gold.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 bg-black group"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/VD2.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Elegant HUD & Interactive Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between p-6 md:p-8">
              <div className="flex justify-between items-center w-full">
                <span className="font-logo text-white text-base md:text-lg tracking-widest drop-shadow-md">OLIV'OR</span>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-widest drop-shadow-md bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">Tunisia</span>
              </div>

              {/* Center Play/Pause Indicator (large) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 pointer-events-auto shadow-lg"
                  aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                >
                  {isPlaying ? <Pause className="h-8 w-8 text-white fill-white" /> : <Play className="h-8 w-8 text-white fill-white translate-x-0.5" />}
                </button>
              </div>

              <div className="flex justify-between items-end w-full mt-auto">
                <div className="text-left text-white max-w-xs md:max-w-md drop-shadow-md">
                  <p className="text-xs uppercase tracking-widest text-[#F6BE3C] font-semibold mb-1">Our Groves</p>
                  <h4 className="text-lg md:text-2xl font-serif italic font-medium">A Legacy Transmitted in Gold</h4>
                </div>
                
                {/* Mute/Unmute toggle button */}
                <button
                  onClick={toggleMute}
                  className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors pointer-events-auto"
                  aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
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
