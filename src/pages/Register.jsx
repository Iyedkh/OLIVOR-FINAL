import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    
    // Simulate API registration and redirect to Dashboard
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden text-left">
        
        {/* Left Side: Visual Narrative */}
        <section className="relative hidden md:flex w-1/2 h-screen overflow-hidden select-none">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuASQTfMu-0xiKhrcnfa-XJN62fDDJuh1dIIeTAdUiIZFxSiwIbWcM1TZtKtNZY6lz9DmP7EOGWJhSdtdTXpUzqOHp0KOpw_V-E4VtQbjcMRS9Y68yNN9vgPYjEQOrxnlOyvB7NQMtg2K2TLP6ovakcn7GE1Ur3d5QYeRCL45eM8d0GeK4VTZA7vy95g5eoMSq5nIJUFPc1TA6kGIWb8qFRYLIw93_JGA0bePPrMquuKehCvMsR-RO3AuQ')` 
            }}
          ></div>
          {/* Branding Overlay */}
          <div className="absolute top-12 left-12 z-10">
            <h1 className="font-display-lg text-headline-xl text-white tracking-widest drop-shadow-md text-3xl md:text-4xl font-bold">
              OLIV'OR
            </h1>
          </div>
          {/* Atmospheric Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
          {/* Quote/Context */}
          <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
            <p className="font-headline-md text-headline-md italic max-w-md text-lg md:text-2xl">
              "From the sun-drenched groves of Tunisia, straight to your table."
            </p>
            <div className="mt-4 w-12 h-[1px] bg-white opacity-60"></div>
            <p className="mt-4 font-label-lg text-label-lg text-white/80 uppercase tracking-widest text-xs font-semibold">
              The Harvest 2024
            </p>
          </div>
        </section>

        {/* Right Side: Interaction Canvas */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-gutter md:p-12 lg:p-24 bg-surface relative min-h-screen">
          {/* Mobile Brand Mark */}
          <div className="absolute top-8 left-8 md:hidden">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest text-xl font-bold">
              OLIV'OR
            </span>
          </div>

          <div className="w-full max-w-md py-12 md:py-0">
            {/* Header */}
            <header className="mb-8 text-center md:text-left">
              <h2 className="font-display-lg text-headline-xl text-primary mb-3 text-3xl md:text-4xl font-bold">
                Create Account
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant opacity-80 text-sm md:text-base font-light">
                Join our elite circle of Mediterranean culinary connoisseurs.
              </p>
            </header>

            {/* Auth Form */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {error && (
                  <div className="p-4 bg-error-container/20 text-error border border-error/25 rounded-lg text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Full Name Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Full Name
                  </label>
                  <input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="Elena Rossi" 
                    required 
                    type="text" 
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Email Address
                  </label>
                  <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="concierge@luxury.com" 
                    required 
                    type="email" 
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Password
                  </label>
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Confirm Password
                  </label>
                  <input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                  />
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer select-none py-2">
                  <input 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 mt-0.5" 
                    type="checkbox" 
                  />
                  <span className="text-body-md text-on-surface-variant font-light text-xs leading-tight">
                    I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>.
                  </span>
                </label>

                {/* Primary CTA */}
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-primary hover:bg-primary-container text-white font-headline-md text-headline-md rounded-full shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase font-bold tracking-widest"
                  type="submit"
                >
                  {loading ? (
                    <>
                      Creating Account...
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="px-4 font-label-sm text-label-sm text-outline-variant tracking-widest uppercase text-[9px] font-semibold">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>

              {/* Social CTA */}
              <button 
                onClick={handleSubmit} 
                className="w-full py-4 flex items-center justify-center gap-3 border border-outline-variant/50 rounded-full font-label-lg text-label-lg text-on-surface hover:bg-surface-variant/20 transition-colors duration-200 text-xs font-semibold"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
            </div>

            {/* Footer Link */}
            <footer className="mt-12 text-center">
              <p className="font-body-md text-on-surface-variant text-sm font-light">
                Already have an account? 
                <Link className="text-primary hover:text-secondary font-semibold ml-1 transition-colors hover:underline" to="/login">
                  Sign In
                </Link>
              </p>
            </footer>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Register;
