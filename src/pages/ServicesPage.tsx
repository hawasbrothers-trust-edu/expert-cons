import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicIcon } from '../components/IconMap';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCms } from '../context/SiteCmsContext';

export function ServicesPage() {
  const { isRtl, t } = useLanguage();
  const { cms } = useSiteCms();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 sm:p-10">
          <p className="text-xs font-semibold text-[#059669] mb-2">
            {t('12 خدمة استشارية متخصصة', '12 Specialized Advisory Services')}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-3 max-w-2xl">
            {t('حلول استشارية متكاملة من التأسيس حتى الاعتماد الدولي', 'End-to-End Advisory From Formation to Global Standards')}
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'ندعم المستثمرين والشركات في كافة مراحل النمو: بدءاً من تصميم نموذج العمل وملفات الاستثمار، مروراً بتأهيل الجودة ISO وSASO والفرانشيز، وصولاً إلى خطط الإطلاق والتسويق الرقمي.',
              'We support founders and industrial firms across every stage—from Business Model Canvas and investor Pitch Decks to ISO/SASO certification, franchising, and digital go-to-market.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cms.services.map((srv, idx) => {
            const isFeatured = idx === 0 || idx === 5 || idx === 7;
            return (
              <div
                key={srv.id}
                className={`rounded-2xl p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between ${
                  isFeatured
                    ? 'bg-[#064E3B] text-white border-emerald-800'
                    : 'bg-white/90 text-slate-900 border-slate-200/70 hover:border-[#059669]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isFeatured
                          ? 'bg-emerald-900 text-[#D4AF37] border border-emerald-700'
                          : 'bg-emerald-50 text-[#059669]'
                      }`}
                    >
                      <DynamicIcon name={srv.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {srv.price_ar && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                            isFeatured
                              ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700'
                              : 'bg-emerald-50 text-[#064E3B] border border-emerald-200/70'
                          }`}
                        >
                          {t(srv.price_ar, srv.price_en)}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isFeatured ? 'text-[#D4AF37]' : 'text-slate-400'
                        }`}
                      >
                        {srv.code}.
                      </span>
                    </div>
                  </div>
                  <h2 className="font-heading text-lg font-bold mb-2">
                    {t(srv.title_ar, srv.title_en)}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      isFeatured ? 'text-emerald-100/90' : 'text-slate-600'
                    }`}
                  >
                    {t(srv.description_ar, srv.description_en)}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t flex items-center justify-between text-xs ${
                    isFeatured ? 'border-emerald-800' : 'border-slate-100'
                  }`}
                >
                  <span className={isFeatured ? 'text-emerald-200' : 'text-slate-500'}>
                    {t(srv.deliverable_ar, srv.deliverable_en)}
                  </span>
                  <Link
                    to="/book-appointment"
                    className={`inline-flex items-center gap-1 font-semibold ${
                      isFeatured
                        ? 'text-[#D4AF37] hover:text-white'
                        : 'text-[#059669] hover:text-[#064E3B]'
                    }`}
                  >
                    <span>{t('اطلب استشارة', 'Inquire')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
