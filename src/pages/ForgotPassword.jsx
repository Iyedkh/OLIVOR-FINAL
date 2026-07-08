import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ForgotPassword = () => {
  const { forgotPassword } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage(res.message || 'A password reset link has been sent to your email.');
      setEmail('');
    } else {
      setError(res.message || 'Failed to submit request.');
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
          <div className="absolute top-12 left-12 z-10">
            <h1 className="font-display-lg text-headline-xl text-white tracking-widest drop-shadow-md text-3xl md:text-4xl font-bold">
              OLIV'OR
            </h1>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
            <p className="font-headline-md text-headline-md italic max-w-md text-lg md:text-2xl">
              "Restoring your access to the luxury groves of Tunisia."
            </p>
          </div>
        </section>

        {/* Right Side: Form Content */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-gutter md:p-12 lg:p-24 bg-surface relative min-h-screen">
          <div className="absolute top-8 left-8 md:hidden">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest text-xl font-bold">
              OLIV'OR
            </span>
          </div>

          <div className="w-full max-w-md">
            <header className="mb-12 text-center md:text-left">
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-outline hover:text-primary transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
              <h2 className="font-display-lg text-headline-xl text-primary mb-3 text-3xl md:text-4xl font-bold">
                Recover Password
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant opacity-80 text-sm md:text-base font-light">
                Enter your email address and we will issue a link to reset your password.
              </p>
            </header>

            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="p-4 bg-primary/10 text-primary border border-primary/25 rounded-lg text-xs font-semibold text-center">
                    {message}
                  </div>
                )}
                
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

                <button 
                  disabled={loading}
                  className="w-full py-5 bg-primary hover:bg-primary-container text-white font-headline-md text-headline-md rounded-full shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase font-bold tracking-widest cursor-pointer"
                  type="submit"
                >
                  {loading ? (
                    <>
                      Sending Link...
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ForgotPassword;
