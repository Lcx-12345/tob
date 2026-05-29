import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Image } from '../types';
import { useImageStore } from '../store/imageStore';
import {
  X, Calendar, FileSize, Monitor,
  ZoomIn, ZoomOut, RotateCcw,
  Download, Share2, Trash2,
  GripVertical, Camera, Clock, Hash,
  FileImage, Palette, Aperture
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

interface ImageDetailsProps {
  image: Image;
  onClose: () => void;
}

function SortableTag({ id, tag }: { id: string; tag: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <span
      ref={setNodeRef}
      style={style}
      className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1 touch-none select-none"
    >
      <GripVertical className="h-3 w-3 cursor-grab text-neutral-400" {...attributes} {...listeners} />
      {tag}
    </span>
  );
}

export function ImageDetails({ image, onClose }: ImageDetailsProps) {
  const { updateImage, deleteImage } = useImageStore();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description);
  const [editTags, setEditTags] = useState(image.tags);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => {
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        return Math.min(5, Math.max(1, Math.round((prev + delta) * 10) / 10));
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleSave = () => {
    updateImage(image.id, { title, description, tags: editTags });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setTitle(image.title);
    setDescription(image.description);
    setEditTags(image.tags);
  };

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(5, Math.round((prev + 0.5) * 10) / 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(1, Math.round((prev - 0.5) * 10) / 10));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      offsetStartRef.current = { ...offset };
    }
  }, [zoom, offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setOffset({
        x: offsetStartRef.current.x + dx,
        y: offsetStartRef.current.y + dy,
      });
    }
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      toast.success('链接已复制');
    } catch {
      toast.error('复制失败');
    }
  }, [image]);

  const handleDelete = useCallback(() => {
    deleteImage(image.id);
    onClose();
  }, [deleteImage, image.id, onClose]);

  const handleTagDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEditTags(prev => {
        const oldIndex = prev.findIndex((_, i) => `tag-${i}` === active.id);
        const newIndex = prev.findIndex((_, i) => `tag-${i}` === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

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
      <div className="bg-white/5 backdrop-blur-sm rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold">Image Details</h2>
          <div className="flex items-center gap-1">
            <button onClick={handleDownload} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Download">
              <Download className="h-5 w-5" />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Share">
              <Share2 className="h-5 w-5" />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div
            ref={previewRef}
            className="md:w-3/5 w-full relative bg-black/40 flex items-center justify-center overflow-hidden h-[50vh] md:h-auto"
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              draggable={false}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
              <button onClick={handleZoomOut} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30" disabled={zoom <= 1}>
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={handleZoomIn} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30" disabled={zoom >= 5}>
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-white/20" />
              <button onClick={handleResetZoom} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30" disabled={zoom === 1} title="Reset zoom">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="md:w-2/5 w-full overflow-y-auto p-6 border-t md:border-t-0 md:border-l border-white/10">
            <div className="space-y-6">
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
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
                    placeholder="Add a description (Markdown supported)..."
                  />
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleTagDragEnd}
                  >
                    <SortableContext
                      items={editTags.map((_, i) => `tag-${i}`)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex flex-wrap gap-2">
                        {editTags.map((tag, index) => (
                          <SortableTag key={`tag-${index}`} id={`tag-${index}`} tag={tag} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  <input
                    type="text"
                    placeholder="Add new tag, press Enter..."
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          setEditTags(prev => [...prev, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{image.title}</h3>
                  {image.description ? (
                    <div className="text-neutral-300 text-sm [&_p]:mb-2 [&_strong]:font-semibold [&_a]:text-green-400 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-white/10 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_blockquote]:border-l-2 [&_blockquote]:border-green-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-neutral-400">
                      <ReactMarkdown>{image.description}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-neutral-400 italic">No description</p>
                  )}
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

              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span className="text-sm text-neutral-400">
                    Uploaded: {formatDate(image.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSize className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span className="text-sm text-neutral-400">
                    Size: {formatFileSize(image.size)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span className="text-sm text-neutral-400">
                    Dimensions: {image.width} × {image.height}
                  </span>
                </div>
                {image.format && (
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-400">
                      Format: {image.format}
                    </span>
                  </div>
                )}
                {image.colorSpace && (
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-400">
                      Color Space: {image.colorSpace}
                    </span>
                  </div>
                )}
                {image.exif?.camera && (
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-400">
                      Camera: {image.exif.camera}
                    </span>
                  </div>
                )}
                {image.exif?.aperture && (
                  <div className="flex items-center gap-2">
                    <Aperture className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-400">
                      Aperture: {image.exif.aperture}
                    </span>
                  </div>
                )}
                {image.exif?.shutterSpeed && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-400">
                      Shutter Speed: {image.exif.shutterSpeed}
                    </span>
                  </div>
                )}
                {image.exif?.iso != null && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-400">
                      ISO: {image.exif.iso}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
            <div className="bg-neutral-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-white/10">
              <h3 className="text-lg font-bold mb-2">Delete Image</h3>
              <p className="text-neutral-400 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
