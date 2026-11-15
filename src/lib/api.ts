import {
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_SITE_CMS_CONFIG,
  SEED_APPOINTMENTS,
  SEED_BLOG_POSTS,
  SEED_CLIENT_DOCS,
  SEED_CLIENT_MESSAGES,
  SEED_REVIEWS,
  SEED_STUDY_REQUESTS,
} from '../data/catalog';
import type {
  AdminProfileConfig,
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
  AuthUser,
  BlogPost,
  ClientDocument,
  ClientPortalMessage,
  ContactMessage,
  NotificationAlertLog,
  ProductionLineMediaConfig,
  ProductionLineTabKey,
  Review,
  SiteCmsConfig,
  StudyRequest,
  StudyRequestDraft,
  StudyRequestStatus,
} from '../types';
import { isSupabaseConfigured, supabase } from './supabase';
import { sendWeb3FormsEmail, type Web3FormsPayload } from './web3forms';

const KEYS = {
  STUDY_REQUESTS: 'expert_study_requests_v1',
  APPOINTMENTS: 'expert_appointments_v1',
  REVIEWS: 'expert_reviews_v1',
  BLOG_POSTS: 'expert_blog_posts_v1',
  CONTACTS: 'expert_contact_messages_v1',
  PORTAL_MESSAGES: 'expert_portal_messages_v1',
  AUTH_USER: 'expert_auth_user_v1',
  PRODUCTION_LINE_MEDIA: 'expert_production_line_media_v1',
  SITE_CMS: 'expert_site_cms_v1',
  ADMIN_PROFILE: 'expert_admin_profile_v1',
  ADMIN_SECRET: 'expert_admin_secret_v1',
  NOTIFICATION_LOGS: 'expert_notification_logs_v1',
};

const BASE_ADMIN_EMAILS = ['admin@expertconsu.com', 'info@expertconsu.com', 'badr@expertconsu.com'];
const DEFAULT_ADMIN_PASSWORD = 'ExpertAdmin2026!';

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

function mergeCmsWithDefaults(partial?: Partial<SiteCmsConfig> | null): SiteCmsConfig {
  if (!partial) return DEFAULT_SITE_CMS_CONFIG;
  return {
    hero: {
      ...DEFAULT_SITE_CMS_CONFIG.hero,
      ...(partial.hero || {}),
      value_props:
        Array.isArray(partial.hero?.value_props) && partial.hero.value_props.length > 0
          ? partial.hero.value_props
          : DEFAULT_SITE_CMS_CONFIG.hero.value_props,
    },
    metrics:
      Array.isArray(partial.metrics) && partial.metrics.length === DEFAULT_SITE_CMS_CONFIG.metrics.length
        ? partial.metrics
        : DEFAULT_SITE_CMS_CONFIG.metrics,
    sectors:
      Array.isArray(partial.sectors) && partial.sectors.length > 0
        ? partial.sectors
        : DEFAULT_SITE_CMS_CONFIG.sectors,
    services:
      Array.isArray(partial.services) && partial.services.length > 0
        ? partial.services
        : DEFAULT_SITE_CMS_CONFIG.services,
    about_contact: {
      ...DEFAULT_SITE_CMS_CONFIG.about_contact,
      ...(partial.about_contact || {}),
    },
    notifications: {
      ...DEFAULT_SITE_CMS_CONFIG.notifications,
      ...(partial.notifications || {}),
    },
    production_lines:
      Array.isArray(partial.production_lines) && partial.production_lines.length > 0
        ? partial.production_lines
        : DEFAULT_SITE_CMS_CONFIG.production_lines,
    production_tabs:
      Array.isArray(partial.production_tabs) && partial.production_tabs.length > 0
        ? partial.production_tabs
        : DEFAULT_SITE_CMS_CONFIG.production_tabs,
  };
}

function getAllowedAdminEmails(): string[] {
  const profile = readStore<AdminProfileConfig>(KEYS.ADMIN_PROFILE, DEFAULT_ADMIN_PROFILE);
  const emails = new Set(BASE_ADMIN_EMAILS.map((e) => e.toLowerCase()));
  if (profile.admin_email?.trim()) {
    emails.add(profile.admin_email.trim().toLowerCase());
  }
  return Array.from(emails);
}

async function dispatchEmailAlert(
  event_type: NotificationAlertLog['event_type'],
  subject: string,
  details: string,
  web3Payload: Web3FormsPayload,
  overrideRecipient?: string
): Promise<{ log: NotificationAlertLog; delivered: boolean; apiMessage: string }> {
  const cms = api.getSiteCmsConfigSync();
  const recipient = overrideRecipient || cms.notifications.notification_email || 'alerts@expertconsu.com';

  const result = await sendWeb3FormsEmail({
    ...web3Payload,
    subject,
    target_inbox: recipient,
  });

  const entry: NotificationAlertLog = {
    id: generateId('ALT'),
    event_type,
    recipient_email: recipient,
    subject,
    details,
    delivery_status: result.success ? 'delivered' : 'failed',
    api_message: result.message,
    created_at: new Date().toISOString(),
  };
  const current = readStore<NotificationAlertLog[]>(KEYS.NOTIFICATION_LOGS, []);
  writeStore(KEYS.NOTIFICATION_LOGS, [entry, ...current].slice(0, 50));

  if (isSupabaseConfigured && supabase) {
    void supabase.from('notification_logs').insert([
      {
        event_type: entry.event_type,
        recipient_email: entry.recipient_email,
        subject: entry.subject,
        details: entry.details,
      },
    ]);
  }
  return { log: entry, delivered: result.success, apiMessage: result.message };
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

    const cms = api.getSiteCmsConfigSync();
    if (cms.notifications.alert_on_study_request) {
      const fundingText = newRecord.needs_funding ? 'Yes - Needs Bank/Fund Financing' : 'No - Self Funded';
      await dispatchEmailAlert(
        'study_request',
        `New Feasibility Study Request: ${newRecord.project_name} (${newRecord.id})`,
        `مقدم الطلب: ${newRecord.name} (${newRecord.phone}) · القطاع: ${newRecord.sector}`,
        {
          subject: `New Feasibility Study Request: ${newRecord.project_name}`,
          from_name: 'EXPERT Study Request Wizard',
          name: newRecord.name,
          email: newRecord.email,
          replyto: newRecord.email,
          client_name: newRecord.name,
          phone: newRecord.phone,
          sector: newRecord.sector,
          study_type: newRecord.type,
          project_name: newRecord.project_name,
          location: newRecord.location,
          capital_range: newRecord.capital_range,
          funding_status: fundingText,
          preferred_contact: newRecord.preferred_contact || 'whatsapp',
          message: [
            `New Feasibility Study Request Received (${newRecord.id})`,
            `Client Name: ${newRecord.name}`,
            `Phone: ${newRecord.phone}`,
            `Email: ${newRecord.email}`,
            `Project Name: ${newRecord.project_name}`,
            `Sector: ${newRecord.sector} | Study Type: ${newRecord.type}`,
            `Location: ${newRecord.location}`,
            `Capital Range: ${newRecord.capital_range}`,
            `Funding Status: ${fundingText}`,
            newRecord.notes ? `Notes: ${newRecord.notes}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        }
      );
    }

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

    const cms = api.getSiteCmsConfigSync();
    if (cms.notifications.alert_on_booking) {
      const meetingTypeLabel = newAppt.type === 'online' ? 'Online Video Consultation' : 'In-Person (HQ)';
      await dispatchEmailAlert(
        'booking',
        `New Consultation Booking: ${newAppt.name} (${newAppt.date} ${newAppt.time})`,
        `الموضوع: ${newAppt.topic} · الموعد: ${newAppt.date} ${newAppt.time}`,
        {
          subject: `New Consultation Booking: ${newAppt.name}`,
          from_name: 'EXPERT Consultation Scheduler',
          name: newAppt.name,
          email: newAppt.email,
          replyto: newAppt.email,
          client_name: newAppt.name,
          phone: newAppt.phone,
          topic: newAppt.topic,
          appointment_date: newAppt.date,
          appointment_time: newAppt.time,
          duration_minutes: `${newAppt.duration} min`,
          meeting_type: meetingTypeLabel,
          message: [
            `New Consultation Booking (${newAppt.id})`,
            `Client Name: ${newAppt.name}`,
            `Phone: ${newAppt.phone}`,
            `Email: ${newAppt.email}`,
            `Topic: ${newAppt.topic}`,
            `Date & Time: ${newAppt.date} at ${newAppt.time} (${newAppt.duration} min)`,
            `Meeting Type: ${meetingTypeLabel}`,
          ].join('\n'),
        }
      );
    }

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

  // Blog Posts (Full CRUD)
  async listBlogPosts(): Promise<BlogPost[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        writeStore(KEYS.BLOG_POSTS, data as BlogPost[]);
        return data as BlogPost[];
      }
    }
    return readStore<BlogPost[]>(KEYS.BLOG_POSTS, SEED_BLOG_POSTS);
  },

  async createBlogPost(input: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const post: BlogPost = {
      id: generateId('blog'),
      title_ar: input.title_ar.trim(),
      title_en: input.title_en.trim() || input.title_ar.trim(),
      excerpt_ar:
        input.excerpt_ar.trim() ||
        input.content_ar.trim().slice(0, 140) + (input.content_ar.length > 140 ? '...' : ''),
      excerpt_en:
        input.excerpt_en.trim() ||
        input.content_en.trim().slice(0, 140) + (input.content_en.length > 140 ? '...' : ''),
      content_ar: input.content_ar.trim(),
      content_en: input.content_en.trim() || input.content_ar.trim(),
      category: input.category,
      author_ar: input.author_ar?.trim() || 'فريق EXPERT الاستشاري',
      author_en: input.author_en?.trim() || 'EXPERT Advisory Team',
      read_minutes: Number(input.read_minutes) || 5,
      image_url: input.image_url.trim(),
      created_at: input.created_at || new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title_ar: post.title_ar,
            title_en: post.title_en,
            excerpt_ar: post.excerpt_ar,
            excerpt_en: post.excerpt_en,
            content_ar: post.content_ar,
            content_en: post.content_en,
            category: post.category,
            read_minutes: post.read_minutes,
            image_url: post.image_url,
            created_at: post.created_at,
          },
        ])
        .select()
        .single();
      if (!error && data) {
        const current = readStore<BlogPost[]>(KEYS.BLOG_POSTS, SEED_BLOG_POSTS);
        const created = { ...post, ...(data as BlogPost) };
        writeStore(KEYS.BLOG_POSTS, [created, ...current]);
        window.dispatchEvent(new Event('expert:blog-updated'));
        return created;
      }
    }

    const current = readStore<BlogPost[]>(KEYS.BLOG_POSTS, SEED_BLOG_POSTS);
    writeStore(KEYS.BLOG_POSTS, [post, ...current]);
    window.dispatchEvent(new Event('expert:blog-updated'));
    return post;
  },

  async updateBlogPost(id: string, updates: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const updatedPost: BlogPost = {
      id,
      title_ar: updates.title_ar.trim(),
      title_en: updates.title_en.trim() || updates.title_ar.trim(),
      excerpt_ar:
        updates.excerpt_ar.trim() ||
        updates.content_ar.trim().slice(0, 140) + (updates.content_ar.length > 140 ? '...' : ''),
      excerpt_en:
        updates.excerpt_en.trim() ||
        updates.content_en.trim().slice(0, 140) + (updates.content_en.length > 140 ? '...' : ''),
      content_ar: updates.content_ar.trim(),
      content_en: updates.content_en.trim() || updates.content_ar.trim(),
      category: updates.category,
      author_ar: updates.author_ar?.trim() || 'فريق EXPERT الاستشاري',
      author_en: updates.author_en?.trim() || 'EXPERT Advisory Team',
      read_minutes: Number(updates.read_minutes) || 5,
      image_url: updates.image_url.trim(),
      created_at: updates.created_at || new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('blog_posts')
        .update({
          title_ar: updatedPost.title_ar,
          title_en: updatedPost.title_en,
          excerpt_ar: updatedPost.excerpt_ar,
          excerpt_en: updatedPost.excerpt_en,
          content_ar: updatedPost.content_ar,
          content_en: updatedPost.content_en,
          category: updatedPost.category,
          read_minutes: updatedPost.read_minutes,
          image_url: updatedPost.image_url,
          created_at: updatedPost.created_at,
        })
        .eq('id', id);
    }

    const current = readStore<BlogPost[]>(KEYS.BLOG_POSTS, SEED_BLOG_POSTS);
    writeStore(
      KEYS.BLOG_POSTS,
      current.map((p) => (p.id === id ? updatedPost : p))
    );
    window.dispatchEvent(new Event('expert:blog-updated'));
    return updatedPost;
  },

  async deleteBlogPost(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('blog_posts').delete().eq('id', id);
    }
    const current = readStore<BlogPost[]>(KEYS.BLOG_POSTS, SEED_BLOG_POSTS);
    writeStore(
      KEYS.BLOG_POSTS,
      current.filter((p) => p.id !== id)
    );
    window.dispatchEvent(new Event('expert:blog-updated'));
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

    const cms = api.getSiteCmsConfigSync();
    if (cms.notifications.alert_on_contact_message) {
      await dispatchEmailAlert(
        'contact_message',
        `New Contact Inquiry: ${msg.subject}`,
        `المرسل: ${msg.name} (${msg.email} · ${msg.phone})`,
        {
          subject: `EXPERT Contact Form: ${msg.subject}`,
          from_name: 'EXPERT Contact Page',
          name: msg.name,
          email: msg.email,
          replyto: msg.email,
          sender_name: msg.name,
          phone: msg.phone,
          inquiry_subject: msg.subject,
          message: [
            `New Contact Form Message (${msg.id})`,
            `Sender Name: ${msg.name}`,
            `Email: ${msg.email}`,
            `Phone: ${msg.phone}`,
            `Subject: ${msg.subject}`,
            `Message:\n${msg.message}`,
          ].join('\n'),
        }
      );
    }

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
    const allowedAdmins = getAllowedAdminEmails();
    const adminProfile = readStore<AdminProfileConfig>(KEYS.ADMIN_PROFILE, DEFAULT_ADMIN_PROFILE);

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        const { data: adminRow } = await supabase
          .from('admins')
          .select('email')
          .eq('email', data.user.email)
          .maybeSingle();
        const isAdmin =
          Boolean(adminRow) || allowedAdmins.includes(data.user.email.toLowerCase());
        return {
          id: data.user.id,
          email: data.user.email,
          name: isAdmin
            ? adminProfile.display_name
            : (data.user.user_metadata?.full_name as string) || data.user.email.split('@')[0],
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

  async signIn(
    email: string,
    password: string,
    expectedRole?: 'admin' | 'client'
  ): Promise<{ user?: AuthUser; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || password.length < 6) {
      return { error: 'يرجى إدخال البريد الإلكتروني وكلمة مرور صحيحة (6 أحرف على الأقل)' };
    }

    const allowedAdmins = getAllowedAdminEmails();
    const adminProfile = readStore<AdminProfileConfig>(KEYS.ADMIN_PROFILE, DEFAULT_ADMIN_PROFILE);

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
      const isAdmin = Boolean(adminRow) || allowedAdmins.includes(normalizedEmail);
      if (expectedRole === 'admin' && !isAdmin) {
        return { error: 'هذا الحساب غير مصرح له بالدخول إلى لوحة الإدارة' };
      }
      const user: AuthUser = {
        id: data.user.id,
        email: normalizedEmail,
        name: isAdmin
          ? adminProfile.display_name
          : (data.user.user_metadata?.full_name as string) || normalizedEmail.split('@')[0],
        role: isAdmin ? 'admin' : 'client',
      };
      window.dispatchEvent(new Event('expert:auth-changed'));
      return { user };
    }

    const isAdminEmail = allowedAdmins.includes(normalizedEmail);
    if (expectedRole === 'admin' && !isAdminEmail) {
      return {
        error: `عذراً، لوحة الإدارة مخصصة لبريد المسؤولين المعتمد فقط (مثل ${adminProfile.admin_email})`,
      };
    }

    if (isAdminEmail) {
      const storedSecret = readStore<string>(KEYS.ADMIN_SECRET, DEFAULT_ADMIN_PASSWORD);
      if (password !== storedSecret) {
        return { error: 'كلمة مرور المدير غير صحيحة. يرجى التحقق والمحاولة مجدداً.' };
      }
    }

    const user: AuthUser = {
      id: generateId('usr'),
      email: normalizedEmail,
      name: isAdminEmail ? adminProfile.display_name : 'أحمد عبد الرحمن',
      role: isAdminEmail ? 'admin' : 'client',
    };
    writeStore(KEYS.AUTH_USER, user);
    window.dispatchEvent(new Event('expert:auth-changed'));
    return { user };
  },

  async signUpClient(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ user?: AuthUser; error?: string }> {
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

  // Admin Profile & Security
  getAdminProfileSync(): AdminProfileConfig {
    return readStore<AdminProfileConfig>(KEYS.ADMIN_PROFILE, DEFAULT_ADMIN_PROFILE);
  },

  async getAdminProfile(): Promise<AdminProfileConfig> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_profile')
        .maybeSingle();
      if (!error && data?.value) {
        const merged = { ...DEFAULT_ADMIN_PROFILE, ...(data.value as Partial<AdminProfileConfig>) };
        writeStore(KEYS.ADMIN_PROFILE, merged);
        return merged;
      }
    }
    return readStore<AdminProfileConfig>(KEYS.ADMIN_PROFILE, DEFAULT_ADMIN_PROFILE);
  },

  async updateAdminProfile(input: {
    display_name: string;
    admin_email: string;
  }): Promise<{ profile?: AdminProfileConfig; error?: string }> {
    const displayName = input.display_name.trim();
    const adminEmail = input.admin_email.trim().toLowerCase();
    if (!displayName || !adminEmail || !adminEmail.includes('@')) {
      return { error: 'يرجى إدخال اسم العرض وبريد إلكتروني إداري صحيح' };
    }

    const updated: AdminProfileConfig = {
      display_name: displayName,
      admin_email: adminEmail,
      updated_at: new Date().toISOString(),
    };

    writeStore(KEYS.ADMIN_PROFILE, updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({
        key: 'admin_profile',
        value: updated,
        updated_at: updated.updated_at,
      });
      await supabase.auth.updateUser({
        data: { full_name: displayName },
      });
    }

    try {
      const rawUser = localStorage.getItem(KEYS.AUTH_USER);
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as AuthUser;
        if (parsed.role === 'admin') {
          writeStore(KEYS.AUTH_USER, {
            ...parsed,
            name: displayName,
            email: adminEmail,
          });
        }
      }
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event('expert:auth-changed'));
    return { profile: updated };
  },

  async changeAdminPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!currentPassword) {
      return { success: false, error: 'يرجى إدخال كلمة المرور الحالية' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل' };
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      writeStore(KEYS.ADMIN_SECRET, newPassword);
      return { success: true };
    }

    const storedSecret = readStore<string>(KEYS.ADMIN_SECRET, DEFAULT_ADMIN_PASSWORD);
    if (currentPassword !== storedSecret) {
      return { success: false, error: 'كلمة المرور الحالية غير مطابقة' };
    }

    writeStore(KEYS.ADMIN_SECRET, newPassword);
    return { success: true };
  },

  // Comprehensive Site CMS Configuration
  getSiteCmsConfigSync(): SiteCmsConfig {
    let stored: Partial<SiteCmsConfig> | null = null;
    try {
      const raw = localStorage.getItem(KEYS.SITE_CMS);
      stored = raw ? (JSON.parse(raw) as Partial<SiteCmsConfig>) : null;
    } catch {
      stored = null;
    }
    const merged = mergeCmsWithDefaults(stored);

    // Apply legacy production line media overrides if present
    const legacyMedia = api.getProductionLineMedia();
    if (Object.keys(legacyMedia.items).length > 0) {
      merged.production_lines = merged.production_lines.map((pl) => ({
        ...pl,
        image_url: legacyMedia.items[pl.id] || pl.image_url,
      }));
    }
    if (Object.keys(legacyMedia.tabs).length > 0) {
      merged.production_tabs = merged.production_tabs.map((tab) => ({
        ...tab,
        image_url: legacyMedia.tabs[tab.id] || tab.image_url,
      }));
    }
    return merged;
  },

  async getSiteCmsConfig(): Promise<SiteCmsConfig> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_cms_config')
        .maybeSingle();
      if (!error && data?.value) {
        const merged = mergeCmsWithDefaults(data.value as Partial<SiteCmsConfig>);
        writeStore(KEYS.SITE_CMS, merged);
        return merged;
      }
    }
    return api.getSiteCmsConfigSync();
  },

  async saveSiteCmsConfig(config: SiteCmsConfig): Promise<SiteCmsConfig> {
    const clean = mergeCmsWithDefaults(config);
    writeStore(KEYS.SITE_CMS, clean);

    // Keep production media key synced so both views agree
    const mediaPayload: ProductionLineMediaConfig = {
      items: Object.fromEntries(clean.production_lines.map((pl) => [pl.id, pl.image_url])),
      tabs: Object.fromEntries(clean.production_tabs.map((tb) => [tb.id, tb.image_url])),
    };
    writeStore(KEYS.PRODUCTION_LINE_MEDIA, mediaPayload);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({
        key: 'site_cms_config',
        value: clean,
        updated_at: new Date().toISOString(),
      });
    }

    window.dispatchEvent(new Event('expert:cms-updated'));
    window.dispatchEvent(new Event('expert:production-media-updated'));
    return clean;
  },

  // Notification Logs & Test Trigger
  async listNotificationLogs(): Promise<NotificationAlertLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('notification_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) return data as NotificationAlertLog[];
    }
    return readStore<NotificationAlertLog[]>(KEYS.NOTIFICATION_LOGS, []);
  },

  async sendTestNotification(
    targetEmail: string
  ): Promise<{ log: NotificationAlertLog; delivered: boolean; apiMessage: string }> {
    const cms = api.getSiteCmsConfigSync();
    return dispatchEmailAlert(
      'test',
      'EXPERT Operations — Web3Forms Test Notification',
      'اختبار قناة الإشعارات الفورية عبر Web3Forms API',
      {
        subject: 'EXPERT Operations — Live Email Notification Test',
        from_name: 'EXPERT Admin Operations Center',
        name: 'EXPERT Admin System',
        email: cms.notifications.public_contact_email || 'info@expertconsu.com',
        replyto: cms.notifications.public_contact_email || 'info@expertconsu.com',
        target_inbox: targetEmail,
        message: [
          'This is a live verification email dispatched from the EXPERT Operations & CMS Dashboard via Web3Forms.',
          `Configured Target Alert Inbox: ${targetEmail}`,
          `Public Contact Email: ${cms.notifications.public_contact_email}`,
          `Timestamp: ${new Date().toISOString()}`,
        ].join('\n'),
      },
      targetEmail
    );
  },

  // Production Line Media Overrides (kept compatible)
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
    window.dispatchEvent(new Event('expert:cms-updated'));
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
    window.dispatchEvent(new Event('expert:cms-updated'));
    return updated;
  },

  resetProductionLineMedia(): ProductionLineMediaConfig {
    const empty: ProductionLineMediaConfig = { items: {}, tabs: {} };
    writeStore(KEYS.PRODUCTION_LINE_MEDIA, empty);
    const currentCms = api.getSiteCmsConfigSync();
    currentCms.production_lines = DEFAULT_SITE_CMS_CONFIG.production_lines;
    currentCms.production_tabs = DEFAULT_SITE_CMS_CONFIG.production_tabs;
    writeStore(KEYS.SITE_CMS, currentCms);
    window.dispatchEvent(new Event('expert:production-media-updated'));
    window.dispatchEvent(new Event('expert:cms-updated'));
    return empty;
  },
};
