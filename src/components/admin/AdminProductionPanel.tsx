import { ExternalLink, ImagePlus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_SITE_CMS_CONFIG } from '../../data/catalog';
import type { ProductionLineItem, ProductionLineTabKey, SiteCmsConfig } from '../../types';
import { resizeImageToDataUrl } from '../../utils/imageUpload';

interface AdminProductionPanelProps {
  cmsDraft: SiteCmsConfig;
  onChange: (updated: SiteCmsConfig) => void;
  onNotify: (msg: string) => void;
}

export function AdminProductionPanel({
  cmsDraft,
  onChange,
  onNotify,
}: AdminProductionPanelProps) {
  const { t } = useLanguage();
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({});

  const updateTabImage = (tabId: ProductionLineTabKey, imageUrl: string) => {
    const nextTabs = cmsDraft.production_tabs.map((tb) =>
      tb.id === tabId ? { ...tb, image_url: imageUrl } : tb
    );
    onChange({ ...cmsDraft, production_tabs: nextTabs });
  };

  const updateLineField = (
    lineId: string,
    field: keyof ProductionLineItem,
    value: string
  ) => {
    const nextLines = cmsDraft.production_lines.map((pl) =>
      pl.id === lineId ? { ...pl, [field]: value } : pl
    );
    onChange({ ...cmsDraft, production_lines: nextLines });
  };

  const handleUploadTab = async (tabId: ProductionLineTabKey, file?: File) => {
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, 480);
    updateTabImage(tabId, dataUrl);
    onNotify(t('تم تحديث صورة التبويب (اضغط حفظ كافة التغييرات للتثبيت).', 'Tab image updated (click Save All Changes to publish).'));
  };

  const handleUploadLine = async (lineId: string, file?: File) => {
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, 840);
    updateLineField(lineId, 'image_url', dataUrl);
    onNotify(t('تم تحديث صورة خط الإنتاج (اضغط حفظ كافة التغييرات للتثبيت).', 'Production line image updated (click Save All Changes to publish).'));
  };

  const handleResetDefaults = () => {
    onChange({
      ...cmsDraft,
      production_lines: DEFAULT_SITE_CMS_CONFIG.production_lines,
      production_tabs: DEFAULT_SITE_CMS_CONFIG.production_tabs,
    });
    setUrlDrafts({});
    onNotify(t('تمت استعادة الصور والبيانات الافتراضية لخطوط الإنتاج.', 'Production lines reset to defaults.'));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#064E3B]">
            {t('إدارة خطوط الإنتاج والصور الواقعية', 'Production Lines Details & Media')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'تحكم في بيانات خطوط الإنتاج (العناوين، الطاقة، المنشأ، الأسعار، الوصف) وصور التبويبات والبلوكات.',
              'Edit production line details, pricing, and thumbnail/banner images for all tabs and blocks.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/production-lines"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('معاينة الصفحة', 'Preview Page')}</span>
          </Link>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('استعادة الافتراضي', 'Reset Defaults')}</span>
          </button>
        </div>
      </div>

      {/* Category Tab Thumbnails */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
        <h3 className="font-heading text-base font-bold text-slate-900">
          {t('صور تبويبات خطوط الإنتاج (4 تبويبات)', 'Category Tab Thumbnails (4 Tabs)')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cmsDraft.production_tabs.map((cat) => {
            const draftKey = `tab:${cat.id}`;
            const defaultTab = DEFAULT_SITE_CMS_CONFIG.production_tabs.find((d) => d.id === cat.id);
            return (
              <div
                key={cat.id}
                className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <p className="font-heading text-sm font-bold text-slate-900 mb-2">
                    {t(cat.ar, cat.en)}
                  </p>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-2">
                    <img
                      src={cat.image_url}
                      alt={t(cat.ar, cat.en)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#064E3B] text-white text-xs font-semibold cursor-pointer">
                      <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t('رفع صورة', 'Upload')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          handleUploadTab(cat.id, e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {defaultTab && cat.image_url !== defaultTab.image_url && (
                      <button
                        type="button"
                        onClick={() => updateTabImage(cat.id, defaultTab.image_url)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                        title={t('استعادة الافتراضي', 'Reset Default')}
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      dir="ltr"
                      value={urlDrafts[draftKey] || ''}
                      onChange={(e) =>
                        setUrlDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
                      }
                      placeholder="https://..."
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (urlDrafts[draftKey] || '').trim();
                        if (val) {
                          updateTabImage(cat.id, val);
                          setUrlDrafts((prev) => ({ ...prev, [draftKey]: '' }));
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      {t('تطبيق', 'Set')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Line Blocks Details + Images */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
        <h3 className="font-heading text-base font-bold text-slate-900">
          {t('تفاصيل وصور بلوكات خطوط الإنتاج (9 خطوط)', 'Production Line Blocks Details & Media')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cmsDraft.production_lines.map((line) => {
            const draftKey = `item:${line.id}`;
            const defaultLine = DEFAULT_SITE_CMS_CONFIG.production_lines.find((d) => d.id === line.id);
            return (
              <div
                key={line.id}
                className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={line.image_url}
                      alt={t(line.title_ar, line.title_en)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#064E3B] text-white text-xs font-semibold cursor-pointer">
                      <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t('تغيير الصورة', 'Change Photo')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          handleUploadLine(line.id, e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {defaultLine && line.image_url !== defaultLine.image_url && (
                      <button
                        type="button"
                        onClick={() => updateLineField(line.id, 'image_url', defaultLine.image_url)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                        title={t('استعادة الصورة الافتراضية', 'Reset Image')}
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      dir="ltr"
                      value={urlDrafts[draftKey] || ''}
                      onChange={(e) =>
                        setUrlDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
                      }
                      placeholder={t('رابط صورة https://...', 'Image URL https://...')}
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (urlDrafts[draftKey] || '').trim();
                        if (val) {
                          updateLineField(line.id, 'image_url', val);
                          setUrlDrafts((prev) => ({ ...prev, [draftKey]: '' }));
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      {t('تطبيق', 'Set')}
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/70">
                    <input
                      type="text"
                      value={line.title_ar}
                      onChange={(e) => updateLineField(line.id, 'title_ar', e.target.value)}
                      placeholder="اسم خط الإنتاج (عربي)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={line.title_en}
                      onChange={(e) => updateLineField(line.id, 'title_en', e.target.value)}
                      placeholder="Line Title (English)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={line.capacity_ar}
                        onChange={(e) => updateLineField(line.id, 'capacity_ar', e.target.value)}
                        placeholder="الطاقة الإنتاجية"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                      />
                      <input
                        type="text"
                        value={line.price_ar || ''}
                        onChange={(e) => updateLineField(line.id, 'price_ar', e.target.value)}
                        placeholder="السعر / التكلفة"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] text-[#064E3B] font-semibold"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={line.description_ar}
                      onChange={(e) => updateLineField(line.id, 'description_ar', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
