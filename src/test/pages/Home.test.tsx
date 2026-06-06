import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import { useMusicStore } from '@/store/musicStore'

describe('Home', () => {
  beforeEach(() => {
    useMusicStore.setState({
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      tracks: [],
      artists: [],
      albums: [],
      playlists: [],
      searchQuery: '',
      selectedGenre: ''
    })
  })

  it('should render hero section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Discover Your')).toBeInTheDocument()
    expect(screen.getByText('Perfect Sound')).toBeInTheDocument()
  })

  it('should render hero description', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText(/Listen to millions of songs/)).toBeInTheDocument()
  })

  it('should render start exploring button', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Start Exploring')).toBeInTheDocument()
  })

  it('should render play featured button', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Play Featured')).toBeInTheDocument()
  })

  it('should render trending section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Trending Now')).toBeInTheDocument()
  })

  it('should render explore genres section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Explore Genres')).toBeInTheDocument()
  })

  it('should render genre buttons', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Pop')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
    expect(screen.getByText('Jazz')).toBeInTheDocument()
  })

  it('should render recent albums section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Recent Albums')).toBeInTheDocument()
  })

  it('should play track when play button is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const playButton = screen.getAllByText('Play Now')[0]
    fireEvent.click(playButton)
    expect(useMusicStore.getState().isPlaying).toBe(true)
    expect(useMusicStore.getState().currentTrack).not.toBeNull()
  })

  it('should set genre when genre button is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const rockButton = screen.getByText('Rock')
    fireEvent.click(rockButton)
    expect(useMusicStore.getState().selectedGenre).toBe('Rock')
  })

  it('should clear search query when genre is selected', () => {
    useMusicStore.setState({ searchQuery: 'test' })
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const rockButton = screen.getByText('Rock')
    fireEvent.click(rockButton)
    expect(useMusicStore.getState().searchQuery).toBe('')
  })
})
