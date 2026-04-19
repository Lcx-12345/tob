import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Music, Disc, Sparkles, Headphones, ArrowRight } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { mockTracks, mockArtists, mockAlbums, mockPlaylists, genres } from '@/data/mockData';
import { TrackCard } from '@/components/TrackCard';

export default function Home() {
  const { tracks, playTrack, setSearchQuery, setSelectedGenre } = useMusicStore();
  const [mounted, setMounted] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    const store = useMusicStore.getState();
    if (store.tracks.length === 0) {
      useMusicStore.setState({
        tracks: mockTracks,
        artists: mockArtists,
        albums: mockAlbums,
        playlists: mockPlaylists
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const featuredTrack = mockTracks[0];
  const trendingTracks = mockTracks.slice(0, 4);
  const popularGenres = genres.slice(0, 6);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-2">
            <Headphones className="h-6 w-6" />
            Melodia
          </h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white font-medium hover:text-green-400 transition-colors">Home</Link>
            <Link to="/image" className="text-neutral-400 hover:text-white transition-colors">Images</Link>
            <Link to="/browse" className="text-neutral-400 hover:text-white transition-colors">Browse</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-green-900/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-green-400" />
                <span className="text-sm text-green-400 font-semibold uppercase tracking-wider">Premium Experience</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Discover Your
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  Perfect Sound
                </span>
              </h1>
              <p className="text-xl mb-8 text-neutral-300 leading-relaxed">
                畅听数百万首歌曲，创建播放列表，在我们沉浸式音乐平台中探索新艺术家。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/browse"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black px-8 py-4 rounded-full font-bold transition-all duration-300 text-center flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105"
                >
                  <span>Start Exploring</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => playTrack(featuredTrack)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
                >
                  <Play className="w-5 h-5" />
                  <span>Play Featured</span>
                </button>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 transform ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <img
                      src={featuredTrack.artwork}
                      alt={featuredTrack.title}
                      className="w-24 h-24 rounded-2xl shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl">{featuredTrack.title}</h3>
                    <p className="text-neutral-300">{featuredTrack.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Disc className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-neutral-400">
                        {Math.floor(featuredTrack.duration / 60)}:{(featuredTrack.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => playTrack(featuredTrack)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/30"
                >
                  <Play className="w-6 h-6" />
                  <span className="text-lg">Play Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tracks */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-green-400" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <Link
            to="/browse"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingTracks.map((track, index) => (
          <div key={track.id} className="group">
            <TrackCard track={track} index={index} />
          </div>
          ))}
        </div>
      </section>

      {/* Music Categories */}
      <section className="bg-white/5 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Music className="w-7 h-7 text-green-400" />
            <h2 className="text-3xl font-bold">Explore Genres</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularGenres.map((genre, index) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`group relative overflow-hidden rounded-2xl aspect-square transition-all duration-500 transform hover:scale-105 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600"></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]"></div>
              <div className="relative h-full flex items-center justify-center p-4">
                <span className="text-white font-bold text-xl text-center">
                  {genre}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Albums */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Disc className="w-7 h-7 text-green-400" />
            <h2 className="text-3xl font-bold">Recent Albums</h2>
          </div>
          <Link
            to="/browse"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockAlbums.map((album, index) => (
          <div key={album.id} className={`group cursor-pointer transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${100 + index * 50}ms }>
            <div className="relative overflow-hidden rounded-2xl mb-4">
              <img
                src={album.artwork}
                alt={album.title}
                className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center">
                <button
                  onClick={() => playTrack(album.tracks[0])}
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 mb-6 shadow-lg shadow-green-500/30"
                >
                  <Play className="w-7 h-7 text-black ml-0.5" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg truncate">{album.title}</h3>
            <p className="text-sm text-neutral-400 truncate">{album.artist}</p>
            <p className="text-xs text-neutral-500">{new Date(album.releaseDate).getFullYear()}</p>
          </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-2 mb-4">
                <Headphones className="h-6 w-6" />
                Melodia
              </h3>
              <p className="text-neutral-400">Discover and manage your music collection.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-neutral-400 hover:text-white transition-colors">Home</Link>
                <Link to="/image" className="block text-neutral-400 hover:text-white transition-colors">Images</Link>
                <Link to="/browse" className="block text-neutral-400 hover:text-white transition-colors">Browse</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <div className="space-y-2">
                <span className="block text-neutral-400">Playlists</span>
                <span className="block text-neutral-400">Discover</span>
                <span className="block text-neutral-400">Upload</span>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-neutral-500 text-sm">
            © 2024 Melodia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}