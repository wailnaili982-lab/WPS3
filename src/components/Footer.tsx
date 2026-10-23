import React from 'react';
import { Wps3Logo } from './Wps3Logo';
import { Shield, Lock, Heart, Crown } from 'lucide-react';

interface FooterProps {
  currentLang: 'ar' | 'en';
  onNavigate: (view: 'home' | 'register' | 'track' | 'rules' | 'privacy' | 'admin') => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  isAdmin,
  onOpenAdminLogin,
}) => {
  const isAr = currentLang === 'ar';

  return (
    <footer className="relative z-10 border-t border-[#008CFF]/25 bg-[#02050E]/95 backdrop-blur-md pt-12 pb-8 mt-16 text-[#A6C5FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#008CFF]/20">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Wps3Logo size="sm" />
              <div className="flex flex-col">
                <span className="font-chakra font-black text-xl text-white tracking-wider">
                  WPS<span className="text-[#008CFF]">3</span> — MINECRAFT PS3
                </span>
                <span className="text-[11px] text-[#008CFF] font-chakra uppercase font-bold tracking-widest">
                  PLAY • BUILD • BE TOGETHER
                </span>
              </div>
            </div>
            <p className="text-xs text-[#9BB3DA] font-tajawal max-w-md leading-relaxed">
              {isAr
                ? 'الموقع الرسمي لتسجيل اللاعبين في سيرفر WPS3 الخاص بلعبة Minecraft على جهاز PlayStation 3. انضم لمجتمع اللاعبين وعِش تجربة البقاء والبناء الجماعي الفاخرة.'
                : 'The official registration gateway for the WPS3 Minecraft PlayStation 3 server. Join our community for authentic survival, mega builds, and multiplayer adventures.'}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-chakra font-bold text-xs uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>{isAr ? 'روابط سريعة' : 'QUICK LINKS'}</span>
            </h4>
            <ul className="space-y-2 text-xs font-chakra">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#008CFF] transition-colors"
                >
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-[#008CFF] transition-colors"
                >
                  {isAr ? 'طلب التسجيل في السيرفر' : 'Server Registration'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-[#008CFF] transition-colors"
                >
                  {isAr ? 'تتبع حالة طلبك' : 'Track Application Status'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rules')}
                  className="hover:text-[#008CFF] transition-colors"
                >
                  {isAr ? 'قواعد السيرفر' : 'Server Rules'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#008CFF] transition-colors"
                >
                  {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Staff & Administration */}
          <div>
            <h4 className="font-chakra font-bold text-xs uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#FFC928]" />
              <span>{isAr ? 'إدارة السيرفر' : 'STAFF ACCESS'}</span>
            </h4>
            <div className="space-y-2 text-xs font-tajawal">
              <p className="text-[11px] text-[#8BB7F0]">
                {isAr
                  ? 'بوابة المشرفين لمراجعة ملفات اللاعبين وإصدار قرارات القبول.'
                  : 'Administrative portal to review player dossiers and manage admissions.'}
              </p>

              {isAdmin ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFC928]/20 border border-[#FFC928] text-xs font-chakra font-bold text-[#FFC928] hover:bg-[#FFC928]/30 transition-all cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-[#FFC928]" />
                  <span>{isAr ? 'فتح لوحة الإدارة' : 'Open Admin Panel'}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#050C1F] border border-[#008CFF]/40 text-xs font-chakra font-medium text-[#A6C5FF] hover:text-white hover:border-[#008CFF] transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>{isAr ? 'تسجيل دخول الإدارة (Admin)' : 'Admin Login'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7189B6] gap-2">
          <div>
            © {new Date().getFullYear()} WPS3 Official Minecraft PS3 Server. All rights reserved.
          </div>
          <div className="text-center sm:text-end">
            Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </div>
        </div>
      </div>
    </footer>
  );
};
