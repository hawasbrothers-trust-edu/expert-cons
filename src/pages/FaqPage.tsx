import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FAQ_ITEMS } from '../data/catalog';

export function FaqPage() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 sm:p-10">
          <p className="text-xs font-semibold text-[#059669] mb-2">
            {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-3">
            {t('كل ما تحتاج معرفته عن خدمات EXPERT', 'Everything You Need to Know About EXPERT')}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {t(
              'إجابات واضحة حول مدة إعداد دراسات الجدوى، الاعتماد المصرفي، توريد خطوط الإنتاج، وضمانات السرية.',
              'Clear answers on feasibility study timelines, bank approvals, machinery sourcing, and NDA protection.'
            )}
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-[#059669] mt-1 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-heading text-base sm:text-lg font-bold text-slate-900">
                      {t(item.question_ar, item.question_en)}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#059669] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                    {t(item.answer_ar, item.answer_en)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#064E3B] text-white rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-heading text-xl font-bold mb-1">
              {t('لديك استفسار خاص بمشروعك؟', 'Have a Project-Specific Question?')}
            </h2>
            <p className="text-sm text-emerald-100/90">
              {t('تحدث مباشرة مع فريقنا الاستشاري أو احجز جلسة مجانية.', 'Speak directly with our advisory team or book a discovery session.')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-white text-[#064E3B] text-sm font-bold hover:bg-emerald-50"
            >
              {t('تواصل معنا', 'Contact Us')}
            </Link>
            <Link
              to="/book-appointment"
              className="px-5 py-2.5 rounded-xl bg-[#059669] text-white text-sm font-semibold hover:bg-emerald-500"
            >
              {t('احجز استشارة', 'Book Consultation')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
