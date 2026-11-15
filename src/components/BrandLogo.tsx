import { Link } from 'react-router-dom';

export const OFFICIAL_LOGO_URL =
  '/assets/aistudio/expert_economic_consultation_logo_1794711344975_324a0e36.jpg';

export function BrandLogo({
  variant = 'header',
  to = '/',
}: {
  variant?: 'header' | 'footer';
  to?: string;
}) {
  if (variant === 'footer') {
    return (
      <Link
        to={to}
        className="inline-flex items-center justify-center bg-white rounded-xl px-3 py-1.5 shadow-sm hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        aria-label="EXPERT Economic Consultation"
      >
        <div className="h-14 w-[148px] overflow-hidden flex items-center justify-center">
          <img
            src={OFFICIAL_LOGO_URL}
            alt="EXPERT Economic Consultation"
            referrerPolicy="no-referrer"
            className="w-[154px] h-[154px] max-w-none object-contain"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className="inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg"
      aria-label="EXPERT Economic Consultation"
    >
      <div className="h-12 w-[132px] overflow-hidden flex items-center justify-center">
        <img
          src={OFFICIAL_LOGO_URL}
          alt="EXPERT Economic Consultation"
          referrerPolicy="no-referrer"
          className="w-[144px] h-[144px] max-w-none object-contain mix-blend-multiply"
        />
      </div>
    </Link>
  );
}
