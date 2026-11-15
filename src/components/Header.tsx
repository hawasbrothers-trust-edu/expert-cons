import { ChevronDown, Lock, LogIn, LogOut, Mail, Menu, Phone, Shield, UserCheck, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCms } from '../context/SiteCmsContext';
import { api } from '../lib/api';
import type { AuthUser } from '../types';
import { BrandLogo } from './BrandLogo';

export function Header() {
  const { lang, setLanguage, t } = useLanguage();
  const { cms } = useSiteCms();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const refreshUser = () => {
      api.getCurrentUser().then((u) => setUser(u));
    };
    refreshUser();
    window.addEventListener('expert:auth-changed', refreshUser);
    return () => window.removeEventListener('expert:auth-changed', refreshUser);
  }, [location.pathname]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const primaryLinks = [
    { to: '/', ar: 'الرئيسية', en: 'Home' },
    { to: '/feasibility-studies', ar: 'دراسات الجدوى', en: 'Feasibility' },
    { to: '/request-study', ar: 'معالج طلب الدراسة', en: 'Study Wizard' },
    { to: '/production-lines', ar: 'خطوط الإنتاج', en: 'Production' },
    { to: '/funding-entities', ar: 'جهات التمويل', en: 'Funding' },
    { to: '/services', ar: 'خدماتنا', en: 'Services' },
  ];

  const secondaryLinks = [
    { to: '/reviews', ar: 'آراء العملاء', en: 'Client Reviews' },
    { to: '/blog', ar: 'المدونة الاقتصادية', en: 'Insights Blog' },
    { to: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
    { to: '/contact', ar: 'اتصل بنا', en: 'Contact Us' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const openLoginModal = () => {
    setAuthError('');
    setLoginModalOpen(true);
  };

  const handleFillDemo = () => {
    setAuthError('');
    if (loginRole === 'admin') {
      setEmail('admin@expertconsu.com');
      setPassword('ExpertAdmin2026!');
    } else {
      setEmail('client@expertconsu.com');
      setPassword('ExpertClient2026!');
    }
  };

  const handleModalSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    try {
      const res = await api.signIn(email, password, loginRole);
      if (res.error) {
        setAuthError(res.error);
      } else if (res.user) {
        setUser(res.user);
        setLoginModalOpen(false);
        setEmail('');
        setPassword('');
        navigate(res.user.role === 'admin' ? '/admin' : '/portal');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalSignOut = async () => {
    await api.signOut();
    setUser(null);
    setLoginModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/70">
        <div className="bg-[#064E3B] text-emerald-100 text-[11px] border-b border-emerald-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <a
                href={`mailto:${cms.notifications.public_contact_email}`}
                className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors truncate"
              >
                <Mail className="w-3 h-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span dir="ltr">{cms.notifications.public_contact_email}</span>
              </a>
              <a
                href={`tel:${cms.about_contact.phone_primary}`}
                className="hidden sm:inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors tabular-nums"
              >
                <Phone className="w-3 h-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span dir="ltr">{cms.about_contact.phone_primary}</span>
              </a>
            </div>
            <span className="hidden md:inline text-emerald-200/90 truncate">
              {t(cms.about_contact.address_ar, cms.about_contact.address_en)}
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-4">
          <BrandLogo variant="header" />

          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-6"
            aria-label={t('التنقل الرئيسي', 'Main Navigation')}
          >
            {primaryLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[13px] xl:text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-200 ${
                  isActive(item.to)
                    ? 'text-[#059669] border-[#059669]'
                    : 'text-slate-700 border-transparent hover:text-[#064E3B] hover:border-emerald-200'
                }`}
              >
                {t(item.ar, item.en)}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-expanded={moreOpen}
                className="inline-flex items-center gap-1 text-[13px] xl:text-sm font-medium text-slate-700 hover:text-[#064E3B] py-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t('المزيد', 'More')}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {moreOpen && (
                <div className="absolute top-full mt-2 end-0 w-52 bg-white rounded-2xl border border-slate-200/80 shadow-lg py-2 z-50">
                  {secondaryLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        isActive(item.to)
                          ? 'bg-emerald-50 text-[#059669] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#064E3B]'
                      }`}
                    >
                      {t(item.ar, item.en)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <div
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/60"
              role="group"
              aria-label={t('تبديل اللغة', 'Language Switcher')}
            >
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-white text-[#064E3B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-[#064E3B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={openLoginModal}
              aria-label={user ? t('حسابي', 'My Account') : t('تسجيل الدخول', 'Sign In')}
              title={user ? `${user.name} (${user.email})` : t('تسجيل الدخول', 'Sign In')}
              className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                user
                  ? 'bg-emerald-50 border-[#059669]/40 text-[#064E3B] hover:bg-emerald-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-[#059669] hover:text-[#064E3B] hover:bg-emerald-50/50'
              }`}
            >
              {user ? (
                <UserCheck className="w-4 h-4" aria-hidden="true" />
              ) : (
                <LogIn className="w-4 h-4" aria-hidden="true" />
              )}
              {user && (
                <span
                  className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-white"
                  aria-hidden="true"
                />
              )}
            </button>

            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold text-white bg-[#059669] hover:bg-[#064E3B] transition-colors duration-200 whitespace-nowrap shrink-0"
            >
              {t('احجز استشارة', 'Book Consultation')}
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openLoginModal}
              aria-label={user ? t('حسابي', 'My Account') : t('تسجيل الدخول', 'Sign In')}
              title={user ? user.name : t('تسجيل الدخول', 'Sign In')}
              className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors cursor-pointer ${
                user
                  ? 'bg-emerald-50 border-[#059669]/40 text-[#064E3B]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {user ? (
                <UserCheck className="w-4 h-4" aria-hidden="true" />
              ) : (
                <LogIn className="w-4 h-4" aria-hidden="true" />
              )}
              {user && (
                <span
                  className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-white"
                  aria-hidden="true"
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => setLanguage(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={t('فتح القائمة', 'Toggle navigation menu')}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200/70 px-4 py-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {[...primaryLinks, ...secondaryLinks].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? 'bg-emerald-50 text-[#059669] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t(item.ar, item.en)}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200/70 flex flex-col gap-2">
              <Link
                to="/request-study"
                className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-[#064E3B] border border-[#059669]/40 bg-emerald-50/50"
              >
                {t('اطلب دراستك الآن', 'Request Feasibility Study')}
              </Link>
              <Link
                to="/book-appointment"
                className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-[#059669]"
              >
                {t('احجز استشارة مجانية', 'Book Free Consultation')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Sign In / Account Modal */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="header-login-title"
          onClick={() => setLoginModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                  {user ? (
                    <UserCheck className="w-5 h-5" aria-hidden="true" />
                  ) : loginRole === 'admin' ? (
                    <Shield className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#059669]">
                    {t('منصة EXPERT', 'EXPERT Account')}
                  </p>
                  <h2 id="header-login-title" className="font-heading text-lg font-bold text-[#064E3B]">
                    {user
                      ? t('حسابك النشط', 'Active Session')
                      : t('تسجيل الدخول', 'Sign In')}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                aria-label={t('إغلاق', 'Close')}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5" dir="ltr">
                    {user.email}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#064E3B] text-[11px] font-semibold">
                    {user.role === 'admin'
                      ? t('صلاحية مسؤول النظام', 'Administrator')
                      : t('حساب عميل', 'Client Account')}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <Link
                    to="/portal"
                    onClick={() => setLoginModalOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold text-center transition-colors"
                  >
                    {t('الانتقال إلى بوابة العميل', 'Open Client Portal')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setLoginModalOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-emerald-950 text-white text-sm font-semibold text-center transition-colors"
                    >
                      {t('الانتقال إلى لوحة الإدارة', 'Open Admin Console')}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleModalSignOut}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>{t('تسجيل الخروج', 'Sign Out')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('client');
                      setAuthError('');
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      loginRole === 'client' ? 'bg-white text-[#064E3B] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t('دخول العميل', 'Client Portal')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('admin');
                      setAuthError('');
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      loginRole === 'admin' ? 'bg-white text-[#064E3B] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {t('دخول الإدارة', 'Admin Console')}
                  </button>
                </div>

                <form onSubmit={handleModalSignIn} className="space-y-3.5" noValidate>
                  <div>
                    <label htmlFor="header-login-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('البريد الإلكتروني', 'Email Address')}
                    </label>
                    <input
                      id="header-login-email"
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        loginRole === 'admin' ? 'admin@expertconsu.com' : 'client@expertconsu.com'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <div>
                    <label htmlFor="header-login-password" className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('كلمة المرور', 'Password')}
                    </label>
                    <input
                      id="header-login-password"
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
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    {submitting
                      ? t('جاري التحقق...', 'Signing in...')
                      : loginRole === 'admin'
                      ? t('دخول لوحة الإدارة', 'Sign In as Admin')
                      : t('دخول بوابة العميل', 'Sign In to Portal')}
                  </button>
                </form>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
                  >
                    {t('تعبئة بيانات تجريبية', 'Fill Demo Credentials')}
                  </button>
                  <Link
                    to="/portal"
                    onClick={() => setLoginModalOpen(false)}
                    className="text-slate-600 hover:text-[#064E3B] font-medium"
                  >
                    {t('حساب جديد؟', 'Create account?')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
