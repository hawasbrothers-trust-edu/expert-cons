import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Factory,
  Globe2,
  Landmark,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCms } from '../context/SiteCmsContext';
import { ARAB_COUNTRIES } from '../data/catalog';
import { DynamicIcon } from '../components/IconMap';

function AnimatedStat({ target, suffix = '+' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const stepTime = 24;
    const steps = Math.max(1, Math.floor(duration / stepTime));
    const increment = target / steps;

    const timer = window.setInterval(() => {
      start += increment;
      if (start >= target) {
        setVal(target);
        window.clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, stepTime);

    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <span className="tabular-nums font-heading font-extrabold">
      {suffix}
      {val.toLocaleString('en-US')}
    </span>
  );
}

export function HomePage() {
  const { isRtl, t } = useLanguage();
  const { cms } = useSiteCms();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const stats = cms.metrics;

  const whyExpert = [
    {
      num: '01.',
      icon: Landmark,
      title_ar: 'دراسات معتمدة لدى 52+ جهة تمويل',
      title_en: 'Accepted by 52+ Banks & Funds',
      desc_ar:
        'تُعد ملفاتنا المالية وفق متطلبات اللجان الائتمانية في البنوك المصرية والخليجية وصناديق التنمية الصناعية.',
      desc_en:
        'Financial models are built strictly to credit-committee standards across Egyptian, Gulf, and development institutions.',
      span: 'lg:col-span-2',
    },
    {
      num: '02.',
      icon: ShieldCheck,
      title_ar: 'منهجية مزدوجة: مالي + هندسي',
      title_en: 'Dual Financial & Engineering Audit',
      desc_ar:
        'يراجع كل دراسة خبير اقتصادي ومهندس قطاعي لضمان واقعية عروض خطوط الإنتاج والطاقات التشغيلية.',
      desc_en:
        'Every study undergoes dual review by a financial analyst and sector engineer to verify machinery and OPEX quotes.',
      span: 'lg:col-span-1',
    },
    {
      num: '03.',
      icon: Factory,
      title_ar: 'توفير خطوط الإنتاج من الموردين',
      title_en: 'Turnkey Production Line Sourcing',
      desc_ar:
        'نربط المستثمر مباشرة بمصانع المعدات في أوروبا وآسيا والشرق الأوسط مع مقارنة فنية وسعرية شفافة.',
      desc_en:
        'Direct access to vetted machinery manufacturers in Europe, Asia, and MENA with comparative technical quotes.',
      span: 'lg:col-span-1',
    },
    {
      num: '04.',
      icon: TrendingUp,
      title_ar: 'تحليل حساسية يحمي رأس المال',
      title_en: 'Sensitivity Stress-Testing',
      desc_ar:
        'نختبر جدوى مشروعك أمام تقلبات أسعار الصرف والتضخم والتغيرات السوقية بثلاثة سيناريوهات تشغيلية واضحة.',
      desc_en:
        'We stress-test your venture against FX shifts, raw material swings, and demand changes across 3 scenarios.',
      span: 'lg:col-span-2',
    },
  ];

  const workflow = [
    {
      step: '01',
      title_ar: 'استلام الطلب وتحليل الفكرة',
      title_en: 'Intake & Concept Scoping',
      desc_ar: 'تحديد القطاع، الموقع، وحجم الاستثمار المستهدف.',
      desc_en: 'Defining sector, location, and target capital scope.',
    },
    {
      step: '02',
      title_ar: 'بحث السوق والمنافسين',
      title_en: 'Market & Demand Research',
      desc_ar: 'قياس الفجوة السوقية وحجم الطلب الفعلي.',
      desc_en: 'Quantifying market gaps and real buyer demand.',
    },
    {
      step: '03',
      title_ar: 'الدراسة الفنية وخطوط الإنتاج',
      title_en: 'Engineering & Machinery Specs',
      desc_ar: 'تجميع عروض الموردين وحساب الطاقة الإنتاجية.',
      desc_en: 'Sourcing machinery quotes and plant capacity planning.',
    },
    {
      step: '04',
      title_ar: 'النمذجة المالية والحساسية',
      title_en: 'Financial & Risk Modeling',
      desc_ar: 'بناء القوائم لـ 5 سنوات وحساب IRR وNPV.',
      desc_en: '5-year cash flows, IRR, NPV, and break-even analysis.',
    },
    {
      step: '05',
      title_ar: 'التسليم وربط التمويل',
      title_en: 'Delivery & Funding Match',
      desc_ar: 'تسليم الدراسة المعتمدة والتقديم للجهات الممولة.',
      desc_en: 'Final dossier handover and bank/fund introductions.',
    },
  ];

  const previewServices = [
    cms.services[0],
    cms.services[2],
    cms.services[5],
    cms.services[7],
    cms.services[8],
    cms.services[11],
  ].filter(Boolean);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-emerald-50/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-semibold text-[#059669] mb-4">
                {t(cms.hero.badge_ar, cms.hero.badge_en)}
              </p>

              <h1 className="font-heading text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#064E3B] leading-[1.2] tracking-tight mb-6 max-w-2xl">
                {t(cms.hero.headline_ar, cms.hero.headline_en)}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
                {t(cms.hero.subheading_ar, cms.hero.subheading_en)}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/request-study"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-sm"
                >
                  <span>{t(cms.hero.cta_primary_ar, cms.hero.cta_primary_en)}</span>
                  <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-emerald-50 text-[#064E3B] border border-[#059669]/35 font-semibold text-sm sm:text-base transition-all duration-200"
                >
                  <span>{t(cms.hero.cta_secondary_ar, cms.hero.cta_secondary_en)}</span>
                </Link>
              </div>
            </div>

            {/* Right Architectural Bento Snapshot */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-slate-200/70">
                <div>
                  <p className="text-xs font-semibold text-[#059669]">
                    {t('مؤشر الجاهزية التمويلية', 'Bankability Readiness')}
                  </p>
                  <h2 className="font-heading text-lg font-bold text-slate-900 mt-1">
                    {t('بنيان الدراسة المعتمدة في EXPERT', 'EXPERT Feasibility Architecture')}
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              <div className="py-5 space-y-4">
                {[
                  {
                    ar: 'تحليل الفجوة السوقية والطلب الفعلي',
                    en: 'Market Gap & Verified Demand Sizing',
                    metric_ar: 'توقعات 5 سنوات',
                    metric_en: '5Y Forecast',
                  },
                  {
                    ar: 'عروض أسعار خطوط الإنتاج والمعدات',
                    en: 'Comparative Production Line Quotes',
                    metric_ar: '+3 عروض موردين',
                    metric_en: '3+ Vendors',
                  },
                  {
                    ar: 'مؤشرات الربحية (IRR / NPV / Payback)',
                    en: 'Bank Credit Ratios (IRR / NPV / DSCR)',
                    metric_ar: 'معتمد بنكياً',
                    metric_en: 'Bank Ready',
                  },
                  {
                    ar: 'توجيه الملف للبنوك وصناديق التنمية',
                    en: 'Direct Routing to 52+ Funding Entities',
                    metric_ar: '+52 جهة تمويل',
                    metric_en: '52+ Partners',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />
                      <span className="text-sm font-medium text-slate-800">{t(row.ar, row.en)}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#064E3B] tabular-nums whitespace-nowrap">
                      {t(row.metric_ar, row.metric_en)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                <span>{t('الاعتماد المصرفي والتنموي', 'Banking & Development Ready')}</span>
                <span className="font-semibold text-[#D4AF37]">
                  {t('تغطية 11 قطاعاً استثمارياً', '11 Investment Sectors')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-start p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/60"
              >
                <div className="text-2xl sm:text-3xl text-[#064E3B]">
                  <AnimatedStat target={stat.target} />
                </div>
                <p className="text-sm text-slate-600 mt-1.5 font-medium">
                  {t(stat.label_ar, stat.label_en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why EXPERT? — 4 Bento Dark Emerald Cards */}
      <section className="py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t(cms.hero.why_subtitle_ar, cms.hero.why_subtitle_en)}
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              {t(cms.hero.why_title_ar, cms.hero.why_title_en)}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {whyExpert.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className={`${item.span} bg-[#064E3B] text-white rounded-2xl p-7 sm:p-8 border border-emerald-800/80 transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-semibold text-[#D4AF37] tabular-nums">
                      {item.num}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-emerald-900/90 border border-emerald-700/60 flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {t(item.title_ar, item.title_en)}
                  </h3>
                  <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed">
                    {t(item.desc_ar, item.desc_en)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 5-Step Workflow Section */}
      <section className="py-16 lg:py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold text-[#059669] mb-2">
                {t('منهجية العمل', 'Delivery Methodology')}
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                {t('رحلة إعداد دراستك في 5 خطوات واضحة', 'Your Study Roadmap in 5 Clear Steps')}
              </h2>
            </div>
            <Link
              to="/portal"
              className="text-sm font-semibold text-[#059669] hover:text-[#064E3B] inline-flex items-center gap-1.5"
            >
              <span>{t('تابع مراحل التنفيذ عبر بوابة العميل', 'Track progress in Client Portal')}</span>
              <ArrowIcon className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {workflow.map((w, idx) => (
              <div
                key={w.step}
                className="relative bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/70 transition-all duration-300 hover:border-[#059669]/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[#059669] text-white font-heading font-bold text-sm flex items-center justify-center tabular-nums">
                    {w.step}
                  </span>
                  {idx < workflow.length - 1 && (
                    <span className="hidden lg:block h-px flex-1 mx-3 bg-emerald-200" aria-hidden="true" />
                  )}
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  {t(w.title_ar, w.title_en)}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(w.desc_ar, w.desc_en)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Services Preview */}
      <section className="py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#059669] mb-2">
                {t('منظومة الخدمات المتكاملة', 'Integrated Advisory Suite')}
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                {t('خدمات استشارية تغطي التأسيس والتوسع', 'Advisory From Launch to Regional Scale')}
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#064E3B] hover:text-[#059669]"
            >
              <span>{t('استعراض جميع الخدمات (12)', 'View All 12 Services')}</span>
              <ArrowIcon className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-slate-200/70 transition-all duration-300 hover:border-[#059669]/50 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                      <DynamicIcon name={srv.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      {srv.code}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                    {t(srv.title_ar, srv.title_en)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {t(srv.description_ar, srv.description_en)}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t(srv.deliverable_ar, srv.deliverable_en)}</span>
                  <Link
                    to="/request-study"
                    className="font-semibold text-[#059669] hover:text-[#064E3B]"
                  >
                    {t('اطلب الخدمة', 'Request')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Geographic Coverage — 22 Arab Countries */}
      <section className="py-16 lg:py-20 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#059669] mb-2">
                {t('الانتشار الإقليمي', 'Regional Footprint')}
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                {t('تغطية استشارية في 22 دولة عربية', 'Serving Investors Across 22 Arab Countries')}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Globe2 className="w-4 h-4 text-[#059669]" aria-hidden="true" />
              <span>{t('بيانات سوقية محدثة لكل دولة', 'Localized Market Intelligence')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {ARAB_COUNTRIES.map((c) => (
              <div
                key={c.code}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:border-[#059669]/50 transition-colors text-center"
              >
                <span className="text-2xl mb-1" role="img" aria-label={c.name_en}>
                  {c.flag}
                </span>
                <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                  {t(c.name_ar, c.name_en)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA Banner */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-l from-[#064E3B] via-[#065F46] to-[#047857] text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-200 mb-3">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>{t(cms.hero.welcome_badge_ar, cms.hero.welcome_badge_en)}</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
                {t(cms.hero.welcome_title_ar, cms.hero.welcome_title_en)}
              </h2>
              <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed">
                {t(cms.hero.welcome_desc_ar, cms.hero.welcome_desc_en)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/request-study"
                className="px-6 py-3.5 rounded-2xl bg-white text-[#064E3B] hover:bg-emerald-50 font-bold text-sm transition-colors whitespace-nowrap"
              >
                {t('ابدأ طلب الدراسة', 'Start Study Request')}
              </Link>
              <Link
                to="/book-appointment"
                className="px-6 py-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 text-white border border-white/25 font-semibold text-sm transition-colors whitespace-nowrap"
              >
                {t('حجز موعد استشارة', 'Book Appointment')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
