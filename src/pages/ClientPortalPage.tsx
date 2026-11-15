import { CheckCircle2, Download, FileText, Lock, LogOut, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import type {
  AuthUser,
  ClientDocument,
  ClientPortalMessage,
  StudyRequest,
  StudyRequestStatus,
} from '../types';
import { getStudyStageIndex } from '../utils/filtering';

const STAGES: { key: StudyRequestStatus; ar: string; en: string }[] = [
  { key: 'received', ar: 'استلام الطلب', en: 'Received' },
  { key: 'market_analysis', ar: 'تحليل السوق', en: 'Market Analysis' },
  { key: 'preparing', ar: 'إعداد الدراسة', en: 'Preparation' },
  { key: 'review', ar: 'المراجعة', en: 'Review' },
  { key: 'delivered', ar: 'التسليم', en: 'Delivered' },
];

export function ClientPortalPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  const [requests, setRequests] = useState<StudyRequest[]>([]);
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientPortalMessage[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    Promise.all([api.listStudyRequests(), api.getClientDocuments(), api.getClientMessages()]).then(
      ([reqs, d, msgs]) => {
        setRequests(reqs);
        setDocs(d);
        setMessages(msgs);
        setDataLoading(false);
      }
    );
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmittingAuth(true);
    try {
      const res =
        mode === 'login'
          ? await api.signIn(email, password, 'client')
          : await api.signUpClient(email, password, fullName);

      if (res.error) {
        setAuthError(res.error);
      } else if (res.user) {
        setUser(res.user);
      }
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleFillDemo = () => {
    setMode('login');
    setEmail('client@expertconsu.com');
    setPassword('ExpertClient2026!');
    setAuthError('');
  };

  const handleLogout = async () => {
    await api.signOut();
    setUser(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const msg = await api.sendClientMessage(newMessage, user.name);
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleDownloadDoc = (doc: ClientDocument) => {
    const content = `EXPERT Economic Consultation\nDocument: ${doc.title_en}\nDate: ${doc.updated_at}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.id}-${doc.title_en.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedId(doc.id);
    window.setTimeout(() => setDownloadedId(null), 2500);
  };

  if (authLoading) {
    return (
      <div className="py-16 max-w-md mx-auto px-4">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-14 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-5">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-[#059669] mb-1">
              {t('بوابة العميل الإلكترونية', 'EXPERT Client Portal')}
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-[#064E3B] mb-2">
              {mode === 'login'
                ? t('تسجيل الدخول لمتابعة دراستك', 'Sign In to Track Your Study')
                : t('إنشاء حساب عميل جديد', 'Create Client Account')}
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              {t(
                'تابع مراحل إعداد دراسة الجدوى، حمّل المستندات، وتواصل مع المستشار المالي.',
                'Monitor study milestones, download deliverables, and message your lead consultant.'
              )}
            </p>

            <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setAuthError('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  mode === 'login' ? 'bg-white text-[#064E3B] shadow-xs' : 'text-slate-600'
                }`}
              >
                {t('تسجيل الدخول', 'Sign In')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAuthError('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  mode === 'signup' ? 'bg-white text-[#064E3B] shadow-xs' : 'text-slate-600'
                }`}
              >
                {t('حساب جديد', 'Register')}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
              {mode === 'signup' && (
                <div>
                  <label htmlFor="portal-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الاسم الكامل', 'Full Name')}
                  </label>
                  <input
                    id="portal-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="portal-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('البريد الإلكتروني', 'Email Address')}
                </label>
                <input
                  id="portal-email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@expertconsu.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label htmlFor="portal-password" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('كلمة المرور', 'Password')}
                </label>
                <input
                  id="portal-password"
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
                disabled={submittingAuth}
                className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                {submittingAuth
                  ? t('جاري التحقق...', 'Signing in...')
                  : mode === 'login'
                  ? t('دخول البوابة', 'Enter Portal')
                  : t('إنشاء الحساب', 'Create Account')}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{t('للمعاينة السريعة:', 'Quick preview:')}</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
              >
                {t('تعبئة حساب عميل تجريبي', 'Fill Demo Client Credentials')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeStudy =
    requests.find((r) => r.email.toLowerCase() === user.email.toLowerCase()) || requests[0];
  const currentStageIndex = activeStudy ? getStudyStageIndex(activeStudy.status) : 0;

  return (
    <div className="py-10 lg:py-14 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#059669]">
              {t('بوابة العميل · حساب موثق', 'Client Portal · Active Workspace')}
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-[#064E3B] mt-1">
              {t(`مرحباً، ${user.name}`, `Welcome, ${user.name}`)}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/request-study"
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-semibold transition-colors"
            >
              {t('طلب دراسة جديدة', 'New Study Request')}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('تسجيل الخروج', 'Sign Out')}</span>
            </button>
          </div>
        </div>

        {/* 5-Stage Progress Card */}
        {dataLoading ? (
          <div className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        ) : activeStudy ? (
          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-semibold text-[#059669] tabular-nums">
                  {activeStudy.id} · {activeStudy.location}
                </span>
                <h2 className="font-heading text-xl font-bold text-slate-900 mt-1">
                  {activeStudy.project_name}
                </h2>
              </div>
              <div className="text-sm font-semibold text-[#064E3B]">
                {t('المرحلة الحالية:', 'Current Stage:')}{' '}
                <span className="text-[#059669]">
                  {t(STAGES[currentStageIndex].ar, STAGES[currentStageIndex].en)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-6">
              {STAGES.map((stage, idx) => {
                const completed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={stage.key}
                    className={`p-4 rounded-2xl border transition-colors ${
                      isCurrent
                        ? 'bg-[#064E3B] text-white border-[#064E3B]'
                        : completed
                        ? 'bg-emerald-50/80 text-[#064E3B] border-emerald-200'
                        : 'bg-[#F8FAFC] text-slate-400 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold tabular-nums">0{idx + 1}</span>
                      {completed && (
                        <CheckCircle2
                          className={`w-4 h-4 ${isCurrent ? 'text-[#D4AF37]' : 'text-[#059669]'}`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="font-heading text-sm font-bold">{t(stage.ar, stage.en)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-600 mb-4">
              {t('لا توجد طلبات دراسات نشطة حالياً.', 'No active feasibility studies yet.')}
            </p>
            <Link
              to="/request-study"
              className="px-5 py-2.5 rounded-xl bg-[#059669] text-white text-sm font-semibold"
            >
              {t('ابدأ دراسة جديدة', 'Start New Study')}
            </Link>
          </div>
        )}

        {/* Documents & Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Documents */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/70 p-6">
            <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
              {t('مستندات ومسودات الدراسة', 'Study Documents & Deliverables')}
            </h2>
            <div className="space-y-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {t(doc.title_ar, doc.title_en)}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {doc.file_type} · {doc.size} · {doc.updated_at}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(doc)}
                    aria-label={t(`تحميل ${doc.title_ar}`, `Download ${doc.title_en}`)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#059669] text-xs font-semibold text-[#064E3B] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {downloadedId === doc.id ? t('تم', 'Saved') : t('تحميل', 'Download')}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
                {t('المراسلات المباشرة مع المستشار', 'Consultant Messages')}
              </h2>
              <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pe-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border text-sm ${
                      m.sender === 'consultant'
                        ? 'bg-emerald-50/70 border-emerald-200/70'
                        : 'bg-[#F8FAFC] border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#064E3B]">
                        {t(m.sender_name_ar, m.sender_name_en)}
                      </span>
                      <span className="text-slate-400 tabular-nums">{m.created_at}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{t(m.text_ar, m.text_en)}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('اكتب استفسارك للمستشار...', 'Write a message to your consultant...')}
                aria-label={t('رسالة جديدة للمستشار', 'New message to consultant')}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{t('إرسال', 'Send')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
