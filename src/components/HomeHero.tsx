import React, { useState } from 'react';
import { Wps3Logo } from './Wps3Logo';
import { Shield, Sparkles, Users, Hammer, Flame, ChevronRight, HelpCircle, Gamepad2, CheckCircle2 } from 'lucide-react';

interface HomeHeroProps {
  currentLang: 'ar' | 'en';
  onStartRegistration: () => void;
  onTrackStatus: () => void;
  onOpenRules: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  currentLang,
  onStartRegistration,
  onTrackStatus,
  onOpenRules,
}) => {
  const isAr = currentLang === 'ar';
  const [showHowToJoinModal, setShowHowToJoinModal] = useState(false);

  return (
    <div className="relative z-10 flex flex-col items-center pt-8 pb-16 px-4 max-w-5xl mx-auto">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/50 text-xs font-chakra font-semibold text-[#66C2FF] mb-6 shadow-[0_0_15px_rgba(0,140,255,0.4)] animate-pulse">
        <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
        <span>PLAY • BUILD • BE TOGETHER</span>
      </div>

      {/* Main WPS3 Emblem */}
      <div className="mb-4">
        <Wps3Logo size="xl" />
      </div>

      {/* Big Title */}
      <h1 className="font-chakra font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-[#F4F8FF] text-center drop-shadow-[0_0_25px_rgba(0,140,255,0.7)]">
        WPS<span className="text-[#008CFF]">3</span>
      </h1>

      {/* Subheading / Tagline */}
      <h2 className="font-chakra font-bold text-base sm:text-2xl text-[#66C2FF] tracking-widest uppercase mt-1 mb-3 text-center drop-shadow-[0_0_10px_rgba(0,140,255,0.5)] max-w-full px-2 break-words">
        YOUR NEXT ADVENTURE STARTS HERE
      </h2>

      {/* Arabic Description */}
      <p className="text-base sm:text-xl text-[#D8E6FF] max-w-2xl text-center leading-relaxed font-tajawal mb-8 px-4">
        «سجّل الآن وكن جزءًا من مجتمع WPS3 على Minecraft PS3»
      </p>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mb-14">
        <button
          onClick={onStartRegistration}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-chakra font-extrabold text-base uppercase tracking-wider text-white voxel-btn-primary flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,140,255,0.6)] cursor-pointer"
        >
          <Gamepad2 className="w-5 h-5" />
          <span>{isAr ? 'سجّل الآن' : 'REGISTER NOW'}</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>

        <button
          onClick={() => setShowHowToJoinModal(true)}
          className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-chakra font-bold text-base uppercase tracking-wider text-[#A6C5FF] bg-[#050C1F]/80 hover:bg-[#008CFF]/20 hover:text-white border border-[#008CFF]/40 hover:border-[#008CFF] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 text-[#8B5CFF]" />
          <span>{isAr ? 'كيفية الانضمام' : 'HOW TO JOIN'}</span>
        </button>
      </div>

      {/* 3 Game Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-14">
        {/* SURVIVAL */}
        <div className="voxel-card rounded-xl p-5 border border-[#008CFF]/30 hover:border-[#008CFF] transition-all group flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#008CFF]/20 to-[#030817] border border-[#008CFF]/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,140,255,0.3)]">
            <Flame className="w-6 h-6 text-[#FFC928]" />
          </div>
          <h3 className="font-chakra font-bold text-lg text-white tracking-wider flex items-center gap-1.5 mb-1">
            <span>SURVIVAL</span>
            <span className="text-xs text-[#008CFF]">—</span>
            <span className="text-[#A6C5FF] font-tajawal text-sm">{isAr ? 'عِش مغامرتك' : 'Live your adventure'}</span>
          </h3>
          <p className="text-xs text-[#9BB3DA] leading-relaxed font-tajawal">
            {isAr
              ? 'عوالم نقية، تحديات بقاء حقيقية، وكهوف غنية بالموارد مع حماية ضد التخريب.'
              : 'Pure worlds, authentic survival challenges, rich mines with anti-griefing protection.'}
          </p>
        </div>

        {/* BUILD */}
        <div className="voxel-card rounded-xl p-5 border border-[#008CFF]/30 hover:border-[#008CFF] transition-all group flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5CFF]/20 to-[#030817] border border-[#8B5CFF]/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,255,0.3)]">
            <Hammer className="w-6 h-6 text-[#8B5CFF]" />
          </div>
          <h3 className="font-chakra font-bold text-lg text-white tracking-wider flex items-center gap-1.5 mb-1">
            <span>BUILD</span>
            <span className="text-xs text-[#8B5CFF]">—</span>
            <span className="text-[#A6C5FF] font-tajawal text-sm">{isAr ? 'ابنِ عالمك' : 'Build your world'}</span>
          </h3>
          <p className="text-xs text-[#9BB3DA] leading-relaxed font-tajawal">
            {isAr
              ? 'مشاريع ضخمة، قلاع معمارية ومزارع ريدستون بالتعاون مع أفضل البنائين.'
              : 'Mega builds, architectural castles, and redstone farms built together.'}
          </p>
        </div>

        {/* COMMUNITY */}
        <div className="voxel-card rounded-xl p-5 border border-[#008CFF]/30 hover:border-[#008CFF] transition-all group flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#008CFF]/20 to-[#030817] border border-[#008CFF]/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,140,255,0.3)]">
            <Users className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <h3 className="font-chakra font-bold text-lg text-white tracking-wider flex items-center gap-1.5 mb-1">
            <span>COMMUNITY</span>
            <span className="text-xs text-[#00E5FF]">—</span>
            <span className="text-[#A6C5FF] font-tajawal text-sm">{isAr ? 'العب مع المجتمع' : 'Play together'}</span>
          </h3>
          <p className="text-xs text-[#9BB3DA] leading-relaxed font-tajawal">
            {isAr
              ? 'فعاليات أسبوعية، بطولات PvP ودية، وتواصل مستمر عبر TikTok وPSN.'
              : 'Weekly events, friendly PvP tournaments, and active community coordination.'}
          </p>
        </div>
      </div>

      {/* 3-Step Registration Progress Ribbon */}
      <div className="w-full voxel-card rounded-2xl p-6 border border-[#008CFF]/40 shadow-[0_0_25px_rgba(0,140,255,0.2)]">
        <div className="text-center mb-6">
          <span className="text-xs font-chakra font-bold text-[#FFC928] uppercase tracking-widest">
            {isAr ? 'رحلة الانضمام إلى السيرفر' : 'HOW THE APPLICATION WORKS'}
          </span>
          <h4 className="font-chakra font-bold text-xl text-white mt-1">
            {isAr ? 'خطوات التسجيل الثلاث' : 'THREE REGISTRATION STEPS'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1 */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-[#050C1F]/90 border border-[#008CFF]/30">
            <div className="w-9 h-9 rounded-md bg-[#008CFF]/20 border border-[#008CFF] flex items-center justify-center font-chakra font-black text-sm text-[#008CFF] shrink-0">
              01
            </div>
            <div>
              <div className="text-xs font-chakra font-bold text-[#F4F8FF] uppercase tracking-wider">
                PLAYER INFORMATION
              </div>
              <div className="text-[11px] text-[#A6C5FF] font-tajawal">
                {isAr ? 'اسم اللاعب، العمر، البلد وأسلوب اللعب' : 'Name, age, country & playstyle'}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-[#050C1F]/90 border border-[#008CFF]/30">
            <div className="w-9 h-9 rounded-md bg-[#8B5CFF]/20 border border-[#8B5CFF] flex items-center justify-center font-chakra font-black text-sm text-[#8B5CFF] shrink-0">
              02
            </div>
            <div>
              <div className="text-xs font-chakra font-bold text-[#F4F8FF] uppercase tracking-wider">
                PSN ACCOUNT
              </div>
              <div className="text-[11px] text-[#A6C5FF] font-tajawal">
                {isAr ? 'معرف PlayStation Network العام' : 'Public PSN Online ID for identification'}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-[#050C1F]/90 border border-[#008CFF]/30">
            <div className="w-9 h-9 rounded-md bg-[#FFC928]/20 border border-[#FFC928] flex items-center justify-center font-chakra font-black text-sm text-[#FFC928] shrink-0">
              03
            </div>
            <div>
              <div className="text-xs font-chakra font-bold text-[#F4F8FF] uppercase tracking-wider">
                TIKTOK CONTACT
              </div>
              <div className="text-[11px] text-[#A6C5FF] font-tajawal">
                {isAr ? 'حساب TikTok للتواصل والتحقق' : 'TikTok handle to receive your status'}
              </div>
            </div>
          </div>
        </div>

        {/* Start Button inside Card */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#008CFF]/20">
          <div className="flex items-center gap-2 text-xs text-[#8BB7F0]">
            <Shield className="w-4 h-4 text-[#008CFF]" />
            <span>{isAr ? 'بياناتك الشخصية وكلمات المرور لا تُطلب أبدًا ومحمية بالكامل' : 'No passwords ever requested. Protected data.'}</span>
          </div>
          <button
            onClick={onStartRegistration}
            className="w-full sm:w-auto px-6 py-2.5 rounded voxel-btn-primary font-chakra font-bold text-xs uppercase tracking-wider text-white"
          >
            {isAr ? 'ابدأ التسجيل الآن' : 'START REGISTRATION'}
          </button>
        </div>
      </div>

      {/* HOW TO JOIN MODAL */}
      {showHowToJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="voxel-card rounded-2xl max-w-lg w-full p-6 border-2 border-[#008CFF] shadow-[0_0_40px_rgba(0,140,255,0.4)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#008CFF]/30 mb-4">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-6 h-6 text-[#008CFF]" />
                <h3 className="font-chakra font-bold text-xl text-white">
                  {isAr ? 'كيفية الانضمام إلى سيرفر WPS3' : 'HOW TO JOIN WPS3 SERVER'}
                </h3>
              </div>
              <button
                onClick={() => setShowHowToJoinModal(false)}
                className="w-8 h-8 rounded-full bg-[#050C1F] hover:bg-[#008CFF]/20 text-[#A6C5FF] hover:text-white flex items-center justify-center border border-[#008CFF]/40"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#D8E6FF] font-tajawal">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/20">
                <div className="w-6 h-6 rounded-full bg-[#008CFF]/20 text-[#008CFF] font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">
                    {isAr ? 'تقديم طلب التسجيل الرسمي' : 'Submit Registration'}
                  </div>
                  <div className="text-xs text-[#9BB3DA]">
                    {isAr
                      ? 'املأ النموذج هنا بمعلوماتك واسم PSN وحساب TikTok الخاص بك.'
                      : 'Fill in this official form with your in-game name, PSN, and TikTok handle.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/20">
                <div className="w-6 h-6 rounded-full bg-[#8B5CFF]/20 text-[#8B5CFF] font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">
                    {isAr ? 'مراجعة الطلب من الإدارة' : 'Staff Review'}
                  </div>
                  <div className="text-xs text-[#9BB3DA]">
                    {isAr
                      ? 'يقوم فريق WPS3 بالتحقق من الطلب ومطابقة قواعد السيرفر.'
                      : 'The WPS3 staff team reviews your dossier against server standards.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/20">
                <div className="w-6 h-6 rounded-full bg-[#FFC928]/20 text-[#FFC928] font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">
                    {isAr ? 'إضافة الحساب على PS3 ودخول السيرفر' : 'PS3 Friend Invite & Server Entry'}
                  </div>
                  <div className="text-xs text-[#9BB3DA]">
                    {isAr
                      ? 'ستصلك رسالة وإضافة عبر PSN للدخول إلى السيرفر في اللعبة مباشرة!'
                      : 'You will receive a notification and a PSN friend invite to join the active server!'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowHowToJoinModal(false);
                  onStartRegistration();
                }}
                className="w-full voxel-btn-primary py-2.5 rounded font-chakra font-bold text-sm uppercase text-white"
              >
                {isAr ? 'ابدأ التسجيل الآن' : 'PROCEED TO REGISTER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
