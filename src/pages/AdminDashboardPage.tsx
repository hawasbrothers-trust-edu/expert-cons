import {
  ArrowUpDown,
  CheckCircle2,
  Download,
  ExternalLink,
  ImagePlus,
  LogOut,
  MessageCircle,
  RotateCcw,
  Shield,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PRODUCTION_LINES, PRODUCTION_LINE_TABS } from '../data/catalog';
import { api } from '../lib/api';
import type {
  Appointment,
  AppointmentStatus,
  AuthUser,
  ProductionLineMediaConfig,
  ProductionLineTabKey,
  Review,
  StudyRequest,
  StudyRequestStatus,
} from '../types';
import {
  buildWhatsAppUrl,
  exportRequestsToCsv,
  sortStudyRequests,
  type StudySortKey,
} from '../utils/filtering';

type AdminTab = 'requests' | 'appointments' | 'clients' | 'reviews' | 'production_lines';

function resizeImageToDataUrl(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / Math.max(img.width, 1));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<AdminTab>('requests');
  const [requests, setRequests] = useState<StudyRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<StudySortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [mediaConfig, setMediaConfig] = useState<ProductionLineMediaConfig>(() =>
    api.getProductionLineMedia()
  );
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({});
  const [mediaNotice, setMediaNotice] = useState('');

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u?.role === 'admin') setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    Promise.all([api.listStudyRequests(), api.listAppointments(), api.listReviews()]).then(
      ([reqs, appts, revs]) => {
        setRequests(reqs);
        setAppointments(appts);
        setReviews(revs);
      }
    );
  }, [user]);

  const showMediaFeedback = (msg: string) => {
    setMediaNotice(msg);
    window.setTimeout(() => setMediaNotice(''), 3000);
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
    setEmail('admin@expertconsu.com');
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
  };

  const handleAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await api.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleExportCsv = () => {
    const csv = exportRequestsToCsv(requests);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert-study-requests-${new Date().toISOString().slice(0, 10)}.csv`;
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

  const handleUploadTabImage = async (tabKey: ProductionLineTabKey, file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file, 480);
      const updated = api.saveProductionTabImage(tabKey, dataUrl);
      setMediaConfig(updated);
      showMediaFeedback(t('تم تحديث صورة التبويب بنجاح.', 'Tab thumbnail updated successfully.'));
    } catch {
      showMediaFeedback(t('تعذر قراءة ملف الصورة.', 'Unable to process the selected image.'));
    }
  };

  const handleApplyTabUrl = (tabKey: ProductionLineTabKey) => {
    const draftKey = `tab:${tabKey}`;
    const value = (urlDrafts[draftKey] || '').trim();
    if (!value) return;
    const updated = api.saveProductionTabImage(tabKey, value);
    setMediaConfig(updated);
    setUrlDrafts((prev) => ({ ...prev, [draftKey]: '' }));
    showMediaFeedback(t('تم حفظ رابط صورة التبويب.', 'Tab thumbnail URL saved.'));
  };

  const handleResetTabImage = (tabKey: ProductionLineTabKey) => {
    const updated = api.saveProductionTabImage(tabKey, '');
    setMediaConfig(updated);
    showMediaFeedback(t('تمت استعادة الصورة الافتراضية للتبويب.', 'Tab thumbnail reset to default.'));
  };

  const handleUploadLineImage = async (lineId: string, file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file, 800);
      const updated = api.saveProductionLineImage(lineId, dataUrl);
      setMediaConfig(updated);
      showMediaFeedback(t('تم تحديث صورة خط الإنتاج بنجاح.', 'Production line image updated successfully.'));
    } catch {
      showMediaFeedback(t('تعذر قراءة ملف الصورة.', 'Unable to process the selected image.'));
    }
  };

  const handleApplyLineUrl = (lineId: string) => {
    const draftKey = `item:${lineId}`;
    const value = (urlDrafts[draftKey] || '').trim();
    if (!value) return;
    const updated = api.saveProductionLineImage(lineId, value);
    setMediaConfig(updated);
    setUrlDrafts((prev) => ({ ...prev, [draftKey]: '' }));
    showMediaFeedback(t('تم حفظ رابط صورة خط الإنتاج.', 'Production line image URL saved.'));
  };

  const handleResetLineImage = (lineId: string) => {
    const updated = api.saveProductionLineImage(lineId, '');
    setMediaConfig(updated);
    showMediaFeedback(t('تمت استعادة الصورة الافتراضية لخط الإنتاج.', 'Production line image reset to default.'));
  };

  const handleResetAllMedia = () => {
    const reset = api.resetProductionLineMedia();
    setMediaConfig(reset);
    setUrlDrafts({});
    showMediaFeedback(t('تمت استعادة جميع الصور الافتراضية.', 'All production line thumbnails reset to defaults.'));
  };

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
              {t('لوحة تحكم إدارة EXPERT', 'EXPERT Admin Dashboard')}
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              {t(
                'يرجى تسجيل الدخول بالبريد الإداري المعتمد لإدارة طلبات الدراسات والمواعيد وصور خطوط الإنتاج.',
                'Sign in with an authorized administrator email to manage study requests, bookings, and production line media.'
              )}
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1">
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
                <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 mb-1">
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
                {t('دخول لوحة الإدارة', 'Sign In to Admin')}
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

  const sortedRequests = sortStudyRequests(requests, sortBy, sortDir);

  const clientMap = new Map<string, { name: string; email: string; phone: string; count: number }>();
  requests.forEach((r) => {
    const existing = clientMap.get(r.email);
    clientMap.set(r.email, {
      name: r.name,
      email: r.email,
      phone: r.phone,
      count: (existing?.count || 0) + 1,
    });
  });
  const clientsList = Array.from(clientMap.values());

  const tabs: { id: AdminTab; ar: string; en: string; count: number }[] = [
    { id: 'requests', ar: 'طلبات الدراسات', en: 'Study Requests', count: requests.length },
    { id: 'appointments', ar: 'المواعيد', en: 'Appointments', count: appointments.length },
    { id: 'clients', ar: 'العملاء', en: 'Clients', count: clientsList.length },
    { id: 'reviews', ar: 'التقييمات', en: 'Reviews', count: reviews.length },
    {
      id: 'production_lines',
      ar: 'صور خطوط الإنتاج',
      en: 'Production Lines Media',
      count: PRODUCTION_LINES.length,
    },
  ];

  return (
    <div className="py-10 lg:py-14 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#059669]">
              {t('إدارة العمليات الاستشارية', 'Operations Control')}
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-[#064E3B] mt-1">
              {t('لوحة تحكم EXPERT', 'EXPERT Admin Console')}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-semibold cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>{t('تصدير البيانات CSV', 'Export CSV')}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{t('خروج', 'Sign Out')}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer tabular-nums ${
                tab === item.id
                  ? 'bg-[#064E3B] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              {t(item.ar, item.en)} ({item.count})
            </button>
          ))}
        </div>

        {/* Tab 1: Study Requests */}
        {tab === 'requests' && (
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
                    <th className="py-3.5 px-4 font-semibold">{t('رأس المال والتمويل', 'Capital & Funding')}</th>
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
                    <th className="py-3.5 px-4 font-semibold">{t('إجراء سريع', 'Quick Action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedRequests.map((req) => (
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
                        <p className="font-semibold text-slate-800 tabular-nums">{req.capital_range}</p>
                        <p className="text-[#059669]">
                          {req.needs_funding ? t('يحتاج تمويل بنكي', 'Needs Bank Funding') : t('ذاتي', 'Self-Funded')}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          aria-label={t(`تغيير حالة ${req.project_name}`, `Change status for ${req.project_name}`)}
                          value={req.status}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value as StudyRequestStatus)
                          }
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669]"
                        >
                          <option value="received">{t('استلام الطلب', 'Received')}</option>
                          <option value="market_analysis">{t('تحليل السوق', 'Market Analysis')}</option>
                          <option value="preparing">{t('إعداد الدراسة', 'Preparing')}</option>
                          <option value="review">{t('المراجعة', 'Review')}</option>
                          <option value="delivered">{t('التسليم', 'Delivered')}</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={buildWhatsAppUrl(
                            req.phone,
                            `مرحباً ${req.name}، بخصوص دراسة مشروع (${req.project_name}) من شركة EXPERT:`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#059669] text-[#064E3B] hover:text-white text-xs font-semibold transition-colors"
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

        {/* Tab 2: Appointments */}
        {tab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">{t('العميل', 'Client')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('الموضوع', 'Topic')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('الموعد والنوع', 'Schedule')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('الحالة', 'Status')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('تواصل', 'Contact')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
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
                          aria-label={t(`حالة موعد ${apt.name}`, `Appointment status for ${apt.name}`)}
                          value={apt.status}
                          onChange={(e) =>
                            handleAppointmentStatus(apt.id, e.target.value as AppointmentStatus)
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
                            `مرحباً ${apt.name}، نؤكد موعد استشارتك في ${apt.date} الساعة ${apt.time} مع EXPERT.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#059669] text-[#064E3B] hover:text-white text-xs font-semibold transition-colors"
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

        {/* Tab 3: Clients */}
        {tab === 'clients' && (
          <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">{t('اسم العميل', 'Client Name')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('البريد الإلكتروني', 'Email')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('الهاتف', 'Phone')}</th>
                    <th className="py-3.5 px-4 font-semibold">{t('عدد الدراسات', 'Studies')}</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {tab === 'reviews' && (
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

        {/* Tab 5: Production Lines Media Manager */}
        {tab === 'production_lines' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#064E3B]">
                  {t('إدارة صور تبويبات وبلوكات خطوط الإنتاج', 'Production Lines Tabs & Cards Media')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t(
                    'يمكنك رفع صورة جديدة أو إدخال رابط صورة لكل تبويب أو خط إنتاج، أو استعادة الصور الواقعية الافتراضية.',
                    'Upload a new photo or paste an image URL for any category tab or production line block.'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  to="/production-lines"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('معاينة الصفحة', 'Preview Page')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleResetAllMedia}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('استعادة الكل للافتراضي', 'Reset All Defaults')}</span>
                </button>
              </div>
            </div>

            {mediaNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064E3B] text-xs sm:text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />
                <span>{mediaNotice}</span>
              </div>
            )}

            {/* Category Tabs Thumbnails */}
            <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-900">
                {t('صور تبويبات خطوط الإنتاج (4 تبويبات)', 'Category Tab Thumbnails (4 Tabs)')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRODUCTION_LINE_TABS.map((cat) => {
                  const customImg = mediaConfig.tabs[cat.id];
                  const activeImg = customImg || cat.image_url;
                  const draftKey = `tab:${cat.id}`;
                  return (
                    <div
                      key={cat.id}
                      className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="font-heading text-sm font-bold text-slate-900">
                            {t(cat.ar, cat.en)}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              customImg
                                ? 'bg-emerald-100 text-[#064E3B]'
                                : 'bg-slate-200/70 text-slate-600'
                            }`}
                          >
                            {customImg ? t('مخصصة', 'Custom') : t('افتراضية', 'Default')}
                          </span>
                        </div>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-3">
                          <img
                            src={activeImg}
                            alt={t(cat.ar, cat.en)}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#064E3B] text-white text-xs font-semibold cursor-pointer transition-colors">
                            <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t('رفع صورة', 'Upload')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                handleUploadTabImage(cat.id, e.target.files?.[0]);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          {customImg && (
                            <button
                              type="button"
                              onClick={() => handleResetTabImage(cat.id)}
                              title={t('استعادة الافتراضي', 'Reset Default')}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            dir="ltr"
                            value={urlDrafts[draftKey] || ''}
                            onChange={(e) =>
                              setUrlDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
                            }
                            placeholder={t('رابط صورة https://...', 'Image URL https://...')}
                            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#059669]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyTabUrl(cat.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer shrink-0"
                          >
                            {t('حفظ', 'Save')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Production Line Blocks Thumbnails */}
            <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-900">
                {t('صور بلوكات خطوط الإنتاج (9 خطوط)', 'Production Line Card Thumbnails (9 Lines)')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PRODUCTION_LINES.map((line) => {
                  const customImg = mediaConfig.items[line.id];
                  const activeImg = customImg || line.image_url;
                  const draftKey = `item:${line.id}`;
                  return (
                    <div
                      key={line.id}
                      className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div>
                            <p className="font-heading text-sm font-bold text-slate-900 leading-snug">
                              {t(line.title_ar, line.title_en)}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                              {t(line.capacity_ar, line.capacity_en)}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                              customImg
                                ? 'bg-emerald-100 text-[#064E3B]'
                                : 'bg-slate-200/70 text-slate-600'
                            }`}
                          >
                            {customImg ? t('مخصصة', 'Custom') : t('افتراضية', 'Default')}
                          </span>
                        </div>

                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-3">
                          <img
                            src={activeImg}
                            alt={t(line.title_ar, line.title_en)}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#059669] hover:bg-[#064E3B] text-white text-xs font-semibold cursor-pointer transition-colors">
                            <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t('تغيير الصورة من الجهاز', 'Upload New Photo')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                handleUploadLineImage(line.id, e.target.files?.[0]);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          {customImg && (
                            <button
                              type="button"
                              onClick={() => handleResetLineImage(line.id)}
                              title={t('استعادة الصورة الافتراضية', 'Reset to Default')}
                              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            dir="ltr"
                            value={urlDrafts[draftKey] || ''}
                            onChange={(e) =>
                              setUrlDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
                            }
                            placeholder={t('أو أدخل رابط صورة https://...', 'Or paste image URL https://...')}
                            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#059669]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyLineUrl(line.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer shrink-0"
                          >
                            {t('حفظ', 'Save')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
