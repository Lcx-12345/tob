import { useState, useEffect } from 'react';
import { Image } from '../types';
import { useImageStore } from '../store/imageStore';
import { X, Tag, Calendar, HardDrive, Monitor, Edit, Save, XCircle, Info } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-gradient-to-br from-gray-900 to-black backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 transform ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="relative">
          {/* 头部 */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-green-400" />
              <h2 className="text-2xl font-bold">Image Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 图片预览 */}
              <div className="relative group">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-800 flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-4">
                  <div className="text-center">
                    <p className="text-white font-medium">{image.title}</p>
                    <p className="text-neutral-300 text-sm">{image.width} × {image.height}</p>
                  </div>
                </div>
              </div>

              {/* 图片信息 */}
              <div className="space-y-6">
                {/* 标题和描述 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  {editing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white text-lg font-medium"
                        placeholder="Image title"
                      />
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
                        placeholder="Add a description..."
                      />
                      <div>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                          placeholder="Add tags separated by commas..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/20"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditing(false);
                            setTitle(image.title);
                            setDescription(image.description);
                            setTags(image.tags.join(', '));
                          }}
                          className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">{image.title}</h3>
                      <p className="text-neutral-400 leading-relaxed">{image.description || 'No description provided'}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {image.tags.length > 0 ? (
                          image.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-neutral-500 text-sm">No tags</span>
                        )}
                      </div>
                      <button
                        onClick={() => setEditing(true)}
                        className="mt-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 flex items-center gap-2 hover:shadow-md"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Details</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 元数据 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-4 w-4 text-green-400" />
                    Metadata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <Calendar className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-400">Uploaded</p>
                        <p className="text-white font-medium">{formatDate(image.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <HardDrive className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-400">File Size</p>
                        <p className="text-white font-medium">{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <Monitor className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-400">Dimensions</p>
                        <p className="text-white font-medium">{image.width} × {image.height}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <Tag className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-400">Tags</p>
                        <p className="text-white font-medium">{image.tags.length} {image.tags.length === 1 ? 'tag' : 'tags'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
