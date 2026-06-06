import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageCard } from '@/components/ImageCard'
import { Image } from '@/types'

const mockImage: Image = {
  id: '1',
  title: 'Mountain Sunrise',
  url: 'https://example.com/image.jpg',
  description: 'Beautiful sunrise',
  tags: ['nature', 'travel'],
  createdAt: '2024-01-01',
  width: 1920,
  height: 1080,
  size: 1024
}

describe('ImageCard', () => {
  const mockOnSelect = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render image title', () => {
    render(
      <ImageCard image={mockImage} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('Mountain Sunrise')).toBeInTheDocument()
  })

  it('should render image', () => {
    render(
      <ImageCard image={mockImage} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    const img = screen.getByAltText('Mountain Sunrise')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should render tags', () => {
    render(
      <ImageCard image={mockImage} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('nature, travel')).toBeInTheDocument()
  })

  it('should show "No tags" when image has no tags', () => {
    const imageWithoutTags = { ...mockImage, tags: [] }
    render(
      <ImageCard image={imageWithoutTags} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    expect(screen.getByText('No tags')).toBeInTheDocument()
  })

  it('should call onSelect when card is clicked', () => {
    render(
      <ImageCard image={mockImage} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    fireEvent.click(screen.getByText('Mountain Sunrise').closest('div')!.parentElement!)
    expect(mockOnSelect).toHaveBeenCalledWith(mockImage)
  })

  it('should call onDelete when delete button is clicked', () => {
    render(
      <ImageCard image={mockImage} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('should not call onSelect when delete button is clicked', () => {
    render(
      <ImageCard image={mockImage} onSelect={mockOnSelect} onDelete={mockOnDelete} />
    )
    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)
    expect(mockOnSelect).not.toHaveBeenCalled()
  })
})
