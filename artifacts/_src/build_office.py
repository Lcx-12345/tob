# -*- coding: utf-8 -*-
"""生成 docx / xlsx / pptx 三类产物（同一主题：AI Agent 2026 趋势观察）"""
import os
from PIL import Image

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.utils import get_column_letter

from pptx import Presentation
from pptx.util import Inches, Pt as PPt
from pptx.dml.color import RGBColor as PRGB
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

BASE = "/workspace/artifacts"
ASSETS = os.path.join(BASE, "assets")
os.makedirs(ASSETS, exist_ok=True)

TITLE = "AI Agent 2026：从助手到同事"
SUB = "趋势观察报告 · 示意数据版"
NOTE = "说明：本报告中的数值为演示用示意数据，不代表任何机构的真实统计口径。"

MARKET = [
    ("2022", 12, None, 0.03),
    ("2023", 27, 1.25, 0.08),
    ("2024", 58, 1.15, 0.17),
    ("2025", 112, 0.93, 0.31),
    ("2026E", 198, 0.77, 0.46),
]

SCENES = [
    ("智能客服", "多轮工单处理与升级", 4, 38, 12.5, "4.2/5"),
    ("研发协同", "需求拆解、用例生成、代码评审", 6, 26, 8.0, "4.5/5"),
    ("数据分析", "自然语言取数与归因", 3, 31, 6.4, "3.9/5"),
    ("流程审批", "单据校验与合规预审", 5, 44, 9.1, "4.0/5"),
    ("销售支持", "客户线索评分与话术生成", 4, 22, 5.6, "3.7/5"),
]

RISKS = [
    ("智能体越权执行", 3, 5, "最小权限 + 人工二次确认"),
    ("幻觉导致错误决策", 4, 4, "关键结论强制引用来源"),
    ("数据外泄", 3, 5, "数据分级与脱敏网关"),
    ("责任归属不清", 4, 3, "为每个智能体指定责任人"),
]

JUDGEMENTS = [
    ("判断一", "交付单位从「功能」变成「结果」",
     "企业采购的衡量口径正在从席位数量转向可交付的业务结果，按结果计价的合同占比明显上升。"),
    ("判断二", "多智能体协作成为主流工程范式",
     "单一大模型调用难以覆盖长链路任务，规划者 + 执行者 + 校验者的编排模式成为默认架构。"),
    ("判断三", "治理能力决定落地上限",
     "权限、审计与可回滚能力，比模型本身的分数更直接影响智能体能否进入生产环境。"),
]


# ---------------------------------------------------------------- 图片处理
def clean_cover():
    src = os.path.join(ASSETS, "cover.jpg")
    dst = os.path.join(ASSETS, "cover_clean.png")
    im = Image.open(src).convert("RGB")
    w, h = im.size
    im = im.crop((0, 0, w - int(w * 0.012), h - int(h * 0.035)))
    im.save(dst, quality=95)
    return dst


# ---------------------------------------------------------------- DOCX
def build_docx(cover):
    doc = Document()

    st = doc.styles["Normal"]
    st.font.name = "Noto Sans CJK SC"
    st.font.size = Pt(10.5)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")

    sec = doc.sections[0]
    sec.top_margin = Cm(2.2)
    sec.bottom_margin = Cm(2.2)
    sec.left_margin = Cm(2.6)
    sec.right_margin = Cm(2.6)

    # 封面
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(cover, width=Cm(16))

    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = t.add_run(TITLE)
    r.font.size = Pt(26)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0B, 0x10, 0x20)

    s = doc.add_paragraph()
    s.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rs = s.add_run(SUB + "\n2026 年 11 月")
    rs.font.size = Pt(11)
    rs.font.color.rgb = RGBColor(0x60, 0x6B, 0x7A)

    doc.add_paragraph()

    def h(text, level=1):
        hd = doc.add_heading(level=level)
        run = hd.add_run(text)
        run.font.name = "Noto Sans CJK SC"
        run.element.rPr.rFonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")
        run.font.color.rgb = RGBColor(0x0B, 0x10, 0x20)
        run.font.size = Pt(16 if level == 1 else 13)
        run.font.bold = True
        return hd

    def para(text, size=10.5, color=None, space_after=6):
        pp = doc.add_paragraph()
        rr = pp.add_run(text)
        rr.font.size = Pt(size)
        if color:
            rr.font.color.rgb = color
        pp.paragraph_format.space_after = Pt(space_after)
        pp.paragraph_format.line_spacing = 1.6
        return pp

    h("一、摘要")
    para("过去十二个月，智能体（Agent）从演示走向生产。变化不在于模型更聪明，而在于工程侧补齐了三件事：任务编排、工具调用权限、以及可观测的执行轨迹。"
         "当这三件事具备之后，智能体开始承接端到端的业务结果，而不再只是一个更会聊天的入口。")
    para("本报告给出三个判断、一组示意数据与一份风险清单，供团队在立项评审时作为讨论框架使用。")

    h("二、三个核心判断")
    for tag, name, desc in JUDGEMENTS:
        h(f"{tag}｜{name}", level=2)
        para(desc)

    h("三、市场与渗透（示意数据）")
    tbl = doc.add_table(rows=1, cols=4)
    tbl.style = "Light Grid Accent 1"
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    heads = ["年份", "市场规模（亿美元）", "同比增长", "企业渗透率"]
    for i, htext in enumerate(heads):
        cell = tbl.rows[0].cells[i]
        cell.text = htext
        for r0 in cell.paragraphs[0].runs:
            r0.font.bold = True
            r0.font.size = Pt(9.5)
    for year, size, yoy, pen in MARKET:
        row = tbl.add_row().cells
        vals = [year, str(size),
                "—" if yoy is None else f"{yoy*100:.0f}%",
                f"{pen*100:.0f}%"]
        for i, v in enumerate(vals):
            row[i].text = v
            for r0 in row[i].paragraphs[0].runs:
                r0.font.size = Pt(9.5)
    doc.add_paragraph()
    para(NOTE, size=8.5, color=RGBColor(0x88, 0x8F, 0x9A))

    h("四、场景与投入产出")
    para("下列场景按「任务链路是否闭环」排序：链路越闭环，越适合交给智能体端到端执行。")
    t2 = doc.add_table(rows=1, cols=5)
    t2.style = "Light Grid Accent 1"
    for i, htext in enumerate(["场景", "典型任务", "周期（周）", "成本下降", "满意度"]):
        c = t2.rows[0].cells[i]
        c.text = htext
        for r0 in c.paragraphs[0].runs:
            r0.font.bold = True
            r0.font.size = Pt(9.5)
    for sc in SCENES:
        row = t2.add_row().cells
        for i, v in enumerate([sc[0], sc[1], str(sc[2]), f"{sc[3]}%", sc[5]]):
            row[i].text = v
            for r0 in row[i].paragraphs[0].runs:
                r0.font.size = Pt(9.5)
    doc.add_paragraph()
    para(NOTE, size=8.5, color=RGBColor(0x88, 0x8F, 0x9A))

    h("五、风险与治理")
    for name, p_, i_, action in RISKS:
        para(f"· {name}（可能性 {p_} / 影响 {i_}）：{action}")

    h("六、行动建议")
    para("1. 选一个链路闭环、失败成本可控的场景做首例，不要从最复杂的流程开始。")
    para("2. 在立项时就确定责任人、权限边界与回滚方案，治理不是上线后的补丁。")
    para("3. 用「单位结果成本」而不是「调用量」评估成效，避免指标虚高。")
    para("4. 保留人工确认节点，把智能体放在建议位而不是执行位，逐步放权。")

    h("七、结语")
    para("智能体的价值不在于替代人，而在于把人从流程的搬运中释放出来。2026 年的分水岭，是团队是否愿意重新划分「谁对结果负责」。")

    out = os.path.join(BASE, "AI_Agent_2026_趋势报告.docx")
    doc.save(out)
    return out


# ---------------------------------------------------------------- XLSX
def build_xlsx():
    wb = Workbook()
    dark = "0B1020"
    accent = "35E0FF"

    ws = wb.active
    ws.title = "市场规模"
    ws.append(["年份", "全球市场规模（亿美元）", "同比增长", "企业渗透率"])
    for year, size, yoy, pen in MARKET:
        ws.append([year, size, yoy, pen])

    header_fill = PatternFill("solid", fgColor=dark)
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF", size=11)
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
    for col, w in zip("ABCD", [12, 24, 12, 14]):
        ws.column_dimensions[col].width = w
    for row in range(2, 7):
        ws[f"C{row}"].number_format = "0.0%"
        ws[f"D{row}"].number_format = "0%"
        for col in "ABCD":
            ws[f"{col}{row}"].alignment = Alignment(horizontal="center")
    ws.freeze_panes = "A2"

    ch = BarChart()
    ch.title = "全球智能体市场规模（亿美元）"
    ch.y_axis.title = "亿美元"
    data = Reference(ws, min_col=2, min_row=1, max_row=6)
    cats = Reference(ws, min_col=1, min_row=2, max_row=6)
    ch.add_data(data, titles_from_data=True)
    ch.set_categories(cats)
    ch.height, ch.width = 8, 16
    ws.add_chart(ch, "F2")

    ws2 = wb.create_sheet("场景ROI")
    ws2.append(["场景", "典型任务", "部署周期（周）", "成本下降", "人力节省（FTE）", "满意度"])
    for sc in SCENES:
        ws2.append([sc[0], sc[1], sc[2], sc[3], sc[4], sc[5]])
    for c in ws2[1]:
        c.font = Font(bold=True, color="FFFFFF", size=11)
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
    for col, w in zip("ABCDEF", [12, 30, 16, 12, 18, 10]):
        ws2.column_dimensions[col].width = w
    for row in range(2, 7):
        ws2[f"D{row}"].number_format = "0%"
        for col in "ABCDEF":
            ws2[f"{col}{row}"].alignment = Alignment(horizontal="center")
    ws2.freeze_panes = "A2"

    ws3 = wb.create_sheet("风险矩阵")
    ws3.append(["风险项", "可能性(1-5)", "影响(1-5)", "风险值", "应对措施"])
    for i, (name, p_, i_, action) in enumerate(RISKS, start=2):
        ws3.append([name, p_, i_, f"=B{i}*C{i}", action])
    for c in ws3[1]:
        c.font = Font(bold=True, color="FFFFFF", size=11)
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
    for col, w in zip("ABCDE", [22, 14, 12, 10, 34]):
        ws3.column_dimensions[col].width = w
    for row in range(2, 6):
        for col in "ABCD":
            ws3[f"{col}{row}"].alignment = Alignment(horizontal="center")
    ws3.conditional_formatting.add(
        "D2:D5",
        __import__("openpyxl.formatting.rule", fromlist=["ColorScaleRule"])
        .ColorScaleRule(start_type="min", start_color="C6EFCE",
                        end_type="max", end_color="FFC7CE"),
    )

    ws4 = wb.create_sheet("说明")
    ws4["A1"] = NOTE
    ws4["A1"].font = Font(size=10, color="606B7A")
    ws4.column_dimensions["A"].width = 90

    for s in (ws, ws2, ws3):
        s.sheet_view.showGridLines = False

    out = os.path.join(BASE, "AI_Agent_2026_数据表.xlsx")
    wb.save(out)
    return out


# ---------------------------------------------------------------- PPTX
def build_pptx(cover):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    BG = PRGB(0x0B, 0x10, 0x20)
    CY = PRGB(0x35, 0xE0, 0xFF)
    WH = PRGB(0xFF, 0xFF, 0xFF)
    GY = PRGB(0x9A, 0xA6, 0xB8)
    FONT = "Noto Sans CJK SC"

    def bg(slide, color=BG):
        f = slide.background.fill
        f.solid()
        f.fore_color.rgb = color

    def text(slide, left, top, width, height, s, size=20, bold=False,
             color=WH, align=PP_ALIGN.LEFT, spacing=1.2, anchor=MSO_ANCHOR.TOP):
        tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        lines = s.split("\n")
        for i, line in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.alignment = align
            p.line_spacing = spacing
            r = p.add_run()
            r.text = line
            r.font.size = PPt(size)
            r.font.bold = bold
            r.font.color.rgb = color
            r.font.name = FONT
        return tb

    def bar(slide, left, top, width, height, color=CY):
        sh = slide.shapes.add_shape(1, Inches(left), Inches(top), Inches(width), Inches(height))
        sh.fill.solid()
        sh.fill.fore_color.rgb = color
        sh.line.fill.background()
        return sh

    # 1 封面
    s = prs.slides.add_slide(blank)
    bg(s)
    pic = s.shapes.add_picture(cover, 0, 0, width=prs.slide_width,
                               height=prs.slide_height)
    # 半透明遮罩
    ov = s.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    ov.fill.solid()
    ov.fill.fore_color.rgb = BG
    from pptx.oxml.ns import qn as pqn
    solidFill = ov.fill._xPr.find(pqn("a:solidFill"))
    alpha = solidFill.find(pqn("a:srgbClr"))
    from lxml import etree
    a = etree.SubElement(alpha, pqn("a:alpha"))
    a.set("val", "55000")
    ov.line.fill.background()

    bar(s, 1.0, 2.35, 0.09, 1.9)
    text(s, 1.35, 2.25, 10.5, 1.0, TITLE, size=44, bold=True)
    text(s, 1.35, 3.35, 10.5, 0.7, SUB, size=20, color=CY)
    text(s, 1.35, 4.25, 10.5, 0.5, "2026 年 11 月 · 示意数据版", size=14, color=GY)

    # 2 摘要
    s = prs.slides.add_slide(blank)
    bg(s)
    text(s, 0.95, 0.8, 11, 0.5, "摘要", size=13, color=CY, bold=True)
    text(s, 0.95, 1.25, 11.5, 1.2, "智能体正在从「更会聊天的入口」\n变成「承接业务结果的执行单元」",
         size=32, bold=True, spacing=1.35)
    bar(s, 0.95, 3.55, 1.6, 0.05)
    text(s, 0.95, 3.9, 11.3, 2.4,
         "变化不在于模型更聪明，而在于工程侧补齐了三件事：\n"
         "任务编排、工具调用权限、可观测的执行轨迹。\n"
         "当这三件事具备，端到端交付才成为可能。",
         size=17, color=GY, spacing=1.7)

    # 3 三个判断
    s = prs.slides.add_slide(blank)
    bg(s)
    text(s, 0.95, 0.75, 11, 0.5, "三个核心判断", size=13, color=CY, bold=True)
    text(s, 0.95, 1.15, 11, 0.7, "2026 年的三个确定性", size=30, bold=True)
    for i, (tag, name, desc) in enumerate(JUDGEMENTS):
        x = 0.95 + i * 3.95
        card = s.shapes.add_shape(1, Inches(x), Inches(2.35), Inches(3.6), Inches(3.5))
        card.fill.solid()
        card.fill.fore_color.rgb = PRGB(0x12, 0x1A, 0x2E)
        card.line.color.rgb = PRGB(0x22, 0x2E, 0x45)
        text(s, x + 0.35, 2.65, 3.0, 0.4, tag, size=12, color=CY, bold=True)
        text(s, x + 0.35, 3.05, 3.0, 1.2, name, size=17, bold=True, spacing=1.35)
        text(s, x + 0.35, 4.35, 3.0, 1.3, desc, size=11.5, color=GY, spacing=1.5)

    # 4 数据图
    s = prs.slides.add_slide(blank)
    bg(s)
    text(s, 0.95, 0.75, 11, 0.5, "市场规模", size=13, color=CY, bold=True)
    text(s, 0.95, 1.15, 11, 0.7, "五年增长约 16 倍（示意数据）", size=30, bold=True)
    cd = CategoryChartData()
    cd.categories = [m[0] for m in MARKET]
    cd.add_series("市场规模（亿美元）", [m[1] for m in MARKET])
    gf = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(0.95), Inches(2.15),
                            Inches(7.6), Inches(4.4), cd)
    chart = gf.chart
    chart.has_legend = False
    chart.font.name = FONT
    chart.font.size = PPt(12)
    chart.font.color.rgb = WH
    plot = chart.plots[0]
    plot.has_data_labels = True
    plot.data_labels.font.size = PPt(12)
    plot.data_labels.font.color.rgb = WH
    plot.gap_width = 90
    ser = plot.series[0]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = CY
    chart.category_axis.tick_labels.font.color.rgb = GY
    chart.value_axis.tick_labels.font.color.rgb = GY
    chart.value_axis.has_major_gridlines = False

    text(s, 9.0, 2.4, 3.6, 0.4, "企业渗透率", size=12, color=CY, bold=True)
    rows = [("2022", "3%"), ("2023", "8%"), ("2024", "17%"), ("2025", "31%"), ("2026E", "46%")]
    for i, (y, v) in enumerate(rows):
        yy = 2.85 + i * 0.72
        text(s, 9.0, yy, 0.9, 0.4, y, size=12, color=GY)
        b = bar(s, 9.85, yy + 0.09, max(0.15, float(v.strip("%")) / 100 * 2.2), 0.16)
        text(s, 9.85 + max(0.15, float(v.strip("%")) / 100 * 2.2) + 0.08, yy - 0.03, 0.8, 0.4, v, size=11.5)

    # 5 场景 ROI
    s = prs.slides.add_slide(blank)
    bg(s)
    text(s, 0.95, 0.75, 11, 0.5, "场景与投入产出", size=13, color=CY, bold=True)
    text(s, 0.95, 1.15, 11, 0.7, "从闭环链路开始落地", size=30, bold=True)
    tw = [1.9, 4.3, 1.7, 1.8, 1.6]
    hx = 0.95
    heads = ["场景", "典型任务", "周期", "成本下降", "满意度"]
    for w, hd in zip(tw, heads):
        text(s, hx, 2.25, w, 0.4, hd, size=12, color=CY, bold=True)
        hx += w
    for i, sc in enumerate(SCENES):
        yy = 2.75 + i * 0.78
        if i % 2 == 0:
            bgr = s.shapes.add_shape(1, Inches(0.85), Inches(yy - 0.1),
                                     Inches(11.9), Inches(0.68))
            bgr.fill.solid()
            bgr.fill.fore_color.rgb = PRGB(0x12, 0x1A, 0x2E)
            bgr.line.fill.background()
        vals = [sc[0], sc[1], f"{sc[2]} 周", f"{sc[3]}%", sc[5]]
        hx = 0.95
        for w, v, k in zip(tw, vals, range(5)):
            text(s, hx, yy, w, 0.5, v, size=12.5,
                 color=WH if k == 0 else GY, bold=(k == 0))
            hx += w

    # 6 风险
    s = prs.slides.add_slide(blank)
    bg(s)
    text(s, 0.95, 0.75, 11, 0.5, "风险与治理", size=13, color=CY, bold=True)
    text(s, 0.95, 1.15, 11, 0.7, "治理能力决定落地上限", size=30, bold=True)
    for i, (name, p_, i_, action) in enumerate(RISKS):
        yy = 2.2 + i * 1.05
        text(s, 0.95, yy, 4.4, 0.5, f"{i+1:02d}  {name}", size=16, bold=True)
        for j in range(5):
            c = CY if j < p_ else PRGB(0x2A, 0x35, 0x4A)
            d = s.shapes.add_shape(1, Inches(5.5 + j * 0.28), Inches(yy + 0.12),
                                   Inches(0.2), Inches(0.2))
            d.fill.solid()
            d.fill.fore_color.rgb = c
            d.line.fill.background()
        text(s, 7.3, yy, 5.3, 0.6, action, size=13, color=GY)

    # 7 建议
    s = prs.slides.add_slide(blank)
    bg(s)
    text(s, 0.95, 0.75, 11, 0.5, "行动建议", size=13, color=CY, bold=True)
    text(s, 0.95, 1.15, 11, 0.7, "四件现在就能做的事", size=30, bold=True)
    tips = [
        "从链路闭环、失败成本可控的场景开始，不从最复杂流程开始",
        "立项即确定责任人、权限边界与回滚方案",
        "用「单位结果成本」而非「调用量」评估成效",
        "保留人工确认节点，先放在建议位，再逐步放权",
    ]
    for i, tp in enumerate(tips):
        yy = 2.35 + i * 1.05
        num = s.shapes.add_shape(9, Inches(0.95), Inches(yy), Inches(0.52), Inches(0.52))
        num.fill.solid()
        num.fill.fore_color.rgb = CY
        num.line.fill.background()
        tf = num.text_frame
        tf.text = str(i + 1)
        p0 = tf.paragraphs[0]
        p0.alignment = PP_ALIGN.CENTER
        p0.runs[0].font.size = PPt(15)
        p0.runs[0].font.bold = True
        p0.runs[0].font.color.rgb = BG
        p0.runs[0].font.name = FONT
        text(s, 1.7, yy + 0.02, 10.5, 0.5, tp, size=16)

    # 8 结语
    s = prs.slides.add_slide(blank)
    bg(s)
    bar(s, 0.95, 2.6, 0.09, 1.5)
    text(s, 1.3, 2.5, 10.8, 1.8,
         "智能体的价值不在于替代人，\n而在于把人从流程的搬运中释放出来。",
         size=30, bold=True, spacing=1.5)
    text(s, 1.3, 4.6, 10.8, 0.6, "2026 年的分水岭：团队是否愿意重新划分「谁对结果负责」。",
         size=15, color=GY)
    text(s, 9.6, 6.55, 3.0, 0.4, NOTE, size=8, color=PRGB(0x4A, 0x55, 0x6A))

    out = os.path.join(BASE, "AI_Agent_2026_演示文稿.pptx")
    prs.save(out)
    return out


if __name__ == "__main__":
    cov = clean_cover()
    p1 = build_docx(cov)
    p2 = build_xlsx()
    p3 = build_pptx(cov)
    for p in (p1, p2, p3):
        print(p, os.path.getsize(p))
