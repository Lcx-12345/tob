import { ImageGallery } from '../components/ImageGallery';
import { ImageDetails } from '../components/ImageDetails';
import { useImage } from '../hooks/useImage';

export function ImagePage() {
  const { currentImage, setCurrentImage } = useImage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <ImageGallery />
      {currentImage && (
        <ImageDetails 
          image={currentImage} 
          onClose={() => setCurrentImage(null)} 
        />
      )}
    </div>
  );
}
