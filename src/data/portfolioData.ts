import { Work, Skill } from '../types';

export const works: Work[] = [
  {
    id: 1,
    title: "电商平台设计",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    description: "为一家时尚品牌设计的现代化电商平台，注重用户体验和视觉设计。",
    tags: ["React", "Tailwind", "UI Design"]
  },
  {
    id: 2,
    title: "数据可视化仪表板",
    category: "Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    description: "企业级数据可视化仪表板，实时展示业务指标和分析数据。",
    tags: ["D3.js", "Vue", "Chart.js"]
  },
  {
    id: 3,
    title: "移动应用设计",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    description: "健身追踪应用的完整设计方案，包含从概念到原型的全过程。",
    tags: ["Figma", "Swift", "React Native"]
  },
  {
    id: 4,
    title: "品牌网站重设计",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
    description: "为创意机构进行的品牌视觉和网站重设计项目。",
    tags: ["Web Design", "Branding", "CSS"]
  },
  {
    id: 5,
    title: "3D 产品展示",
    category: "3D",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    description: "使用 Three.js 打造的沉浸式 3D 产品展示网页体验。",
    tags: ["Three.js", "WebGL", "3D"]
  },
  {
    id: 6,
    title: "社交媒体应用",
    category: "App",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    description: "现代化社交媒体应用的设计与开发，注重用户交互。",
    tags: ["React", "Node.js", "MongoDB"]
  }
];

export const skills: Skill[] = [
  { name: "React", level: 95, color: "#61DAFB" },
  { name: "TypeScript", level: 90, color: "#3178C6" },
  { name: "UI/UX Design", level: 88, color: "#FF6B6B" },
  { name: "Three.js", level: 75, color: "#000000" },
  { name: "Node.js", level: 82, color: "#339933" },
  { name: "Tailwind CSS", level: 95, color: "#06B6D4" }
];