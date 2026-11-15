import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SiteCmsConfig } from '../../types';

interface AdminSiteCmsPanelProps {
  cmsDraft: SiteCmsConfig;
  onChange: (updated: SiteCmsConfig) => void;
}

type CmsSubSection = 'sections' | 'metrics' | 'sectors_services' | 'about_contact';

export function AdminSiteCmsPanel({ cmsDraft, onChange }: AdminSiteCmsPanelProps) {
  const { t } = useLanguage();
  const [sub, setSub] = useState<CmsSubSection>('sections');

  const subTabs: { id: CmsSubSection; ar: string; en: string }[] = [
    { id: 'sections', ar: 'النصوص الرئيسية والترحيب', en: 'Hero & Welcoming' },
    { id: 'metrics', ar: 'مؤشرات الأرقام', en: 'Metrics & Numbers' },
    { id: 'sectors_services', ar: 'القطاعات والخدمات والأسعار', en: 'Sectors, Services & Pricing' },
    { id: 'about_contact', ar: 'عن الشركة والتواصل', en: 'About & Contact' },
  ];

  const updateHero = (
    field: Exclude<keyof SiteCmsConfig['hero'], 'value_props'>,
    value: string
  ) => {
    onChange({
      ...cmsDraft,
      hero: { ...cmsDraft.hero, [field]: value },
    });
  };

  const updateValueProp = (
    index: number,
    field: 'title_ar' | 'title_en' | 'desc_ar' | 'desc_en',
    value: string
  ) => {
    const next = cmsDraft.hero.value_props.map((vp, idx) =>
      idx === index ? { ...vp, [field]: value } : vp
    );
    onChange({
      ...cmsDraft,
      hero: { ...cmsDraft.hero, value_props: next },
    });
  };

  const updateMetric = (index: number, field: 'target' | 'label_ar' | 'label_en', value: string | number) => {
    const next = cmsDraft.metrics.map((m, idx) =>
      idx === index ? { ...m, [field]: field === 'target' ? Number(value) || 0 : value } : m
    );
    onChange({ ...cmsDraft, metrics: next });
  };

  const updateSector = (
    index: number,
    field: 'name_ar' | 'name_en' | 'description_ar' | 'description_en' | 'price_ar' | 'price_en',
    value: string
  ) => {
    const next = cmsDraft.sectors.map((s, idx) => (idx === index ? { ...s, [field]: value } : s));
    onChange({ ...cmsDraft, sectors: next });
  };

  const updateService = (
    index: number,
    field:
      | 'title_ar'
      | 'title_en'
      | 'description_ar'
      | 'description_en'
      | 'deliverable_ar'
      | 'deliverable_en'
      | 'price_ar'
      | 'price_en',
    value: string
  ) => {
    const next = cmsDraft.services.map((s, idx) => (idx === index ? { ...s, [field]: value } : s));
    onChange({ ...cmsDraft, services: next });
  };

  const updateAbout = (field: keyof SiteCmsConfig['about_contact'], value: string) => {
    onChange({
      ...cmsDraft,
      about_contact: { ...cmsDraft.about_contact, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-wrap gap-2">
        {subTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSub(item.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              sub === item.id
                ? 'bg-[#059669] text-white'
                : 'bg-[#F8FAFC] text-slate-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            {t(item.ar, item.en)}
          </button>
        ))}
      </div>

      {/* 1. Hero & Welcome Sections */}
      {sub === 'sections' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-6">
          <div>
            <h3 className="font-heading text-base font-bold text-[#064E3B] mb-4">
              {t('نصوص الواجهة الرئيسية (Hero Section)', 'Hero Headlines & Calls-to-Action')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('العنوان الرئيسي (عربي)', 'Hero Headline (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.headline_ar}
                  onChange={(e) => updateHero('headline_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('العنوان الرئيسي (إنجليزي)', 'Hero Headline (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.hero.headline_en}
                  onChange={(e) => updateHero('headline_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('الشريط التعريفي العلوي (عربي)', 'Hero Badge (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.badge_ar}
                  onChange={(e) => updateHero('badge_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('الشريط التعريفي العلوي (إنجليزي)', 'Hero Badge (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.hero.badge_en}
                  onChange={(e) => updateHero('badge_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('النص الفرعي التوضيحي (عربي)', 'Hero Subheading (Arabic)')}
                </label>
                <textarea
                  rows={3}
                  value={cmsDraft.hero.subheading_ar}
                  onChange={(e) => updateHero('subheading_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('النص الفرعي التوضيحي (إنجليزي)', 'Hero Subheading (English)')}
                </label>
                <textarea
                  rows={3}
                  dir="ltr"
                  value={cmsDraft.hero.subheading_en}
                  onChange={(e) => updateHero('subheading_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('زر الدعوة الأساسي (عربي)', 'Primary CTA (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.cta_primary_ar}
                  onChange={(e) => updateHero('cta_primary_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('زر الدعوة الأساسي (إنجليزي)', 'Primary CTA (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.hero.cta_primary_en}
                  onChange={(e) => updateHero('cta_primary_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('زر الدعوة الثانوي (عربي)', 'Secondary CTA (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.cta_secondary_ar}
                  onChange={(e) => updateHero('cta_secondary_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('زر الدعوة الثانوي (إنجليزي)', 'Secondary CTA (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.hero.cta_secondary_en}
                  onChange={(e) => updateHero('cta_secondary_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-heading text-base font-bold text-[#064E3B] mb-4">
              {t('رسالة الترحيب وبانر الإطلاق', 'Welcoming & Launch Banner')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('عنوان قسم لماذا EXPERT (عربي)', 'Why EXPERT Title (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.why_title_ar}
                  onChange={(e) => updateHero('why_title_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('عنوان قسم لماذا EXPERT (إنجليزي)', 'Why EXPERT Title (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.hero.why_title_en}
                  onChange={(e) => updateHero('why_title_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('عنوان رسالة الترحيب الختامية (عربي)', 'Welcome Banner Title (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.welcome_title_ar}
                  onChange={(e) => updateHero('welcome_title_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('عنوان رسالة الترحيب الختامية (إنجليزي)', 'Welcome Banner Title (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.hero.welcome_title_en}
                  onChange={(e) => updateHero('welcome_title_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('وصف رسالة الترحيب (عربي)', 'Welcome Description (Arabic)')}
                </label>
                <textarea
                  rows={2}
                  value={cmsDraft.hero.welcome_desc_ar}
                  onChange={(e) => updateHero('welcome_desc_ar', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('وصف رسالة الترحيب (إنجليزي)', 'Welcome Description (English)')}
                </label>
                <textarea
                  rows={2}
                  dir="ltr"
                  value={cmsDraft.hero.welcome_desc_en}
                  onChange={(e) => updateHero('welcome_desc_en', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-heading text-base font-bold text-[#064E3B] mb-4">
              {t('بطاقات القيمة المضافة الـ 4 (لماذا EXPERT)', '4 Value Propositions (Why EXPERT)')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsDraft.hero.value_props.map((vp, idx) => (
                <div
                  key={vp.num}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-2.5"
                >
                  <p className="text-xs font-bold text-[#059669] tabular-nums">{vp.num}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={vp.title_ar}
                      onChange={(e) => updateValueProp(idx, 'title_ar', e.target.value)}
                      placeholder="العنوان (عربي)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={vp.title_en}
                      onChange={(e) => updateValueProp(idx, 'title_en', e.target.value)}
                      placeholder="Title (English)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={vp.desc_ar}
                    onChange={(e) => updateValueProp(idx, 'desc_ar', e.target.value)}
                    placeholder="الوصف (عربي)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={vp.desc_en}
                    onChange={(e) => updateValueProp(idx, 'desc_en', e.target.value)}
                    placeholder="Description (English)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Metrics Editor */}
      {sub === 'metrics' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
          <h3 className="font-heading text-base font-bold text-[#064E3B]">
            {t('تعديل مؤشرات الإنجاز والأرقام الرئيسية', 'Homepage Key Metrics Editor')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsDraft.metrics.map((metric, idx) => (
              <div
                key={metric.key}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الرقم المستهدف (+)', 'Target Value (+)')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    dir="ltr"
                    value={metric.target}
                    onChange={(e) => updateMetric(idx, 'target', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold tabular-nums focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('التسمية (عربي)', 'Label (Arabic)')}
                    </label>
                    <input
                      type="text"
                      value={metric.label_ar}
                      onChange={(e) => updateMetric(idx, 'label_ar', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('التسمية (إنجليزي)', 'Label (English)')}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={metric.label_en}
                      onChange={(e) => updateMetric(idx, 'label_en', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sectors & Services Editor */}
      {sub === 'sectors_services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#064E3B]">
              {t('القطاعات الاستثمارية الـ 11 (الأوصاف والأسعار)', '11 Economic Sectors (Descriptions & Pricing)')}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cmsDraft.sectors.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={sec.name_ar}
                      onChange={(e) => updateSector(idx, 'name_ar', e.target.value)}
                      placeholder="الاسم بالعربية"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={sec.name_en}
                      onChange={(e) => updateSector(idx, 'name_en', e.target.value)}
                      placeholder="English Name"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={sec.price_ar}
                      onChange={(e) => updateSector(idx, 'price_ar', e.target.value)}
                      placeholder="السعر (عربي)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-[#064E3B] font-semibold"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={sec.price_en}
                      onChange={(e) => updateSector(idx, 'price_en', e.target.value)}
                      placeholder="Pricing (English)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-[#064E3B] font-semibold"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={sec.description_ar}
                    onChange={(e) => updateSector(idx, 'description_ar', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={sec.description_en}
                    onChange={(e) => updateSector(idx, 'description_en', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#064E3B]">
              {t('الخدمات الاستشارية الـ 12 (الأوصاف والمخرجات والأسعار)', '12 Consulting Services (Descriptions & Pricing)')}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cmsDraft.services.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#059669]">
                    <span>#{srv.code}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={srv.title_ar}
                      onChange={(e) => updateService(idx, 'title_ar', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={srv.title_en}
                      onChange={(e) => updateService(idx, 'title_en', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={srv.price_ar}
                      onChange={(e) => updateService(idx, 'price_ar', e.target.value)}
                      placeholder="السعر (عربي)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-[#064E3B] font-semibold"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={srv.price_en}
                      onChange={(e) => updateService(idx, 'price_en', e.target.value)}
                      placeholder="Price (English)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-[#064E3B] font-semibold"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={srv.description_ar}
                    onChange={(e) => updateService(idx, 'description_ar', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={srv.description_en}
                    onChange={(e) => updateService(idx, 'description_en', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={srv.deliverable_ar}
                      onChange={(e) => updateService(idx, 'deliverable_ar', e.target.value)}
                      placeholder="المخرج (عربي)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={srv.deliverable_en}
                      onChange={(e) => updateService(idx, 'deliverable_en', e.target.value)}
                      placeholder="Deliverable (EN)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. About & Contact Editor */}
      {sub === 'about_contact' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-5">
          <h3 className="font-heading text-base font-bold text-[#064E3B]">
            {t('قصة الشركة والرسالة وبيانات التواصل', 'Company Story, Mission & Contact Details')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('قصة الشركة (عربي)', 'Company Story (Arabic)')}
              </label>
              <textarea
                rows={3}
                value={cmsDraft.about_contact.story_ar}
                onChange={(e) => updateAbout('story_ar', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('قصة الشركة (إنجليزي)', 'Company Story (English)')}
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={cmsDraft.about_contact.story_en}
                onChange={(e) => updateAbout('story_en', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('رسالة الشركة (عربي)', 'Mission Statement (Arabic)')}
              </label>
              <textarea
                rows={2}
                value={cmsDraft.about_contact.mission_ar}
                onChange={(e) => updateAbout('mission_ar', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('رسالة الشركة (إنجليزي)', 'Mission Statement (English)')}
              </label>
              <textarea
                rows={2}
                dir="ltr"
                value={cmsDraft.about_contact.mission_en}
                onChange={(e) => updateAbout('mission_en', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('نبذة الفوتر (عربي)', 'Footer Bio (Arabic)')}
              </label>
              <textarea
                rows={2}
                value={cmsDraft.about_contact.footer_tagline_ar}
                onChange={(e) => updateAbout('footer_tagline_ar', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('نبذة الفوتر (إنجليزي)', 'Footer Bio (English)')}
              </label>
              <textarea
                rows={2}
                dir="ltr"
                value={cmsDraft.about_contact.footer_tagline_en}
                onChange={(e) => updateAbout('footer_tagline_en', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('رقم الهاتف الأساسي', 'Primary Phone Number')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={cmsDraft.about_contact.phone_primary}
                onChange={(e) => updateAbout('phone_primary', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#059669]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('رقم الهاتف الثانوي', 'Secondary Phone Number')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={cmsDraft.about_contact.phone_secondary}
                onChange={(e) => updateAbout('phone_secondary', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('رقم الواتساب (دولي بدون +)', 'WhatsApp Number (digits only)')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={cmsDraft.about_contact.whatsapp_number}
                onChange={(e) => updateAbout('whatsapp_number', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#059669]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('العنوان (عربي)', 'Address (Arabic)')}
                </label>
                <input
                  type="text"
                  value={cmsDraft.about_contact.address_ar}
                  onChange={(e) => updateAbout('address_ar', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('العنوان (إنجليزي)', 'Address (English)')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsDraft.about_contact.address_en}
                  onChange={(e) => updateAbout('address_en', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <h4 className="font-heading text-sm font-bold text-[#064E3B] mb-3">
              {t('روابط حسابات التواصل الاجتماعي', 'Official Social Media Links')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook</label>
                <input
                  type="url"
                  dir="ltr"
                  value={cmsDraft.about_contact.social_facebook}
                  onChange={(e) => updateAbout('social_facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
                <input
                  type="url"
                  dir="ltr"
                  value={cmsDraft.about_contact.social_instagram}
                  onChange={(e) => updateAbout('social_instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  dir="ltr"
                  value={cmsDraft.about_contact.social_linkedin}
                  onChange={(e) => updateAbout('social_linkedin', e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube</label>
                <input
                  type="url"
                  dir="ltr"
                  value={cmsDraft.about_contact.social_youtube}
                  onChange={(e) => updateAbout('social_youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#059669]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">X (Twitter)</label>
                <input
                  type="url"
                  dir="ltr"
                  value={cmsDraft.about_contact.social_x}
                  onChange={(e) => updateAbout('social_x', e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
