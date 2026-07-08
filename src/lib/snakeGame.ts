export const GRID_SIZE = 16;
export const INITIAL_SPEED = 180;
export const SPEED_STEP = 12;
export const MIN_SPEED = 72;

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Point {
  x: number;
  y: number;
}

export interface SnakeTickInput {
  snake: Point[];
  direction: Direction;
  food: Point;
}

export interface SnakeTickResult {
  snake: Point[];
  food: Point;
  ateFood: boolean;
  collided: boolean;
}

export const DIRECTION_VECTORS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export function createInitialSnake(): Point[] {
  const center = Math.floor(GRID_SIZE / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return (
    (current === "UP" && next === "DOWN") ||
    (current === "DOWN" && next === "UP") ||
    (current === "LEFT" && next === "RIGHT") ||
    (current === "RIGHT" && next === "LEFT")
  );
}

export function generateFood(snake: Point[], gridSize = GRID_SIZE): Point {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const available: Point[] = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return { ...snake[0] };
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function getNextHead(head: Point, direction: Direction): Point {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: head.x + vector.x,
    y: head.y + vector.y,
  };
}

export function isOutOfBounds(point: Point, gridSize = GRID_SIZE): boolean {
  return point.x < 0 || point.y < 0 || point.x >= gridSize || point.y >= gridSize;
}

export function tickSnakeGame({
  snake,
  direction,
  food,
}: SnakeTickInput): SnakeTickResult {
  const nextHead = getNextHead(snake[0], direction);
  const ateFood = nextHead.x === food.x && nextHead.y === food.y;
  const collisionTarget = ateFood ? snake : snake.slice(0, -1);
  const collided =
    isOutOfBounds(nextHead) ||
    collisionTarget.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (collided) {
    return {
      snake,
      food,
      ateFood: false,
      collided: true,
    };
  }

  const nextSnake = [nextHead, ...snake];
  if (!ateFood) {
    nextSnake.pop();
  }

  return {
    snake: nextSnake,
    food: ateFood ? generateFood(nextSnake) : food,
    ateFood,
    collided: false,
  };
}
