import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useApp();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const res = await resetPassword(token, password);
    setLoading(false);

    if (res.success) {
      toast.success('Your password has been reset successfully! Please sign in with your new password.', {
        toastId: 'reset-success'
      });
      navigate('/login');
    } else {
      setError(res.message || 'Failed to reset password. The link may have expired.');
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
              "Resetting your gateway to premium Tunisian heritage."
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
                Set New Password
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant opacity-80 text-sm md:text-base font-light">
                Please enter and confirm your new account password below.
              </p>
            </header>

            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold text-center">
                    {error}
                  </div>
                )}
                
                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    New Password
                  </label>
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-4 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Confirm New Password
                  </label>
                  <input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-4 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface font-body-md text-sm" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-5 bg-primary hover:bg-primary-container text-white font-headline-md text-headline-md rounded-full shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase font-bold tracking-widest cursor-pointer"
                  type="submit"
                >
                  {loading ? (
                    <>
                      Resetting Password...
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </>
                  ) : (
                    'Reset Password'
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

export default ResetPassword;
