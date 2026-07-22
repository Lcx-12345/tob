import { useEffect, useMemo, useReducer } from "react";
import {
  Board,
  Piece,
  PieceType,
  TETROMINOES,
  clearLines,
  createEmptyBoard,
  createPiece,
  getDropInterval,
  getLevel,
  getRandomPieceType,
  getScoreForClearedLines,
  isValidPosition,
  mergePiece,
  projectPieceOnBoard,
  rotateMatrix,
} from "@/utils/tetris";

type GameStatus = "idle" | "running" | "paused" | "gameover";

interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextType: PieceType;
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
}

type GameAction =
  | { type: "START" }
  | { type: "RESTART" }
  | { type: "TICK" }
  | { type: "MOVE"; deltaX: number; deltaY: number }
  | { type: "ROTATE" }
  | { type: "HARD_DROP" }
  | { type: "TOGGLE_PAUSE" };

function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextType: getRandomPieceType(),
    score: 0,
    lines: 0,
    level: 1,
    status: "idle",
  };
}

function createRunningState(): GameState {
  const firstType = getRandomPieceType();

  return {
    board: createEmptyBoard(),
    currentPiece: createPiece(firstType),
    nextType: getRandomPieceType(),
    score: 0,
    lines: 0,
    level: 1,
    status: "running",
  };
}

function settlePiece(state: GameState, piece: Piece): GameState {
  const mergedBoard = mergePiece(state.board, piece);
  const { board: clearedBoard, clearedLines } = clearLines(mergedBoard);
  const totalLines = state.lines + clearedLines;
  const level = getLevel(totalLines);
  const score = state.score + getScoreForClearedLines(clearedLines, state.level);
  const nextPiece = createPiece(state.nextType);
  const upcomingType = getRandomPieceType();

  if (!isValidPosition(clearedBoard, nextPiece)) {
    return {
      ...state,
      board: clearedBoard,
      currentPiece: null,
      nextType: upcomingType,
      score,
      lines: totalLines,
      level,
      status: "gameover",
    };
  }

  return {
    ...state,
    board: clearedBoard,
    currentPiece: nextPiece,
    nextType: upcomingType,
    score,
    lines: totalLines,
    level,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
    case "RESTART":
      return createRunningState();
    case "TOGGLE_PAUSE":
      if (state.status === "running") {
        return { ...state, status: "paused" };
      }

      if (state.status === "paused") {
        return { ...state, status: "running" };
      }

      return state;
    case "MOVE": {
      if (state.status !== "running" || !state.currentPiece) {
        return state;
      }

      const { currentPiece } = state;

      if (isValidPosition(state.board, currentPiece, action.deltaX, action.deltaY)) {
        return {
          ...state,
          currentPiece: {
            ...currentPiece,
            x: currentPiece.x + action.deltaX,
            y: currentPiece.y + action.deltaY,
          },
        };
      }

      if (action.deltaY > 0) {
        return settlePiece(state, currentPiece);
      }

      return state;
    }
    case "ROTATE": {
      if (state.status !== "running" || !state.currentPiece) {
        return state;
      }

      const rotatedShape = rotateMatrix(state.currentPiece.shape);
      const kickOffsets = [0, -1, 1, -2, 2];

      for (const offset of kickOffsets) {
        if (isValidPosition(state.board, state.currentPiece, offset, 0, rotatedShape)) {
          return {
            ...state,
            currentPiece: {
              ...state.currentPiece,
              x: state.currentPiece.x + offset,
              shape: rotatedShape,
            },
          };
        }
      }

      return state;
    }
    case "HARD_DROP": {
      if (state.status !== "running" || !state.currentPiece) {
        return state;
      }

      let dropDistance = 0;

      while (isValidPosition(state.board, state.currentPiece, 0, dropDistance + 1)) {
        dropDistance += 1;
      }

      const landedPiece = {
        ...state.currentPiece,
        y: state.currentPiece.y + dropDistance,
      };

      return settlePiece(state, landedPiece);
    }
    case "TICK": {
      if (state.status !== "running" || !state.currentPiece) {
        return state;
      }

      if (isValidPosition(state.board, state.currentPiece, 0, 1)) {
        return {
          ...state,
          currentPiece: {
            ...state.currentPiece,
            y: state.currentPiece.y + 1,
          },
        };
      }

      return settlePiece(state, state.currentPiece);
    }
    default:
      return state;
  }
}

export function useTetrisGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  useEffect(() => {
    if (state.status !== "running") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, getDropInterval(state.level));

    return () => window.clearInterval(timer);
  }, [state.level, state.status]);

  const board = useMemo(
    () => projectPieceOnBoard(state.board, state.currentPiece),
    [state.board, state.currentPiece],
  );

  const nextShape = TETROMINOES[state.nextType];

  return {
    board,
    nextShape,
    score: state.score,
    lines: state.lines,
    level: state.level,
    status: state.status,
    startGame: () => dispatch({ type: "START" }),
    restartGame: () => dispatch({ type: "RESTART" }),
    togglePause: () => dispatch({ type: "TOGGLE_PAUSE" }),
    moveLeft: () => dispatch({ type: "MOVE", deltaX: -1, deltaY: 0 }),
    moveRight: () => dispatch({ type: "MOVE", deltaX: 1, deltaY: 0 }),
    softDrop: () => dispatch({ type: "MOVE", deltaX: 0, deltaY: 1 }),
    rotate: () => dispatch({ type: "ROTATE" }),
    hardDrop: () => dispatch({ type: "HARD_DROP" }),
  };
}
