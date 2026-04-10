import { Eye, Trash2, Tag } from "lucide-react";
import { Image } from "../types";
import { useImageStore } from "../store/imageStore";

interface ImageCardProps {
  image: Image;
  index: number;
  onSelect: (image: Image) => void;
  onDelete: (id: string) => void;
}

export function ImageCard({ image, index, onSelect, onDelete }: ImageCardProps) {
  return (
    <div 
      className="group relative flex flex-col gap-2 rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-all cursor-pointer"
      onClick={() => onSelect(image)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <img
          src={image.url}
          alt={image.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black hover:bg-white transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(image);
            }}
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-red-500 hover:bg-white transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold">
          {image.title}
        </span>
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          <Tag className="h-3 w-3" />
          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {image.tags.length > 0 ? image.tags.join(', ') : 'No tags'}
          </span>
        </div>
      </div>
    </div>
  );
}
