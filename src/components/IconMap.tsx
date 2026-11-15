import {
  Activity,
  Award,
  Briefcase,
  Building2,
  Factory,
  FileCheck2,
  Gauge,
  GraduationCap,
  Handshake,
  Languages,
  LayoutGrid,
  Megaphone,
  Palette,
  Palmtree,
  Presentation,
  Radio,
  Recycle,
  ShieldAlert,
  ShoppingBag,
  Sprout,
  Stethoscope,
  Store,
  Trophy,
} from 'lucide-react';

const ICON_COMPONENTS = {
  Factory,
  ShoppingBag,
  Sprout,
  Briefcase,
  Stethoscope,
  Palmtree,
  Recycle,
  Radio,
  Building2,
  GraduationCap,
  Trophy,
  Store,
  LayoutGrid,
  Presentation,
  Palette,
  ShieldAlert,
  Handshake,
  Gauge,
  Award,
  FileCheck2,
  Languages,
  Megaphone,
  Activity,
} as const;

export type IconName = keyof typeof ICON_COMPONENTS;

export function DynamicIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_COMPONENTS[name as IconName] ?? Briefcase;
  return <Icon className={className} aria-hidden="true" />;
}
