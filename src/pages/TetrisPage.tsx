import { useEffect } from "react";
import { Bot, FileCheck2, LockKeyhole, MessageSquareQuote, Sparkles } from "lucide-react";
import { TetrisBoard } from "@/components/TetrisBoard";
import { TetrisPanel } from "@/components/TetrisPanel";
import { useTetrisGame } from "@/hooks/useTetrisGame";

const checkpointCards = [
  {
    title: "需求澄清",
    description: "通过提问把模糊需求补齐，例如确认风格、规则或交互优先级。",
    icon: MessageSquareQuote,
  },
  {
    title: "文档审核",
    description: "先生成 PRD 与技术方案，再由人工确认后进入实现。",
    icon: FileCheck2,
  },
  {
    title: "授权申请",
    description: "涉及外部服务、插件或缺少权限时，先申请授权再继续执行。",
    icon: LockKeyhole,
  },
  {
    title: "高风险审批",
    description: "执行破坏性命令或敏感操作前，必须先经过人工批准。",
    icon: Bot,
  },
];

export default function TetrisPage() {
  const {
    board,
    nextShape,
    score,
    lines,
    level,
    status,
    startGame,
    restartGame,
    togglePause,
    moveLeft,
    moveRight,
    softDrop,
    rotate,
    hardDrop,
  } = useTetrisGame();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveLeft();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveRight();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        softDrop();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        rotate();
      }

      if (event.code === "Space") {
        event.preventDefault();
        hardDrop();
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hardDrop, moveLeft, moveRight, rotate, softDrop, togglePause]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.15),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-100/85">
              <Sparkles className="h-4 w-4" />
              人工卡点能力演示
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl uppercase tracking-[0.08em] text-white sm:text-6xl">
              Tetris
              <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-200 bg-clip-text text-transparent">
                Arcade Gate
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              这个页面一边跑经典俄罗斯方块，一边把我支持的人工卡点放进真实工作流里做演示。
              这次已经实际走通了“文档审核”卡点；其余卡点会在需要时触发，不会为了演示而伪造授权或审批。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {checkpointCards.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-cyan-300/35 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 p-3">
                      <Icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-950/35 p-4 shadow-[0_0_60px_rgba(14,165,233,0.12)] backdrop-blur-sm">
            <TetrisPanel
              score={score}
              lines={lines}
              level={level}
              status={status}
              nextShape={nextShape}
              onStart={startGame}
              onTogglePause={togglePause}
              onRestart={restartGame}
            />
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <TetrisBoard board={board} status={status} />

          <div className="space-y-4">
            <div className="rounded-[28px] border border-yellow-300/20 bg-yellow-300/10 p-5 text-sm leading-6 text-yellow-50">
              <p className="text-xs uppercase tracking-[0.35em] text-yellow-100/70">Checkpoint Notes</p>
              <p className="mt-3">
                你问到“支持哪些人工卡点”，我当前可支持的核心类型包括：需求澄清、文档审核、外部授权申请、风险操作审批。
              </p>
              <p className="mt-3">
                其中“文档审核”已经在这次任务中真实触发；“授权申请”和“风险审批”只会在确实需要调用外部服务或执行高风险命令时触发。
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-200">
              <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/75">Play Tips</p>
              <ul className="mt-3 space-y-3 text-slate-300">
                <li>开始后先用方向键熟悉移动和旋转，等级越高下落越快。</li>
                <li>空格会直接硬降到底，适合快速刷分。</li>
                <li>若想重新演示流程，可以直接点“重开”。</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
