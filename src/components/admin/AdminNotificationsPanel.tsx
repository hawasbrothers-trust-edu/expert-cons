import { BellRing, CheckCircle2, Mail, Send, XCircle } from 'lucide-react';
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
      const result = await api.sendTestNotification(target);
      onLogsChange([result.log, ...logs]);
      if (result.delivered) {
        onNotify(
          t(
            `تم إرسال الإشعار التجريبي فعلياً عبر Web3Forms إلى (${target}).`,
            `Real test email dispatched via Web3Forms (${result.apiMessage}).`
          )
        );
      } else {
        onNotify(
          t(
            `تم تسجيل المحاولة ولكن تعذر الإرسال عبر Web3Forms: ${result.apiMessage}`,
            `Web3Forms dispatch error: ${result.apiMessage}`
          )
        );
      }
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
      ar: 'تنبيه عند كل طلب دراسة جدوى جديد',
      en: 'Instant Email on New Study Requests',
      desc_ar: 'إرسال رسالة بريد إلكتروني فورية تتضمن بيانات العميل والمشروع والقطاع ورأس المال والتمويل.',
      desc_en: 'Send an immediate Web3Forms email with client contact, sector, project name, capital, and funding status.',
    },
    {
      key: 'alert_on_booking',
      ar: 'تنبيه عند كل حجز موعد استشارة',
      en: 'Instant Email on New Consultation Bookings',
      desc_ar: 'إرسال إشعار فوري يتضمن اسم العميل والهاتف والموضوع والتاريخ والوقت ونوع الاجتماع.',
      desc_en: 'Send an immediate Web3Forms email with client name, phone, topic, date, time, and meeting type.',
    },
    {
      key: 'alert_on_contact_message',
      ar: 'تنبيه لرسائل صفحة اتصل بنا',
      en: 'Instant Email on Contact Messages',
      desc_ar: 'إرسال رسالة فورية عند وصول استفسار من صفحة اتصل بنا متضمنة الاسم والهاتف والموضوع والنص.',
      desc_en: 'Send an immediate Web3Forms email with sender name, email, phone, subject, and message body.',
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
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-[#064E3B]">
                  {t('إعدادات البريد والتنبيهات الفورية', 'Email & Instant Notification Settings')}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#059669] border border-emerald-200 text-[11px] font-bold">
                  Web3Forms API
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t(
                  'ربط إرسال البريد الإلكتروني الفعلي عبر Web3Forms لطلبات الدراسات والمواعيد ورسائل التواصل.',
                  'Configure public contact email, target alert inbox, and live Web3Forms email triggers.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestTrigger}
            disabled={testing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold cursor-pointer shrink-0 transition-colors"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>
              {testing
                ? t('جاري الإرسال الفعلي...', 'Sending Live Email...')
                : t('إرسال إشعار تجريبي الآن', 'Send Test Notification Now')}
            </span>
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
              {t('يظهر تلقائياً في الهيدر والفوتر وصفحة اتصل بنا.', 'Automatically shown in the Header, Footer, and Contact page.')}
            </p>
          </div>

          <div>
            <label
              htmlFor="cms-alert-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {t('بريد استلام إشعارات الطلبات', 'Order & Alert Recipient Email')}
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
              {t('البريد المستهدف لتضمينه في إشعارات الطلبات والحجوزات عبر Web3Forms.', 'Target inbox referenced in instant Web3Forms notification dispatches.')}
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
            {t('سجل التنبيهات الفورية المرسلة (Web3Forms)', 'Instant Web3Forms Email Dispatch Log')}
          </h3>
        </div>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            {t(
              'لا توجد إشعارات مسجلة بعد. اضغط "إرسال إشعار تجريبي الآن" للتحقق من الإرسال الفعلي.',
              'No notifications logged yet. Click "Send Test Notification Now" to verify live delivery.'
            )}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.slice(0, 12).map((log) => (
              <div
                key={log.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-900">{log.subject}</p>
                    {log.delivery_status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-semibold text-[11px]">
                        <XCircle className="w-3 h-3" aria-hidden="true" />
                        <span>{t('فشل الإرسال', 'Failed')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[#059669] font-semibold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        <span>{t('تم الإرسال الفعلي', 'Delivered')}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                  {log.api_message && (
                    <p className="text-[11px] text-slate-400" dir="ltr">
                      Web3Forms: {log.api_message}
                    </p>
                  )}
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
