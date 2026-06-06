import { NavLink } from 'react-router-dom';
import { Music, Image, Disc3 } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Disc3 className="w-6 h-6 text-green-500" />
          <span>SoundGallery</span>
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 font-medium transition-colors ${
                isActive ? 'text-green-500' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            <Music className="w-4 h-4" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/image"
            className={({ isActive }) =>
              `flex items-center gap-1.5 font-medium transition-colors ${
                isActive ? 'text-green-500' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            <Image className="w-4 h-4" />
            <span>Images</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
