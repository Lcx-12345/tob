import { Play } from "lucide-react";
import { Track } from "../types";
import { useMusicStore } from "../store/musicStore";

interface TrackCardProps {
  track: Track;
  index: number;
}

export function TrackCard({ track }: TrackCardProps) {
  const playTrack = useMusicStore((state) => state.playTrack);

  return (
    <div 
      className="group relative flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4 hover:from-white/15 hover:to-white/10 transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/10 shadow-lg hover:shadow-xl"
      onClick={() => playTrack(track)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg">
        <img
          src={track.artwork}
          alt={track.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          className="absolute bottom-3 right-3 flex h-14 w-14 translate-y-4 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 opacity-0 shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            playTrack(track);
          }}
        >
          <Play className="h-7 w-7 text-black ml-0.5" />
        </button>
      </div>
      <div className="flex flex-col">
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">
          {track.title}
        </span>
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-400">
          {track.artist}
        </span>
      </div>
    </div>
  );
}