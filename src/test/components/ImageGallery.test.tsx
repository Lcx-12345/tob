import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageGallery } from '@/components/ImageGallery'
import { useImageStore } from '@/store/imageStore'
import { Image } from '@/types'

const mockImages: Image[] = [
  {
    id: '1',
    title: 'Mountain Photo',
    url: 'https://example.com/mountain.jpg',
    description: 'Beautiful mountain',
    tags: ['nature'],
    createdAt: '2024-01-01',
    width: 1920,
    height: 1080,
    size: 1024
  },
  {
    id: '2',
    title: 'City Night',
    url: 'https://example.com/city.jpg',
    description: 'City skyline',
    tags: ['city'],
    createdAt: '2024-02-01',
    width: 2560,
    height: 1440,
    size: 2048
  }
]

describe('ImageGallery', () => {
  beforeEach(() => {
    useImageStore.setState({
      images: mockImages,
      currentImage: null,
      searchQuery: '',
      selectedTags: [],
      isLoading: false,
      error: null
    })
  })

  it('should render gallery title', () => {
    render(<ImageGallery />)
    expect(screen.getByText('Image Gallery')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<ImageGallery />)
    expect(screen.getByPlaceholderText('Search images...')).toBeInTheDocument()
  })

  it('should render upload button', () => {
    render(<ImageGallery />)
    expect(screen.getByText('Upload Image')).toBeInTheDocument()
  })

  it('should render image cards', () => {
    render(<ImageGallery />)
    expect(screen.getByText('Mountain Photo')).toBeInTheDocument()
    expect(screen.getByText('City Night')).toBeInTheDocument()
  })

  it('should filter images by search', () => {
    render(<ImageGallery />)
    const searchInput = screen.getByPlaceholderText('Search images...')
    fireEvent.change(searchInput, { target: { value: 'mountain' } })
    expect(screen.getByText('Mountain Photo')).toBeInTheDocument()
    expect(screen.queryByText('City Night')).not.toBeInTheDocument()
  })

  it('should show empty state when no images', () => {
    useImageStore.setState({ images: [] })
    render(<ImageGallery />)
    expect(screen.getByText('No images yet')).toBeInTheDocument()
    expect(screen.getByText('Upload your first image')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    useImageStore.setState({ isLoading: true })
    render(<ImageGallery />)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should show error message', () => {
    useImageStore.setState({ error: 'Failed to load images' })
    render(<ImageGallery />)
    expect(screen.getByText('Failed to load images')).toBeInTheDocument()
  })

  it('should clear error when close button is clicked', () => {
    useImageStore.setState({ error: 'Failed to load images' })
    render(<ImageGallery />)
    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)
    expect(useImageStore.getState().error).toBeNull()
  })

  it('should render tag filters', () => {
    render(<ImageGallery />)
    const tagSection = screen.getByText('Filter by tags:').closest('div')!.parentElement!
    const tagButtons = tagSection.querySelectorAll('button')
    expect(tagButtons.length).toBe(2)
    expect(tagButtons[0]).toHaveTextContent('nature')
    expect(tagButtons[1]).toHaveTextContent('city')
  })

  it('should filter by tag', () => {
    render(<ImageGallery />)
    const tagSection = screen.getByText('Filter by tags:').closest('div')!.parentElement!
    const natureTag = tagSection.querySelector('button')!
    fireEvent.click(natureTag)
    expect(screen.getByText('Mountain Photo')).toBeInTheDocument()
    expect(screen.queryByText('City Night')).not.toBeInTheDocument()
  })

  it('should disable upload button when loading', () => {
    useImageStore.setState({ isLoading: true })
    render(<ImageGallery />)
    const uploadButton = screen.getByText('Upload Image')
    expect(uploadButton).toBeDisabled()
  })
})
