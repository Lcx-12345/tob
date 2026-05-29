import { useGameStore } from '@/store/gameStore';
import { Trophy, Zap, Star } from 'lucide-react';

export default function ScorePanel() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const level = useGameStore((s) => s.level);
  const speed = useGameStore((s) => s.speed);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-3">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-[#ffd700]" />
        <div className="flex flex-col">
          <span className="font-pixel text-[10px] leading-none text-[#888]">分数</span>
          <span className="font-pixel text-lg leading-none text-[#ffd700]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-[#00e5ff]" />
        <div className="flex flex-col">
          <span className="font-pixel text-[10px] leading-none text-[#888]">最高分</span>
          <span className="font-pixel text-lg leading-none text-[#00e5ff]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-[#39ff14]" />
        <div className="flex flex-col">
          <span className="font-pixel text-[10px] leading-none text-[#888]">等级</span>
          <span className="font-pixel text-lg leading-none text-[#39ff14]">
            LV.{level}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full border-2 border-[#ff2d75] animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-pixel text-[10px] leading-none text-[#888]">速度</span>
          <span className="font-pixel text-lg leading-none text-[#ff2d75]">
            {Math.round(((200 - speed) / 140) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
