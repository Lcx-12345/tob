import { useGameStore } from '@/store/gameStore';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export default function GameOverlay() {
  const status = useGameStore((s) => s.status);
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);

  if (status === 'PLAYING' || status === 'PAUSED') return null;

  if (status === 'IDLE') {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0a]/85 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#39ff14] shadow-[0_0_10px_#39ff14]" />
          <div className="h-3 w-3 rounded-full bg-[#39ff14]/70 shadow-[0_0_8px_#39ff14]" />
          <div className="h-3 w-3 rounded-full bg-[#39ff14]/40 shadow-[0_0_6px_#39ff14]" />
        </div>
        <h1
          className="mb-6 font-pixel text-3xl text-[#39ff14] sm:text-4xl"
          style={{ textShadow: '0 0 20px rgba(57,255,20,0.6), 0 0 40px rgba(57,255,20,0.3)' }}
        >
          贪吃蛇
        </h1>
        <p className="mb-8 font-mono text-sm text-[#888]">
          使用方向键或 WASD 控制蛇的移动
        </p>
        <button
          onClick={() => {
            const boom: any = undefined;
            boom.triggerUncaughtError();
          }}
          className="group flex items-center gap-3 rounded-xl border-2 border-[#ff2d75]/50 bg-[#ff2d75]/10 px-8 py-4 font-pixel text-base text-[#ff2d75] transition-all hover:border-[#ff2d75] hover:bg-[#ff2d75]/20 hover:shadow-[0_0_30px_rgba(255,45,117,0.4)]"
        >
          <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
          触发错误
        </button>
        <button
          onClick={startGame}
          className="group flex items-center gap-3 rounded-xl border-2 border-[#39ff14]/50 bg-[#39ff14]/10 px-8 py-4 font-pixel text-base text-[#39ff14] transition-all hover:border-[#39ff14] hover:bg-[#39ff14]/20 hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
        >
          <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
          开始游戏
        </button>
        {highScore > 0 && (
          <div className="mt-6 flex items-center gap-2 font-mono text-sm text-[#00e5ff]">
            <Trophy className="h-4 w-4" />
            最高分: {highScore}
          </div>
        )}
        <div className="mt-8 flex gap-6 font-mono text-xs text-[#555]">
          <span>↑ ↓ ← →</span>
          <span>|</span>
          <span>W A S D</span>
          <span>|</span>
          <span>空格暂停</span>
        </div>
      </div>
    );
  }

  if (status === 'GAME_OVER') {
    const isNewHighScore = score >= highScore && score > 0;
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="animate-shake flex flex-col items-center rounded-2xl border border-[#ff2d75]/30 bg-[#0a0a0a]/90 px-10 py-8 shadow-[0_0_40px_rgba(255,45,117,0.2)]">
          <h2
            className="mb-4 font-pixel text-2xl text-[#ff2d75]"
            style={{ textShadow: '0 0 15px rgba(255,45,117,0.5)' }}
          >
            游戏结束
          </h2>

          {isNewHighScore && (
            <div className="mb-3 flex items-center gap-2 font-pixel text-sm text-[#ffd700] animate-pulse">
              <Trophy className="h-5 w-5" />
              新纪录!
            </div>
          )}

          <div className="mb-2 font-mono text-sm text-[#888]">最终分数</div>
          <div
            className="mb-6 font-pixel text-4xl text-[#ffd700]"
            style={{ textShadow: '0 0 15px rgba(255,215,0,0.4)' }}
          >
            {score}
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="group flex items-center gap-2 rounded-lg border border-[#39ff14]/40 bg-[#39ff14]/10 px-5 py-3 font-pixel text-xs text-[#39ff14] transition-all hover:border-[#39ff14] hover:bg-[#39ff14]/20 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            >
              <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
              再来一局
            </button>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 rounded-lg border border-[#555]/40 bg-[#555]/10 px-5 py-3 font-pixel text-xs text-[#888] transition-all hover:border-[#555] hover:bg-[#555]/20"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
