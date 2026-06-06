import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useImage } from '@/hooks/useImage'
import { useImageStore } from '@/store/imageStore'
import { Image } from '@/types'

const mockImage1: Image = {
  id: '1',
  title: 'Mountain Photo',
  url: 'https://example.com/mountain.jpg',
  description: 'Beautiful mountain view',
  tags: ['nature', 'travel'],
  createdAt: '2024-01-01',
  width: 1920,
  height: 1080,
  size: 1024
}

const mockImage2: Image = {
  id: '2',
  title: 'City Night',
  url: 'https://example.com/city.jpg',
  description: 'City skyline at night',
  tags: ['city', 'architecture'],
  createdAt: '2024-02-01',
  width: 2560,
  height: 1440,
  size: 2048
}

describe('useImage', () => {
  beforeEach(() => {
    useImageStore.setState({
      images: [mockImage1, mockImage2],
      currentImage: null,
      searchQuery: '',
      selectedTags: [],
      isLoading: false,
      error: null
    })
  })

  it('should return all images when no filters applied', () => {
    const { result } = renderHook(() => useImage())
    expect(result.current.images).toHaveLength(2)
  })

  it('should filter images by search query', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.searchImages('mountain')
    })
    expect(result.current.images).toHaveLength(1)
    expect(result.current.images[0].title).toBe('Mountain Photo')
  })

  it('should filter images by tags', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.filterImages(['city'])
    })
    expect(result.current.images).toHaveLength(1)
    expect(result.current.images[0].title).toBe('City Night')
  })

  it('should filter images by multiple tags', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.filterImages(['nature', 'city'])
    })
    expect(result.current.images).toHaveLength(2)
  })

  it('should combine search and tag filters', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.searchImages('photo')
      result.current.filterImages(['nature'])
    })
    expect(result.current.images).toHaveLength(1)
    expect(result.current.images[0].title).toBe('Mountain Photo')
  })

  it('should be case insensitive for search', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.searchImages('MOUNTAIN')
    })
    expect(result.current.images).toHaveLength(1)
  })

  it('should search in description', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.searchImages('skyline')
    })
    expect(result.current.images).toHaveLength(1)
    expect(result.current.images[0].title).toBe('City Night')
  })

  it('should select image', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.selectImage(mockImage1)
    })
    expect(result.current.currentImage).toEqual(mockImage1)
  })

  it('should remove image', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.removeImage('1')
    })
    expect(result.current.images).toHaveLength(1)
    expect(result.current.images[0].id).toBe('2')
  })

  it('should clear error', () => {
    useImageStore.getState().setError('Test error')
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.clearError()
    })
    expect(result.current.error).toBeNull()
  })

  it('should track upload progress', async () => {
    const { result } = renderHook(() => useImage())
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    act(() => {
      result.current.uploadImage(file)
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should handle empty search query', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.searchImages('')
    })
    expect(result.current.images).toHaveLength(2)
  })

  it('should handle empty tags filter', () => {
    const { result } = renderHook(() => useImage())
    act(() => {
      result.current.filterImages([])
    })
    expect(result.current.images).toHaveLength(2)
  })
})
