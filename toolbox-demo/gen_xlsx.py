from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = Workbook()

ZEBRA1 = PatternFill(fill_type="solid", fgColor="FFFFFF")
ZEBRA2 = PatternFill(fill_type="solid", fgColor="F7F9FC")
KPI_FILL = PatternFill(fill_type="solid", fgColor="EAF2FF")
THIN = Side(style="thin", color="D9DEE7")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
HEADER_FILL = PatternFill(fill_type="solid", fgColor="D5E8F0")

def style_sheet(ws, n_rows, n_cols):
    for c in range(1, n_cols + 1):
        cell = ws.cell(1, c)
        cell.font = Font(bold=True, color="1F2937")
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(horizontal="center")
    for r in range(2, n_rows + 1):
        fill = ZEBRA1 if (r - 2) % 2 == 0 else ZEBRA2
        for c in range(1, n_cols + 1):
            cell = ws.cell(r, c)
            cell.fill = fill
            cell.border = BORDER

# Sheet 1: 工具清单
ws = wb.active
ws.title = "工具清单"
ws.append(["工具名称", "类别", "用途", "演示状态"])
tools = [
    ["Write", "文件操作", "创建文件", "已演示"],
    ["Read", "文件操作", "读取文件", "已演示"],
    ["Edit", "文件操作", "精确编辑", "已演示"],
    ["DeleteFile", "文件操作", "删除文件", "已演示"],
    ["Glob", "搜索", "文件名模式查找", "已演示"],
    ["Grep", "搜索", "内容正则查找", "已演示"],
    ["Skill", "技能系统", "加载办公文档能力", "已演示"],
    ["Agent", "子代理", "并行探索与执行", "已演示"],
]
for row in tools:
    ws.append(row)
n = len(tools) + 1
ws.append(["合计（个）", "=COUNTA(A2:A" + str(n) + ")", "", ""])
total_row = n + 1
for c in range(1, 5):
    cell = ws.cell(total_row, c)
    cell.font = Font(bold=True)
    cell.fill = KPI_FILL
    cell.border = BORDER
ws.column_dimensions["A"].width = 16
ws.column_dimensions["B"].width = 12
ws.column_dimensions["C"].width = 24
ws.column_dimensions["D"].width = 12
style_sheet(ws, total_row, 4)

# Sheet 2: 文件格式
ws2 = wb.create_sheet("文件格式")
ws2.append(["格式", "扩展名", "生成方式"])
formats = [
    ["Word 文档", ".docx", "office-plugin:docx"],
    ["Excel 表格", ".xlsx", "office-plugin:xlsx"],
    ["PPT 幻灯片", ".pptx", "office-plugin:pptx"],
    ["PDF 文档", ".pdf", "office-plugin:pdf"],
    ["Python", ".py", "Write 工具"],
    ["JavaScript", ".js", "Write 工具"],
    ["HTML", ".html", "Write 工具"],
    ["CSS", ".css", "Write 工具"],
    ["JSON", ".json", "Write 工具"],
    ["CSV", ".csv", "Write 工具"],
    ["YAML", ".yaml", "Write 工具"],
    ["Markdown", ".md", "Write 工具"],
    ["图片", ".png", "GenerateImage 工具"],
]
for row in formats:
    ws2.append(row)
ws2.column_dimensions["A"].width = 14
ws2.column_dimensions["B"].width = 10
ws2.column_dimensions["C"].width = 24
style_sheet(ws2, len(formats) + 1, 3)

wb.save("/workspace/toolbox-demo/演示表格.xlsx")
print("XLSX generated")
