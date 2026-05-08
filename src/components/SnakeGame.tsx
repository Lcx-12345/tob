import { useEffect, useRef, useState, useCallback } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

interface Position {
  x: number
  y: number
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef<number | null>(null)

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 15, y: 15 })
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
  }, [])

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return

    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }

      switch (direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true)
        return prevSnake
      }

      newSnake.unshift(head)

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, isPaused, generateFood])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.key === 'Enter') {
        resetGame()
        return
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev)
        return
      }

      if (isPaused) return

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction, gameOver, isPaused, resetGame])

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, 150)
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameOver, isPaused, moveSnake])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, canvas.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(canvas.width, i * CELL_SIZE)
      ctx.stroke()
    }

    ctx.fillStyle = '#0f3460'
    snake.forEach((segment, index) => {
      const gradient = ctx.createRadialGradient(
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2
      )
      if (index === 0) {
        gradient.addColorStop(0, '#4ade80')
        gradient.addColorStop(1, '#22c55e')
      } else {
        const opacity = 1 - (index / snake.length) * 0.5
        gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity})`)
        gradient.addColorStop(1, `rgba(52, 211, 153, ${opacity})`)
      }
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
        4
      )
      ctx.fill()

      if (index === 0) {
        ctx.fillStyle = '#ffffff'
        const eyeOffset = direction === 'LEFT' || direction === 'RIGHT' ? 4 : 6
        const eyeYOffset = direction === 'UP' || direction === 'DOWN' ? 4 : 6
        ctx.beginPath()
        ctx.arc(
          segment.x * CELL_SIZE + eyeOffset,
          segment.y * CELL_SIZE + eyeYOffset,
          2,
          0,
          Math.PI * 2
        )
        ctx.fill()
        ctx.beginPath()
        ctx.arc(
          segment.x * CELL_SIZE + CELL_SIZE - eyeOffset,
          segment.y * CELL_SIZE + eyeYOffset,
          2,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    })

    const foodGradient = ctx.createRadialGradient(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    )
    foodGradient.addColorStop(0, '#f87171')
    foodGradient.addColorStop(1, '#ef4444')
    ctx.fillStyle = foodGradient
    ctx.beginPath()
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    )
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('●', food.x * CELL_SIZE + CELL_SIZE / 2 - 3, food.y * CELL_SIZE + CELL_SIZE / 2 + 4)
    ctx.fillText('●', food.x * CELL_SIZE + CELL_SIZE / 2 + 3, food.y * CELL_SIZE + CELL_SIZE / 2 + 4)

  }, [snake, food, direction])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          🐍 贪吃蛇
        </h1>
        
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-white/80">
            <span className="text-slate-400">得分: </span>
            <span className="text-xl font-bold text-green-400">{score}</span>
          </div>
          <div className="text-white/80">
            <span className="text-slate-400">长度: </span>
            <span className="text-xl font-bold text-emerald-400">{snake.length}</span>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="rounded-xl shadow-lg border border-slate-600"
          />

          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">⏸️</div>
                <p className="text-white text-xl font-bold">游戏暂停</p>
                <p className="text-slate-400 text-sm mt-1">按空格键继续</p>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">💀</div>
                <p className="text-red-400 text-2xl font-bold mb-2">游戏结束</p>
                <p className="text-white text-lg mb-1">最终得分: <span className="text-green-400 font-bold">{score}</span></p>
                <p className="text-white text-lg mb-4">蛇长度: <span className="text-emerald-400 font-bold">{snake.length}</span></p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
                >
                  重新开始
                </button>
                <p className="text-slate-400 text-sm mt-2">或按 Enter 键</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <div className="text-slate-400 text-sm space-y-1">
            <p>⬆️ ⬇️ ⬅️ ➡️ 控制方向</p>
            <p>空格键 暂停/继续</p>
            <p>Enter 重新开始</p>
          </div>
        </div>
      </div>
    </div>
  )
}
