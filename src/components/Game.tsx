import { useEffect, useRef, useState, useCallback } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const requestRef = useRef<number>();
  const playerRef = useRef({ x: 50, y: 0, width: 40, height: 40, velocityY: 0, jumping: false });
  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number }[]>([]);
  const groundY = 250;
  const gravity = 0.8;
  const jumpStrength = -14;
  const frameCountRef = useRef(0);
  const scoreRef = useRef(0);
  const obstaclesIntervalRef = useRef(120);

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x, y, 40, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 10, y + 8, 8, 8);
    ctx.fillRect(x + 22, y + 8, 8, 8);
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 12, y + 10, 4, 4);
    ctx.fillRect(x + 24, y + 10, 4, 4);
  };

  const drawObstacle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#444';
    ctx.fillRect(x + width / 2 - 5, y + height / 2 - 8, 10, 16);
    ctx.beginPath();
    ctx.arc(x + width / 2 - 5, y + height / 2 - 10, 4, 0, Math.PI * 2);
    ctx.arc(x + width / 2 + 5, y + height / 2 - 10, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawGround = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#888';
    ctx.fillRect(0, groundY, 800, 20);
    ctx.fillStyle = '#555';
    for (let i = 0; i < 800; i += 20) {
      ctx.fillRect(i, groundY, 2, 20);
    }
  };

  const drawScore = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`得分: ${scoreRef.current}`, 20, 40);
  };

  const jump = useCallback(() => {
    if (!playerRef.current.jumping) {
      playerRef.current.velocityY = jumpStrength;
      playerRef.current.jumping = true;
    }
  }, []);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    scoreRef.current = 0;
    frameCountRef.current = 0;
    obstaclesRef.current = [];
    playerRef.current = { x: 50, y: groundY - 40, width: 40, height: 40, velocityY: 0, jumping: false };
    obstaclesIntervalRef.current = 120;
  };

  const checkCollision = (
    player: { x: number; y: number; width: number; height: number },
    obstacle: { x: number; y: number; width: number; height: number }
  ) => {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    );
  };

  const update = useCallback(() => {
    if (gameOver) return;

    frameCountRef.current++;

    if (frameCountRef.current % 4 === 0) {
      scoreRef.current++;
      setScore(scoreRef.current);
    }

    if (frameCountRef.current % 200 === 0 && obstaclesIntervalRef.current > 60) {
      obstaclesIntervalRef.current -= 5;
    }

    if (frameCountRef.current % obstaclesIntervalRef.current === 0) {
      const height = 30 + Math.random() * 30;
      obstaclesRef.current.push({
        x: 800,
        y: groundY - height,
        width: 30,
        height,
      });
    }

    playerRef.current.velocityY += gravity;
    playerRef.current.y += playerRef.current.velocityY;

    if (playerRef.current.y >= groundY - playerRef.current.height) {
      playerRef.current.y = groundY - playerRef.current.height;
      playerRef.current.velocityY = 0;
      playerRef.current.jumping = false;
    }

    obstaclesRef.current.forEach((obstacle) => {
      obstacle.x -= 5;
    });

    obstaclesRef.current = obstaclesRef.current.filter((obstacle) => obstacle.x + obstacle.width > 0);

    for (const obstacle of obstaclesRef.current) {
      if (checkCollision(playerRef.current, obstacle)) {
        setGameOver(true);
        setGameStarted(false);
        break;
      }
    }
  }, [gameOver]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 400);

    drawGround(ctx);
    drawPlayer(ctx, playerRef.current.x, playerRef.current.y);
    obstaclesRef.current.forEach((obstacle) => {
      drawObstacle(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    drawScore(ctx);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(200, 100, 400, 200);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('游戏结束', 400, 160);
      ctx.font = '24px Arial';
      ctx.fillText(`最终得分: ${scoreRef.current}`, 400, 200);
      ctx.font = '18px Arial';
      ctx.fillText('点击或按空格键重新开始', 400, 240);
      ctx.textAlign = 'left';
    }
  }, [gameOver]);

  const gameLoop = useCallback(() => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver || !gameStarted) {
          restartGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameOver, gameStarted]);

  const handleCanvasClick = () => {
    if (gameOver || !gameStarted) {
      restartGame();
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">快跑小游戏</h1>
      <div className="bg-white rounded-xl shadow-2xl p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border-4 border-blue-300 rounded-lg cursor-pointer bg-gradient-to-b from-sky-50 to-sky-100"
          onClick={handleCanvasClick}
        />
        {!gameStarted && !gameOver && (
          <div className="mt-4 text-center">
            <p className="text-gray-700 text-lg">点击或按空格键开始游戏</p>
            <p className="text-gray-500 mt-2">使用空格键或点击屏幕跳跃，躲避障碍物</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={restartGame}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          重新开始
        </button>
      </div>
    </div>
  );
};

export default Game;
