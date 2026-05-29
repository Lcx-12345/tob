import { useEffect } from 'react';
import { Direction } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

export function useKeyboard() {
  const setDirection = useGameStore((s) => s.setDirection);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (dir) {
        e.preventDefault();
        setDirection(dir);
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (status === 'PLAYING') pauseGame();
        else if (status === 'PAUSED') resumeGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, pauseGame, resumeGame, status]);
}
