import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ControlPanel from '@/components/ControlPanel';
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

describe('ControlPanel - IDLE 状态', () => {
  it('应显示开始游戏按钮', () => {
    render(<ControlPanel />);
    expect(screen.getByRole('button', { name: /开始游戏/ })).toBeInTheDocument();
  });

  it('不应显示暂停按钮', () => {
    render(<ControlPanel />);
    expect(screen.queryByRole('button', { name: /暂停/ })).not.toBeInTheDocument();
  });

  it('不应显示重置按钮', () => {
    render(<ControlPanel />);
    expect(screen.queryByRole('button', { name: /重置/ })).not.toBeInTheDocument();
  });

  it('点击开始游戏应切换到 PLAYING', async () => {
    const user = userEvent.setup();
    render(<ControlPanel />);
    await user.click(screen.getByRole('button', { name: /开始游戏/ }));
    expect(useGameStore.getState().status).toBe('PLAYING');
  });
});

describe('ControlPanel - PLAYING 状态', () => {
  beforeEach(() => {
    useGameStore.setState({ status: 'PLAYING' });
  });

  it('应显示暂停按钮', () => {
    render(<ControlPanel />);
    expect(screen.getByRole('button', { name: /暂停/ })).toBeInTheDocument();
  });

  it('应显示重置按钮', () => {
    render(<ControlPanel />);
    expect(screen.getByRole('button', { name: /重置/ })).toBeInTheDocument();
  });

  it('点击暂停应切换到 PAUSED', async () => {
    const user = userEvent.setup();
    render(<ControlPanel />);
    await user.click(screen.getByRole('button', { name: /暂停/ }));
    expect(useGameStore.getState().status).toBe('PAUSED');
  });

  it('点击重置应切换到 IDLE', async () => {
    const user = userEvent.setup();
    render(<ControlPanel />);
    await user.click(screen.getByRole('button', { name: /重置/ }));
    expect(useGameStore.getState().status).toBe('IDLE');
  });
});

describe('ControlPanel - PAUSED 状态', () => {
  beforeEach(() => {
    useGameStore.setState({ status: 'PAUSED' });
  });

  it('应显示继续按钮', () => {
    render(<ControlPanel />);
    expect(screen.getByRole('button', { name: /继续/ })).toBeInTheDocument();
  });

  it('点击继续应切换到 PLAYING', async () => {
    const user = userEvent.setup();
    render(<ControlPanel />);
    await user.click(screen.getByRole('button', { name: /继续/ }));
    expect(useGameStore.getState().status).toBe('PLAYING');
  });
});

describe('ControlPanel - GAME_OVER 状态', () => {
  beforeEach(() => {
    useGameStore.setState({ status: 'GAME_OVER' });
  });

  it('应显示重置按钮', () => {
    render(<ControlPanel />);
    expect(screen.getByRole('button', { name: /重置/ })).toBeInTheDocument();
  });

  it('不应显示暂停或继续按钮', () => {
    render(<ControlPanel />);
    expect(screen.queryByRole('button', { name: /暂停/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /继续/ })).not.toBeInTheDocument();
  });
});
