import { render, screen } from '@testing-library/react';
import ScorePanel from '@/components/ScorePanel';
import { useGameStore } from '@/store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
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
    status: 'IDLE',
    particles: [],
  });
});

describe('ScorePanel', () => {
  it('应显示分数标签', () => {
    render(<ScorePanel />);
    expect(screen.getByText('分数')).toBeInTheDocument();
  });

  it('应显示最高分标签', () => {
    render(<ScorePanel />);
    expect(screen.getByText('最高分')).toBeInTheDocument();
  });

  it('应显示等级标签', () => {
    render(<ScorePanel />);
    expect(screen.getByText('等级')).toBeInTheDocument();
  });

  it('应显示速度标签', () => {
    render(<ScorePanel />);
    expect(screen.getByText('速度')).toBeInTheDocument();
  });

  it('分数应为 4 位补零格式', () => {
    useGameStore.setState({ score: 25 });
    render(<ScorePanel />);
    expect(screen.getByText('0025')).toBeInTheDocument();
  });

  it('最高分应为 4 位补零格式', () => {
    useGameStore.setState({ highScore: 100 });
    render(<ScorePanel />);
    expect(screen.getByText('0100')).toBeInTheDocument();
  });

  it('应显示等级数值', () => {
    useGameStore.setState({ level: 3 });
    render(<ScorePanel />);
    expect(screen.getByText('LV.3')).toBeInTheDocument();
  });

  it('应显示速度百分比', () => {
    useGameStore.setState({ speed: 150 });
    render(<ScorePanel />);
    const speedText = screen.getByText(/\d+%/);
    expect(speedText).toBeInTheDocument();
  });
});
