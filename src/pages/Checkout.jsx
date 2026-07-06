import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, ShieldCheck, Lock, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const checkoutProducts = [
  {
    id: 'reserve-collection',
    title: 'Reserve Collection',
    price: 48.00,
    subtitle: 'Early Harvest, 500ml',
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOLTgNmPa4YnVTTM2p-KFgs3dKvKoEgH_KoUP7QGEoWKlv_fbVCdPMOyZaQLbYrJ_YUAT8my2mvQss1J8gOY3gkJ9gSfoHjyv2qRfezviFeQTNHDJVAjTY5lVldZr5jVF7llpxusQz5gQRScsoMcmHGgueZzgk79RbqfyGzV5PWrBKFAJgH-k8CUEN2bV0PO694Gv_SmkOPDjuhVNbgj5wPA8N-T1OnrpIPhaXhesXWZej1UjpG4L1tA'
  },
  {
    id: 'heritage-blend',
    title: 'Heritage Blend',
    price: 35.00,
    subtitle: 'Cold Pressed, 750ml',
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHUvL2U6aapMQk1qsJoArdN823uIspIt8lEjtcuwYMPsi62Ds4WefpRjPN-TvIYUdj6rMxufuAxAuD12qeQKkOIskaZkszOkm7xyj9-Syw30Jfsiw_-wq9KFR6jiGhtJvJNwBI66QUCMAeq7Ix6661Ks-xJqMJwurevIey5KN2S0GI1t99J1fVavNNT9HZEOftF3hTmYrbFl_Zbnl10e7oz5JOa3AgmLSy-v9HBT03ENfs8BEJlXTYkw'
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { token, cart, placeOrder, user } = useApp();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment, 4: Review, 5: Success
  const [loading, setLoading] = useState(false);
  const [shippingForm, setShippingForm] = useState(() => {
    try {
      const saved = localStorage.getItem('checkout_shipping_draft');
      return saved ? JSON.parse(saved) : {
        email: '',
        subscribe: true,
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        postalCode: '',
        phone: ''
      };
    } catch {
      return {
        email: '',
        subscribe: true,
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        postalCode: '',
        phone: ''
      };
    }
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState(() => {
    return localStorage.getItem('checkout_delivery_draft') || 'standard';
  });

  const [paymentForm, setPaymentForm] = useState(() => {
    try {
      const saved = localStorage.getItem('checkout_payment_draft');
      return saved ? JSON.parse(saved) : {
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
      };
    } catch {
      return {
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('checkout_shipping_draft', JSON.stringify(shippingForm));
  }, [shippingForm]);

  useEffect(() => {
    if (user && !shippingForm.email) {
      setShippingForm(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user, shippingForm.email]);

  useEffect(() => {
    localStorage.setItem('checkout_delivery_draft', deliveryMethod);
  }, [deliveryMethod]);

  useEffect(() => {
    localStorage.setItem('checkout_payment_draft', JSON.stringify(paymentForm));
  }, [paymentForm]);

  useEffect(() => {
    if (cart.length === 0 && step !== 5) {
      navigate('/cart');
    }
  }, [cart, navigate, step]);
 
  const handleInputChange = (field, value) => {
    setShippingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculations
  const subtotal = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const couponCode = localStorage.getItem('checkout_coupon_code') || '';
  const discountValue = Number(localStorage.getItem('checkout_discount_value')) || 0;
  const discountAmount = subtotal * discountValue;
  const taxableAmount = subtotal - discountAmount;
  const shippingCost = deliveryMethod === 'express' ? 15.00 : 0.00;
  const total = taxableAmount + (taxableAmount * 0.08) + shippingCost;

  const handlePlaceOrder = async () => {
    if (!token) {
      alert('Please log in or register an account to place an order.');
      navigate('/login?redirect=checkout');
      return;
    }
    
    setLoading(true);
    const orderData = {
      orderItems: cart.map(item => ({
        title: item.title,
        qty: item.quantity,
        image: item.images && item.images.length > 0 ? item.images[0] : item.image,
        price: item.price,
        product: item.id || item._id,
        volume: item.volume || '500ml'
      })),
      shippingAddress: {
        firstName: shippingForm.firstName,
        lastName: shippingForm.lastName,
        address: shippingForm.address,
        apartment: shippingForm.apartment || '',
        city: shippingForm.city,
        postalCode: shippingForm.postalCode,
        country: 'Tunisia',
        phone: shippingForm.phone
      },
      paymentMethod: 'Credit Card',
      couponCode: couponCode || undefined,
      itemsPrice: subtotal,
      taxPrice: taxableAmount * 0.08,
      shippingPrice: shippingCost,
      totalPrice: total
    };

    const res = await placeOrder(orderData);
    setLoading(false);
    
    if (res.success) {
      localStorage.removeItem('checkout_shipping_draft');
      localStorage.removeItem('checkout_delivery_draft');
      localStorage.removeItem('checkout_payment_draft');
      localStorage.removeItem('checkout_coupon_code');
      localStorage.removeItem('checkout_discount_value');
      setStep(5);
    } else {
      alert(res.message || 'Failed to place order. Please try again.');
    }
  };

  // Step names
  const stepsList = ['Shipping', 'Delivery', 'Payment', 'Review'];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg max-w-[1440px] mx-auto px-container-padding text-left">
        
        {step === 5 ? (
          /* Order Complete Success Page */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-16 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-xl"
          >
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="font-display-lg text-headline-xl text-primary mb-2 text-3xl font-bold">
              Purchase Completed
            </h2>
            <p className="text-label-lg text-secondary font-bold uppercase tracking-widest text-xs mb-6">
              Order #OG-94042
            </p>
            <p className="text-on-surface-variant font-light mb-8 text-sm leading-relaxed">
              Thank you for acquiring our Tunisian liquid gold treasures. A confirmation email with details of the harvest batch has been sent to <strong className="text-primary">{shippingForm.email || 'guest@luxury.com'}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/orders')}
                className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-full font-label-lg text-xs font-bold uppercase tracking-widest transition-all"
              >
                Order History
              </button>
              <Link 
                to="/shop" 
                className="border border-outline-variant hover:border-primary text-primary px-8 py-3.5 rounded-full font-label-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-gutter">
            
            {/* Left Column: Form Area */}
            <div className="flex-grow lg:max-w-[65%]">
              
              {/* Multi-Step Indicator */}
              <div className="mb-12 flex items-center justify-between overflow-x-auto whitespace-nowrap py-2 scroller-hide select-none border-b border-outline-variant/10 pb-4">
                {stepsList.map((stepName, idx) => (
                  <React.Fragment key={stepName}>
                    <div className={`flex items-center ${step === idx + 1 ? 'text-primary font-bold' : 'text-outline-variant/60'}`}>
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm mr-3 font-bold transition-colors ${
                        step === idx + 1 
                          ? 'border-primary bg-primary text-white shadow' 
                          : step > idx + 1
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-outline-variant text-outline-variant'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-label-lg text-label-lg tracking-widest uppercase text-xs">
                        {stepName}
                      </span>
                    </div>
                    {idx < stepsList.length - 1 && (
                      <div className={`h-px w-8 md:w-16 ${step > idx + 1 ? 'bg-primary' : 'bg-outline-variant/20'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step Forms */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  /* Step 1: Shipping */
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-12"
                  >
                    <section className="space-y-6">
                      <div className="flex justify-between items-end">
                        <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold">Contact Information</h2>
                        {!user ? (
                          <span onClick={() => navigate('/login?redirect=checkout')} className="text-label-sm font-label-sm text-secondary cursor-pointer hover:underline text-xs font-semibold uppercase tracking-wider">
                            Log in
                          </span>
                        ) : (
                          <span className="text-[11px] text-primary font-semibold uppercase tracking-wider">
                            Logged in as {user.name || user.email}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Email Address</label>
                          <input 
                            value={shippingForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="concierge@luxury.com" 
                            type="email" 
                            required
                          />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input 
                            checked={shippingForm.subscribe}
                            onChange={(e) => handleInputChange('subscribe', e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" 
                            type="checkbox" 
                          />
                          <span className="text-body-md text-on-surface-variant font-light text-xs md:text-sm">
                            Subscribe to the Estate Newsletter for harvest updates.
                          </span>
                        </label>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold">Shipping Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">First Name</label>
                          <input 
                            value={shippingForm.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="Elena" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Last Name</label>
                          <input 
                            value={shippingForm.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="Rossi" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Address</label>
                          <input 
                            value={shippingForm.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="123 Olive Grove Lane" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Apartment, suite, etc. (optional)</label>
                          <input 
                            value={shippingForm.apartment}
                            onChange={(e) => handleInputChange('apartment', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="Estate Flat 4" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">City</label>
                          <input 
                            value={shippingForm.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="Tunis" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Postal Code</label>
                          <input 
                            value={shippingForm.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="1002" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Phone</label>
                          <input 
                            value={shippingForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="+216 20 000 000" 
                            type="tel" 
                          />
                        </div>
                      </div>
                    </section>

                    <div className="mt-12 flex items-center justify-between border-t border-outline-variant/20 pt-8">
                      <Link className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider" to="/cart">
                        <ChevronLeft className="h-4 w-4" /> Return to Cart
                      </Link>
                      <button 
                        onClick={() => setStep(2)}
                        className="bg-secondary text-white px-10 py-4 rounded-lg font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-95 shadow-md text-sm uppercase"
                      >
                        Continue to Delivery
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  /* Step 2: Delivery */
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold">Delivery Method</h2>
                    
                    <div className="space-y-4">
                      <label className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 bg-surface'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="delivery"
                            checked={deliveryMethod === 'standard'}
                            onChange={() => setDeliveryMethod('standard')}
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <div>
                            <span className="font-bold text-sm block">Standard Shipping</span>
                            <span className="text-xs text-on-surface-variant font-light">Delivery in 3-5 business days</span>
                          </div>
                        </div>
                        <span className="text-secondary font-bold text-sm">Complimentary</span>
                      </label>

                      <label className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 bg-surface'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="delivery"
                            checked={deliveryMethod === 'express'}
                            onChange={() => setDeliveryMethod('express')}
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <div>
                            <span className="font-bold text-sm block">Express Delivery</span>
                            <span className="text-xs text-on-surface-variant font-light">Nitrogen-sealed cargo plane, 1-2 days</span>
                          </div>
                        </div>
                        <span className="text-secondary font-bold text-sm">$15.00</span>
                      </label>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-outline-variant/20 pt-8">
                      <button 
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider focus:outline-none"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back to Shipping
                      </button>
                      <button 
                        onClick={() => setStep(3)}
                        className="bg-secondary text-white px-10 py-4 rounded-lg font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-95 shadow-md text-sm uppercase"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  /* Step 3: Payment */
                  <motion.div 
                    key="step-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold">Payment Information</h2>
                    
                    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20 space-y-6">
                      <div className="flex items-center gap-3 text-primary border-b border-outline-variant/20 pb-4 mb-4">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Credit Card details</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Name on Card</label>
                          <input 
                            value={paymentForm.cardName}
                            onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                            className="bg-surface border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="Elena Rossi" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Card Number</label>
                          <input 
                            value={paymentForm.cardNumber}
                            onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                            className="bg-surface border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="4000 1234 5678 9010" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Expiration Date</label>
                          <input 
                            value={paymentForm.expiry}
                            onChange={(e) => handlePaymentChange('expiry', e.target.value)}
                            className="bg-surface border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="MM / YY" 
                            type="text" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">CVC / CVV</label>
                          <input 
                            value={paymentForm.cvc}
                            onChange={(e) => handlePaymentChange('cvc', e.target.value)}
                            className="bg-surface border border-outline-variant/30 rounded-lg p-4 font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm" 
                            placeholder="123" 
                            type="text" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-outline-variant/20 pt-8">
                      <button 
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider focus:outline-none"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back to Delivery
                      </button>
                      <button 
                        onClick={() => setStep(4)}
                        className="bg-secondary text-white px-10 py-4 rounded-lg font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-95 shadow-md text-sm uppercase"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  /* Step 4: Review */
                  <motion.div 
                    key="step-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <h2 className="font-headline-lg text-headline-lg text-primary text-xl md:text-2xl font-bold">Review Your Acquisition</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-light text-on-surface-variant divide-y md:divide-y-0 md:divide-x divide-outline-variant/20 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
                      <div className="space-y-4">
                        <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Contact & Shipping</h4>
                        <p>{shippingForm.email}</p>
                        <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                        <p>{shippingForm.address}, {shippingForm.apartment && `${shippingForm.apartment}, `}{shippingForm.city}, {shippingForm.postalCode}</p>
                        <p>{shippingForm.phone}</p>
                      </div>

                      <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                        <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Delivery & Payment</h4>
                        <p>Method: <span className="font-semibold capitalize text-primary">{deliveryMethod} shipping</span></p>
                        <p>Cardholder: <span className="font-semibold">{paymentForm.cardName || 'Elena Rossi'}</span></p>
                        <p>Card Number: <span className="font-semibold">•••• •••• •••• {paymentForm.cardNumber ? paymentForm.cardNumber.slice(-4) : '9010'}</span></p>
                      </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-outline-variant/20 pt-8">
                      <button 
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider focus:outline-none"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back to Payment
                      </button>
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="bg-primary hover:bg-primary-container text-white px-10 py-4 rounded-lg font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-95 shadow-md text-sm uppercase flex items-center gap-2"
                      >
                        {loading ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Right Column: Sidebar Summary */}
            <aside className="lg:w-[35%]">
              <div className="bg-surface-container-low rounded-xl p-8 sticky top-32 border border-outline-variant/10 shadow-sm">
                <h3 className="font-headline-md text-headline-md text-primary mb-8 text-xl font-bold">
                  Your Selection
                </h3>
                
                {/* Product List */}
                <div className="space-y-6 mb-8">
                  {cart.map((product) => (
                    <div key={product.id} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-outline-variant/10 select-none">
                        <img 
                          className="w-full h-full object-cover" 
                          alt={product.title}
                          src={product.image}
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-tertiary text-on-tertiary text-[10px] flex items-center justify-center rounded-full font-bold">
                          {product.quantity}
                        </span>
                      </div>
                      
                      <div className="flex flex-col justify-center text-left">
                        <h4 className="font-semibold text-primary text-sm">
                          {product.title}
                        </h4>
                        <p className="text-label-sm text-on-surface-variant text-xs font-light">
                          {product.region} • {product.volume}
                        </p>
                        <p className="font-body-md text-body-md mt-1 text-secondary font-bold text-sm">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-6 border-t border-outline-variant/30 text-sm font-semibold">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discountValue > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({couponCode})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-primary font-medium italic">Complimentary</span>
                    ) : (
                      <span>${shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Estimated Tax (8%)</span>
                    <span>${(taxableAmount * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-4 border-t border-outline-variant/30 mt-4">
                    <span className="font-headline-md text-headline-md text-primary font-bold text-lg">Total</span>
                    <div className="text-right">
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1 font-bold">
                        USD
                      </span>
                      <span className="font-headline-md text-headline-md text-primary font-bold text-lg">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Icons */}
                <div className="mt-12 flex justify-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 select-none">
                  <img alt="Visa" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADVJ8hAg58q9Pxg1s5RCRuk2ZMNwg6dvYYlWho_TYAFabJP3YdGc2Gxl_TnpstgeTVVDWoiGlh8L6aAcNkBIjj5upe9Fvi-HtQISs3afYOV5f9_WSKVoxg-atgnvapF3iO3iEbAXORURApAIVMCy0tgblfgQTwyFwfERbg6Bt5LTqdQt-sluq-H2KmtuYzr7R_sDF5GMsExelVc0OJr6oBXIY665eIyDogNtfgS1H_LGlxq3OmkNeaeg" />
                  <img alt="Mastercard" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxEO_A2GjOe_t4-fOB33Mvc_5VJL0NRljGyqyn-G9NXKvvvoIc0Y_GQSARBsiECeTyNS8JCPUOo-gyBdGDsy6_xUe1KKvvjkCtwGOjm2b8t2TkmYZYQqcpHs_H8tlmBk_vCXpZvbZ1TXC3Y7m7R3wbc4ZQzbi43SRC6HMD7oigP4t0ZnOSDD_wVgVM_JXD9MGrO-lNbqmlqPVjmDMRbFO3jDwPNKoZhod91845uHW2GVM4ekavXCnV6w" />
                  <img alt="Amex" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyOhT6AmcxeX8htRID1cx8z6C69q-7l_TTtjm1N2AFgos84d7q_pmW1mgGtgfBqrx4MtDOttGXTaIDfU1CKdeDtsjzB4Mljm3JkAWA8WT4z7AwDCohaQvsUZh9cqFwvqIFcbieOpSluQb4PGTGeYFPql5sJ1FswVTEEwdRI11bBEXPiFZ8bYc7Eq0QxGUntZsp4_1sTAuRW76NhuJQZpZCRu4Mq1TUmIKPm_nqZp-u9tpGsQ89ISZOug" />
                  <img alt="Apple Pay" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUTQDpU6kZVo9tQQbKfM19u7y8v3DFQki0dgpf95s4pm6VqeG-y5fixzxRcLC3tnDGOXe4D3h558x7IurrK8sR-W_tzt27nM6W4lrd13HLNGNLeHpPaDXxPG7HxdjMNgP2XGxpSWJMsBAHHG27eGsbiBEir_YK2FyJA9JqnOzzzV0SK9qCWLCBqNStIqteNUzEEGuSJbjGFXi6AX_qATUm4LNgxYY-Mgbb3VaQjFvLAcxnmooOS7vK0Q" />
                </div>

                {/* Trust Message */}
                <div className="mt-8 text-center px-4">
                  <p className="text-[10px] text-on-surface-variant/70 leading-relaxed font-semibold">
                    <Lock className="h-3.5 w-3.5 align-middle inline-block mr-1 text-primary" />
                    Your transaction is secured with end-to-end encryption. Our concierge is available 24/7 for assistance.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        )}

      </main>
    </div>
  );
};

export default Checkout;
