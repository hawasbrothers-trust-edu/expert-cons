import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCms } from '../context/SiteCmsContext';

export function WhatsAppFloat() {
  const { isRtl, t } = useLanguage();
  const { cms } = useSiteCms();
  const digits = cms.about_contact.whatsapp_number.replace(/[^\d]/g, '') || '201142464520';

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label={t('تواصل عبر واتساب مع EXPERT', 'Chat with EXPERT on WhatsApp')}
      className={`fixed bottom-5 ${isRtl ? 'left-5' : 'right-5'} z-40 w-12 h-12 rounded-full bg-[#059669] hover:bg-[#064E3B] text-white shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]`}
    >
      <MessageCircle className="w-6 h-6" aria-hidden="true" />
    </a>
  );
}
