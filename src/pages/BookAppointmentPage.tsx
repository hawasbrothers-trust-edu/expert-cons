import { Calendar as CalendarIcon, CheckCircle2, Clock, MapPin, Video } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import type { Appointment, AppointmentDraft } from '../types';
import { validateAppointment } from '../utils/validation';

const TIME_SLOTS = ['10:00', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];

function buildUpcomingDays(count = 14) {
  const days: { iso: string; dayNum: string; weekdayAr: string; weekdayEn: string; monthAr: string; monthEn: string }[] = [];
  const base = new Date();
  for (let i = 1; i <= count; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    days.push({
      iso,
      dayNum: String(d.getDate()),
      weekdayAr: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
      weekdayEn: d.toLocaleDateString('en-US', { weekday: 'short' }),
      monthAr: d.toLocaleDateString('ar-EG', { month: 'short' }),
      monthEn: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return days;
}

export function BookAppointmentPage() {
  const { t } = useLanguage();
  const days = useMemo(() => buildUpcomingDays(14), []);

  const [form, setForm] = useState<AppointmentDraft>({
    date: days[0]?.iso || '',
    time: '11:00',
    duration: 30,
    type: 'online',
    name: '',
    phone: '',
    email: '',
    topic: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateAppointment(form);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const saved = await api.createAppointment(form);
      setConfirmed(saved);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="py-16 bg-[#F8FAFC]">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold text-[#059669] mb-2">
              {t('تم تأكيد حجز الموعد', 'Consultation Booked')}
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-[#064E3B] mb-3">
              {t('موعدك الاستشاري محجوز بنجاح', 'Your Consultation Is Scheduled')}
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              {t(
                'سيتم إرسال رابط الاجتماع (Zoom / Google Meet) أو تأكيد الموعد بمقر بني سويف عبر البريد والواتساب.',
                'Your meeting link or Beni Suef office confirmation will be sent shortly via email and WhatsApp.'
              )}
            </p>
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/70 p-4 text-sm text-start space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('التاريخ والوقت', 'Date & Time')}</span>
                <span className="font-bold text-slate-900 tabular-nums" dir="ltr">
                  {confirmed.date} · {confirmed.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('المدة والنوع', 'Duration & Format')}</span>
                <span className="font-semibold text-[#059669]">
                  {confirmed.duration} {t('دقيقة', 'min')} ·{' '}
                  {confirmed.type === 'online' ? t('أونلاين', 'Online') : t('حضوري', 'In-Person')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('الموضوع', 'Topic')}</span>
                <span className="font-medium text-slate-800">{confirmed.topic}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmed(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold cursor-pointer"
              >
                {t('حجز موعد آخر', 'Book Another Slot')}
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white text-sm font-semibold"
              >
                {t('الرئيسية', 'Back Home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#059669] mb-2">
            {t('حجز موعد استشارة', 'Schedule Consultation')}
          </p>
          <h1 className="font-heading text-3xl font-extrabold text-[#064E3B] mb-2">
            {t('احجز جلستك الاستشارية مع خبراء EXPERT', 'Book a Session With EXPERT Consultants')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {t(
              'اختر اليوم والتوقيت المناسبين لمدة 30 أو 60 دقيقة (أونلاين عبر Zoom/Meet أو حضورياً بمقر الشركة في بني سويف).',
              'Pick a convenient date and 30 or 60-minute slot online via Zoom/Meet or in person at our Beni Suef office.'
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar & Slots */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/70 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-[#059669]" aria-hidden="true" />
                <h2 className="font-heading text-base font-bold text-slate-900">
                  {t('1. اختر التاريخ', '1. Select Date')}
                </h2>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((d) => {
                  const active = form.date === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, date: d.iso }))}
                      className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#059669] text-white border-[#059669]'
                          : 'bg-[#F8FAFC] text-slate-800 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="block text-[11px] opacity-85">{t(d.weekdayAr, d.weekdayEn)}</span>
                      <span className="block text-base font-bold tabular-nums">{d.dayNum}</span>
                      <span className="block text-[11px] opacity-85">{t(d.monthAr, d.monthEn)}</span>
                    </button>
                  );
                })}
              </div>
              {errors.date && <p className="text-xs text-red-600 mt-1.5">{errors.date}</p>}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#059669]" aria-hidden="true" />
                <h2 className="font-heading text-base font-bold text-slate-900">
                  {t('2. اختر التوقيت والمدة', '2. Select Time & Duration')}
                </h2>
              </div>

              <div className="inline-flex p-1 bg-slate-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, duration: 30 }))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    form.duration === 30 ? 'bg-white text-[#064E3B] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {t('30 دقيقة (تقييم أولي)', '30 Minutes')}
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, duration: 60 }))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    form.duration === 60 ? 'bg-white text-[#064E3B] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {t('60 دقيقة (استشارة معمقة)', '60 Minutes')}
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const active = form.time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, time: slot }))}
                      className={`py-2.5 px-3 rounded-xl border text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#064E3B] text-white border-[#064E3B]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.time && <p className="text-xs text-red-600 mt-1.5">{errors.time}</p>}
            </div>

            <div>
              <h2 className="font-heading text-base font-bold text-slate-900 mb-3">
                {t('3. نوع اللقاء', '3. Consultation Format')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: 'online' }))}
                  className={`p-4 rounded-xl border text-start flex items-center gap-3 cursor-pointer ${
                    form.type === 'online'
                      ? 'border-[#059669] bg-emerald-50/70'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Video className="w-5 h-5 text-[#059669] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {t('استشارة أونلاين', 'Online Meeting')}
                    </p>
                    <p className="text-xs text-slate-500">Zoom / Google Meet</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: 'in_person' }))}
                  className={`p-4 rounded-xl border text-start flex items-center gap-3 cursor-pointer ${
                    form.type === 'in_person'
                      ? 'border-[#059669] bg-emerald-50/70'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-[#059669] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {t('حضور بمقر الشركة', 'In-Person Office')}
                    </p>
                    <p className="text-xs text-slate-500">{t('بني سويف، مصر', 'Beni Suef, Egypt')}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Applicant Details */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-heading text-base font-bold text-slate-900">
                {t('4. بياناتك الشخصية', '4. Your Contact Details')}
              </h2>

              <div>
                <label htmlFor="apt-name" className="block text-sm font-semibold text-slate-800 mb-1">
                  {t('الاسم الكامل', 'Full Name')}
                </label>
                <input
                  id="apt-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="apt-phone" className="block text-sm font-semibold text-slate-800 mb-1">
                  {t('رقم الهاتف / واتساب', 'Phone / WhatsApp')}
                </label>
                <input
                  id="apt-phone"
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+201142464520"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="apt-email" className="block text-sm font-semibold text-slate-800 mb-1">
                  {t('البريد الإلكتروني', 'Email')}
                </label>
                <input
                  id="apt-email"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="apt-topic" className="block text-sm font-semibold text-slate-800 mb-1">
                  {t('موضوع الاستشارة', 'Consultation Topic')}
                </label>
                <textarea
                  id="apt-topic"
                  rows={3}
                  value={form.topic}
                  onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                  placeholder={t('اشرح بإيجاز فكرة المشروع أو التمويل المطلوب', 'Briefly describe your project or funding goal')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#059669] text-sm"
                />
                {errors.topic && <p className="text-xs text-red-600 mt-1">{errors.topic}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#059669] hover:bg-[#064E3B] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {submitting
                ? t('جاري تأكيد الحجز...', 'Confirming...')
                : t('تأكيد حجز الاستشارة', 'Confirm Appointment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
