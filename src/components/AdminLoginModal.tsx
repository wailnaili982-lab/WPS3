import React, { useState } from 'react';
import { Lock, Crown, AlertTriangle, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  currentLang: 'ar' | 'en';
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  currentLang,
  onClose,
  onLoginSuccess,
}) => {
  const isAr = currentLang === 'ar';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(isAr ? 'يرجى إدخال كلمة المرور السرية' : 'Please enter the secret password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'كلمة المرور غير صحيحة' : 'Invalid secret password'));
      }

      sessionStorage.setItem('wps3_admin_token', data.token);
      sessionStorage.setItem('wps3_is_admin', 'true');
      onLoginSuccess(data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ في المصادقة' : 'Authentication error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="voxel-card rounded-2xl max-w-md w-full p-6 sm:p-8 border-2 border-[#FFC928] shadow-[0_0_40px_rgba(255,201,40,0.35)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-8 h-8 rounded-full bg-[#050C1F] hover:bg-[#008CFF]/20 text-[#A6C5FF] hover:text-white flex items-center justify-center border border-[#008CFF]/40 cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC928]/20 to-[#030817] border-2 border-[#FFC928] flex items-center justify-center text-[#FFC928] shadow-[0_0_20px_rgba(255,201,40,0.4)] mb-3">
            <Crown className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="font-chakra font-black text-2xl text-white tracking-wider">
            {isAr ? 'تسجيل دخول إدارة WPS3' : 'WPS3 ADMIN ACCESS'}
          </h3>
          <p className="text-xs text-[#A6C5FF] mt-1 font-tajawal">
            {isAr
              ? 'أدخل كلمة المرور السرية للغاية للوصول إلى لوحة الإدارة'
              : 'Enter the ultra-secret password to access server administration'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#FFC928]" />
                <span>{isAr ? 'كلمة المرور السرية للغاية *' : 'Ultra-Secret Password *'}</span>
              </span>
            </label>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#FFC928]/50 focus:border-[#FFC928] font-mono text-base tracking-wider focus:outline-none focus:shadow-[0_0_20px_rgba(255,201,40,0.4)] transition-all"
            />
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-lg bg-[#008CFF]/10 border border-[#008CFF]/30 text-xs text-[#A6C5FF] font-tajawal flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'هذه اللوحة محمية بكلمة المرور السرية الخاصة بإدارة السيرفر'
                : 'Protected server administration portal'}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500 text-red-200 text-xs font-tajawal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FFC928] to-[#FF9F1C] hover:from-[#FFD54F] hover:to-[#FFA726] text-black font-chakra font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,201,40,0.5)] cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4 text-black" />
            )}
            <span>{isAr ? 'تأكيد الدخول للإدارة' : 'UNLOCK ADMIN PORTAL'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
