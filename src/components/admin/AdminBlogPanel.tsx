import { Edit3, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import type { BlogCategory, BlogPost } from '../../types';
import { resizeImageToDataUrl } from '../../utils/imageUpload';

interface AdminBlogPanelProps {
  posts: BlogPost[];
  onPostsChange: (posts: BlogPost[]) => void;
  onNotify: (msg: string) => void;
}

const EMPTY_DRAFT: Omit<BlogPost, 'id'> = {
  title_ar: '',
  title_en: '',
  excerpt_ar: '',
  excerpt_en: '',
  content_ar: '',
  content_en: '',
  category: 'feasibility',
  author_ar: 'د. بدر حواس — المؤسس والمستشار الاقتصادي',
  author_en: 'Dr. Badr Hawas — Founder & Lead Economist',
  read_minutes: 5,
  image_url: '',
  created_at: new Date().toISOString().split('T')[0],
};

export function AdminBlogPanel({ posts, onPostsChange, onNotify }: AdminBlogPanelProps) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<BlogPost, 'id'>>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories: { id: BlogCategory; ar: string; en: string }[] = [
    { id: 'feasibility', ar: 'دراسات الجدوى', en: 'Feasibility Studies' },
    { id: 'funding', ar: 'التمويل', en: 'Funding' },
    { id: 'entrepreneurship', ar: 'ريادة الأعمال', en: 'Entrepreneurship' },
    { id: 'marketing', ar: 'التسويق', en: 'Marketing' },
  ];

  const openCreate = () => {
    setEditingId(null);
    setDraft({
      ...EMPTY_DRAFT,
      created_at: new Date().toISOString().split('T')[0],
    });
    setError('');
    setIsFormOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setDraft({
      title_ar: post.title_ar,
      title_en: post.title_en,
      excerpt_ar: post.excerpt_ar,
      excerpt_en: post.excerpt_en,
      content_ar: post.content_ar,
      content_en: post.content_en,
      category: post.category,
      author_ar: post.author_ar || '',
      author_en: post.author_en || '',
      read_minutes: post.read_minutes,
      image_url: post.image_url,
      created_at: post.created_at,
    });
    setError('');
    setIsFormOpen(true);
  };

  const handleCoverUpload = async (file?: File) => {
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file, 900);
      setDraft((prev) => ({ ...prev, image_url: dataUrl }));
    } catch {
      setError(t('تعذر قراءة ملف الصورة.', 'Unable to process image file.'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title_ar.trim() || !draft.content_ar.trim()) {
      setError(t('يرجى إدخال عنوان المقال ومحتواه بالعربية على الأقل.', 'Please enter at least the Arabic title and content.'));
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        const updated = await api.updateBlogPost(editingId, draft);
        onPostsChange(posts.map((p) => (p.id === editingId ? updated : p)));
        onNotify(t('تم تحديث المقال ونشر التعديلات.', 'Article updated and published.'));
      } else {
        const created = await api.createBlogPost(draft);
        onPostsChange([created, ...posts]);
        onNotify(t('تم نشر المقال الجديد في المدونة.', 'New article published to blog.'));
      }
      setIsFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteBlogPost(id);
    onPostsChange(posts.filter((p) => p.id !== id));
    onNotify(t('تم حذف المقال من المدونة.', 'Article deleted.'));
  };

  const getCategoryLabel = (cat: BlogCategory) => {
    const found = categories.find((c) => c.id === cat);
    return found ? t(found.ar, found.en) : cat;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#064E3B]">
            {t('إدارة المدونة والمقالات الاقتصادية', 'Blog & Articles CMS')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'أضف مقالات جديدة أو عدّل المقالات المنشورة مع صور الغلاف والكاتب والتصنيف.',
              'Create, edit, or delete bilingual articles with cover images, authors, and categories.'
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{t('إضافة مقال جديد', 'New Article')}</span>
        </button>
      </div>

      {/* Published Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600">
              <tr>
                <th className="py-3.5 px-4 font-semibold">{t('المقال', 'Article')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('التصنيف', 'Category')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('الكاتب', 'Author')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('تاريخ النشر', 'Published')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('إجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-[#064E3B] to-[#059669] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 line-clamp-1">{post.title_ar}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{post.title_en}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#064E3B] text-xs font-semibold">
                      {getCategoryLabel(post.category)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    {t(post.author_ar || 'فريق EXPERT', post.author_en || 'EXPERT Team')}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 tabular-nums">{post.created_at}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(post)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#064E3B] text-xs font-semibold cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t('تعديل', 'Edit')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t('حذف', 'Delete')}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-slate-500">
                    {t('لا توجد مقالات منشورة حالياً.', 'No articles published yet.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-heading text-xl font-bold text-[#064E3B]">
                {editingId ? t('تعديل المقال', 'Edit Article') : t('إضافة مقال جديد', 'Create New Article')}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('عنوان المقال (عربي)', 'Title (Arabic)')}
                  </label>
                  <input
                    type="text"
                    value={draft.title_ar}
                    onChange={(e) => setDraft((p) => ({ ...p, title_ar: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('عنوان المقال (إنجليزي)', 'Title (English)')}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.title_en}
                    onChange={(e) => setDraft((p) => ({ ...p, title_en: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('التصنيف', 'Category')}
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, category: e.target.value as BlogCategory }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#059669]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {t(c.ar, c.en)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('تاريخ النشر', 'Publish Date')}
                    </label>
                    <input
                      type="date"
                      value={draft.created_at}
                      onChange={(e) => setDraft((p) => ({ ...p, created_at: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('دقائق القراءة', 'Read Minutes')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={draft.read_minutes}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, read_minutes: Number(e.target.value) || 5 }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الكاتب (عربي)', 'Author (Arabic)')}
                  </label>
                  <input
                    type="text"
                    value={draft.author_ar || ''}
                    onChange={(e) => setDraft((p) => ({ ...p, author_ar: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('الكاتب (إنجليزي)', 'Author (English)')}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={draft.author_en || ''}
                    onChange={(e) => setDraft((p) => ({ ...p, author_en: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {t('صورة غلاف المقال (رابط أو رفع ملف)', 'Cover Image (URL or File Upload)')}
                  </span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#064E3B] text-white text-xs font-semibold cursor-pointer">
                    <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('رفع صورة', 'Upload Cover')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        handleCoverUpload(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  dir="ltr"
                  value={draft.image_url}
                  onChange={(e) => setDraft((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#059669]"
                />
                {draft.image_url && (
                  <img
                    src={draft.image_url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-32 w-full object-cover rounded-lg border border-slate-200"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('ملخص المقال (عربي)', 'Excerpt (Arabic)')}
                  </label>
                  <textarea
                    rows={2}
                    value={draft.excerpt_ar}
                    onChange={(e) => setDraft((p) => ({ ...p, excerpt_ar: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('ملخص المقال (إنجليزي)', 'Excerpt (English)')}
                  </label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={draft.excerpt_en}
                    onChange={(e) => setDraft((p) => ({ ...p, excerpt_en: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('محتوى المقال الكامل (عربي)', 'Full Content (Arabic)')}
                  </label>
                  <textarea
                    rows={6}
                    value={draft.content_ar}
                    onChange={(e) => setDraft((p) => ({ ...p, content_ar: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('محتوى المقال الكامل (إنجليزي)', 'Full Content (English)')}
                  </label>
                  <textarea
                    rows={6}
                    dir="ltr"
                    value={draft.content_en}
                    onChange={(e) => setDraft((p) => ({ ...p, content_en: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold cursor-pointer"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-bold cursor-pointer"
                >
                  {saving
                    ? t('جاري الحفظ...', 'Saving...')
                    : editingId
                    ? t('حفظ تعديلات المقال', 'Update Article')
                    : t('نشر المقال', 'Publish Article')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
