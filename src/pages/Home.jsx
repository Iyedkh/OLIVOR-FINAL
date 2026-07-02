import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag, Star } from 'lucide-react';

const Home = () => {
  const scrollerRef = useRef(null);

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/mediterranean_olive_grove_1782986766051.jpg')" }}
          ></div>
        </div>
        
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-[1440px] px-container-padding mt-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left md:max-w-2xl text-white"
          >
            <span className="font-label-lg text-label-lg uppercase tracking-widest text-secondary-container mb-4 block">
              Harvested by hand
            </span>
            <h1 className="font-display-lg text-display-lg mb-6 leading-tight text-4xl md:text-6xl lg:text-7xl">
              From the Heart of Tunisia to Your Table
            </h1>
            <p className="font-body-lg text-body-lg mb-10 opacity-90 leading-relaxed max-w-lg">
              Experience the liquid gold of the Mediterranean, harvested by hand and cold-pressed with ancestral devotion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/shop" 
                className="bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20 text-center"
              >
                Shop Collection
              </Link>
              <Link 
                to="/heritage" 
                className="border border-white/50 backdrop-blur-md text-white font-label-lg text-label-lg px-10 py-5 rounded-full hover:bg-white hover:text-primary transition-all duration-300 text-center"
              >
                Discover Our Story
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            className="hidden md:block relative animate-float"
          >
            <div className="absolute -inset-10 bg-secondary-container/20 blur-3xl organic-shape"></div>
            <img 
              className="h-[600px] w-auto relative z-10 drop-shadow-2xl rounded-4xl" 
              alt="OLIV'OR Premium Bottle"
              src='/1L.png'
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose OLIV'OR Section */}
      <section className="py-section-gap-lg px-container-padding bg-surface-container-low">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center"
        >
          <motion.div variants={fadeIn} className="group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 text-primary">
              <span className="material-symbols-outlined text-4xl">eco</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">100% Organic</h3>
            <p className="text-on-surface-variant leading-relaxed text-body-md">
              Certified organic farming practices that respect the Tunisian soil and promote biodiversity.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 text-primary">
              <span className="material-symbols-outlined text-4xl">pan_tool</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">Hand-Harvested</h3>
            <p className="text-on-surface-variant leading-relaxed text-body-md">
              Each olive is gently hand-picked at peak ripeness to ensure zero bruising and maximum flavor profile.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 text-primary">
              <span className="material-symbols-outlined text-4xl">oil_barrel</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">First Cold Pressed</h3>
            <p className="text-on-surface-variant leading-relaxed text-body-md">
              Extracted without heat or chemicals, preserving the antioxidants and polyphenols for pure health.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Scroller */}
      <section className="py-section-gap-lg overflow-hidden bg-background">
        <div className="max-w-[1440px] mx-auto px-container-padding mb-12 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-label-lg text-label-lg text-secondary uppercase tracking-widest block mb-2">
              Curated Selection
            </span>
            <h2 className="font-headline-xl text-headline-xl text-primary">
              Seasonal Collections
            </h2>
          </motion.div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollLeft}
              className="p-4 rounded-full border border-outline-variant hover:bg-primary hover:text-white transition-all focus:outline-none"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined block">arrow_back</span>
            </button>
            <button 
              onClick={scrollRight}
              className="p-4 rounded-full border border-outline-variant hover:bg-primary hover:text-white transition-all focus:outline-none"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined block">arrow_forward</span>
            </button>
          </div>
        </div>

        <motion.div 
          ref={scrollerRef}
          className="flex gap-6 px-container-padding overflow-x-auto scroller-hide snap-x"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Product Card 1 */}
          <motion.div 
            variants={fadeIn}
            className="min-w-[180px] md:min-w-[220px] bg-white rounded-xl p-3 group cursor-pointer snap-start border border-outline-variant/10 shadow-sm"
          >
            <Link to="/product/reserve-collection">
              <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Reserve Collection Bottle"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsbT7Hx2sj5VJBn-NfFC36gri3sH0MrZuEim-PZzqBlHLxonjWYPIQS5Z3fwQ89WbMpLE_PHY71fv_deKNP4M1Fv0NLAtLBHB0Z5xlYw2m-wLL34vwG3bmLmfypl98W303OGeVq2kN2J4IWOezkA2s8hbc1J7GhFZA6X2E9vY6FedKFxXmtTcxcchNiwfPUoGh9jHxCbbrqkfukicJH0a0WIg3o6bOQUxIw6ZLE8HAF0OQFgjVT70p3w"
                />
                <div className="absolute top-2 left-2 bg-secondary-container text-on-secondary-container font-label-sm px-1.5 py-0.5 rounded text-[8px] tracking-wide">
                  Limited Release
                </div>
              </div>
              <h4 className="font-headline-md text-sm text-primary mb-0.5 font-semibold">Reserve Collection</h4>
              <p className="text-on-surface-variant text-[11px] mb-2 leading-tight font-body-md">
                Bold, peppery notes with a velvety finish.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-headline-md text-sm text-primary font-bold">$48.00</span>
                <button className="text-primary hover:text-secondary flex items-center gap-1 text-[11px] font-semibold">
                  Add <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
                </button>
              </div>
            </Link>
          </motion.div>

          {/* Product Card 2 */}
          <motion.div 
            variants={fadeIn}
            className="min-w-[180px] md:min-w-[220px] bg-white rounded-xl p-3 group cursor-pointer snap-start border border-outline-variant/10 shadow-sm"
          >
            <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Heritage Blend Bottle"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJepa3o6sJKIVVNJj4OOyVllRHF2JJ-4XfmdCs0cltMYIGt0H7i6JDKTJRqfn7ff6j4tYwvHbyp29hRuUgw4RRM_zRKcuMqjSnIfBmE0KKmdGBCeheF5YqZdRr7qX3mk1eCJxIV_MyAssbJr7P2aW0qVkejJivCZaxWYhXUeEkSuLJiry1dRQRwyqNi6ZlxbHyB1abQZDAFUMNbJWzTk5i3QVlWKiZFhn8eOQu86OMccZyoOSMZ1IUoA"
              />
            </div>
            <h4 className="font-headline-md text-sm text-primary mb-0.5 font-semibold">Heritage Blend</h4>
            <p className="text-on-surface-variant text-[11px] mb-2 leading-tight font-body-md">
              A harmonious balance of smooth and robust flavors.
            </p>
            <div className="flex justify-between items-center">
              <span className="font-headline-md text-sm text-primary font-bold">$35.00</span>
              <button className="text-primary hover:text-secondary flex items-center gap-1 text-[11px] font-semibold">
                Add <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
              </button>
            </div>
          </motion.div>

          {/* Product Card 3 */}
          <motion.div 
            variants={fadeIn}
            className="min-w-[180px] md:min-w-[220px] bg-white rounded-xl p-3 group cursor-pointer snap-start border border-outline-variant/10 shadow-sm"
          >
            <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Infused Sage Oil Bottle"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALAkZLj-PVYnKZULYj-IkYImwZyFnaQQeGShjaDLwPRcqSXvXOJOgYiB4CmSxcabXvwsTPv4zIWe102VMcagkz6gNaJwxavT6bhjKYml7azggprVvhXYAmuNTVsb6PE58loqGH0RarlKh36OAEa5GwhXTPXWFCa4n-q7v4RP7t_P_z38va2pQ5L7hQRQrb5G0R4SfLEVRxewXG_mpB95iX6aStjGiDMao-xWN5YUbYClfwvGs3WTDrXA"
              />
            </div>
            <h4 className="font-headline-md text-sm text-primary mb-0.5 font-semibold">Infused Sage Oil</h4>
            <p className="text-on-surface-variant text-[11px] mb-2 leading-tight font-body-md">
              Wild desert sage infused for an aromatic culinary lift.
            </p>
            <div className="flex justify-between items-center">
              <span className="font-headline-md text-sm text-primary font-bold">$42.00</span>
              <button className="text-primary hover:text-secondary flex items-center gap-1 text-[11px] font-semibold">
                Add <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Heritage Section */}
      <section className="py-section-gap-lg px-container-padding bg-background">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container/10 rounded-full blur-2xl"></div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden shadow-2xl relative z-10 aspect-[4/3] md:aspect-square"
            >
              <img 
                className="w-full h-full object-cover" 
                alt="Tunisian olive harvester hands"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAERq1q-2QFbFFDTLKTzYWVEJc967-0C1uNt-E8U_57cNbtxuo7V6Wy3NA_FLOQzfWl72JS2cfnTxekD0KXr1i3S6K3P2M79eYtDE3XNbk_7xItXL9qM9RjhypMxw_qGZsKW8VISoY38ezheBcjt9V3a0HHMD5cgXKQ03qpxysjSP4nEXXB6qGm9bD2LwVBGJ5bxF3VafQUxi6-aZpG4Ka7zr5gdUdzHCboSLdBGXdO-OCfvIOXMPZs6Q"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-12 -right-12 w-64 h-80 hidden lg:block rounded-2xl overflow-hidden border-8 border-white shadow-xl z-20"
            >
              <img 
                className="w-full h-full object-cover" 
                alt="Tunisian olive grove terraced landscape"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4aqtLENqgIEYtg6mYYkXmvtke5uwQVf7-8sPoJcSg9wsll_Zfg5hx3af8xSYuvuecxRWvMgBOj-1KnXXxSW96WnMi95dbfuX-9oh8Su3xZPF3xvVu3d0nCophi0TjCtaq84QDqnw4dKuYqkLusVBVns7u2Nkns-VyjVY-le-kXeR1LLRudRfZYszx4bNSeXMqLC7ly27mHk8NL4Rq9rU0x1i7jrg-y-AJGY8qzwj0z7Arb2rz3A1Pw"
              />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="font-label-lg text-label-lg text-secondary uppercase tracking-widest block">
              Our Legacy
            </span>
            <h2 className="font-headline-xl text-headline-xl text-primary leading-tight">
              Ancestral devotion, modern precision.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              For generations, the OLIV'OR family has tended to the sun-drenched groves of the Tunisian Sahel. Our methods haven't changed much since the days of Carthage — we still listen to the trees, we still harvest under the Mediterranean sun, and we still honor the liquid gold that has sustained our culture for millennia.
            </p>
            <div className="pt-6">
              <Link to="/heritage" className="inline-flex items-center gap-3 text-primary font-label-lg group font-semibold">
                Read the full story 
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">trending_flat</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Bento Grid */}
      <section className="py-section-gap-lg bg-surface-container">
        <div className="max-w-[1440px] mx-auto px-container-padding text-center mb-16">
          <h2 className="font-headline-xl text-headline-xl text-primary">
            Customer Favorites
          </h2>
          <p className="text-on-surface-variant mt-4 font-body-md">
            The bottles that define the Mediterranean palate.
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-container-padding grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[800px]">
          {/* Large Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 md:row-span-2 bg-white rounded-3xl overflow-hidden group relative flex flex-col justify-end p-10 cursor-pointer min-h-[400px] md:min-h-auto shadow-sm border border-outline-variant/10"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              alt="Signature Daily Blend flat lay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1WRFvE83e-y9exy8fuOauN55VYKMWD4PxIvrMWFJOgQCEcsI2lmJm6WogRrEqJEpwzHNC6GuN3id3rp97XE8cgmxc0kUvobauyyNCczjNn4TU_crHbY9OT3cEUjjBR49svfJc8DTXB_q-HQ5YdzhXlTSMJt7XTUF6slBX5P3yXs-6SAYsJ2j9I1S__P5QiBLJJj2JOfqAtVP-H64FcJGxNkHvidv98cxXjkg6DjgKy8A3Ns7OF5wP7g"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="relative z-10 text-white">
              <span className="font-label-sm bg-secondary px-3 py-1 rounded-full mb-4 inline-block text-xs text-white">
                Best Seller
              </span>
              <h3 className="font-headline-xl text-white mb-2 text-2xl md:text-4xl">
                Signature Daily Blend
              </h3>
              <p className="opacity-80 mb-6 font-body-md">
                The essential foundation for every kitchen.
              </p>
              <Link to="/shop" className="inline-block bg-white text-primary px-8 py-3 rounded-full font-label-lg hover:bg-secondary-container hover:text-on-secondary-container transition-colors text-center font-semibold">
                Shop Signature
              </Link>
            </div>
          </motion.div>

          {/* Side Card 1 */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 bg-white rounded-3xl overflow-hidden group relative p-10 flex items-center justify-between cursor-pointer min-h-[200px] md:min-h-auto shadow-sm border border-outline-variant/10"
          >
            <div className="z-10 w-1/2">
              <h3 className="font-headline-md text-primary mb-2 text-xl md:text-2xl">
                Early Harvest Green
              </h3>
              <p className="text-on-surface-variant mb-6 font-body-md text-sm">
                Sharp, grassy, and vibrant.
              </p>
              <span className="font-headline-md text-primary text-xl md:text-2xl block mb-2">$52.00</span>
            </div>
            <img 
              className="absolute right-0 top-0 h-full w-2/3 object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Early Harvest Green Bottle"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4p6E1u3ivSuxW22rclIVJf0HLtS-_wJXLHArE3ilCKgh-0OXgE34NG96Rh9PT3344WTXrbUHlqT4Cd_6O9C3M2Yo7kjHzD4PsHYfdA7WUaDlsQECw2o9b-xcQm5-iGmapf17c0C5zjIc7JgGaCPSGWxz7ssW2GijcArIms5rwOSN4m2MiQjbegWpTlids1Tlxmy1gVUTG4WSWwhLvi68df71obQg0t32-2Eogx0Vcbrov7gGVLNI_Og"
            />
          </motion.div>

          {/* Side Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl overflow-hidden group relative p-8 flex flex-col justify-end cursor-pointer min-h-[200px] md:min-h-auto shadow-sm border border-outline-variant/10"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Servingware accessories"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk-4XA7GkwIxuXhoIvHHyexIq8Phes2_un7_i9rdQqiXVp5l014ih17GTWuzIovSomdMUxo_sSfhk6Aa4UNmf77ST-iobFhONHrbpAzyRfN5RyT44mV8TmlpF_A_f-jMSLIcSEOo7_wQmUMR4t3W9eD5rA6KBhjYfSpzZDQwiB0miFUBd45X6tjnLhojDlbApTliuR0RJ-f46epT5JSbYjE0lZbsWNx8FpZgtcbe-Tq6q1UZ0pTPJJKw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            <div className="relative z-10 text-white text-center">
              <h4 className="font-headline-md text-white text-xl">Servingware</h4>
            </div>
          </motion.div>

          {/* Side Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl overflow-hidden group relative p-8 flex flex-col justify-end cursor-pointer min-h-[200px] md:min-h-auto shadow-sm border border-outline-variant/10"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Gifts box set"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2gFgoF_mACBViCMcQpq4UxwliDQtYpAmjt5mDA_-qEkiA3bAkqKvMhgmEY-l52QiYxWuuuYjpv_2ENWHSpCsyEsyvQfK8Xfa5ZhWtKaoQ6ggecnwkd8o-udfFKULXOfOgAAts9nNDk6IlNZ0LrYB3cGmLYDQzZk2YjxozkjxCGvcZqk_MDHygGVR7uIQiE9pTMSM6OIIT7Qa8B_t_6jw8zdzhGv_d2Ji8R6bhuohTYICBipEEZWeDg"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            <div className="relative z-10 text-white text-center">
              <h4 className="font-headline-md text-white text-xl">Gifts</h4>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-section-gap-lg px-container-padding bg-background border-t border-outline-variant/10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[1000px] mx-auto text-center"
        >
          <span className="material-symbols-outlined text-secondary text-6xl mb-8 select-none">format_quote</span>
          <div className="space-y-12">
            <blockquote className="font-headline-xl text-headline-xl text-primary italic leading-tight text-2xl md:text-4xl lg:text-5xl px-4">
              "This isn't just olive oil; it's a sensory journey to Tunisia. The complexity of the Reserve Collection changed how I approach my cooking forever."
            </blockquote>
            <div className="space-y-2">
              <p className="font-label-lg text-label-lg text-primary uppercase tracking-widest font-bold">
                — Elena Rossi, Executive Chef
              </p>
              <div className="flex justify-center gap-1 text-secondary">
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
