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
  | 'in_progress'
  | 'preparing'
  | 'review'
  | 'completed'
  | 'delivered'
  | 'rejected';

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
  author_ar?: string;
  author_en?: string;
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
  price_ar?: string;
  price_en?: string;
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

export interface SectorCmsItem {
  id: SectorId;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price_ar: string;
  price_en: string;
}

export interface ServiceCmsItem {
  id: number;
  code: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  deliverable_ar: string;
  deliverable_en: string;
  price_ar: string;
  price_en: string;
  icon: string;
}

export interface HeroValuePropItem {
  num: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
}

export interface HeroCmsContent {
  badge_ar: string;
  badge_en: string;
  headline_ar: string;
  headline_en: string;
  subheading_ar: string;
  subheading_en: string;
  cta_primary_ar: string;
  cta_primary_en: string;
  cta_secondary_ar: string;
  cta_secondary_en: string;
  why_subtitle_ar: string;
  why_subtitle_en: string;
  why_title_ar: string;
  why_title_en: string;
  value_props: HeroValuePropItem[];
  welcome_badge_ar: string;
  welcome_badge_en: string;
  welcome_title_ar: string;
  welcome_title_en: string;
  welcome_desc_ar: string;
  welcome_desc_en: string;
}

export interface MetricCmsItem {
  key: 'studies' | 'requests' | 'experts' | 'countries';
  target: number;
  label_ar: string;
  label_en: string;
}

export interface AboutContactCmsConfig {
  story_ar: string;
  story_en: string;
  mission_ar: string;
  mission_en: string;
  footer_tagline_ar: string;
  footer_tagline_en: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp_number: string;
  address_ar: string;
  address_en: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  social_x: string;
}

export interface NotificationSettingsConfig {
  public_contact_email: string;
  notification_email: string;
  alert_on_study_request: boolean;
  alert_on_booking: boolean;
  alert_on_contact_message: boolean;
}

export interface NotificationAlertLog {
  id: string;
  event_type: 'study_request' | 'booking' | 'contact_message' | 'test';
  recipient_email: string;
  subject: string;
  details: string;
  delivery_status?: 'delivered' | 'failed';
  api_message?: string;
  created_at: string;
}

export interface AdminProfileConfig {
  display_name: string;
  admin_email: string;
  updated_at: string;
}

export interface SiteCmsConfig {
  hero: HeroCmsContent;
  metrics: MetricCmsItem[];
  sectors: SectorCmsItem[];
  services: ServiceCmsItem[];
  about_contact: AboutContactCmsConfig;
  notifications: NotificationSettingsConfig;
  production_lines: ProductionLineItem[];
  production_tabs: ProductionLineTabMeta[];
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
