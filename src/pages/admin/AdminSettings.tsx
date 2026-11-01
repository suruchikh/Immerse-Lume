import React, { useState, useEffect } from 'react';
import { GlobalSettings, DesignSettings, AdminUser } from '../../types';
import { updateSettings, updateAdminCredentials } from '../../services/api';
import {
  Save,
  Check,
  KeyRound,
  Globe,
  Palette,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Lock,
  Mail as MailIcon,
  AlertCircle,
  Shield,
  Fingerprint
} from 'lucide-react';
import { DeviceImagePicker } from '../../components/admin/DeviceImagePicker';

interface AdminSettingsProps {
  settings: GlobalSettings;
  design: DesignSettings;
  adminUser?: AdminUser | null;
  onUserUpdate?: (updatedUser: AdminUser) => void;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  design,
  adminUser,
  onUserUpdate,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'design' | 'seo' | 'security'>('global');
  
  // Local state for forms
  const [globalForm, setGlobalForm] = useState<GlobalSettings>({ ...settings });
  const [designForm, setDesignForm] = useState<DesignSettings>({ ...design });

  // Admin Credentials form state
  const [usernameInput, setUsernameInput] = useState(adminUser?.username || 'admin');
  const [emailInput, setEmailInput] = useState(adminUser?.email || 'admin@immerselume.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status feedback
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [savingSecurity, setSavingSecurity] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync inputs if adminUser changes
  useEffect(() => {
    if (adminUser?.username) setUsernameInput(adminUser.username);
    if (adminUser?.email) setEmailInput(adminUser.email);
  }, [adminUser]);

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

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    const trimmedCurrentPass = currentPassword.trim();
    if (!trimmedCurrentPass) {
      setSecurityError('Please enter your current password to authorize changes (default is ImmerseLume2026!).');
      return;
    }

    const trimmedUsername = usernameInput.trim();
    const trimmedEmail = emailInput.trim();

    if (trimmedUsername.length < 3) {
      setSecurityError('Administrator username must be at least 3 characters long.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSecurityError('Please enter a valid administrator email address.');
      return;
    }

    if (newPassword) {
      const trimmedNewPass = newPassword.trim();
      if (trimmedNewPass.length < 8) {
        setSecurityError('New password must be at least 8 characters long.');
        return;
      }
      if (trimmedNewPass !== confirmPassword.trim()) {
        setSecurityError('New password and confirmation password do not match.');
        return;
      }
    }

    setSavingSecurity(true);
    try {
      const res = await updateAdminCredentials({
        currentPassword: trimmedCurrentPass,
        newUsername: trimmedUsername,
        newEmail: trimmedEmail,
        newPassword: newPassword ? newPassword.trim() : undefined
      });

      setSecuritySuccess('Admin credentials successfully updated! Your access is now secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (res.user && onUserUpdate) {
        onUserUpdate(res.user);
      }
      onRefresh();
      setTimeout(() => setSecuritySuccess(null), 5000);
    } catch (err: any) {
      setSecurityError(err.message || 'Failed to update credentials. Check your current password.');
    } finally {
      setSavingSecurity(false);
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
          Security & Credentials
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

      {/* Tab 4: Security & Credentials */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          {/* Active Account Overview Card */}
          <div className="bg-[#242220] border border-[#33302C] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#33302C]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1C1B1A] border border-[#DFC27D]/40 flex items-center justify-center text-[#DFC27D]">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                    <span>Active Administrator Profile</span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#DFC27D]/20 text-[#DFC27D] border border-[#DFC27D]/40 rounded-full">
                      Super Admin
                    </span>
                  </h3>
                  <p className="text-xs text-[#8A7E72] font-light">
                    Protected with 10-round bcrypt salted hashing & 7-day signed JWT authentication tokens.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#1C1B1A] border border-[#33302C] flex items-center gap-3">
                <User className="w-4 h-4 text-[#DFC27D] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">Current Username</span>
                  <span className="font-mono text-white text-sm">{adminUser?.username || 'admin'}</span>
                </div>
              </div>

              <div className="p-3 bg-[#1C1B1A] border border-[#33302C] flex items-center gap-3">
                <MailIcon className="w-4 h-4 text-[#DFC27D] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">Registered Email</span>
                  <span className="font-mono text-white text-sm">{adminUser?.email || 'admin@immerselume.com'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Update Form */}
          <form onSubmit={handleUpdateCredentials} className="bg-[#242220] border border-[#33302C] p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#DFC27D]" />
                <span>Update Admin Credentials</span>
              </h3>
              <p className="text-xs text-[#8A7E72] font-light">
                Modify your login username, notification email, or password. You must provide your current password to authorize any modification.
              </p>
            </div>

            {securitySuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-medium">{securitySuccess}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    Your new credentials will be required the next time you sign into the executive portal.
                  </p>
                </div>
              </div>
            )}

            {securityError && (
              <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <p className="font-medium">Verification Failed</p>
                  <p className="text-[11px] text-red-300/80 mt-0.5">{securityError}</p>
                </div>
              </div>
            )}

            {/* Current Password Verification (Mandatory) */}
            <div className="p-4 bg-[#1C1B1A] border border-[#DFC27D]/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#DFC27D] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Current Password (Required for Authorization)</span>
                </label>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#8A7E72]">Default initial: <code className="text-white font-mono">ImmerseLume2026!</code></span>
                  <button
                    type="button"
                    onClick={() => setCurrentPassword('ImmerseLume2026!')}
                    className="text-[#DFC27D] hover:underline cursor-pointer font-medium"
                  >
                    (Auto-fill Default)
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password (e.g. ImmerseLume2026!)"
                  className="w-full pl-3 pr-10 py-2.5 bg-[#242220] border border-[#33302C] text-xs text-white placeholder-[#5C5854] focus:outline-hidden focus:border-[#DFC27D]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-2.5 text-[#8A7E72] hover:text-white cursor-pointer"
                  title={showCurrentPass ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#8A7E72]">
                If you have not changed your password yet, use the initial password <span className="text-[#EAE3D2] font-mono">ImmerseLume2026!</span> or <span className="text-[#EAE3D2] font-mono">immerse2026</span>.
              </p>
            </div>

            {/* Change Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1.5">
                  New Admin Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-xs text-white focus:outline-hidden focus:border-[#DFC27D]"
                  />
                  <User className="w-4 h-4 text-[#8A7E72] absolute left-3 top-2.5" />
                </div>
                <span className="text-[10px] text-[#8A7E72] mt-1 block">
                  You can use this username or your email to sign in.
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1.5">
                  New Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@immerselume.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-xs text-white focus:outline-hidden focus:border-[#DFC27D]"
                  />
                  <MailIcon className="w-4 h-4 text-[#8A7E72] absolute left-3 top-2.5" />
                </div>
                <span className="text-[10px] text-[#8A7E72] mt-1 block">
                  Receives security notifications and concierge notifications.
                </span>
              </div>
            </div>

            {/* Change Password (Optional if only changing username) */}
            <div className="space-y-4 pt-3 border-t border-[#33302C]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-medium text-white flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#DFC27D]" />
                    <span>Change Password (Leave blank to keep current)</span>
                  </h4>
                </div>
                {newPassword && (
                  <span
                    className={`text-[10px] font-mono ${
                      newPassword.length >= 8 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {newPassword.length}/8 characters
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-3 pr-10 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-xs text-white placeholder-[#5C5854] focus:outline-hidden focus:border-[#DFC27D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-[#8A7E72] hover:text-white cursor-pointer"
                      title={showNewPass ? 'Hide password' : 'Show password'}
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2]">
                      Confirm New Password
                    </label>
                    {newPassword && confirmPassword && (
                      <span
                        className={`text-[10px] font-mono ${
                          newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {newPassword === confirmPassword ? '✓ Matches' : '✗ Does not match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-3 pr-10 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-xs text-white placeholder-[#5C5854] focus:outline-hidden focus:border-[#DFC27D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-2.5 text-[#8A7E72] hover:text-white cursor-pointer"
                      title={showConfirmPass ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#33302C]">
              <span className="text-[11px] text-[#8A7E72] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#DFC27D]" />
                <span>Changes take effect immediately across all sessions</span>
              </span>

              <button
                type="submit"
                disabled={savingSecurity}
                className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{savingSecurity ? 'Updating Credentials...' : 'Save New Credentials'}</span>
              </button>
            </div>
          </form>

          {/* Security Best Practices Card */}
          <div className="p-5 bg-[#1C1B1A] border border-[#33302C] space-y-3 text-xs text-[#8A7E72] leading-relaxed">
            <h4 className="font-serif text-sm font-medium text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#DFC27D]" />
              <span>Security & Deployment Notes</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
              <li>
                <strong className="text-[#EAE3D2]">Immediate Activation:</strong> Your updated username and password are saved to the persistent database and will be required for subsequent logins.
              </li>
              <li>
                <strong className="text-[#EAE3D2]">Dual Sign-in Support:</strong> You can log in using either your chosen username or your administrator email address.
              </li>
              <li>
                <strong className="text-[#EAE3D2]">Password Manager:</strong> We recommend storing your credentials securely in a password manager (e.g., Bitwarden, 1Password, Apple Keychain).
              </li>
              <li>
                <strong className="text-[#EAE3D2]">Vercel & Production Sync:</strong> When deploying to Vercel, credentials remain securely configured and authenticated across serverless endpoints.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
