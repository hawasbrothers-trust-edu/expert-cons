import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { validateContactForm, type ContactDraft } from '../utils/validation';

export function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<ContactDraft>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateContactForm(form);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await api.submitContactMessage(form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 sm:p-10">
          <p className="text-xs font-semibold text-[#059669] mb-2">
            {t('اتصل بنا', 'Get in Touch')}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-3">
            {t('تواصل مع شركة EXPERT للاستشارات الاقتصادية', 'Contact EXPERT Economic Consultation')}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl">
            {t(
              'فريقنا مستعد للرد على استفساراتكم حول دراسات الجدوى وخطوط الإنتاج وشراكات التمويل في مصر والعالم العربي.',
              'Our advisory desk is ready to answer inquiries on feasibility studies, production lines, and regional project funding.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#064E3B] text-white rounded-2xl p-7 sm:p-8 space-y-6">
              <h2 className="font-heading text-xl font-bold">
                {t('بيانات التواصل المباشر', 'Direct Contact Details')}
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">{t('المقر الرئيسي', 'Headquarters')}</p>
                    <p className="text-emerald-100/85">
                      {t('بني سويف، جمهورية مصر العربية', 'Beni Suef, Arab Republic of Egypt')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">{t('الهاتف والواتساب', 'Phone & WhatsApp')}</p>
                    <a
                      href="tel:+201142464520"
                      dir="ltr"
                      className="text-emerald-100/90 hover:text-[#D4AF37] tabular-nums"
                    >
                      +201142464520
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">{t('البريد الإلكتروني الرسمي', 'Official Email')}</p>
                    <a
                      href="mailto:info@expertconsu.com"
                      className="text-emerald-100/90 hover:text-[#D4AF37]"
                    >
                      info@expertconsu.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800 space-y-3">
                <p className="text-xs font-semibold text-emerald-200">
                  {t('القنوات الرسمية', 'Official Channels')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'WhatsApp', href: 'https://wa.me/201142464520' },
                    { name: 'Facebook', href: 'https://facebook.com' },
                    { name: 'Instagram', href: 'https://instagram.com' },
                    { name: 'LinkedIn', href: 'https://linkedin.com' },
                    { name: 'YouTube', href: 'https://youtube.com' },
                    { name: 'Twitter / X', href: 'https://x.com' },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-900/70 hover:bg-[#059669] text-xs font-semibold text-white transition-colors"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/201142464520"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#059669] hover:bg-emerald-500 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{t('محادثة فورية عبر واتساب', 'Chat on WhatsApp Now')}</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/70 p-7 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-slate-900 mb-5">
              {t('أرسل رسالتك أو استفسارك', 'Send Us a Message')}
            </h2>

            {sent && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-sm text-[#064E3B] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" aria-hidden="true" />
                <span>
                  {t(
                    'تم استلام رسالتك بنجاح وسيتواصل معك فريقنا خلال ساعات العمل.',
                    'Your message has been received. Our team will respond within business hours.'
                  )}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الاسم الكامل', 'Full Name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('البريد الإلكتروني', 'Email Address')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('رقم الهاتف', 'Phone Number')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الموضوع', 'Subject')}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                  {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('تفاصيل الرسالة', 'Message')}
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                {submitting ? t('جاري الإرسال...', 'Sending...') : t('إرسال الرسالة', 'Send Message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
