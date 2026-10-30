import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  Layout,
  Image as ImageIcon,
  Settings,
  Mail,
  Database,
  LogOut,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  newEnquiriesCount: number;
  user: any;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onViewWebsite,
  newEnquiriesCount,
  user,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'fragrances', label: 'Fragrances', icon: Sparkles },
    { id: 'page_builder', label: 'Page Builder', icon: Layout },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'enquiries', label: 'Enquiries', icon: Mail, badge: newEnquiriesCount },
    { id: 'settings', label: 'Brand & Design', icon: Settings },
    { id: 'supabase', label: 'Database Hub', icon: Database },
  ];

  const handleSelectTab = (id: string) => {
    onSelectTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1C1B1A] text-[#FDFBF7] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#242220] border-b border-[#33302C]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-[#8A7E72] hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Open admin menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-lg tracking-[0.18em] font-medium text-white uppercase">
            IMMERSE LUME
          </span>
        </div>

        <button
          onClick={onViewWebsite}
          className="text-[11px] text-[#DFC27D] uppercase tracking-wider px-2 py-1 border border-[#33302C]"
        >
          View Site
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 md:w-64 bg-[#242220] border-r border-[#33302C] flex flex-col justify-between p-5 md:p-6 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#DFC27D] font-medium block">
                Admin CMS
              </span>
              <button
                onClick={onViewWebsite}
                className="font-serif text-2xl font-medium tracking-[0.18em] text-white hover:text-[#DFC27D] transition-colors uppercase block cursor-pointer"
              >
                IMMERSE LUME
              </button>
              <p className="text-[11px] text-[#8A7E72] font-light">
                Executive Console
              </p>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-2 text-[#8A7E72] hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close admin menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-xs min-h-[44px] ${
                    isActive
                      ? 'bg-[#DFC27D] text-[#1C1B1A] font-semibold shadow-xs'
                      : 'text-[#8A7E72] hover:bg-[#1C1B1A] hover:text-[#EAE3D2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded-full font-mono">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User info & logout */}
        <div className="pt-4 border-t border-[#33302C] space-y-2.5 text-left">
          <div className="text-[11px] text-[#8A7E72] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-white font-medium truncate">{user?.username || 'Administrator'}</p>
              <p className="text-[10px] text-[#DFC27D] font-mono">{user?.role || 'super_admin'}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-[#8A7E72] hover:text-red-400 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewWebsite}
            className="w-full py-2.5 bg-[#1C1B1A] hover:bg-[#2C2A28] border border-[#33302C] text-[#EAE3D2] text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#DFC27D]" />
            <span>Return to Site</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
