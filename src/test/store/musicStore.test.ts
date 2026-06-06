import { describe, it, expect, beforeEach } from 'vitest'
import { useMusicStore } from '@/store/musicStore'
import { Track } from '@/types'

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  artwork: 'https://example.com/artwork.jpg',
  url: 'https://example.com/song.mp3',
  duration: 180
}

describe('musicStore', () => {
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

  it('should have correct initial state', () => {
    const state = useMusicStore.getState()
    expect(state.currentTrack).toBeNull()
    expect(state.isPlaying).toBe(false)
    expect(state.volume).toBe(1)
    expect(state.tracks).toEqual([])
    expect(state.artists).toEqual([])
    expect(state.albums).toEqual([])
    expect(state.playlists).toEqual([])
    expect(state.searchQuery).toBe('')
    expect(state.selectedGenre).toBe('')
  })

  it('should play track and set isPlaying to true', () => {
    useMusicStore.getState().playTrack(mockTrack)
    const state = useMusicStore.getState()
    expect(state.currentTrack).toEqual(mockTrack)
    expect(state.isPlaying).toBe(true)
  })

  it('should pause track', () => {
    useMusicStore.getState().playTrack(mockTrack)
    useMusicStore.getState().pauseTrack()
    expect(useMusicStore.getState().isPlaying).toBe(false)
  })

  it('should set volume', () => {
    useMusicStore.getState().setVolume(0.5)
    expect(useMusicStore.getState().volume).toBe(0.5)
  })

  it('should set search query', () => {
    useMusicStore.getState().setSearchQuery('test query')
    expect(useMusicStore.getState().searchQuery).toBe('test query')
  })

  it('should set selected genre', () => {
    useMusicStore.getState().setSelectedGenre('Rock')
    expect(useMusicStore.getState().selectedGenre).toBe('Rock')
  })
})
