import {
  SEED_APPOINTMENTS,
  SEED_BLOG_POSTS,
  SEED_CLIENT_DOCS,
  SEED_CLIENT_MESSAGES,
  SEED_REVIEWS,
  SEED_STUDY_REQUESTS,
} from '../data/catalog';
import type {
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
  AuthUser,
  BlogPost,
  ClientDocument,
  ClientPortalMessage,
  ContactMessage,
  ProductionLineMediaConfig,
  ProductionLineTabKey,
  Review,
  StudyRequest,
  StudyRequestDraft,
  StudyRequestStatus,
} from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

const KEYS = {
  STUDY_REQUESTS: 'expert_study_requests_v1',
  APPOINTMENTS: 'expert_appointments_v1',
  REVIEWS: 'expert_reviews_v1',
  BLOG_POSTS: 'expert_blog_posts_v1',
  CONTACTS: 'expert_contact_messages_v1',
  PORTAL_MESSAGES: 'expert_portal_messages_v1',
  AUTH_USER: 'expert_auth_user_v1',
  PRODUCTION_LINE_MEDIA: 'expert_production_line_media_v1',
};

const ADMIN_EMAILS = ['admin@expertconsu.com', 'info@expertconsu.com', 'badr@expertconsu.com'];

function readStore<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function writeStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

function generateId(prefix: string): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-4)}${random}`;
}

export const api = {
  // Study Requests
  async listStudyRequests(): Promise<StudyRequest[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('study_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as StudyRequest[];
    }
    return readStore<StudyRequest[]>(KEYS.STUDY_REQUESTS, SEED_STUDY_REQUESTS);
  },

  async createStudyRequest(draft: StudyRequestDraft): Promise<StudyRequest> {
    const newRecord: StudyRequest = {
      id: generateId('EXP-2026'),
      type: draft.type || 'comprehensive',
      sector: draft.sector || 'industrial',
      project_name: draft.project_name.trim(),
      location: draft.location.trim(),
      capital_range: draft.capital_range,
      needs_funding: draft.needs_funding,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      preferred_contact: draft.preferred_contact,
      notes: draft.notes?.trim(),
      status: 'received',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('study_requests')
        .insert([
          {
            type: newRecord.type,
            sector: newRecord.sector,
            project_name: newRecord.project_name,
            location: newRecord.location,
            capital_range: newRecord.capital_range,
            needs_funding: newRecord.needs_funding,
            name: newRecord.name,
            phone: newRecord.phone,
            email: newRecord.email,
            status: newRecord.status,
          },
        ])
        .select()
        .single();
      if (!error && data) return data as StudyRequest;
    }

    const current = readStore<StudyRequest[]>(KEYS.STUDY_REQUESTS, SEED_STUDY_REQUESTS);
    const updated = [newRecord, ...current];
    writeStore(KEYS.STUDY_REQUESTS, updated);
    return newRecord;
  },

  async updateStudyRequestStatus(id: string, status: StudyRequestStatus): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('study_requests').update({ status }).eq('id', id);
    }
    const current = readStore<StudyRequest[]>(KEYS.STUDY_REQUESTS, SEED_STUDY_REQUESTS);
    const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
    writeStore(KEYS.STUDY_REQUESTS, updated);
  },

  // Appointments
  async listAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Appointment[];
    }
    return readStore<Appointment[]>(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
  },

  async createAppointment(draft: AppointmentDraft): Promise<Appointment> {
    const newAppt: Appointment = {
      id: generateId('APT'),
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      topic: draft.topic.trim(),
      date: draft.date,
      time: draft.time,
      duration: draft.duration,
      type: draft.type,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            name: newAppt.name,
            phone: newAppt.phone,
            email: newAppt.email,
            topic: newAppt.topic,
            date: newAppt.date,
            time: newAppt.time,
            duration: newAppt.duration,
            type: newAppt.type,
            status: newAppt.status,
          },
        ])
        .select()
        .single();
      if (!error && data) return data as Appointment;
    }

    const current = readStore<Appointment[]>(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
    writeStore(KEYS.APPOINTMENTS, [newAppt, ...current]);
    return newAppt;
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('appointments').update({ status }).eq('id', id);
    }
    const current = readStore<Appointment[]>(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
    writeStore(
      KEYS.APPOINTMENTS,
      current.map((a) => (a.id === id ? { ...a, status } : a))
    );
  },

  // Reviews
  async listReviews(): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Review[];
    }
    return readStore<Review[]>(KEYS.REVIEWS, SEED_REVIEWS);
  },

  async createReview(input: {
    client_name: string;
    project_type: string;
    rating: number;
    review_text: string;
  }): Promise<Review> {
    const review: Review = {
      id: generateId('rev'),
      client_name: input.client_name.trim(),
      project_type: input.project_type.trim(),
      rating: input.rating,
      review_text: input.review_text.trim(),
      created_at: new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            client_name: review.client_name,
            project_type: review.project_type,
            rating: review.rating,
            review_text: review.review_text,
          },
        ])
        .select()
        .single();
      if (!error && data) return data as Review;
    }

    const current = readStore<Review[]>(KEYS.REVIEWS, SEED_REVIEWS);
    writeStore(KEYS.REVIEWS, [review, ...current]);
    return review;
  },

  // Blog Posts
  async listBlogPosts(): Promise<BlogPost[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as BlogPost[];
    }
    return readStore<BlogPost[]>(KEYS.BLOG_POSTS, SEED_BLOG_POSTS);
  },

  // Contact Messages
  async submitContactMessage(input: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    const msg: ContactMessage = {
      id: generateId('MSG'),
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      subject: input.subject.trim(),
      message: input.message.trim(),
      created_at: new Date().toISOString(),
    };
    const current = readStore<ContactMessage[]>(KEYS.CONTACTS, []);
    writeStore(KEYS.CONTACTS, [msg, ...current]);
    return msg;
  },

  // Client Portal Docs & Messages
  async getClientDocuments(): Promise<ClientDocument[]> {
    return SEED_CLIENT_DOCS;
  },

  async getClientMessages(): Promise<ClientPortalMessage[]> {
    return readStore<ClientPortalMessage[]>(KEYS.PORTAL_MESSAGES, SEED_CLIENT_MESSAGES);
  },

  async sendClientMessage(text: string, senderName: string): Promise<ClientPortalMessage> {
    const msg: ClientPortalMessage = {
      id: generateId('pmsg'),
      sender: 'client',
      sender_name_ar: senderName,
      sender_name_en: senderName,
      text_ar: text.trim(),
      text_en: text.trim(),
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    const current = readStore<ClientPortalMessage[]>(KEYS.PORTAL_MESSAGES, SEED_CLIENT_MESSAGES);
    writeStore(KEYS.PORTAL_MESSAGES, [...current, msg]);
    return msg;
  },

  // Auth (Supabase Auth + Local Session Fallback)
  async getCurrentUser(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        const { data: adminRow } = await supabase
          .from('admins')
          .select('email')
          .eq('email', data.user.email)
          .maybeSingle();
        const isAdmin = Boolean(adminRow) || ADMIN_EMAILS.includes(data.user.email.toLowerCase());
        return {
          id: data.user.id,
          email: data.user.email,
          name: (data.user.user_metadata?.full_name as string) || data.user.email.split('@')[0],
          role: isAdmin ? 'admin' : 'client',
        };
      }
    }

    try {
      const raw = localStorage.getItem(KEYS.AUTH_USER);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },

  async signIn(email: string, password: string, expectedRole?: 'admin' | 'client'): Promise<{ user?: AuthUser; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || password.length < 6) {
      return { error: 'يرجى إدخال البريد الإلكتروني وكلمة مرور صحيحة (6 أحرف على الأقل)' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error || !data.user) {
        return { error: error?.message || 'بيانات الدخول غير صحيحة' };
      }
      const { data: adminRow } = await supabase
        .from('admins')
        .select('email')
        .eq('email', normalizedEmail)
        .maybeSingle();
      const isAdmin = Boolean(adminRow) || ADMIN_EMAILS.includes(normalizedEmail);
      if (expectedRole === 'admin' && !isAdmin) {
        return { error: 'هذا الحساب غير مصرح له بالدخول إلى لوحة الإدارة' };
      }
      const user: AuthUser = {
        id: data.user.id,
        email: normalizedEmail,
        name: (data.user.user_metadata?.full_name as string) || normalizedEmail.split('@')[0],
        role: isAdmin ? 'admin' : 'client',
      };
      window.dispatchEvent(new Event('expert:auth-changed'));
      return { user };
    }

    const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
    if (expectedRole === 'admin' && !isAdminEmail) {
      return { error: 'عذراً، لوحة الإدارة مخصصة لبريد المسؤولين المعتمد فقط (مثل admin@expertconsu.com)' };
    }

    const user: AuthUser = {
      id: generateId('usr'),
      email: normalizedEmail,
      name: isAdminEmail ? 'مدير النظام — EXPERT' : 'أحمد عبد الرحمن',
      role: isAdminEmail ? 'admin' : 'client',
    };
    writeStore(KEYS.AUTH_USER, user);
    window.dispatchEvent(new Event('expert:auth-changed'));
    return { user };
  },

  async signUpClient(email: string, password: string, fullName: string): Promise<{ user?: AuthUser; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!fullName.trim() || !normalizedEmail || password.length < 6) {
      return { error: 'يرجى استكمال الاسم والبريد وكلمة المرور (6 أحرف على الأقل)' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (error || !data.user) {
        return { error: error?.message || 'تعذر إنشاء الحساب' };
      }
      window.dispatchEvent(new Event('expert:auth-changed'));
      return {
        user: {
          id: data.user.id,
          email: normalizedEmail,
          name: fullName.trim(),
          role: 'client',
        },
      };
    }

    const user: AuthUser = {
      id: generateId('usr'),
      email: normalizedEmail,
      name: fullName.trim(),
      role: 'client',
    };
    writeStore(KEYS.AUTH_USER, user);
    window.dispatchEvent(new Event('expert:auth-changed'));
    return { user };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    try {
      localStorage.removeItem(KEYS.AUTH_USER);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event('expert:auth-changed'));
  },

  // Production Line Media Overrides
  getProductionLineMedia(): ProductionLineMediaConfig {
    const fallback: ProductionLineMediaConfig = { items: {}, tabs: {} };
    try {
      const raw = localStorage.getItem(KEYS.PRODUCTION_LINE_MEDIA);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as Partial<ProductionLineMediaConfig>;
      return {
        items: parsed.items && typeof parsed.items === 'object' ? parsed.items : {},
        tabs: parsed.tabs && typeof parsed.tabs === 'object' ? parsed.tabs : {},
      };
    } catch {
      return fallback;
    }
  },

  saveProductionLineImage(lineId: string, imageUrl: string): ProductionLineMediaConfig {
    const current = api.getProductionLineMedia();
    const updated: ProductionLineMediaConfig = {
      items: { ...current.items },
      tabs: { ...current.tabs },
    };
    if (imageUrl.trim()) {
      updated.items[lineId] = imageUrl.trim();
    } else {
      delete updated.items[lineId];
    }
    writeStore(KEYS.PRODUCTION_LINE_MEDIA, updated);
    window.dispatchEvent(new Event('expert:production-media-updated'));
    return updated;
  },

  saveProductionTabImage(tabKey: ProductionLineTabKey, imageUrl: string): ProductionLineMediaConfig {
    const current = api.getProductionLineMedia();
    const updated: ProductionLineMediaConfig = {
      items: { ...current.items },
      tabs: { ...current.tabs },
    };
    if (imageUrl.trim()) {
      updated.tabs[tabKey] = imageUrl.trim();
    } else {
      delete updated.tabs[tabKey];
    }
    writeStore(KEYS.PRODUCTION_LINE_MEDIA, updated);
    window.dispatchEvent(new Event('expert:production-media-updated'));
    return updated;
  },

  resetProductionLineMedia(): ProductionLineMediaConfig {
    const empty: ProductionLineMediaConfig = { items: {}, tabs: {} };
    writeStore(KEYS.PRODUCTION_LINE_MEDIA, empty);
    window.dispatchEvent(new Event('expert:production-media-updated'));
    return empty;
  },
};
