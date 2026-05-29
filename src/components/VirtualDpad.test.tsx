import { render, screen, fireEvent } from '@testing-library/react';
import VirtualDpad from '@/components/VirtualDpad';
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

describe('VirtualDpad', () => {
  it('应渲染4个方向按钮', () => {
    render(<VirtualDpad />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4);
  });

  it('点击上方向应设置方向为 UP', () => {
    render(<VirtualDpad />);
    const upButton = screen.getAllByRole('button')[0];
    fireEvent.pointerDown(upButton);
    expect(useGameStore.getState().nextDirection).toBe('UP');
  });

  it('点击下方向应设置方向为 DOWN', () => {
    useGameStore.setState({ direction: 'LEFT', nextDirection: 'LEFT' });
    render(<VirtualDpad />);
    const buttons = screen.getAllByRole('button');
    fireEvent.pointerDown(buttons[3]);
    expect(useGameStore.getState().nextDirection).toBe('DOWN');
  });

  it('IDLE 状态下点击方向不应改变方向', () => {
    useGameStore.setState({ status: 'IDLE' });
    render(<VirtualDpad />);
    const upButton = screen.getAllByRole('button')[0];
    fireEvent.pointerDown(upButton);
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });
});
