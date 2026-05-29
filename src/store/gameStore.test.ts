import { useGameStore } from '@/store/gameStore';
import { GRID_SIZE, INITIAL_SPEED, SCORE_PER_FOOD, LEVEL_UP_SCORE } from '@/types/game';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    food: { x: 15, y: 10 },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore: 0,
    level: 1,
    speed: INITIAL_SPEED,
    status: 'IDLE',
    particles: [],
  });
});

describe('gameStore - 初始状态', () => {
  it('应有正确的默认值', () => {
    const state = useGameStore.getState();
    expect(state.gridSize).toBe(GRID_SIZE);
    expect(state.cellSize).toBe(30);
    expect(state.canvasSize).toBe(600);
    expect(state.direction).toBe('RIGHT');
    expect(state.nextDirection).toBe('RIGHT');
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.speed).toBe(INITIAL_SPEED);
    expect(state.status).toBe('IDLE');
    expect(state.particles).toEqual([]);
  });

  it('蛇初始位置应为网格中间的3节', () => {
    const state = useGameStore.getState();
    const mid = Math.floor(GRID_SIZE / 2);
    expect(state.snake).toEqual([
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ]);
  });

  it('食物不应与蛇身重叠', () => {
    const state = useGameStore.getState();
    const snakePositions = new Set(state.snake.map((p) => `${p.x},${p.y}`));
    expect(snakePositions.has(`${state.food.x},${state.food.y}`)).toBe(false);
  });
});

describe('gameStore - startGame', () => {
  it('应将状态设为 PLAYING', () => {
    useGameStore.getState().startGame();
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('应重置分数和等级', () => {
    useGameStore.setState({ score: 100, level: 3 });
    useGameStore.getState().startGame();
    expect(useGameStore.getState().score).toBe(0);
    expect(useGameStore.getState().level).toBe(1);
  });

  it('应重置速度', () => {
    useGameStore.setState({ speed: 60 });
    useGameStore.getState().startGame();
    expect(useGameStore.getState().speed).toBe(INITIAL_SPEED);
  });

  it('应重置方向为 RIGHT', () => {
    useGameStore.setState({ direction: 'UP', nextDirection: 'LEFT' });
    useGameStore.getState().startGame();
    expect(useGameStore.getState().direction).toBe('RIGHT');
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });

  it('应清除粒子', () => {
    useGameStore.setState({ particles: [{ x: 1, y: 1, vx: 1, vy: 1, life: 1, color: '#fff' }] });
    useGameStore.getState().startGame();
    expect(useGameStore.getState().particles).toEqual([]);
  });
});

describe('gameStore - pauseGame / resumeGame', () => {
  it('PLAYING 时暂停应设为 PAUSED', () => {
    useGameStore.setState({ status: 'PLAYING' });
    useGameStore.getState().pauseGame();
    expect(useGameStore.getState().status).toBe('PAUSED');
  });

  it('IDLE 时暂停不应改变状态', () => {
    useGameStore.setState({ status: 'IDLE' });
    useGameStore.getState().pauseGame();
    expect(useGameStore.getState().status).toBe('IDLE');
  });

  it('PAUSED 时继续应设为 PLAYING', () => {
    useGameStore.setState({ status: 'PAUSED' });
    useGameStore.getState().resumeGame();
    expect(useGameStore.getState().status).toBe('PLAYING');
  });

  it('GAME_OVER 时继续不应改变状态', () => {
    useGameStore.setState({ status: 'GAME_OVER' });
    useGameStore.getState().resumeGame();
    expect(useGameStore.getState().status).toBe('GAME_OVER');
  });
});

describe('gameStore - resetGame', () => {
  it('应将状态设为 IDLE', () => {
    useGameStore.setState({ status: 'GAME_OVER' });
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().status).toBe('IDLE');
  });

  it('应重置分数和等级', () => {
    useGameStore.setState({ score: 200, level: 5 });
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().score).toBe(0);
    expect(useGameStore.getState().level).toBe(1);
  });
});

describe('gameStore - setDirection', () => {
  beforeEach(() => {
    useGameStore.setState({ status: 'PLAYING', direction: 'RIGHT', nextDirection: 'RIGHT' });
  });

  it('PLAYING 时应设置 nextDirection', () => {
    useGameStore.getState().setDirection('UP');
    expect(useGameStore.getState().nextDirection).toBe('UP');
  });

  it('不应允许反方向移动', () => {
    useGameStore.getState().setDirection('LEFT');
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });

  it('IDLE 时不应改变方向', () => {
    useGameStore.setState({ status: 'IDLE' });
    useGameStore.getState().setDirection('UP');
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });

  it('GAME_OVER 时不应改变方向', () => {
    useGameStore.setState({ status: 'GAME_OVER' });
    useGameStore.getState().setDirection('UP');
    expect(useGameStore.getState().nextDirection).toBe('RIGHT');
  });

  it('应允许垂直于当前方向的所有方向', () => {
    useGameStore.getState().setDirection('UP');
    expect(useGameStore.getState().nextDirection).toBe('UP');

    useGameStore.setState({ nextDirection: 'RIGHT' });
    useGameStore.getState().setDirection('DOWN');
    expect(useGameStore.getState().nextDirection).toBe('DOWN');
  });
});

describe('gameStore - tick (蛇移动)', () => {
  beforeEach(() => {
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
      speed: INITIAL_SPEED,
      particles: [],
    });
  });

  it('蛇应向当前方向移动', () => {
    useGameStore.getState().tick();
    const snake = useGameStore.getState().snake;
    expect(snake[0]).toEqual({ x: 11, y: 10 });
  });

  it('蛇移动时长度不变（未吃到食物）', () => {
    const lenBefore = useGameStore.getState().snake.length;
    useGameStore.getState().tick();
    expect(useGameStore.getState().snake.length).toBe(lenBefore);
  });

  it('蛇向上移动', () => {
    useGameStore.setState({ direction: 'UP', nextDirection: 'UP' });
    useGameStore.getState().tick();
    expect(useGameStore.getState().snake[0]).toEqual({ x: 10, y: 9 });
  });

  it('蛇向下移动', () => {
    useGameStore.setState({ direction: 'DOWN', nextDirection: 'DOWN' });
    useGameStore.getState().tick();
    expect(useGameStore.getState().snake[0]).toEqual({ x: 10, y: 11 });
  });

  it('蛇向左移动', () => {
    useGameStore.setState({
      direction: 'LEFT',
      nextDirection: 'LEFT',
      snake: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
      ],
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().snake[0]).toEqual({ x: 9, y: 10 });
  });
});

describe('gameStore - tick (吃食物)', () => {
  beforeEach(() => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      food: { x: 11, y: 10 },
      score: 0,
      highScore: 0,
      level: 1,
      speed: INITIAL_SPEED,
      particles: [],
    });
  });

  it('吃到食物后蛇应变长', () => {
    const lenBefore = useGameStore.getState().snake.length;
    useGameStore.getState().tick();
    expect(useGameStore.getState().snake.length).toBe(lenBefore + 1);
  });

  it('吃到食物后分数应增加', () => {
    useGameStore.getState().tick();
    expect(useGameStore.getState().score).toBe(SCORE_PER_FOOD);
  });

  it('吃到食物后应生成新食物', () => {
    const oldFood = useGameStore.getState().food;
    useGameStore.getState().tick();
    const newFood = useGameStore.getState().food;
    expect(`${newFood.x},${newFood.y}`).not.toBe(`${oldFood.x},${oldFood.y}`);
  });

  it('吃到食物后新食物不应与蛇重叠', () => {
    useGameStore.getState().tick();
    const state = useGameStore.getState();
    const snakePositions = new Set(state.snake.map((p) => `${p.x},${p.y}`));
    expect(snakePositions.has(`${state.food.x},${state.food.y}`)).toBe(false);
  });

  it('吃到食物后应产生粒子效果', () => {
    useGameStore.getState().tick();
    expect(useGameStore.getState().particles.length).toBeGreaterThan(0);
  });
});

describe('gameStore - tick (等级和速度)', () => {
  beforeEach(() => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      food: { x: 11, y: 10 },
      score: 0,
      highScore: 0,
      level: 1,
      speed: INITIAL_SPEED,
      particles: [],
    });
  });

  it('分数达到阈值应升级', () => {
    useGameStore.setState({ score: LEVEL_UP_SCORE - SCORE_PER_FOOD });
    useGameStore.getState().tick();
    expect(useGameStore.getState().level).toBe(2);
  });

  it('升级后速度应增加', () => {
    useGameStore.setState({ score: LEVEL_UP_SCORE - SCORE_PER_FOOD });
    useGameStore.getState().tick();
    expect(useGameStore.getState().speed).toBeLessThan(INITIAL_SPEED);
  });

  it('速度不应低于最小值', () => {
    useGameStore.setState({ score: 9999, level: 99 });
    useGameStore.getState().tick();
    expect(useGameStore.getState().speed).toBeGreaterThanOrEqual(60);
  });
});

describe('gameStore - tick (碰撞检测)', () => {
  it('撞墙应导致 GAME_OVER', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: GRID_SIZE - 1, y: 10 },
        { x: GRID_SIZE - 2, y: 10 },
      ],
      food: { x: 5, y: 5 },
      score: 50,
      highScore: 30,
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().status).toBe('GAME_OVER');
  });

  it('撞左墙应导致 GAME_OVER', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'LEFT',
      nextDirection: 'LEFT',
      snake: [
        { x: 0, y: 10 },
        { x: 1, y: 10 },
      ],
      food: { x: 5, y: 5 },
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().status).toBe('GAME_OVER');
  });

  it('撞上墙应导致 GAME_OVER', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'UP',
      nextDirection: 'UP',
      snake: [
        { x: 10, y: 0 },
        { x: 10, y: 1 },
      ],
      food: { x: 5, y: 5 },
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().status).toBe('GAME_OVER');
  });

  it('撞下墙应导致 GAME_OVER', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'DOWN',
      nextDirection: 'DOWN',
      snake: [
        { x: 10, y: GRID_SIZE - 1 },
        { x: 10, y: GRID_SIZE - 2 },
      ],
      food: { x: 5, y: 5 },
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().status).toBe('GAME_OVER');
  });

  it('撞自身应导致 GAME_OVER', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'DOWN',
      nextDirection: 'DOWN',
      snake: [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
        { x: 11, y: 12 },
        { x: 11, y: 11 },
        { x: 11, y: 10 },
      ],
      food: { x: 5, y: 5 },
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().status).toBe('GAME_OVER');
  });

  it('GAME_OVER 时应更新最高分', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: GRID_SIZE - 1, y: 10 },
        { x: GRID_SIZE - 2, y: 10 },
      ],
      food: { x: 5, y: 5 },
      score: 100,
      highScore: 50,
    });
    useGameStore.getState().tick();
    expect(useGameStore.getState().highScore).toBe(100);
  });

  it('GAME_OVER 时应保存最高分到 localStorage', () => {
    useGameStore.setState({
      status: 'PLAYING',
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      snake: [
        { x: GRID_SIZE - 1, y: 10 },
        { x: GRID_SIZE - 2, y: 10 },
      ],
      food: { x: 5, y: 5 },
      score: 80,
      highScore: 50,
    });
    useGameStore.getState().tick();
    expect(localStorage.getItem('snake-high-score')).toBe('80');
  });
});

describe('gameStore - particles', () => {
  it('addParticles 应添加粒子', () => {
    useGameStore.getState().addParticles(100, 100, '#fff');
    expect(useGameStore.getState().particles.length).toBe(8);
  });

  it('updateParticles 应减少粒子生命值', () => {
    useGameStore.setState({
      particles: [{ x: 10, y: 10, vx: 1, vy: 1, life: 1, color: '#fff' }],
    });
    useGameStore.getState().updateParticles();
    expect(useGameStore.getState().particles[0].life).toBeLessThan(1);
  });

  it('生命值为0的粒子应被移除', () => {
    useGameStore.setState({
      particles: [{ x: 10, y: 10, vx: 1, vy: 1, life: 0.03, color: '#fff' }],
    });
    useGameStore.getState().updateParticles();
    expect(useGameStore.getState().particles.length).toBe(0);
  });

  it('updateParticles 应更新粒子位置', () => {
    useGameStore.setState({
      particles: [{ x: 10, y: 10, vx: 2, vy: 3, life: 1, color: '#fff' }],
    });
    useGameStore.getState().updateParticles();
    const p = useGameStore.getState().particles[0];
    expect(p.x).toBe(12);
    expect(p.y).toBe(13);
  });
});

describe('gameStore - localStorage 持久化', () => {
  it('应从 localStorage 加载最高分', () => {
    localStorage.setItem('snake-high-score', '250');
    const loaded = parseInt(localStorage.getItem('snake-high-score') || '0', 10);
    expect(loaded).toBe(250);
  });

  it('localStorage 无数据时最高分为 0', () => {
    localStorage.clear();
    const loaded = parseInt(localStorage.getItem('snake-high-score') || '0', 10);
    expect(loaded).toBe(0);
  });
});
