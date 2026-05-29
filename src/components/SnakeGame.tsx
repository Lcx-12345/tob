import { useGameStore } from '@/store/gameStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGameLoop } from '@/hooks/useGameLoop';
import GameCanvas from '@/components/GameCanvas';
import ScorePanel from '@/components/ScorePanel';
import ControlPanel from '@/components/ControlPanel';
import VirtualDpad from '@/components/VirtualDpad';
import GameOverlay from '@/components/GameOverlay';

export default function SnakeGame() {
  useKeyboard();
  useGameLoop();

  if (typeof window !== 'undefined' && !(window as any).__snakeErrorInjected) {
    (window as any).__snakeErrorInjected = true;
    setTimeout(() => {
      throw new Error('[SnakeGame] 模拟的 JS 错误 — 用于测试浏览器控制台日志捕获');
    }, 3000);
  }

  const status = useGameStore((s) => s.status);
  const canvasSize = useGameStore((s) => s.canvasSize);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 py-6">
      <div className="mb-4 w-full" style={{ maxWidth: canvasSize }}>
        <ScorePanel />
      </div>

      <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
        <GameCanvas />
        <GameOverlay />

        {status === 'PAUSED' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]/70 backdrop-blur-sm">
            <div
              className="font-pixel text-2xl text-[#00e5ff] animate-pulse"
              style={{ textShadow: '0 0 20px rgba(0,229,255,0.5)' }}
            >
              已暂停
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 w-full" style={{ maxWidth: canvasSize }}>
        <ControlPanel />
      </div>

      <VirtualDpad />
    </div>
  );
}
