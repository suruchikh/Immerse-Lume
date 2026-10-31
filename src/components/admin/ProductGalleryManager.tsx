import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, ArrowLeft, ArrowRight, Star, RefreshCw, FolderOpen, Image as ImageIcon, Check } from 'lucide-react';
import { uploadMedia, fetchMedia } from '../../services/api';
import { optimizeDeviceImage } from '../../utils/imageOptimizer';
import { MediaItem } from '../../types';

interface ProductGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export const ProductGalleryManager: React.FC<ProductGalleryManagerProps> = ({
  images = [],
  onChange,
  folder = 'Products'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [showManualUrls, setShowManualUrls] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process multiple files selected from device
  const handleUploadFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    setUploading(true);
    const newUploadedUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadProgressText(`Uploading ${i + 1} of ${validFiles.length}: ${file.name}`);
      try {
        const optimized = await optimizeDeviceImage(file);
        const uploaded = await uploadMedia(optimized.name, optimized.base64, folder, 'image');
        newUploadedUrls.push(uploaded.url);
      } catch (err: any) {
        console.error('Failed to upload file', file.name, err);
        // Fallback to reading file directly as data url
        try {
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                newUploadedUrls.push(reader.result);
              }
              resolve();
            };
            reader.readAsDataURL(file);
          });
        } catch (e) {
          // Skip file on error
        }
      }
    }

    if (newUploadedUrls.length > 0) {
      onChange([...images, ...newUploadedUrls]);
    }
    setUploading(false);
    setUploadProgressText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === images.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [primary] = updated.splice(index, 1);
    updated.unshift(primary);
    onChange(updated);
  };

  const openLibraryModal = async () => {
    setLibraryOpen(true);
    setLoadingLibrary(true);
    try {
      const items = await fetchMedia();
      setLibraryItems(items.filter((item) => item.type === 'image'));
    } catch (err) {
      console.error('Failed to load media items', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const toggleLibraryItem = (url: string) => {
    if (images.includes(url)) {
      onChange(images.filter((u) => u !== url));
    } else {
      onChange([...images, url]);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#33302C] pb-2">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#DFC27D] font-medium">
            Product Photography Gallery ({images.length} {images.length === 1 ? 'Photo' : 'Photos'})
          </label>
          <p className="text-[10px] text-[#8A7E72]">
            The first photo is the main cover image. Drag or use arrows to rearrange.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Device</span>
          </button>

          <button
            type="button"
            onClick={openLibraryModal}
            className="px-3 py-1.5 bg-[#242220] hover:bg-[#33302C] text-[#8A7E72] hover:text-white border border-[#33302C] text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#DFC27D]" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* Uploading Banner */}
      {uploading && (
        <div className="p-3 bg-[#1C1B1A] border border-[#DFC27D]/40 text-[#DFC27D] text-xs flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{uploadProgressText || 'Uploading photos from device...'}</span>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => {
            const isCover = idx === 0;
            return (
              <div
                key={idx}
                className={`group relative aspect-square bg-[#1C1B1A] border-2 overflow-hidden flex flex-col justify-between transition-all ${
                  isCover ? 'border-[#DFC27D]' : 'border-[#33302C] hover:border-[#DFC27D]/60'
                }`}
              >
                <img
                  src={img}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-[#DFC27D] text-[#1C1B1A] text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Cover Photo</span>
                  </div>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="px-2 py-1 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-[10px] uppercase tracking-wider font-semibold"
                        title="Set as Main Cover"
                      >
                        Make Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 ml-auto"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ordering arrows */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'left')}
                      className="p-1 bg-[#242220] hover:bg-[#33302C] text-white disabled:opacity-20"
                      title="Move earlier"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-[#8A7E72] font-mono">#{idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'right')}
                      className="p-1 bg-[#242220] hover:bg-[#33302C] text-white disabled:opacity-20"
                      title="Move later"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add More Tile */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-[#33302C] hover:border-[#DFC27D] bg-[#1C1B1A] hover:bg-[#242220] transition-colors flex flex-col items-center justify-center gap-2 text-[#8A7E72] hover:text-[#DFC27D] cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <span className="text-[11px] uppercase tracking-wider font-medium">Add Device Photo</span>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? 'border-[#DFC27D] bg-[#DFC27D]/10'
              : 'border-[#33302C] hover:border-[#DFC27D]/60 bg-[#1C1B1A]'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#242220] border border-[#33302C] flex items-center justify-center text-[#DFC27D]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-white font-medium">
                No product photos added yet
              </p>
              <p className="text-[10px] text-[#8A7E72] mt-0.5">
                Upload one or multiple photos directly from your phone, tablet, or computer
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photos From Device</span>
              </button>
              <button
                type="button"
                onClick={openLibraryModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#242220] hover:bg-[#33302C] text-white border border-[#33302C] text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#DFC27D]" />
                <span>Choose Existing Assets</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual URL toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowManualUrls(!showManualUrls)}
          className="text-[11px] text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
        >
          {showManualUrls ? 'Hide manual URL editor' : 'Or view / edit image URLs manually'}
        </button>

        {showManualUrls && (
          <div className="mt-2 animate-in fade-in duration-150">
            <textarea
              rows={3}
              value={images.join('\n')}
              onChange={(e) =>
                onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
              }
              placeholder="/assets/images/... (one per line)"
              className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-xs text-white font-mono"
            />
            <p className="text-[10px] text-[#8A7E72] mt-1">One URL or data URL per line</p>
          </div>
        )}
      </div>

      {/* Media Library Multi-Picker Modal */}
      {libraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#242220] border border-[#33302C] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#33302C]">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#DFC27D]" />
                <h3 className="font-serif text-lg font-medium text-white">Select Product Photos from Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="p-1.5 text-[#8A7E72] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingLibrary ? (
                <div className="py-12 text-center text-xs text-[#8A7E72] flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#DFC27D] animate-spin" />
                  <span>Loading library photos...</span>
                </div>
              ) : libraryItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#8A7E72] space-y-2">
                  <p>No photos found in media library.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLibraryOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-[#DFC27D] text-[#1C1B1A] uppercase tracking-wider font-semibold text-[11px]"
                  >
                    Upload From Device
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryItems.map((item) => {
                    const isSelected = images.includes(item.url);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleLibraryItem(item.url)}
                        className={`group relative aspect-square bg-[#1C1B1A] border-2 overflow-hidden cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#DFC27D] ring-2 ring-[#DFC27D]/40'
                            : 'border-[#33302C] hover:border-[#DFC27D]/70'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#DFC27D] text-[#1C1B1A] p-1 rounded-full shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 px-2 py-1 text-[10px] text-white truncate">
                          {item.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#33302C] flex items-center justify-between bg-[#1C1B1A]">
              <span className="text-[11px] text-[#8A7E72]">
                {images.length} photos selected for this product
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLibraryOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload From Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryOpen(false)}
                  className="px-4 py-1.5 bg-[#242220] hover:bg-[#33302C] text-white text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
