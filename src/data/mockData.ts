import { Track, Artist, Album, Playlist } from '@/types';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'John Doe',
    artwork: 'https://picsum.photos/200',
    url: 'https://example.com/song1.mp3',
    duration: 180,
    genre: 'Pop'
  },
  {
    id: '2',
    title: 'Rock Anthem',
    artist: 'The Rockers',
    artwork: 'https://picsum.photos/201',
    url: 'https://example.com/song2.mp3',
    duration: 210,
    genre: 'Rock'
  },
  {
    id: '3',
    title: 'Jazz Night',
    artist: 'Smooth Jazz Quartet',
    artwork: 'https://picsum.photos/202',
    url: 'https://example.com/song3.mp3',
    duration: 240,
    genre: 'Jazz'
  },
  {
    id: '4',
    title: 'Hip Hop Flow',
    artist: 'Rap Star',
    artwork: 'https://picsum.photos/203',
    url: 'https://example.com/song4.mp3',
    duration: 195,
    genre: 'Hip Hop'
  },
  {
    id: '5',
    title: 'Classical Symphony',
    artist: 'Orchestra Masters',
    artwork: 'https://picsum.photos/204',
    url: 'https://example.com/song5.mp3',
    duration: 360,
    genre: 'Classical'
  },
  {
    id: '6',
    title: 'Electronic Beats',
    artist: 'DJ Techno',
    artwork: 'https://picsum.photos/205',
    url: 'https://example.com/song6.mp3',
    duration: 270,
    genre: 'Electronic'
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://picsum.photos/200',
    bio: 'An amazing pop artist with unique style'
  },
  {
    id: '2',
    name: 'The Rockers',
    image: 'https://picsum.photos/201',
    bio: 'A legendary rock band with energetic performances'
  },
  {
    id: '3',
    name: 'Smooth Jazz Quartet',
    image: 'https://picsum.photos/202',
    bio: 'A group of talented jazz musicians creating relaxing melodies'
  },
  {
    id: '4',
    name: 'Rap Star',
    image: 'https://picsum.photos/203',
    bio: 'A popular hip hop artist known for clever lyrics'
  },
  {
    id: '5',
    name: 'Orchestra Masters',
    image: 'https://picsum.photos/204',
    bio: 'A world-class classical orchestra performing timeless pieces'
  },
  {
    id: '6',
    name: 'DJ Techno',
    image: 'https://picsum.photos/205',
    bio: 'A leading electronic music producer and DJ'
  }
];

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Summer Collection',
    artist: 'John Doe',
    artwork: 'https://picsum.photos/200',
    releaseDate: '2024-01-01',
    tracks: mockTracks.filter(track => track.genre === 'Pop')
  },
  {
    id: '2',
    title: 'Rock Classics',
    artist: 'The Rockers',
    artwork: 'https://picsum.photos/201',
    releaseDate: '2024-02-15',
    tracks: mockTracks.filter(track => track.genre === 'Rock')
  },
  {
    id: '3',
    title: 'Jazz Evening',
    artist: 'Smooth Jazz Quartet',
    artwork: 'https://picsum.photos/202',
    releaseDate: '2024-03-10',
    tracks: mockTracks.filter(track => track.genre === 'Jazz')
  },
  {
    id: '4',
    title: 'Hip Hop Hits',
    artist: 'Rap Star',
    artwork: 'https://picsum.photos/203',
    releaseDate: '2024-04-05',
    tracks: mockTracks.filter(track => track.genre === 'Hip Hop')
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
    name: 'Workout Mix',
    tracks: mockTracks.filter(track => track.genre === 'Pop' || track.genre === 'Electronic'),
    createdAt: '2024-03-15'
  },
  {
    id: '3',
    name: 'Chill Vibes',
    tracks: mockTracks.filter(track => track.genre === 'Jazz' || track.genre === 'Classical'),
    createdAt: '2024-04-01'
  },
  {
    id: '4',
    name: 'Party Hits',
    tracks: mockTracks.filter(track => track.genre === 'Pop' || track.genre === 'Hip Hop' || track.genre === 'Electronic'),
    createdAt: '2024-04-15'
  }
];

export const genres = ['Pop', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Electronic'];