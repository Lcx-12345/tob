import { describe, it, expect, beforeEach } from 'vitest'
import { useImageStore } from '@/store/imageStore'
import { Image } from '@/types'

const mockImage: Image = {
  id: '1',
  title: 'Test Image',
  url: 'https://example.com/image.jpg',
  description: 'Test description',
  tags: ['tag1', 'tag2'],
  createdAt: '2024-01-01',
  width: 1920,
  height: 1080,
  size: 1024
}

describe('imageStore', () => {
  beforeEach(() => {
    useImageStore.setState({
      images: [],
      currentImage: null,
      searchQuery: '',
      selectedTags: [],
      isLoading: false,
      error: null
    })
  })

  it('should have correct initial state', () => {
    const state = useImageStore.getState()
    expect(state.images).toEqual([])
    expect(state.currentImage).toBeNull()
    expect(state.searchQuery).toBe('')
    expect(state.selectedTags).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set images', () => {
    useImageStore.getState().setImages([mockImage])
    expect(useImageStore.getState().images).toEqual([mockImage])
  })

  it('should add image', () => {
    useImageStore.getState().addImage(mockImage)
    expect(useImageStore.getState().images).toHaveLength(1)
    expect(useImageStore.getState().images[0]).toEqual(mockImage)
  })

  it('should update image', () => {
    useImageStore.getState().setImages([mockImage])
    useImageStore.getState().updateImage('1', { title: 'Updated Title' })
    expect(useImageStore.getState().images[0].title).toBe('Updated Title')
  })

  it('should not update image with non-existent id', () => {
    useImageStore.getState().setImages([mockImage])
    useImageStore.getState().updateImage('999', { title: 'Updated Title' })
    expect(useImageStore.getState().images[0].title).toBe('Test Image')
  })

  it('should delete image', () => {
    useImageStore.getState().setImages([mockImage])
    useImageStore.getState().deleteImage('1')
    expect(useImageStore.getState().images).toHaveLength(0)
  })

  it('should set current image', () => {
    useImageStore.getState().setCurrentImage(mockImage)
    expect(useImageStore.getState().currentImage).toEqual(mockImage)
  })

  it('should set search query', () => {
    useImageStore.getState().setSearchQuery('test query')
    expect(useImageStore.getState().searchQuery).toBe('test query')
  })

  it('should set selected tags', () => {
    useImageStore.getState().setSelectedTags(['tag1', 'tag2'])
    expect(useImageStore.getState().selectedTags).toEqual(['tag1', 'tag2'])
  })

  it('should set loading state', () => {
    useImageStore.getState().setLoading(true)
    expect(useImageStore.getState().isLoading).toBe(true)
  })

  it('should set error', () => {
    useImageStore.getState().setError('Something went wrong')
    expect(useImageStore.getState().error).toBe('Something went wrong')
  })

  it('should clear error', () => {
    useImageStore.getState().setError('Something went wrong')
    useImageStore.getState().clearError()
    expect(useImageStore.getState().error).toBeNull()
  })
})
