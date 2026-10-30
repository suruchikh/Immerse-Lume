import React, { useState, useEffect } from 'react';
import { GlobalSettings, Collection } from '../types';
import { Menu, X, ChevronDown, Sparkles, Send, ShieldCheck, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings: GlobalSettings;
  collections: Collection[];
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, settings, collections }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [mobileCollectionsExpanded, setMobileCollectionsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Our Story', path: '/story' },
    { label: 'Collections', path: '/collections', hasDropdown: true },
    { label: 'Fragrances', path: '/fragrances' },
    { label: 'Gifting', path: '/gifting' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/98 backdrop-blur-md shadow-xs border-b border-[#EAE3D2]/80 py-3 md:py-3.5'
            : 'bg-[#FDFBF7] border-b border-[#EAE3D2]/40 py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('/')}
            className="text-left group cursor-pointer shrink-0 min-h-[44px] flex items-center"
            aria-label="Immerse Lume Home"
          >
            <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.2em] font-medium text-[#1C1B1A] uppercase transition-colors group-hover:text-[#C29B38] whitespace-nowrap">
              {settings.logoText || 'IMMERSE LUME'}
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13px] tracking-[0.14em] uppercase font-medium text-[#5C5854]">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setCollectionsDropdownOpen(true)}
                    onMouseLeave={() => setCollectionsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick('/collections')}
                      className={`inline-flex items-center gap-1.5 py-1 whitespace-nowrap cursor-pointer transition-colors ${
                        isActive ? 'text-[#1C1B1A] font-semibold' : 'hover:text-[#1C1B1A]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    {/* Dropdown Menu */}
                    {collectionsDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 pt-3 z-50">
                        <div className="bg-[#FDFBF7] border border-[#EAE3D2] shadow-xl py-3 px-2 rounded-xs">
                          <button
                            onClick={() => handleNavClick('/collections')}
                            className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] hover:bg-[#F5EFEB] rounded-xs transition-colors"
                          >
                            All Collections
                          </button>
                          <div className="h-px bg-[#EAE3D2]/60 my-1 mx-2" />
                          {collections.map((col) => (
                            <button
                              key={col.id}
                              onClick={() => handleNavClick(`/collections?category=${encodeURIComponent(col.name)}`)}
                              className="w-full text-left px-4 py-2 text-xs normal-case tracking-normal text-[#5C5854] hover:text-[#1C1B1A] hover:bg-[#F5EFEB] rounded-xs transition-colors"
                            >
                              {col.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className={`py-1 whitespace-nowrap cursor-pointer transition-colors relative ${
                    isActive ? 'text-[#1C1B1A] font-semibold' : 'hover:text-[#1C1B1A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C29B38]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Desktop Action & Admin Link */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('/contact')}
              className="px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[#1C1B1A] border border-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-[#FDFBF7] transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Concierge Enquiry
            </button>
            <button
              onClick={() => handleNavClick('/admin')}
              className="text-[11px] text-[#8A7E72] hover:text-[#1C1B1A] uppercase tracking-[0.18em] transition-colors cursor-pointer whitespace-nowrap px-2 py-1"
              title="Open Admin Dashboard"
            >
              Admin
            </button>
          </div>

          {/* Mobile Right Action + Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('/contact')}
              className="px-3 py-2 text-[11px] uppercase tracking-wider font-medium text-[#1C1B1A] border border-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-white transition-colors min-h-[40px] flex items-center"
            >
              Enquire
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#1C1B1A] hover:text-[#C29B38] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer rounded-xs"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer with Safe Scrolling */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] sm:top-[68px] z-50 bg-[#FDFBF7] overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-between pb-12">
          <div className="px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-1 text-base uppercase tracking-widest text-[#1C1B1A]">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;

                if (item.hasDropdown) {
                  return (
                    <div key={item.label} className="border-b border-[#EAE3D2]/70 py-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleNavClick('/collections')}
                          className={`text-left py-3 min-h-[44px] flex items-center font-medium ${
                            isActive ? 'text-[#C29B38]' : 'text-[#1C1B1A]'
                          }`}
                        >
                          {item.label}
                        </button>
                        <button
                          onClick={() => setMobileCollectionsExpanded(!mobileCollectionsExpanded)}
                          className="p-3 text-[#8A7E72] hover:text-[#1C1B1A] min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Expand collections submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileCollectionsExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Expanded Mobile Sub-Collections */}
                      {mobileCollectionsExpanded && (
                        <div className="pl-4 pb-2 space-y-2 border-l-2 border-[#C29B38]/40 my-1 animate-in fade-in duration-150">
                          <button
                            onClick={() => handleNavClick('/collections')}
                            className="block text-left text-xs uppercase tracking-wider text-[#1C1B1A] font-semibold py-2"
                          >
                            All Categories →
                          </button>
                          {collections.map((col) => (
                            <button
                              key={col.id}
                              onClick={() =>
                                handleNavClick(`/collections?category=${encodeURIComponent(col.name)}`)
                              }
                              className="block text-left text-xs tracking-normal text-[#5C5854] py-1.5 hover:text-[#1C1B1A]"
                            >
                              {col.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`text-left py-3.5 min-h-[44px] flex items-center border-b border-[#EAE3D2]/70 transition-colors ${
                      isActive ? 'text-[#C29B38] font-semibold' : 'text-[#1C1B1A]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Actions */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => handleNavClick('/contact')}
                className="w-full min-h-[48px] py-3.5 text-center text-xs font-medium uppercase tracking-[0.2em] bg-[#1C1B1A] text-[#FDFBF7] flex items-center justify-center gap-2 active:bg-[#323827]"
              >
                <Send className="w-3.5 h-3.5 text-[#DFC27D]" />
                <span>Concierge Enquiry</span>
              </button>

              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full min-h-[44px] py-2.5 text-center text-xs tracking-wider text-[#8A7E72] hover:text-[#1C1B1A] border border-[#EAE3D2] flex items-center justify-center gap-2 bg-[#F5EFEB]/50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>Admin Management Portal</span>
              </button>
            </div>
          </div>

          {/* Mobile Footer Note */}
          <div className="px-6 pt-4 text-center text-[11px] text-[#8A7E72] border-t border-[#EAE3D2]/60">
            <p className="font-serif italic">Immerse Lume · Elevate Every Moment</p>
          </div>
        </div>
      )}
    </>
  );
};
