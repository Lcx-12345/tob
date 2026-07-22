export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Board = CellValue[][];

export interface Piece {
  type: PieceType;
  shape: number[][];
  x: number;
  y: number;
}

export interface ClearLinesResult {
  board: Board;
  clearedLines: number;
}

export const PIECE_ORDER: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];

export const TETROMINOES: Record<PieceType, number[][]> = {
  I: [
    [1, 1, 1, 1],
  ],
  O: [
    [2, 2],
    [2, 2],
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3],
  ],
  S: [
    [0, 4, 4],
    [4, 4, 0],
  ],
  Z: [
    [5, 5, 0],
    [0, 5, 5],
  ],
  J: [
    [6, 0, 0],
    [6, 6, 6],
  ],
  L: [
    [0, 0, 7],
    [7, 7, 7],
  ],
};

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0 as CellValue),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]) as Board;
}

export function getRandomPieceType(): PieceType {
  return PIECE_ORDER[Math.floor(Math.random() * PIECE_ORDER.length)];
}

export function createPiece(type: PieceType): Piece {
  const shape = TETROMINOES[type].map((row) => [...row]);
  const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);

  return {
    type,
    shape,
    x,
    y: 0,
  };
}

export function rotateMatrix(shape: number[][]): number[][] {
  return shape[0].map((_, columnIndex) =>
    shape.map((row) => row[columnIndex]).reverse(),
  );
}

export function isValidPosition(
  board: Board,
  piece: Piece,
  deltaX = 0,
  deltaY = 0,
  nextShape = piece.shape,
): boolean {
  for (let y = 0; y < nextShape.length; y += 1) {
    for (let x = 0; x < nextShape[y].length; x += 1) {
      if (nextShape[y][x] === 0) {
        continue;
      }

      const targetX = piece.x + x + deltaX;
      const targetY = piece.y + y + deltaY;

      if (targetX < 0 || targetX >= BOARD_WIDTH || targetY >= BOARD_HEIGHT) {
        return false;
      }

      if (targetY >= 0 && board[targetY][targetX] !== 0) {
        return false;
      }
    }
  }

  return true;
}

export function mergePiece(board: Board, piece: Piece): Board {
  const nextBoard = cloneBoard(board);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) {
        return;
      }

      const targetY = piece.y + y;
      const targetX = piece.x + x;

      if (targetY >= 0 && targetY < BOARD_HEIGHT && targetX >= 0 && targetX < BOARD_WIDTH) {
        nextBoard[targetY][targetX] = cell as CellValue;
      }
    });
  });

  return nextBoard;
}

export function clearLines(board: Board): ClearLinesResult {
  const remainingRows = board.filter((row) => row.some((cell) => cell === 0));
  const clearedLines = BOARD_HEIGHT - remainingRows.length;

  const freshRows = Array.from({ length: clearedLines }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0 as CellValue),
  );

  return {
    board: [...freshRows, ...remainingRows] as Board,
    clearedLines,
  };
}

export function getDropInterval(level: number): number {
  return Math.max(120, 700 - (level - 1) * 55);
}

export function getLevel(lines: number): number {
  return Math.floor(lines / 10) + 1;
}

export function getScoreForClearedLines(clearedLines: number, level: number): number {
  const baseScores = [0, 100, 300, 500, 800];
  return baseScores[clearedLines] * level;
}

export function projectPieceOnBoard(board: Board, piece: Piece | null): Board {
  if (!piece) {
    return board;
  }

  return mergePiece(board, piece);
}
