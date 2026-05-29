import { create } from 'zustand';
import {
  Direction,
  GameStatus,
  Position,
  GRID_SIZE,
  CELL_SIZE,
  CANVAS_SIZE,
  OPPOSITE_DIRECTION,
  SCORE_PER_FOOD,
  LEVEL_UP_SCORE,
  INITIAL_SPEED,
  SPEED_DECREMENT,
  MIN_SPEED,
} from '@/types/game';

function generateFood(snake: Position[]): Position {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const available: Position[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }
  return available[Math.floor(Math.random() * available.length)];
}

function getInitialSnake(): Position[] {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
}

function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem('snake-high-score') || '0', 10);
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('snake-high-score', String(score));
  } catch {}
}

interface GameStore {
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
  canvasSize: number;
  speed: number;
  particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>;
  setDirection: (dir: Direction) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  tick: () => void;
  addParticles: (x: number, y: number, color: string) => void;
  updateParticles: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  snake: getInitialSnake(),
  food: generateFood(getInitialSnake()),
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  score: 0,
  highScore: loadHighScore(),
  level: 1,
  status: 'IDLE',
  gridSize: GRID_SIZE,
  cellSize: CELL_SIZE,
  canvasSize: CANVAS_SIZE,
  speed: INITIAL_SPEED,
  particles: [],

  setDirection: (dir: Direction) => {
    const { direction, status } = get();
    if (status !== 'PLAYING') return;
    if (dir === OPPOSITE_DIRECTION[direction]) return;
    set({ nextDirection: dir });
  },

  startGame: () => {
    const snake = getInitialSnake();
    set({
      snake,
      food: generateFood(snake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      level: 1,
      speed: INITIAL_SPEED,
      status: 'PLAYING',
      particles: [],
    });
  },

  pauseGame: () => {
    const { status } = get();
    if (status === 'PLAYING') set({ status: 'PAUSED' });
  },

  resumeGame: () => {
    const { status } = get();
    if (status === 'PAUSED') set({ status: 'PLAYING' });
  },

  resetGame: () => {
    const snake = getInitialSnake();
    set({
      snake,
      food: generateFood(snake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      level: 1,
      speed: INITIAL_SPEED,
      status: 'IDLE',
      particles: [],
    });
  },

  tick: () => {
    const { snake, food, nextDirection, score, highScore, level, speed, gridSize } = get();
    const direction = nextDirection;

    const head = snake[0];
    let newHead: Position;

    switch (direction) {
      case 'UP':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    if (
      newHead.x < 0 ||
      newHead.x >= gridSize ||
      newHead.y < 0 ||
      newHead.y >= gridSize
    ) {
      const newHighScore = Math.max(score, highScore);
      saveHighScore(newHighScore);
      set({ status: 'GAME_OVER', highScore: newHighScore, direction });
      return;
    }

    for (const segment of snake) {
      if (segment.x === newHead.x && segment.y === newHead.y) {
        const newHighScore = Math.max(score, highScore);
        saveHighScore(newHighScore);
        set({ status: 'GAME_OVER', highScore: newHighScore, direction });
        return;
      }
    }

    const ateFood = newHead.x === food.x && newHead.y === food.y;
    const newSnake = [newHead, ...snake];
    if (!ateFood) {
      newSnake.pop();
    }

    const newScore = ateFood ? score + SCORE_PER_FOOD : score;
    const newLevel = Math.floor(newScore / LEVEL_UP_SCORE) + 1;
    const newSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (newLevel - 1) * SPEED_DECREMENT);
    const newFood = ateFood ? generateFood(newSnake) : food;
    const newHighScore = Math.max(newScore, highScore);

    if (ateFood) {
      saveHighScore(newHighScore);
    }

    const updates: Partial<GameStore> = {
      snake: newSnake,
      food: newFood,
      direction,
      score: newScore,
      highScore: newHighScore,
      level: newLevel,
      speed: newSpeed,
    };

    if (ateFood) {
      const { cellSize } = get();
      const px = newHead.x * cellSize + cellSize / 2;
      const py = newHead.y * cellSize + cellSize / 2;
      const newParticles: GameStore['particles'] = [];
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const spd = 1 + Math.random() * 2;
        newParticles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1,
          color: Math.random() > 0.5 ? '#39ff14' : '#ff2d75',
        });
      }
      updates.particles = [...get().particles, ...newParticles];
    }

    set(updates);
  },

  addParticles: (x: number, y: number, color: string) => {
    const newParticles: GameStore['particles'] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const spd = 1 + Math.random() * 1.5;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        color,
      });
    }
    set((state) => ({ particles: [...state.particles, ...newParticles] }));
  },

  updateParticles: () => {
    set((state) => ({
      particles: state.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.04,
        }))
        .filter((p) => p.life > 0),
    }));
  },
}));
