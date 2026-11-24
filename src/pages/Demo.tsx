import { useState } from "react";

const features = [
  { title: "实时预览", desc: "代码保存后 Vite 热更新，页面即时刷新", icon: "⚡" },
  { title: "组件化开发", desc: "React + TypeScript + Tailwind 现代技术栈", icon: "🧩" },
  { title: "交互演示", desc: "点击下方按钮验证页面事件是否正常", icon: "🖱️" },
];

export default function Demo() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <div className="text-center text-white mb-10">
          <span className="inline-block text-xs tracking-widest uppercase bg-white/20 rounded-full px-4 py-1 mb-5">
            Web Preview Demo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">你好，这是一个演示页面 👋</h1>
          <p className="text-white/80 text-lg">
            用于展示 Web 预览工具的调用与渲染效果
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-white hover:bg-white/20 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-gray-500 text-sm mb-2">你已点击按钮</p>
          <p className="text-6xl font-bold text-indigo-600 mb-6">{count}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setCount((c) => c + 1)}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition"
            >
              点我 +1
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 active:scale-95 transition"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
