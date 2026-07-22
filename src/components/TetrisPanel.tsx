import { Pause, Play, RotateCcw, Zap } from "lucide-react";

interface TetrisPanelProps {
  score: number;
  lines: number;
  level: number;
  status: "idle" | "running" | "paused" | "gameover";
  nextShape: number[][];
  onStart: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
}

function MiniPreview({ shape }: { shape: number[][] }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-white/10 bg-slate-900/80 p-3">
      {shape.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-1">
          {Array.from({ length: 4 }, (_, columnIndex) => {
            const value = row[columnIndex] ?? 0;

            return (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className={`h-4 rounded-[4px] border border-white/5 ${
                  value === 0 ? "bg-slate-950/70" : "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.75)]"
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-4">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
      <p className="mt-3 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

export function TetrisPanel({
  score,
  lines,
  level,
  status,
  nextShape,
  onStart,
  onTogglePause,
  onRestart,
}: TetrisPanelProps) {
  const isRunning = status === "running";
  const pauseLabel = status === "paused" ? "继续" : "暂停";
  const PauseIcon = status === "paused" ? Play : Pause;

  return (
    <aside className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="分数" value={score} />
        <StatCard label="行数" value={lines} />
        <StatCard label="等级" value={level} />
      </div>

      <div className="rounded-[28px] border border-fuchsia-400/25 bg-slate-950/75 p-5 shadow-[0_0_32px_rgba(217,70,239,0.12)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-300/75">Next Piece</p>
            <h3 className="mt-2 text-lg font-semibold text-white">下一个方块</h3>
          </div>
          <Zap className="h-5 w-5 text-yellow-300" />
        </div>
        <div className="mt-4">
          <MiniPreview shape={nextShape} />
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-950/75 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Controls</p>
        <div className="mt-4 grid gap-3 text-sm text-slate-200">
          <p>← →：左右移动</p>
          <p>↑：旋转方块</p>
          <p>↓：加速下落</p>
          <p>空格：硬降到底</p>
          <p>P：暂停或继续</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-400/15 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/25"
        >
          <Play className="h-4 w-4" />
          开始
        </button>
        <button
          type="button"
          onClick={onTogglePause}
          disabled={!isRunning && status !== "paused"}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PauseIcon className="h-4 w-4" />
          {pauseLabel}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
        >
          <RotateCcw className="h-4 w-4" />
          重开
        </button>
      </div>
    </aside>
  );
}
