import React, { useState, useEffect, useCallback } from 'react';

const SnakeGame: React.FC = () => {
  const BOARD_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_DIRECTION = { x: 1, y: 0 };
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState<{ x: number; y: number }>(() => generateFood());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(150);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  }

  const checkCollision = useCallback((head: { x: number; y: number }) => {
    // Check wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }
    // Check self collision
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      if (checkCollision(newHead)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if snake ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood());
        setScore(prevScore => prevScore + 10);
        setSpeed(prevSpeed => Math.max(50, prevSpeed - 5)); // Increase speed
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, checkCollision]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) restartGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Update direction
  useEffect(() => {
    setDirection(nextDirection);
  }, [nextDirection]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed, gameOver]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setSpeed(150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-green-400">贪吃蛇游戏</h1>
      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="text-xl">分数: {score}</div>
        <div className="text-xl">速度: {Math.round(1000 / speed)}</div>
      </div>
      <div 
        className="border-2 border-gray-700" 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
          gap: '1px',
          backgroundColor: '#333',
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          const isHead = snake[0].x === x && snake[0].y === y;

          return (
            <div
              key={index}
              className={`w-5 h-5 ${isSnake ? (isHead ? 'bg-green-400' : 'bg-green-600') : isFood ? 'bg-red-500' : 'bg-gray-800'}`}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">游戏结束!</h2>
          <p className="text-xl mb-4">最终分数: {score}</p>
          <button 
            onClick={restartGame} 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            重新开始
          </button>
          <p className="mt-4 text-gray-400">按空格键也可以重新开始</p>
        </div>
      )}
      <div className="mt-8 text-gray-400 text-center">
        <p>使用方向键控制蛇的移动</p>
        <p>吃到红色的食物得分</p>
      </div>
    </div>
  );
};

export default SnakeGame;