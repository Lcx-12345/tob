import { renderHook, act } from '@testing-library/react';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGameStore } from '@/store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
    status: 'PLAYING',
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

describe('useKeyboard', () => {
  it('按 ArrowUp 应设置方向为 UP', () => {
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('UP');
  });

  it('按 ArrowDown 应设置方向为 DOWN', () => {
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('DOWN');
  });

  it('按 ArrowLeft 应设置方向为 LEFT', () => {
    useGameStore.setState({ direction: 'DOWN', nextDirection: 'DOWN' });
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('LEFT');
  });

  it('按 ArrowRight 应设置方向为 RIGHT', () => {
    useGameStore.setState({ direction: 'UP', nextDirection: 'UP' });
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });

  it('WASD 键应设置对应方向', () => {
    renderHook(() => useKeyboard());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('UP');

    useGameStore.setState({ direction: 'UP', nextDirection: 'UP' });

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });

  it('大写 WASD 键也应生效', () => {
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'W' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('UP');
  });

  it('空格键在 PLAYING 时应暂停', () => {
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    expect(useGameStore.getState().status).toBe('PAUSED');
  });

  it('空格键在 PAUSED 时应继续', () => {
    useGameStore.setState({ status: 'PAUSED' });
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('Escape 键在 PLAYING 时应暂停', () => {
    renderHook(() => useKeyboard());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(useGameStore.getState().status).toBe('PAUSED');
  });

  it('卸载后应移除事件监听', () => {
    const { unmount } = renderHook(() => useKeyboard());
    unmount();
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });
});
