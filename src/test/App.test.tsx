import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/App'

describe('App', () => {
  it('should render Navbar', () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('SoundGallery')).toBeInTheDocument()
  })

  it('should render Home page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Discover Your')).toBeInTheDocument()
  })

  it('should render Image page when navigated to /image', () => {
    render(
      <MemoryRouter initialEntries={['/image']}>
        <AppRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Image Gallery')).toBeInTheDocument()
  })
})
