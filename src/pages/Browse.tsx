import { useState, useEffect } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { TrackCard } from '@/components/TrackCard';
import { Search, Music, Disc, Users, Filter } from 'lucide-react';

const Browse = () => {
  const { tracks, artists, albums, playlists, setSearchQuery, searchQuery, selectedGenre } = useMusicStore();
  const [activeTab, setActiveTab] = useState('tracks');
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  // Filter items based on search query and selected genre
  useEffect(() => {
    let items = [];
    
    switch (activeTab) {
      case 'tracks':
        items = tracks;
        break;
      case 'artists':
        items = artists;
        break;
      case 'albums':
        items = albums;
        break;
      case 'playlists':
        items = playlists;
        break;
      default:
        items = tracks;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.artist && item.artist.toLowerCase().includes(query))
      );
    }

    // Apply genre filter
    if (selectedGenre && activeTab === 'tracks') {
      items = items.filter(item => item.genre === selectedGenre);
    }

    setFilteredItems(items);
  }, [activeTab, tracks, artists, albums, playlists, searchQuery, selectedGenre]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Music className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Browse Music</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tracks, artists, albums..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-4 mb-8 pb-2">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'tracks' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Music className="w-4 h-4" />
            <span>Tracks</span>
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'artists' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Users className="w-4 h-4" />
            <span>Artists</span>
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'albums' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Disc className="w-4 h-4" />
            <span>Albums</span>
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeTab === 'playlists' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <Filter className="w-4 h-4" />
            <span>Playlists</span>
          </button>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedGenre && activeTab === 'tracks' && ` in ${selectedGenre}`}
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No {activeTab} found</p>
            </div>
          ) : activeTab === 'tracks' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((track, index) => (
                <TrackCard key={track.id} track={track} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.artwork || item.image}
                      alt={item.title || item.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{item.title || item.name}</h3>
                  {item.artist && <p className="text-sm text-gray-500 truncate">{item.artist}</p>}
                  {item.tracks && <p className="text-xs text-gray-400">{item.tracks.length} tracks</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;