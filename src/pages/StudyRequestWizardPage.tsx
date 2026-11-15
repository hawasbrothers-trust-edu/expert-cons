import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileSpreadsheet,
  Leaf,
  LineChart,
  Megaphone,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DynamicIcon } from '../components/IconMap';
import { useLanguage } from '../context/LanguageContext';
import { SECTORS, STUDY_TYPES } from '../data/catalog';
import { api } from '../lib/api';
import type { SectorId, StudyRequest, StudyRequestDraft, StudyTypeId } from '../types';
import { validateStudyStep } from '../utils/validation';

const CAPITAL_RANGES = [
  { value: '< 1M EGP', ar: 'أقل من 1 مليون جنيه (أو ما يعادله)', en: 'Under $25K / 1M EGP' },
  { value: '1M - 5M EGP', ar: '1 إلى 5 مليون جنيه', en: '$25K – $100K (1M–5M EGP)' },
  { value: '5M - 20M EGP', ar: '5 إلى 20 مليون جنيه', en: '$100K – $400K (5M–20M EGP)' },
  { value: '20M - 100M EGP', ar: '20 إلى 100 مليون جنيه', en: '$400K – $2M (20M–100M EGP)' },
  { value: '> 100M EGP', ar: 'أكثر من 100 مليون جنيه', en: 'Over $2M / 100M EGP' },
];

const TYPE_ICONS: Record<StudyTypeId, typeof LineChart> = {
  economic: LineChart,
  environmental: Leaf,
  marketing: Megaphone,
  technical: Wrench,
  comprehensive: FileSpreadsheet,
};

export function StudyRequestWizardPage() {
  const { isRtl, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as StudyTypeId) || '';
  const initialSector = (searchParams.get('sector') as SectorId) || '';

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<StudyRequestDraft>({
    type: STUDY_TYPES.some((item) => item.id === initialType) ? initialType : '',
    sector: SECTORS.some((item) => item.id === initialSector) ? initialSector : '',
    project_name: '',
    location: '',
    capital_range: '',
    needs_funding: true,
    name: '',
    phone: '',
    email: '',
    preferred_contact: 'whatsapp',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<StudyRequest | null>(null);

  const NextArrow = isRtl ? ArrowLeft : ArrowRight;
  const PrevArrow = isRtl ? ArrowRight : ArrowLeft;

  const stepsMeta = [
    { num: 1, ar: 'نوع الدراسة', en: 'Study Type' },
    { num: 2, ar: 'القطاع', en: 'Sector' },
    { num: 3, ar: 'تفاصيل المشروع', en: 'Project Details' },
    { num: 4, ar: 'بيانات التواصل', en: 'Applicant Info' },
    { num: 5, ar: 'المراجعة والإرسال', en: 'Review & Submit' },
  ];

  const handleNext = () => {
    const check = validateStudyStep(step, draft);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(5, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const check = validateStudyStep(5, draft);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setSubmitting(true);
    try {
      const saved = await api.createStudyRequest(draft);
      setSubmittedRequest(saved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTypeObj = STUDY_TYPES.find((item) => item.id === draft.type);
  const selectedSectorObj = SECTORS.find((item) => item.id === draft.sector);

  if (submittedRequest) {
    return (
      <div className="py-16 bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('تم تسجيل طلبك بنجاح', 'Request Submitted Successfully')}
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#064E3B] mb-3">
              {t('شكراً لثقتك في شركة EXPERT', 'Thank You for Choosing EXPERT')}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              {t(
                'تم استلام بيانات مشروعك وإحالتها إلى رئيس فريق الدراسات المختص بالقطاع. يمكنك متابعة مراحل الإعداد مباشرة من بوابة العميل.',
                'Your project brief has been received and assigned to our sector lead. You can track real-time study progress via the Client Portal.'
              )}
            </p>
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/70 p-4 mb-8 text-sm grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
              <div>
                <span className="text-xs text-slate-500 block">{t('رقم الطلب المرجعي', 'Reference ID')}</span>
                <span className="font-mono font-bold text-[#064E3B] tabular-nums">{submittedRequest.id}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">{t('المشروع', 'Project')}</span>
                <span className="font-semibold text-slate-900">{submittedRequest.project_name}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/portal"
                className="px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold transition-colors"
              >
                {t('متابعة الطلب في بوابة العميل', 'Track in Client Portal')}
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
              >
                {t('العودة للرئيسية', 'Back to Home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (step / 5) * 100;

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#059669] mb-2">
            {t('معالج طلب الدراسة الذكي', 'Smart Study Request Wizard')}
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#064E3B] mb-2">
            {t('اطلب دراسة جدوى مخصصة لمشروعك', 'Configure Your Custom Feasibility Study')}
          </h1>
          <p className="text-sm text-slate-600">
            {t(
              '5 خطوات سريعة لتحديد نطاق الدراسة والقطاع وخيارات التمويل المطلوبة.',
              'Complete 5 quick steps to define study scope, sector, and funding preferences.'
            )}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-3">
            <span>
              {t(`الخطوة ${step} من 5`, `Step ${step} of 5`)} ·{' '}
              {t(stepsMeta[step - 1].ar, stepsMeta[step - 1].en)}
            </span>
            <span className="tabular-nums text-[#059669]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#059669] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {stepsMeta.map((s) => (
              <button
                key={s.num}
                type="button"
                disabled={s.num > step}
                onClick={() => {
                  if (s.num < step) {
                    setErrors({});
                    setStep(s.num);
                  }
                }}
                className={`text-start text-xs py-1.5 px-2 rounded-lg transition-colors ${
                  s.num === step
                    ? 'bg-emerald-50 text-[#064E3B] font-bold'
                    : s.num < step
                    ? 'text-[#059669] hover:bg-slate-50 cursor-pointer font-medium'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="tabular-nums">0{s.num}. </span>
                <span className="hidden sm:inline">{t(s.ar, s.en)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-xs">
          {/* Step 1: Study Type */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {t('1. اختر نوع دراسة الجدوى المطلوبة', '1. Select Feasibility Study Type')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STUDY_TYPES.map((item) => {
                  const Icon = TYPE_ICONS[item.id];
                  const selected = draft.type === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, type: item.id }));
                        setErrors({});
                      }}
                      className={`text-start p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        selected
                          ? 'border-[#059669] bg-emerald-50/70 ring-1 ring-[#059669]'
                          : 'border-slate-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selected ? 'bg-[#059669] text-white' : 'bg-slate-100 text-[#064E3B]'
                          }`}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="text-xs text-slate-500">
                          {t(item.duration_ar, item.duration_en)}
                        </span>
                      </div>
                      <p className="font-heading font-bold text-base text-slate-900 mb-1">
                        {t(item.name_ar, item.name_en)}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t(item.description_ar, item.description_en)}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.type && <p className="text-sm text-red-600 font-medium">{errors.type}</p>}
            </div>
          )}

          {/* Step 2: Sector */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {t('2. حدد القطاع الاستثماري للمشروع', '2. Choose Your Project Sector')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {SECTORS.map((sec) => {
                  const selected = draft.sector === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, sector: sec.id }));
                        setErrors({});
                      }}
                      className={`text-start p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                        selected
                          ? 'border-[#059669] bg-emerald-50/70 ring-1 ring-[#059669]'
                          : 'border-slate-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          selected ? 'bg-[#059669] text-white' : 'bg-emerald-50 text-[#059669]'
                        }`}
                      >
                        <DynamicIcon name={sec.icon} className="w-5 h-5" />
                      </div>
                      <span className="font-heading text-sm font-bold text-slate-900">
                        {t(sec.name_ar, sec.name_en)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.sector && <p className="text-sm text-red-600 font-medium">{errors.sector}</p>}
            </div>
          )}

          {/* Step 3: Project Details */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {t('3. تفاصيل المشروع والتمويل', '3. Project Details & Capital')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wiz-project-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t('اسم أو فكرة المشروع', 'Project Name or Concept')}
                  </label>
                  <input
                    id="wiz-project-name"
                    type="text"
                    value={draft.project_name}
                    onChange={(e) => setDraft((prev) => ({ ...prev, project_name: e.target.value }))}
                    placeholder={t('مثال: مصنع تعبئة تمور للتصدير', 'e.g. Export Date Packaging Plant')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                  />
                  {errors.project_name && (
                    <p className="text-xs text-red-600 mt-1">{errors.project_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="wiz-location" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t('الدولة / المدينة المقترحة', 'Target Country / City')}
                  </label>
                  <input
                    id="wiz-location"
                    type="text"
                    value={draft.location}
                    onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder={t('مثال: بني سويف، مصر أو الرياض', 'e.g. Cairo, Egypt or Riyadh')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                  />
                  {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="wiz-capital" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('نطاق رأس المال الاستثماري التقديري', 'Estimated Investment Capital Range')}
                </label>
                <select
                  id="wiz-capital"
                  value={draft.capital_range}
                  onChange={(e) => setDraft((prev) => ({ ...prev, capital_range: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm bg-white"
                >
                  <option value="">{t('اختر نطاق رأس المال', 'Select capital range')}</option>
                  {CAPITAL_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {t(r.ar, r.en)}
                    </option>
                  ))}
                </select>
                {errors.capital_range && (
                  <p className="text-xs text-red-600 mt-1">{errors.capital_range}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t('هل يحتاج المشروع إلى تمويل بنكي أو صندوق تنموي؟', 'Does the project require bank or fund financing?')}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('سنجهز الدراسة وفق معايير الجهات الممولة المختصة.', 'We will structure the dossier to match credit committee criteria.')}
                  </p>
                </div>
                <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, needs_funding: true }))}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      draft.needs_funding ? 'bg-[#059669] text-white' : 'text-slate-600'
                    }`}
                  >
                    {t('نعم، يحتاج تمويل', 'Yes, Needs Funding')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, needs_funding: false }))}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      !draft.needs_funding ? 'bg-[#064E3B] text-white' : 'text-slate-600'
                    }`}
                  >
                    {t('تمويل ذاتي', 'Self-Funded')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Applicant Info */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                {t('4. بيانات مقدم الطلب والتواصل', '4. Applicant Contact Information')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wiz-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t('الاسم الكامل', 'Full Name')}
                  </label>
                  <input
                    id="wiz-name"
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={t('الاسم ثلاثي أو اسم الشركة', 'Full name or company')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="wiz-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t('رقم الهاتف / واتساب', 'Phone / WhatsApp')}
                  </label>
                  <input
                    id="wiz-phone"
                    type="tel"
                    dir="ltr"
                    value={draft.phone}
                    onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+201142464520"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="wiz-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t('البريد الإلكتروني', 'Email Address')}
                  </label>
                  <input
                    id="wiz-email"
                    type="email"
                    dir="ltr"
                    value={draft.email}
                    onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="wiz-contact-method" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t('وسيلة التواصل المفضلة', 'Preferred Contact Channel')}
                  </label>
                  <select
                    id="wiz-contact-method"
                    value={draft.preferred_contact}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        preferred_contact: e.target.value as 'whatsapp' | 'phone' | 'email',
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm bg-white"
                  >
                    <option value="whatsapp">{t('واتساب', 'WhatsApp')}</option>
                    <option value="phone">{t('اتصال هاتفي', 'Phone Call')}</option>
                    <option value="email">{t('البريد الإلكتروني', 'Email')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="wiz-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('ملاحظات إضافية (اختياري)', 'Additional Notes (Optional)')}
                </label>
                <textarea
                  id="wiz-notes"
                  rows={3}
                  value={draft.notes || ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder={t('أي تفاصيل إضافية حول الطاقة الإنتاجية أو خطوط الإنتاج...', 'Any specific capacity or production line requirements...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 5: Summary Review */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="w-6 h-6 text-[#059669]" aria-hidden="true" />
                <h2 className="font-heading text-xl font-bold text-slate-900">
                  {t('5. مراجعة ملخص الطلب قبل الإرسال', '5. Review Your Request Summary')}
                </h2>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/70 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">{t('نوع الدراسة', 'Study Type')}</span>
                  <span className="font-semibold text-slate-900">
                    {selectedTypeObj ? t(selectedTypeObj.name_ar, selectedTypeObj.name_en) : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('القطاع', 'Sector')}</span>
                  <span className="font-semibold text-slate-900">
                    {selectedSectorObj ? t(selectedSectorObj.name_ar, selectedSectorObj.name_en) : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('اسم المشروع', 'Project Name')}</span>
                  <span className="font-semibold text-slate-900">{draft.project_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('الموقع', 'Location')}</span>
                  <span className="font-semibold text-slate-900">{draft.location}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('رأس المال التقديري', 'Capital Range')}</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{draft.capital_range}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('التمويل البنكي', 'Bank Funding')}</span>
                  <span className="font-semibold text-[#059669]">
                    {draft.needs_funding ? t('نعم، مطلوب ربط تمويلي', 'Yes, Funding Required') : t('تمويل ذاتي', 'Self-Funded')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('مقدم الطلب', 'Applicant')}</span>
                  <span className="font-semibold text-slate-900">{draft.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t('الهاتف والبريد', 'Phone & Email')}</span>
                  <span className="font-semibold text-slate-900 tabular-nums" dir="ltr">
                    {draft.phone} · {draft.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-200/70 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                <PrevArrow className="w-4 h-4" aria-hidden="true" />
                <span>{t('السابق', 'Previous')}</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>{t('التالي', 'Next Step')}</span>
                <NextArrow className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#059669] hover:bg-[#064E3B] disabled:opacity-60 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <span>
                  {submitting
                    ? t('جاري الحفظ والإرسال...', 'Submitting...')
                    : t('تأكيد وإرسال الطلب', 'Confirm & Submit Request')}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
