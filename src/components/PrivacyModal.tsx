import React from 'react';
import { Shield, Lock, EyeOff, UserCheck } from 'lucide-react';

interface PrivacyModalProps {
  currentLang: 'ar' | 'en';
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ currentLang, onClose }) => {
  const isAr = currentLang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="voxel-card rounded-2xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#008CFF] shadow-[0_0_40px_rgba(0,140,255,0.35)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#008CFF]/30 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#008CFF]/20 border border-[#008CFF] flex items-center justify-center text-[#008CFF]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-black text-xl text-white">
                {isAr ? 'سياسة الخصوصية وحماية البيانات' : 'PRIVACY POLICY & DATA INTEGRITY'}
              </h3>
              <span className="text-xs text-[#A6C5FF] font-chakra uppercase tracking-widest">
                WPS3 OFFICIAL PRIVACY PROTOCOL
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#050C1F] hover:bg-[#008CFF]/20 text-[#A6C5FF] hover:text-white flex items-center justify-center border border-[#008CFF]/40 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm font-tajawal text-[#D8E6FF] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#050C1F] border border-[#008CFF]/25">
            <div className="flex items-center gap-2 font-chakra font-bold text-white mb-1.5">
              <EyeOff className="w-4 h-4 text-[#FFC928]" />
              <span>{isAr ? '1. الحد الأدنى من البيانات المجمعة' : '1. Minimal Data Collection'}</span>
            </div>
            <p className="text-xs text-[#A6C5FF]">
              {isAr
                ? 'نقوم بجمع الحد الأدنى الضروري لتسجيلك: اسم اللاعب في اللعبة، العمر (للتأكد من ملاءمة المجتمع)، البلد واللغة، واسم حساب PSN وحساب TikTok للتواصل معك. لا نطلب معلومات شخصية حساسة.'
                : 'We collect only what is necessary: player handle, age verification, country, PSN Online ID, and TikTok username. No unnecessary personal data is requested.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#050C1F] border border-[#008CFF]/25">
            <div className="flex items-center gap-2 font-chakra font-bold text-white mb-1.5">
              <Lock className="w-4 h-4 text-[#00E5FF]" />
              <span>{isAr ? '2. أمان الحسابات وعدم طلب كلمات المرور' : '2. Zero-Password Protocol'}</span>
            </div>
            <p className="text-xs text-[#A6C5FF]">
              {isAr
                ? 'لا نطلب أبدًا كلمة مرور حساب PSN أو TikTok أو أي رموز تحقق ثنائي. اسم المستخدم العام يكفي بالكامل لإضافتك داخل لعبة Minecraft على PS3.'
                : 'We never request PSN passwords, TikTok passwords, or 2FA codes. Public usernames are sufficient to connect you to the server.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#050C1F] border border-[#008CFF]/25">
            <div className="flex items-center gap-2 font-chakra font-bold text-white mb-1.5">
              <UserCheck className="w-4 h-4 text-[#8B5CFF]" />
              <span>{isAr ? '3. حماية بيانات القاصرين وحق الحذف' : '3. Minor Protection & Data Removal'}</span>
            </div>
            <p className="text-xs text-[#A6C5FF]">
              {isAr
                ? 'يحق لأي لاعب أو ولي أمر طلب حذف طلب التسجيل بالكامل من قاعدة بيانات السيرفر في أي وقت عبر التواصل مع إدارة WPS3.'
                : 'Any player or parent may request immediate and permanent deletion of their registration data by contacting the server administrator.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#008CFF]/25 flex justify-end">
          <button
            onClick={onClose}
            className="voxel-btn-primary px-6 py-2.5 rounded font-chakra font-bold text-xs uppercase tracking-wider text-white cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
};
