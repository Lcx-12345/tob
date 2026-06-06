import { Track, Artist, Album, Playlist, Image } from '@/types';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'John Doe',
    artwork: 'https://picsum.photos/200',
    url: 'https://example.com/song1.mp3',
    duration: 180
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Luna Ray',
    artwork: 'https://picsum.photos/200',
    url: 'https://example.com/song2.mp3',
    duration: 224
  },
  {
    id: '3',
    title: 'Ocean Breeze',
    artist: 'The Waves',
    artwork: 'https://picsum.photos/200',
    url: 'https://example.com/song3.mp3',
    duration: 197
  },
  {
    id: '4',
    title: 'Neon Lights',
    artist: 'Synthia',
    artwork: 'https://picsum.photos/200',
    url: 'https://example.com/song4.mp3',
    duration: 256
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://picsum.photos/200',
    bio: 'An amazing artist with unique style'
  },
  {
    id: '2',
    name: 'Luna Ray',
    image: 'https://picsum.photos/200',
    bio: 'Dreamy soundscapes and ethereal vocals'
  },
  {
    id: '3',
    name: 'The Waves',
    image: 'https://picsum.photos/200',
    bio: 'Surf rock legends from the west coast'
  },
  {
    id: '4',
    name: 'Synthia',
    image: 'https://picsum.photos/200',
    bio: 'Pioneering electronic music producer and DJ'
  }
];

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Summer Collection',
    artist: 'John Doe',
    artwork: 'https://picsum.photos/200',
    releaseDate: '2024-01-01',
    tracks: mockTracks
  },
  {
    id: '2',
    title: 'After Hours',
    artist: 'Luna Ray',
    artwork: 'https://picsum.photos/200',
    releaseDate: '2024-03-15',
    tracks: mockTracks
  },
  {
    id: '3',
    title: 'Tidal',
    artist: 'The Waves',
    artwork: 'https://picsum.photos/200',
    releaseDate: '2023-11-20',
    tracks: mockTracks
  },
  {
    id: '4',
    title: 'Circuit Dreams',
    artist: 'Synthia',
    artwork: 'https://picsum.photos/200',
    releaseDate: '2024-06-01',
    tracks: mockTracks
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'My Favorites',
    tracks: mockTracks,
    createdAt: '2024-03-01'
  },
  {
    id: '2',
    name: 'Chill Evening',
    tracks: mockTracks,
    createdAt: '2024-04-12'
  },
  {
    id: '3',
    name: 'Workout Mix',
    tracks: mockTracks,
    createdAt: '2024-05-08'
  },
  {
    id: '4',
    name: 'Road Trip',
    tracks: mockTracks,
    createdAt: '2024-02-20'
  }
];

export const mockImages: Image[] = [
  {
    id: '1',
    title: 'Mountain Sunrise',
    url: 'https://picsum.photos/400?random=1',
    description: 'A breathtaking sunrise over snow-capped mountains',
    tags: ['nature', 'travel'],
    createdAt: '2024-01-15',
    width: 1920,
    height: 1080,
    size: 2450000
  },
  {
    id: '2',
    title: 'City Skyline',
    url: 'https://picsum.photos/400?random=2',
    description: 'A modern city skyline at dusk with glowing lights',
    tags: ['city', 'architecture'],
    createdAt: '2024-02-10',
    width: 2560,
    height: 1440,
    size: 3120000
  },
  {
    id: '3',
    title: 'Portrait in Light',
    url: 'https://picsum.photos/400?random=3',
    description: 'A dramatic portrait with natural window lighting',
    tags: ['portrait', 'abstract'],
    createdAt: '2024-03-05',
    width: 1080,
    height: 1350,
    size: 1870000
  },
  {
    id: '4',
    title: 'Abstract Flow',
    url: 'https://picsum.photos/400?random=4',
    description: 'Colorful abstract fluid art with swirling patterns',
    tags: ['abstract', 'nature'],
    createdAt: '2024-04-20',
    width: 1600,
    height: 1200,
    size: 2240000
  },
  {
    id: '5',
    title: 'Gothic Cathedral',
    url: 'https://picsum.photos/400?random=5',
    description: 'An ornate gothic cathedral interior with vaulted ceilings',
    tags: ['architecture', 'travel'],
    createdAt: '2024-05-12',
    width: 2000,
    height: 3000,
    size: 4560000
  },
  {
    id: '6',
    title: 'Urban Night',
    url: 'https://picsum.photos/400?random=6',
    description: 'Rain-soaked city streets reflecting neon signs',
    tags: ['city', 'portrait'],
    createdAt: '2024-06-01',
    width: 1800,
    height: 1200,
    size: 2780000
  }
];

export const genres = ['Pop', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Electronic'];
