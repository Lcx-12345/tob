import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function useGameLoop() {
  const status = useGameStore((s) => s.status);
  const speed = useGameStore((s) => s.speed);
  const tick = useGameStore((s) => s.tick);
  const updateParticles = useGameStore((s) => s.updateParticles);

  const lastTickRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (status !== 'PLAYING') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTickRef.current = performance.now();

    const loop = (now: number) => {
      const elapsed = now - lastTickRef.current;

      if (elapsed >= speed) {
        tick();
        lastTickRef.current = now - (elapsed % speed);
      }

      updateParticles();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, speed, tick, updateParticles]);
}
