import React, { useState } from 'react';
import { PageSection } from '../../types';
import { updateSection, createSection, deleteSection, reorderSections } from '../../services/api';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Layout, Copy, Check, X } from 'lucide-react';
import { DeviceImagePicker } from '../../components/admin/DeviceImagePicker';

interface AdminPageBuilderProps {
  sections: PageSection[];
  onRefresh: () => void;
}

export const AdminPageBuilder: React.FC<AdminPageBuilderProps> = ({ sections, onRefresh }) => {
  const [selectedPage, setSelectedPage] = useState<'home' | 'story' | 'collections' | 'fragrances' | 'gifting' | 'contact'>('home');
  const [editingSection, setEditingSection] = useState<Partial<PageSection> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pageSections = sections
    .filter((s) => s.page === selectedPage)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const emptySection: Partial<PageSection> = {
    page: selectedPage,
    sectionKey: `custom_${Date.now().toString().slice(-4)}`,
    title: 'New Editorial Section',
    subTitle: 'Immerse Lume',
    content: 'Discover handcrafted natural fragrance and glass vessels created to elevate everyday spaces.',
    mediaUrl: '/src/assets/images/hero_luxury_candle_interior_1793372721571.jpg',
    mediaType: 'image',
    buttonText: 'Explore Collection',
    buttonLink: '/collections',
    layout: 'split-right',
    visible: true,
    order: pageSections.length + 1
  };

  const handleStartCreate = () => {
    setEditingSection({ ...emptySection, page: selectedPage });
    setIsCreating(true);
  };

  const handleStartEdit = (sec: PageSection) => {
    setEditingSection({ ...sec });
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection?.title) return;
    setLoading(true);

    try {
      if (isCreating) {
        await createSection({ ...editingSection, page: selectedPage });
        setMessage('Section successfully created');
      } else if (editingSection.id) {
        await updateSection(editingSection.id, editingSection);
        setMessage('Section successfully updated');
      }
      setEditingSection(null);
      onRefresh();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving section');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Permanently delete section "${title}"?`)) return;
    try {
      await deleteSection(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleVisibility = async (sec: PageSection) => {
    try {
      await updateSection(sec.id, { visible: !sec.visible });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMove = async (sec: PageSection, direction: 'up' | 'down') => {
    const currentIndex = pageSections.findIndex((s) => s.id === sec.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === pageSections.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reordered = [...pageSections];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      await reorderSections(reordered.map((s) => s.id));
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#33302C]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Visual Website Page Builder
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Add, reorder, customize, and publish narrative sections without writing code.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section to {selectedPage.toUpperCase()}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Page Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#33302C]">
        {(['home', 'story', 'collections', 'fragrances', 'gifting', 'contact'] as const).map((page) => (
          <button
            key={page}
            onClick={() => setSelectedPage(page)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
              selectedPage === page
                ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
                : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
            }`}
          >
            {page} Page
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {pageSections.length === 0 ? (
          <div className="p-8 text-center bg-[#242220] border border-[#33302C] space-y-2">
            <p className="text-sm text-[#EAE3D2]">No customized sections yet for this page.</p>
            <p className="text-xs text-[#8A7E72]">Click "Add Section" above to compose a new section.</p>
          </div>
        ) : (
          pageSections.map((sec, idx) => (
            <div
              key={sec.id}
              className="bg-[#242220] border border-[#33302C] p-5 space-y-3 transition-colors hover:border-[#DFC27D]/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Order arrows */}
                  <div className="flex flex-col gap-0.5 text-[#8A7E72]">
                    <button
                      onClick={() => handleMove(sec, 'up')}
                      disabled={idx === 0}
                      className="hover:text-[#DFC27D] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(sec, 'down')}
                      disabled={idx === pageSections.length - 1}
                      className="hover:text-[#DFC27D] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] uppercase font-mono text-[#DFC27D] bg-[#1C1B1A] px-2 py-0.5 border border-[#33302C]">
                    Position 0{idx + 1} · {sec.sectionKey}
                  </span>

                  <h3 className="font-serif text-lg font-medium text-white truncate max-w-md">
                    {sec.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] px-2 py-0.5 bg-[#1C1B1A] border border-[#33302C]">
                    Layout: {sec.layout}
                  </span>

                  <button
                    onClick={() => handleToggleVisibility(sec)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium cursor-pointer border ${
                      sec.visible
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {sec.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(sec)}
                    className="p-1.5 text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
                    title="Edit section"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(sec.id, sec.title)}
                    className="p-1.5 text-[#8A7E72] hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section Preview Snippet */}
              <div className="p-3 bg-[#1C1B1A] border border-[#33302C] text-xs text-[#8A7E72] flex flex-col sm:flex-row gap-4 items-start">
                {sec.mediaUrl && (
                  <img
                    src={sec.mediaUrl}
                    alt={sec.title}
                    className="w-20 h-14 object-cover border border-[#33302C] shrink-0"
                  />
                )}
                <div className="space-y-1 min-w-0">
                  <p className="text-white line-clamp-2">{sec.content}</p>
                  {sec.buttonText && (
                    <span className="text-[10px] text-[#DFC27D]">
                      CTA: "{sec.buttonText}" → {sec.buttonLink}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Section Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#242220] border border-[#33302C] shadow-2xl p-6 md:p-8 my-auto text-left max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingSection(null)}
              className="absolute top-4 right-4 p-2 text-[#8A7E72] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-white mb-6">
              {isCreating ? 'Add Narrative Section' : `Edit: ${editingSection.title}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Section Identifier Key
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSection.sectionKey || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, sectionKey: e.target.value })}
                    placeholder="e.g. hero, philosophy, lifestyle"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Layout Style
                  </label>
                  <select
                    value={editingSection.layout || 'split-left'}
                    onChange={(e: any) => setEditingSection({ ...editingSection, layout: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                  >
                    <option value="full">Full-Width Cinematic</option>
                    <option value="split-left">Split (Image Left, Text Right)</option>
                    <option value="split-right">Split (Text Left, Image Right)</option>
                    <option value="centered">Centered Editorial Prose</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Section Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingSection.title || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  placeholder="The Art of Living in the Moment"
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-serif text-base"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Kicker / Subtitle
                </label>
                <input
                  type="text"
                  value={editingSection.subTitle || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subTitle: e.target.value })}
                  placeholder="Elevate Every Moment"
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Primary Prose / Paragraph
                </label>
                <textarea
                  rows={4}
                  value={editingSection.content || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Secondary Paragraph / Quote (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editingSection.secondaryContent || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, secondaryContent: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              {/* Section Media with Direct Device Upload */}
              <DeviceImagePicker
                value={editingSection.mediaUrl || ''}
                onChange={(newUrl) => setEditingSection({ ...editingSection, mediaUrl: newUrl })}
                label="Section Visual Media / Banner"
                folder="Editorial"
                aspectRatio="banner"
                helperText="Upload cinematic editorial photo or lifestyle imagery directly from your device."
              />

              {/* CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={editingSection.buttonText || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, buttonText: e.target.value })}
                    placeholder="Explore Collections"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Primary Button Destination Link
                  </label>
                  <input
                    type="text"
                    value={editingSection.buttonLink || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, buttonLink: e.target.value })}
                    placeholder="/collections"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EAE3D2]">
                  <input
                    type="checkbox"
                    checked={editingSection.visible !== false}
                    onChange={(e) => setEditingSection({ ...editingSection, visible: e.target.checked })}
                    className="w-4 h-4 accent-[#DFC27D]"
                  />
                  <span>Published & Visible on Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#33302C]">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-xs text-[#8A7E72] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
