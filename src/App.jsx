import { useState, useRef } from "react";
import AdminPanel from "./AdminPanel";

const BUILD_TIME = new Date(import.meta.env.VITE_BUILD_TIME || Date.now()).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const track = (eventName, params = {}) => {
  if (typeof gtag !== "undefined") gtag("event", eventName, params);
};

const formatEur = (n) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const formatPct = (n) => `${n.toFixed(1)}%`;

const formatNum = (n) =>
  new Intl.NumberFormat("it-IT").format(n);

// Euro slider with manual input
const SliderEuro = ({ label, value, min, max, step, onChange, color, sublabel }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const handleBlur = () => {
    const parsed = parseInt(draft.replace(/[^\d]/g, ""), 10);
    if (!isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
    setEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
        <div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#7C6F65", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
          {sublabel && <div style={{ fontSize: "0.65rem", color: "#B8A898", marginTop: "1px" }}>{sublabel}</div>}
        </div>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#9A8878" }}>€</span>
            <input ref={inputRef} autoFocus value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={handleBlur} onKeyDown={handleKeyDown}
              style={{ width: "90px", background: "#FAF8F5", border: `1px solid ${color}`, borderRadius: "6px", padding: "0.2rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color, textAlign: "right", outline: "none" }}
            />
          </div>
        ) : (
          <span onClick={() => { setDraft(String(value)); setEditing(true); }} title="Clicca per modificare"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 700, color, cursor: "text", borderBottom: `1px dashed ${color}66`, paddingBottom: "1px" }}>
            {formatEur(value)}
          </span>
        )}
      </div>
      <div style={{ position: "relative", height: "6px", background: "#E8E0D8", borderRadius: "99px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: "99px", transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#A89880" }}>{formatEur(min)}</span>
        <span style={{ fontSize: "0.7rem", color: "#A89880" }}>{formatEur(max)}</span>
      </div>
    </div>
  );
};

// Integer slider with manual input (for volume)
const SliderInt = ({ label, value, min, max, step, onChange, color, sublabel }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const handleBlur = () => {
    const parsed = parseInt(draft.replace(/[^\d]/g, ""), 10);
    if (!isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
    setEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
        <div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#7C6F65", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
          {sublabel && <div style={{ fontSize: "0.65rem", color: "#B8A898", marginTop: "1px" }}>{sublabel}</div>}
        </div>
        {editing ? (
          <input ref={inputRef} autoFocus value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur} onKeyDown={handleKeyDown}
            style={{ width: "80px", background: "#FAF8F5", border: `1px solid ${color}`, borderRadius: "6px", padding: "0.2rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color, textAlign: "right", outline: "none" }}
          />
        ) : (
          <span onClick={() => { setDraft(String(value)); setEditing(true); }} title="Clicca per modificare"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 700, color, cursor: "text", borderBottom: `1px dashed ${color}66`, paddingBottom: "1px" }}>
            {formatNum(value)}
          </span>
        )}
      </div>
      <div style={{ position: "relative", height: "6px", background: "#E8E0D8", borderRadius: "99px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: "99px", transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#A89880" }}>{formatNum(min)}</span>
        <span style={{ fontSize: "0.7rem", color: "#A89880" }}>{formatNum(max)}</span>
      </div>
    </div>
  );
};

// Pct slider
const SliderPct = ({ label, value, min, max, step, onChange, color, sublabel, readOnly }) => (
  <div style={{ marginBottom: "1.4rem", opacity: readOnly ? 0.55 : 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
      <div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#7C6F65", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
        {sublabel && <div style={{ fontSize: "0.65rem", color: "#B8A898", marginTop: "1px" }}>{sublabel}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {readOnly && <span title="Modificabile solo da Admin" style={{ fontSize: "0.75rem", lineHeight: 1 }}>🔒</span>}
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 700, color }}>{value}%</span>
      </div>
    </div>
    <div style={{ position: "relative", height: "6px", background: "#E8E0D8", borderRadius: "99px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${((value - min) / (max - min)) * 100}%`, background: color, borderRadius: "99px", transition: "width 0.1s" }} />
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => !readOnly && onChange(Number(e.target.value))}
        disabled={readOnly}
        style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: readOnly ? "not-allowed" : "pointer", height: "100%", margin: 0 }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
      <span style={{ fontSize: "0.7rem", color: "#A89880" }}>{min}%</span>
      <span style={{ fontSize: "0.7rem", color: "#A89880" }}>{max}%</span>
    </div>
  </div>
);

const Gauge = ({ pct, color: fixedColor }) => {
  const clamped = Math.max(-30, Math.min(60, pct));
  const normalized = (clamped + 30) / 90;
  const angle = -140 + normalized * 280;
  const getColor = () => {
    if (pct < 0) return "#ff4d6d";
    if (pct < 8) return "#ff9a3c";
    if (pct < 15) return "#f9e040";
    if (pct < 25) return "#3cffa0";
    return "#A4274A";
  };
  const color = fixedColor ?? getColor();
  const cx = 100, cy = 90, r = 72;
  const polarToCart = (angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const needle = polarToCart(angle);
  const describeArc = (a1, a2) => {
    const s = polarToCart(a1); const e = polarToCart(a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  return (
    <svg width="200" height="130" viewBox="0 0 200 130">
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4d6d" /><stop offset="40%" stopColor="#ff9a3c" />
          <stop offset="65%" stopColor="#f9e040" /><stop offset="85%" stopColor="#3cffa0" />
          <stop offset="100%" stopColor="#A4274A" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={describeArc(-140, 140)} fill="none" stroke="#E8E0D8" strokeWidth="10" strokeLinecap="round" />
      <path d={describeArc(-140, 140)} fill="none" stroke="url(#arcGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" style={{ transition: "x2 0.4s, y2 0.4s" }} />
      <circle cx={cx} cy={cy} r="5" fill={color} filter="url(#glow)" />
      <text x={cx} y={cy + 28} textAnchor="middle" fill={color} fontSize="22" fontWeight="800" fontFamily="'DM Mono', monospace" filter="url(#glow)">{pct.toFixed(1)}%</text>
      <text x={cx} y={cy + 44} textAnchor="middle" fill="#555570" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="1.5">MARGINE NETTO</text>
    </svg>
  );
};

const Row = ({ label, value, accent, bold, sub }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: sub ? "0.35rem 0 0.35rem 0.8rem" : "0.5rem 0", borderBottom: "1px solid #EDE8E2" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: sub ? "0.78rem" : "0.83rem", color: bold ? "#ddddf0" : sub ? "#4a4a70" : "#7070a0" }}>{label}</span>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: sub ? "0.8rem" : "0.88rem", fontWeight: bold ? 800 : 500, color: accent || (bold ? "#fff" : sub ? "#4a4a70" : "#9090c0") }}>{value}</span>
  </div>
);

const Pill = ({ label, color }) => (
  <span style={{ display: "inline-block", padding: "0.2rem 0.75rem", borderRadius: "99px", background: color + "22", border: `1px solid ${color}55`, color, fontSize: "0.72rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
);

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.4rem 0 1.2rem" }}>
    <div style={{ flex: 1, height: "1px", background: "#FAF8F5" }} />
    {label && <span style={{ fontSize: "0.62rem", color: "#BCA898", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{label}</span>}
    <div style={{ flex: 1, height: "1px", background: "#FAF8F5" }} />
  </div>
);

// Stat box for portfolio summary
const StatBox = ({ label, value, color, sub }) => (
  <div style={{ background: "#F5F3F0", border: `1px solid ${color}33`, borderRadius: "10px", padding: "0.75rem 1rem", flex: 1 }}>
    <div style={{ fontSize: "0.65rem", color: "#A89880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{label}</div>
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.05rem", fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: "0.65rem", color: "#B8A898", marginTop: "0.2rem" }}>{sub}</div>}
  </div>
);

const getRating = (pct) => {
  if (pct < 0) return { label: "Operazione in perdita", color: "#ff4d6d", advice: "⚠️ Rivedi il pricing — stai perdendo soldi su questo cliente." };
  if (pct < 8) return { label: "Marginalità critica", color: "#ff9a3c", advice: "⚡ Troppo basso. Considera di ridurre le garanzie o aumentare il premio." };
  if (pct < 15) return { label: "Marginalità accettabile", color: "#f9e040", advice: "✅ Nella norma. Ottimizza il mix di garanzie per migliorare." };
  if (pct < 25) return { label: "Marginalità ottima", color: "#3cffa0", advice: "🚀 Eccellente. Puoi permetterti piccole concessioni per fidelizzare." };
  return { label: "Marginalità premium", color: "#A4274A", advice: "💎 Margine elevato. Verifica che il prezzo sia competitivo nel mercato." };
};

const getWallifeRating = (pct) => {
  if (pct < 0) return { label: "Margine negativo", color: "#ff4d6d" };
  if (pct < 10) return { label: "Margine contenuto", color: "#ff9a3c" };
  if (pct < 25) return { label: "Margine equilibrato", color: "#f9e040" };
  if (pct < 40) return { label: "Margine ottimo", color: "#3cffa0" };
  return { label: "Margine elevato", color: "#A4274A" };
};

const getProspectRating = (pct) => {
  if (pct <= 0) return { label: "Nessun margine", color: "#C8B8A8" };
  if (pct < 5) return { label: "Margine minimo", color: "#ff9a3c" };
  if (pct < 15) return { label: "Margine accettabile", color: "#f9e040" };
  if (pct < 30) return { label: "Margine buono", color: "#3cffa0" };
  return { label: "Margine ottimo", color: "#22c55e" };
};

export default function SimulatoreMarginalita({ session, profile, role, presets, onPresetsChange, onLogout }) {
  // Track simulator view on mount
  useState(() => { track("simulator_view"); }, []);
  const [panel, setPanel] = useState("simulator");
  const [presetIdx, setPresetIdx] = useState(0);
  const [premio, setPremio] = useState(48);
  const [volume, setVolume] = useState(1000);
  const [sconto, setSconto] = useState(0);
  const [imposte, setImposte] = useState(21.25);
  const [commissioneWallife, setCommissioneWallife] = useState(50);
  const [commissioneIntermediario, setCommissioneIntermediario] = useState(0);
  const [lossRatio, setLossRatio] = useState(15);
  const [costiOp, setCostiOp] = useState(5);
  const [garanzie, setGaranzie] = useState(0);
  const [costiCustom, setCostiCustom] = useState(0);
  const [prezzoSellOut, setPrezzoSellOut] = useState(0);

  const preset = presets[presetIdx] ?? presets[0];
  const handlePreset = (idx) => {
    const p = presets[idx];
    track("product_selected", { product_name: p.label });
    setPresetIdx(idx);
    setPremio(p.default);
    setVolume(p.volume);
    setSconto(p.sconto);
    setImposte(p.imposte);
    setCommissioneWallife(p.commissione);
    setCommissioneIntermediario(0);
    setLossRatio(p.lossRatio);
    setCostiOp(p.costiOp);
    setGaranzie(p.garanzie);
    setPrezzoSellOut(0);
  };
  const handlePremio = (val) => setPremio(Math.min(preset.max, Math.max(preset.min, val)));

  // --- Calcolo unitario ---
  // Sconto applicato al premio lordo
  const premioScontato = premio * (1 - sconto / 100);
  const scontoEur = premio - premioScontato;

  // Premio netto = premio scontato / (1 + imposte%)
  const premioNetto = premioScontato / (1 + imposte / 100);
  const imposteTotali = premioScontato - premioNetto;

  // Tutti gli altri parametri sul premio netto
  const commissioniWallife = (premioNetto * commissioneWallife) / 100;
  const commissioniIntermediario = (premioNetto * commissioneIntermediario) / 100;
  const commissioni = commissioniWallife + commissioniIntermediario;
  const sinistri = (premioNetto * lossRatio) / 100;
  const costiOperativi = (premioNetto * costiOp) / 100;
  const ricavoGaranzie = (premioNetto * garanzie) / 100;
  const costiCustomUnitari = volume > 0 ? costiCustom / volume : 0;
  const margineUnitario = premioNetto - commissioni - sinistri - costiOperativi - costiCustomUnitari + ricavoGaranzie;
  const marginePerc = (margineUnitario / premio) * 100;

  // --- Totali portafoglio ---
  const premioTotale = premio * volume;
  const premioScontatoTotale = premioScontato * volume;
  const premioNettoTotale = premioNetto * volume;
  const margineTotale = margineUnitario * volume;

  const rating = getRating(marginePerc);

  // Risk Carrier: riceve premioNetto, paga commWallife, sinistri, costiOp (non commInt → costo Wallife)
  const margineRC = premioNetto - commissioniWallife - sinistri - costiOperativi + ricavoGaranzie;
  const margineRCPerc = (margineRC / premio) * 100;
  const ratingRC = getRating(margineRCPerc);

  // Wallife: riceve commWallife, paga commInt e costiCustom
  const margineWallife = commissioniWallife - commissioniIntermediario - costiCustomUnitari;
  const margineWallifePerc = (margineWallife / premio) * 100;
  const ratingWallife = getWallifeRating(margineWallifePerc);

  // Prospect: compra a premioScontato, rivende a prezzoSellOut (default = listino)
  const effectiveSellOut = prezzoSellOut > 0 ? prezzoSellOut : premio;
  const margineProspectAbs = effectiveSellOut - premioScontato;
  const margineProspectPerc = effectiveSellOut > 0 ? (margineProspectAbs / effectiveSellOut) * 100 : 0;
  const ratingProspect = getProspectRating(margineProspectPerc);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F3F0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #F5F3F0; }
        ::-webkit-scrollbar-thumb { background: #C8B8A8; border-radius: 4px; }
        input[type=range] { -webkit-appearance: none; appearance: none; } input[type=number] { color-scheme: light; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3F0 0%, #F2EFEb 60%, #EDE9E4 100%)", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>

        {/* Top-right user bar */}
        <div style={{ position: "fixed", top: "1rem", right: "1.2rem", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#FFFFFF", border: "1px solid #E8E0D8", borderRadius: "99px", padding: "0.4rem 0.8rem 0.4rem 1rem" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3cffa0", flexShrink: 0 }} />
            <span style={{ fontSize: "0.75rem", color: "#9A8878", fontFamily: "'DM Mono', monospace", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session?.user?.email}</span>
            {role !== "user" && (
              <button
                onClick={() => {
                  const next = panel === "admin" ? "simulator" : "admin";
                  setPanel(next);
                  track(next === "admin" ? "admin_panel_open" : "admin_panel_close", { role });
                }}
                style={{ background: panel === "admin" ? "#A4274A" : "#FAF8F5", border: `1px solid ${panel === "admin" ? "#A4274A" : "#D4C8B8"}`, borderRadius: "99px", padding: "0.2rem 0.7rem", color: panel === "admin" ? "#fff" : "#A4274A", fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}
              >
                {panel === "admin" ? "Simulatore" : "Admin"}
              </button>
            )}
            <button onClick={() => { track("logout"); onLogout(); }} style={{ background: "#FAF8F5", border: "1px solid #D4C8B8", borderRadius: "99px", padding: "0.2rem 0.7rem", color: "#A4274A", fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>Esci</button>
          </div>
          <span style={{ fontSize: "0.62rem", color: "#C8B8A8", fontFamily: "'DM Mono', monospace", paddingRight: "0.5rem" }}>build {BUILD_TIME}</span>
        </div>

        {panel === "admin" ? (
          <AdminPanel role={role} currentUserId={session.user.id} presets={presets} onPresetsChange={onPresetsChange} />
        ) : (
        <>

        {/* Header */}
        <div style={{ width: "100%", maxWidth: "1200px", marginBottom: "1.4rem", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "0.3rem 1rem", background: "#A4274A15", border: "1px solid #a78bfa44", borderRadius: "99px", marginBottom: "0.9rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#A4274A", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Sales Tool · Assicurativo B2B</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#1C1C1C", marginBottom: "0.4rem" }}>Simulatore di Marginalità</h1>
          <p style={{ color: "#9A8878", fontSize: "0.9rem" }}>Calcola il margine netto in tempo reale prima di ogni offerta</p>

        </div>

        {/* Segment selector */}
        <div style={{ width: "100%", maxWidth: "1200px", marginBottom: "1.1rem", display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", color: "#B8A898", alignSelf: "center", marginRight: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Prodotto</span>
          {presets.map((p, i) => (
            <button key={i} onClick={() => handlePreset(i)} style={{ padding: "0.4rem 1.1rem", borderRadius: "99px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", border: presetIdx === i ? "1px solid #a78bfa" : "1px solid #D4C8B8", background: presetIdx === i ? "#A4274A15" : "transparent", color: presetIdx === i ? "#A4274A" : "#4040a0", transition: "all 0.15s" }}>
              {p.label}
              <span style={{ marginLeft: "0.35rem", fontWeight: 400, opacity: 0.55, fontSize: "0.68rem" }}>{formatEur(p.min)}–{formatEur(p.max)}</span>
            </button>
          ))}
        </div>

        {/* Portfolio summary bar */}
        <div style={{ width: "100%", maxWidth: "1200px", marginBottom: "1.1rem", display: "flex", gap: "0.7rem" }}>
          <StatBox label="Premi lordi totali" value={formatEur(premioTotale)} color="#A4274A" sub={`${formatNum(volume)} polizze × ${formatEur(premio)}`} />
          <StatBox label="Margine RC totale" value={formatEur(margineRC * volume)} color="#38bdf8" sub={`${formatPct(margineRCPerc)} sul lordo`} />
          <StatBox label="Margine Wallife totale" value={formatEur(margineWallife * volume)} color="#A4274A" sub={`${formatPct(margineWallifePerc)} sul lordo`} />
          {sconto > 0 && <StatBox label="Risparmio prospect" value={formatEur(scontoEur * volume)} color="#22c55e" sub={`${formatPct(sconto)} di sconto applicato`} />}
        </div>

        <div style={{ width: "100%", maxWidth: "1200px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.2rem", alignItems: "start" }}>

          {/* RISK CARRIER */}
          <div style={{ background: "#FFFFFF", border: "1px solid #bae6fd44", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "0.72rem", color: "#38bdf8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 700 }}>Risk Carrier</h2>
            <div style={{ fontSize: "0.65rem", color: "#B8A898", marginBottom: "1.4rem" }}>Compagnia di assicurazione</div>

            <SliderEuro label="Premio annuo lordo" value={premio} min={preset.min} max={preset.max} step={preset.step} onChange={handlePremio} color="#A4274A" />
            <SliderPct
              label="Imposte sul premio"
              sublabel={`Premio netto → ${formatEur(premioNetto)}`}
              value={imposte} min={0} max={50} step={0.25}
              onChange={setImposte} color="#e879f9"
            />
            <SliderPct label="Loss ratio atteso (sinistri)" value={lossRatio} min={0} max={70} step={0.5} onChange={setLossRatio} color="#f472b6" readOnly={role === "user"} />
            <SliderPct label="Costi operativi compagnia" value={costiOp} min={3} max={20} step={0.5} onChange={setCostiOp} color="#fb923c" readOnly={role === "user"} />

            <Divider label="Breakdown per polizza" />

            <Row label="Premio lordo" value={formatEur(premio)} />
            <Row label={`− Imposte (${imposte}%)`} value={`− ${formatEur(imposteTotali)}`} accent="#e879f9" sub />
            <Row label="Premio netto incassato" value={formatEur(premioNetto)} accent="#ccaaff" bold />
            <div style={{ height: "0.2rem" }} />
            <Row label={`− Comm. Wallife (${commissioneWallife}%)`} value={`− ${formatEur(commissioniWallife)}`} accent="#60a5fa" sub />
            <Row label={`− Sinistri attesi (${lossRatio}%)`} value={`− ${formatEur(sinistri)}`} accent="#f472b6" sub />
            <Row label={`− Costi operativi (${costiOp}%)`} value={`− ${formatEur(costiOperativi)}`} accent="#fb923c" sub />
            {garanzie > 0 && <Row label={`+ Garanzie extra (+${garanzie}%)`} value={`+ ${formatEur(ricavoGaranzie)}`} accent="#3cffa0" sub />}
            <div style={{ marginTop: "0.4rem" }}>
              <Row label="Margine RC" value={`${formatEur(margineRC)} (${formatPct(margineRCPerc)})`} accent={ratingRC.color} bold />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.2rem" }}>
              <div style={{ transform: "scale(0.85)", transformOrigin: "top center", marginBottom: "-10px" }}>
                <Gauge pct={margineRCPerc} color={ratingRC.color} />
              </div>
              <Pill label={ratingRC.label} color={ratingRC.color} />
              <p style={{ marginTop: "0.6rem", fontSize: "0.75rem", color: "#9A8878", textAlign: "center", lineHeight: 1.4 }}>{ratingRC.advice}</p>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#BCA898", lineHeight: 1.5 }}>Clicca sui valori sottolineati per inserire l'importo esatto</p>
          </div>

          {/* WALLIFE */}
          <div style={{ background: "#FFFFFF", border: "1px solid #A4274A22", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "0.72rem", color: "#A4274A", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 700 }}>Wallife · MGA</h2>
            <div style={{ fontSize: "0.65rem", color: "#B8A898", marginBottom: "1.4rem" }}>Managing General Agent</div>

            <SliderPct label="Commissione Wallife" value={commissioneWallife} min={0} max={70} step={0.5} onChange={setCommissioneWallife} color="#60a5fa" />
            <SliderPct label="Commissione intermediario di Wallife" value={commissioneIntermediario} min={0} max={70} step={0.5} onChange={setCommissioneIntermediario} color="#818cf8" />
            <div style={{ marginBottom: "1.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#7C6F65", letterSpacing: "0.04em", textTransform: "uppercase" }}>Costi sviluppi custom</span>
                  <div style={{ fontSize: "0.65rem", color: "#B8A898", marginTop: "1px" }}>Totale € ripartito per polizza</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#9A8878" }}>€</span>
                  <input
                    type="number" min="0" value={costiCustom === 0 ? "" : costiCustom}
                    placeholder="0"
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setCostiCustom(isNaN(v) || v < 0 ? 0 : v);
                    }}
                    style={{ width: "100px", background: "#FAF8F5", border: "1px solid #f97316", borderRadius: "6px", padding: "0.2rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color: "#f97316", textAlign: "right", outline: "none" }}
                  />
                </div>
              </div>
            </div>

            <Divider label="Breakdown per polizza" />

            <Row label={`Commissioni ricevute (${commissioneWallife}%)`} value={formatEur(commissioniWallife)} />
            {commissioneIntermediario > 0 && <Row label={`− Comm. intermediario (${commissioneIntermediario}%)`} value={`− ${formatEur(commissioniIntermediario)}`} accent="#818cf8" sub />}
            {costiCustom > 0 && <Row label={`− Costi custom (÷ ${formatNum(volume)} pol.)`} value={`− ${formatEur(costiCustomUnitari)}`} accent="#f97316" sub />}
            <div style={{ marginTop: "0.4rem" }}>
              <Row label="Margine Wallife" value={`${formatEur(margineWallife)} (${formatPct(margineWallifePerc)})`} accent="#A4274A" bold />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.2rem" }}>
              <div style={{ transform: "scale(0.85)", transformOrigin: "top center", marginBottom: "-10px" }}>
                <Gauge pct={margineWallifePerc} color={ratingWallife.color} />
              </div>
              <Pill label={ratingWallife.label} color={ratingWallife.color} />
              {volume > 1 && <p style={{ marginTop: "0.6rem", fontSize: "0.75rem", color: "#9A8878", textAlign: "center", lineHeight: 1.4 }}>Totale portafoglio: {formatEur(margineWallife * volume)}</p>}
            </div>
          </div>

          {/* CLIENTE / PROSPECT */}
          <div style={{ background: "#FFFFFF", border: "1px solid #22c55e22", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "0.72rem", color: "#22c55e", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.3rem", fontWeight: 700 }}>Cliente / Prospect</h2>
            <div style={{ fontSize: "0.65rem", color: "#B8A898", marginBottom: "1.4rem" }}>Acquirente e rivenditore</div>

            <SliderInt
              label="Volume polizze"
              sublabel={`Portafoglio lordo → ${formatEur(premioTotale)}`}
              value={volume} min={1} max={1000000} step={1}
              onChange={setVolume} color="#38bdf8"
            />
            <SliderPct
              label="Sconto applicato"
              sublabel={sconto > 0 ? `Acquisto a → ${formatEur(premioScontato)} (- ${formatEur(scontoEur)})` : "Nessuno sconto applicato"}
              value={sconto} min={0} max={100} step={0.5}
              onChange={setSconto} color="#fbbf24"
            />
            <div style={{ marginBottom: "1.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#7C6F65", letterSpacing: "0.04em", textTransform: "uppercase" }}>Prezzo sell-out a terzi</span>
                  <div style={{ fontSize: "0.65rem", color: "#B8A898", marginTop: "1px" }}>
                    {prezzoSellOut > 0 ? "Prezzo a cui il prospect rivende la polizza" : `Default: listino (${formatEur(premio)})`}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#9A8878" }}>€</span>
                  <input
                    type="number" min="0" value={prezzoSellOut === 0 ? "" : prezzoSellOut}
                    placeholder={String(premio)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setPrezzoSellOut(isNaN(v) || v < 0 ? 0 : v);
                    }}
                    style={{ width: "100px", background: "#FAF8F5", border: "1px solid #22c55e", borderRadius: "6px", padding: "0.2rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color: "#22c55e", textAlign: "right", outline: "none" }}
                  />
                </div>
              </div>
            </div>

            <Divider label="Breakdown per polizza" />

            <Row label={`Acquisto polizza (sconto ${sconto}%)`} value={formatEur(premioScontato)} />
            <Row label={`Prezzo sell-out${prezzoSellOut === 0 ? " (= listino)" : ""}`} value={formatEur(effectiveSellOut)} accent="#22c55e" sub />
            <div style={{ marginTop: "0.4rem" }}>
              <Row label="Margine prospect" value={`${formatEur(margineProspectAbs)} (${formatPct(margineProspectPerc)})`} accent={ratingProspect.color} bold />
            </div>
            {volume > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#9A8878" }}>× {formatNum(volume)} polizze</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", fontWeight: 800, color: ratingProspect.color }}>{formatEur(margineProspectAbs * volume)}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.2rem" }}>
              <div style={{ transform: "scale(0.85)", transformOrigin: "top center", marginBottom: "-10px" }}>
                <Gauge pct={margineProspectPerc} color={ratingProspect.color} />
              </div>
              <Pill label={ratingProspect.label} color={ratingProspect.color} />
              {margineProspectPerc <= 0 && <p style={{ marginTop: "0.6rem", fontSize: "0.75rem", color: "#9A8878", textAlign: "center", lineHeight: 1.4 }}>Imposta uno sconto o un prezzo sell-out superiore al listino per calcolare il margine</p>}
            </div>
          </div>
        </div>

        {/* Bottom tip */}
        <div style={{ width: "100%", maxWidth: "1200px", marginTop: "1.1rem", background: "#F5F3F0", border: "1px solid #EDE8E2", borderRadius: "12px", padding: "1rem 1.4rem", display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
          <span style={{ fontSize: "1.1rem", marginTop: "1px" }}>💡</span>
          <p style={{ fontSize: "0.82rem", color: "#9A8878", lineHeight: 1.6 }}>
            <strong style={{ color: "#A4274A" }}>Logica di calcolo:</strong> Sconto → riduce il premio lordo. Imposte → scorporate dal premio scontato. Commissione, LR, costi e garanzie → tutti sul premio netto. Il margine % è sempre calcolato sul lordo iniziale per confrontabilità.
          </p>
        </div>

        <p style={{ marginTop: "1.4rem", fontSize: "0.7rem", color: "#C8B8A8" }}>Simulatore indicativo · I valori reali dipendono dal prodotto e dalla compagnia</p>

        </>
        )}
      </div>
    </>
  );
}
