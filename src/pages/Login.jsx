import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract redirect query parameter from URL (e.g. ?redirect=checkout)
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  const verified = queryParams.get('verified');
  const [verifiedToastShown, setVerifiedToastShown] = useState(false);

  useEffect(() => {
    if (verified === 'true' && !verifiedToastShown) {
      toast.success('Your email has been successfully verified! Please sign in.', { toastId: 'verify-success' });
      setVerifiedToastShown(true);
      navigate('/login', { replace: true });
    }
  }, [verified, verifiedToastShown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(email, password);
    setLoading(false);
    
    if (res.success) {
      if (res.isAdmin) {
        navigate('/admin');
      } else {
        navigate(redirect ? `/${redirect}` : '/dashboard');
      }
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden text-left">
        
        {/* Left Side: Visual Narrative */}
        <section className="relative hidden md:flex w-1/2 h-screen overflow-hidden select-none">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105" 
            style={{ 
              backgroundImage: `url('/Login.png')` 
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

          <div className="w-full max-w-md">
            {/* Header */}
            <header className="mb-12 text-center md:text-left">
              <h2 className="font-display-lg text-headline-xl text-primary mb-3 text-3xl md:text-4xl font-bold">
                Welcome Back
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant opacity-80 text-sm md:text-base font-light">
                Please enter your credentials to access the concierge.
              </p>
            </header>

            {/* Auth Form */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-error-container/20 text-error border border-error/25 rounded-lg text-xs font-semibold text-center text-red-600 bg-red-50">
                    {error}
                  </div>
                )}
                
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Email Address
                  </label>
                  <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-4 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="concierge@luxury.com" 
                    required 
                    type="email" 
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                      Password
                    </label>
                    <Link className="font-label-sm text-label-sm uppercase tracking-widest text-outline hover:text-primary transition-colors text-[9px] font-bold" to="/forgot-password">
                      Forgot Password?
                    </Link>
                  </div>
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-4 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                  />
                </div>

                {/* Primary CTA */}
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-primary hover:bg-primary-container text-white font-headline-md text-headline-md rounded-full shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase font-bold tracking-widest"
                  type="submit"
                >
                  {loading ? (
                    <>
                      Authenticating...
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </>
                  ) : (
                    'Sign In'
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
            <footer className="mt-16 text-center">
              <p className="font-body-md text-on-surface-variant text-sm font-light">
                Don't have an account? 
                <Link className="text-primary hover:text-secondary font-semibold ml-1 transition-colors hover:underline" to="/register">
                  Register
                </Link>
              </p>
            </footer>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Login;
