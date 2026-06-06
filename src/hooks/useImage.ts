import { useState, useCallback, useMemo } from 'react';
import { useImageStore } from '@/store/imageStore';
import { Image } from '@/types';

export function useImage() {
  const {
    images: rawImages,
    currentImage,
    searchQuery,
    selectedTags,
    isLoading,
    error,
    addImage,
    deleteImage,
    setCurrentImage,
    setSearchQuery,
    setSelectedTags,
    setLoading,
    setError,
    clearError
  } = useImageStore();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const filteredImages = useMemo(() => {
    let result = rawImages;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.description.toLowerCase().includes(query)
      );
    }
    if (selectedTags.length > 0) {
      result = result.filter((img) =>
        selectedTags.some((tag) => img.tags.includes(tag))
      );
    }
    return result;
  }, [rawImages, searchQuery, selectedTags]);

  const uploadImage = useCallback(async (file: File): Promise<Image | null> => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;

          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setUploadProgress(null);

              const newImage: Image = {
                id: Date.now().toString(),
                title: file.name,
                url,
                description: '',
                tags: [],
                createdAt: new Date().toISOString(),
                width: 0,
                height: 0,
                size: file.size
              };

              addImage(newImage);
              setLoading(false);
              resolve(newImage);
            }
          }, 200);
        };
        reader.readAsDataURL(file);
      });
    } catch {
      setError('Failed to upload image');
      setLoading(false);
      setUploadProgress(null);
      return null;
    }
  }, [addImage, setError, setLoading]);

  const searchImages = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const filterImages = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, [setSelectedTags]);

  const removeImage = useCallback((id: string) => {
    deleteImage(id);
  }, [deleteImage]);

  const selectImage = useCallback((image: Image) => {
    setCurrentImage(image);
  }, [setCurrentImage]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    images: filteredImages,
    currentImage,
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
    setCurrentImage,
    clearError: handleClearError
  };
}
