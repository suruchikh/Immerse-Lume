import React, { useState } from 'react';
import { GlobalSettings, DesignSettings } from '../../types';
import { updateSettings, changeAdminPassword } from '../../services/api';
import { Save, Check, KeyRound, Globe, Palette, ShieldCheck, Mail, Instagram } from 'lucide-react';
import { DeviceImagePicker } from '../../components/admin/DeviceImagePicker';

interface AdminSettingsProps {
  settings: GlobalSettings;
  design: DesignSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, design, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'design' | 'seo' | 'security'>('global');
  
  // Local state for forms
  const [globalForm, setGlobalForm] = useState<GlobalSettings>({ ...settings });
  const [designForm, setDesignForm] = useState<DesignSettings>({ ...design });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ global: globalForm });
      setSuccessMessage('Global website & brand settings saved');
      onRefresh();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ design: designForm });
      setSuccessMessage('Design palette & typography saved');
      onRefresh();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving design settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setPasswordStatus(null);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordStatus('Password successfully updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      alert(err.message || 'Password update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#33302C]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Brand Settings & System Governance
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Configure global announcements, contact addresses, SEO metadata, and security credentials.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#33302C] pb-2">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
            activeTab === 'global'
              ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
              : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
          }`}
        >
          Brand & Announcement
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
            activeTab === 'design'
              ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
              : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
          }`}
        >
          Design & Palette
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
            activeTab === 'seo'
              ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
              : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
          }`}
        >
          SEO & Social Sharing
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
            activeTab === 'security'
              ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
              : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* Tab 1: Global Brand & Announcement */}
      {activeTab === 'global' && (
        <form onSubmit={handleSaveGlobal} className="bg-[#242220] border border-[#33302C] p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#DFC27D]" />
              <span>Announcement Bar Top Banner</span>
            </h3>

            <div className="p-4 bg-[#1C1B1A] border border-[#33302C] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EAE3D2]">
                <input
                  type="checkbox"
                  checked={globalForm.announcementBar?.visible || false}
                  onChange={(e) =>
                    setGlobalForm({
                      ...globalForm,
                      announcementBar: { ...globalForm.announcementBar, visible: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#DFC27D]"
                />
                <span>Display Announcement Bar on Public Website</span>
              </label>

              <div>
                <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">
                  Banner Text Message
                </label>
                <input
                  type="text"
                  value={globalForm.announcementBar?.text || ''}
                  onChange={(e) =>
                    setGlobalForm({
                      ...globalForm,
                      announcementBar: { ...globalForm.announcementBar, text: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-[#242220] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">
                  Click Destination Link (Optional)
                </label>
                <input
                  type="text"
                  value={globalForm.announcementBar?.link || ''}
                  onChange={(e) =>
                    setGlobalForm({
                      ...globalForm,
                      announcementBar: { ...globalForm.announcementBar, link: e.target.value }
                    })
                  }
                  placeholder="/gifting"
                  className="w-full px-3 py-2 bg-[#242220] border border-[#33302C] text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Brand Identity & Header Text */}
          <div className="space-y-4 pt-4 border-t border-[#33302C]">
            <h3 className="font-serif text-xl font-medium text-white">
              Header & Footer Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Brand Name / Logo Text
                </label>
                <input
                  type="text"
                  value={globalForm.logoText || ''}
                  onChange={(e) => setGlobalForm({ ...globalForm, logoText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={globalForm.tagline || ''}
                  onChange={(e) => setGlobalForm({ ...globalForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>
            </div>

            <DeviceImagePicker
              value={globalForm.logoImage || ''}
              onChange={(newUrl) => setGlobalForm({ ...globalForm, logoImage: newUrl })}
              label="Brand Logo Image (Optional / Device Upload)"
              folder="General"
              aspectRatio="auto"
              helperText="Upload transparent PNG or SVG logo file from your device if you prefer a graphical emblem over typographic wordmark."
            />

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                Footer Brand Description
              </label>
              <textarea
                rows={2}
                value={globalForm.footerDescription || ''}
                onChange={(e) => setGlobalForm({ ...globalForm, footerDescription: e.target.value })}
                className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
              />
            </div>
          </div>

          {/* Concierge Contact Details */}
          <div className="space-y-4 pt-4 border-t border-[#33302C]">
            <h3 className="font-serif text-xl font-medium text-white">
              Studio & Concierge Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Concierge Email
                </label>
                <input
                  type="email"
                  value={globalForm.contactEmail || ''}
                  onChange={(e) => setGlobalForm({ ...globalForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={globalForm.contactPhone || ''}
                  onChange={(e) => setGlobalForm({ ...globalForm, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Studio Address
                </label>
                <input
                  type="text"
                  value={globalForm.contactAddress || ''}
                  onChange={(e) => setGlobalForm({ ...globalForm, contactAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={globalForm.instagramUrl || ''}
                  onChange={(e) => setGlobalForm({ ...globalForm, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#33302C]">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Brand Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Design & Palette */}
      {activeTab === 'design' && (
        <form onSubmit={handleSaveDesign} className="bg-[#242220] border border-[#33302C] p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#DFC27D]" />
              <span>Luxury Brand Color Palette</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Charcoal Canvas
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designForm.primaryColor}
                    onChange={(e) => setDesignForm({ ...designForm, primaryColor: e.target.value })}
                    className="w-10 h-10 border border-[#33302C] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designForm.primaryColor}
                    onChange={(e) => setDesignForm({ ...designForm, primaryColor: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Gold Accent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designForm.accentColor}
                    onChange={(e) => setDesignForm({ ...designForm, accentColor: e.target.value })}
                    className="w-10 h-10 border border-[#33302C] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designForm.accentColor}
                    onChange={(e) => setDesignForm({ ...designForm, accentColor: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Warm Ivory Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designForm.bgColor}
                    onChange={(e) => setDesignForm({ ...designForm, bgColor: e.target.value })}
                    className="w-10 h-10 border border-[#33302C] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designForm.bgColor}
                    onChange={(e) => setDesignForm({ ...designForm, bgColor: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#33302C]">
            <h3 className="font-serif text-xl font-medium text-white">
              Typography Pairing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Heading Font (Display Serif)
                </label>
                <select
                  value={designForm.headingFont}
                  onChange={(e) => setDesignForm({ ...designForm, headingFont: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                >
                  <option value="Cormorant Garamond">Cormorant Garamond (Editorial Luxury)</option>
                  <option value="Playfair Display">Playfair Display (Boutique High-Contrast)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Body Prose Font
                </label>
                <select
                  value={designForm.bodyFont}
                  onChange={(e) => setDesignForm({ ...designForm, bodyFont: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Crisp Modern)</option>
                  <option value="system-ui">System Default</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#33302C]">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Design Tokens'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: SEO & Social Sharing */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveGlobal} className="bg-[#242220] border border-[#33302C] p-6 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
              Global Meta Title (Browser & Search Snippet)
            </label>
            <input
              type="text"
              value={globalForm.seo?.metaTitle || ''}
              onChange={(e) =>
                setGlobalForm({
                  ...globalForm,
                  seo: { ...globalForm.seo, metaTitle: e.target.value }
                })
              }
              className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={globalForm.seo?.metaDescription || ''}
              onChange={(e) =>
                setGlobalForm({
                  ...globalForm,
                  seo: { ...globalForm.seo, metaDescription: e.target.value }
                })
              }
              className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
              Search Keywords
            </label>
            <input
              type="text"
              value={globalForm.seo?.keywords || ''}
              onChange={(e) =>
                setGlobalForm({
                  ...globalForm,
                  seo: { ...globalForm.seo, keywords: e.target.value }
                })
              }
              className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
            />
          </div>

          <DeviceImagePicker
            value={globalForm.seo?.ogImage || ''}
            onChange={(newUrl) =>
              setGlobalForm({
                ...globalForm,
                seo: { ...globalForm.seo, ogImage: newUrl }
              })
            }
            label="Social Share & OpenGraph Preview Image"
            folder="Editorial"
            aspectRatio="video"
            helperText="Upload social sharing banner image (1200x630 landscape recommended) directly from your device."
          />

          <div className="flex justify-end pt-4 border-t border-[#33302C]">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save SEO Metadata'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-[#242220] border border-[#33302C] p-6 space-y-4 max-w-lg">
          <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DFC27D]" />
            <span>Update Admin Password</span>
          </h3>
          <p className="text-xs text-[#8A7E72] font-light">
            Securely hashes the new administrator password using bcrypt before persisting.
          </p>

          {passwordStatus && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{passwordStatus}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
              New Password (minimum 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
