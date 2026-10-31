import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, FolderOpen, Check, Link as LinkIcon } from 'lucide-react';
import { uploadMedia, fetchMedia } from '../../services/api';
import { optimizeDeviceImage } from '../../utils/imageOptimizer';
import { MediaItem } from '../../types';

interface DeviceImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  showMediaLibrary?: boolean;
}

export const DeviceImagePicker: React.FC<DeviceImagePickerProps> = ({
  value,
  onChange,
  label = 'Image',
  folder = 'General',
  helperText,
  aspectRatio = 'auto',
  showMediaLibrary = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setUploading(true);
    try {
      const optimized = await optimizeDeviceImage(file);
      const uploaded = await uploadMedia(optimized.name, optimized.base64, folder, 'image');
      onChange(uploaded.url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      // Fallback: direct base64 if server upload endpoint had an issue
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } catch (e) {
        alert(err.message || 'Failed to upload image from device');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
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

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-16/9';
      case 'banner': return 'aspect-21/9';
      default: return 'aspect-16/10';
    }
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] font-medium">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] uppercase tracking-wider text-[#8A7E72] hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* If Image exists: Display live preview with quick actions */}
      {value ? (
        <div className="space-y-3">
          <div className={`relative ${getAspectClass()} w-full max-w-md bg-[#1C1B1A] border border-[#33302C] overflow-hidden group rounded-xs shadow-xs`}>
            <img
              src={value}
              alt="Selected Preview"
              className="w-full h-full object-cover object-center"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 text-white text-xs">
                <RefreshCw className="w-5 h-5 text-[#DFC27D] animate-spin" />
                <span>Uploading new image...</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Change Image</span>
              </button>
              {showMediaLibrary && (
                <button
                  type="button"
                  onClick={openLibraryModal}
                  className="px-3 py-1.5 bg-[#242220] hover:bg-[#33302C] text-white border border-[#444] text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3 h-3 text-[#DFC27D]" />
                  <span>Choose from Library</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 bg-[#242220] hover:bg-[#2F2D2A] text-white border border-[#33302C] text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#DFC27D]" />
              <span>Replace From Device</span>
            </button>

            {showMediaLibrary && (
              <button
                type="button"
                onClick={openLibraryModal}
                className="px-3 py-2 bg-[#242220] hover:bg-[#2F2D2A] text-[#8A7E72] hover:text-white border border-[#33302C] text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#DFC27D]" />
                <span>Select from Media Library</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowManualUrl(!showManualUrl)}
              className="text-[11px] text-[#8A7E72] hover:text-[#DFC27D] underline underline-offset-2 transition-colors cursor-pointer ml-auto"
            >
              {showManualUrl ? 'Hide URL' : 'View / Edit URL'}
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Direct Device Upload Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
            dragActive
              ? 'border-[#DFC27D] bg-[#DFC27D]/10'
              : 'border-[#33302C] hover:border-[#DFC27D]/60 bg-[#1C1B1A]'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-7 h-7 text-[#DFC27D] animate-spin" />
              <p className="text-xs text-[#EAE3D2] font-medium">Uploading image from device...</p>
              <p className="text-[10px] text-[#8A7E72]">Optimizing resolution and preparing asset</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#242220] border border-[#33302C] flex items-center justify-center text-[#DFC27D]">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white font-medium">
                  Drag and drop your image here, or browse your device
                </p>
                <p className="text-[10px] text-[#8A7E72]">
                  Supports JPG, PNG, WEBP, and camera photos up to 50MB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload From Device</span>
                </button>

                {showMediaLibrary && (
                  <button
                    type="button"
                    onClick={openLibraryModal}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#242220] hover:bg-[#33302C] text-white border border-[#33302C] text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#DFC27D]" />
                    <span>Choose Existing Asset</span>
                  </button>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[11px] text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
                >
                  {showManualUrl ? 'Hide manual URL field' : 'Or paste an image URL instead'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optional Manual URL input */}
      {showManualUrl && (
        <div className="pt-1 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 bg-[#1C1B1A] border border-[#33302C] px-3 py-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#8A7E72] shrink-0" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... or /assets/images/..."
              className="w-full bg-transparent text-xs text-white focus:outline-hidden font-mono"
            />
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-[#8A7E72] font-light">{helperText}</p>
      )}

      {/* Media Library Picker Modal */}
      {libraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#242220] border border-[#33302C] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#33302C]">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#DFC27D]" />
                <h3 className="font-serif text-lg font-medium text-white">Select From Media Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="p-1.5 text-[#8A7E72] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingLibrary ? (
                <div className="py-12 text-center text-xs text-[#8A7E72] flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#DFC27D] animate-spin" />
                  <span>Loading media library...</span>
                </div>
              ) : libraryItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#8A7E72] space-y-2">
                  <p>No media files found in your library.</p>
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
                    const isSelected = value === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onChange(item.url);
                          setLibraryOpen(false);
                        }}
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
                {libraryItems.length} assets available
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
                  <span>Upload New File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#8A7E72] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
