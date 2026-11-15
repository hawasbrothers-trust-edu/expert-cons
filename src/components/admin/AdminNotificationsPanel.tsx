import { BellRing, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import type { NotificationAlertLog, SiteCmsConfig } from '../../types';

interface AdminNotificationsPanelProps {
  cmsDraft: SiteCmsConfig;
  onChange: (updated: SiteCmsConfig) => void;
  logs: NotificationAlertLog[];
  onLogsChange: (logs: NotificationAlertLog[]) => void;
  onNotify: (msg: string) => void;
}

export function AdminNotificationsPanel({
  cmsDraft,
  onChange,
  logs,
  onLogsChange,
  onNotify,
}: AdminNotificationsPanelProps) {
  const { t } = useLanguage();
  const [testing, setTesting] = useState(false);

  const updateNotif = <K extends keyof SiteCmsConfig['notifications']>(
    key: K,
    value: SiteCmsConfig['notifications'][K]
  ) => {
    onChange({
      ...cmsDraft,
      notifications: {
        ...cmsDraft.notifications,
        [key]: value,
      },
    });
  };

  const handleTestTrigger = async () => {
    setTesting(true);
    try {
      const target = cmsDraft.notifications.notification_email.trim() || 'alerts@expertconsu.com';
      const entry = await api.sendTestNotification(target);
      onLogsChange([entry, ...logs]);
      onNotify(
        t(
          `تم إرسال إشعار تجريبي إلى ${target} بنجاح.`,
          `Test notification triggered successfully to ${target}.`
        )
      );
    } finally {
      setTesting(false);
    }
  };

  const toggles: {
    key: 'alert_on_study_request' | 'alert_on_booking' | 'alert_on_contact_message';
    ar: string;
    en: string;
    desc_ar: string;
    desc_en: string;
  }[] = [
    {
      key: 'alert_on_study_request',
      ar: 'تنبيه عند كل دراسة جديدة',
      en: 'Instant Alert on New Study Requests',
      desc_ar: 'إرسال إشعار فوري عند إرسال أي عميل لطلب دراسة جدوى عبر المعالج.',
      desc_en: 'Trigger an instant email alert whenever a client submits the Study Request Wizard.',
    },
    {
      key: 'alert_on_booking',
      ar: 'تنبيه عند كل موعد استشارة',
      en: 'Instant Alert on New Consultation Bookings',
      desc_ar: 'إرسال إشعار فوري عند حجز موعد استشارة جديد أونلاين أو بمقر الشركة.',
      desc_en: 'Trigger an instant email alert for every newly booked consultation slot.',
    },
    {
      key: 'alert_on_contact_message',
      ar: 'تنبيه لرسائل اتصل بنا',
      en: 'Instant Alert on Contact Messages',
      desc_ar: 'إرسال إشعار فوري عند وصول رسالة من صفحة اتصل بنا أو استفسارات خطوط الإنتاج.',
      desc_en: 'Trigger an instant alert when contact form or production line inquiries arrive.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#064E3B]">
                {t('إعدادات البريد والتنبيهات الفورية', 'Email & Instant Notification Settings')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {t(
                  'تحديد البريد العام للعملاء وبريد استقبال تنبيهات الطلبات والحجوزات الجديدة.',
                  'Configure public contact email, alert recipient email, and instant notification triggers.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestTrigger}
            disabled={testing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white text-xs sm:text-sm font-semibold cursor-pointer shrink-0 transition-colors"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>{testing ? t('جاري الإرسال...', 'Sending...') : t('إرسال إشعار تجريبي', 'Trigger Test Notification')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="cms-public-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {t('البريد الإلكتروني الرسمي للمراسلات العامة', 'Public Official Contact Email (Header / Footer)')}
            </label>
            <input
              id="cms-public-email"
              type="email"
              dir="ltr"
              value={cmsDraft.notifications.public_contact_email}
              onChange={(e) => updateNotif('public_contact_email', e.target.value)}
              placeholder="info@expertconsu.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {t('يظهر تلقائياً في الفوتر وصفحة اتصل بنا.', 'Automatically shown in the public Footer and Contact page.')}
            </p>
          </div>

          <div>
            <label
              htmlFor="cms-alert-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {t('بريد استلام إشعارات الطلبات الجديدة', 'Alert Recipient Email for New Submissions')}
            </label>
            <input
              id="cms-alert-email"
              type="email"
              dir="ltr"
              value={cmsDraft.notifications.notification_email}
              onChange={(e) => updateNotif('notification_email', e.target.value)}
              placeholder="alerts@expertconsu.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#059669]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {t('تُرسل إليه التنبيهات الفورية عند تفعيل المفاتيح أدناه.', 'Receives instant notifications when the switches below are enabled.')}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {toggles.map((item) => {
            const enabled = cmsDraft.notifications[item.key];
            return (
              <div
                key={item.key}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-heading text-sm font-bold text-slate-900">
                    {t(item.ar, item.en)}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{t(item.desc_ar, item.desc_en)}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => updateNotif(item.key, !enabled)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    enabled ? 'bg-[#059669]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      enabled ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'ltr:translate-x-1 rtl:-translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Dispatched Alert Log */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-[#059669]" aria-hidden="true" />
          <h3 className="font-heading text-base font-bold text-slate-900">
            {t('سجل التنبيهات الفورية المرسلة', 'Instant Notification Dispatch Log')}
          </h3>
        </div>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            {t(
              'لا توجد إشعارات مسجلة بعد. اضغط "إرسال إشعار تجريبي" لاختبار القناة.',
              'No notifications logged yet. Click "Trigger Test Notification" to verify.'
            )}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{log.subject}</p>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                </div>
                <div className="text-slate-500 tabular-nums shrink-0 text-end">
                  <p className="font-semibold text-[#059669]" dir="ltr">
                    {log.recipient_email}
                  </p>
                  <p>{new Date(log.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
