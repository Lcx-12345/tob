import { useState, useEffect } from 'react';
import { ImageGallery } from '../components/ImageGallery';
import { ImageDetails } from './ImageDetails';
import { Image } from '../types';
import { useImage } from '../hooks/useImage';
import { Moon, Sun, Palette } from 'lucide-react';

export function ImagePage() {
  const { currentImage, selectImage } = useImage();
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleImageSelect = (image: Image) => {
    selectImage(image);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Visual Hub
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Palette className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Sun className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Image Gallery</h2>
            <p className="text-neutral-400">Discover and manage your visual collection</p>
          </div>
          
          <ImageGallery onImageSelect={handleImageSelect} />
        </div>
      </main>

      {/* Image Details Modal */}
      {showDetails && currentImage && (
        <ImageDetails 
          image={currentImage} 
          onClose={handleCloseDetails} 
        />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-30">
        <button className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
