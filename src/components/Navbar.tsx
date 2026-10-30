import React, { useState, useEffect } from 'react';
import { GlobalSettings, Collection } from '../types';
import { Menu, X, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-xs border-b border-[#EAE3D2]/70 py-3.5'
          : 'bg-[#FDFBF7] border-b border-[#EAE3D2]/40 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('/')}
          className="text-left group cursor-pointer shrink-0"
        >
          <span className="font-serif text-2xl md:text-3xl tracking-[0.22em] font-medium text-[#1C1B1A] uppercase transition-colors group-hover:text-[#C29B38]">
            {settings.logoText || 'IMMERSE LUME'}
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.14em] uppercase font-medium text-[#5C5854]">
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
                  isActive
                    ? 'text-[#1C1B1A] font-semibold'
                    : 'hover:text-[#1C1B1A]'
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

        {/* Zone 3: Primary Action & Admin Link */}
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

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => handleNavClick('/contact')}
            className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-[#1C1B1A] border border-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-white transition-colors"
          >
            Enquire
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1C1B1A] hover:text-[#C29B38] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-[#EAE3D2] px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 text-sm uppercase tracking-widest text-[#1C1B1A]">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`text-left py-2 border-b border-[#EAE3D2]/40 transition-colors ${
                  currentPath === item.path ? 'text-[#C29B38] font-semibold' : 'text-[#1C1B1A]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('/contact')}
                className="w-full py-3 text-center text-xs font-medium uppercase tracking-[0.16em] bg-[#1C1B1A] text-[#FDFBF7]"
              >
                Concierge Enquiry
              </button>
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full py-2.5 text-center text-xs tracking-wider text-[#8A7E72] hover:text-[#1C1B1A]"
              >
                Admin Portal Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
