import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useApp } from '../context/AppContext';
import { MailWarning, Send, CheckCircle2 } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const { user, resendVerificationLink } = useApp();
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(''); // 'success', 'error'
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    setResending(true);
    setResendStatus('');
    setResendMessage('');
    const res = await resendVerificationLink();
    setResending(false);
    if (res.success) {
      setResendStatus('success');
      setResendMessage(res.message || 'Verification link sent!');
    } else {
      setResendStatus('error');
      setResendMessage(res.message || 'Failed to resend link.');
    }
  };

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col">
      {user && !user.isVerified && !isAuthPage && (
        <div className="bg-secondary-container text-on-secondary-container px-6 py-3 text-xs md:text-sm font-semibold flex flex-col md:flex-row gap-4 items-center justify-between border-b border-secondary/10 select-none text-left">
          <div className="flex items-center gap-2">
            <MailWarning className="h-4 w-4 text-secondary shrink-0" />
            <span>Please verify your email address to access all features. Check your inbox for the verification link.</span>
          </div>
          <div className="flex items-center gap-4">
            {resendMessage ? (
              <span className={`flex items-center gap-1.5 font-bold ${resendStatus === 'success' ? 'text-primary' : 'text-red-500'}`}>
                {resendStatus === 'success' && <CheckCircle2 className="h-3.5 w-3.5" />}
                {resendMessage}
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="bg-secondary hover:bg-secondary-container text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3 w-3" />
                {resending ? 'Sending...' : 'Resend Link'}
              </button>
            )}
          </div>
        </div>
      )}
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;
