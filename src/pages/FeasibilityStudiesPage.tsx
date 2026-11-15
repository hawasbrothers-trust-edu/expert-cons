import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicIcon } from '../components/IconMap';
import { useLanguage } from '../context/LanguageContext';
import { SECTORS, STUDY_TYPES } from '../data/catalog';

export function FeasibilityStudiesPage() {
  const { isRtl, t } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <section className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/70 p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('11 قطاعاً اقتصادياً · 5 مستويات تحليلية', '11 Economic Sectors · 5 Study Tiers')}
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-4">
              {t('دراسات الجدوى الاقتصادية والفنية المعتمدة', 'Bankable Economic & Technical Feasibility Studies')}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {t(
                'تغطي شركة EXPERT إحدى عشر قطاعاً حيوياً في مصر والعالم العربي، مع إعداد الدراسات الاقتصادية والبيئية والتسويقية والفنية والشاملة بما يتوافق مع متطلبات البنوك والمستثمرين.',
                'EXPERT covers eleven core investment sectors across Egypt and the Arab region, delivering economic, environmental, marketing, technical, and comprehensive bankable studies.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/request-study"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold transition-colors"
              >
                <span>{t('اطلب دراسة جدوى لمشروعك', 'Request a Study')}</span>
                <ArrowIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/funding-entities"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-[#064E3B] text-sm font-semibold transition-colors"
              >
                <span>{t('استكشف جهات التمويل المعتمدة', 'View Funding Partners')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Study Types Section */}
        <section>
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('أنواع الدراسات', 'Study Classifications')}
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              {t('اختر نطاق الدراسة المناسب لمرحلة مشروعك', 'Select the Study Scope for Your Stage')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDY_TYPES.map((type, index) => (
              <div
                key={type.id}
                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between ${
                  type.id === 'comprehensive'
                    ? 'bg-[#064E3B] text-white border-emerald-800 lg:col-span-2'
                    : 'bg-white/90 text-slate-900 border-slate-200/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        type.id === 'comprehensive' ? 'text-[#D4AF37]' : 'text-[#059669]'
                      }`}
                    >
                      0{index + 1}.
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        type.id === 'comprehensive' ? 'text-emerald-200' : 'text-slate-500'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t(type.duration_ar, type.duration_en)}</span>
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-1">
                    {t(type.name_ar, type.name_en)}
                  </h3>
                  <p
                    className={`text-xs font-medium mb-3 ${
                      type.id === 'comprehensive' ? 'text-emerald-200' : 'text-[#059669]'
                    }`}
                  >
                    {t(type.subtitle_ar, type.subtitle_en)}
                  </p>
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      type.id === 'comprehensive' ? 'text-emerald-100/90' : 'text-slate-600'
                    }`}
                  >
                    {t(type.description_ar, type.description_en)}
                  </p>
                </div>

                <Link
                  to={`/request-study?type=${type.id}`}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    type.id === 'comprehensive'
                      ? 'text-[#D4AF37] hover:text-white'
                      : 'text-[#059669] hover:text-[#064E3B]'
                  }`}
                >
                  <span>{t('ابدأ هذا النوع في المعالج', 'Select in Study Wizard')}</span>
                  <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 11 Sectors Bento Grid */}
        <section>
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('التغطية القطاعية', 'Sector Expertise')}
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              {t('11 قطاعاً استثمارياً متخصصاً', '11 Specialized Investment Sectors')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS.map((sector, idx) => {
              const spanClass = idx === 0 || idx === 6 ? 'lg:col-span-2' : '';
              return (
                <div
                  key={sector.id}
                  className={`${spanClass} bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/70 p-6 sm:p-7 transition-all duration-300 hover:border-[#059669]/50 hover:-translate-y-0.5 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                        <DynamicIcon name={sector.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                      {t(sector.name_ar, sector.name_en)}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {t(sector.description_ar, sector.description_en)}
                    </p>
                    <div className="space-y-1.5 mb-6">
                      {(isRtl ? sector.deliverables_ar : sector.deliverables_en).map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" aria-hidden="true" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/request-study?sector=${sector.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] hover:text-[#064E3B]"
                    >
                      <span>{t('اعرف المزيد واطلب دراسة', 'Learn More & Request')}</span>
                      <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
