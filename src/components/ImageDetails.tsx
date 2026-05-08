import { useState } from 'react';
import { Image } from '../types';
import { useImageStore } from '../store/imageStore';
import { X, Tag, Calendar, HardDrive, Monitor } from 'lucide-react';

interface ImageDetailsProps {
  image: Image;
  onClose: () => void;
}

export function ImageDetails({ image, onClose }: ImageDetailsProps) {
  const { updateImage } = useImageStore();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description);
  const [tags, setTags] = useState(image.tags.join(', '));

  const handleSave = () => {
    const newTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    updateImage(image.id, {
      title,
      description,
      tags: newTags
    });
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* 头部 */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-xl font-bold">Image Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6">
            {/* 图片预览 */}
            <div className="mb-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* 图片信息 */}
            <div className="space-y-6">
              {/* 标题和描述 */}
              <div>
                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
                      placeholder="Add a description..."
                    />
                    <div>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                        placeholder="Add tags separated by commas..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setTitle(image.title);
                          setDescription(image.description);
                          setTags(image.tags.join(', '));
                        }}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{image.title}</h3>
                    <p className="text-neutral-400">{image.description || 'No description'}</p>
                    <div className="flex flex-wrap gap-2">
                      {image.tags.length > 0 ? (
                        image.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-sm">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-neutral-400 text-sm">No tags</span>
                      )}
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                    >
                      Edit Details
                    </button>
                  </div>
                )}
              </div>

              {/* 元数据 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">
                    Uploaded: {formatDate(image.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSize className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">
                    Size: {formatFileSize(image.size)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">
                    Dimensions: {image.width} × {image.height}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
