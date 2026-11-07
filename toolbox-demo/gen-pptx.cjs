const fs = require("fs");
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
const SLIDE_W = 10, SLIDE_H = 5.625;
const MARGIN = 0.5;
const CONTENT_X = MARGIN, CONTENT_Y = MARGIN;
const CONTENT_W = SLIDE_W - 2 * MARGIN;
const CONTENT_H = SLIDE_H - 2 * MARGIN;

const C = { primary: "065A82", secondary: "1C7293", accent: "21295C", light: "E8F4F8", white: "FFFFFF" };
const FONT_TITLE = "Noto Serif CJK SC";
const FONT_BODY = "Microsoft YaHei";

// Container system
function createVirtualNode(type, data, parentX = 0, parentY = 0) {
  const opts = data.opts || {};
  const node = { type, data, absX: parentX + (opts.x || 0), absY: parentY + (opts.y || 0), children: [] };
  node.addShape = function(shapeType, opts = {}) {
    const child = createVirtualNode("shape", { shapeType, opts }, node.absX, node.absY);
    node.children.push(child); return child;
  };
  node.addText = function(text, opts = {}) {
    const safeOpts = { fit: "shrink", ...opts };
    const child = createVirtualNode("text", { text, opts: safeOpts }, node.absX, node.absY);
    node.children.push(child); return child;
  };
  return node;
}
function flattenNode(node, realSlide) {
  const absOpts = { ...node.data.opts, x: node.absX, y: node.absY };
  if (node.type === "shape") realSlide.addShape(node.data.shapeType, absOpts);
  else if (node.type === "text") realSlide.addText(node.data.text, absOpts);
  node.children.forEach(c => flattenNode(c, realSlide));
}
const originalAddSlide = pres.addSlide.bind(pres);
pres.addSlide = function(options) {
  const realSlide = originalAddSlide(options);
  const virtualSlide = {
    children: [], _realSlide: realSlide,
    set background(val) { realSlide.background = val; },
    addShape: function(shapeType, opts = {}) {
      const node = createVirtualNode("shape", { shapeType, opts });
      this.children.push(node); return node;
    },
    addText: function(text, opts = {}) {
      const node = createVirtualNode("text", { text, opts: { fit: "shrink", ...opts } });
      this.children.push(node); return node;
    },
    addChart: function(t, d, o) { realSlide.addChart(t, d, o); },
    render: function() { this.children.forEach(c => flattenNode(c, realSlide)); }
  };
  return virtualSlide;
};

// Slide 1: 封面
let s1 = pres.addSlide();
s1.background = { color: C.accent };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: C.accent } });
s1.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 0.18, h: 2.6, fill: { color: C.secondary } });
s1.addText("内置工具与文件格式演示", { x: 0.9, y: 1.1, w: 8.2, h: 1.1, fontSize: 40, bold: true, color: C.white, fontFace: FONT_TITLE, charSpacing: 2.5 });
s1.addText("工具调用效果 · 支持格式 · 使用指南", { x: 0.9, y: 2.3, w: 8.2, h: 0.6, fontSize: 20, color: C.light, fontFace: FONT_BODY });
s1.addText("2026-11-07 · GLM-5.3 生成", { x: 0.9, y: 3.3, w: 8.2, h: 0.4, fontSize: 13, color: "9FB3C8", fontFace: FONT_BODY });
s1.render();

// Slide 2: 目录
let s2 = pres.addSlide();
s2.addText("目录", { x: CONTENT_X, y: CONTENT_Y, w: CONTENT_W, h: 0.7, fontSize: 30, bold: true, color: C.accent, fontFace: FONT_TITLE });
const tocItems = ["01 工具概览 — 六大基础工具与技能系统", "02 文件格式 — 代码文本与 Office 办公文档", "03 演示效果 — 实际生成的文件清单"];
tocItems.forEach((item, i) => {
  let card = s2.addShape(pres.shapes.RECTANGLE, { x: CONTENT_X, y: 1.5 + i * 1.15, w: CONTENT_W, h: 0.95, fill: { color: C.light } });
  card.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 0.95, fill: { color: C.primary } });
  card.addText(item, { x: 0.35, y: 0.1, w: 8, h: 0.75, fontSize: 17, color: C.accent, fontFace: FONT_BODY, valign: "middle" });
});
s2.render();

// Slide 3: 工具概览
let s3 = pres.addSlide();
s3.addText("工具概览", { x: CONTENT_X, y: CONTENT_Y, w: CONTENT_W, h: 0.7, fontSize: 30, bold: true, color: C.accent, fontFace: FONT_TITLE });
const tools = [
  ["文件操作", "Write / Read / Edit / DeleteFile", "创建、读取、编辑、删除文件"],
  ["搜索", "Glob / Grep", "文件名模式匹配 · 内容正则查找"],
  ["技能系统", "Skill", "加载 docx / xlsx / pptx / pdf 能力"],
  ["命令执行", "RunCommand", "终端命令、构建、依赖安装"],
  ["子代理", "Agent", "并行探索与复杂任务委派"],
  ["扩展能力", "WebSearch / GenerateImage", "联网搜索 · AI 图像生成"]
];
const cardW = (CONTENT_W - 0.4) / 2, cardH = 1.15;
tools.forEach((t, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  let card = s3.addShape(pres.shapes.RECTANGLE, { x: CONTENT_X + col * (cardW + 0.4), y: 1.45 + row * (cardH + 0.25), w: cardW, h: cardH, fill: { color: C.light } });
  card.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: cardH, fill: { color: C.secondary } });
  card.addText(t[0], { x: 0.3, y: 0.08, w: cardW - 0.5, h: 0.35, fontSize: 15, bold: true, color: C.primary, fontFace: FONT_BODY });
  card.addText(t[1], { x: 0.3, y: 0.42, w: cardW - 0.5, h: 0.32, fontSize: 12.5, color: C.accent, fontFace: FONT_BODY });
  card.addText(t[2], { x: 0.3, y: 0.74, w: cardW - 0.5, h: 0.32, fontSize: 11, color: "5A6B7A", fontFace: FONT_BODY });
});
s3.render();

// Slide 4: 文件格式
let s4 = pres.addSlide();
s4.addText("文件格式", { x: CONTENT_X, y: CONTENT_Y, w: CONTENT_W, h: 0.7, fontSize: 30, bold: true, color: C.accent, fontFace: FONT_TITLE });
let fmtCard = s4.addShape(pres.shapes.RECTANGLE, { x: CONTENT_X, y: 1.45, w: (CONTENT_W - 0.4) / 2, h: 1.75, fill: { color: C.light } });
fmtCard.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 1.75, fill: { color: C.primary } });
fmtCard.addText("代码与文本（Write 工具）", { x: 0.3, y: 0.1, w: 3.9, h: 0.35, fontSize: 15, bold: true, color: C.primary, fontFace: FONT_BODY });
fmtCard.addText(".py .js .ts .html .css\n.json .csv .yaml .md .txt\n.xml .sql .sh …", { x: 0.3, y: 0.5, w: 3.9, h: 1.1, fontSize: 13, color: C.accent, fontFace: FONT_BODY, lineSpacingMultiple: 1.3 });
let fmtCard2 = s4.addShape(pres.shapes.RECTANGLE, { x: CONTENT_X + (CONTENT_W - 0.4) / 2 + 0.4, y: 1.45, w: (CONTENT_W - 0.4) / 2, h: 1.75, fill: { color: C.light } });
fmtCard2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 1.75, fill: { color: C.secondary } });
fmtCard2.addText("办公文档（Office 插件）", { x: 0.3, y: 0.1, w: 3.9, h: 0.35, fontSize: 15, bold: true, color: C.primary, fontFace: FONT_BODY });
fmtCard2.addText(".docx Word 文档\n.xlsx Excel 表格\n.pptx 幻灯片 · .pdf 文档", { x: 0.3, y: 0.5, w: 3.9, h: 1.1, fontSize: 13, color: C.accent, fontFace: FONT_BODY, lineSpacingMultiple: 1.3 });
let imgCard = s4.addShape(pres.shapes.RECTANGLE, { x: CONTENT_X, y: 3.45, w: CONTENT_W, h: 1.25, fill: { color: C.accent } });
imgCard.addText("图像生成（GenerateImage）: .png / .jpg — 文生图，支持多种尺寸与比例", { x: 0.35, y: 0.15, w: 8.3, h: 0.9, fontSize: 15, color: C.white, fontFace: FONT_BODY, valign: "middle" });
s4.render();

// Slide 5: 结尾
let s5 = pres.addSlide();
s5.background = { color: C.accent };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: C.accent } });
s5.addText("演示完毕", { x: 0.9, y: 1.9, w: 8.2, h: 1.0, fontSize: 44, bold: true, color: C.white, fontFace: FONT_TITLE, charSpacing: 2.5 });
s5.addText("所有文件保存在 /workspace/toolbox-demo 目录，可直接打开查看", { x: 0.9, y: 3.0, w: 8.2, h: 0.6, fontSize: 16, color: C.light, fontFace: FONT_BODY });
s5.render();

pres.writeFile({ fileName: "/workspace/toolbox-demo/演示幻灯片.pptx" }).then(() => console.log("PPTX generated"));
