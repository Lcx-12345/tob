import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImagePage } from '@/pages/ImagePage'
import { useImageStore } from '@/store/imageStore'
import { Image } from '@/types'

const mockImage: Image = {
  id: '1',
  title: 'Test Image',
  url: 'https://example.com/image.jpg',
  description: 'Test description',
  tags: ['tag1'],
  createdAt: '2024-01-01',
  width: 1920,
  height: 1080,
  size: 1024
}

describe('ImagePage', () => {
  beforeEach(() => {
    useImageStore.setState({
      images: [mockImage],
      currentImage: null,
      searchQuery: '',
      selectedTags: [],
      isLoading: false,
      error: null
    })
  })

  it('should render ImageGallery', () => {
    render(<ImagePage />)
    expect(screen.getByText('Image Gallery')).toBeInTheDocument()
  })

  it('should not render ImageDetails when no image is selected', () => {
    render(<ImagePage />)
    expect(screen.queryByText('Image Details')).not.toBeInTheDocument()
  })

  it('should render ImageDetails when image is selected', () => {
    useImageStore.setState({ currentImage: mockImage })
    render(<ImagePage />)
    expect(screen.getByText('Image Details')).toBeInTheDocument()
  })

  it('should close ImageDetails when onClose is called', () => {
    useImageStore.setState({ currentImage: mockImage })
    render(<ImagePage />)
    const closeButton = screen.getByText('Image Details').closest('div')!.querySelector('button')!
    fireEvent.click(closeButton)
    expect(useImageStore.getState().currentImage).toBeNull()
  })
})
