import { useGameStore } from '@/store/gameStore';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function ControlPanel() {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="flex items-center justify-center gap-3">
      {status === 'PLAYING' ? (
        <button
          onClick={pauseGame}
          className="flex items-center gap-2 rounded-lg border border-[#39ff14]/40 bg-[#39ff14]/10 px-4 py-2 font-pixel text-xs text-[#39ff14] transition-all hover:border-[#39ff14] hover:bg-[#39ff14]/20 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
        >
          <Pause className="h-4 w-4" />
          暂停
        </button>
      ) : status === 'PAUSED' ? (
        <button
          onClick={resumeGame}
          className="flex items-center gap-2 rounded-lg border border-[#00e5ff]/40 bg-[#00e5ff]/10 px-4 py-2 font-pixel text-xs text-[#00e5ff] transition-all hover:border-[#00e5ff] hover:bg-[#00e5ff]/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          <Play className="h-4 w-4" />
          继续
        </button>
      ) : null}

      {status !== 'IDLE' && (
        <button
          onClick={resetGame}
          className="flex items-center gap-2 rounded-lg border border-[#ff2d75]/40 bg-[#ff2d75]/10 px-4 py-2 font-pixel text-xs text-[#ff2d75] transition-all hover:border-[#ff2d75] hover:bg-[#ff2d75]/20 hover:shadow-[0_0_15px_rgba(255,45,117,0.3)]"
        >
          <RotateCcw className="h-4 w-4" />
          重置
        </button>
      )}

      {status === 'IDLE' && (
        <button
          onClick={startGame}
          className="flex items-center gap-2 rounded-lg border border-[#39ff14]/40 bg-[#39ff14]/10 px-6 py-3 font-pixel text-sm text-[#39ff14] transition-all hover:border-[#39ff14] hover:bg-[#39ff14]/20 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
        >
          <Play className="h-5 w-5" />
          开始游戏
        </button>
      )}
    </div>
  );
}
