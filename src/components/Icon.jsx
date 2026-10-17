import {
  Award,
  BookOpen,
  Calculator,
  Code2,
  Compass,
  GraduationCap,
  Hammer,
  Heart,
  Landmark,
  Laptop,
  Layers,
  Megaphone,
  MessageCircle,
  Monitor,
  Palette,
  Sparkles,
  Target,
  Terminal,
  Users,
  Wrench,
  Star,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

/**
 * Central icon registry. Data files reference icons by name so the content
 * layer stays free of JSX imports.
 */
const ICONS = {
  award: Award,
  'book-open': BookOpen,
  calculator: Calculator,
  code: Code2,
  compass: Compass,
  'graduation-cap': GraduationCap,
  hammer: Hammer,
  heart: Heart,
  landmark: Landmark,
  laptop: Laptop,
  layers: Layers,
  megaphone: Megaphone,
  'message-circle': MessageCircle,
  monitor: Monitor,
  palette: Palette,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  terminal: Terminal,
  users: Users,
  wrench: Wrench,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  'map-pin': MapPin,
  mail: Mail,
  phone: Phone,
};

export default function Icon({ name, size = 20, strokeWidth = 2, ...rest }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />;
}

/** Explicit social export so we do not pull unused brand glyphs into bundles. */
export const SOCIAL_ICONS = { Facebook, Instagram, Twitter };
