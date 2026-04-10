import { useState, useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { Image } from '@/types';

export function useImage() {
  const {
    images,
    currentImage,
    searchQuery,
    selectedTags,
    isLoading,
    error,
    setImages,
    addImage,
    updateImage,
    deleteImage,
    setCurrentImage,
    setSearchQuery,
    setSelectedTags,
    setLoading,
    setError,
    clearError
  } = useImageStore();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // 上传图片
  const uploadImage = useCallback(async (file: File): Promise<Image | null> => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // 模拟上传过程
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          
          // 模拟上传进度
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
                width: 0, // 实际应用中应从图片获取
                height: 0, // 实际应用中应从图片获取
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
    } catch (err) {
      setError('上传图片失败');
      setLoading(false);
      setUploadProgress(null);
      return null;
    }
  }, [addImage, setError, setLoading]);

  // 搜索图片
  const searchImages = useCallback((query: string) => {
    setSearchQuery(query);
    // 实际应用中应调用API进行搜索
  }, [setSearchQuery]);

  // 筛选图片
  const filterImages = useCallback((tags: string[]) => {
    setSelectedTags(tags);
    // 实际应用中应根据标签筛选图片
  }, [setSelectedTags]);

  // 删除图片
  const removeImage = useCallback((id: string) => {
    deleteImage(id);
  }, [deleteImage]);

  // 选择图片
  const selectImage = useCallback((image: Image) => {
    setCurrentImage(image);
  }, [setCurrentImage]);

  // 清除错误
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    images,
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
    clearError: handleClearError
  };
}
