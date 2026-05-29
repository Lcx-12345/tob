import { renderHook } from '@testing-library/react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
    status: 'IDLE',
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    food: { x: 15, y: 10 },
    score: 0,
    highScore: 0,
    level: 1,
    speed: 150,
    particles: [],
  });
});

describe('useGameLoop', () => {
  it('IDLE 状态下不应调用 tick', () => {
    const tickSpy = vi.spyOn(useGameStore.getState(), 'tick');
    renderHook(() => useGameLoop());
    expect(tickSpy).not.toHaveBeenCalled();
    tickSpy.mockRestore();
  });

  it('PLAYING 状态下应启动游戏循环', () => {
    useGameStore.setState({ status: 'PLAYING' });
    renderHook(() => useGameLoop());
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('卸载时应取消 requestAnimationFrame', () => {
    useGameStore.setState({ status: 'PLAYING' });
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useGameLoop());
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });
});
