export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  level: number;
  status: GameStatus;
  gridSize: number;
  cellSize: number;
}

export const GRID_SIZE = 20;
export const CANVAS_SIZE = 600;
export const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

export const INITIAL_SPEED = 150;
export const SPEED_DECREMENT = 10;
export const MIN_SPEED = 60;
export const SCORE_PER_FOOD = 10;
export const LEVEL_UP_SCORE = 50;

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};
