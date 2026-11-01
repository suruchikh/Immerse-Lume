import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { Lock, User, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(username, password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    const customUser = localStorage.getItem('immerse_lume_admin_custom_username') || 'admin';
    const customPass = localStorage.getItem('immerse_lume_admin_custom_password') || 'ImmerseLume2026!';
    setUsername(customUser);
    setPassword(customPass);
  };

  const hasCustomCreds = Boolean(
    localStorage.getItem('immerse_lume_admin_custom_password') ||
    localStorage.getItem('immerse_lume_admin_custom_username')
  );
  const activeUserDisplay = localStorage.getItem('immerse_lume_admin_custom_username') || 'admin';

  return (
    <div className="min-h-screen bg-[#1C1B1A] flex flex-col justify-center items-center px-4 py-12 relative text-left">
      {/* Top back button */}
      <button
        onClick={onBackToWebsite}
        className="absolute top-6 left-6 text-xs uppercase tracking-[0.2em] text-[#8A7E72] hover:text-[#DFC27D] transition-colors flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Public Website</span>
      </button>

      <div className="w-full max-w-md bg-[#242220] border border-[#33302C] p-8 md:p-10 shadow-2xl relative space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#DFC27D] font-medium block">
            Executive Portal
          </span>
          <h1 className="font-serif text-3xl font-normal text-white tracking-wide">
            IMMERSE LUME
          </h1>
          <p className="text-xs text-[#8A7E72] font-light">
            Content Management & Catalogue Control System
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#EAE3D2] mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 bg-[#1C1B1A] border border-[#33302C] text-xs text-white placeholder-[#5C5854] focus:outline-hidden focus:border-[#DFC27D] transition-colors"
              />
              <User className="w-4 h-4 text-[#8A7E72] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#EAE3D2] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#1C1B1A] border border-[#33302C] text-xs text-white placeholder-[#5C5854] focus:outline-hidden focus:border-[#DFC27D] transition-colors"
              />
              <Lock className="w-4 h-4 text-[#8A7E72] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In To Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Assist Box */}
        <div className="p-4 bg-[#1C1B1A] border border-[#33302C] text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#DFC27D] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{hasCustomCreds ? 'Configured Access' : 'Initial Access'}</span>
            </span>
            <button
              onClick={fillDemoCredentials}
              className="text-[11px] text-[#DFC27D] hover:underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          <div className="text-[11px] text-[#8A7E72] font-mono space-y-0.5">
            <div>User: <span className="text-white">{activeUserDisplay}</span></div>
            <div>Pass: <span className="text-white">{hasCustomCreds ? '••••••••••••' : 'ImmerseLume2026!'}</span></div>
          </div>
          <p className="text-[10px] text-[#5C5854] italic">
            You can change your username, email, and password anytime in Settings & Security.
          </p>
        </div>
      </div>
    </div>
  );
};
