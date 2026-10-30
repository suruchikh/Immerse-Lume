import React from 'react';
import { GlobalSettings } from '../types';

interface AnnouncementBarProps {
  settings: GlobalSettings;
  onNavigate?: (path: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings, onNavigate }) => {
  if (!settings.announcementBar?.visible || !settings.announcementBar?.text) {
    return null;
  }

  const handleClick = () => {
    if (settings.announcementBar.link && onNavigate) {
      onNavigate(settings.announcementBar.link);
    }
  };

  return (
    <aside aria-label="Announcement" className="bg-[#1C1B1A] text-[#EAE3D2] text-[11px] sm:text-xs py-2 px-4 tracking-[0.2em] uppercase text-center border-b border-[#2C2B2A] transition-colors relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {settings.announcementBar.link ? (
          <button
            onClick={handleClick}
            className="hover:text-[#DFC27D] transition-colors inline-flex items-center gap-2 cursor-pointer font-light"
          >
            <span>{settings.announcementBar.text}</span>
          </button>
        ) : (
          <span className="font-light">{settings.announcementBar.text}</span>
        )}
      </div>
    </aside>
  );
};
