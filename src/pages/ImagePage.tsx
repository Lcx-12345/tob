import { useState } from 'react';
import { ImageGallery } from '../components/ImageGallery';
import { ImageDetails } from '../components/ImageDetails';
import { Image } from '../types';
import { useImage } from '../hooks/useImage';

export function ImagePage() {
  const { currentImage } = useImage();
  const [showDetails, setShowDetails] = useState(false);

  const handleImageSelect = (image: Image) => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <ImageGallery />
      {showDetails && currentImage && (
        <ImageDetails 
          image={currentImage} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
}
