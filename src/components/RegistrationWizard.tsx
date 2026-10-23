import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ApplicationFormData,
  validateStep1,
  validateStep2,
  validateStep3,
  formatTikTokHandle,
} from '../utils/validation';
import {
  User,
  Shield,
  Gamepad,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Send,
  Edit3,
  Clock,
  Info,
} from 'lucide-react';

interface RegistrationWizardProps {
  currentLang: 'ar' | 'en';
  onNavigateHome: () => void;
  onNavigateTrack: (queryId?: string) => void;
  onOpenRules: () => void;
}

const COUNTRIES = [
  { code: 'DZ', nameAr: 'الجزائر 🇩🇿', nameEn: 'Algeria 🇩🇿' },
  { code: 'SA', nameAr: 'المملكة العربية السعودية 🇸🇦', nameEn: 'Saudi Arabia 🇸🇦' },
  { code: 'MA', nameAr: 'المغرب 🇲🇦', nameEn: 'Morocco 🇲🇦' },
  { code: 'TN', nameAr: 'تونس 🇹🇳', nameEn: 'Tunisia 🇹🇳' },
  { code: 'EG', nameAr: 'مصر 🇪🇬', nameEn: 'Egypt 🇪🇬' },
  { code: 'AE', nameAr: 'الإمارات العربية المتحدة 🇦🇪', nameEn: 'United Arab Emirates 🇦🇪' },
  { code: 'IQ', nameAr: 'العراق 🇮🇶', nameEn: 'Iraq 🇮🇶' },
  { code: 'JO', nameAr: 'الأردن 🇯🇴', nameEn: 'Jordan 🇯🇴' },
  { code: 'KW', nameAr: 'الكويت 🇰🇼', nameEn: 'Kuwait 🇰🇼' },
  { code: 'OM', nameAr: 'سلطنة عمان 🇴🇲', nameEn: 'Oman 🇴🇲' },
  { code: 'QA', nameAr: 'قطر 🇶🇦', nameEn: 'Qatar 🇶🇦' },
  { code: 'BH', nameAr: 'البحرين 🇧🇭', nameEn: 'Bahrain 🇧🇭' },
  { code: 'LB', nameAr: 'لبنان 🇱🇧', nameEn: 'Lebanon 🇱🇧' },
  { code: 'LY', nameAr: 'ليبيا 🇱🇾', nameEn: 'Libya 🇱🇾' },
  { code: 'PS', nameAr: 'فلسطين 🇵🇸', nameEn: 'Palestine 🇵🇸' },
  { code: 'YE', nameAr: 'اليمن 🇾🇪', nameEn: 'Yemen 🇾🇪' },
  { code: 'SD', nameAr: 'السودان 🇸🇩', nameEn: 'Sudan 🇸🇩' },
  { code: 'SY', nameAr: 'سوريا 🇸🇾', nameEn: 'Syria 🇸🇾' },
  { code: 'MR', nameAr: 'موريتانيا 🇲🇷', nameEn: 'Mauritania 🇲🇷' },
  { code: 'OTHER', nameAr: 'بلد آخر 🌐', nameEn: 'Other Country 🌐' },
];

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  currentLang,
  onNavigateHome,
  onNavigateTrack,
  onOpenRules,
}) => {
  const isAr = currentLang === 'ar';
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [formData, setFormData] = useState<ApplicationFormData>({
    player_name: '',
    age: '',
    country: 'Algeria',
    city: '',
    language: 'ar',
    play_style: 'survival',
    additional_info: '',
    rules_agreed: false,

    psn_online_id: '',
    minecraft_access: 'yes',
    play_mode: 'multiplayer',
    connection_notes: '',

    tiktok_username: '',
    tiktok_url: '',
    join_reason: 'friends',
    contact_preference: 'tiktok',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Success State
  const [submittedApp, setSubmittedApp] = useState<{
    id: string;
    player_name: string;
    psn_online_id: string;
    application_status: string;
    created_at: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState(false);

  // Handlers for step progression
  const handleProceedToStep2 = () => {
    const res = validateStep1(formData);
    if (!res.isValid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    const res = validateStep2(formData);
    if (!res.isValid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    setStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleProceedToReview = () => {
    const res = validateStep3(formData);
    if (!res.isValid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    setStep(4);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال الطلب. يرجى المحاولة لاحقًا');
      }

      setSubmittedApp(data.application);
      setStep(5);
      window.scrollTo({ top: 120, behavior: 'smooth' });

      // Trigger Diamond & Emerald celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#008CFF', '#00E5FF', '#FFC928', '#8B5CFF', '#FFFFFF'],
      });
    } catch (err: any) {
      setSubmitError(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  const copyAppId = () => {
    if (submittedApp?.id) {
      navigator.clipboard.writeText(submittedApp.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Step Breadcrumbs */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="font-chakra font-bold text-xs uppercase text-[#A6C5FF] tracking-widest">
              {isAr ? `المرحلة 0${step} من 04` : `STEP 0${step} OF 04`}
            </span>
            <span className="text-xs font-mono text-[#008CFF] font-bold">
              {step === 1 && (isAr ? 'معلومات اللاعب' : 'PLAYER INFO')}
              {step === 2 && (isAr ? 'حساب PSN' : 'PLAYSTATION')}
              {step === 3 && (isAr ? 'حساب TIKTOK' : 'TIKTOK')}
              {step === 4 && (isAr ? 'المراجعة النهائية' : 'REVIEW')}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'bg-gradient-to-r from-[#008CFF] to-[#00E5FF] shadow-[0_0_12px_#008CFF]'
                    : s < step
                    ? 'bg-[#008CFF]/60'
                    : 'bg-[#050C1F] border border-[#008CFF]/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Wizard Form Card */}
      <div className="voxel-card rounded-2xl p-6 sm:p-8 border-2 border-[#008CFF]/40 shadow-[0_0_40px_rgba(0,140,255,0.25)] relative overflow-hidden">
        {/* Glow ambient light */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#008CFF]/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#8B5CFF]/10 blur-[80px] rounded-full pointer-events-none" />

        {/* STEP 1: PLAYER INFORMATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#008CFF]/25 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#008CFF]/20 border border-[#008CFF] text-[#008CFF] font-chakra font-black text-sm flex items-center justify-center">
                  01
                </div>
                <h2 className="font-chakra font-black text-2xl text-white tracking-wider">
                  STEP 01 — PLAYER INFORMATION
                </h2>
              </div>
              <p className="text-sm text-[#A6C5FF] mt-1 font-tajawal">
                «أخبرنا قليلًا عن نفسك قبل الانضمام إلى WPS3»
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* In-game Name */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '1. اسم اللاعب داخل السيرفر *' : '1. In-Game Player Name *'}
                </label>
                <input
                  type="text"
                  value={formData.player_name}
                  onChange={(e) => {
                    setFormData({ ...formData, player_name: e.target.value });
                    if (errors.player_name) setErrors({ ...errors, player_name: '' });
                  }}
                  placeholder="مثال: WailNinja"
                  className={`w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border font-chakra font-medium focus:outline-none transition-all ${
                    errors.player_name
                      ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                      : 'border-[#008CFF]/40 focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                  }`}
                />
                {errors.player_name && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-tajawal">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.player_name}</span>
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '2. العمر *' : '2. Age *'}
                </label>
                <input
                  type="number"
                  min="10"
                  max="85"
                  value={formData.age}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                    setFormData({ ...formData, age: val });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  placeholder="مثال: 18"
                  className={`w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border font-chakra font-medium focus:outline-none transition-all ${
                    errors.age
                      ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                      : 'border-[#008CFF]/40 focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                  }`}
                />
                {errors.age && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-tajawal">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.age}</span>
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '3. البلد *' : '3. Country *'}
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    setFormData({ ...formData, country: e.target.value });
                    if (errors.country) setErrors({ ...errors, country: '' });
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-chakra focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.nameEn.split(' ')[0]} className="bg-[#030817] text-white">
                      {isAr ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-xs text-red-400 mt-1.5 font-tajawal">{errors.country}</p>
                )}
              </div>

              {/* State or City */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '4. الولاية أو المدينة (اختياري)' : '4. State / City (Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="مثال: الرياض / وهران / الدار البيضاء"
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-chakra focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all"
                />
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '5. اللغة المفضلة *' : '5. Preferred Language *'}
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-chakra focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all cursor-pointer"
                >
                  <option value="ar" className="bg-[#030817]">العربية (Arabic)</option>
                  <option value="en" className="bg-[#030817]">English (إنجليزية)</option>
                  <option value="fr" className="bg-[#030817]">Français (فرنسية)</option>
                </select>
              </div>

              {/* Preferred Play Style */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '6. نوع اللعب المفضل *' : '6. Preferred Play Style *'}
                </label>
                <select
                  value={formData.play_style}
                  onChange={(e) => setFormData({ ...formData, play_style: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-chakra focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all cursor-pointer"
                >
                  <option value="survival" className="bg-[#030817]">Survival (بقاء على قيد الحياة)</option>
                  <option value="building" className="bg-[#030817]">Building (بناء وتصميم)</option>
                  <option value="pvp" className="bg-[#030817]">PvP (قتال ومبارزة)</option>
                  <option value="adventure" className="bg-[#030817]">Adventure (مغامرات واستكشاف)</option>
                  <option value="friends" className="bg-[#030817]">Playing with friends (اللعب الجماعي مع الأصدقاء)</option>
                </select>
              </div>
            </div>

            {/* Additional Info / Bio */}
            <div>
              <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                {isAr ? '7. معلومات إضافية (اختياري)' : '7. Additional Information (Optional)'}
              </label>
              <textarea
                rows={3}
                value={formData.additional_info || ''}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                placeholder="اكتب نبذة قصيرة عن نفسك، مهاراتك في ماين كرافت، أو كم لك تلعب PS3..."
                className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-tajawal focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all text-sm"
              />
            </div>

            {/* Rules Agreement Checkbox */}
            <div className="p-4 rounded-xl bg-[#050C1F]/80 border border-[#008CFF]/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rules_agreed}
                  onChange={(e) => {
                    setFormData({ ...formData, rules_agreed: e.target.checked });
                    if (errors.rules_agreed) setErrors({ ...errors, rules_agreed: '' });
                  }}
                  className="mt-1 w-5 h-5 rounded border-[#008CFF] text-[#008CFF] focus:ring-[#008CFF] bg-[#030817] accent-[#008CFF] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-[#D8E6FF] font-tajawal leading-relaxed">
                  {isAr
                    ? 'أوافق على الالتزام الكامل بجميع قواعد سيرفر WPS3 واحترام اللاعبين وعدم استخدام أي برامج غش أو تخريب في اللعبة.'
                    : 'I agree to comply fully with all WPS3 server rules, respect players, and avoid any griefing or cheating.'}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenRules();
                    }}
                    className="text-[#008CFF] underline font-bold hover:text-[#66C2FF]"
                  >
                    {isAr ? 'قراءة القواعد الكاملة' : 'Read Full Rules'}
                  </button>
                </span>
              </label>
              {errors.rules_agreed && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1 font-tajawal">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.rules_agreed}</span>
                </p>
              )}
            </div>

            {/* Continue to Step 2 Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="voxel-btn-primary px-8 py-3.5 rounded-lg font-chakra font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer"
              >
                <span>CONTINUE TO PSN</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PLAYSTATION NETWORK */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#008CFF]/25 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#8B5CFF]/20 border border-[#8B5CFF] text-[#8B5CFF] font-chakra font-black text-sm flex items-center justify-center">
                  02
                </div>
                <h2 className="font-chakra font-black text-2xl text-white tracking-wider">
                  STEP 02 — PLAYSTATION NETWORK
                </h2>
              </div>
              <p className="text-sm text-[#A6C5FF] mt-1 font-tajawal">
                «أدخل اسم المستخدم العام الخاص بك حتى يتمكن طاقم WPS3 من التعرّف على حسابك»
              </p>
            </div>

            {/* Glowing Neon Blue Safety Warning Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#008CFF]/15 via-[#031B44]/50 to-[#008CFF]/15 border-2 border-[#008CFF] shadow-[0_0_20px_rgba(0,140,255,0.35)] flex items-start gap-3.5">
              <Shield className="w-6 h-6 text-[#00E5FF] shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="font-chakra font-bold text-sm text-[#66C2FF] uppercase tracking-wider">
                  IMPORTANT: Never share your PSN password or verification codes.
                </h4>
                <p className="text-xs text-[#D8E6FF] mt-1 font-tajawal leading-relaxed">
                  {isAr
                    ? 'طاقم وسيرفر WPS3 لن يطلب منك أبدًا كلمة المرور الخاصة بحسابك أو بريدك الإلكتروني. اسم الـ PSN Online ID العام هو كل ما نحتاجه للتواصل وإضافتك داخل Minecraft PS3.'
                    : 'WPS3 staff will NEVER ask for your PSN password or email credentials. Only your public PSN Online ID is needed.'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* PSN Online ID */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '1. PSN Online ID (اسم المستخدم العام في بلايستيشن) *' : '1. PSN Online ID (Public Gamertag) *'}
                </label>
                <input
                  type="text"
                  value={formData.psn_online_id}
                  onChange={(e) => {
                    setFormData({ ...formData, psn_online_id: e.target.value });
                    if (errors.psn_online_id) setErrors({ ...errors, psn_online_id: '' });
                  }}
                  placeholder="مثال: Wail_Gamer23"
                  className={`w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border font-mono font-medium focus:outline-none transition-all ${
                    errors.psn_online_id
                      ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                      : 'border-[#008CFF]/40 focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                  }`}
                />
                <span className="text-[11px] text-[#8BB7F0] mt-1 block font-tajawal">
                  {isAr
                    ? 'اكتب المعرف كما يظهر على شاشة الـ PS3 تمامًا (بين 3 و 16 حرفًا).'
                    : 'Enter ID exactly as shown on your PS3 console (3-16 chars).'}
                </span>
                {errors.psn_online_id && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-tajawal">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.psn_online_id}</span>
                  </p>
                )}
              </div>

              {/* Can you access Minecraft PS3? */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '2. هل تستطيع الدخول إلى Minecraft PS3؟ *' : '2. Can you access Minecraft PS3? *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, minecraft_access: 'yes' })}
                    className={`p-3.5 rounded-lg border text-start flex items-center justify-between transition-all cursor-pointer ${
                      formData.minecraft_access === 'yes'
                        ? 'bg-[#008CFF]/20 border-[#008CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                        : 'bg-[#050C1F] border-[#008CFF]/30 text-[#A6C5FF] hover:border-[#008CFF]/60'
                    }`}
                  >
                    <span className="font-chakra font-bold text-sm">
                      {isAr ? 'نعم، جهازي واللعبة جاهزان' : 'Yes, ready to play'}
                    </span>
                    {formData.minecraft_access === 'yes' && (
                      <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, minecraft_access: 'need_help' })}
                    className={`p-3.5 rounded-lg border text-start flex items-center justify-between transition-all cursor-pointer ${
                      formData.minecraft_access === 'need_help'
                        ? 'bg-[#8B5CFF]/20 border-[#8B5CFF] text-white shadow-[0_0_15px_rgba(139,92,255,0.4)]'
                        : 'bg-[#050C1F] border-[#008CFF]/30 text-[#A6C5FF] hover:border-[#008CFF]/60'
                    }`}
                  >
                    <span className="font-chakra font-bold text-sm">
                      {isAr ? 'لا، أحتاج إلى مساعدة في التثبيت' : 'No, I need assistance'}
                    </span>
                    {formData.minecraft_access === 'need_help' && (
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CFF]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Preferred multiplayer mode */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '3. طريقة اللعب المفضلة على PS3 *' : '3. Preferred Multiplayer Mode *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'multiplayer', ar: 'اللعب الجماعي مع الأصدقاء', en: 'Multiplayer with Friends' },
                    { key: 'server_world', ar: 'الانضمام إلى عالم السيرفر', en: 'Join Server World' },
                    { key: 'events', ar: 'المشاركة في الفعاليات', en: 'Participate in Events' },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, play_mode: mode.key as any })}
                      className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                        formData.play_mode === mode.key
                          ? 'bg-[#008CFF]/20 border-[#008CFF] text-white shadow-[0_0_12px_rgba(0,140,255,0.3)]'
                          : 'bg-[#050C1F] border-[#008CFF]/30 text-[#A6C5FF] hover:border-[#008CFF]/60'
                      }`}
                    >
                      <span className="font-tajawal text-xs font-bold">
                        {isAr ? mode.ar : mode.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connection notes */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '4. ملاحظات حول الاتصال (اختياري)' : '4. Connection Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.connection_notes || ''}
                  onChange={(e) => setFormData({ ...formData, connection_notes: e.target.value })}
                  placeholder="مثال: سرعة النت، أوقات التواجد المسائية، إلخ..."
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-tajawal focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all text-sm"
                />
              </div>
            </div>

            {/* Back & Next Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#008CFF]/20">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg bg-[#050C1F] border border-[#008CFF]/30 text-[#A6C5FF] hover:text-white font-chakra font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{isAr ? 'السابق' : 'BACK'}</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep3}
                className="voxel-btn-primary px-8 py-3.5 rounded-lg font-chakra font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer"
              >
                <span>CONTINUE TO TIKTOK</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SOCIAL CONTACT */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#008CFF]/25 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#FFC928]/20 border border-[#FFC928] text-[#FFC928] font-chakra font-black text-sm flex items-center justify-center">
                  03
                </div>
                <h2 className="font-chakra font-black text-2xl text-white tracking-wider">
                  STEP 03 — SOCIAL CONTACT
                </h2>
              </div>
              <p className="text-sm text-[#A6C5FF] mt-1 font-tajawal">
                «أضف حساب TikTok الخاص بك حتى يستطيع فريق WPS3 التواصل معك بخصوص طلبك»
              </p>
            </div>

            <div className="space-y-5">
              {/* TikTok Username */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '1. اسم مستخدم TikTok *' : '1. TikTok Username *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-[#008CFF] font-chakra font-bold text-base select-none">
                    @
                  </span>
                  <input
                    type="text"
                    value={formData.tiktok_username.replace(/^@/, '')}
                    onChange={(e) => {
                      setFormData({ ...formData, tiktok_username: formatTikTokHandle(e.target.value) });
                      if (errors.tiktok_username) setErrors({ ...errors, tiktok_username: '' });
                    }}
                    placeholder="WailGaming"
                    className={`w-full pl-9 pr-4 py-3 rounded-lg bg-[#050C1F] text-white border font-mono font-medium focus:outline-none transition-all ${
                      errors.tiktok_username
                        ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        : 'border-[#008CFF]/40 focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                    }`}
                  />
                </div>
                <span className="text-[11px] text-[#8BB7F0] mt-1 block font-tajawal">
                  {isAr
                    ? 'سيتم إضافة علامة @ تلقائيًا. مثال توضيحي: WailGaming'
                    : 'The @ is handled automatically. Example: WailGaming'}
                </span>
                {errors.tiktok_username && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-tajawal">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.tiktok_username}</span>
                  </p>
                )}
              </div>

              {/* TikTok Profile Link */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '2. رابط حساب TikTok (اختياري)' : '2. TikTok Profile URL (Optional)'}
                </label>
                <input
                  type="url"
                  value={formData.tiktok_url || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, tiktok_url: e.target.value });
                    if (errors.tiktok_url) setErrors({ ...errors, tiktok_url: '' });
                  }}
                  placeholder="https://www.tiktok.com/@username"
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-mono focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all text-sm"
                />
                {errors.tiktok_url && (
                  <p className="text-xs text-red-400 mt-1.5 font-tajawal">{errors.tiktok_url}</p>
                )}
              </div>

              {/* Reason for Joining */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '3. سبب الانضمام *' : '3. Reason for Joining *'}
                </label>
                <select
                  value={formData.join_reason}
                  onChange={(e) => setFormData({ ...formData, join_reason: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-chakra focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all cursor-pointer"
                >
                  <option value="friends" className="bg-[#030817]">أريد اللعب مع الأصدقاء (Play with friends)</option>
                  <option value="events" className="bg-[#030817]">أريد المشاركة في فعاليات السيرفر (Server events)</option>
                  <option value="building" className="bg-[#030817]">أريد بناء مشاريع داخل Minecraft (Build projects)</option>
                  <option value="other" className="bg-[#030817]">سبب آخر (Other reason)</option>
                </select>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-chakra font-bold text-[#E1EBFF] uppercase tracking-wider mb-2">
                  {isAr ? '4. أفضل طريقة للتواصل *' : '4. Preferred Contact Method *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contact_preference: 'tiktok' })}
                    className={`p-3.5 rounded-lg border text-start flex items-center justify-between transition-all cursor-pointer ${
                      formData.contact_preference === 'tiktok'
                        ? 'bg-[#008CFF]/20 border-[#008CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                        : 'bg-[#050C1F] border-[#008CFF]/30 text-[#A6C5FF] hover:border-[#008CFF]/60'
                    }`}
                  >
                    <span className="font-chakra font-bold text-sm">
                      {isAr ? 'عبر TikTok (الرسائل المباشرة)' : 'TikTok Direct Message'}
                    </span>
                    {formData.contact_preference === 'tiktok' && (
                      <CheckCircle2 className="w-4 h-4 text-[#008CFF]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contact_preference: 'none' })}
                    className={`p-3.5 rounded-lg border text-start flex items-center justify-between transition-all cursor-pointer ${
                      formData.contact_preference === 'none'
                        ? 'bg-[#8B5CFF]/20 border-[#8B5CFF] text-white shadow-[0_0_15px_rgba(139,92,255,0.4)]'
                        : 'bg-[#050C1F] border-[#008CFF]/30 text-[#A6C5FF] hover:border-[#008CFF]/60'
                    }`}
                  >
                    <span className="font-chakra font-bold text-sm">
                      {isAr ? 'لا أحتاج إلى تواصل إضافي' : 'No extra contact needed'}
                    </span>
                    {formData.contact_preference === 'none' && (
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CFF]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Privacy Notice Box */}
              <div className="p-3.5 rounded-lg bg-[#050C1F]/60 border border-[#008CFF]/20 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#008CFF] shrink-0 mt-0.5" />
                <p className="text-xs text-[#9BB3DA] font-tajawal leading-relaxed">
                  {isAr
                    ? 'تنبيه: حساب TikTok سيُستخدم فقط للتواصل المتعلق بطلب التسجيل وإبلاغك بقبول الحساب، وفق سياسة الخصوصية الخاصة بسيرفر WPS3.'
                    : 'Notice: Your TikTok handle will be used exclusively for application updates in accordance with WPS3 privacy policy.'}
                </p>
              </div>
            </div>

            {/* Back & Next Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#008CFF]/20">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-lg bg-[#050C1F] border border-[#008CFF]/30 text-[#A6C5FF] hover:text-white font-chakra font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{isAr ? 'السابق' : 'BACK'}</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToReview}
                className="voxel-btn-primary px-8 py-3.5 rounded-lg font-chakra font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO REVIEW</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW APPLICATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-[#008CFF]/25 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#008CFF]/20 border border-[#008CFF] text-[#008CFF] font-chakra font-black text-sm flex items-center justify-center">
                  04
                </div>
                <h2 className="font-chakra font-black text-2xl text-white tracking-wider">
                  APPLICATION REVIEW & CONFIRMATION
                </h2>
              </div>
              <p className="text-sm text-[#A6C5FF] mt-1 font-tajawal">
                {isAr
                  ? 'راجع جميع بياناتك بعناية قبل الإرسال النهائي إلى طاقم WPS3.'
                  : 'Review all entered information carefully before final submission.'}
              </p>
            </div>

            {/* Gaming Dossier HUD Summary */}
            <div className="p-5 rounded-xl bg-[#050C1F] border border-[#008CFF]/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                    {isAr ? 'اسم اللاعب' : 'Player Name'}
                  </div>
                  <div className="font-chakra font-bold text-lg text-white mt-0.5">
                    {formData.player_name}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                    {isAr ? 'العمر والبلد' : 'Age & Country'}
                  </div>
                  <div className="font-chakra font-bold text-lg text-white mt-0.5">
                    {formData.age} {isAr ? 'سنة' : 'yrs'} • {formData.country} {formData.city ? `(${formData.city})` : ''}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                    {isAr ? 'معرف الـ PSN Online ID' : 'PSN Online ID'}
                  </div>
                  <div className="font-mono font-bold text-lg text-[#00E5FF] mt-0.5" dir="ltr">
                    {formData.psn_online_id}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                    {isAr ? 'حساب TikTok' : 'TikTok Handle'}
                  </div>
                  <div className="font-mono font-bold text-lg text-[#FFC928] mt-0.5" dir="ltr">
                    {formData.tiktok_username}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                    {isAr ? 'نمط اللعب' : 'Play Style'}
                  </div>
                  <div className="font-chakra font-bold text-base text-[#D8E6FF] mt-0.5 uppercase">
                    {formData.play_style}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                    {isAr ? 'طريقة التواصل المفضلة' : 'Contact Preference'}
                  </div>
                  <div className="font-chakra font-bold text-base text-[#D8E6FF] mt-0.5">
                    {formData.contact_preference === 'tiktok' ? 'TikTok' : 'None'}
                  </div>
                </div>
              </div>

              {formData.additional_info && (
                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20 text-xs">
                  <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider mb-1">
                    {isAr ? 'نبذة إضافية' : 'Bio / Notes'}
                  </div>
                  <div className="text-[#D8E6FF] font-tajawal">{formData.additional_info}</div>
                </div>
              )}
            </div>

            {/* Submit Error Warning */}
            {submitError && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500 text-red-200 text-sm font-tajawal flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#008CFF]/20">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/40 text-[#A6C5FF] hover:text-white font-chakra font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#008CFF]" />
                <span>{isAr ? 'تعديل البيانات' : 'EDIT INFORMATION'}</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto voxel-btn-primary px-8 py-3.5 rounded-lg font-chakra font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,140,255,0.7)] cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isAr ? 'جاري إرسال الطلب...' : 'TRANSMITTING...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'تأكيد وإرسال الطلب' : 'CONFIRM & SUBMIT'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: APPLICATION SUCCESS */}
        {step === 5 && submittedApp && (
          <div className="py-6 flex flex-col items-center text-center space-y-6 animate-fadeIn">
            {/* Animated Glowing Minecraft Cube */}
            <div className="relative w-24 h-24 my-2 flex items-center justify-center">
              {/* Outer Aura */}
              <div className="absolute inset-0 bg-[#008CFF]/30 blur-2xl rounded-full animate-pulse" />

              {/* 3D Isometric Voxel Cube */}
              <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_#008CFF]" viewBox="0 0 100 100">
                {/* Top Face */}
                <polygon points="50,15 85,35 50,55 15,35" fill="#00B4D8" stroke="#00E5FF" strokeWidth="1.5" />
                {/* Left Face */}
                <polygon points="15,35 50,55 50,90 15,70" fill="#0077B6" stroke="#008CFF" strokeWidth="1.5" />
                {/* Right Face */}
                <polygon points="50,55 85,35 85,70 50,90" fill="#03045E" stroke="#008CFF" strokeWidth="1.5" />
                {/* Inner Glow Lines */}
                <circle cx="50" cy="52" r="6" fill="#FFFFFF" opacity="0.8" />
              </svg>
            </div>

            {/* Transmission Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008CFF]/20 border border-[#008CFF] text-[#00E5FF] font-chakra font-bold text-xs uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                <span>APPLICATION TRANSMITTED!</span>
              </div>
              <h2 className="font-chakra font-black text-3xl sm:text-4xl text-white tracking-wider">
                {isAr ? 'تم إرسال طلب انضمامك إلى WPS3 بنجاح!' : 'APPLICATION TRANSMITTED SUCCESSFULLY!'}
              </h2>
            </div>

            {/* Arabic Confirmation Message as requested */}
            <p className="text-sm sm:text-base text-[#D8E6FF] max-w-xl font-tajawal leading-relaxed">
              «تم إرسال طلب انضمامك إلى WPS3 بنجاح! سيقوم فريق السيرفر بمراجعة طلبك والتواصل معك عبر الطريقة التي اخترتها عند الحاجة. إرسال الطلب لا يعني قبولك تلقائيًا».
            </p>

            {/* Unique Application ID Box */}
            <div className="w-full max-w-md p-4 rounded-xl bg-[#050C1F] border-2 border-[#008CFF] shadow-[0_0_25px_rgba(0,140,255,0.35)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-start">
                <div className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                  {isAr ? 'رقم الطلب الفريد' : 'UNIQUE APPLICATION ID'}
                </div>
                <div className="font-mono font-black text-xl text-[#00E5FF] tracking-wider select-all" dir="ltr">
                  {submittedApp.id}
                </div>
              </div>

              <button
                type="button"
                onClick={copyAppId}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#008CFF]/20 hover:bg-[#008CFF]/40 border border-[#008CFF] text-xs font-chakra font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>{isAr ? 'تم النسخ!' : 'COPIED!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ رقم الطلب' : 'COPY ID'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Real Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFC928]/15 border border-[#FFC928] text-[#FFC928] font-chakra font-bold text-sm tracking-wider">
              <Clock className="w-4 h-4 animate-spin text-[#FFC928]" />
              <span>STATUS: PENDING REVIEW</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-4">
              <button
                type="button"
                onClick={() => onNavigateTrack(submittedApp.id)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/50 hover:border-[#008CFF] text-[#A6C5FF] hover:text-white font-chakra font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'تتبع حالة طلبك الآن' : 'TRACK STATUS NOW'}</span>
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto voxel-btn-primary px-8 py-3 rounded-lg font-chakra font-bold text-xs uppercase tracking-wider text-white"
              >
                {isAr ? 'العودة للصفحة الرئيسية' : 'RETURN TO HOMEPAGE'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
