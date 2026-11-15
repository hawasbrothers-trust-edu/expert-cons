import { CheckCircle2, Factory, ShoppingBag, Sprout, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCms } from '../context/SiteCmsContext';
import { api } from '../lib/api';
import type { ProductionCategory, ProductionLineItem, ProductionLineTabKey } from '../types';
import { validateEmail, validatePhone } from '../utils/validation';

export function ProductionLinesPage() {
  const { isRtl, t } = useLanguage();
  const { cms } = useSiteCms();
  const [category, setCategory] = useState<ProductionLineTabKey>('all');
  const [inquiryItem, setInquiryItem] = useState<ProductionLineItem | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryError, setInquiryError] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const lines = cms.production_lines;
  const tabs = cms.production_tabs;

  const filtered =
    category === 'all' ? lines : lines.filter((item) => item.category === category);

  const getVisualIcon = (cat: ProductionCategory) => {
    if (cat === 'industrial') return Factory;
    if (cat === 'commercial') return ShoppingBag;
    return Sprout;
  };

  const getTabCount = (tabId: ProductionLineTabKey) =>
    tabId === 'all' ? lines.length : lines.filter((item) => item.category === tabId).length;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !validatePhone(phone) || !validateEmail(email)) {
      setInquiryError(
        t('يرجى إدخال الاسم ورقم هاتف وبريد إلكتروني صحيحين.', 'Please enter a valid name, phone, and email.')
      );
      return;
    }
    setInquiryError('');
    await api.submitContactMessage({
      name,
      phone,
      email,
      subject: `استفسار عن خط إنتاج: ${inquiryItem?.title_ar}`,
      message: `طلب عرض سعر ومواصفات فنية لخط: ${inquiryItem?.title_ar} (${inquiryItem?.capacity_ar})`,
    });
    setInquirySent(true);
  };

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('توريد وتقييم خطوط الإنتاج', 'Production Line Sourcing & Advisory')}
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-3">
              {t('خطوط الإنتاج الصناعية والتجارية والزراعية', 'Industrial, Commercial & Agricultural Production Lines')}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t(
                'نوفر دراسات المقارنة الفنية وعروض الأسعار المباشرة من مصانع المعدات المعتمدة في أوروبا وآسيا والشرق الأوسط مع متابعة الشحن والتركيب.',
                'We source turnkey machinery quotes from certified European, Asian, and regional manufacturers with technical benchmarking and commissioning oversight.'
              )}
            </p>
          </div>
          <Link
            to="/request-study?type=technical"
            className="px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold whitespace-nowrap shrink-0 text-center transition-colors"
          >
            {t('اطلب دراسة فنية لخط إنتاج', 'Request Technical Study')}
          </Link>
        </div>

        {/* Category Tabs with Realistic Miniature Thumbnails */}
        <div className="flex flex-wrap items-center gap-3" role="tablist" aria-label={t('تصنيفات خطوط الإنتاج', 'Production line categories')}>
          {tabs.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat.id)}
                className={`group inline-flex items-center gap-2.5 p-1.5 pe-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#064E3B] text-white shadow-xs ring-1 ring-[#064E3B]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                }`}
              >
                <span
                  className={`w-10 h-8 rounded-lg overflow-hidden shrink-0 border ${
                    active ? 'border-[#D4AF37]/70' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={cat.image_url}
                    alt={t(cat.ar, cat.en)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span>{t(cat.ar, cat.en)}</span>
                <span
                  className={`text-xs tabular-nums px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-white/15 text-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {getTabCount(cat.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Production Lines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const Icon = getVisualIcon(item.category);
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/70 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:border-[#059669]/50 hover:shadow-md"
              >
                <div>
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img
                      src={item.image_url}
                      alt={t(item.title_ar, item.title_en)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/55"
                      aria-hidden="true"
                    />

                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/55 backdrop-blur-xs border border-white/15 font-semibold text-emerald-100">
                          <Icon className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                          <span>
                            {item.category === 'industrial'
                              ? t('صناعي', 'Industrial')
                              : item.category === 'commercial'
                              ? t('تجاري', 'Commercial')
                              : t('زراعي', 'Agricultural')}
                          </span>
                        </span>
                        <span className="tabular-nums font-bold px-2.5 py-1 rounded-lg bg-[#064E3B]/85 backdrop-blur-xs border border-emerald-400/25 text-[#D4AF37]">
                          {t(item.capacity_ar, item.capacity_en)}
                        </span>
                      </div>

                      <div className="flex items-end justify-between gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/75 shadow-sm shrink-0 bg-slate-800">
                          <img
                            src={item.image_url}
                            alt=""
                            aria-hidden="true"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-white/95 bg-slate-950/55 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/15">
                          {t('المنشأ:', 'Origin:')} {t(item.origin_ar, item.origin_en)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="font-heading text-lg font-bold text-slate-900">
                        {t(item.title_ar, item.title_en)}
                      </h2>
                      {item.price_ar && (
                        <span className="text-[11px] font-semibold text-[#064E3B] bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md shrink-0 tabular-nums">
                          {t(item.price_ar, item.price_en || item.price_ar)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {t(item.description_ar, item.description_en)}
                    </p>
                    <ul className="space-y-1.5">
                      {(isRtl ? item.specs_ar : item.specs_en).map((spec, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" aria-hidden="true" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setInquiryItem(item);
                      setInquirySent(false);
                      setInquiryError('');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-[#059669] text-[#064E3B] hover:text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {t('طلب عرض سعر ومواصفات', 'Request Technical Quote')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inquiry Modal */}
      {inquiryItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="line-inquiry-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-[#059669]">
                  {t('استفسار خط إنتاج', 'Production Line Inquiry')}
                </p>
                <h2 id="line-inquiry-title" className="font-heading text-lg font-bold text-slate-900">
                  {t(inquiryItem.title_ar, inquiryItem.title_en)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInquiryItem(null)}
                aria-label={t('إغلاق', 'Close')}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto" aria-hidden="true" />
                <p className="font-heading font-bold text-slate-900">
                  {t('تم إرسال طلب عرض السعر بنجاح', 'Quote Request Submitted')}
                </p>
                <p className="text-sm text-slate-600">
                  {t(
                    'سيتواصل معك مهندس المشتريات الصناعية بعروض الموردين خلال 24 ساعة.',
                    'Our industrial procurement advisor will send vendor quotes within 24 hours.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setInquiryItem(null)}
                  className="px-5 py-2 rounded-xl bg-[#059669] text-white text-sm font-semibold cursor-pointer"
                >
                  {t('إغلاق', 'Close')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5" noValidate>
                <div>
                  <label htmlFor="inq-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الاسم الكامل', 'Full Name')}
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label htmlFor="inq-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('رقم الهاتف / واتساب', 'Phone / WhatsApp')}
                  </label>
                  <input
                    id="inq-phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label htmlFor="inq-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('البريد الإلكتروني', 'Email')}
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                {inquiryError && <p className="text-xs text-red-600">{inquiryError}</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {t('إرسال الطلب', 'Send Quote Request')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
