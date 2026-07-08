import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import {
  createInitialSnake,
  Direction,
  generateFood,
  GRID_SIZE,
  INITIAL_SPEED,
  isOppositeDirection,
  MIN_SPEED,
  Point,
  SPEED_STEP,
  tickSnakeGame,
} from "@/lib/snakeGame";

const KEYBOARD_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "UP",
  KeyW: "UP",
  ArrowDown: "DOWN",
  KeyS: "DOWN",
  ArrowLeft: "LEFT",
  KeyA: "LEFT",
  ArrowRight: "RIGHT",
  KeyD: "RIGHT",
};

const CELL_CLASSES = {
  base: "rounded-[6px] border border-white/5 bg-slate-900/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  snake: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
  head: "bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]",
  food: "bg-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,0.85)]",
};

function formatSpeed(speed: number) {
  return `${Math.round(1000 / speed)} 格/秒`;
}

export default function SnakeGamePage() {
  const initialSnake = useMemo(() => createInitialSnake(), []);
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Point>(() => generateFood(initialSnake));
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const nextDirectionRef = useRef<Direction>("RIGHT");

  const restartGame = useCallback(() => {
    const resetSnake = createInitialSnake();
    setSnake(resetSnake);
    setFood(generateFood(resetSnake));
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    nextDirectionRef.current = "RIGHT";
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsRunning(true);
  }, []);

  const requestDirection = useCallback(
    (mapped: Direction) => {
      setIsRunning(true);
      setNextDirection((current) => {
        if (isOppositeDirection(direction, mapped) || isOppositeDirection(current, mapped)) {
          return current;
        }
        return mapped;
      });
    },
    [direction],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem("snake-best-score");
    if (stored) {
      setBestScore(Number(stored) || 0);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("snake-best-score", String(bestScore));
  }, [bestScore]);

  useEffect(() => {
    nextDirectionRef.current = nextDirection;
  }, [nextDirection]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mapped = KEYBOARD_TO_DIRECTION[event.code];

      if (event.code === "Space") {
        event.preventDefault();
        if (isGameOver) {
          restartGame();
          return;
        }
        setIsRunning((current) => !current);
        return;
      }

      if (!mapped) {
        return;
      }

      event.preventDefault();
      requestDirection(mapped);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, requestDirection, restartGame]);

  useEffect(() => {
    if (!isRunning || isGameOver) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSnake((currentSnake) => {
        const result = tickSnakeGame({
          snake: currentSnake,
          direction: nextDirectionRef.current,
          food,
        });

        setDirection(nextDirectionRef.current);

        if (result.collided) {
          setIsRunning(false);
          setIsGameOver(true);
          return currentSnake;
        }

        if (result.ateFood) {
          setScore((current) => {
            const updated = current + 10;
            setBestScore((best) => Math.max(best, updated));
            return updated;
          });
          setSpeed((current) => Math.max(MIN_SPEED, current - SPEED_STEP));
        }

        setFood(result.food);
        return result.snake;
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [food, isGameOver, isRunning, speed]);

  const boardCells = useMemo(() => {
    const snakeMap = new Map(snake.map((segment, index) => [`${segment.x},${segment.y}`, index]));

    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      const key = `${x},${y}`;
      const snakeIndex = snakeMap.get(key);

      let className = CELL_CLASSES.base;
      if (food.x === x && food.y === y) {
        className = `${className} ${CELL_CLASSES.food}`;
      }
      if (typeof snakeIndex === "number") {
        className = `${className} ${
          snakeIndex === 0 ? CELL_CLASSES.head : CELL_CLASSES.snake
        }`;
      }

      return <div key={key} className={className} />;
    });
  }, [food, snake]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-10 pt-24 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <span className="font-arcade inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-[10px] tracking-[0.3em] text-emerald-200 uppercase">
              Neon Arcade
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                贪吃蛇，做成一块会发光的赛博街机面板。
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                使用方向键或 WASD 控制移动，按空格开始或暂停。每吃到一个能量果实，蛇会变长、速度会提升，失误一次就要从头再来。
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-slate-400">
                  <Trophy className="h-4 w-4 text-amber-300" />
                  当前得分
                </div>
                <p className="mt-4 text-4xl font-semibold text-white">{score}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-slate-400">
                  <Zap className="h-4 w-4 text-fuchsia-300" />
                  最佳纪录
                </div>
                <p className="mt-4 text-4xl font-semibold text-white">{bestScore}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">速度</div>
                <p className="mt-4 text-2xl font-semibold text-emerald-200">{formatSpeed(speed)}</p>
              </div>
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
            <div className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">操作说明</p>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <p>方向键 / WASD：控制移动方向</p>
                  <p>空格：开始或暂停</p>
                  <p>点击按钮：重新开局</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">游戏状态</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {isGameOver ? "游戏结束" : isRunning ? "进行中" : "待开始"}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {isGameOver
                    ? "撞墙或咬到自己后结束，重新开始可立刻复活。"
                    : "保持节奏，尽量不要急转回头。"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isGameOver) {
                      restartGame();
                      return;
                    }
                    setIsRunning((current) => !current);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-300/20"
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isGameOver ? "重开一局" : isRunning ? "暂停" : "开始"}
                </button>
                <button
                  type="button"
                  onClick={restartGame}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  重新开始
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[auto_280px]">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/75 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.65)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(52,211,153,0.12),transparent_35%,rgba(232,121,249,0.08))]" />
            <div
              className="relative grid aspect-square w-full max-w-[720px] gap-1 rounded-[28px] border border-white/5 bg-slate-950/80 p-3"
              aria-label="贪吃蛇游戏棋盘"
              role="img"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {boardCells}
            </div>
            {isGameOver ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/68 backdrop-blur-[3px]">
                <div className="rounded-[28px] border border-fuchsia-400/20 bg-slate-900/85 px-8 py-7 text-center shadow-2xl">
                  <p className="font-arcade text-[10px] uppercase tracking-[0.25em] text-fuchsia-200">
                    Round Over
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">本局结束</h2>
                  <p className="mt-2 text-slate-300">最终得分 {score}，点击重新开始再来一局。</p>
                  <button
                    type="button"
                    onClick={restartGame}
                    className="mt-5 rounded-full bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300"
                  >
                    马上重开
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">胜利节奏</p>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
              <p>先围着棋盘外圈稳定走位，再逐步向内收紧，能显著降低自撞概率。</p>
              <p>当速度明显加快时，尽量提前两步预判，不要在狭窄区域连续变向。</p>
              <p>果实会随机刷新在空位，身体越长，路线规划就越重要。</p>
            </div>
            <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-50">
              小提示：开局后如果没有反应，先点击“开始”或直接按一次空格键。
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
