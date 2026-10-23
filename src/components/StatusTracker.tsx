import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Gamepad } from 'lucide-react';

interface StatusTrackerProps {
  currentLang: 'ar' | 'en';
  initialQuery?: string;
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentLang,
  initialQuery = '',
  onNavigateHome,
  onNavigateRegister,
}) => {
  const isAr = currentLang === 'ar';
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    player_name: string;
    masked_psn: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string | null;
    created_at: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchVal?: string) => {
    const q = (searchVal !== undefined ? searchVal : query).trim();
    if (!q) {
      setError(isAr ? 'يرجى إدخال رقم الطلب أو معرف PSN' : 'Please enter an Application ID or PSN ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/applications/status/${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'لم يتم العثور على طلب' : 'Application not found'));
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ في البحث' : 'Search error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
      <div className="voxel-card rounded-2xl p-6 sm:p-8 border-2 border-[#008CFF]/40 shadow-[0_0_35px_rgba(0,140,255,0.25)]">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008CFF]/15 border border-[#008CFF] text-[#008CFF] font-chakra font-bold text-xs uppercase tracking-widest mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>APPLICATION LOOKUP</span>
          </div>
          <h2 className="font-chakra font-black text-2xl sm:text-3xl text-white tracking-wider">
            {isAr ? 'تتبع حالة طلب الانضمام إلى WPS3' : 'TRACK APPLICATION STATUS'}
          </h2>
          <p className="text-xs sm:text-sm text-[#A6C5FF] mt-1 font-tajawal">
            {isAr
              ? 'أدخل رقم الطلب الفريد (مثال: WPS3-8421-K9MA) أو معرف الـ PSN للتحقق من المراجعة'
              : 'Enter your unique Application ID (e.g. WPS3-8421-K9MA) or PSN ID to verify your status.'}
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError(null);
              }}
              placeholder={isAr ? 'رقم الطلب أو معرف الـ PSN...' : 'Application ID or PSN ID...'}
              className="w-full px-4 py-3 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/40 focus:border-[#008CFF] font-mono focus:outline-none focus:shadow-[0_0_15px_rgba(0,140,255,0.4)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="voxel-btn-primary px-6 py-3 rounded-lg font-chakra font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isAr ? 'استعلام' : 'SEARCH'}</span>
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm font-tajawal flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="p-5 rounded-xl bg-[#050C1F] border border-[#008CFF]/40 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#008CFF]/20 gap-2">
              <div>
                <span className="text-[11px] font-chakra text-[#A6C5FF] uppercase tracking-wider">
                  {isAr ? 'اسم اللاعب' : 'PLAYER'}
                </span>
                <div className="font-chakra font-black text-xl text-white">
                  {result.player_name}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {result.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFC928]/20 border border-[#FFC928] text-[#FFC928] font-chakra font-bold text-xs uppercase">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>PENDING REVIEW</span>
                  </span>
                )}
                {result.status === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-green-500/20 border border-green-500 text-green-400 font-chakra font-bold text-xs uppercase shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>APPROVED — مرحبًا بك في السيرفر</span>
                  </span>
                )}
                {result.status === 'rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500 text-red-400 font-chakra font-bold text-xs uppercase">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>REJECTED — تم الرفض</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#030817] border border-[#008CFF]/20">
                <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block">
                  {isAr ? 'معرف الـ PSN' : 'PSN ID'}
                </span>
                <span className="font-mono text-sm font-bold text-[#00E5FF]" dir="ltr">
                  {result.masked_psn}
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#030817] border border-[#008CFF]/20">
                <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block">
                  {isAr ? 'تاريخ التقديم' : 'SUBMITTED AT'}
                </span>
                <span className="font-mono text-xs text-[#E1EBFF]">
                  {new Date(result.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Official Admin Notes */}
            {result.admin_notes && (
              <div className="p-3 rounded-lg bg-[#008CFF]/10 border border-[#008CFF]/30 text-xs">
                <div className="font-chakra font-bold text-[#66C2FF] uppercase mb-1">
                  {isAr ? 'ملاحظات طاقم الإدارة:' : 'Staff Notes:'}
                </div>
                <div className="text-[#D8E6FF] font-tajawal leading-relaxed">
                  {result.admin_notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-[#008CFF]/20">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-chakra font-bold text-[#A6C5FF] hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة للرئيسية' : 'BACK TO HOME'}</span>
          </button>

          <button
            onClick={onNavigateRegister}
            className="text-xs font-chakra font-bold text-[#008CFF] hover:underline"
          >
            {isAr ? 'تقديم طلب جديد' : 'SUBMIT NEW APPLICATION'}
          </button>
        </div>
      </div>
    </div>
  );
};
