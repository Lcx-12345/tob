import React from "react";

interface ToolCardProps {
  name: string;
  category: string;
  description: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ name, category, description }) => {
  return (
    <div className="tool-card">
      <h3>{name}</h3>
      <span className="category">{category}</span>
      <p>{description}</p>
    </div>
  );
};

const App: React.FC = () => {
  const tools = [
    { name: "Write", category: "文件操作", description: "写入文件到本地文件系统" },
    { name: "Read", category: "文件操作", description: "读取本地文件" },
    { name: "RunCommand", category: "命令执行", description: "执行终端命令" },
  ];

  return (
    <div className="app">
      <h1>工具演示 - TSX格式</h1>
      {tools.map((tool) => (
        <ToolCard key={tool.name} {...tool} />
      ))}
    </div>
  );
};

export default App;
