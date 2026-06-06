import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

describe('Navbar', () => {
  it('should render brand name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('SoundGallery')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Images')).toBeInTheDocument()
  })

  it('should highlight active link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    )
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('text-green-500')
  })

  it('should not highlight inactive link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    )
    const imagesLink = screen.getByText('Images').closest('a')
    expect(imagesLink).toHaveClass('text-gray-300')
  })
})
