import os
import platform
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, Table


def register_cjk_font():
    system = platform.system()
    if system == "Darwin":
        font_paths = ["/System/Library/Fonts/PingFang.ttc"]
    elif system == "Windows":
        font_paths = ["C:/Windows/Fonts/msyh.ttc"]
    else:
        font_paths = [
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
            "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
        ]
    for p in font_paths:
        if os.path.exists(p):
            pdfmetrics.registerFont(TTFont("CJKFont", p, subfontIndex=0))
            return "CJKFont"
    return "Helvetica"


cjk = register_cjk_font()
PRIMARY = HexColor("#1a365d")
ACCENT = HexColor("#2b6cb0")

styles = {
    "title": ParagraphStyle("T", fontName=cjk, fontSize=26, leading=32, textColor=PRIMARY, alignment=1, spaceAfter=16, wordWrap="CJK"),
    "subtitle": ParagraphStyle("S", fontName=cjk, fontSize=13, leading=18, textColor=HexColor("#4a5568"), alignment=1, spaceAfter=24, wordWrap="CJK"),
    "h1": ParagraphStyle("H1", fontName=cjk, fontSize=18, leading=24, textColor=PRIMARY, spaceBefore=20, spaceAfter=10, wordWrap="CJK"),
    "body": ParagraphStyle("B", fontName=cjk, fontSize=11, leading=18, textColor=HexColor("#2d3748"), spaceAfter=8, wordWrap="CJK"),
}

data = [
    ["工具", "类别", "用途"],
    ["Write / Read / Edit / DeleteFile", "文件操作", "创建、读取、编辑、删除文件"],
    ["Glob / Grep", "搜索", "文件名模式匹配与内容正则查找"],
    ["Skill（docx / xlsx / pptx / pdf）", "办公文档", "生成四大办公格式文件"],
    ["RunCommand", "终端", "执行命令、安装依赖、运行脚本"],
    ["WebSearch / WebFetch", "联网", "搜索与抓取网页内容"],
    ["GenerateImage", "图像", "文生图，输出 png/jpg"],
    ["Agent", "子代理", "并行探索与复杂任务委派"],
]
table = Table(data, colWidths=[2.6 * inch, 1.1 * inch, 2.7 * inch])
table.setStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
    ("TEXTCOLOR", (0, 0), (-1, 0), HexColor("#ffffff")),
    ("FONTNAME", (0, 0), (-1, -1), cjk),
    ("FONTSIZE", (0, 0), (-1, 0), 11),
    ("FONTSIZE", (0, 1), (-1, -1), 10),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [HexColor("#f7fafc"), HexColor("#ffffff")]),
    ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#e2e8f0")),
])

story = [
    Spacer(1, 1.6 * inch),
    Paragraph("内置工具与文件格式演示报告", styles["title"]),
    Paragraph("本 PDF 由 pdf 技能（reportlab）自动生成 · 2026-11-07", styles["subtitle"]),
    PageBreak(),
    Paragraph("一、工具总览", styles["h1"]),
    Paragraph("下表汇总了本次演示中调用的全部内置工具及其能力：", styles["body"]),
    Spacer(1, 8),
    KeepTogether([table]),
    Spacer(1, 16),
    Paragraph("二、支持的文件格式", styles["h1"]),
    Paragraph("<b>代码与文本</b>：.py .js .ts .html .css .json .csv .yaml .md .txt .xml .sql .sh 等，由 Write 工具直接生成。", styles["body"]),
    Paragraph("<b>办公文档</b>：.docx（Word）、.xlsx（Excel，含公式与格式）、.pptx（幻灯片）、.pdf（本文档）。", styles["body"]),
    Paragraph("<b>图像</b>：.png / .jpg，由 GenerateImage 文生图工具按文字描述生成，支持多种尺寸比例。", styles["body"]),
]

doc = SimpleDocTemplate(
    "/workspace/toolbox-demo/演示报告.pdf", pagesize=A4,
    leftMargin=0.75 * inch, rightMargin=0.75 * inch, topMargin=0.75 * inch, bottomMargin=0.75 * inch,
)
doc.build(story)
print("PDF generated, font:", cjk)
