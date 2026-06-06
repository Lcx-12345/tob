import { Play } from "lucide-react";
import { Track } from "../types";
import { useMusicStore } from "../store/musicStore";

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  const playTrack = useMusicStore((state) => state.playTrack);

  return (
    <div 
      className="group relative flex flex-col gap-2 rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-all cursor-pointer"
      onClick={() => playTrack(track)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <img
          src={track.artwork}
          alt={track.title}
          className="h-full w-full object-cover"
        />
        <button
          className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-xl transition-all hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            playTrack(track);
          }}
        >
          <Play className="h-5 w-5 text-black" />
        </button>
      </div>
      <div className="flex flex-col">
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold">
          {track.title}
        </span>
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-400">
          {track.artist}
        </span>
      </div>
    </div>
  );
}