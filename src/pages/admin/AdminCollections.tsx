import React, { useState } from 'react';
import { Collection } from '../../types';
import { createCollection, updateCollection, deleteCollection } from '../../services/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';
import { DeviceImagePicker } from '../../components/admin/DeviceImagePicker';

interface AdminCollectionsProps {
  collections: Collection[];
  onRefresh: () => void;
}

export const AdminCollections: React.FC<AdminCollectionsProps> = ({ collections, onRefresh }) => {
  const [editingCollection, setEditingCollection] = useState<Partial<Collection> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const emptyCollection: Partial<Collection> = {
    name: '',
    parentCategory: 'Candles',
    description: '',
    image: '/src/assets/images/product_atelier_screw_jar_1793372739090.jpg',
    order: collections.length + 1,
    published: true
  };

  const handleStartCreate = () => {
    setEditingCollection({ ...emptyCollection });
    setIsCreating(true);
  };

  const handleStartEdit = (col: Collection) => {
    setEditingCollection({ ...col });
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection?.name || !editingCollection?.parentCategory) return;
    setLoading(true);

    try {
      if (isCreating) {
        await createCollection(editingCollection);
        setMessage('Collection created successfully');
      } else if (editingCollection.id) {
        await updateCollection(editingCollection.id, editingCollection);
        setMessage('Collection updated successfully');
      }
      setEditingCollection(null);
      onRefresh();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"?`)) return;
    try {
      await deleteCollection(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTogglePublish = async (col: Collection) => {
    try {
      await updateCollection(col.id, { published: !col.published });
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
            Collection Management
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Configure vessel groupings, cover visual assets, and public taxonomy.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#242220] border border-[#33302C] overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-16/9 bg-[#1C1B1A] relative overflow-hidden">
              <img
                src={col.image || '/src/assets/images/product_atelier_screw_jar_1793372739090.jpg'}
                alt={col.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#1C1B1A]/80 text-[#DFC27D] text-[10px] tracking-widest uppercase px-2 py-0.5 font-light">
                {col.parentCategory}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-white">
                  {col.name}
                </h3>
                <p className="text-xs text-[#8A7E72] font-light line-clamp-2 mt-1">
                  {col.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#33302C] flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(col)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium cursor-pointer border ${
                    col.published
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {col.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{col.published ? 'Live' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(col)}
                    className="p-1.5 text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
                    title="Edit collection"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="p-1.5 text-[#8A7E72] hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Collection Modal */}
      {editingCollection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#242220] border border-[#33302C] shadow-2xl p-6 md:p-8 my-auto text-left">
            <button
              onClick={() => setEditingCollection(null)}
              className="absolute top-4 right-4 p-2 text-[#8A7E72] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-white mb-6">
              {isCreating ? 'Create New Collection' : `Edit: ${editingCollection.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCollection.name || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  placeholder="e.g. Glass Candles"
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Parent Category *
                </label>
                <select
                  value={editingCollection.parentCategory || 'Candles'}
                  onChange={(e: any) => setEditingCollection({ ...editingCollection, parentCategory: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                >
                  <option value="Candles">Candles</option>
                  <option value="Diffusers">Diffusers</option>
                  <option value="Diffuser Oils">Diffuser Oils</option>
                  <option value="Gift Sets">Gift Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCollection.description || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  placeholder="Description of the vessels and aesthetics..."
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white"
                />
              </div>

              {/* Collection Cover Image with Direct Device Upload */}
              <DeviceImagePicker
                value={editingCollection.image || ''}
                onChange={(newUrl) => setEditingCollection({ ...editingCollection, image: newUrl })}
                label="Collection Cover Photo"
                folder="Collections"
                aspectRatio="video"
                helperText="Upload a high-resolution landscape photograph from your device for the collection card."
              />

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EAE3D2]">
                  <input
                    type="checkbox"
                    checked={editingCollection.published !== false}
                    onChange={(e) => setEditingCollection({ ...editingCollection, published: e.target.checked })}
                    className="w-4 h-4 accent-[#DFC27D]"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#33302C]">
                <button
                  type="button"
                  onClick={() => setEditingCollection(null)}
                  className="px-4 py-2 text-xs text-[#8A7E72] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
