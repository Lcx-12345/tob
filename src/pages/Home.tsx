import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Music } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { mockTracks, mockArtists, mockAlbums, mockPlaylists, genres } from '@/data/mockData';
import { TrackCard } from '@/components/TrackCard';

export default function Home() {
  const { playTrack, setSearchQuery, setSelectedGenre } = useMusicStore();

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

  const featuredTrack = mockTracks[0];
  const trendingTracks = mockTracks.slice(0, 4);
  const popularGenres = genres.slice(0, 6);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Discover Your
                <span className="block text-orange-300">Perfect Sound</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">Listen to millions of songs, create playlists, and discover new artists on our immersive music platform.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors text-center"
                >Start Exploring</Link>
                <button
                  onClick={() => playTrack(featuredTrack)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Play Featured</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={featuredTrack.artwork}
                    alt={featuredTrack.title}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{featuredTrack.title}</h3>
                    <p className="text-purple-200">{featuredTrack.artist}</p>
                  </div>
                </div>
                <button
                  onClick={() => playTrack(featuredTrack)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Play Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center space-x-3 mb-8">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            <span>View All Trending</span>
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-3 mb-8">
            <Music className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Explore Genres</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className="group relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-purple-400 to-orange-400 hover:from-purple-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
                <div className="relative h-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg text-center px-2">
                    {genre}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockAlbums.map((album) => (
            <div key={album.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={album.artwork}
                  alt={album.title}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => playTrack(album.tracks[0])}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{album.title}</h3>
              <p className="text-sm text-gray-500 truncate">{album.artist}</p>
              <p className="text-xs text-gray-400">{new Date(album.releaseDate).getFullYear()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}