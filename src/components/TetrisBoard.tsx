import { BOARD_HEIGHT, BOARD_WIDTH, Board } from "@/utils/tetris";

interface TetrisBoardProps {
  board: Board;
  status: "idle" | "running" | "paused" | "gameover";
}

const cellClassNames = [
  "bg-slate-950/70",
  "bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.75)]",
  "bg-yellow-300 shadow-[0_0_16px_rgba(253,224,71,0.75)]",
  "bg-fuchsia-500 shadow-[0_0_16px_rgba(217,70,239,0.75)]",
  "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.75)]",
  "bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.75)]",
  "bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.75)]",
  "bg-orange-400 shadow-[0_0_16px_rgba(251,146,60,0.75)]",
];

const statusText = {
  idle: "按开始按钮进入演示",
  running: "游戏进行中",
  paused: "游戏已暂停",
  gameover: "游戏结束，点击重新开始",
};

export function TetrisBoard({ board, status }: TetrisBoardProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/30 bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.3),rgba(2,6,23,0.92))]" />
      <div
        className="relative grid gap-1 rounded-2xl border border-white/10 bg-slate-900/80 p-3"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
        }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`aspect-square rounded-[6px] border border-white/5 transition-colors duration-75 ${cellClassNames[cell]}`}
            />
          )),
        )}
      </div>

      {status !== "running" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 backdrop-blur-[2px]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 text-center shadow-2xl">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/75">Arcade Status</p>
            <p className="mt-2 text-sm text-slate-100">{statusText[status]}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
