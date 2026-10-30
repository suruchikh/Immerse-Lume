export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'Glass Candles' | 'Metal Candles' | 'Mandala Candles' | 'Diffusers' | 'Diffuser Oils' | 'Gift Sets';
  subCategory?: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  videoUrl?: string;
  fragrances: string[];
  colours: string[];
  weight: string;
  vessel: string;
  wicks: number;
  burnTime?: string;
  usage: string;
  countryOfOrigin: string;
  waxType: string;
  dimensions?: string;
  careInstructions?: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  parentCategory: 'Candles' | 'Diffusers' | 'Diffuser Oils' | 'Gift Sets';
  description: string;
  image: string;
  order: number;
  published: boolean;
}

export interface FragranceNote {
  top?: string;
  heart?: string;
  base?: string;
  floral?: string;
  woody?: string;
  overall?: string;
}

export interface Fragrance {
  id: string;
  slug: string;
  name: string;
  subTitle: string;
  tagline: string;
  description: string;
  image: string;
  notes: FragranceNote;
  published: boolean;
}

export interface PageSection {
  id: string;
  page: 'home' | 'story' | 'collections' | 'fragrances' | 'gifting' | 'contact';
  sectionKey: string;
  title: string;
  subTitle?: string;
  content: string;
  secondaryContent?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  layout: 'split-left' | 'split-right' | 'centered' | 'full' | 'grid';
  visible: boolean;
  order: number;
}

export interface DesignSettings {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
}

export interface GlobalSettings {
  siteName: string;
  tagline: string;
  announcementBar: {
    text: string;
    visible: boolean;
    link?: string;
  };
  logoText: string;
  logoImage?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  instagramUrl: string;
  footerCopyright: string;
  footerDescription: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
  };
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  folder: string;
  size?: string;
  createdAt: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'archived';
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'editor';
}
