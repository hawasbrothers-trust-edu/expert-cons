import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAppointment,
  validateContactForm,
  validateEmail,
  validatePhone,
  validateStudyStep,
} from './validation';
import type { StudyRequestDraft } from '../types';

const baseDraft: StudyRequestDraft = {
  type: 'comprehensive',
  sector: 'industrial',
  project_name: 'مصنع تعبئة تمور',
  location: 'بني سويف، مصر',
  capital_range: '1M-5M EGP',
  needs_funding: true,
  name: 'أحمد حسن',
  phone: '+201142464520',
  email: 'ahmed@example.com',
  preferred_contact: 'whatsapp',
};

test('validateEmail accepts standard emails and rejects invalid formats', () => {
  assert.equal(validateEmail('info@expertconsu.com'), true);
  assert.equal(validateEmail('bad-email'), false);
  assert.equal(validateEmail(''), false);
});

test('validatePhone validates international and local phone formats', () => {
  assert.equal(validatePhone('+201142464520'), true);
  assert.equal(validatePhone('0114 246 4520'), true);
  assert.equal(validatePhone('1234'), false);
});

test('validateStudyStep enforces required fields at each step', () => {
  assert.equal(validateStudyStep(1, { ...baseDraft, type: '' }).valid, false);
  assert.equal(validateStudyStep(1, baseDraft).valid, true);

  assert.equal(validateStudyStep(2, { ...baseDraft, sector: '' }).valid, false);
  assert.equal(validateStudyStep(2, baseDraft).valid, true);

  assert.equal(validateStudyStep(3, { ...baseDraft, project_name: 'أ' }).valid, false);
  assert.equal(validateStudyStep(3, baseDraft).valid, true);

  assert.equal(validateStudyStep(4, { ...baseDraft, email: 'invalid' }).valid, false);
  assert.equal(validateStudyStep(5, baseDraft).valid, true);
});

test('validateAppointment rejects missing date/time and accepts complete booking', () => {
  const invalid = validateAppointment({
    name: 'محمد علي',
    phone: '01012345678',
    email: 'm@example.com',
    topic: 'مناقشة خط إنتاج',
    date: '',
    time: '10:00',
    duration: 60,
    type: 'online',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.date);

  const valid = validateAppointment({
    name: 'محمد علي',
    phone: '01012345678',
    email: 'm@example.com',
    topic: 'مناقشة خط إنتاج',
    date: '2026-11-20',
    time: '10:00',
    duration: 60,
    type: 'online',
  });
  assert.equal(valid.valid, true);
});

test('validateContactForm validates message length and email', () => {
  const res = validateContactForm({
    name: 'سارة محمود',
    email: 'sara@company.com',
    phone: '+201001234567',
    subject: 'طلب دراسة جدوى',
    message: 'نرغب في إعداد دراسة جدوى شاملة لمشروع طبي متكامل.',
  });
  assert.equal(res.valid, true);
});
