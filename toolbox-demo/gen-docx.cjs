const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType } = require('docx');

const cjkFont = { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei" };
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, width, isHeader) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: isHeader ? { fill: "D5E8F0", type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: !!isHeader })] })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: cjkFont, size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: cjkFont },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0, keepNext: false, keepLines: false } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: cjkFont },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1, keepNext: false, keepLines: false } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("内置工具演示报告")] }),
      new Paragraph({ children: [new TextRun("本文档由 docx 技能自动生成，用于演示 Word 文档创建能力。生成日期：2026-11-07。")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("一、支持的内置工具")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("文件操作：Write、Read、Edit、DeleteFile")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("搜索：Glob（文件名模式）、Grep（内容正则）")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("办公文档：docx、xlsx、pptx、pdf")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("扩展：RunCommand、WebSearch、GenerateImage、Agent")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("二、工具能力一览表")] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [3000, 3000, 3026],
        rows: [
          new TableRow({ cantSplit: true, children: [
            cell("工具", 3000, true), cell("类型", 3000, true), cell("用途", 3026, true)
          ]}),
          new TableRow({ cantSplit: true, children: [
            cell("Write", 3000), cell("文件创建", 3000), cell("生成代码与文本文件", 3026)
          ]}),
          new TableRow({ cantSplit: true, children: [
            cell("Edit", 3000), cell("文件编辑", 3000), cell("精确字符串替换", 3026)
          ]}),
          new TableRow({ cantSplit: true, children: [
            cell("Grep", 3000), cell("内容搜索", 3000), cell("正则表达式匹配", 3026)
          ]}),
          new TableRow({ cantSplit: true, children: [
            cell("Skill", 3000), cell("技能系统", 3000), cell("加载办公文档能力", 3026)
          ]}),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("三、总结")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("基础文件工具支持所有文本类格式")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Office 插件支持四大办公格式")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("延迟工具覆盖命令执行与图像生成")] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/workspace/toolbox-demo/演示文档.docx", buffer);
  console.log("DOCX generated successfully");
});
