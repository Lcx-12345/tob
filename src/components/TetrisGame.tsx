import { useEffect, useRef, useState, useCallback } from 'react'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 30

type Direction = 'LEFT' | 'RIGHT'
type Rotation = 'CLOCKWISE' | 'COUNTER_CLOCKWISE'

interface Position {
  x: number
  y: number
}

interface Tetromino {
  shape: number[][]
  color: string
}

const TETROMINOES: Tetromino[] = [
  {
    shape: [[1, 1, 1, 1]],
    color: '#06b6d4'
  },
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#eab308'
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a855f7'
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#3b82f6'
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#f97316'
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#22c55e'
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#ef4444'
  }
]

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [board, setBoard] = useState<number[][]>(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  )
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const nextPieceRef = useRef<Tetromino | null>(null)

  const rotateMatrix = (matrix: number[][], clockwise: boolean): number[][] => {
    const rows = matrix.length
    const cols = matrix[0].length
    const rotated: number[][] = []

    for (let i = 0; i < cols; i++) {
      rotated[i] = []
      for (let j = 0; j < rows; j++) {
        rotated[i][j] = clockwise ? matrix[rows - 1 - j][i] : matrix[j][cols - 1 - i]
      }
    }

    return rotated
  }

  const getRandomPiece = useCallback((): Tetromino => {
    if (!nextPieceRef.current) {
      nextPieceRef.current = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
    }
    const piece = nextPieceRef.current
    nextPieceRef.current = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
    return piece
  }, [])

  const isValidPosition = useCallback((piece: Tetromino, position: Position, boardState: number[][]): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x
          const newY = position.y + y

          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false
          }

          if (newY >= 0 && boardState[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }, [])

  const placePiece = useCallback((piece: Tetromino, position: Position, boardState: number[][]): number[][] => {
    const newBoard = boardState.map(row => [...row])

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = position.y + y
          const boardX = position.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = 1
          }
        }
      }
    }

    return newBoard
  }, [])

  const clearLines = useCallback((boardState: number[][]): { newBoard: number[][], linesCleared: number } => {
    const newBoard = boardState.filter(row => row.some(cell => !cell))
    const linesCleared = BOARD_HEIGHT - newBoard.length

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0))
    }

    return { newBoard, linesCleared }
  }, [])

  const spawnNewPiece = useCallback(() => {
    const piece = getRandomPiece()
    const position = { x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2), y: 0 }

    if (!isValidPosition(piece, position, board)) {
      setGameOver(true)
      return
    }

    setCurrentPiece(piece)
    setCurrentPosition(position)
  }, [board, getRandomPiece, isValidPosition])

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const newPosition = { ...currentPosition, y: currentPosition.y + 1 }

    if (isValidPosition(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition)
    } else {
      const newBoard = placePiece(currentPiece, currentPosition, board)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

      if (linesCleared > 0) {
        setLines(prev => prev + linesCleared)
        const points = [0, 100, 300, 500, 800][linesCleared] * level
        setScore(prev => prev + points)
        setLevel(prev => Math.floor((lines + linesCleared) / 10) + 1)
        setBoard(clearedBoard)
      } else {
        setBoard(newBoard)
      }

      spawnNewPiece()
    }
  }, [currentPiece, currentPosition, board, gameOver, isPaused, isValidPosition, placePiece, clearLines, spawnNewPiece, level, lines])

  const moveHorizontal = useCallback((direction: Direction) => {
    if (!currentPiece || gameOver || isPaused) return

    const delta = direction === 'LEFT' ? -1 : 1
    const newPosition = { ...currentPosition, x: currentPosition.x + delta }

    if (isValidPosition(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition)
    }
  }, [currentPiece, currentPosition, board, gameOver, isPaused, isValidPosition])

  const rotate = useCallback((rotation: Rotation) => {
    if (!currentPiece || gameOver || isPaused) return

    const clockwise = rotation === 'CLOCKWISE'
    const rotatedShape = rotateMatrix(currentPiece.shape, clockwise)
    const rotatedPiece = { ...currentPiece, shape: rotatedShape }

    if (isValidPosition(rotatedPiece, currentPosition, board)) {
      setCurrentPiece(rotatedPiece)
    } else if (currentPosition.x > 0 && isValidPosition(rotatedPiece, { ...currentPosition, x: currentPosition.x - 1 }, board)) {
      setCurrentPiece(rotatedPiece)
      setCurrentPosition(prev => ({ ...prev, x: prev.x - 1 }))
    } else if (currentPosition.x < BOARD_WIDTH - 1 && isValidPosition(rotatedPiece, { ...currentPosition, x: currentPosition.x + 1 }, board)) {
      setCurrentPiece(rotatedPiece)
      setCurrentPosition(prev => ({ ...prev, x: prev.x + 1 }))
    }
  }, [currentPiece, currentPosition, board, gameOver, isPaused, isValidPosition])

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    let newY = currentPosition.y
    while (isValidPosition(currentPiece, { ...currentPosition, y: newY + 1 }, board)) {
      newY++
    }

    setScore(prev => prev + (newY - currentPosition.y) * 2)
    setCurrentPosition({ ...currentPosition, y: newY })
  }, [currentPiece, currentPosition, board, gameOver, isPaused, isValidPosition])

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)))
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
    nextPieceRef.current = null
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter') {
          resetGame()
        }
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (isPaused) {
            setIsPaused(false)
          } else {
            hardDrop()
          }
          break
        case 'p':
        case 'P':
          setIsPaused(prev => !prev)
          break
        case 'ArrowUp':
          e.preventDefault()
          rotate('CLOCKWISE')
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowLeft':
          e.preventDefault()
          moveHorizontal('LEFT')
          break
        case 'ArrowRight':
          e.preventDefault()
          moveHorizontal('RIGHT')
          break
        case 'z':
        case 'Z':
          rotate('COUNTER_CLOCKWISE')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver, isPaused, hardDrop, rotate, moveDown, moveHorizontal, resetGame])

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece()
    }
  }, [currentPiece, gameOver, spawnNewPiece])

  useEffect(() => {
    if (!gameOver && !isPaused && currentPiece) {
      const speed = Math.max(100, 1000 - (level - 1) * 100)
      gameLoopRef.current = window.setInterval(moveDown, speed)
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameOver, isPaused, currentPiece, moveDown, level])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(canvas.width, i * CELL_SIZE)
      ctx.stroke()
    }

    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const gradient = ctx.createLinearGradient(
            x * CELL_SIZE,
            y * CELL_SIZE,
            x * CELL_SIZE + CELL_SIZE,
            y * CELL_SIZE + CELL_SIZE
          )
          gradient.addColorStop(0, '#64748b')
          gradient.addColorStop(1, '#475569')
          ctx.fillStyle = gradient
          ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
        }
      })
    })

    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const gradient = ctx.createLinearGradient(
              (currentPosition.x + x) * CELL_SIZE,
              (currentPosition.y + y) * CELL_SIZE,
              (currentPosition.x + x) * CELL_SIZE + CELL_SIZE,
              (currentPosition.y + y) * CELL_SIZE + CELL_SIZE
            )
            const lighterColor = currentPiece.color
            gradient.addColorStop(0, lighterColor)
            gradient.addColorStop(1, adjustColor(lighterColor, -30))
            ctx.fillStyle = gradient
            ctx.fillRect(
              (currentPosition.x + x) * CELL_SIZE + 1,
              (currentPosition.y + y) * CELL_SIZE + 1,
              CELL_SIZE - 2,
              CELL_SIZE - 2
            )

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
            ctx.lineWidth = 2
            ctx.strokeRect(
              (currentPosition.x + x) * CELL_SIZE + 2,
              (currentPosition.y + y) * CELL_SIZE + 2,
              CELL_SIZE - 4,
              CELL_SIZE - 4
            )
          }
        })
      })
    }

  }, [board, currentPiece, currentPosition])

  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '')
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🎮 俄罗斯方块
        </h1>

        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={BOARD_WIDTH * CELL_SIZE}
              height={BOARD_HEIGHT * CELL_SIZE}
              className="rounded-xl shadow-lg border-2 border-slate-600"
            />
          </div>

          <div className="flex flex-col gap-4 min-w-[120px]">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">分数</div>
              <div className="text-2xl font-bold text-cyan-400">{score.toLocaleString()}</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">等级</div>
              <div className="text-2xl font-bold text-blue-400">{level}</div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">消除</div>
              <div className="text-2xl font-bold text-purple-400">{lines}</div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-2 text-center">下一个</div>
              <div className="w-[60px] h-[60px] mx-auto bg-slate-800 rounded flex items-center justify-center">
                {nextPieceRef.current && (
                  <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${nextPieceRef.current.shape[0].length}, 8px)` }}>
                    {nextPieceRef.current.shape.flat().map((cell, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: cell ? nextPieceRef.current?.color : 'transparent' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">⏸️</div>
              <p className="text-white text-xl font-bold">游戏暂停</p>
              <p className="text-slate-400 text-sm mt-1">按 P 键继续</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">💀</div>
              <p className="text-red-400 text-2xl font-bold mb-2">游戏结束</p>
              <p className="text-white text-lg mb-1">最终分数: <span className="text-cyan-400 font-bold">{score.toLocaleString()}</span></p>
              <p className="text-white text-lg mb-4">等级: <span className="text-blue-400 font-bold">{level}</span></p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                重新开始
              </button>
              <p className="text-slate-400 text-sm mt-2">或按 Enter 键</p>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <div className="text-slate-400 text-sm space-y-1">
            <p>⬅️ ➡️ 移动 | ⬆️ 旋转 | ⬇️ 加速</p>
            <p>空格键 快速下落 | P 暂停</p>
            <p>Z 键 反向旋转</p>
          </div>
        </div>
      </div>
    </div>
  )
}
