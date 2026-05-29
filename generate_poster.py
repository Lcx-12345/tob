from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 1600

bg = (242, 240, 234)
ink = (38, 37, 35)
muted = (160, 158, 150)
accent = (90, 110, 130)
sage = (120, 140, 93)
warm_gray = (200, 197, 189)

img = Image.new('RGB', (W, H), bg)
draw = ImageDraw.Draw(img)

font_dir = "/data/user/skills/canvas-design/canvas-fonts"
font_thin = ImageFont.truetype(f"{font_dir}/InstrumentSerif-Regular.ttf", 28)
font_thin_sm = ImageFont.truetype(f"{font_dir}/InstrumentSerif-Italic.ttf", 18)
font_mono = ImageFont.truetype(f"{font_dir}/DMMono-Regular.ttf", 14)
font_mono_sm = ImageFont.truetype(f"{font_dir}/DMMono-Regular.ttf", 11)
font_title = ImageFont.truetype(f"{font_dir}/Italiana-Regular.ttf", 72)
font_subtitle = ImageFont.truetype(f"{font_dir}/InstrumentSerif-Italic.ttf", 32)
font_label = ImageFont.truetype(f"{font_dir}/GeistMono-Regular.ttf", 12)

cx = W // 2

draw.text((cx, 120), "DIGITAL ZEN", font=font_title, fill=ink, anchor="mt")
draw.text((cx, 180), "computational stillness", font=font_subtitle, fill=muted, anchor="mt")

cy = 420
r_main = 180
for i in range(360):
    angle = math.radians(i)
    x = cx + r_main * math.cos(angle)
    y = cy + r_main * math.sin(angle)
    alpha = int(40 + 60 * abs(math.sin(angle * 3)))
    draw.ellipse([x - 1.5, y - 1.5, x + 1.5, y + 1.5], fill=(*ink, alpha) if alpha < 255 else ink)

r_inner = 120
for i in range(0, 360, 2):
    angle = math.radians(i)
    x = cx + r_inner * math.cos(angle)
    y = cy + r_inner * math.sin(angle)
    draw.ellipse([x - 0.8, y - 0.8, x + 0.8, y + 0.8], fill=warm_gray)

r_core = 50
draw.ellipse([cx - r_core, cy - r_core, cx + r_core, cy + r_core], fill=bg, outline=accent, width=1)

for k in range(8):
    angle = math.radians(k * 45)
    x1 = cx + (r_core + 10) * math.cos(angle)
    y1 = cy + (r_core + 10) * math.sin(angle)
    x2 = cx + (r_inner - 10) * math.cos(angle)
    y2 = cy + (r_inner - 10) * math.sin(angle)
    draw.line([(x1, y1), (x2, y2)], fill=warm_gray, width=1)

for ring_r in [80, 100, 140, 160]:
    for i in range(0, 360, 15):
        angle = math.radians(i)
        x = cx + ring_r * math.cos(angle)
        y = cy + ring_r * math.sin(angle)
        dot_r = 1.5 if ring_r in [140, 160] else 1
        draw.ellipse([x - dot_r, y - dot_r, x + dot_r, y + dot_r], fill=muted)

y_section = 700
draw.line([(100, y_section), (W - 100, y_section)], fill=warm_gray, width=1)

draw.text((100, y_section + 30), "Breath", font=font_thin, fill=ink)
draw.text((100, y_section + 65), "The space between notes defines the music.", font=font_thin_sm, fill=muted)

for i in range(12):
    bx = 100 + i * 85
    by = y_section + 110
    h = 20 + int(30 * abs(math.sin(i * 0.5)))
    draw.rectangle([bx, by, bx + 3, by + h], fill=accent if i % 3 == 0 else warm_gray)

y_section2 = 920
draw.line([(100, y_section2), (W - 100, y_section2)], fill=warm_gray, width=1)

draw.text((100, y_section2 + 30), "Form", font=font_thin, fill=ink)
draw.text((100, y_section2 + 65), "Geometry as meditation — each angle a breath.", font=font_thin_sm, fill=muted)

shapes_y = y_section2 + 120
for i in range(5):
    sx = 150 + i * 200
    sy = shapes_y
    size = 30 + i * 8
    if i % 2 == 0:
        draw.ellipse([sx - size, sy - size, sx + size, sy + size], outline=accent, width=1)
        draw.ellipse([sx - size // 2, sy - size // 2, sx + size // 2, sy + size // 2], outline=warm_gray, width=1)
    else:
        draw.rectangle([sx - size, sy - size, sx + size, sy + size], outline=sage, width=1)
        draw.rectangle([sx - size // 2, sy - size // 2, sx + size // 2, sy + size // 2], outline=warm_gray, width=1)

y_section3 = 1180
draw.line([(100, y_section3), (W - 100, y_section3)], fill=warm_gray, width=1)

draw.text((100, y_section3 + 30), "Silence", font=font_thin, fill=ink)
draw.text((100, y_section3 + 65), "Tranquility is not the absence of complexity", font=font_thin_sm, fill=muted)
draw.text((100, y_section3 + 90), "but its most refined expression.", font=font_thin_sm, fill=muted)

wave_y = y_section3 + 150
for x in range(100, W - 100):
    y_off = 8 * math.sin(x * 0.02) * math.exp(-((x - cx) ** 2) / (2 * 150 ** 2))
    draw.ellipse([x - 0.5, wave_y + y_off - 0.5, x + 0.5, wave_y + y_off + 0.5], fill=accent)

for x in range(100, W - 100):
    y_off = 5 * math.sin(x * 0.03 + 1) * math.exp(-((x - cx) ** 2) / (2 * 200 ** 2))
    draw.ellipse([x - 0.3, wave_y + 20 + y_off - 0.3, x + 0.3, wave_y + 20 + y_off + 0.3], fill=warm_gray)

draw.text((100, H - 80), "No. 001 / Digital Zen Series", font=font_label, fill=muted)
draw.text((W - 100, H - 80), "2025", font=font_label, fill=muted, anchor="ra")

draw.text((cx, 280), "○", font=font_mono, fill=warm_gray, anchor="mt")
draw.text((cx, H - 120), "— breathe —", font=font_mono_sm, fill=warm_gray, anchor="mt")

img.save("/workspace/digital_zen_poster.png", quality=95)
print("Poster saved to /workspace/digital_zen_poster.png")
