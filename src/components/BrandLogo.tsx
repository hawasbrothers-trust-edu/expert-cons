import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/bar_logo_99eb319b.png';

export function BrandLogo({
  variant = 'header',
  to = '/',
}: {
  variant?: 'header' | 'footer';
  to?: string;
}) {
  const { t } = useLanguage();

  if (variant === 'footer') {
    return (
      <Link
        to={to}
        className="inline-flex items-center gap-3 bg-white rounded-xl px-3.5 py-2 shadow-sm hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        aria-label="EXPERT Economic Consultation"
      >
        <img
          src={OFFICIAL_LOGO_URL}
          alt="EXPERT"
          className="w-10 h-10 object-contain shrink-0"
        />
        <div className="leading-tight">
          <span className="block font-heading text-lg font-extrabold tracking-tight text-[#064E3B]">
            EXPERT
          </span>
          <span className="block text-[11px] font-semibold text-[#059669]">
            {t('للاستشارات الاقتصادية', 'Economic Consultation')}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg py-1"
      aria-label="EXPERT Economic Consultation"
    >
      <img
        src={OFFICIAL_LOGO_URL}
        alt="EXPERT"
        className="w-10 h-10 object-contain shrink-0 mix-blend-multiply"
      />
      <div className="leading-tight">
        <span className="block font-heading text-base sm:text-lg font-extrabold tracking-tight text-[#064E3B]">
          EXPERT
        </span>
        <span className="block text-[10px] sm:text-[11px] font-semibold text-[#059669]">
          {t('للاستشارات الاقتصادية', 'Economic Consultation')}
        </span>
      </div>
    </Link>
  );
}
