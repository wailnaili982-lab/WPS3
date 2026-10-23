import React, { useState, useEffect } from 'react';
import { ApplicationRecord } from '../utils/validation';
import {
  Crown,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Shield,
  Send,
  UserCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  currentLang: 'ar' | 'en';
  adminToken: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  adminToken,
  onLogout,
}) => {
  const isAr = currentLang === 'ar';

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // Note update state inside drawer/modal
  const [noteDraft, setNoteDraft] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [copiedPsn, setCopiedPsn] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch apps
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (search.trim()) queryParams.append('search', search.trim());

      const res = await fetch(`/api/admin/applications?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      const data = await res.json();
      setApplications(data.applications || []);

      // 2. Fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const statsData = await statsRes.json();
      setStats({
        total: statsData.total || 0,
        pending: statsData.pending || 0,
        approved: statsData.approved || 0,
        rejected: statsData.rejected || 0,
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected', notes?: string) => {
    setUpdating(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: notes !== undefined ? notes : noteDraft,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تحديث حالة الطلب');
      }

      setActionSuccess(
        newStatus === 'approved'
          ? (isAr ? 'تم قبول طلب اللاعب بنجاح! ✅' : 'Application Approved! ✅')
          : newStatus === 'rejected'
          ? (isAr ? 'تم رفض طلب اللاعب ❌' : 'Application Rejected ❌')
          : (isAr ? 'تمت إعادة الحالة إلى قيد المراجعة ⏳' : 'Reset to Pending ⏳')
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? data.application : app))
      );
      if (selectedApp?.id === id) {
        setSelectedApp(data.application);
      }

      // Re-fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const statsData = await statsRes.json();
      setStats({
        total: statsData.total || 0,
        pending: statsData.pending || 0,
        approved: statsData.approved || 0,
        rejected: statsData.rejected || 0,
      });
    } catch (err: any) {
      setActionError(err.message || 'حدث خطأ');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب نهائيًا؟' : 'Are you sure you want to permanently delete this application?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('فشل الحذف');

      setApplications((prev) => prev.filter((app) => app.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);

      // Re-fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const statsData = await statsRes.json();
      setStats({
        total: statsData.total || 0,
        pending: statsData.pending || 0,
        approved: statsData.approved || 0,
        rejected: statsData.rejected || 0,
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/admin/export?token=${adminToken}`, '_blank');
    // Direct link trigger with Authorization header fallback
    fetch('/api/admin/export', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'WPS3_Server_Applications.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  const copyPsn = (psn: string) => {
    navigator.clipboard.writeText(psn);
    setCopiedPsn(true);
    setTimeout(() => setCopiedPsn(false), 2000);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Admin Header Bar */}
      <div className="voxel-card rounded-2xl p-6 border-2 border-[#FFC928]/60 shadow-[0_0_35px_rgba(255,201,40,0.25)] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFC928]/20 to-[#030817] border-2 border-[#FFC928] flex items-center justify-center text-[#FFC928] shadow-[0_0_15px_rgba(255,201,40,0.5)]">
            <Crown className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-chakra font-black text-2xl text-white tracking-wider">
                {isAr ? 'لوحة تحكم إدارة سيرفر WPS3' : 'WPS3 SERVER ADMIN PORTAL'}
              </h1>
              <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                AUTHORIZED
              </span>
            </div>
            <div className="text-xs text-[#A6C5FF] mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[#00E5FF]">WPS3 SERVER</span>
              <span className="text-[#FFC928] font-bold">•</span>
              <span className="text-[#FFC928] font-tajawal font-bold">{isAr ? 'الوصول المباشر لمالك السيرفر' : 'Server Owner Admin Access'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg bg-[#008CFF]/20 hover:bg-[#008CFF]/40 border border-[#008CFF] text-xs font-chakra font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download CSV Dossier"
          >
            <Download className="w-4 h-4 text-[#00E5FF]" />
            <span>{isAr ? 'تصدير CSV' : 'EXPORT CSV'}</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-[#050C1F] hover:bg-[#008CFF]/20 border border-[#008CFF]/40 text-[#A6C5FF] hover:text-white transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#008CFF]' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/50 text-xs font-chakra font-bold text-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? 'تسجيل الخروج' : 'LOGOUT'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="voxel-card rounded-xl p-4 border border-[#008CFF]/30">
          <span className="text-xs font-chakra text-[#A6C5FF] uppercase tracking-wider">
            {isAr ? 'إجمالي الطلبات' : 'TOTAL APPLICATIONS'}
          </span>
          <div className="font-chakra font-black text-3xl text-white mt-1">
            {stats.total}
          </div>
        </div>

        <div className="voxel-card rounded-xl p-4 border border-[#FFC928]/40 shadow-[0_0_15px_rgba(255,201,40,0.15)]">
          <span className="text-xs font-chakra text-[#FFC928] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? 'قيد المراجعة' : 'PENDING REVIEW'}</span>
          </span>
          <div className="font-chakra font-black text-3xl text-[#FFC928] mt-1">
            {stats.pending}
          </div>
        </div>

        <div className="voxel-card rounded-xl p-4 border border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <span className="text-xs font-chakra text-green-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'المقبولين' : 'APPROVED'}</span>
          </span>
          <div className="font-chakra font-black text-3xl text-green-400 mt-1">
            {stats.approved}
          </div>
        </div>

        <div className="voxel-card rounded-xl p-4 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <span className="text-xs font-chakra text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'المرفوضين' : 'REJECTED'}</span>
          </span>
          <div className="font-chakra font-black text-3xl text-red-400 mt-1">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="voxel-card rounded-xl p-4 border border-[#008CFF]/30 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#A6C5FF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث بالاسم، PSN، TikTok أو البلد...' : 'Search by player, PSN, TikTok, country...'}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#050C1F] text-white border border-[#008CFF]/30 focus:border-[#008CFF] text-xs font-chakra focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#008CFF]/20 hover:bg-[#008CFF]/40 border border-[#008CFF] text-xs font-chakra font-bold text-white cursor-pointer"
          >
            {isAr ? 'بحث' : 'GO'}
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'all', ar: 'الكل', en: 'ALL' },
            { key: 'pending', ar: 'قيد الانتظار', en: 'PENDING' },
            { key: 'approved', ar: 'المقبولين', en: 'APPROVED' },
            { key: 'rejected', ar: 'المرفوضين', en: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-[#008CFF] text-white shadow-[0_0_12px_#008CFF]'
                  : 'bg-[#050C1F] text-[#A6C5FF] hover:bg-[#008CFF]/15 border border-[#008CFF]/20'
              }`}
            >
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List Table / Cards */}
      <div className="voxel-card rounded-2xl border border-[#008CFF]/30 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#008CFF] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-chakra text-[#A6C5FF] uppercase">
              {isAr ? 'جاري تحميل الطلبات من قاعدة البيانات...' : 'Loading applications from database...'}
            </span>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <UserCheck className="w-12 h-12 text-[#A6C5FF]/40 mx-auto mb-3" />
            <h3 className="font-chakra font-bold text-lg text-white">
              {isAr ? 'لا توجد طلبات تطابق هذا البحث' : 'No applications found'}
            </h3>
            <p className="text-xs text-[#9BB3DA] mt-1 font-tajawal">
              {isAr ? 'جرب تغيير خيارات التصفية أو كلمة البحث' : 'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-[#050C1F] border-b border-[#008CFF]/20 text-[#A6C5FF] font-chakra uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-start font-bold">ID</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'اللاعب' : 'PLAYER'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">PSN ID</th>
                  <th className="py-3.5 px-4 text-start font-bold">TIKTOK</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'البلد / العمر' : 'LOCATION / AGE'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'نمط اللعب' : 'PLAY STYLE'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'الحالة' : 'STATUS'}</th>
                  <th className="py-3.5 px-4 text-end font-bold">{isAr ? 'الإجراءات' : 'ACTIONS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#008CFF]/15 font-mono">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[#008CFF]/5 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedApp(app);
                      setNoteDraft(app.admin_notes || '');
                      setActionSuccess(null);
                      setActionError(null);
                    }}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#00E5FF] font-mono" dir="ltr">{app.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white font-chakra text-sm">
                      {app.player_name}
                    </td>
                    <td className="py-3.5 px-4 text-[#E1EBFF] font-mono" dir="ltr">{app.psn_online_id}</td>
                    <td className="py-3.5 px-4 text-[#FFC928] font-mono font-medium" dir="ltr">{app.tiktok_username}</td>
                    <td className="py-3.5 px-4 text-[#D8E6FF] font-tajawal">
                      {app.country} • {app.age} {isAr ? 'سنة' : 'y'}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[#A6C5FF]">{app.play_style}</td>
                    <td className="py-3.5 px-4">
                      {app.application_status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFC928]/20 border border-[#FFC928]/50 text-[#FFC928] text-[10px] font-chakra font-bold uppercase">
                          <Clock className="w-3 h-3" />
                          <span>PENDING</span>
                        </span>
                      )}
                      {app.application_status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] font-chakra font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>APPROVED</span>
                        </span>
                      )}
                      {app.application_status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-chakra font-bold uppercase">
                          <XCircle className="w-3 h-3" />
                          <span>REJECTED</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-end" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNoteDraft(app.admin_notes || '');
                            setActionSuccess(null);
                            setActionError(null);
                          }}
                          className="p-1.5 rounded bg-[#008CFF]/20 hover:bg-[#008CFF]/40 text-[#00E5FF] transition-all"
                          title="View Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-all"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Applicant Dossier / CV Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="voxel-card rounded-2xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#008CFF] shadow-[0_0_50px_rgba(0,140,255,0.4)] max-h-[92vh] overflow-y-auto">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#008CFF]/30 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#008CFF]">{selectedApp.id}</span>
                  <span className="text-xs text-[#A6C5FF] font-mono">
                    {new Date(selectedApp.created_at).toLocaleString()}
                  </span>
                </div>
                <h2 className="font-chakra font-black text-2xl sm:text-3xl text-white mt-1">
                  {selectedApp.player_name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-[#050C1F] hover:bg-[#008CFF]/20 text-[#A6C5FF] hover:text-white flex items-center justify-center border border-[#008CFF]/40 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification alert */}
            {actionSuccess && (
              <div className="p-3 rounded-lg bg-green-950/60 border border-green-500 text-green-200 text-xs font-tajawal mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500 text-red-200 text-xs font-tajawal mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Applicant CV Information Grid */}
            <div className="space-y-4 text-xs font-tajawal">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PSN Account */}
                <div className="p-3.5 rounded-xl bg-[#050C1F] border border-[#008CFF]/30">
                  <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block mb-1">
                    PLAYSTATION NETWORK (PSN)
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-[#00E5FF] select-all">
                      {selectedApp.psn_online_id}
                    </span>
                    <button
                      onClick={() => copyPsn(selectedApp.psn_online_id)}
                      className="p-1.5 rounded bg-[#008CFF]/20 hover:bg-[#008CFF]/40 text-xs text-white flex items-center gap-1 cursor-pointer"
                      title="Copy PSN ID"
                    >
                      {copiedPsn ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-[#8BB7F0] mt-1">
                    {selectedApp.minecraft_access === 'yes'
                      ? '✅ اللعبة وجهاز PS3 جاهزان'
                      : '⚠️ يحتاج مساعدة في الاتصال بالسيرفر'}
                  </div>
                </div>

                {/* TikTok Account */}
                <div className="p-3.5 rounded-xl bg-[#050C1F] border border-[#008CFF]/30">
                  <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block mb-1">
                    TIKTOK CONTACT
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-[#FFC928] select-all">
                      {selectedApp.tiktok_username}
                    </span>
                    {selectedApp.tiktok_url && (
                      <a
                        href={selectedApp.tiktok_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-[#FFC928]/20 hover:bg-[#FFC928]/40 text-xs text-[#FFC928] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8BB7F0] mt-1">
                    {selectedApp.contact_preference === 'tiktok'
                      ? '📱 يفضل التواصل عبر TikTok'
                      : 'لا يحتاج لتواصل إضافي'}
                  </div>
                </div>

                {/* Location & Age */}
                <div className="p-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/20">
                  <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block">
                    {isAr ? 'البلد والمدينة' : 'COUNTRY / CITY'}
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {selectedApp.country} {selectedApp.city ? `(${selectedApp.city})` : ''}
                  </span>
                  <span className="text-xs text-[#A6C5FF]">
                    {selectedApp.age} {isAr ? 'سنة' : 'years old'} • لغة: {selectedApp.language.toUpperCase()}
                  </span>
                </div>

                {/* Gameplay Style */}
                <div className="p-3 rounded-lg bg-[#050C1F] border border-[#008CFF]/20">
                  <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block">
                    {isAr ? 'نمط وطريقة اللعب' : 'PLAY STYLE / MODE'}
                  </span>
                  <span className="text-sm font-bold text-[#00E5FF] mt-0.5 uppercase block">
                    {selectedApp.play_style}
                  </span>
                  <span className="text-xs text-[#A6C5FF]">
                    الوضع المفضل: {selectedApp.play_mode}
                  </span>
                </div>
              </div>

              {/* Bio & Connection Notes */}
              {selectedApp.additional_info && (
                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block mb-1">
                    {isAr ? 'نبذة ومعلومات إضافية من اللاعب:' : 'Player Bio & Information:'}
                  </span>
                  <p className="text-xs text-[#D8E6FF] leading-relaxed">{selectedApp.additional_info}</p>
                </div>
              )}

              {selectedApp.connection_notes && (
                <div className="p-3 rounded-lg bg-[#030817] border border-[#008CFF]/20">
                  <span className="text-[10px] font-chakra text-[#A6C5FF] uppercase block mb-1">
                    {isAr ? 'ملاحظات الاتصال:' : 'Connection Notes:'}
                  </span>
                  <p className="text-xs text-[#D8E6FF]">{selectedApp.connection_notes}</p>
                </div>
              )}

              {/* Internal Admin Notes Input */}
              <div className="p-3.5 rounded-xl bg-[#050C1F] border border-[#008CFF]/40">
                <label className="block text-[11px] font-chakra font-bold text-[#66C2FF] uppercase tracking-wider mb-1.5">
                  {isAr ? 'ملاحظات الإدارة الداخلية (تظهر للاعب عند الاستعلام):' : 'Internal Staff Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder={isAr ? 'اكتب ملاحظاتك هنا (مثال: تم إرسال طلب الصداقة على PS3 بنجاح)' : 'Add staff notes...'}
                  className="w-full px-3 py-2 rounded-lg bg-[#030817] text-white border border-[#008CFF]/30 focus:border-[#008CFF] text-xs font-tajawal focus:outline-none"
                />
              </div>

              {/* Status Decision Buttons */}
              <div className="pt-3 border-t border-[#008CFF]/30">
                <span className="text-[11px] font-chakra font-bold text-[#A6C5FF] uppercase block mb-2">
                  {isAr ? 'اتخاذ قرار بشأن الطلب:' : 'Application Decision:'}
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-chakra font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'قبول الطلب (Approve)' : 'APPROVE'}</span>
                  </button>

                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-chakra font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isAr ? 'رفض الطلب (Reject)' : 'REJECT'}</span>
                  </button>

                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'pending')}
                    className="py-2.5 px-4 rounded-lg bg-[#050C1F] hover:bg-[#008CFF]/20 border border-[#FFC928] text-[#FFC928] font-chakra font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{isAr ? 'قيد الانتظار' : 'SET PENDING'}</span>
                  </button>

                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.application_status, noteDraft)}
                    className="py-2.5 px-4 rounded-lg bg-[#008CFF]/20 hover:bg-[#008CFF]/40 border border-[#008CFF] text-white font-chakra font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حفظ الملاحظة' : 'SAVE NOTE'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
