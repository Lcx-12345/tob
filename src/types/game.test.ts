import { GRID_SIZE, CANVAS_SIZE, CELL_SIZE, INITIAL_SPEED, SPEED_DECREMENT, MIN_SPEED, SCORE_PER_FOOD, LEVEL_UP_SCORE, OPPOSITE_DIRECTION } from '@/types/game';

describe('game types - 常量', () => {
  it('GRID_SIZE 应为 20', () => {
    expect(GRID_SIZE).toBe(20);
  });

  it('CANVAS_SIZE 应为 600', () => {
    expect(CANVAS_SIZE).toBe(600);
  });

  it('CELL_SIZE 应为 CANVAS_SIZE / GRID_SIZE', () => {
    expect(CELL_SIZE).toBe(CANVAS_SIZE / GRID_SIZE);
    expect(CELL_SIZE).toBe(30);
  });

  it('INITIAL_SPEED 应为 150', () => {
    expect(INITIAL_SPEED).toBe(150);
  });

  it('SPEED_DECREMENT 应为 10', () => {
    expect(SPEED_DECREMENT).toBe(10);
  });

  it('MIN_SPEED 应为 60', () => {
    expect(MIN_SPEED).toBe(60);
  });

  it('SCORE_PER_FOOD 应为 10', () => {
    expect(SCORE_PER_FOOD).toBe(10);
  });

  it('LEVEL_UP_SCORE 应为 50', () => {
    expect(LEVEL_UP_SCORE).toBe(50);
  });
});

describe('game types - OPPOSITE_DIRECTION', () => {
  it('UP 的反方向应为 DOWN', () => {
    expect(OPPOSITE_DIRECTION.UP).toBe('DOWN');
  });

  it('DOWN 的反方向应为 UP', () => {
    expect(OPPOSITE_DIRECTION.DOWN).toBe('UP');
  });

  it('LEFT 的反方向应为 RIGHT', () => {
    expect(OPPOSITE_DIRECTION.LEFT).toBe('RIGHT');
  });

  it('RIGHT 的反方向应为 LEFT', () => {
    expect(OPPOSITE_DIRECTION.RIGHT).toBe('LEFT');
  });

  it('反方向映射应是双向对称的', () => {
    const dirs: Array<keyof typeof OPPOSITE_DIRECTION> = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    for (const dir of dirs) {
      expect(OPPOSITE_DIRECTION[OPPOSITE_DIRECTION[dir]]).toBe(dir);
    }
  });
});
