import { useEffect, useRef, useState, useCallback } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_HEIGHT = 60;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;

type GameState = 'start' | 'playing' | 'gameover';

type MechState = 'idle' | 'moving' | 'jumping' | 'attacking' | 'special_attack' | 'defending' | 'hit' | 'dead';

interface Mech {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  health: number;
  maxHealth: number;
  state: MechState;
  facingRight: boolean;
  attackCooldown: number;
  specialCooldown: number;
  animationFrame: number;
  animationTimer: number;
  color: string;
  secondaryColor: string;
}

interface Projectile {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  isSpecial: boolean;
  facingRight: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const createMech = (x: number, color: string, secondaryColor: string): Mech => ({
  x,
  y: CANVAS_HEIGHT - GROUND_HEIGHT - 60,
  width: 48,
  height: 60,
  velocityY: 0,
  health: 100,
  maxHealth: 100,
  state: 'idle',
  facingRight: x < CANVAS_WIDTH / 2,
  attackCooldown: 0,
  specialCooldown: 0,
  animationFrame: 0,
  animationTimer: 0,
  color,
  secondaryColor,
});

const drawPixelRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
};

const drawMech = (ctx: CanvasRenderingContext2D, mech: Mech) => {
  ctx.save();
  ctx.translate(mech.x + mech.width / 2, mech.y + mech.height / 2);
  if (!mech.facingRight) ctx.scale(-1, 1);
  ctx.translate(-mech.width / 2, -mech.height / 2);

  const frame = mech.animationFrame;

  drawPixelRect(ctx, 8, 0, 32, 8, mech.color);
  drawPixelRect(ctx, 12, 4, 4, 4, mech.secondaryColor);
  drawPixelRect(ctx, 24, 4, 4, 4, mech.secondaryColor);

  drawPixelRect(ctx, 4, 8, 8, 24, mech.color);
  drawPixelRect(ctx, 24, 8, 8, 24, mech.color);
  drawPixelRect(ctx, 0, 32, 12, 8, mech.color);
  drawPixelRect(ctx, 28, 32, 12, 8, mech.color);

  drawPixelRect(ctx, 12, 8, 24, 20, mech.color);
  drawPixelRect(ctx, 16, 12, 16, 12, mech.secondaryColor);

  if (mech.state === 'attacking') {
    const armOffset = Math.sin(frame * 0.5) * 8;
    drawPixelRect(ctx, 28 + armOffset, 12, 16, 6, mech.color);
    drawPixelRect(ctx, 40 + armOffset, 10, 8, 10, '#ff6b6b');
  } else if (mech.state === 'special_attack') {
    const armOffset = Math.sin(frame * 0.8) * 12;
    drawPixelRect(ctx, 28 + armOffset, 8, 20, 6, mech.color);
    drawPixelRect(ctx, 44 + armOffset, 4, 12, 14, '#ffd93d');
  } else if (mech.state === 'defending') {
    drawPixelRect(ctx, 28, 12, 14, 6, mech.color);
    drawPixelRect(ctx, 38, 10, 8, 10, '#6bcb77');
    drawPixelRect(ctx, 16, 28, 12, 4, mech.secondaryColor);
  } else {
    drawPixelRect(ctx, 28, 12, 12, 6, mech.color);
    drawPixelRect(ctx, 36, 10, 6, 8, mech.secondaryColor);
  }

  drawPixelRect(ctx, 8, 28, 10, 12, mech.color);
  drawPixelRect(ctx, 22, 28, 10, 12, mech.color);
  drawPixelRect(ctx, 4, 36, 8, 8, mech.color);
  drawPixelRect(ctx, 28, 36, 8, 8, mech.color);

  if (mech.state === 'hit') {
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.3) * 0.3;
  }

  ctx.restore();
};

const drawHealthBar = (ctx: CanvasRenderingContext2D, mech: Mech, label: string) => {
  const x = mech.x;
  const y = mech.y - 20;
  const width = 60;
  const height = 6;

  drawPixelRect(ctx, x - 6, y - 2, width + 12, height + 4, '#1a1a2e');
  drawPixelRect(ctx, x, y, width, height, '#4a4a4a');

  const healthWidth = (mech.health / mech.maxHealth) * width;
  const healthColor = mech.health > 50 ? '#4ade80' : mech.health > 25 ? '#facc15' : '#f87171';
  drawPixelRect(ctx, x, y, healthWidth, height, healthColor);

  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.fillText(label, x + width / 2 - ctx.measureText(label).width / 2, y - 4);
  ctx.fillText(`${mech.health}/${mech.maxHealth}`, x + width / 2 - ctx.measureText(`${mech.health}/${mech.maxHealth}`).width / 2, y + height + 10);
};

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  drawPixelRect(ctx, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT, '#1a1a2e');
  
  for (let i = 0; i < CANVAS_WIDTH; i += 40) {
    drawPixelRect(ctx, i, 40, 20, 2, '#16213e');
    drawPixelRect(ctx, i + 20, 60, 16, 2, '#16213e');
    drawPixelRect(ctx, i, 80, 24, 2, '#16213e');
  }

  for (let i = 0; i < 10; i++) {
    const x = (i * 80 + Date.now() / 50) % CANVAS_WIDTH;
    drawPixelRect(ctx, x, 20, 2, 2, '#64ffda');
    drawPixelRect(ctx, x + 4, 24, 1, 1, '#64ffda');
  }

  drawPixelRect(ctx, 0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT, '#2d2d44');
  drawPixelRect(ctx, 0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, 4, '#4a4a6a');
  
  for (let i = 0; i < CANVAS_WIDTH; i += 32) {
    drawPixelRect(ctx, i, CANVAS_HEIGHT - GROUND_HEIGHT + 8, 16, 2, '#3d3d5c');
    drawPixelRect(ctx, i + 16, CANVAS_HEIGHT - GROUND_HEIGHT + 16, 12, 2, '#3d3d5c');
  }
};

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [winner, setWinner] = useState<string>('');
  const mech1Ref = useRef<Mech>(createMech(100, '#00d4ff', '#0099cc'));
  const mech2Ref = useRef<Mech>(createMech(650, '#ff6b6b', '#cc5555'));
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>(0);

  const createParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 20 + Math.random() * 10,
        color,
      });
    }
  };

  const checkCollision = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) => {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  };

  const updateMech = useCallback((mech: Mech, keys: Set<string>, leftKey: string, rightKey: string, jumpKey: string, attackKey: string, specialKey: string, defendKey: string, otherMech: Mech) => {
    if (mech.state === 'dead') return;

    if (mech.attackCooldown > 0) mech.attackCooldown--;
    if (mech.specialCooldown > 0) mech.specialCooldown--;

    mech.animationTimer++;
    if (mech.animationTimer > 8) {
      mech.animationTimer = 0;
      mech.animationFrame++;
    }

    if (mech.state === 'attacking' && mech.animationFrame > 12) {
      mech.state = 'idle';
      mech.animationFrame = 0;
    }
    if (mech.state === 'special_attack' && mech.animationFrame > 16) {
      mech.state = 'idle';
      mech.animationFrame = 0;
    }
    if (mech.state === 'hit' && mech.animationFrame > 8) {
      mech.state = 'idle';
      mech.animationFrame = 0;
    }

    if (keys.has(leftKey) && mech.state !== 'attacking' && mech.state !== 'special_attack') {
      mech.x -= MOVE_SPEED;
      mech.facingRight = false;
      if (mech.state === 'idle') mech.state = 'moving';
    } else if (keys.has(rightKey) && mech.state !== 'attacking' && mech.state !== 'special_attack') {
      mech.x += MOVE_SPEED;
      mech.facingRight = true;
      if (mech.state === 'idle') mech.state = 'moving';
    } else if (mech.state === 'moving') {
      mech.state = 'idle';
    }

    if (keys.has(jumpKey) && mech.y >= CANVAS_HEIGHT - GROUND_HEIGHT - mech.height && mech.state !== 'attacking' && mech.state !== 'special_attack') {
      mech.velocityY = JUMP_FORCE;
      mech.state = 'jumping';
    }

    if (mech.y < CANVAS_HEIGHT - GROUND_HEIGHT - mech.height) {
      mech.velocityY += GRAVITY;
      mech.y += mech.velocityY;
      if (mech.y >= CANVAS_HEIGHT - GROUND_HEIGHT - mech.height) {
        mech.y = CANVAS_HEIGHT - GROUND_HEIGHT - mech.height;
        mech.velocityY = 0;
        if (mech.state === 'jumping') mech.state = 'idle';
      }
    }

    if (keys.has(defendKey) && mech.state !== 'attacking' && mech.state !== 'special_attack') {
      mech.state = 'defending';
    } else if (mech.state === 'defending' && !keys.has(defendKey)) {
      mech.state = 'idle';
    }

    if (keys.has(attackKey) && mech.attackCooldown === 0 && mech.state !== 'attacking' && mech.state !== 'special_attack' && mech.state !== 'defending') {
      mech.state = 'attacking';
      mech.animationFrame = 0;
      mech.attackCooldown = 30;

      const attackBox = {
        x: mech.facingRight ? mech.x + mech.width : mech.x - 20,
        y: mech.y + 10,
        width: 20,
        height: 20,
      };

      if (checkCollision(attackBox, otherMech) && otherMech.state !== 'dead') {
        const wasDefending = otherMech.state === 'defending';
        const damage = 10 + Math.floor(Math.random() * 6);
        const finalDamage = wasDefending ? Math.floor(damage / 2) : damage;
        otherMech.health -= finalDamage;
        otherMech.state = 'hit';
        otherMech.animationFrame = 0;
        createParticles(otherMech.x + otherMech.width / 2, otherMech.y + otherMech.height / 2, wasDefending ? '#6bcb77' : '#ff6b6b', 8);

        if (otherMech.health <= 0) {
          otherMech.health = 0;
          otherMech.state = 'dead';
        }
      }
    }

    if (keys.has(specialKey) && mech.specialCooldown === 0 && mech.state !== 'attacking' && mech.state !== 'special_attack' && mech.state !== 'defending') {
      mech.state = 'special_attack';
      mech.animationFrame = 0;
      mech.specialCooldown = 90;

      projectilesRef.current.push({
        x: mech.facingRight ? mech.x + mech.width : mech.x - 12,
        y: mech.y + 15,
        width: 12,
        height: 8,
        speed: 10,
        isSpecial: true,
        facingRight: mech.facingRight,
      });

      createParticles(mech.facingRight ? mech.x + mech.width : mech.x, mech.y + 20, '#ffd93d', 6);
    }

    mech.x = Math.max(0, Math.min(CANVAS_WIDTH - mech.width, mech.x));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (gameState !== 'playing') {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const mech1 = mech1Ref.current;
      const mech2 = mech2Ref.current;

      updateMech(mech1, keysRef.current, 'a', 'd', 'w', 'f', 'g', 's', mech2);
      updateMech(mech2, keysRef.current, 'arrowleft', 'arrowright', 'arrowup', '1', '2', 'arrowdown', mech1);

      projectilesRef.current = projectilesRef.current.filter(p => {
        p.x += p.facingRight ? p.speed : -p.speed;

        const hitMech = p.facingRight ? mech2 : mech1;
        if (checkCollision(p, hitMech) && hitMech.state !== 'dead') {
          const damage = p.isSpecial ? 20 + Math.floor(Math.random() * 6) : 8 + Math.floor(Math.random() * 4);
          const finalDamage = hitMech.state === 'defending' ? Math.floor(damage / 2) : damage;
          hitMech.health -= finalDamage;
          hitMech.state = 'hit';
          hitMech.animationFrame = 0;
          createParticles(p.x, p.y, p.isSpecial ? '#ffd93d' : '#ff6b6b', 12);

          if (hitMech.health <= 0) {
            hitMech.health = 0;
            hitMech.state = 'dead';
          }
          return false;
        }

        return p.x > -50 && p.x < CANVAS_WIDTH + 50;
      });

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        return p.life > 0;
      });

      if (mech1.state === 'dead') {
        setGameState('gameover');
        setWinner('玩家2');
      } else if (mech2.state === 'dead') {
        setGameState('gameover');
        setWinner('玩家1');
      }

      drawBackground(ctx);

      projectilesRef.current.forEach(p => {
        drawPixelRect(ctx, p.x, p.y, p.width, p.height, p.isSpecial ? '#ffd93d' : '#ff6b6b');
        drawPixelRect(ctx, p.x + 2, p.y + 2, p.width - 4, p.height - 4, '#fff');
      });

      particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        drawPixelRect(ctx, p.x, p.y, 4, 4, p.color);
        ctx.globalAlpha = 1;
      });

      drawMech(ctx, mech1);
      drawMech(ctx, mech2);

      drawHealthBar(ctx, mech1, '玩家1');
      drawHealthBar(ctx, mech2, '玩家2');

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, updateMech]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    mech1Ref.current = createMech(100, '#00d4ff', '#0099cc');
    mech2Ref.current = createMech(650, '#ff6b6b', '#cc5555');
    projectilesRef.current = [];
    particlesRef.current = [];
    setGameState('playing');
    setWinner('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-4 pixel-font">像素风机甲对战</h1>
      
      <div className="relative border-4 border-gray-700">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block bg-gray-900"
        />
        
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <h2 className="text-2xl font-bold text-white mb-4">准备战斗！</h2>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
            >
              开始游戏
            </button>
          </div>
        )}
        
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">{winner} 获胜！</h2>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
            >
              再来一局
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8 text-white">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-2">玩家1 (蓝色机甲)</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-400">A/D</span> - 左右移动</p>
            <p><span className="text-gray-400">W</span> - 跳跃</p>
            <p><span className="text-gray-400">F</span> - 普通攻击</p>
            <p><span className="text-gray-400">G</span> - 特殊攻击</p>
            <p><span className="text-gray-400">S</span> - 防御</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-red-400 mb-2">玩家2 (红色机甲)</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-400">←/→</span> - 左右移动</p>
            <p><span className="text-gray-400">↑</span> - 跳跃</p>
            <p><span className="text-gray-400">Num1</span> - 普通攻击</p>
            <p><span className="text-gray-400">Num2</span> - 特殊攻击</p>
            <p><span className="text-gray-400">↓</span> - 防御</p>
          </div>
        </div>
      </div>

      <style>{`
        .pixel-font {
          font-family: 'Courier New', monospace;
          text-shadow: 2px 2px 0 #000;
        }
      `}</style>
    </div>
  );
};
