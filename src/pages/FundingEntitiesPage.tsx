import { Landmark, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FUNDING_ENTITIES } from '../data/catalog';
import type { FundingCategory } from '../types';
import { filterFundingEntities } from '../utils/filtering';

export function FundingEntitiesPage() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<FundingCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = filterFundingEntities(FUNDING_ENTITIES, category, query);

  const tabs: { id: FundingCategory | 'all'; ar: string; en: string }[] = [
    { id: 'all', ar: 'جميع الجهات', en: 'All Entities' },
    { id: 'egyptian', ar: 'البنوك المصرية', en: 'Egyptian Banks' },
    { id: 'gulf', ar: 'بنوك الخليج', en: 'Gulf Banks' },
    { id: 'development', ar: 'صناديق التنمية', en: 'Development Funds' },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('شبكة التمويل المعتمدة · +54 مؤسسة مالية', 'Verified Funding Network · 54 Institutions')}
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-3">
              {t('جهات التمويل والبنوك وصناديق التنمية', 'Partner Banks & Development Funds')}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t(
                'نعد دراسات الجدوى والملفات الائتمانية المتوافقة مع اشتراطات أكثر من 52 بنكاً تجارياً وإسلامياً وصندوقاً تنموياً في مصر ودول الخليج والمنظمات الدولية.',
                'Our feasibility dossiers meet the underwriting requirements of 54+ Egyptian banks, GCC financial institutions, and regional development funds.'
              )}
            </p>
          </div>
          <Link
            to="/request-study"
            className="px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold whitespace-nowrap shrink-0 text-center transition-colors"
          >
            {t('جهز ملفك التمويلي الآن', 'Prepare Bankable Dossier')}
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t('تصفية جهات التمويل', 'Filter Funding Entities')}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={category === tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  category === tab.id
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {t(tab.ar, tab.en)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('ابحث باسم البنك أو الدولة...', 'Search bank or country...')}
              aria-label={t('بحث في جهات التمويل', 'Search funding entities')}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>
        </div>

        <p className="text-xs font-medium text-slate-500 tabular-nums">
          {t(`عرض ${filtered.length} جهة تمويل معتمدة`, `Showing ${filtered.length} funding institutions`)}
        </p>

        {/* Entities Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Landmark className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-700">
              {t('لا توجد نتائج مطابقة لبحثك.', 'No funding entities match your search.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((entity) => (
              <div
                key={entity.id}
                className="bg-white rounded-2xl border border-slate-200/70 p-5 transition-all duration-200 hover:border-[#059669]/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl text-white font-heading font-bold text-xs flex items-center justify-center shrink-0 tracking-tight"
                      style={{ backgroundColor: entity.accent }}
                    >
                      {entity.code}
                    </div>
                    <div className="text-xs text-slate-500 text-end">
                      <span>{t(entity.country_ar, entity.country_en)}</span>
                      <span aria-hidden="true"> · </span>
                      <span>
                        {entity.category === 'egyptian'
                          ? t('بنوك مصرية', 'Egyptian')
                          : entity.category === 'gulf'
                          ? t('بنوك الخليج', 'GCC')
                          : t('صندوق تنمية', 'Development')}
                      </span>
                    </div>
                  </div>
                  <h2 className="font-heading text-base font-bold text-slate-900 mb-1.5">
                    {t(entity.name_ar, entity.name_en)}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(entity.description_ar, entity.description_en)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
