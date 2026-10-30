import React, { useState, useRef } from 'react';
import { MediaItem } from '../../types';
import { uploadMedia, deleteMedia } from '../../services/api';
import { Upload, Trash2, Copy, Check, Search, Filter, Image as ImageIcon, Video, Folder } from 'lucide-react';

interface AdminMediaLibraryProps {
  media: MediaItem[];
  onRefresh: () => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({ media, onRefresh }) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ['All', 'Editorial', 'Products', 'Fragrances', 'Gifting', 'General'];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const type = file.type.startsWith('video') ? 'video' : 'image';
        const folder = selectedFolder === 'All' ? 'General' : selectedFolder;

        await uploadMedia(file.name, base64, folder, type);
        onRefresh();
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media item "${name}"?`)) return;
    try {
      await deleteMedia(id);
      onRefresh();
      if (previewMedia?.id === id) setPreviewMedia(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter((item) => {
    const matchesFolder = selectedFolder === 'All' || item.folder === selectedFolder;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#33302C]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Media Asset Library
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Directly upload, organize, and copy image/video URLs for website sections and products.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Media From Device'}</span>
          </button>
        </div>
      </div>

      {/* Controls: Search and Folders */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Folder tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                selectedFolder === f
                  ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
                  : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#1C1B1A] border border-[#33302C] text-xs text-white placeholder-[#8A7E72] focus:outline-hidden focus:border-[#DFC27D]"
          />
          <Search className="w-3.5 h-3.5 text-[#8A7E72] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group bg-[#242220] border border-[#33302C] overflow-hidden flex flex-col justify-between hover:border-[#DFC27D]/60 transition-colors"
          >
            <div
              onClick={() => setPreviewMedia(item)}
              className="aspect-square bg-[#1C1B1A] overflow-hidden relative cursor-pointer"
            >
              {item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1C1B1A] text-[#DFC27D]">
                  <Video className="w-8 h-8" />
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-wider text-[#DFC27D] bg-black/75 px-1.5 py-0.5 font-mono">
                {item.folder}
              </span>
            </div>

            <div className="p-2.5 space-y-2">
              <p className="text-[11px] text-[#EAE3D2] truncate font-medium" title={item.name}>
                {item.name}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#33302C]">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="text-[10px] uppercase text-[#DFC27D] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="text-[#8A7E72] hover:text-red-400 p-1 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#242220] border border-[#33302C] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#33302C]">
              <h4 className="font-serif text-lg text-white truncate max-w-md">
                {previewMedia.name}
              </h4>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-[#8A7E72] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-[#1C1B1A]">
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[55vh] object-contain"
              />
            </div>

            <div className="p-3 bg-[#1C1B1A] border border-[#33302C] text-xs font-mono text-[#DFC27D] flex items-center justify-between truncate">
              <span className="truncate pr-4">{previewMedia.url}</span>
              <button
                onClick={() => handleCopyUrl(previewMedia)}
                className="px-3 py-1 bg-[#DFC27D] text-[#1C1B1A] text-[10px] uppercase tracking-wider font-semibold shrink-0 cursor-pointer"
              >
                {copiedId === previewMedia.id ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
