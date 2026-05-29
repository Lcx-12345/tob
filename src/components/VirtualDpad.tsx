import { useGameStore } from '@/store/gameStore';
import { Direction } from '@/types/game';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VirtualDpad() {
  const setDirection = useGameStore((s) => s.setDirection);
  const status = useGameStore((s) => s.status);

  const handleDirection = (dir: Direction) => {
    if (status !== 'PLAYING') return;
    setDirection(dir);
  };

  const btnClass =
    'flex items-center justify-center w-14 h-14 rounded-xl border border-[#39ff14]/30 bg-[#0a0a0a]/80 text-[#39ff14] transition-all active:bg-[#39ff14]/20 active:scale-95 active:shadow-[0_0_15px_rgba(57,255,20,0.4)] touch-none select-none';

  return (
    <div className="mt-4 flex flex-col items-center gap-1 md:hidden">
      <button
        className={btnClass}
        onPointerDown={() => handleDirection('UP')}
      >
        <ChevronUp className="h-7 w-7" />
      </button>
      <div className="flex gap-1">
        <button
          className={btnClass}
          onPointerDown={() => handleDirection('LEFT')}
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <div className="w-14 h-14" />
        <button
          className={btnClass}
          onPointerDown={() => handleDirection('RIGHT')}
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
      <button
        className={btnClass}
        onPointerDown={() => handleDirection('DOWN')}
      >
        <ChevronDown className="h-7 w-7" />
      </button>
    </div>
  );
}
