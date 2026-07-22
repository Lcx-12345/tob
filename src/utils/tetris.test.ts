import { describe, expect, it } from "vitest";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  clearLines,
  createEmptyBoard,
  createPiece,
  getLevel,
  getScoreForClearedLines,
  isValidPosition,
  mergePiece,
  rotateMatrix,
} from "@/utils/tetris";

describe("tetris utils", () => {
  it("creates a board with the expected dimensions", () => {
    const board = createEmptyBoard();

    expect(board).toHaveLength(BOARD_HEIGHT);
    expect(board[0]).toHaveLength(BOARD_WIDTH);
    expect(board.flat().every((cell) => cell === 0)).toBe(true);
  });

  it("rotates a T piece clockwise", () => {
    const piece = createPiece("T");
    const rotated = rotateMatrix(piece.shape);

    expect(rotated).toEqual([
      [3, 0],
      [3, 3],
      [3, 0],
    ]);
  });

  it("prevents pieces from moving outside the board", () => {
    const board = createEmptyBoard();
    const piece = {
      ...createPiece("O"),
      x: 0,
    };

    expect(isValidPosition(board, piece, -1, 0)).toBe(false);
    expect(isValidPosition(board, piece, 0, 0)).toBe(true);
  });

  it("merges a piece onto the board", () => {
    const board = createEmptyBoard();
    const piece = {
      ...createPiece("O"),
      x: 4,
      y: 2,
    };

    const merged = mergePiece(board, piece);

    expect(merged[2][4]).toBe(2);
    expect(merged[3][5]).toBe(2);
  });

  it("clears fully occupied rows and preserves row count", () => {
    const board = createEmptyBoard();
    board[BOARD_HEIGHT - 1] = Array.from({ length: BOARD_WIDTH }, () => 1 as const);

    const result = clearLines(board);

    expect(result.clearedLines).toBe(1);
    expect(result.board).toHaveLength(BOARD_HEIGHT);
    expect(result.board[0].every((cell) => cell === 0)).toBe(true);
  });

  it("calculates level and scoring using classic thresholds", () => {
    expect(getLevel(0)).toBe(1);
    expect(getLevel(10)).toBe(2);
    expect(getScoreForClearedLines(4, 3)).toBe(2400);
  });
});
