import { useState } from 'react';
import { ImageCard } from './ImageCard';
import { Image } from '../types';
import { useImage } from '../hooks/useImage';
import { Upload, Search, Filter } from 'lucide-react';

interface ImageGalleryProps {
  onImageSelect?: (image: Image) => void;
}

export function ImageGallery({ onImageSelect }: ImageGalleryProps) {
  const {
    images,
    searchQuery,
    selectedTags,
    isLoading,
    error,
    uploadProgress,
    uploadImage,
    searchImages,
    filterImages,
    removeImage,
    selectImage,
    clearError
  } = useImage();

  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    await uploadImage(files[0]);
    setIsUploading(false);
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef?.click();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchImages(e.target.value);
  };

  const handleTagFilter = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    filterImages(newTags);
  };

  // 提取所有唯一标签
  const allTags = Array.from(
    new Set(images.flatMap(image => image.tags))
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Image Gallery</h1>
        
        {/* 搜索和上传区域 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              ref={setFileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              disabled={isUploading || isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </button>
          </div>
        </div>

        {/* 上传进度 */}
        {uploadProgress !== null && (
          <div className="mb-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-neutral-400 mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-medium">Error:</span>
              <span>{error}</span>
              <button 
                onClick={clearError}
                className="ml-auto text-white hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-neutral-400" />
              <span className="text-sm font-medium">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag)
                    ? 'bg-green-500 text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                    } transition-colors`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 图片列表 */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white/5 rounded-lg">
          <Upload className="h-12 w-12 text-neutral-400 mb-2" />
          <p className="text-neutral-400 mb-4">No images yet</p>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-medium transition-colors"
          >
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              onSelect={(image) => {
                selectImage(image);
                onImageSelect?.(image);
              }}
              onDelete={removeImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
