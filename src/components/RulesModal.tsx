import React from 'react';
import { BookOpen, ShieldCheck, Check, AlertOctagon } from 'lucide-react';

interface RulesModalProps {
  currentLang: 'ar' | 'en';
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ currentLang, onClose }) => {
  const isAr = currentLang === 'ar';

  const rulesList = [
    {
      titleAr: '1. الاحترام المتبادل واللعب النظيف',
      titleEn: '1. Mutual Respect & Fair Play',
      descAr: 'يُمنع منعًا باتًا أي تنمر أو إهانة أو إساءة لفظية داخل السيرفر أو عبر الدردشة الصوتية والكتابية.',
      descEn: 'Harassment, hate speech, toxicity, and bullying are strictly forbidden across voice, text, and chat.',
    },
    {
      titleAr: '2. منع التخريب (Anti-Griefing)',
      titleEn: '2. Strict Anti-Griefing Policy',
      descAr: 'لا تخرّب مباني اللاعبين الآخرين ولا تسرق مواردهم دون إذن مسبق. الحفاظ على العوالم مسؤولية الجميع.',
      descEn: 'Never destroy, alter, or steal from other players builds or chests without permission.',
    },
    {
      titleAr: '3. منع برامج الغش والهاك (No Hacks / Cheats)',
      titleEn: '3. No Cheats, Hacks, or Exploits',
      descAr: 'يُحظر استخدام أي مودات أو تعديلات برمجية غير مصرح بها تعطي أفضلية غير عادلة كـ X-Ray أو Fly.',
      descEn: 'Use of unauthorized modifications, hacked clients, X-Ray packs, or unfair exploits will result in a permanent ban.',
    },
    {
      titleAr: '4. الالتزام بقرارات المشرفين وطاقم WPS3',
      titleEn: '4. Comply with Staff Instructions',
      descAr: 'فريق الإدارة يعمل للحفاظ على بيئة لعب ممتعة للجميع؛ يرجى التعاون معهم وإبلاغهم بأي مشكلة فورًا.',
      descEn: 'Staff members oversee server safety and fair play; follow their directives and report issues promptly.',
    },
    {
      titleAr: '5. حماية أمان الحسابات',
      titleEn: '5. Account Safety & Integrity',
      descAr: 'لا تشارك بياناتك الحساسة أو كلمات المرور مع أي شخص. السيرفر مسؤول فقط عن النظام الداخلي.',
      descEn: 'Never share personal credentials or passwords. Keep your PlayStation account secure.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="voxel-card rounded-2xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#008CFF] shadow-[0_0_40px_rgba(0,140,255,0.35)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#008CFF]/30 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#008CFF]/20 border border-[#008CFF] flex items-center justify-center text-[#008CFF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-black text-xl text-white">
                {isAr ? 'قواعد سيرفر WPS3 الرسمية' : 'OFFICIAL WPS3 SERVER RULES'}
              </h3>
              <span className="text-xs text-[#A6C5FF] font-chakra uppercase tracking-widest">
                MINECRAFT PLAYSTATION 3 COMMUNITY
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

        {/* Rules Body */}
        <div className="space-y-4">
          {rulesList.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#050C1F] border border-[#008CFF]/25 hover:border-[#008CFF]/60 transition-colors"
            >
              <div className="flex items-center gap-2 font-chakra font-bold text-sm text-white mb-1">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span>{isAr ? rule.titleAr : rule.titleEn}</span>
              </div>
              <p className="text-xs text-[#A6C5FF] font-tajawal leading-relaxed">
                {isAr ? rule.descAr : rule.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Acknowledgment */}
        <div className="mt-6 pt-4 border-t border-[#008CFF]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#8BB7F0] font-tajawal flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-[#FFC928]" />
            <span>{isAr ? 'مخالفة القواعد قد تؤدي إلى حظر الحساب نهائيًا.' : 'Rule violations will result in server ban.'}</span>
          </div>

          <button
            onClick={onClose}
            className="voxel-btn-primary px-6 py-2.5 rounded font-chakra font-bold text-xs uppercase tracking-wider text-white cursor-pointer"
          >
            {isAr ? 'فهمت وأوافق' : 'I UNDERSTAND & AGREE'}
          </button>
        </div>
      </div>
    </div>
  );
};
