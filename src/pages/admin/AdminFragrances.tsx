import React, { useState } from 'react';
import { Fragrance } from '../../types';
import { createFragrance, updateFragrance, deleteFragrance } from '../../services/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Sparkles } from 'lucide-react';

interface AdminFragrancesProps {
  fragrances: Fragrance[];
  onRefresh: () => void;
}

export const AdminFragrances: React.FC<AdminFragrancesProps> = ({ fragrances, onRefresh }) => {
  const [editingFragrance, setEditingFragrance] = useState<Partial<Fragrance> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const emptyFragrance: Partial<Fragrance> = {
    name: '',
    subTitle: '',
    tagline: '',
    description: '',
    image: '/src/assets/images/fragrance_crimson_canopy_1793372721733.jpg',
    notes: {
      top: '',
      heart: '',
      base: ''
    },
    published: true
  };

  const handleStartCreate = () => {
    setEditingFragrance({ ...emptyFragrance });
    setIsCreating(true);
  };

  const handleStartEdit = (f: Fragrance) => {
    setEditingFragrance({ ...f });
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFragrance?.name) return;
    setLoading(true);

    try {
      if (isCreating) {
        await createFragrance(editingFragrance);
        setMessage('Fragrance created successfully');
      } else if (editingFragrance.id) {
        await updateFragrance(editingFragrance.id, editingFragrance);
        setMessage('Fragrance updated successfully');
      }
      setEditingFragrance(null);
      onRefresh();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving fragrance');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete fragrance "${name}"?`)) return;
    try {
      await deleteFragrance(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTogglePublish = async (f: Fragrance) => {
    try {
      await updateFragrance(f.id, { published: !f.published });
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
            Fragrance Formulation & Notes
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Manage olfactory accords, pyramid structures (top, heart, base), and poetic taglines.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fragrance</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Fragrances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fragrances.map((f) => (
          <div
            key={f.id}
            className="bg-[#242220] border border-[#33302C] p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="flex gap-4 items-start">
              <img
                src={f.image}
                alt={f.name}
                className="w-20 h-20 object-cover border border-[#33302C] bg-[#1C1B1A] shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] uppercase tracking-widest text-[#DFC27D] font-mono block">
                  {f.subTitle}
                </span>
                <h3 className="font-serif text-xl font-medium text-white truncate">
                  {f.name}
                </h3>
                <p className="text-xs text-[#8A7E72] italic font-light truncate">
                  "{f.tagline}"
                </p>
              </div>
            </div>

            <p className="text-xs text-[#EAE3D2] font-light line-clamp-3">
              {f.description}
            </p>

            {/* Notes display */}
            <div className="p-3 bg-[#1C1B1A] border border-[#33302C] space-y-1.5 text-[11px]">
              <span className="text-[10px] uppercase tracking-wider text-[#DFC27D] block">
                Pyramid Architecture:
              </span>
              {f.notes.top && (
                <div className="text-[#8A7E72]">
                  <strong className="text-[#EAE3D2]">Top:</strong> {f.notes.top}
                </div>
              )}
              {f.notes.heart && (
                <div className="text-[#8A7E72]">
                  <strong className="text-[#EAE3D2]">Heart:</strong> {f.notes.heart}
                </div>
              )}
              {f.notes.base && (
                <div className="text-[#8A7E72]">
                  <strong className="text-[#EAE3D2]">Base:</strong> {f.notes.base}
                </div>
              )}
              {f.notes.floral && (
                <div className="text-[#8A7E72]">
                  <strong className="text-[#EAE3D2]">Floral:</strong> {f.notes.floral}
                </div>
              )}
              {f.notes.woody && (
                <div className="text-[#8A7E72]">
                  <strong className="text-[#EAE3D2]">Woody:</strong> {f.notes.woody}
                </div>
              )}
              {f.notes.overall && (
                <div className="text-[#8A7E72]">
                  <strong className="text-[#EAE3D2]">Mood:</strong> {f.notes.overall}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#33302C] flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(f)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium cursor-pointer border ${
                  f.published
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {f.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{f.published ? 'Live' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(f)}
                  className="p-1.5 text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
                  title="Edit fragrance"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(f.id, f.name)}
                  className="p-1.5 text-[#8A7E72] hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete fragrance"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Fragrance Modal */}
      {editingFragrance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#242220] border border-[#33302C] shadow-2xl p-6 md:p-8 my-auto text-left max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingFragrance(null)}
              className="absolute top-4 right-4 p-2 text-[#8A7E72] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-white mb-6">
              {isCreating ? 'Create Signature Fragrance' : `Edit: ${editingFragrance.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Fragrance Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFragrance.name || ''}
                    onChange={(e) => setEditingFragrance({ ...editingFragrance, name: e.target.value })}
                    placeholder="Crimson Canopy"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Subtitle / Primary Scent Note
                  </label>
                  <input
                    type="text"
                    value={editingFragrance.subTitle || ''}
                    onChange={(e) => setEditingFragrance({ ...editingFragrance, subTitle: e.target.value })}
                    placeholder="Saffron Sandal"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Poetic Tagline
                </label>
                <input
                  type="text"
                  value={editingFragrance.tagline || ''}
                  onChange={(e) => setEditingFragrance({ ...editingFragrance, tagline: e.target.value })}
                  placeholder="The warmth of spice. The richness of wood."
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingFragrance.description || ''}
                  onChange={(e) => setEditingFragrance({ ...editingFragrance, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              {/* Olfactory Notes */}
              <div className="p-4 bg-[#1C1B1A] border border-[#33302C] space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-[#DFC27D] font-medium block">
                  Olfactory Notes Formulation
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Top Notes</label>
                    <input
                      type="text"
                      value={editingFragrance.notes?.top || ''}
                      onChange={(e) =>
                        setEditingFragrance({
                          ...editingFragrance,
                          notes: { ...editingFragrance.notes, top: e.target.value }
                        })
                      }
                      placeholder="Saffron, Cardamom"
                      className="w-full px-2.5 py-1.5 bg-[#242220] border border-[#33302C] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Heart Notes</label>
                    <input
                      type="text"
                      value={editingFragrance.notes?.heart || ''}
                      onChange={(e) =>
                        setEditingFragrance({
                          ...editingFragrance,
                          notes: { ...editingFragrance.notes, heart: e.target.value }
                        })
                      }
                      placeholder="Sandalwood, Soft Rose"
                      className="w-full px-2.5 py-1.5 bg-[#242220] border border-[#33302C] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Base Notes</label>
                    <input
                      type="text"
                      value={editingFragrance.notes?.base || ''}
                      onChange={(e) =>
                        setEditingFragrance({
                          ...editingFragrance,
                          notes: { ...editingFragrance.notes, base: e.target.value }
                        })
                      }
                      placeholder="Amber, Musk"
                      className="w-full px-2.5 py-1.5 bg-[#242220] border border-[#33302C] text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Floral Notes</label>
                    <input
                      type="text"
                      value={editingFragrance.notes?.floral || ''}
                      onChange={(e) =>
                        setEditingFragrance({
                          ...editingFragrance,
                          notes: { ...editingFragrance.notes, floral: e.target.value }
                        })
                      }
                      placeholder="Romantic Rose"
                      className="w-full px-2.5 py-1.5 bg-[#242220] border border-[#33302C] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Woody Notes</label>
                    <input
                      type="text"
                      value={editingFragrance.notes?.woody || ''}
                      onChange={(e) =>
                        setEditingFragrance({
                          ...editingFragrance,
                          notes: { ...editingFragrance.notes, woody: e.target.value }
                        })
                      }
                      placeholder="Rich Oudh"
                      className="w-full px-2.5 py-1.5 bg-[#242220] border border-[#33302C] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Overall Mood</label>
                    <input
                      type="text"
                      value={editingFragrance.notes?.overall || ''}
                      onChange={(e) =>
                        setEditingFragrance({
                          ...editingFragrance,
                          notes: { ...editingFragrance.notes, overall: e.target.value }
                        })
                      }
                      placeholder="Warm, deep, sophisticated"
                      className="w-full px-2.5 py-1.5 bg-[#242220] border border-[#33302C] text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingFragrance.image || ''}
                  onChange={(e) => setEditingFragrance({ ...editingFragrance, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EAE3D2]">
                  <input
                    type="checkbox"
                    checked={editingFragrance.published !== false}
                    onChange={(e) => setEditingFragrance({ ...editingFragrance, published: e.target.checked })}
                    className="w-4 h-4 accent-[#DFC27D]"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#33302C]">
                <button
                  type="button"
                  onClick={() => setEditingFragrance(null)}
                  className="px-4 py-2 text-xs text-[#8A7E72] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Fragrance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
