import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameOverlay from '@/components/GameOverlay';
import { useGameStore } from '@/store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
    status: 'IDLE',
    score: 0,
    highScore: 0,
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    food: { x: 15, y: 10 },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    level: 1,
    speed: 150,
    particles: [],
  });
});

describe('GameOverlay - IDLE 状态', () => {
  it('应显示游戏标题', () => {
    render(<GameOverlay />);
    expect(screen.getByText('贪吃蛇')).toBeInTheDocument();
  });

  it('应显示开始游戏按钮', () => {
    render(<GameOverlay />);
    expect(screen.getByRole('button', { name: /开始游戏/ })).toBeInTheDocument();
  });

  it('应显示操作提示', () => {
    render(<GameOverlay />);
    expect(screen.getByText(/方向键或 WASD/)).toBeInTheDocument();
  });

  it('有最高分时应显示最高分', () => {
    useGameStore.setState({ highScore: 300 });
    render(<GameOverlay />);
    expect(screen.getByText(/最高分: 300/)).toBeInTheDocument();
  });

  it('无最高分时不应显示最高分', () => {
    useGameStore.setState({ highScore: 0 });
    render(<GameOverlay />);
    expect(screen.queryByText(/最高分:/)).not.toBeInTheDocument();
  });

  it('点击开始游戏应调用 startGame', async () => {
    const user = userEvent.setup();
    render(<GameOverlay />);
    await user.click(screen.getByRole('button', { name: /开始游戏/ }));
    expect(useGameStore.getState().status).toBe('PLAYING');
  });
});

describe('GameOverlay - PLAYING / PAUSED 状态', () => {
  it('PLAYING 时不渲染任何内容', () => {
    useGameStore.setState({ status: 'PLAYING' });
    const { container } = render(<GameOverlay />);
    expect(container.innerHTML).toBe('');
  });

  it('PAUSED 时不渲染任何内容', () => {
    useGameStore.setState({ status: 'PAUSED' });
    const { container } = render(<GameOverlay />);
    expect(container.innerHTML).toBe('');
  });
});

describe('GameOverlay - GAME_OVER 状态', () => {
  beforeEach(() => {
    useGameStore.setState({
      status: 'GAME_OVER',
      score: 120,
      highScore: 120,
    });
  });

  it('应显示游戏结束标题', () => {
    render(<GameOverlay />);
    expect(screen.getByText('游戏结束')).toBeInTheDocument();
  });

  it('应显示最终分数', () => {
    render(<GameOverlay />);
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('应显示再来一局按钮', () => {
    render(<GameOverlay />);
    expect(screen.getByRole('button', { name: /再来一局/ })).toBeInTheDocument();
  });

  it('应显示返回按钮', () => {
    render(<GameOverlay />);
    expect(screen.getByRole('button', { name: /返回/ })).toBeInTheDocument();
  });

  it('破纪录时应显示新纪录提示', () => {
    useGameStore.setState({ score: 200, highScore: 200 });
    render(<GameOverlay />);
    expect(screen.getByText('新纪录!')).toBeInTheDocument();
  });

  it('未破纪录时不应显示新纪录提示', () => {
    useGameStore.setState({ score: 50, highScore: 200 });
    render(<GameOverlay />);
    expect(screen.queryByText('新纪录!')).not.toBeInTheDocument();
  });

  it('点击再来一局应调用 startGame', async () => {
    const user = userEvent.setup();
    render(<GameOverlay />);
    await user.click(screen.getByRole('button', { name: /再来一局/ }));
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('点击返回应调用 resetGame', async () => {
    const user = userEvent.setup();
    render(<GameOverlay />);
    await user.click(screen.getByRole('button', { name: /返回/ }));
    expect(useGameStore.getState().status).toBe('IDLE');
  });
});
