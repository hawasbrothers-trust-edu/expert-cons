import {
  ArrowUpDown,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Loader2,
  LogOut,
  MessageCircle,
  Newspaper,
  Save,
  Search,
  Shield,
  UserCog,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { AdminBlogPanel } from '../components/admin/AdminBlogPanel';
import { AdminNotificationsPanel } from '../components/admin/AdminNotificationsPanel';
import { AdminProductionPanel } from '../components/admin/AdminProductionPanel';
import { AdminProfilePanel } from '../components/admin/AdminProfilePanel';
import { AdminSiteCmsPanel } from '../components/admin/AdminSiteCmsPanel';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCms } from '../context/SiteCmsContext';
import { api } from '../lib/api';
import type {
  AdminProfileConfig,
  Appointment,
  AppointmentStatus,
  AuthUser,
  BlogPost,
  NotificationAlertLog,
  Review,
  SiteCmsConfig,
  StudyRequest,
  StudyRequestStatus,
} from '../types';
import {
  buildWhatsAppUrl,
  exportAppointmentsToCsv,
  exportRequestsToCsv,
  filterAppointments,
  filterStudyRequests,
  sortStudyRequests,
  type StudySortKey,
} from '../utils/filtering';

type AdminTab =
  | 'requests'
  | 'appointments'
  | 'blog'
  | 'cms'
  | 'production'
  | 'notifications'
  | 'profile';

type OperationsSubTab = 'bookings' | 'clients' | 'reviews';

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const { cms, refreshCms } = useSiteCms();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<AdminTab>('requests');
  const [opsSubTab, setOpsSubTab] = useState<OperationsSubTab>('bookings');

  // Operations Data
  const [requests, setRequests] = useState<StudyRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Request filtering & sorting
  const [requestQuery, setRequestQuery] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<StudyRequestStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<StudySortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Appointment filtering & sorting
  const [apptQuery, setApptQuery] = useState('');
  const [apptStatusFilter, setApptStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [apptSortDir, setApptSortDir] = useState<'asc' | 'desc'>('desc');

  // CMS, Blog, Notifications, Admin Profile
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [notifLogs, setNotifLogs] = useState<NotificationAlertLog[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfileConfig>(() =>
    api.getAdminProfileSync()
  );
  const [cmsDraft, setCmsDraft] = useState<SiteCmsConfig>(cms);
  const [isDirty, setIsDirty] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u?.role === 'admin') setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    Promise.all([
      api.listStudyRequests(),
      api.listAppointments(),
      api.listReviews(),
      api.listBlogPosts(),
      api.listNotificationLogs(),
      api.getAdminProfile(),
      api.getSiteCmsConfig(),
    ]).then(([reqs, appts, revs, blogPosts, logs, prof, siteConfig]) => {
      setRequests(reqs);
      setAppointments(appts);
      setReviews(revs);
      setPosts(blogPosts);
      setNotifLogs(logs);
      setAdminProfile(prof);
      setCmsDraft(siteConfig);
      setIsDirty(false);
    });
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCmsDraftChange = (updated: SiteCmsConfig) => {
    setCmsDraft(updated);
    setIsDirty(true);
  };

  const handleSaveAllChanges = async () => {
    setSavingAll(true);
    try {
      const saved = await api.saveSiteCmsConfig(cmsDraft);
      setCmsDraft(saved);
      await refreshCms();
      setIsDirty(false);
      showToast(
        t(
          'تم حفظ كافة التغييرات وتحديث الموقع المباشر بنجاح.',
          'All CMS changes saved and published to the live site.'
        )
      );
    } finally {
      setSavingAll(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await api.signIn(email, password, 'admin');
    if (res.error) {
      setAuthError(res.error);
    } else if (res.user) {
      setUser(res.user);
    }
  };

  const handleFillAdminDemo = () => {
    setEmail(adminProfile.admin_email || 'admin@expertconsu.com');
    setPassword('ExpertAdmin2026!');
    setAuthError('');
  };

  const handleLogout = async () => {
    await api.signOut();
    setUser(null);
  };

  const handleStatusChange = async (id: string, status: StudyRequestStatus) => {
    await api.updateStudyRequestStatus(id, status);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(t('تم تحديث حالة طلب الدراسة.', 'Study request status updated.'));
  };

  const handleAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await api.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(t('تم تحديث حالة الموعد.', 'Appointment status updated.'));
  };

  const handleExportRequestsCsv = () => {
    const csv = exportRequestsToCsv(filteredSortedRequests);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert-study-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAppointmentsCsv = () => {
    const csv = exportAppointmentsToCsv(filteredSortedAppointments);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert-appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key: StudySortKey) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const filteredSortedRequests = useMemo(() => {
    const filtered = filterStudyRequests(requests, requestQuery, requestStatusFilter);
    return sortStudyRequests(filtered, sortBy, sortDir);
  }, [requests, requestQuery, requestStatusFilter, sortBy, sortDir]);

  const filteredSortedAppointments = useMemo(() => {
    const filtered = filterAppointments(appointments, apptQuery, apptStatusFilter);
    const factor = apptSortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const aTime = new Date(`${a.date} ${a.time}`).getTime() || new Date(a.created_at).getTime();
      const bTime = new Date(`${b.date} ${b.time}`).getTime() || new Date(b.created_at).getTime();
      return (aTime - bTime) * factor;
    });
  }, [appointments, apptQuery, apptStatusFilter, apptSortDir]);

  const clientsList = useMemo(() => {
    const clientMap = new Map<
      string,
      { name: string; email: string; phone: string; count: number }
    >();
    requests.forEach((r) => {
      const existing = clientMap.get(r.email);
      clientMap.set(r.email, {
        name: r.name,
        email: r.email,
        phone: r.phone,
        count: (existing?.count || 0) + 1,
      });
    });
    return Array.from(clientMap.values());
  }, [requests]);

  if (authLoading) {
    return (
      <div className="py-16 max-w-md mx-auto px-4">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="py-14 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-[#D4AF37] flex items-center justify-center mb-5">
              <Shield className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-[#059669] mb-1">
              {t('منطقة محمية للمسؤولين فقط', 'Protected Admin Route')}
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-[#064E3B] mb-2">
              {t('مركز عمليات وإدارة EXPERT', 'EXPERT Operations & CMS Center')}
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              {t(
                'يرجى تسجيل الدخول بالبريد الإداري المعتمد لإدارة طلبات الدراسات والمواعيد والمدونة ومحتوى الموقع بالكامل.',
                'Sign in with an authorized administrator account to manage study requests, bookings, blog articles, and full site content.'
              )}
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {t('البريد الإداري', 'Admin Email')}
                </label>
                <input
                  id="admin-email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@expertconsu.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {t('كلمة المرور', 'Password')}
                </label>
                <input
                  id="admin-password"
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                {t('دخول مركز الإدارة', 'Sign In to Admin Center')}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{t('بيانات اختبار الإدارة:', 'Admin test access:')}</span>
              <button
                type="button"
                onClick={handleFillAdminDemo}
                className="font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
              >
                {t('تعبئة بيانات المسؤول', 'Fill Admin Credentials')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: {
    id: AdminTab;
    ar: string;
    en: string;
    count?: number;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'requests', ar: 'طلبات الدراسات', en: 'Study Requests', count: requests.length, icon: FileText },
    { id: 'appointments', ar: 'المواعيد والعملاء', en: 'Bookings & Clients', count: appointments.length, icon: Calendar },
    { id: 'blog', ar: 'المدونة والمقالات', en: 'Blog & Articles', count: posts.length, icon: Newspaper },
    { id: 'cms', ar: 'نصوص ومحتوى الموقع', en: 'Site Content CMS', icon: Layers },
    { id: 'production', ar: 'خطوط الإنتاج والصور', en: 'Production & Media', count: cmsDraft.production_lines.length, icon: Briefcase },
    { id: 'notifications', ar: 'البريد والإشعارات', en: 'Email & Alerts', icon: Bell },
    { id: 'profile', ar: 'حساب المدير والأمان', en: 'Admin & Security', icon: UserCog },
  ];

  const requestStatusBadge = (status: StudyRequestStatus) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-50 text-[#064E3B] border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'in_progress':
      case 'preparing':
      case 'review':
      case 'market_analysis':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="py-8 lg:py-12 bg-[#F8FAFC] min-h-screen">
      {/* Global Success Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#064E3B] text-white text-xs sm:text-sm font-semibold shadow-xl border border-emerald-400/30">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Floating Sticky Operations & Save All Bar */}
        <div className="sticky top-[74px] z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-200/80 shadow-md px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#059669] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-extrabold text-[#064E3B]">
                  {t('مركز عمليات وإدارة محتوى EXPERT', 'EXPERT CMS & Operations Center')}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                    isDirty
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-[#059669] border border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isDirty ? 'bg-amber-500 animate-pulse' : 'bg-[#059669]'
                    }`}
                  />
                  {isDirty
                    ? t('تعديلات غير محفوظة', 'Unsaved CMS Changes')
                    : t('جميع التغييرات منشورة', 'Live Site Synced')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  `مرحباً ${adminProfile.display_name} · ${adminProfile.admin_email}`,
                  `Signed in as ${adminProfile.display_name} · ${adminProfile.admin_email}`
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSaveAllChanges}
              disabled={savingAll}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                isDirty
                  ? 'bg-[#059669] hover:bg-[#064E3B] text-white ring-2 ring-emerald-300'
                  : 'bg-[#064E3B] hover:bg-[#059669] text-white'
              } disabled:opacity-70`}
            >
              {savingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              <span>
                {savingAll
                  ? t('جاري حفظ التغييرات...', 'Saving All Changes...')
                  : t('حفظ كافة التغييرات', 'Save All Changes')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{t('خروج', 'Sign Out')}</span>
            </button>
          </div>
        </div>

        {/* Executive Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">
              {t('إجمالي طلبات الدراسات', 'Study Requests')}
            </p>
            <p className="font-heading text-2xl font-extrabold text-[#064E3B] mt-1 tabular-nums">
              {requests.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">
              {t('حجوزات الاستشارات', 'Consultation Bookings')}
            </p>
            <p className="font-heading text-2xl font-extrabold text-[#059669] mt-1 tabular-nums">
              {appointments.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">
              {t('المقالات المنشورة', 'Published Articles')}
            </p>
            <p className="font-heading text-2xl font-extrabold text-[#064E3B] mt-1 tabular-nums">
              {posts.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5">
            <p className="text-xs font-semibold text-slate-500">
              {t('القطاعات والخدمات المفعّلة', 'Active Sectors & Services')}
            </p>
            <p className="font-heading text-2xl font-extrabold text-[#059669] mt-1 tabular-nums">
              {cmsDraft.sectors.length} / {cmsDraft.services.length}
            </p>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer tabular-nums ${
                  active
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(item.ar, item.en)}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                      active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Study Requests */}
        {tab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search
                    className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={requestQuery}
                    onChange={(e) => setRequestQuery(e.target.value)}
                    placeholder={t(
                      'ابحث باسم المشروع، العميل، الهاتف أو القطاع...',
                      'Search by project name, applicant, phone, or sector...'
                    )}
                    className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <select
                  aria-label={t('تصفية حسب الحالة', 'Filter by status')}
                  value={requestStatusFilter}
                  onChange={(e) =>
                    setRequestStatusFilter(e.target.value as StudyRequestStatus | 'all')
                  }
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#059669]"
                >
                  <option value="all">{t('جميع الحالات', 'All Statuses')}</option>
                  <option value="received">{t('تم الاستلام (Received)', 'Received')}</option>
                  <option value="in_progress">{t('قيد التنفيذ (In Progress)', 'In Progress')}</option>
                  <option value="market_analysis">{t('تحليل السوق', 'Market Analysis')}</option>
                  <option value="preparing">{t('إعداد الدراسة', 'Preparing')}</option>
                  <option value="review">{t('المراجعة النهائية', 'Review')}</option>
                  <option value="completed">{t('مكتمل (Completed)', 'Completed')}</option>
                  <option value="delivered">{t('تم التسليم (Delivered)', 'Delivered')}</option>
                  <option value="rejected">{t('مرفوض (Rejected)', 'Rejected')}</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleExportRequestsCsv}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold cursor-pointer shrink-0 transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t('تصدير Excel / CSV', 'Export Excel / CSV')}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-start">
                  <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => toggleSort('project_name')}
                          className="inline-flex items-center gap-1 cursor-pointer hover:text-[#064E3B]"
                        >
                          <span>{t('المشروع والقطاع', 'Project & Sector')}</span>
                          <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">{t('مقدم الطلب', 'Applicant')}</th>
                      <th className="py-3.5 px-4 font-semibold">
                        {t('رأس المال والتمويل', 'Capital & Funding')}
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => toggleSort('created_at')}
                          className="inline-flex items-center gap-1 cursor-pointer hover:text-[#064E3B]"
                        >
                          <span>{t('التاريخ', 'Date')}</span>
                          <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => toggleSort('status')}
                          className="inline-flex items-center gap-1 cursor-pointer hover:text-[#064E3B]"
                        >
                          <span>{t('حالة الدراسة', 'Status')}</span>
                          <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">{t('تواصل واتساب', 'WhatsApp')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSortedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{req.project_name}</p>
                          <p className="text-xs text-slate-500 tabular-nums">
                            {req.id} · {req.type} · {req.sector}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-900">{req.name}</p>
                          <p className="text-xs text-slate-500 tabular-nums" dir="ltr">
                            {req.phone}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <p className="font-semibold text-slate-800 tabular-nums">
                            {req.capital_range}
                          </p>
                          <p className="text-[#059669]">
                            {req.needs_funding
                              ? t('يحتاج تمويل بنكي', 'Needs Bank Funding')
                              : t('تمويل ذاتي', 'Self-Funded')}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 tabular-nums">
                          {req.created_at.slice(0, 10)}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            aria-label={t(
                              `تغيير حالة ${req.project_name}`,
                              `Change status for ${req.project_name}`
                            )}
                            value={req.status}
                            onChange={(e) =>
                              handleStatusChange(req.id, e.target.value as StudyRequestStatus)
                            }
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:border-[#059669] ${requestStatusBadge(
                              req.status
                            )}`}
                          >
                            <option value="received">{t('استلام الطلب', 'Received')}</option>
                            <option value="in_progress">{t('قيد التنفيذ', 'In Progress')}</option>
                            <option value="market_analysis">{t('تحليل السوق', 'Market Analysis')}</option>
                            <option value="preparing">{t('إعداد الدراسة', 'Preparing')}</option>
                            <option value="review">{t('المراجعة', 'Review')}</option>
                            <option value="completed">{t('مكتمل', 'Completed')}</option>
                            <option value="delivered">{t('تم التسليم', 'Delivered')}</option>
                            <option value="rejected">{t('مرفوض', 'Rejected')}</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={buildWhatsAppUrl(
                              req.phone,
                              `مرحباً أ/ ${req.name}، معك فريق الاستشارات في شركة EXPERT بخصوص طلب دراسة الجدوى لمشروع (${req.project_name}) رقم (${req.id}). يسعدنا التواصل معك لاستكمال التفاصيل.`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#059669] text-[#064E3B] hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
                          >
                            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t('واتساب مباشر', 'Direct WhatsApp')}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                    {filteredSortedRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                          {t('لا توجد طلبات مطابقة لنتائج البحث.', 'No matching study requests found.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Appointments, Clients & Reviews */}
        {tab === 'appointments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpsSubTab('bookings')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    opsSubTab === 'bookings'
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#F8FAFC] text-slate-700 border border-slate-200'
                  }`}
                >
                  {t('مواعيد الاستشارات', 'Consultation Bookings')} ({appointments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOpsSubTab('clients')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    opsSubTab === 'clients'
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#F8FAFC] text-slate-700 border border-slate-200'
                  }`}
                >
                  {t('دليل العملاء', 'Clients Directory')} ({clientsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOpsSubTab('reviews')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    opsSubTab === 'reviews'
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#F8FAFC] text-slate-700 border border-slate-200'
                  }`}
                >
                  {t('تقييمات العملاء', 'Client Reviews')} ({reviews.length})
                </button>
              </div>

              {opsSubTab === 'bookings' && (
                <button
                  type="button"
                  onClick={handleExportAppointmentsCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold cursor-pointer"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t('تصدير المواعيد CSV', 'Export Bookings CSV')}</span>
                </button>
              )}
            </div>

            {opsSubTab === 'bookings' && (
              <>
                <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={apptQuery}
                      onChange={(e) => setApptQuery(e.target.value)}
                      placeholder={t(
                        'ابحث باسم العميل، الموضوع، أو رقم الهاتف...',
                        'Search by client name, topic, or phone...'
                      )}
                      className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <select
                    aria-label={t('تصفية المواعيد', 'Filter appointments')}
                    value={apptStatusFilter}
                    onChange={(e) =>
                      setApptStatusFilter(e.target.value as AppointmentStatus | 'all')
                    }
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <option value="all">{t('كل الحالات', 'All Statuses')}</option>
                    <option value="pending">{t('قيد الانتظار', 'Pending')}</option>
                    <option value="confirmed">{t('مؤكد', 'Confirmed')}</option>
                    <option value="completed">{t('مكتمل', 'Completed')}</option>
                    <option value="cancelled">{t('ملغي', 'Cancelled')}</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setApptSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('ترتيب بالتاريخ', 'Sort by Date')}</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                      <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">{t('العميل', 'Client')}</th>
                          <th className="py-3.5 px-4 font-semibold">{t('الموضوع', 'Topic')}</th>
                          <th className="py-3.5 px-4 font-semibold">{t('الموعد والنوع', 'Schedule')}</th>
                          <th className="py-3.5 px-4 font-semibold">{t('الحالة', 'Status')}</th>
                          <th className="py-3.5 px-4 font-semibold">{t('تواصل واتساب', 'WhatsApp')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSortedAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-slate-50/70">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{apt.name}</p>
                              <p className="text-xs text-slate-500 tabular-nums" dir="ltr">
                                {apt.phone}
                              </p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">{apt.topic}</td>
                            <td className="py-3.5 px-4 text-xs tabular-nums">
                              <p className="font-semibold text-slate-900">
                                {apt.date} · {apt.time}
                              </p>
                              <p className="text-slate-500">
                                {apt.duration} min · {apt.type}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                aria-label={t(
                                  `حالة موعد ${apt.name}`,
                                  `Appointment status for ${apt.name}`
                                )}
                                value={apt.status}
                                onChange={(e) =>
                                  handleAppointmentStatus(
                                    apt.id,
                                    e.target.value as AppointmentStatus
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                              >
                                <option value="pending">{t('قيد الانتظار', 'Pending')}</option>
                                <option value="confirmed">{t('مؤكد', 'Confirmed')}</option>
                                <option value="completed">{t('مكتمل', 'Completed')}</option>
                                <option value="cancelled">{t('ملغي', 'Cancelled')}</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4">
                              <a
                                href={buildWhatsAppUrl(
                                  apt.phone,
                                  `مرحباً أ/ ${apt.name}، نؤكد موعد استشارتك الاقتصادية (${apt.topic}) بتاريخ ${apt.date} الساعة ${apt.time} مع شركة EXPERT.`
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#059669] text-[#064E3B] hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
                              >
                                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{t('واتساب مباشر', 'Direct WhatsApp')}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                        {filteredSortedAppointments.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-10 text-center text-sm text-slate-500">
                              {t('لا توجد مواعيد مطابقة للبحث.', 'No matching appointments found.')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {opsSubTab === 'clients' && (
              <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">{t('اسم العميل', 'Client Name')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('البريد الإلكتروني', 'Email')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('الهاتف', 'Phone')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('عدد الدراسات', 'Studies')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('تواصل', 'Contact')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientsList.map((c) => (
                        <tr key={c.email} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                          <td className="py-3.5 px-4 text-slate-600">{c.email}</td>
                          <td className="py-3.5 px-4 text-slate-600 tabular-nums" dir="ltr">
                            {c.phone}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#059669] tabular-nums">
                            {c.count}
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={buildWhatsAppUrl(
                                c.phone,
                                `مرحباً أ/ ${c.name}، يسعدنا تواصلكم المستمر مع شركة EXPERT للاستشارات الاقتصادية.`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#059669] text-[#064E3B] hover:text-white text-xs font-semibold"
                            >
                              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{t('واتساب', 'WhatsApp')}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {opsSubTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">{t('العميل', 'Client')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('المشروع', 'Project')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('التقييم', 'Rating')}</th>
                        <th className="py-3.5 px-4 font-semibold">{t('التعليق', 'Feedback')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{rev.client_name}</td>
                          <td className="py-3.5 px-4 text-slate-600 text-xs">{rev.project_type}</td>
                          <td className="py-3.5 px-4 font-bold text-[#D4AF37] tabular-nums">
                            {rev.rating} / 5
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 max-w-md">{rev.review_text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Full Blog & Articles CMS */}
        {tab === 'blog' && (
          <AdminBlogPanel posts={posts} onPostsChange={setPosts} onNotify={showToast} />
        )}

        {/* TAB 4: Comprehensive Site Texts, Metrics, Sectors, Services & About/Contact CMS */}
        {tab === 'cms' && (
          <AdminSiteCmsPanel cmsDraft={cmsDraft} onChange={handleCmsDraftChange} />
        )}

        {/* TAB 5: Production Lines Details & Media */}
        {tab === 'production' && (
          <AdminProductionPanel
            cmsDraft={cmsDraft}
            onChange={handleCmsDraftChange}
            onNotify={showToast}
          />
        )}

        {/* TAB 6: Email & Instant Notification Settings */}
        {tab === 'notifications' && (
          <AdminNotificationsPanel
            cmsDraft={cmsDraft}
            onChange={handleCmsDraftChange}
            logs={notifLogs}
            onLogsChange={setNotifLogs}
            onNotify={showToast}
          />
        )}

        {/* TAB 7: Admin Profile & Security */}
        {tab === 'profile' && (
          <AdminProfilePanel
            profile={adminProfile}
            onProfileChange={setAdminProfile}
            onNotify={showToast}
          />
        )}
      </div>
    </div>
  );
}
