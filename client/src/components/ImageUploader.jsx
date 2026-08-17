import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({
  currentImage,
  onFileSelect,
  onUrlChange,
  urlValue,
}) => {
  const [activeTab, setActiveTab] = useState('url'); // 'file' or 'url'
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const previewSrc =
    activeTab === 'file'
      ? filePreview || (currentImage?.startsWith('/uploads') ? currentImage : null)
      : urlValue || currentImage;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Image Source
      </label>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'url'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'file'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Desktop Upload
        </button>
      </div>

      {/* Inputs */}
      {activeTab === 'url' ? (
        <div>
          <input
            type="url"
            placeholder="https://example.com/item.jpg"
            value={urlValue || ''}
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Paste any direct image URL (Unsplash, imgur, etc.)
          </p>
        </div>
      ) : (
        <div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-xl p-4 cursor-pointer transition-colors bg-slate-50 hover:bg-orange-50/20">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-600">
              Click to select image from computer
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              JPG, JPEG, PNG, WEBP up to 5MB
            </span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Preview */}
      {previewSrc && (
        <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          <img
            src={previewSrc}
            alt="Preview"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
            }}
            className="w-14 h-14 object-cover rounded-lg border border-slate-200 shadow-sm"
          />
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Image Preview</p>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {activeTab === 'file' ? 'Local file selected' : previewSrc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
