import { render, screen } from '@testing-library/react';
import SnakeGame from '@/components/SnakeGame';
import { useGameStore } from '@/store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
    status: 'IDLE',
    score: 0,
    highScore: 0,
    level: 1,
    speed: 150,
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    food: { x: 15, y: 10 },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    particles: [],
  });
});

describe('SnakeGame', () => {
  it('IDLE 状态应显示开始覆盖层', () => {
    render(<SnakeGame />);
    expect(screen.getByText('贪吃蛇')).toBeInTheDocument();
  });

  it('IDLE 状态不应显示暂停提示', () => {
    render(<SnakeGame />);
    expect(screen.queryByText('已暂停')).not.toBeInTheDocument();
  });

  it('PAUSED 状态应显示暂停提示', () => {
    useGameStore.setState({ status: 'PAUSED' });
    render(<SnakeGame />);
    expect(screen.getByText('已暂停')).toBeInTheDocument();
  });

  it('PLAYING 状态不应显示覆盖层', () => {
    useGameStore.setState({ status: 'PLAYING' });
    render(<SnakeGame />);
    expect(screen.queryByText('贪吃蛇')).not.toBeInTheDocument();
    expect(screen.queryByText('已暂停')).not.toBeInTheDocument();
    expect(screen.queryByText('游戏结束')).not.toBeInTheDocument();
  });

  it('GAME_OVER 状态应显示游戏结束覆盖层', () => {
    useGameStore.setState({ status: 'GAME_OVER', score: 50, highScore: 50 });
    render(<SnakeGame />);
    expect(screen.getByText('游戏结束')).toBeInTheDocument();
  });

  it('应渲染 canvas 元素', () => {
    render(<SnakeGame />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('应渲染分数面板', () => {
    render(<SnakeGame />);
    expect(screen.getByText('分数')).toBeInTheDocument();
  });
});
