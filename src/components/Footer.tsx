import React from 'react';
import { GlobalSettings, Collection } from '../types';
import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  settings: GlobalSettings;
  collections: Collection[];
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, collections, onNavigate }) => {
  return (
    <footer className="bg-[#1C1B1A] text-[#FDFBF7] pt-20 pb-12 border-t border-[#2D2A26]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#2E2C29]">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-5">
            <button
              onClick={() => onNavigate('/')}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-2xl tracking-[0.24em] font-medium text-[#FDFBF7] uppercase group-hover:text-[#DFC27D] transition-colors">
                {settings.logoText || 'IMMERSE LUME'}
              </span>
            </button>
            <p className="text-xs text-[#8A7E72] leading-relaxed max-w-sm font-light">
              {settings.footerDescription ||
                'Luxury home fragrance house creating scented candles, diffusers, and sensory vessels inspired by the art of living in the moment.'}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-[#C29B38]">
                {settings.tagline || 'Elevate Every Moment.'}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#EAE3D2]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8A7E72]">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/story')}
                  className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/collections')}
                  className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/fragrances')}
                  className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
                >
                  Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/gifting')}
                  className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
                >
                  Gifting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
                >
                  Contact & Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#EAE3D2]">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8A7E72]">
              {collections.map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => onNavigate(`/collections?category=${encodeURIComponent(col.name)}`)}
                    className="hover:text-[#FDFBF7] transition-colors cursor-pointer text-left"
                  >
                    {col.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Studio */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#EAE3D2]">
              Concierge
            </h4>
            <div className="space-y-3 text-xs text-[#8A7E72] font-light">
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2 hover:text-[#FDFBF7] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C29B38]" />
                  <span>{settings.contactEmail}</span>
                </a>
              )}
              {settings.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-2 hover:text-[#FDFBF7] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C29B38]" />
                  <span>{settings.contactPhone}</span>
                </a>
              )}
              {settings.contactAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C29B38] mt-0.5 shrink-0" />
                  <span>{settings.contactAddress}</span>
                </div>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#DFC27D] hover:text-[#FDFBF7] transition-colors pt-2"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Follow on Instagram</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#5C5854] gap-4">
          <p>{settings.footerCopyright || '© 2026 Immerse Lume. All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span>Handcrafted in India</span>
            <span>·</span>
            <span>Natural Soy Wax</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
