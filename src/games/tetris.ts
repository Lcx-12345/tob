export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type BoardCell = PieceType | null;
export type Board = BoardCell[][];

export interface Piece {
  type: PieceType;
  shape: number[][];
  x: number;
  y: number;
}

const SHAPES: Record<PieceType, number[][]> = {
  I: [
    [1, 1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export const PIECE_COLORS: Record<PieceType, string> = {
  I: "#33f6ff",
  O: "#ffe066",
  T: "#c77dff",
  S: "#5bff98",
  Z: "#ff6b8a",
  J: "#5c7cfa",
  L: "#ff922b",
};

const PIECES = Object.keys(SHAPES) as PieceType[];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null),
  );
}

export function rotateShape(shape: number[][]): number[][] {
  return shape[0].map((_, columnIndex) =>
    shape.map((row) => row[columnIndex]).reverse(),
  );
}

export function createRandomPiece(): Piece {
  const type = PIECES[Math.floor(Math.random() * PIECES.length)];
  const shape = SHAPES[type].map((row) => [...row]);
  const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);

  return {
    type,
    shape,
    x,
    y: 0,
  };
}

export function hasCollision(board: Board, piece: Piece): boolean {
  return piece.shape.some((row, rowIndex) =>
    row.some((value, columnIndex) => {
      if (!value) {
        return false;
      }

      const x = piece.x + columnIndex;
      const y = piece.y + rowIndex;

      if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
        return true;
      }

      if (y < 0) {
        return false;
      }

      return board[y][x] !== null;
    }),
  );
}

export function mergePiece(board: Board, piece: Piece): Board {
  const nextBoard = board.map((row) => [...row]);

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) {
        return;
      }

      const x = piece.x + columnIndex;
      const y = piece.y + rowIndex;

      if (y >= 0) {
        nextBoard[y][x] = piece.type;
      }
    });
  });

  return nextBoard;
}

export function clearLines(board: Board): { board: Board; cleared: number } {
  const remainingRows = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_HEIGHT - remainingRows.length;

  if (cleared === 0) {
    return { board, cleared: 0 };
  }

  const nextBoard = [
    ...Array.from({ length: cleared }, () =>
      Array.from({ length: BOARD_WIDTH }, () => null),
    ),
    ...remainingRows,
  ];

  return { board: nextBoard, cleared };
}

export function projectGhostY(board: Board, piece: Piece): number {
  let ghostY = piece.y;

  while (!hasCollision(board, { ...piece, y: ghostY + 1 })) {
    ghostY += 1;
  }

  return ghostY;
}

export function getLevelFromLines(lines: number): number {
  return Math.floor(lines / 10) + 1;
}

export function getScoreForClearedLines(cleared: number, level: number): number {
  const scoreTable = [0, 100, 300, 500, 800];
  return (scoreTable[cleared] ?? 0) * level;
}
