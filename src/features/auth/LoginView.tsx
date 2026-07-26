import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiService } from '../../services/api';
import { useToast } from '../../components/ui/Toast';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const emailVal = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value || formData.email;
    const passwordVal = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value || formData.password;
    const fullNameVal = (form.querySelector('input[type="text"]') as HTMLInputElement)?.value || formData.full_name;

    try {
      if (isLogin) {
        await apiService.login({
          email: emailVal,
          password: passwordVal,
        });
        showToast('success', 'Welcome back', 'Successfully logged in.');
      } else {
        await apiService.register({
          email: emailVal,
          password: passwordVal,
          full_name: fullNameVal,
        });
        showToast('success', 'Account created', 'Successfully registered and logged in.');
      }
      onSuccess();
    } catch (err: any) {
      showToast('error', 'Authentication Failed', err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full h-11 pl-10 pr-4 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm font-medium text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all duration-150";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />

      <Card className="w-full max-w-md p-8 relative z-10 shadow-xl border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
            <div className="w-6 h-6 border-2 border-white rounded-md" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin
              ? 'Enter your credentials to access your dashboard'
              : 'Enter your details to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className={inputClasses}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className={inputClasses}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className={inputClasses}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {!isLogin && (
              <p className="text-[11px] text-slate-400 ml-1">
                Must be at least 8 characters long and contain both letters and numbers.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 mt-6 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign in' : 'Create account'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ email: '', password: '', full_name: '' });
            }}
            className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </Card>
    </div>
  );
};
