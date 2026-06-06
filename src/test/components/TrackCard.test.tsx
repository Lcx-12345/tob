import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrackCard } from '@/components/TrackCard'
import { useMusicStore } from '@/store/musicStore'
import { Track } from '@/types'

const mockTrack: Track = {
  id: '1',
  title: 'Summer Vibes',
  artist: 'John Doe',
  artwork: 'https://example.com/artwork.jpg',
  url: 'https://example.com/song.mp3',
  duration: 180
}

describe('TrackCard', () => {
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

  it('should render track title', () => {
    render(<TrackCard track={mockTrack} />)
    expect(screen.getByText('Summer Vibes')).toBeInTheDocument()
  })

  it('should render artist name', () => {
    render(<TrackCard track={mockTrack} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render artwork image', () => {
    render(<TrackCard track={mockTrack} />)
    const img = screen.getByAltText('Summer Vibes')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/artwork.jpg')
  })

  it('should play track on card click', () => {
    render(<TrackCard track={mockTrack} />)
    fireEvent.click(screen.getByText('Summer Vibes').closest('div')!.parentElement!)
    expect(useMusicStore.getState().currentTrack).toEqual(mockTrack)
    expect(useMusicStore.getState().isPlaying).toBe(true)
  })

  it('should play track on play button click', () => {
    render(<TrackCard track={mockTrack} />)
    const playButton = screen.getByRole('button')
    fireEvent.click(playButton)
    expect(useMusicStore.getState().currentTrack).toEqual(mockTrack)
    expect(useMusicStore.getState().isPlaying).toBe(true)
  })
})
