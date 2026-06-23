import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  PIECE_COLORS,
  clearLines,
  createEmptyBoard,
  createRandomPiece,
  getLevelFromLines,
  getScoreForClearedLines,
  hasCollision,
  mergePiece,
  projectGhostY,
  rotateShape,
  type Board,
  type Piece,
  type PieceType,
} from "@/games/tetris";

interface GameState {
  board: Board;
  currentPiece: Piece;
  nextPiece: Piece;
  score: number;
  lines: number;
  level: number;
  isRunning: boolean;
  isGameOver: boolean;
}

const CELL_SIZE = 28;
type RenderCell = PieceType | `${PieceType}-ghost` | null;

function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPiece: createRandomPiece(),
    nextPiece: createRandomPiece(),
    score: 0,
    lines: 0,
    level: 1,
    isRunning: true,
    isGameOver: false,
  };
}

function getDropInterval(level: number): number {
  return Math.max(120, 720 - (level - 1) * 55);
}

function renderBoard(board: Board, piece: Piece): RenderCell[][] {
  const activeBoard: RenderCell[][] = board.map((row) => [...row]);
  const ghostY = projectGhostY(board, piece);

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) {
        return;
      }

      const ghostRow = ghostY + rowIndex;
      const ghostColumn = piece.x + columnIndex;

      if (
        ghostRow >= 0 &&
        ghostRow < BOARD_HEIGHT &&
        ghostColumn >= 0 &&
        ghostColumn < BOARD_WIDTH &&
        activeBoard[ghostRow][ghostColumn] === null
      ) {
        activeBoard[ghostRow][ghostColumn] = `${piece.type}-ghost`;
      }
    });
  });

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) {
        return;
      }

      const y = piece.y + rowIndex;
      const x = piece.x + columnIndex;

      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        activeBoard[y][x] = piece.type;
      }
    });
  });

  return activeBoard;
}

function renderNextPieceGrid(piece: Piece): boolean[] {
  const previewSize = 4;
  const rowOffset = Math.floor((previewSize - piece.shape.length) / 2);
  const columnOffset = Math.floor((previewSize - piece.shape[0].length) / 2);
  const preview = Array.from({ length: previewSize * previewSize }, () => false);

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) {
        return;
      }

      const targetRow = rowIndex + rowOffset;
      const targetColumn = columnIndex + columnOffset;
      preview[targetRow * previewSize + targetColumn] = true;
    });
  });

  return preview;
}

export default function TetrisPage() {
  const [game, setGame] = useState<GameState>(() => createInitialState());
  const gameRef = useRef(game);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const restartGame = useCallback(() => {
    setGame(createInitialState());
  }, []);

  const spawnNextPiece = useCallback((board: Board, nextPiece: Piece, score: number, lines: number) => {
    const level = getLevelFromLines(lines);
    const incomingPiece = { ...nextPiece, x: nextPiece.x, y: 0 };
    const upcoming = createRandomPiece();
    const isGameOver = hasCollision(board, incomingPiece);

    return {
      board,
      currentPiece: incomingPiece,
      nextPiece: upcoming,
      score,
      lines,
      level,
      isRunning: !isGameOver,
      isGameOver,
    };
  }, []);

  const movePiece = useCallback((dx: number, dy: number) => {
    setGame((current) => {
      if (!current.isRunning || current.isGameOver) {
        return current;
      }

      const movedPiece = {
        ...current.currentPiece,
        x: current.currentPiece.x + dx,
        y: current.currentPiece.y + dy,
      };

      if (!hasCollision(current.board, movedPiece)) {
        return { ...current, currentPiece: movedPiece };
      }

      if (dy > 0) {
        const merged = mergePiece(current.board, current.currentPiece);
        const { board, cleared } = clearLines(merged);
        const nextLines = current.lines + cleared;
        const nextScore = current.score + getScoreForClearedLines(cleared, current.level);

        return spawnNextPiece(board, current.nextPiece, nextScore, nextLines);
      }

      return current;
    });
  }, [spawnNextPiece]);

  const rotatePiece = useCallback(() => {
    setGame((current) => {
      if (!current.isRunning || current.isGameOver) {
        return current;
      }

      const rotated = {
        ...current.currentPiece,
        shape: rotateShape(current.currentPiece.shape),
      };

      const kicks = [0, -1, 1, -2, 2];
      const candidate = kicks
        .map((offset) => ({ ...rotated, x: rotated.x + offset }))
        .find((piece) => !hasCollision(current.board, piece));

      return candidate ? { ...current, currentPiece: candidate } : current;
    });
  }, []);

  const hardDrop = useCallback(() => {
    const snapshot = gameRef.current;

    if (!snapshot.isRunning || snapshot.isGameOver) {
      return;
    }

    const destinationY = projectGhostY(snapshot.board, snapshot.currentPiece);

    setGame((current) => {
      if (!current.isRunning || current.isGameOver) {
        return current;
      }

      const droppedPiece = { ...current.currentPiece, y: destinationY };
      const merged = mergePiece(current.board, droppedPiece);
      const { board, cleared } = clearLines(merged);
      const nextLines = current.lines + cleared;
      const dropBonus = Math.max(0, destinationY - current.currentPiece.y) * 2;
      const nextScore =
        current.score +
        dropBonus +
        getScoreForClearedLines(cleared, current.level);

      return spawnNextPiece(board, current.nextPiece, nextScore, nextLines);
    });
  }, [spawnNextPiece]);

  const toggleRunning = useCallback(() => {
    setGame((current) => {
      if (current.isGameOver) {
        return current;
      }

      return { ...current, isRunning: !current.isRunning };
    });
  }, []);

  useEffect(() => {
    if (!game.isRunning || game.isGameOver) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      movePiece(0, 1);
    }, getDropInterval(game.level));

    return () => window.clearInterval(timer);
  }, [game.isGameOver, game.isRunning, game.level, movePiece]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keys = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "KeyP"];
      if (keys.includes(event.key) || event.code === "Space") {
        event.preventDefault();
      }

      switch (event.key) {
        case "ArrowLeft":
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          movePiece(1, 0);
          break;
        case "ArrowDown":
          movePiece(0, 1);
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case "p":
        case "P":
          toggleRunning();
          break;
        default:
          if (event.code === "Space") {
            hardDrop();
          }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hardDrop, movePiece, rotatePiece, toggleRunning]);

  const visibleBoard = useMemo(
    () => renderBoard(game.board, game.currentPiece),
    [game.board, game.currentPiece],
  );
  const nextPieceGrid = useMemo(() => renderNextPieceGrid(game.nextPiece), [game.nextPiece]);

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:gap-10">
        <section className="flex-1">
          <div className="mb-8 overflow-hidden rounded-[32px] border border-cyan-400/30 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,rgba(16,24,40,0.95),rgba(8,12,28,0.98))] p-8 shadow-[0_0_50px_rgba(34,211,238,0.18)]">
            <p className="mb-3 inline-flex rounded-full border border-fuchsia-400/50 bg-fuchsia-400/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-fuchsia-200">
              TRAE 人工卡点演示
            </p>
            <h1 className="text-4xl font-black uppercase tracking-[0.12em] text-cyan-100 sm:text-5xl">
              Neon Tetris
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              这个页面同时演示了两类常见人工卡点：先通过提问确认接入方式与视觉风格，再通过文档评审通知确认方案，最后由 AI 在现有项目内完成小游戏实现。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={toggleRunning}
                disabled={game.isGameOver}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {game.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {game.isRunning ? "暂停" : "继续"}
              </button>
              <button
                onClick={restartGame}
                className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/50 bg-fuchsia-300/10 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-300/20"
              >
                <RotateCcw className="h-4 w-4" />
                重新开始
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_0_60px_rgba(99,102,241,0.18)] backdrop-blur">
            <div
              className="mx-auto grid rounded-[24px] border border-cyan-300/20 bg-[#040816] p-3"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
                width: BOARD_WIDTH * CELL_SIZE + 24,
              }}
            >
              {visibleBoard.flatMap((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                  const isGhost = typeof cell === "string" && cell.endsWith("-ghost");
                  const pieceType = isGhost ? cell.replace("-ghost", "") : cell;
                  const fill = pieceType ? PIECE_COLORS[pieceType as keyof typeof PIECE_COLORS] : "transparent";

                  return (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      className="relative border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: isGhost ? `${fill}20` : fill,
                        boxShadow: cell
                          ? isGhost
                            ? `inset 0 0 0 1px ${fill}99`
                            : `0 0 18px ${fill}88, inset 0 0 18px rgba(255,255,255,0.22)`
                          : "inset 0 0 0 1px rgba(255,255,255,0.03)",
                      }}
                    >
                      {!isGhost && cell ? (
                        <span className="absolute inset-1 rounded-sm bg-white/10" />
                      ) : null}
                    </div>
                  );
                }),
              )}
            </div>

            {game.isGameOver ? (
              <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                游戏结束，点击“重新开始”继续挑战。
              </div>
            ) : null}
          </div>
        </section>

        <aside className="w-full max-w-sm space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "分数", value: game.score },
              { label: "等级", value: game.level },
              { label: "消行", value: game.lines },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-5 text-center shadow-[0_0_30px_rgba(34,211,238,0.08)]"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</div>
                <div className="mt-3 text-3xl font-black text-cyan-100">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-cyan-100">下一个方块</h2>
            <div className="mt-4 inline-grid min-h-28 min-w-28 grid-cols-4 gap-1 rounded-2xl border border-cyan-300/10 bg-[#030712] p-3">
              {Array.from({ length: 16 }, (_, index) => {
                const occupied = nextPieceGrid[index];
                const color = occupied ? PIECE_COLORS[game.nextPiece.type] : "transparent";

                return (
                  <div
                    key={index}
                    className="h-5 w-5 rounded-sm border border-white/5"
                    style={{
                      backgroundColor: occupied ? color : "rgba(255,255,255,0.02)",
                      boxShadow: occupied ? `0 0 14px ${color}99` : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-fuchsia-100">键位说明</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                <span>左右移动</span>
                <code>← →</code>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                <span>加速下落</span>
                <code>↓</code>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                <span>旋转</span>
                <code>↑</code>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                <span>硬降</span>
                <code>Space</code>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                <span>暂停 / 继续</span>
                <code>P</code>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(76,29,149,0.28),rgba(8,12,28,0.7))] p-5">
            <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-white">已演示的人工卡点</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              <p>1. 通过交互提问确认接入方式和视觉风格。</p>
              <p>2. 生成简短 PRD 与技术说明，并触发文档评审通知。</p>
              <p>3. 在确认后的方案下自动实现、接线并完成验证。</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
