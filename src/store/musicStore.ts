import { create } from 'zustand';
import { Track, Artist, Album, Playlist } from '@/types';

interface MusicStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  searchQuery: string;
  selectedGenre: string;

  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
  searchQuery: '',
  selectedGenre: '',

  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  pauseTrack: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedGenre: (genre) => set({ selectedGenre: genre })
}));