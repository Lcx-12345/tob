import { create } from 'zustand';
import { Image } from '@/types';

interface ImageStore {
  // 状态
  images: Image[];
  currentImage: Image | null;
  searchQuery: string;
  selectedTags: string[];
  isLoading: boolean;
  error: string | null;

  // 动作
  setImages: (images: Image[]) => void;
  addImage: (image: Image) => void;
  updateImage: (id: string, updates: Partial<Image>) => void;
  deleteImage: (id: string) => void;
  setCurrentImage: (image: Image | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getState: () => ImageStore;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  // 初始状态
  images: [],
  currentImage: null,
  searchQuery: '',
  selectedTags: [],
  isLoading: false,
  error: null,

  // 动作实现
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  updateImage: (id, updates) => set((state) => ({
    images: state.images.map((image) =>
      image.id === id ? { ...image, ...updates } : image
    )
  })),
  deleteImage: (id) => set((state) => ({
    images: state.images.filter((image) => image.id !== id)
  })),
  setCurrentImage: (image) => set({ currentImage: image }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  getState: () => get()
}));
