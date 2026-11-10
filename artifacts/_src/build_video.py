# -*- coding: utf-8 -*-
"""生成短视频产物：1920x1080 / 30fps / 9s 动态片头"""
import os, math, glob, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE = "/workspace/artifacts"
FRAMES = "/tmp/agent_frames"
W, H = 1920, 1080
FPS = 30
DUR = 9.0
N = int(FPS * DUR)

os.makedirs(FRAMES, exist_ok=True)
for f in glob.glob(FRAMES + "/*.png"):
    os.remove(f)

FONT_CANDIDATES = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto-cjk-otf/NotoSansCJKsc-Bold.otf",
    "/usr/share/fonts/opentype/noto-cjk-otf/NotoSansCJKsc-Regular.otf",
]
FONT = next((p for p in FONT_CANDIDATES if os.path.exists(p)), None)
if not FONT:
    raise SystemExit("未找到中文字体")

def F(size):
    return ImageFont.truetype(FONT, size)

BG = (8, 12, 24)
CY = (53, 224, 255)
WH = (242, 246, 255)
GY = (147, 161, 184)

# 背景：封面图 -> 模糊压暗 + 中心径向渐变
bg = Image.open(os.path.join(BASE, "assets", "cover_clean.png")).convert("RGB")
bg = bg.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(6))
dark = Image.new("RGB", (W, H), BG)
bg = Image.blend(bg, dark, 0.62)

mask = Image.new("L", (W, H), 0)
md = ImageDraw.Draw(mask)
md.ellipse([-W * 0.1, -H * 0.35, W * 1.1, H * 1.35], fill=90)
bg = Image.composite(bg, Image.new("RGB", (W, H), BG), mask)

# 轻微网格
grid = ImageDraw.Draw(bg)
for x in range(0, W, 80):
    grid.line([(x, 0), (x, H)], fill=(10, 16, 30), width=1)
for y in range(0, H, 80):
    grid.line([(0, y), (W, y)], fill=(10, 16, 30), width=1)


def ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def fade(t, start, dur):
    return ease((t - start) / dur)


def text_center(d, y, s, font, color, alpha=255, spacing=0):
    if alpha <= 0:
        return
    box = d.textbbox((0, 0), s, font=font)
    w = box[2] - box[0]
    x = (W - w) / 2 - box[0]
    fill = (color[0], color[1], color[2], int(alpha))
    d.text((x, y), s, font=font, fill=fill, spacing=spacing)


TITLE = "AI Agent 2026"
SUB = "从助手到同事"
STATS = [("198", "亿美元 · 全球市场规模"), ("+77%", "同比增速"), ("46%", "企业渗透率")]
END = "从助手到同事，重新定义谁对结果负责"

for i in range(N):
    t = i / FPS
    img = bg.copy()
    d = ImageDraw.Draw(img, "RGBA")

    # 顶部细线进度
    d.rectangle([0, 0, int(W * (t / DUR)), 3], fill=CY)

    if t < 4.2:
        # 标题
        a1 = fade(t, 0.1, 0.9)
        off = (1 - a1) * 40
        text_center(d, 380 + off, TITLE, F(120), WH, a1 * 255)
        # 分隔线
        a2 = fade(t, 0.6, 0.7)
        if a2 > 0:
            lw = 120 * a2
            d.rectangle([W / 2 - lw, 545, W / 2 + lw, 549], fill=CY + (int(255 * a2),))
        # 副标题
        a3 = fade(t, 1.2, 0.8)
        text_center(d, 600, SUB, F(62), CY, a3 * 255)
        a4 = fade(t, 1.9, 0.8)
        text_center(d, 730, "2026 趋势观察 · 示意数据", F(30), GY, a4 * 230)
    elif t < 7.4:
        tt = t - 4.2
        text_center(d, 250, "三个数字", F(46), CY, fade(tt, 0, 0.5) * 255)
        for k, (num, desc) in enumerate(STATS):
            st = 0.25 + k * 0.55
            a = fade(tt, st, 0.5)
            if a <= 0:
                continue
            y = 400 + k * 190 + (1 - a) * 30
            # 数字
            f_num = F(96)
            box = d.textbbox((0, 0), num, font=f_num)
            nw = box[2] - box[0]
            d.text(((W - nw) / 2 - box[0], y), num, font=f_num, fill=WH + (int(255 * a),))
            text_center(d, y + 118, desc, F(30), GY, a * 240)
    else:
        tt = t - 7.4
        a = fade(tt, 0, 0.7)
        text_center(d, 430, "AI Agent 2026", F(88), WH, a * 255)
        text_center(d, 570, END, F(40), CY, fade(tt, 0.35, 0.6) * 255)
        text_center(d, 660, "示意数据版 · demo", F(24), GY, fade(tt, 0.6, 0.5) * 200)

    img.convert("RGB").save(f"{FRAMES}/f{i:04d}.png")

out = os.path.join(BASE, "AI_Agent_2026_宣传片.mp4")
cmd = (
    f'ffmpeg -y -framerate {FPS} -i "{FRAMES}/f%04d.png" '
    f'-c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart '
    f'-vf "fade=t=out:st={DUR-0.6}:d=0.6" "{out}"'
)
print(cmd)
os.system(cmd)
print(out, os.path.getsize(out) if os.path.exists(out) else "FAILED")
