# -*- coding: utf-8 -*-
"""生成单文件网页产物（内嵌封面图 base64）"""
import base64, io, os
from PIL import Image

BASE = "/workspace/artifacts"
src = os.path.join(BASE, "assets", "cover_clean.png")

im = Image.open(src).convert("RGB")
im.thumbnail((1600, 1600))
buf = io.BytesIO()
im.save(buf, format="JPEG", quality=82)
b64 = base64.b64encode(buf.getvalue()).decode()
IMG = f"data:image/jpeg;base64,{b64}"

MARKET = [("2022", 12, "—", 3), ("2023", 27, "125%", 8), ("2024", 58, "115%", 17),
          ("2025", 112, "93%", 31), ("2026E", 198, "77%", 46)]
SCENES = [("智能客服", "多轮工单处理与升级", 4, 38, "4.2/5"),
          ("研发协同", "需求拆解、用例生成、代码评审", 6, 26, "4.5/5"),
          ("数据分析", "自然语言取数与归因", 3, 31, "3.9/5"),
          ("流程审批", "单据校验与合规预审", 5, 44, "4.0/5"),
          ("销售支持", "客户线索评分与话术生成", 4, 22, "3.7/5")]
RISKS = [("智能体越权执行", 3, 5, "最小权限 + 人工二次确认"),
         ("幻觉导致错误决策", 4, 4, "关键结论强制引用来源"),
         ("数据外泄", 3, 5, "数据分级与脱敏网关"),
         ("责任归属不清", 4, 3, "为每个智能体指定责任人")]
JUDG = [("判断一", "交付单位从「功能」变成「结果」",
         "企业采购的衡量口径正在从席位数量转向可交付的业务结果，按结果计价的合同占比明显上升。"),
        ("判断二", "多智能体协作成为主流工程范式",
         "单一大模型调用难以覆盖长链路任务，规划者 + 执行者 + 校验者的编排模式成为默认架构。"),
        ("判断三", "治理能力决定落地上限",
         "权限、审计与可回滚能力，比模型本身的分数更直接影响智能体能否进入生产环境。")]

maxv = max(m[1] for m in MARKET)
bars = "\n".join(
    f'<div class="bar-row"><span class="bar-label">{y}</span>'
    f'<div class="bar-track"><div class="bar-fill" style="width:{v/maxv*100:.1f}%"></div></div>'
    f'<span class="bar-val">{v}</span></div>'
    for y, v, _, _ in MARKET)

pen = "\n".join(
    f'<div class="pen-row"><span>{y}</span><div class="pen-track">'
    f'<div class="pen-fill" style="width:{p}%"></div></div><b>{p}%</b></div>'
    for y, _, _, p in MARKET)

scene_rows = "\n".join(
    f"<tr><td class='strong'>{a}</td><td>{b}</td><td>{c} 周</td><td>{d}%</td><td>{e}</td></tr>"
    for a, b, c, d, e in SCENES)

risk_cards = "\n".join(
    f'<div class="risk"><div class="risk-head"><span class="num">{i+1:02d}</span>'
    f'<span class="risk-name">{n}</span><span class="dots">'
    + "".join(f'<i class="{"on" if j < p else ""}"></i>' for j in range(5))
    + f'</span></div><p>{a}</p></div>'
    for i, (n, p, im_, a) in enumerate(RISKS))

judg_cards = "\n".join(
    f'<article class="card"><span class="tag">{t}</span><h3>{n}</h3><p>{d}</p></article>'
    for t, n, d in JUDG)

html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AI Agent 2026：从助手到同事</title>
<style>
  :root {{
    --bg:#080C18; --panel:#111A2E; --line:#1F2C44;
    --cy:#35E0FF; --wh:#F2F6FF; --gy:#93A1B8;
  }}
  * {{ box-sizing:border-box; margin:0; padding:0; }}
  body {{
    background:var(--bg); color:var(--wh); line-height:1.75;
    font-family:"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;
  }}
  .wrap {{ max-width:1080px; margin:0 auto; padding:0 24px; }}
  header.hero {{
    position:relative; min-height:78vh; display:flex; align-items:center;
    background:url('{IMG}') center/cover no-repeat;
  }}
  header.hero::after {{
    content:""; position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(8,12,24,.55) 0%, rgba(8,12,24,.82) 55%, var(--bg) 100%);
  }}
  .hero-inner {{ position:relative; z-index:2; padding:96px 0; }}
  .kicker {{ color:var(--cy); letter-spacing:.28em; font-size:12px; }}
  h1 {{ font-size:clamp(30px,5vw,56px); line-height:1.25; margin:18px 0 14px; font-weight:800; }}
  .sub {{ color:var(--gy); font-size:clamp(14px,1.6vw,18px); max-width:640px; }}
  .meta {{ margin-top:26px; color:#61708A; font-size:13px; }}
  .rule {{ width:64px; height:3px; background:var(--cy); margin:26px 0; border-radius:2px; }}
  section {{ padding:72px 0; border-top:1px solid rgba(31,44,68,.6); }}
  .label {{ color:var(--cy); font-size:12px; letter-spacing:.22em; margin-bottom:12px; }}
  h2 {{ font-size:clamp(24px,3vw,36px); line-height:1.35; font-weight:800; margin-bottom:10px; }}
  .lead {{ color:var(--gy); max-width:760px; }}
  .kpis {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-top:36px; }}
  .kpi {{ background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:26px 22px; }}
  .kpi b {{ display:block; font-size:38px; line-height:1.1; color:var(--cy); font-weight:800; }}
  .kpi span {{ color:var(--gy); font-size:13px; }}
  .cards {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-top:36px; }}
  .card {{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:28px 24px; }}
  .card h3 {{ font-size:18px; margin:12px 0 12px; line-height:1.5; }}
  .card p {{ color:var(--gy); font-size:14px; }}
  .tag {{ color:var(--cy); font-size:12px; letter-spacing:.16em; }}
  .grid2 {{ display:grid; grid-template-columns:1.15fr .85fr; gap:28px; margin-top:36px; }}
  .panel {{ background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 24px; }}
  .panel h4 {{ font-size:14px; color:var(--gy); font-weight:600; margin-bottom:20px; }}
  .bar-row {{ display:flex; align-items:center; gap:12px; margin-bottom:14px; font-size:13px; }}
  .bar-label {{ width:56px; color:var(--gy); }}
  .bar-track {{ flex:1; height:10px; background:#0C1526; border-radius:6px; overflow:hidden; }}
  .bar-fill {{ height:100%; background:linear-gradient(90deg,#1C86A8,var(--cy)); border-radius:6px; }}
  .bar-val {{ width:44px; text-align:right; color:var(--wh); }}
  .pen-row {{ display:flex; align-items:center; gap:10px; font-size:13px; margin-bottom:16px; color:var(--gy); }}
  .pen-row span {{ width:52px; }}
  .pen-track {{ flex:1; height:8px; background:#0C1526; border-radius:5px; overflow:hidden; }}
  .pen-fill {{ height:100%; background:var(--cy); border-radius:5px; }}
  .pen-row b {{ width:42px; text-align:right; color:var(--wh); }}
  table {{ width:100%; border-collapse:collapse; margin-top:36px; font-size:14px; }}
  th, td {{ text-align:left; padding:15px 12px; border-bottom:1px solid var(--line); }}
  th {{ color:var(--cy); font-size:12px; letter-spacing:.12em; font-weight:600; }}
  td {{ color:var(--gy); }}
  td.strong {{ color:var(--wh); font-weight:600; }}
  tbody tr:hover {{ background:rgba(53,224,255,.04); }}
  .risks {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px; margin-top:36px; }}
  .risk {{ background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:22px; }}
  .risk-head {{ display:flex; align-items:center; gap:10px; }}
  .num {{ color:#3C4C68; font-size:13px; font-weight:700; }}
  .risk-name {{ font-weight:700; font-size:15px; }}
  .dots {{ margin-left:auto; display:flex; gap:4px; }}
  .dots i {{ width:7px; height:7px; border-radius:2px; background:#27334A; display:block; }}
  .dots i.on {{ background:var(--cy); }}
  .risk p {{ color:var(--gy); font-size:13px; margin-top:14px; }}
  ol.steps {{ margin-top:32px; display:grid; gap:14px; list-style:none; counter-reset:s; }}
  ol.steps li {{ counter-increment:s; background:var(--panel); border:1px solid var(--line);
    border-radius:14px; padding:20px 22px 20px 62px; position:relative; font-size:15px; }}
  ol.steps li::before {{ content:counter(s); position:absolute; left:20px; top:50%; transform:translateY(-50%);
    width:26px; height:26px; border-radius:50%; background:var(--cy); color:#08111F;
    display:grid; place-items:center; font-size:13px; font-weight:800; }}
  blockquote {{ margin-top:36px; border-left:2px solid var(--cy); padding-left:24px;
    font-size:clamp(18px,2.6vw,26px); font-weight:700; line-height:1.6; }}
  footer {{ padding:44px 0 72px; color:#4E5B73; font-size:12px; border-top:1px solid var(--line); }}
  @media (max-width:760px) {{
    .grid2 {{ grid-template-columns:1fr; }}
    header.hero {{ min-height:64vh; }}
    section {{ padding:56px 0; }}
    table {{ font-size:13px; }}
    th, td {{ padding:12px 8px; }}
  }}
</style>
</head>
<body>

<header class="hero">
  <div class="wrap hero-inner">
    <div class="kicker">趋势观察报告</div>
    <h1>AI Agent 2026：<br />从助手到同事</h1>
    <div class="rule"></div>
    <p class="sub">智能体正在从「更会聊天的入口」变成「承接业务结果的执行单元」。
    变化不在于模型更聪明，而在于工程侧补齐了任务编排、权限边界与可观测的执行轨迹。</p>
    <p class="meta">2026 年 11 月 · 示意数据版</p>
  </div>
</header>

<main class="wrap">

  <section>
    <div class="label">摘要 / ABSTRACT</div>
    <h2>四个数字看清今年的位置</h2>
    <p class="lead">以下数值为演示用示意数据，仅用于说明趋势方向，不代表任何机构的真实统计口径。</p>
    <div class="kpis">
      <div class="kpi"><b>198</b><span>亿美元 · 2026 年全球市场规模（示意）</span></div>
      <div class="kpi"><b>+77%</b><span>同比增速，较 2023 年的 125% 逐步回落</span></div>
      <div class="kpi"><b>46%</b><span>企业渗透率，接近半数组织已有生产级用例</span></div>
      <div class="kpi"><b>16×</b><span>五年规模增长倍数</span></div>
    </div>
  </section>

  <section>
    <div class="label">判断 / JUDGEMENTS</div>
    <h2>2026 年的三个确定性</h2>
    <div class="cards">
      {judg_cards}
    </div>
  </section>

  <section>
    <div class="label">数据 / MARKET</div>
    <h2>规模与渗透率的双线推进</h2>
    <div class="grid2">
      <div class="panel">
        <h4>全球智能体市场规模（亿美元）</h4>
        {bars}
      </div>
      <div class="panel">
        <h4>企业渗透率</h4>
        {pen}
      </div>
    </div>
  </section>

  <section>
    <div class="label">场景 / USE CASES</div>
    <h2>从闭环链路开始落地</h2>
    <p class="lead">任务链路越闭环，越适合交给智能体端到端执行；反之应保留人工确认节点。</p>
    <table>
      <thead>
        <tr><th>场景</th><th>典型任务</th><th>部署周期</th><th>成本下降</th><th>满意度</th></tr>
      </thead>
      <tbody>
        {scene_rows}
      </tbody>
    </table>
  </section>

  <section>
    <div class="label">风险 / GOVERNANCE</div>
    <h2>治理能力决定落地上限</h2>
    <div class="risks">
      {risk_cards}
    </div>
  </section>

  <section>
    <div class="label">建议 / ACTIONS</div>
    <h2>现在就能做的四件事</h2>
    <ol class="steps">
      <li>从链路闭环、失败成本可控的场景开始，不从最复杂的流程开始。</li>
      <li>立项时就确定责任人、权限边界与回滚方案，治理不是上线后的补丁。</li>
      <li>用「单位结果成本」而不是「调用量」评估成效，避免指标虚高。</li>
      <li>保留人工确认节点，先把智能体放在建议位，再逐步放权。</li>
    </ol>
    <blockquote>智能体的价值不在于替代人，<br />而在于把人从流程的搬运中释放出来。</blockquote>
  </section>

</main>

<footer>
  <div class="wrap">AI Agent 2026：从助手到同事 · 趋势观察报告（示意数据版） · 2026-11</div>
</footer>

</body>
</html>
"""

out = os.path.join(BASE, "index.html")
with open(out, "w", encoding="utf-8") as f:
    f.write(html)
print(out, os.path.getsize(out))
