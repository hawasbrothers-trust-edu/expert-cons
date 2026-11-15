export type Language = 'ar' | 'en';

export type StudyTypeId = 'economic' | 'environmental' | 'marketing' | 'technical' | 'comprehensive';

export type SectorId =
  | 'industrial'
  | 'commercial'
  | 'agricultural'
  | 'service'
  | 'medical'
  | 'tourism'
  | 'recycling'
  | 'telecom'
  | 'construction'
  | 'education'
  | 'sports';

export type StudyRequestStatus =
  | 'received'
  | 'market_analysis'
  | 'preparing'
  | 'review'
  | 'delivered';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface StudyRequest {
  id: string;
  type: StudyTypeId;
  sector: SectorId;
  project_name: string;
  location: string;
  capital_range: string;
  needs_funding: boolean;
  name: string;
  phone: string;
  email: string;
  preferred_contact?: 'whatsapp' | 'phone' | 'email';
  notes?: string;
  status: StudyRequestStatus;
  created_at: string;
}

export interface StudyRequestDraft {
  type: StudyTypeId | '';
  sector: SectorId | '';
  project_name: string;
  location: string;
  capital_range: string;
  needs_funding: boolean;
  name: string;
  phone: string;
  email: string;
  preferred_contact: 'whatsapp' | 'phone' | 'email';
  notes?: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  duration: 30 | 60;
  type: 'online' | 'in_person';
  status: AppointmentStatus;
  created_at: string;
}

export interface AppointmentDraft {
  name: string;
  phone: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  duration: 30 | 60;
  type: 'online' | 'in_person';
}

export interface Review {
  id: string;
  client_name: string;
  project_type: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export type BlogCategory = 'feasibility' | 'funding' | 'entrepreneurship' | 'marketing';

export interface BlogPost {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  category: BlogCategory;
  read_minutes: number;
  image_url: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export type FundingCategory = 'egyptian' | 'gulf' | 'development';

export interface FundingEntity {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  category: FundingCategory;
  country_ar: string;
  country_en: string;
  description_ar: string;
  description_en: string;
  accent: string;
}

export type ProductionCategory = 'industrial' | 'commercial' | 'agricultural';

export type ProductionLineTabKey = 'all' | ProductionCategory;

export interface ProductionLineItem {
  id: string;
  category: ProductionCategory;
  title_ar: string;
  title_en: string;
  capacity_ar: string;
  capacity_en: string;
  origin_ar: string;
  origin_en: string;
  description_ar: string;
  description_en: string;
  specs_ar: string[];
  specs_en: string[];
  image_url: string;
}

export interface ProductionLineTabMeta {
  id: ProductionLineTabKey;
  ar: string;
  en: string;
  image_url: string;
}

export interface ProductionLineMediaConfig {
  items: Record<string, string>;
  tabs: Partial<Record<ProductionLineTabKey, string>>;
}

export interface ClientDocument {
  id: string;
  title_ar: string;
  title_en: string;
  file_type: string;
  size: string;
  updated_at: string;
}

export interface ClientPortalMessage {
  id: string;
  sender: 'consultant' | 'client';
  sender_name_ar: string;
  sender_name_en: string;
  text_ar: string;
  text_en: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
}
