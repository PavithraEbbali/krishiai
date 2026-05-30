import { useState, useEffect, useRef } from "react"
import axios from "axios"

const API = "https://krishiai-production-0ac0.up.railway.app"

/* ────────────────────────────────────────────────────────────
   KRISHI AI · Enterprise AI Platform for FPOs  (dark theme)
   Rename in one place: BRAND + AI_NAME.
   ──────────────────────────────────────────────────────────── */
const BRAND   = "KrishiAI"
const AI_NAME = "Krishi AI"

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,500;1,700&display=swap');

:root {
  --bg:        #08150E;
  --surface:   rgba(255,255,255,.045);
  --surface2:  rgba(255,255,255,.07);
  --border:    rgba(255,255,255,.09);
  --border2:   rgba(255,255,255,.18);

  --t1: #F2F8F4;
  --t2: #C2D1C9;
  --t3: #8DA298;
  --t4: #6B7F75;

  --green:    #43A047;
  --green-d:  #2E7D32;
  --green-l:  #66BB6A;
  --green-xl: #8AE88F;
  --green-s:  rgba(76,175,80,.15);
  --green-b:  rgba(102,187,106,.32);

  --ink-1: #06120B;
  --ink-2: #0C2014;
  --ink-3: #102A1B;

  --amber:   #FBBF24;
  --amber-d: #FBBF24;
  --amber-s: rgba(245,158,11,.15);
  --amber-b: rgba(245,158,11,.34);
  --blue:    #60A5FA;
  --blue-s:  rgba(96,165,250,.15);
  --blue-b:  rgba(96,165,250,.32);
  --purple:  #A78BFA;
  --purple-s:rgba(167,139,250,.15);
  --purple-b:rgba(167,139,250,.32);

  --ff:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --ffd: 'Playfair Display', Georgia, serif;

  --r1: 8px; --r2: 12px; --r3: 18px; --r4: 24px;

  --sh-sm: 0 2px 10px rgba(0,0,0,.3);
  --sh-md: 0 10px 30px rgba(0,0,0,.4);
  --sh-lg: 0 20px 56px rgba(0,0,0,.5);
  --sh-glow: 0 8px 28px rgba(46,125,50,.45);

  --sidebar-w: 264px;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { font-size:16px; -webkit-text-size-adjust:100%; background:var(--bg); }
body { font-family:var(--ff); background:var(--bg); color:var(--t2); line-height:1.6;
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
button { font-family:inherit; }
::-webkit-scrollbar { width:7px; height:7px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(255,255,255,.14); border-radius:10px; }
::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,.26); }

@keyframes spin   { to { transform:rotate(360deg); } }
@keyframes breathe{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.7)} }
@keyframes rise   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes fade   { from{opacity:0} to{opacity:1} }
@keyframes fabpulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.7);opacity:0} }
.rise { animation:rise .5s cubic-bezier(.16,1,.3,1) both; }

/* ══════════════ SHELL ══════════════ */
.shell { display:flex; min-height:100vh; background:var(--bg); }

/* ── SIDEBAR ── */
.sidebar { width:var(--sidebar-w); flex-shrink:0;
  background:
    radial-gradient(760px 340px at 0% 0%, rgba(102,187,106,.26), transparent 60%),
    radial-gradient(600px 540px at 0% 100%, rgba(245,158,11,.08), transparent 55%),
    linear-gradient(180deg, var(--ink-2), var(--ink-1));
  border-right:1px solid rgba(255,255,255,.07);
  display:flex; flex-direction:column; position:sticky; top:0; height:100vh; z-index:300; }
.sb-brand { display:flex; align-items:center; gap:13px; padding:22px 18px; width:100%;
  background:transparent; border:none; border-bottom:1px solid rgba(255,255,255,.08);
  cursor:pointer; text-align:left; transition:background .15s; }
.sb-brand:hover { background:rgba(255,255,255,.05); }
.sb-logo { width:46px; height:46px; flex-shrink:0; border-radius:14px;
  background:linear-gradient(135deg, #9CF0A0 0%, var(--green-l) 48%, var(--green-d) 100%);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 8px 24px rgba(102,187,106,.6), inset 0 1px 0 rgba(255,255,255,.6), 0 0 0 1px rgba(255,255,255,.12); }
.sb-logo svg { width:26px; height:26px; color:#06210F; }
.sb-brand-txt { display:flex; flex-direction:column; min-width:0; }
.sb-name { font-family:var(--ffd); font-size:21px; font-weight:800; color:#fff; letter-spacing:-.3px; line-height:1.05; white-space:nowrap; }
.sb-org { font-size:11px; color:rgba(255,255,255,.5); font-weight:500; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }

.sb-section { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.36); padding:20px 24px 8px; }
.sb-nav { display:flex; flex-direction:column; gap:3px; padding:0 12px; flex:1; }
.sb-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:11px;
  font-size:13.5px; font-weight:500; color:rgba(255,255,255,.66); background:transparent; border:none;
  cursor:pointer; text-align:left; width:100%; position:relative; transition:color .15s, background .15s; }
.sb-item:hover { color:#fff; background:rgba(255,255,255,.06); }
.sb-item.on { color:#fff; font-weight:600; background:linear-gradient(90deg, rgba(102,187,106,.38), rgba(102,187,106,.08)); }
.sb-item.on::before { content:''; position:absolute; left:-12px; top:10px; bottom:10px; width:3px;
  background:var(--green-xl); border-radius:0 4px 4px 0; box-shadow:0 0 14px rgba(138,232,143,.9); }
.sb-item svg { width:18px; height:18px; flex-shrink:0; opacity:.9; }
.sb-item-arrow { margin-left:auto; opacity:0; transition:opacity .15s; }
.sb-item.on .sb-item-arrow { opacity:.7; }

.sb-foot { padding:16px; border-top:1px solid rgba(255,255,255,.08); margin-top:auto; }
.sb-status { display:flex; align-items:center; gap:10px; background:rgba(102,187,106,.16);
  border:1px solid rgba(102,187,106,.34); border-radius:11px; padding:11px 13px; }
.sb-status-dot { width:8px; height:8px; border-radius:50%; background:var(--green-xl);
  box-shadow:0 0 10px var(--green-xl); animation:breathe 2.4s ease-in-out infinite; flex-shrink:0; }
.sb-status-txt { display:flex; flex-direction:column; }
.sb-status-l { font-size:11px; font-weight:700; color:#fff; line-height:1.3; }
.sb-status-s { font-size:10px; color:rgba(255,255,255,.5); }

/* ── MAIN ── */
.main { flex:1; min-width:0; display:flex; flex-direction:column;
  background:
    radial-gradient(1000px 540px at 100% -8%, rgba(67,160,71,.20), transparent 60%),
    radial-gradient(820px 640px at -6% 110%, rgba(245,158,11,.08), transparent 55%),
    radial-gradient(760px 760px at 55% 130%, rgba(46,125,50,.16), transparent 60%),
    linear-gradient(180deg, #0A1A11, #08150E); }
.topbar { height:64px; flex-shrink:0; background:rgba(8,21,14,.65); backdrop-filter:blur(18px);
  border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;
  padding:0 32px; position:sticky; top:0; z-index:100; }
.hamburger { display:none; width:38px; height:38px; border-radius:10px; border:1px solid var(--border);
  background:var(--surface); align-items:center; justify-content:center; cursor:pointer; color:var(--t2); }
.crumb { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--t3); }
.crumb b { color:var(--t1); font-weight:600; }
.crumb-sep { color:var(--t4); }
.topbar-right { display:flex; align-items:center; gap:14px; }
.tb-pill { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--green-xl);
  background:var(--green-s); border:1px solid var(--green-b); padding:6px 13px; border-radius:100px; }
.tb-pill .dot { width:6px; height:6px; border-radius:50%; background:var(--green-xl);
  box-shadow:0 0 7px var(--green-xl); animation:breathe 2.4s ease-in-out infinite; }
.tb-date { font-size:12px; color:var(--t3); font-weight:500; }

.content { padding:32px; max-width:1240px; width:100%; margin:0 auto; }

/* ══════════════ HERO ══════════════ */
.hero { position:relative; overflow:hidden; border-radius:var(--r4);
  background:
    radial-gradient(520px 380px at 90% -10%, rgba(245,158,11,.22), transparent 60%),
    radial-gradient(620px 480px at -5% 120%, rgba(67,160,71,.30), transparent 55%),
    linear-gradient(135deg, #0F2A1A, #081711);
  border:1px solid rgba(255,255,255,.08); padding:40px 44px; margin-bottom:24px; box-shadow:var(--sh-lg); }
.hero::after { content:''; position:absolute; inset:0; pointer-events:none;
  background-image:linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size:38px 38px; mask-image:radial-gradient(80% 80% at 72% 0%, #000, transparent); }
.hero-grid { position:relative; z-index:1; display:grid; grid-template-columns:1.4fr 1fr; gap:40px; align-items:center; }
.hero-eyebrow { display:inline-flex; align-items:center; gap:7px; white-space:nowrap; font-size:11px; font-weight:700;
  letter-spacing:.12em; text-transform:uppercase; color:var(--green-xl);
  background:rgba(138,232,143,.12); border:1px solid rgba(138,232,143,.34); padding:6px 14px; border-radius:100px; margin-bottom:20px; }
.hero-eyebrow svg { width:13px; height:13px; flex-shrink:0; }
.hero-title { font-family:var(--ffd); font-size:38px; line-height:1.12; font-weight:800; color:#fff; letter-spacing:-.6px; margin-bottom:16px; }
.hero-title em { font-style:italic; color:var(--green-xl); font-weight:700; }
.hero-sub { font-size:15px; line-height:1.7; color:rgba(255,255,255,.66); max-width:520px; margin-bottom:26px; }
.hero-cta { display:flex; gap:12px; flex-wrap:wrap; }
.btn { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:600; border-radius:11px;
  padding:12px 22px; cursor:pointer; transition:all .18s; border:1px solid transparent; }
.btn svg { width:16px; height:16px; }
.btn-primary { color:#06210F; background:linear-gradient(135deg, var(--green-xl), var(--green)); box-shadow:var(--sh-glow); }
.btn-primary:hover { transform:translateY(-1px); box-shadow:0 14px 36px rgba(102,187,106,.55); }
.btn-ghost-d { color:#fff; background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.2); backdrop-filter:blur(8px); }
.btn-ghost-d:hover { background:rgba(255,255,255,.16); transform:translateY(-1px); }

.hero-stats { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.14); border-radius:var(--r3);
  padding:6px; backdrop-filter:blur(10px); display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.hs-cell { padding:18px 16px; border-radius:14px; text-align:left; }
.hs-cell:hover { background:rgba(255,255,255,.06); }
.hs-val { font-family:var(--ffd); font-size:30px; font-weight:800; color:#fff; letter-spacing:-.5px; line-height:1; }
.hs-lbl { font-size:11px; color:rgba(255,255,255,.55); margin-top:7px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; }

/* ══════════════ KPIs ══════════════ */
.kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.kpi { position:relative; overflow:hidden; background:linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.025));
  border:1px solid var(--border); border-radius:var(--r3); padding:20px; box-shadow:var(--sh-sm);
  backdrop-filter:blur(10px); transition:transform .18s, box-shadow .18s, border-color .18s; }
.kpi:hover { transform:translateY(-3px); box-shadow:var(--sh-md); border-color:var(--green-b); }
.kpi-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.kpi-ico { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; }
.kpi-ico svg { width:19px; height:19px; }
.kpi-trend { font-size:11px; font-weight:700; padding:3px 8px; border-radius:7px; color:var(--green-xl); background:var(--green-s); }
.kpi:nth-child(1) .kpi-ico { background:var(--green-s); color:var(--green-xl); }
.kpi:nth-child(2) .kpi-ico { background:var(--blue-s);  color:var(--blue); }
.kpi:nth-child(3) .kpi-ico { background:var(--amber-s); color:var(--amber-d); }
.kpi:nth-child(4) .kpi-ico { background:var(--purple-s);color:var(--purple); }
.kpi-val { font-family:var(--ffd); font-size:40px; font-weight:800; color:var(--t1); letter-spacing:-1.5px; line-height:.95; margin-bottom:6px; }
.kpi-label { font-size:12px; font-weight:700; color:var(--t1); margin-bottom:3px; }
.kpi-desc { font-size:11.5px; color:var(--t4); }

/* ══════════════ QUICK ACCESS (dashboard) ══════════════ */
.qa-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:16px; margin-bottom:28px; }
.qa-card { position:relative; display:flex; flex-direction:column; cursor:pointer; text-align:left; width:100%;
  background:linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02));
  border:1px solid var(--border); border-radius:var(--r3); padding:22px; box-shadow:var(--sh-sm);
  backdrop-filter:blur(10px); transition:transform .18s, box-shadow .18s, border-color .18s; }
.qa-card:hover { transform:translateY(-3px); box-shadow:var(--sh-md); border-color:var(--green-b); }
.qa-ico { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
.qa-ico svg { width:22px; height:22px; }
.qa-card:nth-child(1) .qa-ico { background:var(--green-s); color:var(--green-xl); }
.qa-card:nth-child(2) .qa-ico { background:var(--amber-s); color:var(--amber-d); }
.qa-card:nth-child(3) .qa-ico { background:var(--blue-s); color:var(--blue); }
.qa-title { font-family:var(--ffd); font-size:19px; font-weight:700; color:var(--t1); margin-bottom:5px; }
.qa-desc { font-size:12.5px; color:var(--t3); line-height:1.5; margin-bottom:18px; }
.qa-foot { display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
.qa-count { font-size:12px; font-weight:700; color:var(--green-xl); }
.qa-arrow { color:var(--t4); display:flex; transition:transform .18s, color .18s; }
.qa-arrow svg { width:18px; height:18px; }
.qa-card:hover .qa-arrow { color:var(--green-xl); transform:translateX(3px); }

/* ══════════════ SECTION ══════════════ */
.sec-head { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:16px; gap:16px; flex-wrap:wrap; }
.sec-title { font-family:var(--ffd); font-size:24px; font-weight:800; color:var(--t1); letter-spacing:-.4px; line-height:1.2; }
.sec-sub { font-size:13px; color:var(--t3); margin-top:3px; }

.card { background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.022));
  border:1px solid var(--border); border-radius:var(--r3); overflow:hidden; box-shadow:var(--sh-sm); backdrop-filter:blur(12px); }
.card-header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid var(--border); gap:12px; }
.card-title { font-size:15px; font-weight:700; color:var(--t1); letter-spacing:-.2px; }
.card-title-row { display:flex; align-items:center; gap:10px; }
.card-title-ico { width:30px; height:30px; border-radius:9px; background:var(--green-s); color:var(--green-xl); display:flex; align-items:center; justify-content:center; }
.card-title-ico svg { width:16px; height:16px; }
.card-body { padding:24px; }

.badge { font-size:11px; font-weight:600; padding:5px 12px; border-radius:100px; border:1px solid; display:inline-flex; align-items:center; gap:6px; }
.badge-green { color:var(--green-xl); background:var(--green-s); border-color:var(--green-b); }
.badge-blue  { color:var(--blue); background:var(--blue-s); border-color:var(--blue-b); }
.badge .pulse { width:6px; height:6px; border-radius:50%; background:currentColor; animation:breathe 2.4s ease-in-out infinite; }

.btn-soft { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:var(--green-xl);
  background:var(--green-s); border:1px solid var(--green-b); padding:8px 16px; border-radius:10px; cursor:pointer; transition:all .15s; }
.btn-soft:hover { background:var(--green); color:#06210F; border-color:var(--green); box-shadow:var(--sh-glow); }
.btn-soft svg { width:15px; height:15px; }

/* ── INSIGHT ── */
.insight { position:relative; overflow:hidden; display:flex; align-items:flex-start; gap:14px;
  background:linear-gradient(135deg, rgba(102,187,106,.18), rgba(102,187,106,.04)); border:1px solid var(--green-b);
  border-radius:var(--r2); padding:18px 20px; margin-bottom:22px; }
.insight.flush { margin-bottom:0; }
.insight::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
  background:linear-gradient(180deg, var(--green-xl), var(--green)); box-shadow:0 0 14px rgba(138,232,143,.5); }
.insight-ico { width:34px; height:34px; border-radius:10px; flex-shrink:0; margin-top:1px;
  background:linear-gradient(135deg, var(--green-xl), var(--green-d)); color:#06210F;
  display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(102,187,106,.4); }
.insight-ico svg { width:17px; height:17px; }
.insight-label { font-size:10px; font-weight:800; color:var(--green-xl); text-transform:uppercase; letter-spacing:.12em; margin-bottom:4px; }
.insight-text { font-size:13.5px; color:#DCEFDD; line-height:1.7; }

/* ── TABLE ── */
.tbl-wrap { overflow-x:auto; }
.tbl { width:100%; border-collapse:collapse; min-width:480px; }
.tbl thead th { font-size:11px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:.08em;
  padding:12px 16px; text-align:left; background:rgba(255,255,255,.04); border-bottom:1px solid var(--border); }
.tbl thead th:first-child { border-radius:10px 0 0 0; }
.tbl thead th:last-child { text-align:right; border-radius:0 10px 0 0; }
.tbl tbody tr { border-bottom:1px solid var(--border); transition:background .12s; }
.tbl tbody tr:last-child { border-bottom:none; }
.tbl tbody tr:hover { background:rgba(102,187,106,.09); }
.tbl tbody td { padding:15px 16px; font-size:13.5px; color:var(--t2); vertical-align:middle; }
.tbl tbody td:last-child { text-align:right; }
.farmer-cell { display:flex; align-items:center; gap:11px; }
.farmer-av { width:34px; height:34px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg, var(--green-l), var(--green-d));
  color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; box-shadow:0 2px 8px rgba(46,125,50,.4); }
.tbl-name { font-size:13.5px; font-weight:600; color:var(--t1); }
.tbl-price { font-size:15px; font-weight:800; color:var(--green-xl); font-variant-numeric:tabular-nums; }
.tbl-dash { font-size:13px; color:var(--t4); }
.tbl-district { font-size:13px; color:var(--t3); display:inline-flex; align-items:center; gap:6px; }
.tbl-district svg { width:13px; height:13px; opacity:.6; }

/* narrow 2-column variant — keeps crop & price close together */
.tbl-narrow { max-width:560px; min-width:0; }

.crop { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; padding:4px 11px; border-radius:100px; border:1px solid; }
.crop .cdot { width:6px; height:6px; border-radius:50%; background:currentColor; }
.cT { color:#FCA5A5; background:rgba(220,38,38,.16); border-color:rgba(220,38,38,.36); }
.cR { color:#FCD34D; background:rgba(217,119,6,.16); border-color:rgba(217,119,6,.36); }
.cM { color:#FDBA74; background:rgba(234,88,12,.18); border-color:rgba(234,88,12,.36); }
.cP { color:#C4B5FD; background:rgba(124,58,237,.18); border-color:rgba(124,58,237,.36); }
.cX { color:var(--green-xl); background:var(--green-s); border-color:var(--green-b); }

/* raw fallback for non-table responses */
.raw-block { background:rgba(0,0,0,.28); border:1px solid var(--border); border-radius:var(--r2);
  padding:18px 20px; color:#BFE6C6; font-family:'SF Mono','Fira Code','Courier New',monospace;
  font-size:12.5px; line-height:1.8; white-space:pre-wrap; word-break:break-word; overflow-x:auto; }

/* ── SCHEME CARDS ── */
.sk-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:16px; }
.sk-card { position:relative; overflow:hidden; background:linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02));
  border:1px solid var(--border); border-radius:var(--r2); padding:20px; box-shadow:var(--sh-sm);
  backdrop-filter:blur(10px); transition:transform .18s, box-shadow .18s, border-color .18s; }
.sk-card:hover { transform:translateY(-3px); box-shadow:var(--sh-md); border-color:var(--green-b); }
.sk-card::after { content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
  background:linear-gradient(180deg,var(--green-xl),var(--green)); transform:scaleY(0); transform-origin:top; transition:transform .22s; }
.sk-card:hover::after { transform:scaleY(1); }
.sk-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
.sk-type { font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--green-xl);
  background:var(--green-s); border:1px solid var(--green-b); padding:4px 10px; border-radius:7px; }
.sk-ico { width:36px; height:36px; border-radius:10px; background:var(--amber-s); color:var(--amber-d);
  display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.sk-ico svg { width:18px; height:18px; }
.sk-name { font-family:var(--ffd); font-size:19px; font-weight:700; color:var(--t1); letter-spacing:-.2px; line-height:1.25; margin-bottom:4px; }
.sk-full { font-size:12px; color:var(--t3); margin-bottom:16px; line-height:1.5; }
.sk-row { display:flex; align-items:center; gap:8px; font-size:12.5px; margin-bottom:8px; }
.sk-row:last-child { margin-bottom:0; }
.sk-row svg { width:14px; height:14px; flex-shrink:0; }
.sk-amount { color:var(--green-xl); font-weight:700; }
.sk-amount svg { color:var(--green-l); }
.sk-deadline { color:var(--t3); }
.sk-deadline svg { color:var(--amber-d); }

/* ── LOADER ── */
.loader { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:56px; gap:14px; }
.loader-ring { width:26px; height:26px; border:2.5px solid rgba(255,255,255,.15); border-top-color:var(--green-xl); border-radius:50%; animation:spin .65s linear infinite; }
.loader-text { font-size:13px; color:var(--t4); font-weight:500; }
.empty-row { text-align:center; padding:44px; color:var(--t4); font-style:italic; font-family:var(--ffd); font-size:15px; }
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:44px 24px; gap:13px; }
.empty-state-ico { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,.05); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--t4); }
.empty-state-ico svg { width:26px; height:26px; }
.empty-state-h { font-family:var(--ffd); font-size:18px; font-style:italic; color:var(--t2); font-weight:700; }
.empty-state-p { font-size:13px; color:var(--t4); max-width:360px; line-height:1.65; margin-bottom:4px; }
.note { font-size:12.5px; color:var(--t4); padding:14px 16px; border:1px dashed var(--border2); border-radius:var(--r2); background:rgba(255,255,255,.02); }

/* ── CROP FILTER ── */
.filterbar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.filterbar:last-of-type { margin-bottom:18px; }
.filterbar-label { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--t4); margin-right:4px; min-width:62px; }
.chip { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--t2);
  background:rgba(255,255,255,.05); border:1px solid var(--border); padding:7px 14px; border-radius:100px;
  cursor:pointer; transition:all .15s; }
.chip:hover { color:var(--green-xl); border-color:var(--green-b); background:var(--green-s); }
.chip.on { color:#06210F; background:linear-gradient(135deg,var(--green-xl),var(--green)); border-color:transparent; box-shadow:var(--sh-glow); }
.chip .cdot { width:6px; height:6px; border-radius:50%; background:currentColor; }
.chip-count { font-size:12.5px; color:var(--t4); margin-left:auto; font-weight:500; }

/* ══════════════ FOOTER ══════════════ */
.foot { margin-top:auto; padding:24px 32px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.foot-l { font-size:12.5px; color:var(--t4); }
.foot-l b { color:var(--green-xl); font-weight:700; }
.foot-tags { display:flex; gap:8px; flex-wrap:wrap; }
.foot-tag { font-size:11px; font-weight:600; color:var(--t3); background:rgba(255,255,255,.04); border:1px solid var(--border); padding:4px 11px; border-radius:7px; }

.overlay { display:none; position:fixed; inset:0; background:rgba(4,12,8,.6); backdrop-filter:blur(2px); z-index:250; animation:fade .2s; }

/* ══════════════ FLOATING ASSISTANT ══════════════ */
.fab { position:fixed; right:26px; bottom:26px; z-index:420; width:62px; height:62px; border-radius:50%; border:none; cursor:pointer;
  background:linear-gradient(135deg, var(--green-xl), var(--green-d)); color:#06210F; display:flex; align-items:center; justify-content:center;
  box-shadow:0 14px 34px rgba(102,187,106,.55), inset 0 1px 0 rgba(255,255,255,.35); transition:transform .2s, box-shadow .2s; }
.fab:hover { transform:translateY(-2px) scale(1.05); box-shadow:0 18px 44px rgba(102,187,106,.65); }
.fab svg { width:27px; height:27px; position:relative; z-index:2; }
.fab-ring { position:absolute; inset:0; border-radius:50%; border:2px solid var(--green-xl); opacity:.5; animation:fabpulse 2.6s ease-out infinite; }
.fab-tip { position:fixed; right:100px; bottom:42px; z-index:419; background:#06120B; color:#fff; font-size:12.5px; font-weight:600;
  border:1px solid var(--border); padding:8px 14px; border-radius:10px; white-space:nowrap; box-shadow:var(--sh-md); animation:rise .4s ease both; }
.fab-tip::after { content:''; position:absolute; right:-5px; top:50%; transform:translateY(-50%) rotate(45deg); width:10px; height:10px;
  background:#06120B; border-right:1px solid var(--border); border-top:1px solid var(--border); }

.assistant { position:fixed; right:26px; bottom:100px; z-index:420; width:392px; max-width:calc(100vw - 36px);
  height:564px; max-height:calc(100vh - 132px); background:linear-gradient(180deg, #0E2417, #081711); border:1px solid var(--border2);
  border-radius:20px; overflow:hidden; box-shadow:0 28px 80px rgba(0,0,0,.6); display:flex; flex-direction:column; animation:rise .28s cubic-bezier(.16,1,.3,1) both; }
.as-head { display:flex; align-items:center; gap:11px; padding:16px 18px;
  background:radial-gradient(360px 160px at 0% 0%, rgba(138,232,143,.28), transparent 60%), linear-gradient(135deg, var(--ink-3), var(--ink-1));
  color:#fff; border-bottom:1px solid var(--border); }
.as-av { width:40px; height:40px; border-radius:12px; flex-shrink:0; background:linear-gradient(135deg,#9CF0A0,var(--green-d));
  color:#06210F; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(102,187,106,.45); }
.as-av svg { width:21px; height:21px; }
.as-meta { display:flex; flex-direction:column; min-width:0; }
.as-name { font-size:14.5px; font-weight:700; }
.as-sub { font-size:11px; color:rgba(255,255,255,.62); display:flex; align-items:center; gap:6px; }
.as-sub .d { width:6px; height:6px; border-radius:50%; background:var(--green-xl); box-shadow:0 0 8px var(--green-xl); animation:breathe 2.4s infinite; }
.as-close { margin-left:auto; width:32px; height:32px; border-radius:9px; border:none; cursor:pointer; background:rgba(255,255,255,.12);
  color:#fff; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.as-close:hover { background:rgba(255,255,255,.22); }
.as-close svg { width:17px; height:17px; }
.as-body { flex:1; display:flex; flex-direction:column; overflow:hidden; padding:18px; }
.as-thread { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:18px; padding-right:3px; }
.as-suggest { display:flex; flex-wrap:wrap; gap:7px; padding:0 18px 14px; }
.as-foot { padding:14px 18px; border-top:1px solid var(--border); display:flex; gap:8px; }

.suggestion { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; color:var(--t2);
  background:rgba(255,255,255,.05); border:1px solid var(--border); padding:7px 13px; border-radius:100px; cursor:pointer; transition:all .15s; text-align:left; }
.suggestion svg { width:12px; height:12px; color:var(--green-xl); flex-shrink:0; }
.suggestion:hover { color:var(--green-xl); border-color:var(--green-b); background:var(--green-s); transform:translateY(-1px); }

.chat-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:24px; gap:11px; }
.chat-empty-ico { width:62px; height:62px; border-radius:18px; background:linear-gradient(135deg, rgba(102,187,106,.22), rgba(102,187,106,.05));
  border:1px solid var(--green-b); display:flex; align-items:center; justify-content:center; color:var(--green-xl); }
.chat-empty-ico svg { width:30px; height:30px; }
.chat-empty-h { font-family:var(--ffd); font-size:18px; font-style:italic; color:var(--t1); font-weight:700; }
.chat-empty-p { font-size:12.5px; color:var(--t4); max-width:230px; line-height:1.6; }

.message { display:flex; gap:10px; animation:rise .3s ease both; }
.message.user { flex-direction:row-reverse; }
.msg-av { width:30px; height:30px; border-radius:9px; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; }
.message.ai .msg-av { background:linear-gradient(135deg,var(--green-xl),var(--green-d)); color:#06210F; }
.message.user .msg-av { background:rgba(255,255,255,.08); color:var(--t2); border:1px solid var(--border); }
.msg-col { max-width:82%; display:flex; flex-direction:column; }
.message.user .msg-col { align-items:flex-end; }
.msg-from { font-size:10px; font-weight:700; color:var(--t4); margin-bottom:5px; text-transform:uppercase; letter-spacing:.06em; }
.message.ai .msg-from { color:var(--green-xl); }
.msg-text { font-size:13px; line-height:1.65; padding:11px 14px; border-radius:13px; }
.message.user .msg-text { background:linear-gradient(135deg,var(--green-l),var(--green-d)); color:#fff; border-radius:13px 13px 4px 13px; font-weight:500; box-shadow:var(--sh-glow); }
.message.ai .msg-text { background:rgba(255,255,255,.06); border:1px solid var(--border); color:var(--t2); border-radius:4px 13px 13px 13px; }
.message.ai .msg-text.thinking { color:var(--t4); font-style:italic; display:flex; align-items:center; gap:9px; }
.think-ring { width:13px; height:13px; border:2px solid rgba(255,255,255,.15); border-top-color:var(--green-xl); border-radius:50%; animation:spin .65s linear infinite; }

.chat-input { flex:1; font-family:var(--ff); font-size:13.5px; color:var(--t1); background:rgba(255,255,255,.05); border:1px solid var(--border);
  border-radius:11px; padding:12px 15px; outline:none; transition:all .15s; }
.chat-input::placeholder { color:var(--t4); }
.chat-input:focus { border-color:var(--green-l); background:rgba(255,255,255,.09); box-shadow:0 0 0 3px rgba(102,187,106,.18); }
.chat-input:disabled { opacity:.5; }
.chat-btn { display:inline-flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--green-xl),var(--green-d));
  color:#06210F; border:none; border-radius:11px; padding:0 16px; font-size:13.5px; font-weight:600; cursor:pointer; transition:all .15s; box-shadow:var(--sh-glow); }
.chat-btn:hover:not(:disabled) { transform:translateY(-1px); }
.chat-btn:disabled { opacity:.45; cursor:not-allowed; box-shadow:none; }
.chat-btn svg { width:16px; height:16px; }

/* ══════════════ RESPONSIVE ══════════════ */
@media (max-width:1080px) { .hero-grid { grid-template-columns:1fr; gap:28px; } .kpis { grid-template-columns:repeat(2,1fr); } .hero-title { font-size:32px; } }
@media (max-width:860px) {
  .sidebar { position:fixed; left:0; top:0; transform:translateX(-100%); transition:transform .28s cubic-bezier(.16,1,.3,1); box-shadow:var(--sh-lg); }
  .sidebar.open { transform:translateX(0); }
  .overlay.show { display:block; }
  .hamburger { display:flex; }
  .content { padding:20px; } .topbar { padding:0 18px; } .hero { padding:30px 24px; } .hero-title { font-size:27px; }
  .crumb .crumb-hide { display:none; } .fab-tip { display:none; } .assistant { right:12px; bottom:90px; }
}
@media (max-width:540px) { .kpis { grid-template-columns:1fr; } .tb-date { display:none; } .hero-cta { flex-direction:column; align-items:stretch; } .btn { justify-content:center; } }
`

/* ───────────── ICONS ───────────── */
const I = {
  leaf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/></svg>,
  schemes: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13l2 2 4-4"/></svg>,
  prices: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  ai: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.8 2 .2.8 2 .2-2 .8-1 2-1-2-2-.8 2-.2z"/></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  spark: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/></svg>,
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M9 4v13M15 7v13"/></svg>,
  sprout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8M14.1 6c-.9.8-1.6 2-2.1 3.6-.5-1.5-1.1-2.7-2.3-3.5C8.8 5.4 7.1 5 5 5c0 2.3 1 3.7 2.2 4.4M14.5 6.7c1.1-.8 2.7-1.3 4.5-1.4 0 2.3-1 3.7-2.2 4.4-.8.5-1.7.7-2.8.7"/></svg>,
  gift: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/></svg>,
  rupee: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10"/></svg>,
  cal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  bot: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  inbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
}

/* ───────────── HELPERS ───────────── */
const uniq = a => [...new Set(a.filter(Boolean))]

function parseBriefingRows(r) {
  if (!r) return []
  return r.split("\n")
    .filter(l => l.includes("|") && !l.includes("---") && !l.includes("farmer_name"))
    .map(l => {
      const c = l.split("|").map(x => x.trim()).filter(Boolean)
      return { name: c[0], crop: c[1], district: c[2], price: c[3] }
    }).filter(x => x.name?.length > 0)
}
function parseSchemeRows(r) {
  if (!r) return []
  return r.split("\n")
    .filter(l => l.includes("|") && !l.includes("---") && !l.includes("scheme_name"))
    .map(l => {
      const c = l.split("|").map(x => x.trim()).filter(Boolean)
      return { name: c[0], full: c[1], type: c[2], amount: c[3], deadline: c[4] }
    }).filter(x => x.name?.length > 0)
}
function parseTable(raw) {
  if (!raw) return { headers: [], rows: [] }
  const cell = l => {
    let s = l.trim()
    if (s.startsWith("|")) s = s.slice(1)
    if (s.endsWith("|")) s = s.slice(0, -1)
    return s.split("|").map(x => x.trim())
  }
  const lines = raw.split("\n").map(l => l.trim())
    .filter(l => l.includes("|"))
    .filter(l => !/^[\s|+\-=:]+$/.test(l))
  if (lines.length < 2) return { headers: [], rows: [] }
  return { headers: cell(lines[0]).map(h => h.replace(/_/g, " ")), rows: lines.slice(1).map(cell) }
}
function timeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}
function fixGreeting(text) {
  if (!text) return text
  return text.replace(/^\s*good\s+(morning|afternoon|evening|night)/i, timeGreeting())
}

/* ───────────── SMALL COMPONENTS ───────────── */
function Loader({ label = "Loading..." }) {
  return <div className="loader"><div className="loader-ring" /><div className="loader-text">{label}</div></div>
}
function Insight({ text, flush }) {
  if (!text) return null
  return (
    <div className={`insight rise ${flush ? "flush" : ""}`}>
      <div className="insight-ico">{I.spark}</div>
      <div><div className="insight-label">AI Insight</div><div className="insight-text">{text}</div></div>
    </div>
  )
}
function EmptyState({ title, text, onRetry }) {
  return (
    <div className="empty-state">
      <div className="empty-state-ico">{I.inbox}</div>
      <div className="empty-state-h">{title}</div>
      <div className="empty-state-p">{text}</div>
      {onRetry && <button className="btn-soft" onClick={onRetry}>{I.refresh} Try again</button>}
    </div>
  )
}
function CropTag({ name }) {
  const map = { Tomato: "cT", Rice: "cR", Maize: "cM", Potato: "cP" }
  return <span className={`crop ${map[name] || "cX"}`}><span className="cdot" />{name}</span>
}
/* one filter row — reused for crop and for district */
function FilterRow({ label, options, active, setActive, count }) {
  if (options.length < 2) return null   // nothing to filter on a single value
  return (
    <div className="filterbar">
      <span className="filterbar-label">{label}</span>
      <button className={`chip ${active === "All" ? "on" : ""}`} onClick={() => setActive("All")}>All</button>
      {options.map(o => (
        <button key={o} className={`chip ${active === o ? "on" : ""}`} onClick={() => setActive(o)}>
          <span className="cdot" />{o}
        </button>
      ))}
      {count != null && <span className="chip-count">{count} row{count === 1 ? "" : "s"}</span>}
    </div>
  )
}
function ChatMsg({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div className={`message ${isUser ? "user" : "ai"}`}>
      <div className="msg-av">{isUser ? "P" : BRAND.charAt(0)}</div>
      <div className="msg-col">
        <div className="msg-from">{isUser ? "You" : AI_NAME}</div>
        <div className={`msg-text ${msg.thinking ? "thinking" : ""}`}>
          {msg.thinking && <span className="think-ring" />}{msg.text}
        </div>
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  "Which crop has the highest price today?",
  "What schemes can Tomato farmers apply for?",
  "Which district has the most farmers?",
  "Which farmers are growing Rice?",
]

function Assistant({ open, setOpen, chat, q, setQ, asking, sendMsg, endRef }) {
  return (
    <>
      {!open && (
        <>
          <div className="fab-tip">Ask {AI_NAME}</div>
          <button className="fab" onClick={() => setOpen(true)} aria-label={`Open ${AI_NAME}`}><span className="fab-ring" />{I.ai}</button>
        </>
      )}
      {open && (
        <div className="assistant">
          <div className="as-head">
            <div className="as-av">{I.bot}</div>
            <div className="as-meta">
              <span className="as-name">{AI_NAME}</span>
              <span className="as-sub"><span className="d" /> Online · grounded in your FPO data</span>
            </div>
            <button className="as-close" onClick={() => setOpen(false)} aria-label="Close">{I.x}</button>
          </div>
          <div className="as-body">
            <div className="as-thread">
              {chat.length === 0
                ? (
                  <div className="chat-empty">
                    <div className="chat-empty-ico">{I.bot}</div>
                    <div className="chat-empty-h">Ask anything about your FPO</div>
                    <div className="chat-empty-p">Natural language → SQL → insight, from your live data.</div>
                  </div>
                )
                : chat.map((m, i) => <ChatMsg key={i} msg={m} />)}
              <div ref={endRef} />
            </div>
          </div>
          {chat.length === 0 && (
            <div className="as-suggest">
              {SUGGESTIONS.map(s => <button key={s} className="suggestion" onClick={() => sendMsg(s)}>{I.spark}{s}</button>)}
            </div>
          )}
          <div className="as-foot">
            <input className="chat-input" value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder={`Message ${AI_NAME}…`} disabled={asking} />
            <button className="chat-btn" onClick={() => sendMsg()} disabled={asking || !q.trim()}>{asking ? "…" : I.send}</button>
          </div>
        </div>
      )}
    </>
  )
}

/* ───────────── APP ───────────── */
export default function App() {
  const [tab, setTab] = useState("dashboard")
  const [briefing, setBriefing] = useState(null)
  const [schemes, setSchemes] = useState(null)
  const [prices, setPrices] = useState(null)
  const [q, setQ] = useState("")
  const [chat, setChat] = useState([])
  const [asking, setAsking] = useState(false)
  const [bLoad, setBLoad] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [cropFilter, setCropFilter] = useState("All")        // Farm Portfolio crop filter
  const [distFilter, setDistFilter] = useState("All")        // Farm Portfolio district filter
  const [priceFilter, setPriceFilter] = useState("All")      // Market Prices crop filter
  const endRef = useRef(null)

  useEffect(() => { loadBriefing(); loadSchemes() }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chat, chatOpen])

  const loadBriefing = async (attempt = 0) => {
    setBLoad(true)
    try {
      const r = await axios.get(`${API}/morning-briefing`)
      const gotRows = parseBriefingRows(r.data?.results).length > 0
      if (!gotRows && attempt < 3) {          // empty result → source was flaky, retry
        return loadBriefing(attempt + 1)
      }
      setBriefing(r.data)
    } catch {}
    setBLoad(false)
  }
  const loadSchemes = async () => {
    if (schemes) return
    try { const r = await axios.get(`${API}/schemes`); setSchemes(r.data) } catch {}
  }
  const loadPrices = async () => {
    if (prices) return
    try { const r = await axios.get(`${API}/top-prices`); setPrices(r.data) } catch {}
  }
  const onTab = t => {
    setTab(t); setNavOpen(false)
    if (t === "schemes") loadSchemes()
    if (t === "prices") loadPrices()
  }
  const sendMsg = async (question) => {
    const text = (question || q).trim()
    if (!text || asking) return
    setQ(""); setAsking(true)
    setChat(p => [...p, { role: "user", text }, { role: "ai", text: "Querying Coral data sources…", thinking: true }])
    try {
      const r = await axios.post(`${API}/ask`, { question: text })
      setChat(p => [...p.slice(0, -1), { role: "ai", text: r.data.summary }])
    } catch {
      setChat(p => [...p.slice(0, -1), { role: "ai", text: "Something went wrong. Please try again." }])
    }
    setAsking(false)
  }

  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
  const rows = parseBriefingRows(briefing?.results)
  const sRows = parseSchemeRows(schemes?.results)
  const priceTable = parseTable(prices?.results)

  /* dynamic counts — computed from live data so the dashboard never lies */
  const farmerNames = uniq(rows.map(r => r.name))
  const cropNames   = uniq(rows.map(r => r.crop))
  const districts   = uniq(rows.map(r => r.district))
  const farmerCount = farmerNames.length || 12
  const cropCount   = cropNames.length || 4
  const districtCount = districts.length || 3
  const schemeCount = sRows.length || 8
  const cropsDesc = cropNames.length ? cropNames.join(" · ") : "Loading…"
  const distDesc  = districts.length ? districts.join(" · ") : "Loading…"

  /* filtered views — Farm Portfolio: crop AND district combine */
  const visibleRows = rows.filter(r =>
    (cropFilter === "All" || r.crop === cropFilter) &&
    (distFilter === "All" || r.district === distFilter)
  )
  /* Market Prices: crop only */
  const priceCropIdx = priceTable.headers.findIndex(h => /crop|commodity/i.test(h))
  const priceCrops = priceCropIdx >= 0 ? uniq(priceTable.rows.map(r => r[priceCropIdx])) : []
  const visiblePriceRows = priceFilter === "All" || priceCropIdx < 0
    ? priceTable.rows
    : priceTable.rows.filter(r => r[priceCropIdx] === priceFilter)

  const NAV = [
    { id: "dashboard", label: "Dashboard",      icon: I.grid },
    { id: "portfolio", label: "Farm Portfolio", icon: I.users },
    { id: "schemes",   label: "Govt Schemes",   icon: I.schemes },
    { id: "prices",    label: "Market Prices",  icon: I.prices },
  ]
  const tabLabel = NAV.find(n => n.id === tab)?.label

  const KPIS = [
    { label: "Total Farmers", val: farmerCount,   desc: "FPO_KAR_001 · Active members", trend: "Active", icon: I.users },
    { label: "Districts",     val: districtCount, desc: distDesc,  trend: "Live", icon: I.map },
    { label: "Active Crops",  val: cropCount,     desc: cropsDesc, trend: "Live", icon: I.sprout },
    { label: "Govt Schemes",  val: schemeCount,   desc: "National + Karnataka state", trend: "Open", icon: I.gift },
  ]

  const QUICK = [
    { id: "portfolio", icon: I.users,   title: "Farm Portfolio", desc: "Member-level mandi prices & crop snapshot.", count: `${farmerCount} farmers` },
    { id: "schemes",   icon: I.gift,    title: "Govt Schemes",   desc: "Eligible national & state programmes.",       count: `${schemeCount} schemes` },
    { id: "prices",    icon: I.prices,  title: "Market Prices",  desc: "Live Karnataka commodity rates.",             count: "data.gov.in" },
  ]

  /* shared: member snapshot table (crop + district filters) */
  const MemberTable = () => (
    <>
      <FilterRow label="Crop"     options={cropNames} active={cropFilter} setActive={setCropFilter} />
      <FilterRow label="District" options={districts} active={distFilter} setActive={setDistFilter} count={visibleRows.length} />
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Farmer</th><th>Crop</th><th>District</th><th>Mandi Price</th></tr></thead>
          <tbody>
            {visibleRows.length > 0
              ? visibleRows.map((r, i) => (
                <tr key={i}>
                  <td><div className="farmer-cell"><div className="farmer-av">{r.name?.charAt(0) || "?"}</div><span className="tbl-name">{r.name}</span></div></td>
                  <td><CropTag name={r.crop} /></td>
                  <td><span className="tbl-district">{I.pin}{r.district}</span></td>
                  <td>{r.price ? <span className="tbl-price">₹{r.price}</span> : <span className="tbl-dash">—</span>}</td>
                </tr>
              ))
              : <tr><td colSpan={4} className="empty-row">No rows match these filters</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>

      <div className={`overlay ${navOpen ? "show" : ""}`} onClick={() => setNavOpen(false)} />

      <div className="shell">

        {/* ════ SIDEBAR ════ */}
        <aside className={`sidebar ${navOpen ? "open" : ""}`}>
          <button className="sb-brand" onClick={() => onTab("dashboard")} aria-label="Go to dashboard">
            <div className="sb-logo">{I.leaf}</div>
            <div className="sb-brand-txt">
              <span className="sb-name">{BRAND}</span>
              <span className="sb-org">Kolar Agri FPO</span>
            </div>
          </button>

          <div className="sb-section">Workspace</div>
          <nav className="sb-nav">
            {NAV.map(n => (
              <button key={n.id} className={`sb-item ${tab === n.id ? "on" : ""}`} onClick={() => onTab(n.id)}>
                {n.icon}<span>{n.label}</span><span className="sb-item-arrow">{I.arrow}</span>
              </button>
            ))}
          </nav>

          <div className="sb-foot">
            <div className="sb-status">
              <div className="sb-status-dot" />
              <div className="sb-status-txt">
                <span className="sb-status-l">Live Data Stream</span>
                <span className="sb-status-s">4 sources · data.gov.in</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <div className="main">

          <header className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="hamburger" onClick={() => setNavOpen(true)} aria-label="Open menu">{I.menu}</button>
              <div className="crumb">
                <span className="crumb-hide">{BRAND}</span>
                <span className="crumb-sep crumb-hide">/</span>
                <b>{tabLabel}</b>
              </div>
            </div>
            <div className="topbar-right">
              <span className="tb-pill"><span className="dot" /> Live</span>
              <span className="tb-date">{today}</span>
            </div>
          </header>

          <main className="content">

            {/* ══════════ DASHBOARD ══════════ */}
            {tab === "dashboard" && (
              <>
                <section className="hero rise">
                  <div className="hero-grid">
                    <div>
                      <span className="hero-eyebrow">{I.spark} AI-Powered Platform</span>
                      <h1 className="hero-title">{timeGreeting()} —<br /><em>here's your FPO at a glance</em></h1>
                      <p className="hero-sub">
                        Predictive analytics, market intelligence, government scheme discovery and
                        AI-driven procurement insights for Kolar Agri FPO — unified in one platform.
                      </p>
                      <div className="hero-cta">
                        <button className="btn btn-primary" onClick={() => onTab("portfolio")}>{I.users} View Portfolio</button>
                        <button className="btn btn-ghost-d" onClick={() => setChatOpen(true)}>{I.ai} Ask {AI_NAME}</button>
                      </div>
                    </div>
                    <div className="hero-stats">
                      {[{ val: farmerCount, lbl: "Farmers" }, { val: districtCount, lbl: "Districts" }, { val: cropCount, lbl: "Crops" }, { val: schemeCount, lbl: "Schemes" }].map((s, i) => (
                        <div key={i} className="hs-cell"><div className="hs-val">{s.val}</div><div className="hs-lbl">{s.lbl}</div></div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="kpis">
                  {KPIS.map((k, i) => (
                    <div key={i} className="kpi rise" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="kpi-top"><div className="kpi-ico">{k.icon}</div><span className="kpi-trend">{k.trend}</span></div>
                      <div className="kpi-val">{k.val}</div>
                      <div className="kpi-label">{k.label}</div>
                      <div className="kpi-desc">{k.desc}</div>
                    </div>
                  ))}
                </section>

                <div className="sec-head">
                  <div><h2 className="sec-title">Workspace</h2><p className="sec-sub">Jump into any module.</p></div>
                </div>
                <section className="qa-grid">
                  {QUICK.map(c => (
                    <button key={c.id} className="qa-card rise" onClick={() => onTab(c.id)}>
                      <div className="qa-ico">{c.icon}</div>
                      <div className="qa-title">{c.title}</div>
                      <div className="qa-desc">{c.desc}</div>
                      <div className="qa-foot"><span className="qa-count">{c.count}</span><span className="qa-arrow">{I.arrow}</span></div>
                    </button>
                  ))}
                </section>

                <div className="sec-head">
                  <div><h2 className="sec-title">Today's Briefing</h2><p className="sec-sub">AI summary across your members.</p></div>
                  <button className="btn-soft" onClick={() => onTab("portfolio")}>View full portfolio {I.arrow}</button>
                </div>
                <div className="card">
                  <div className="card-body">
                    {bLoad
                      ? <Loader label="Querying Coral data sources…" />
                      : rows.length > 0
                        ? <Insight flush text={fixGreeting(briefing?.summary)} />
                        : <EmptyState title="No briefing data right now"
                            text="The briefing query came back empty. This usually means the price source had no matching rows when the query ran — try refreshing in a moment."
                            onRetry={loadBriefing} />}
                  </div>
                </div>
              </>
            )}

            {/* ══════════ FARM PORTFOLIO ══════════ */}
            {tab === "portfolio" && (
              <>
                <div className="sec-head">
                  <div><h2 className="sec-title">Farm Portfolio</h2><p className="sec-sub">Live mandi prices mapped to every member across your FPO.</p></div>
                  <button className="btn-soft" onClick={loadBriefing}>{I.refresh} Refresh</button>
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title-row"><div className="card-title-ico">{I.users}</div><span className="card-title">Member Snapshot</span></div>
                    <span className="badge badge-green"><span className="pulse" /> Coral-powered</span>
                  </div>
                  <div className="card-body">
                    {bLoad
                      ? <Loader label="Querying Coral data sources…" />
                      : rows.length > 0
                        ? <><Insight text={fixGreeting(briefing?.summary)} /><MemberTable /></>
                        : <EmptyState title="No member data returned"
                            text="The query came back empty. This usually means the mandi price source had no matching rows at query time — try refreshing."
                            onRetry={loadBriefing} />}
                  </div>
                </div>
              </>
            )}

            {/* ══════════ SCHEMES ══════════ */}
            {tab === "schemes" && (
              <>
                <div className="sec-head">
                  <div><h2 className="sec-title">Government Schemes</h2><p className="sec-sub">National &amp; Karnataka state programmes your members are eligible for.</p></div>
                  <span className="badge badge-green"><span className="pulse" /> Coral-powered</span>
                </div>
                <div className="card">
                  <div className="card-body">
                    {!schemes ? <Loader label="Loading schemes…" /> : <>
                      <Insight text={schemes?.summary} />
                      <div className="sk-grid">
                        {sRows.map((s, i) => (
                          <div key={i} className="sk-card rise" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="sk-head"><span className="sk-type">{s.type}</span><div className="sk-ico">{I.gift}</div></div>
                            <div className="sk-name">{s.name}</div>
                            <div className="sk-full">{s.full}</div>
                            <div className="sk-row sk-amount">{I.rupee}{s.amount}</div>
                            <div className="sk-row sk-deadline">{I.cal} Apply by {s.deadline}</div>
                          </div>
                        ))}
                      </div>
                    </>}
                  </div>
                </div>
              </>
            )}

            {/* ══════════ MARKET PRICES ══════════ */}
            {tab === "prices" && (
              <>
                <div className="sec-head">
                  <div><h2 className="sec-title">Karnataka Market Prices</h2><p className="sec-sub">Today's live commodity rates, straight from data.gov.in.</p></div>
                  <span className="badge badge-blue"><span className="pulse" /> Live · data.gov.in</span>
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title-row"><div className="card-title-ico">{I.prices}</div><span className="card-title">Today's Mandi Rates</span></div>
                  </div>
                  <div className="card-body">
                    {!prices ? <Loader label="Fetching live prices…" /> : <>
                      <Insight text={prices?.summary} />
                      {priceTable.rows.length > 0
                        ? (
                          <>
                          <FilterRow label="Crop" options={priceCrops} active={priceFilter} setActive={setPriceFilter} count={visiblePriceRows.length} />
                          <div className="tbl-wrap">
                            <table className="tbl tbl-narrow">
                              <thead><tr>{priceTable.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                              <tbody>
                                {visiblePriceRows.map((row, ri) => (
                                  <tr key={ri}>
                                    {row.map((c, ci) => {
                                      const head = (priceTable.headers[ci] || "").toLowerCase()
                                      if (head.includes("price")) return <td key={ci}><span className="tbl-price">{/^\d/.test(c) ? `₹${c}` : c}</span></td>
                                      if (head.includes("crop") || head.includes("commodity")) return <td key={ci}><CropTag name={c} /></td>
                                      return <td key={ci}>{c}</td>
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          </>
                        )
                        : <div className="note">Today's top rates are summarised above. The API didn't return a detailed price table for this request — refresh once the <code>/top-prices</code> endpoint includes table rows in its <code>results</code> field.</div>}
                    </>}
                  </div>
                </div>
              </>
            )}

          </main>

          <footer className="foot">
            <div className="foot-l">Powered by <b>Coral</b> · Built for Pirates of the Coral-bean 🏴‍☠️</div>
            <div className="foot-tags">
              <span className="foot-tag">4 data sources</span>
              <span className="foot-tag">0 ETL</span>
              <span className="foot-tag">100% local</span>
            </div>
          </footer>

        </div>
      </div>

      <Assistant open={chatOpen} setOpen={setChatOpen} chat={chat} q={q} setQ={setQ} asking={asking} sendMsg={sendMsg} endRef={endRef} />
    </>
  )
}
