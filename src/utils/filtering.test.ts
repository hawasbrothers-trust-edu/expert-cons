import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
  exportAppointmentsToCsv,
  exportRequestsToCsv,
  filterAppointments,
  filterBlogPosts,
  filterFundingEntities,
  filterStudyRequests,
  getStudyStageIndex,
  sortStudyRequests,
} from './filtering';
import type { Appointment, BlogPost, FundingEntity, StudyRequest } from '../types';

const sampleEntities: FundingEntity[] = [
  {
    id: '1',
    code: 'NBE',
    name_ar: 'البنك الأهلي المصري',
    name_en: 'National Bank of Egypt',
    category: 'egyptian',
    country_ar: 'مصر',
    country_en: 'Egypt',
    description_ar: 'تمويل المشروعات الصناعية والتجارية',
    description_en: 'Industrial and commercial project finance',
    accent: '#059669',
  },
  {
    id: '2',
    code: 'SNB',
    name_ar: 'البنك الأهلي السعودي',
    name_en: 'Saudi National Bank',
    category: 'gulf',
    country_ar: 'السعودية',
    country_en: 'Saudi Arabia',
    description_ar: 'تمويل الشركات والمشاريع الكبرى',
    description_en: 'Corporate and mega-project financing',
    accent: '#064E3B',
  },
];

const samplePosts: BlogPost[] = [
  {
    id: 'p1',
    title_ar: 'كيف تعد دراسة جدوى مقبولة لدى البنوك؟',
    title_en: 'How to Prepare a Bankable Feasibility Study',
    excerpt_ar: 'دليل عملي للمستثمرين.',
    excerpt_en: 'Practical guide for investors.',
    content_ar: 'تفاصيل المقال',
    content_en: 'Article body',
    category: 'funding',
    read_minutes: 5,
    image_url: '',
    created_at: '2026-11-01',
  },
];

const sampleRequests: StudyRequest[] = [
  {
    id: 'r1',
    type: 'comprehensive',
    sector: 'industrial',
    project_name: 'ألفا للصناعات',
    location: 'القاهرة',
    capital_range: '5M-20M EGP',
    needs_funding: true,
    name: 'طارق',
    phone: '01142464520',
    email: 'tarek@example.com',
    status: 'preparing',
    created_at: '2026-11-10T10:00:00Z',
  },
  {
    id: 'r2',
    type: 'economic',
    sector: 'medical',
    project_name: 'مركز الشفاء الطبي',
    location: 'بني سويف',
    capital_range: '1M-5M EGP',
    needs_funding: false,
    name: 'هدى',
    phone: '01001112233',
    email: 'hoda@example.com',
    status: 'delivered',
    created_at: '2026-11-12T10:00:00Z',
  },
];

const sampleAppointments: Appointment[] = [
  {
    id: 'apt1',
    name: 'محمود كريم',
    phone: '01012345678',
    email: 'mahmoud@example.com',
    topic: 'تمويل مصنع تعبئة',
    date: '2026-11-20',
    time: '12:00',
    duration: 30,
    type: 'online',
    status: 'confirmed',
    created_at: '2026-11-12T09:00:00Z',
  },
];

test('filterFundingEntities filters by category and search query', () => {
  assert.equal(filterFundingEntities(sampleEntities, 'all', '').length, 2);
  assert.equal(filterFundingEntities(sampleEntities, 'egyptian', '').length, 1);
  assert.equal(filterFundingEntities(sampleEntities, 'all', 'Saudi').length, 1);
  assert.equal(filterFundingEntities(sampleEntities, 'gulf', 'NBE').length, 0);
});

test('filterBlogPosts filters by category and query', () => {
  assert.equal(filterBlogPosts(samplePosts, 'funding', 'البنوك').length, 1);
  assert.equal(filterBlogPosts(samplePosts, 'marketing', '').length, 0);
});

test('getStudyStageIndex maps 5 workflow stages and extended statuses accurately', () => {
  assert.equal(getStudyStageIndex('received'), 0);
  assert.equal(getStudyStageIndex('in_progress'), 2);
  assert.equal(getStudyStageIndex('preparing'), 2);
  assert.equal(getStudyStageIndex('completed'), 4);
  assert.equal(getStudyStageIndex('delivered'), 4);
  assert.equal(getStudyStageIndex('rejected'), 0);
});

test('sortStudyRequests sorts by date and status', () => {
  const byDateDesc = sortStudyRequests(sampleRequests, 'created_at', 'desc');
  assert.equal(byDateDesc[0].id, 'r2');

  const byStageAsc = sortStudyRequests(sampleRequests, 'status', 'asc');
  assert.equal(byStageAsc[0].id, 'r1');
});

test('filterStudyRequests and filterAppointments filter by query and status', () => {
  assert.equal(filterStudyRequests(sampleRequests, 'الشفاء', 'all').length, 1);
  assert.equal(filterStudyRequests(sampleRequests, '', 'delivered').length, 1);
  assert.equal(filterStudyRequests(sampleRequests, 'طارق', 'delivered').length, 0);

  assert.equal(filterAppointments(sampleAppointments, 'تعبئة', 'confirmed').length, 1);
  assert.equal(filterAppointments(sampleAppointments, '', 'pending').length, 0);
});

test('buildWhatsAppUrl normalizes Egyptian local phone numbers', () => {
  const url = buildWhatsAppUrl('01142464520', 'مرحبا');
  assert.ok(url.startsWith('https://wa.me/201142464520?text='));
});

test('exportRequestsToCsv and exportAppointmentsToCsv output CSV headers and escaped rows', () => {
  const csv = exportRequestsToCsv(sampleRequests);
  assert.ok(csv.includes('Project Name'));
  assert.ok(csv.includes('ألفا للصناعات'));

  const aptCsv = exportAppointmentsToCsv(sampleAppointments);
  assert.ok(aptCsv.includes('Client Name'));
  assert.ok(aptCsv.includes('تمويل مصنع تعبئة'));
});
