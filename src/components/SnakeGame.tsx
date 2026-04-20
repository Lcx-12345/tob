import { useState, useEffect, useRef } from 'react';
import Navigation from './Navigation';

// 游戏常量
const GRID_SIZE = 20;
const TILE_COUNT = 20;
const GAME_SPEED = 100;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // 加载最高分
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // 保存最高分
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        startGame();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          if (gameOver) restartGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, gameOver]);

  // 生成随机食物
  const generateFood = (currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  // 检查碰撞
  const checkCollision = (head: Position, snakeArray: Position[]): boolean => {
    // 墙壁碰撞
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      return true;
    }
    // 自身碰撞
    for (let i = 0; i < snakeArray.length; i++) {
      if (head.x === snakeArray[i].x && head.y === snakeArray[i].y) {
        return true;
      }
    }
    return false;
  };

  // 游戏主循环
  const gameLoop = () => {
    setDirection(nextDirection);
    
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { x: newSnake[0].x, y: newSnake[0].y };

      switch (nextDirection) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
      }

      // 检查碰撞
      if (checkCollision(head, newSnake)) {
        endGame();
        return prevSnake;
      }

      newSnake.unshift(head);

      // 检查食物
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  // 绘制游戏
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = '#2d2d4e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // 绘制食物
    const foodGradient = ctx.createRadialGradient(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      0,
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2
    );
    foodGradient.addColorStop(0, '#ff6b6b');
    foodGradient.addColorStop(1, '#ee5a5a');
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 绘制蛇
    snake.forEach((segment, index) => {
      if (index === 0) {
        // 蛇头
        const headGradient = ctx.createLinearGradient(
          segment.x * GRID_SIZE,
          segment.y * GRID_SIZE,
          segment.x * GRID_SIZE + GRID_SIZE,
          segment.y * GRID_SIZE + GRID_SIZE
        );
        headGradient.addColorStop(0, '#4ecca3');
        headGradient.addColorStop(1, '#3db896');
        ctx.fillStyle = headGradient;
      } else {
        // 蛇身
        const bodyGradient = ctx.createLinearGradient(
          segment.x * GRID_SIZE,
          segment.y * GRID_SIZE,
          segment.x * GRID_SIZE + GRID_SIZE,
          segment.y * GRID_SIZE + GRID_SIZE
        );
        const opacity = 1 - (index / snake.length) * 0.3;
        bodyGradient.addColorStop(0, `rgba(78, 204, 163, ${opacity})`);
        bodyGradient.addColorStop(1, `rgba(61, 184, 150, ${opacity})`);
        ctx.fillStyle = bodyGradient;
      }
      
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
      
      // 添加圆角效果
      ctx.beginPath();
      ctx.roundRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2,
        4
      );
      ctx.fill();
    });
  }, [snake, food]);

  // 开始游戏
  const startGame = () => {
    if (gameOver) restartGame();
    setGameStarted(true);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
  };

  // 结束游戏
  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  // 重新开始游戏
  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
  };

  // 移动控制（触摸设备）
  const handleDirectionChange = (newDir: Direction) => {
    if (!gameStarted) startGame();
    if (
      (newDir === 'UP' && direction !== 'DOWN') ||
      (newDir === 'DOWN' && direction !== 'UP') ||
      (newDir === 'LEFT' && direction !== 'RIGHT') ||
      (newDir === 'RIGHT' && direction !== 'LEFT')
    ) {
      setNextDirection(newDir);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2d1b4e] to-[#4a1942] flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
      <div className="text-center mb-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#4ecca3] to-purple-400 bg-clip-text text-transparent mb-2 font-accent">
          贪吃蛇
        </h1>
        <p className="text-gray-300 text-lg font-body">经典游戏，重温回忆</p>
      </div>

      {/* 分数显示 */}
      <div className="flex gap-8 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-gray-400 text-sm font-navigation">分数</p>
          <p className="text-3xl font-bold text-[#4ecca3]">{score}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-gray-400 text-sm font-navigation">最高分</p>
          <p className="text-3xl font-bold text-purple-400">{highScore}</p>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={TILE_COUNT * GRID_SIZE}
          height={TILE_COUNT * GRID_SIZE}
          className="rounded-xl border-4 border-[#4ecca3]/50 shadow-2xl shadow-[#4ecca3]/20"
        />
        
        {/* 开始界面 */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-[#1a1a2e]/90 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white mb-4 font-accent">准备开始</h2>
            <p className="text-gray-300 mb-6 font-body">按任意方向键或空格键开始</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-[#4ecca3] to-purple-400 text-[#1a1a2e] font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg font-accent"
            >
              开始游戏
            </button>
          </div>
        )}

        {/* 游戏结束界面 */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#1a1a2e]/90 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-red-400 mb-4 font-accent">游戏结束</h2>
            <p className="text-white text-xl mb-2 font-body">你的分数</p>
            <p className="text-5xl font-bold text-[#4ecca3] mb-6">{score}</p>
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-gradient-to-r from-[#4ecca3] to-purple-400 text-[#1a1a2e] font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg font-accent"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>

      {/* 控制说明 */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-4 font-body">使用方向键或 WASD 控制</p>
        
        {/* 触摸控制 */}
        <div className="md:hidden grid grid-cols-3 gap-2 w-48 mx-auto">
          <div></div>
          <button
            onClick={() => handleDirectionChange('UP')}
            className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl active:bg-[#4ecca3]/50"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => handleDirectionChange('LEFT')}
            className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl active:bg-[#4ecca3]/50"
          >
            ←
          </button>
          <button
            onClick={() => handleDirectionChange('DOWN')}
            className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl active:bg-[#4ecca3]/50"
          >
            ↓
          </button>
          <button
            onClick={() => handleDirectionChange('RIGHT')}
            className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl active:bg-[#4ecca3]/50"
          >
            →
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SnakeGame;