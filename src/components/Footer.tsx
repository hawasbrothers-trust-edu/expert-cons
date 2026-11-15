import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { validateEmail } from '../utils/validation';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'subscribed'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus('error');
      return;
    }
    setStatus('subscribed');
    setEmail('');
  };

  return (
    <footer className="bg-[#064E3B] text-white border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div className="space-y-4">
            <BrandLogo variant="footer" />
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {t(
                'شركة EXPERT للاستشارات الاقتصادية — شريكك الاستراتيجي في إعداد دراسات الجدوى المعتمدة، تأمين خطوط الإنتاج، وربط المشاريع بجهات التمويل في مصر والشرق الأوسط.',
                'EXPERT Economic Consultation — your strategic partner for bankable feasibility studies, production line sourcing, and funding connections across Egypt and MENA.'
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('بني سويف، جمهورية مصر العربية', 'Beni Suef, Arab Republic of Egypt')}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-4">
              {t('روابط سريعة', 'Quick Links')}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/85">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  {t('الرئيسية', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/request-study" className="hover:text-[#D4AF37] transition-colors">
                  {t('معالج طلب دراسة الجدوى', 'Study Request Wizard')}
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="hover:text-[#D4AF37] transition-colors">
                  {t('حجز موعد استشارة', 'Book Consultation')}
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-[#D4AF37] transition-colors">
                  {t('بوابة العميل', 'Client Portal')}
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#D4AF37] transition-colors">
                  {t('آراء العملاء', 'Client Reviews')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#D4AF37] transition-colors">
                  {t('لوحة الإدارة', 'Admin Dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-4">
              {t('القطاعات والخدمات', 'Advisory & Services')}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/85">
              <li>
                <Link to="/feasibility-studies" className="hover:text-[#D4AF37] transition-colors">
                  {t('دراسات الجدوى (11 قطاعاً)', 'Feasibility Studies (11 Sectors)')}
                </Link>
              </li>
              <li>
                <Link to="/production-lines" className="hover:text-[#D4AF37] transition-colors">
                  {t('خطوط الإنتاج والمعدات', 'Production Lines & Equipment')}
                </Link>
              </li>
              <li>
                <Link to="/funding-entities" className="hover:text-[#D4AF37] transition-colors">
                  {t('جهات التمويل (+52 بنك وصندوق)', 'Funding Entities (52+ Banks)')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#D4AF37] transition-colors">
                  {t('الخدمات الاستشارية (12 خدمة)', 'Consulting Services (12)')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#D4AF37] transition-colors">
                  {t('المدونة الاقتصادية', 'Economic Insights Blog')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">
                  {t('الأسئلة الشائعة', 'FAQ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-white">
              {t('تواصل معنا والنشرة البريدية', 'Contact & Newsletter')}
            </h3>
            <div className="space-y-2 text-sm text-emerald-100/90">
              <a
                href="tel:+201142464520"
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span dir="ltr">+201142464520</span>
              </a>
              <a
                href="mailto:info@expertconsu.com"
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span>info@expertconsu.com</span>
              </a>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2" noValidate>
              <label htmlFor="footer-newsletter" className="block text-xs text-emerald-100/80">
                {t('اشترك في النشرة الاقتصادية الأسبوعية', 'Subscribe to our weekly economic brief')}
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder={t('بريدك الإلكتروني', 'Your email address')}
                  className="w-full min-w-0 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/70 text-sm text-white placeholder:text-emerald-200/50 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  {t('اشتراك', 'Join')}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-xs text-amber-300">
                  {t('يرجى إدخال بريد إلكتروني صحيح.', 'Please enter a valid email address.')}
                </p>
              )}
              {status === 'subscribed' && (
                <p className="text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{t('تم الاشتراك بنجاح.', 'Subscribed successfully.')}</span>
                </p>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { label: 'WhatsApp', href: 'https://wa.me/201142464520' },
                { label: 'Facebook', href: 'https://facebook.com' },
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'LinkedIn', href: 'https://linkedin.com' },
                { label: 'YouTube', href: 'https://youtube.com' },
                { label: 'X', href: 'https://x.com' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/70 hover:bg-[#059669] text-xs text-emerald-100 transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <p>
            {t('© 2026 EXPERT — مؤسسة بدر حواس. جميع الحقوق محفوظة.', '© 2026 EXPERT — Badr Hawas Foundation. All rights reserved.')}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="hover:text-white transition-colors">
              {t('السرية وحماية الأفكار', 'NDA & Confidentiality')}
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              {t('مكتب بني سويف', 'Beni Suef HQ')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
