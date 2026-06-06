import { create } from 'zustand';
import { Image } from '@/types';

interface ImageStore {
  images: Image[];
  currentImage: Image | null;
  searchQuery: string;
  selectedTags: string[];
  isLoading: boolean;
  error: string | null;

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
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentImage: null,
  searchQuery: '',
  selectedTags: [],
  isLoading: false,
  error: null,

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
  clearError: () => set({ error: null })
}));
