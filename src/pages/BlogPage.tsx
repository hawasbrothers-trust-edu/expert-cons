import { BookOpen, Clock, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import type { BlogCategory, BlogPost } from '../types';
import { filterBlogPosts } from '../utils/filtering';

export function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<BlogCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    api.listBlogPosts().then(setPosts);
  }, []);

  const categories: { id: BlogCategory | 'all'; ar: string; en: string }[] = [
    { id: 'all', ar: 'جميع المقالات', en: 'All Articles' },
    { id: 'feasibility', ar: 'دراسات الجدوى', en: 'Feasibility Studies' },
    { id: 'funding', ar: 'التمويل', en: 'Funding' },
    { id: 'entrepreneurship', ar: 'ريادة الأعمال', en: 'Entrepreneurship' },
    { id: 'marketing', ar: 'التسويق', en: 'Marketing' },
  ];

  const categoryLabel = (cat: BlogCategory) => {
    const found = categories.find((c) => c.id === cat);
    return found ? t(found.ar, found.en) : cat;
  };

  const filtered = filterBlogPosts(posts, category, query);

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 sm:p-10">
          <p className="text-xs font-semibold text-[#059669] mb-2">
            {t('المعرفة الاقتصادية', 'Economic Insights')}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#064E3B] mb-3">
            {t('مدونة EXPERT للاستشارات ودراسات الجدوى', 'EXPERT Advisory & Feasibility Journal')}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl">
            {t(
              'مقالات تحليلية وأدلة عملية حول تمويل المشاريع، خطوط الإنتاج، واقتصاديات التوسع في مصر والخليج.',
              'Practical guides on bankable feasibility studies, machinery procurement, and regional expansion.'
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  category === cat.id
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {t(cat.ar, cat.en)}
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
              placeholder={t('ابحث في المقالات...', 'Search articles...')}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#059669]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-700">
              {t('لا توجد مقالات في هذا التصنيف حالياً.', 'No articles published in this category yet.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:border-[#059669]/50"
              >
                <div>
                  <div className="h-36 bg-gradient-to-br from-[#064E3B] to-[#059669] p-6 flex items-end">
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      {categoryLabel(post.category)}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 tabular-nums">
                      <span>{post.created_at}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {post.read_minutes} {t('دقائق قراءة', 'min read')}
                      </span>
                    </div>
                    <h2 className="font-heading text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {t(post.title_ar, post.title_en)}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {t(post.excerpt_ar, post.excerpt_en)}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="text-sm font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
                  >
                    {t('قراءة المقال كاملاً', 'Read Full Article')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#059669] font-semibold mb-2">
                  <span>{categoryLabel(activePost.category)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{activePost.created_at}</span>
                </div>
                <h2 id="blog-modal-title" className="font-heading text-xl sm:text-2xl font-bold text-[#064E3B]">
                  {t(activePost.title_ar, activePost.title_en)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                aria-label={t('إغلاق', 'Close')}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {t(activePost.content_ar, activePost.content_en)}
            </div>
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/request-study"
                className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold"
              >
                {t('اطلب دراسة جدوى لمشروعك', 'Request a Feasibility Study')}
              </Link>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold cursor-pointer"
              >
                {t('إغلاق', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
