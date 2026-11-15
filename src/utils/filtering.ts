import type {
  BlogCategory,
  BlogPost,
  FundingCategory,
  FundingEntity,
  StudyRequest,
  StudyRequestStatus,
} from '../types';

export function filterFundingEntities(
  entities: FundingEntity[],
  category: FundingCategory | 'all',
  query: string
): FundingEntity[] {
  const normalizedQuery = query.trim().toLowerCase();
  return entities.filter((entity) => {
    const matchesCategory = category === 'all' || entity.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      entity.name_ar.toLowerCase().includes(normalizedQuery) ||
      entity.name_en.toLowerCase().includes(normalizedQuery) ||
      entity.country_ar.toLowerCase().includes(normalizedQuery) ||
      entity.country_en.toLowerCase().includes(normalizedQuery) ||
      entity.code.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function filterBlogPosts(
  posts: BlogPost[],
  category: BlogCategory | 'all',
  query: string
): BlogPost[] {
  const normalizedQuery = query.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesCategory = category === 'all' || post.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      post.title_ar.toLowerCase().includes(normalizedQuery) ||
      post.title_en.toLowerCase().includes(normalizedQuery) ||
      post.excerpt_ar.toLowerCase().includes(normalizedQuery) ||
      post.excerpt_en.toLowerCase().includes(normalizedQuery)
    );
  });
}

export const STUDY_STAGE_ORDER: StudyRequestStatus[] = [
  'received',
  'market_analysis',
  'preparing',
  'review',
  'delivered',
];

export function getStudyStageIndex(status: StudyRequestStatus): number {
  if (status === 'in_progress') return 2;
  if (status === 'completed') return 4;
  if (status === 'rejected') return 0;
  const idx = STUDY_STAGE_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export type StudySortKey = 'created_at' | 'project_name' | 'status';

export function sortStudyRequests(
  requests: StudyRequest[],
  sortBy: StudySortKey,
  direction: 'asc' | 'desc' = 'desc'
): StudyRequest[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...requests].sort((a, b) => {
    if (sortBy === 'created_at') {
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * factor;
    }
    if (sortBy === 'status') {
      return (getStudyStageIndex(a.status) - getStudyStageIndex(b.status)) * factor;
    }
    return a.project_name.localeCompare(b.project_name, 'ar') * factor;
  });
}

export function filterStudyRequests(
  requests: StudyRequest[],
  query: string,
  statusFilter: StudyRequestStatus | 'all' = 'all'
): StudyRequest[] {
  const q = query.trim().toLowerCase();
  return requests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (!q) return true;
    return (
      req.id.toLowerCase().includes(q) ||
      req.project_name.toLowerCase().includes(q) ||
      req.name.toLowerCase().includes(q) ||
      req.email.toLowerCase().includes(q) ||
      req.phone.toLowerCase().includes(q) ||
      req.location.toLowerCase().includes(q) ||
      req.sector.toLowerCase().includes(q)
    );
  });
}

export function filterAppointments<
  T extends { id: string; name: string; email: string; phone: string; topic: string; status: string }
>(appointments: T[], query: string, statusFilter = 'all'): T[] {
  const q = query.trim().toLowerCase();
  return appointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (!q) return true;
    return (
      apt.id.toLowerCase().includes(q) ||
      apt.name.toLowerCase().includes(q) ||
      apt.email.toLowerCase().includes(q) ||
      apt.phone.toLowerCase().includes(q) ||
      apt.topic.toLowerCase().includes(q)
    );
  });
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  const intlPhone = cleaned.startsWith('0') ? `20${cleaned.slice(1)}` : cleaned;
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
}

export function exportRequestsToCsv(requests: StudyRequest[]): string {
  const headers = [
    'ID',
    'Project Name',
    'Type',
    'Sector',
    'Location',
    'Capital Range',
    'Needs Funding',
    'Applicant Name',
    'Phone',
    'Email',
    'Status',
    'Created At',
  ];

  const escapeCell = (value: string | boolean) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = requests.map((req) =>
    [
      req.id,
      req.project_name,
      req.type,
      req.sector,
      req.location,
      req.capital_range,
      req.needs_funding ? 'Yes' : 'No',
      req.name,
      req.phone,
      req.email,
      req.status,
      req.created_at,
    ]
      .map(escapeCell)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function exportAppointmentsToCsv(
  appointments: {
    id: string;
    name: string;
    phone: string;
    email: string;
    topic: string;
    date: string;
    time: string;
    duration: number;
    type: string;
    status: string;
    created_at: string;
  }[]
): string {
  const headers = [
    'ID',
    'Client Name',
    'Phone',
    'Email',
    'Topic',
    'Date',
    'Time',
    'Duration (min)',
    'Type',
    'Status',
    'Created At',
  ];

  const escapeCell = (value: string | number) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = appointments.map((apt) =>
    [
      apt.id,
      apt.name,
      apt.phone,
      apt.email,
      apt.topic,
      apt.date,
      apt.time,
      apt.duration,
      apt.type,
      apt.status,
      apt.created_at,
    ]
      .map(escapeCell)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
