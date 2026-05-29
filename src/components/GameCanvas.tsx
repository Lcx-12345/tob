import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useGameStore((s) => s.snake);
  const food = useGameStore((s) => s.food);
  const cellSize = useGameStore((s) => s.cellSize);
  const canvasSize = useGameStore((s) => s.canvasSize);
  const gridSize = useGameStore((s) => s.gridSize);
  const particles = useGameStore((s) => s.particles);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    const pulsePhase = Date.now() / 300;
    const pulseScale = 0.8 + Math.sin(pulsePhase) * 0.2;
    const foodCenterX = food.x * cellSize + cellSize / 2;
    const foodCenterY = food.y * cellSize + cellSize / 2;
    const foodRadius = (cellSize / 2 - 2) * pulseScale;

    const foodGlow = ctx.createRadialGradient(
      foodCenterX, foodCenterY, 0,
      foodCenterX, foodCenterY, cellSize
    );
    foodGlow.addColorStop(0, 'rgba(255, 45, 117, 0.3)');
    foodGlow.addColorStop(1, 'rgba(255, 45, 117, 0)');
    ctx.fillStyle = foodGlow;
    ctx.fillRect(
      food.x * cellSize - cellSize / 2,
      food.y * cellSize - cellSize / 2,
      cellSize * 2,
      cellSize * 2
    );

    ctx.fillStyle = '#ff2d75';
    ctx.shadowColor = '#ff2d75';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const padding = 1;

      const ratio = index / snake.length;
      const r = Math.round(57 + ratio * 0);
      const g = Math.round(255 - ratio * 80);
      const b = Math.round(20 + ratio * 10);
      const color = `rgb(${r}, ${g}, ${b})`;

      if (index === 0) {
        ctx.shadowColor = '#39ff14';
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowColor = '#39ff14';
        ctx.shadowBlur = 6 * (1 - ratio);
      }

      ctx.fillStyle = color;
      const radius = index === 0 ? 4 : 3;
      const sx = x + padding;
      const sy = y + padding;
      const sw = cellSize - padding * 2;
      const sh = cellSize - padding * 2;

      ctx.beginPath();
      ctx.moveTo(sx + radius, sy);
      ctx.lineTo(sx + sw - radius, sy);
      ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + radius);
      ctx.lineTo(sx + sw, sy + sh - radius);
      ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw - radius, sy + sh);
      ctx.lineTo(sx + radius, sy + sh);
      ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh - radius);
      ctx.lineTo(sx, sy + radius);
      ctx.quadraticCurveTo(sx, sy, sx + radius, sy);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;

      if (index === 0) {
        ctx.fillStyle = '#0a0a0a';
        const eyeSize = 3;
        const eyeOffset = cellSize * 0.25;
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;

        const direction = useGameStore.getState().direction;
        let e1x: number, e1y: number, e2x: number, e2y: number;

        switch (direction) {
          case 'RIGHT':
            e1x = cx + eyeOffset; e1y = cy - eyeOffset;
            e2x = cx + eyeOffset; e2y = cy + eyeOffset;
            break;
          case 'LEFT':
            e1x = cx - eyeOffset; e1y = cy - eyeOffset;
            e2x = cx - eyeOffset; e2y = cy + eyeOffset;
            break;
          case 'UP':
            e1x = cx - eyeOffset; e1y = cy - eyeOffset;
            e2x = cx + eyeOffset; e2y = cy - eyeOffset;
            break;
          case 'DOWN':
            e1x = cx - eyeOffset; e1y = cy + eyeOffset;
            e2x = cx + eyeOffset; e2y = cy + eyeOffset;
            break;
        }

        ctx.beginPath();
        ctx.arc(e1x, e1y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e2x, e2y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (status === 'GAME_OVER') {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.6)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="rounded-lg border-2 border-[#1a1a2e] shadow-[0_0_30px_rgba(57,255,20,0.15)]"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
