import type { AppointmentDraft, StudyRequestDraft } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface ContactDraft {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-()+]/g, '');
  return digits.length >= 8 && digits.length <= 15 && /^\d+$/.test(digits);
}

export function validateStudyStep(step: number, data: StudyRequestDraft): ValidationResult {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!data.type) {
      errors.type = 'يرجى اختيار نوع دراسة الجدوى المطلوبة';
    }
  } else if (step === 2) {
    if (!data.sector) {
      errors.sector = 'يرجى تحديد القطاع الاستثماري للمشروع';
    }
  } else if (step === 3) {
    if (!data.project_name.trim() || data.project_name.trim().length < 2) {
      errors.project_name = 'يرجى إدخال اسم المشروع (حرفان على الأقل)';
    }
    if (!data.location.trim() || data.location.trim().length < 2) {
      errors.location = 'يرجى تحديد موقع المشروع أو الدولة';
    }
    if (!data.capital_range) {
      errors.capital_range = 'يرجى اختيار نطاق رأس المال التقديري';
    }
  } else if (step === 4) {
    if (!data.name.trim() || data.name.trim().length < 2) {
      errors.name = 'يرجى إدخال الاسم الكامل';
    }
    if (!validatePhone(data.phone)) {
      errors.phone = 'يرجى إدخال رقم هاتف صحيح';
    }
    if (!validateEmail(data.email)) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
  } else if (step === 5) {
    for (let s = 1; s <= 4; s += 1) {
      const res = validateStudyStep(s, data);
      Object.assign(errors, res.errors);
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAppointment(data: AppointmentDraft): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.date) {
    errors.date = 'يرجى اختيار تاريخ الموعد';
  }
  if (!data.time) {
    errors.time = 'يرجى اختيار التوقيت المناسب';
  }
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'يرجى إدخال الاسم الكامل';
  }
  if (!validatePhone(data.phone)) {
    errors.phone = 'يرجى إدخال رقم هاتف صحيح';
  }
  if (!validateEmail(data.email)) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
  }
  if (!data.topic.trim() || data.topic.trim().length < 4) {
    errors.topic = 'يرجى توضيح موضوع الاستشارة باختصار';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateContactForm(data: ContactDraft): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'يرجى إدخال الاسم الكامل';
  }
  if (!validateEmail(data.email)) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
  }
  if (!validatePhone(data.phone)) {
    errors.phone = 'يرجى إدخال رقم هاتف صحيح';
  }
  if (!data.subject.trim() || data.subject.trim().length < 3) {
    errors.subject = 'يرجى إدخال عنوان الرسالة';
  }
  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'يرجى كتابة تفاصيل رسالتك (10 أحرف على الأقل)';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
