import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageDetails } from '@/components/ImageDetails'
import { useImageStore } from '@/store/imageStore'
import { Image } from '@/types'

const mockImage: Image = {
  id: '1',
  title: 'Mountain Sunrise',
  url: 'https://example.com/image.jpg',
  description: 'Beautiful sunrise over mountains',
  tags: ['nature', 'travel'],
  createdAt: '2024-01-15T10:00:00.000Z',
  width: 1920,
  height: 1080,
  size: 2450000
}

describe('ImageDetails', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useImageStore.setState({
      images: [mockImage],
      currentImage: mockImage,
      searchQuery: '',
      selectedTags: [],
      isLoading: false,
      error: null
    })
  })

  it('should render image title', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    expect(screen.getByText('Mountain Sunrise')).toBeInTheDocument()
  })

  it('should render image description', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    expect(screen.getByText('Beautiful sunrise over mountains')).toBeInTheDocument()
  })

  it('should render tags', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    expect(screen.getByText('nature')).toBeInTheDocument()
    expect(screen.getByText('travel')).toBeInTheDocument()
  })

  it('should render image', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    const img = screen.getByAltText('Mountain Sunrise')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should call onClose when close button is clicked', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    const closeButton = screen.getByText('Image Details').closest('div')!.querySelector('button')!
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should show "No description" when description is empty', () => {
    const imageWithoutDescription = { ...mockImage, description: '' }
    render(<ImageDetails image={imageWithoutDescription} onClose={mockOnClose} />)
    expect(screen.getByText('No description')).toBeInTheDocument()
  })

  it('should show "No tags" when tags are empty', () => {
    const imageWithoutTags = { ...mockImage, tags: [] }
    render(<ImageDetails image={imageWithoutTags} onClose={mockOnClose} />)
    expect(screen.getByText('No tags')).toBeInTheDocument()
  })

  it('should enter edit mode when edit button is clicked', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    const editButton = screen.getByText('Edit Details')
    fireEvent.click(editButton)
    expect(screen.getByDisplayValue('Mountain Sunrise')).toBeInTheDocument()
  })

  it('should save edited details', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Edit Details'))

    const titleInput = screen.getByDisplayValue('Mountain Sunrise')
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    fireEvent.click(screen.getByText('Save'))
    expect(useImageStore.getState().images[0].title).toBe('Updated Title')
  })

  it('should cancel edit and reset form', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Edit Details'))

    const titleInput = screen.getByDisplayValue('Mountain Sunrise')
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.getByText('Mountain Sunrise')).toBeInTheDocument()
  })

  it('should parse comma-separated tags', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Edit Details'))

    const tagsInput = screen.getByDisplayValue('nature, travel')
    fireEvent.change(tagsInput, { target: { value: 'newtag1, newtag2, newtag3' } })

    fireEvent.click(screen.getByText('Save'))
    expect(useImageStore.getState().images[0].tags).toEqual(['newtag1', 'newtag2', 'newtag3'])
  })

  it('should render upload date', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    expect(screen.getByText(/Uploaded:/)).toBeInTheDocument()
  })

  it('should render file size', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    expect(screen.getByText(/Size:/)).toBeInTheDocument()
  })

  it('should render dimensions', () => {
    render(<ImageDetails image={mockImage} onClose={mockOnClose} />)
    expect(screen.getByText(/Dimensions:/)).toBeInTheDocument()
    expect(screen.getByText(/1920 × 1080/)).toBeInTheDocument()
  })
})
