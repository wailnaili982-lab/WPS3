import React from 'react';
import { Wps3Logo } from './Wps3Logo';
import { ShieldCheck, Search, BookOpen, Lock, Crown, Globe } from 'lucide-react';

interface NavbarProps {
  currentLang: 'ar' | 'en';
  onToggleLang: () => void;
  onNavigate: (view: 'home' | 'register' | 'track' | 'rules' | 'privacy' | 'admin') => void;
  activeView: string;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  onNavigate,
  activeView,
  isAdmin,
  onOpenAdminLogin,
}) => {
  const isAr = currentLang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#030817]/85 border-b border-[#008CFF]/25 shadow-[0_4px_25px_rgba(0,140,255,0.15)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 overflow-hidden">
        {/* Brand Brand & Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3.5 focus:outline-none group text-start shrink-0"
          aria-label="WPS3 Home"
        >
          <Wps3Logo size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-chakra font-black text-xl sm:text-2xl tracking-wider text-[#F4F8FF] group-hover:text-[#008CFF] transition-colors drop-shadow-[0_0_10px_rgba(0,140,255,0.4)]">
                WPS<span className="text-[#008CFF]">3</span>
              </span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-[#008CFF]/20 border border-[#008CFF]/40 text-[#008CFF] uppercase font-mono tracking-widest hidden xs:inline">
                OFFICIAL
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-[#A6C5FF] tracking-wider uppercase font-chakra font-medium hidden sm:inline">
              MINECRAFT PS3 SERVER
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-2 rounded text-sm font-semibold tracking-wide transition-all ${
              activeView === 'home'
                ? 'text-[#008CFF] bg-[#008CFF]/15 border border-[#008CFF]/40 shadow-[0_0_10px_rgba(0,140,255,0.3)]'
                : 'text-[#E1EBFF] hover:text-[#008CFF] hover:bg-[#008CFF]/10'
            }`}
          >
            {isAr ? 'الرئيسية' : 'HOME'}
          </button>

          <button
            onClick={() => onNavigate('register')}
            className={`px-3.5 py-2 rounded text-sm font-semibold tracking-wide transition-all ${
              activeView === 'register'
                ? 'text-[#008CFF] bg-[#008CFF]/15 border border-[#008CFF]/40 shadow-[0_0_10px_rgba(0,140,255,0.3)]'
                : 'text-[#E1EBFF] hover:text-[#008CFF] hover:bg-[#008CFF]/10'
            }`}
          >
            {isAr ? 'طلب التسجيل' : 'REGISTER'}
          </button>

          <button
            onClick={() => onNavigate('track')}
            className={`px-3.5 py-2 rounded text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              activeView === 'track'
                ? 'text-[#008CFF] bg-[#008CFF]/15 border border-[#008CFF]/40 shadow-[0_0_10px_rgba(0,140,255,0.3)]'
                : 'text-[#E1EBFF] hover:text-[#008CFF] hover:bg-[#008CFF]/10'
            }`}
          >
            <Search className="w-4 h-4 text-[#008CFF]" />
            {isAr ? 'تتبع حالة الطلب' : 'TRACK STATUS'}
          </button>

          <button
            onClick={() => onNavigate('rules')}
            className={`px-3.5 py-2 rounded text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              activeView === 'rules'
                ? 'text-[#008CFF] bg-[#008CFF]/15 border border-[#008CFF]/40 shadow-[0_0_10px_rgba(0,140,255,0.3)]'
                : 'text-[#E1EBFF] hover:text-[#008CFF] hover:bg-[#008CFF]/10'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#8B5CFF]" />
            {isAr ? 'القواعد' : 'RULES'}
          </button>
        </nav>

        {/* Right Action Bar: Language + Admin Access */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2 py-1.5 rounded bg-[#050C1F] border border-[#008CFF]/30 text-xs font-bold text-[#A6C5FF] hover:text-white hover:border-[#008CFF] transition-all cursor-pointer"
            aria-label="Switch Language"
            title="Toggle Arabic / English"
          >
            <Globe className="w-3.5 h-3.5 text-[#008CFF]" />
            <span className="text-[11px]">{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Admin Indicator / Login Button */}
          {isAdmin ? (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded bg-gradient-to-r from-[#FFC928]/25 to-[#008CFF]/20 border border-[#FFC928] text-xs font-bold text-[#FFC928] shadow-[0_0_15px_rgba(255,201,40,0.4)] hover:scale-105 transition-all cursor-pointer"
              aria-label="Open Admin Dashboard"
            >
              <Crown className="w-3.5 h-3.5 text-[#FFC928] animate-pulse" />
              <span className="font-chakra font-bold">{isAr ? 'لوحة الإدارة' : 'ADMIN'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded bg-[#050C1F] border border-[#008CFF]/30 text-xs font-medium text-[#A6C5FF] hover:text-[#008CFF] hover:border-[#008CFF] transition-all cursor-pointer"
              aria-label="Admin Login"
              title="Official Server Admin Access"
            >
              <Lock className="w-3.5 h-3.5 text-[#008CFF]" />
              <span className="hidden sm:inline text-[11px]">{isAr ? 'دخول الإدارة' : 'Admin'}</span>
            </button>
          )}

          {/* Primary CTA */}
          {activeView !== 'register' && (
            <button
              onClick={() => onNavigate('register')}
              className="voxel-btn-primary px-2.5 sm:px-3.5 py-1.5 rounded text-[11px] sm:text-xs font-chakra font-bold text-white uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              {isAr ? 'سجّل الآن' : 'REGISTER'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
