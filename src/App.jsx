import { useState, useRef } from "react";

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
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8a8a9a", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
          {sublabel && <div style={{ fontSize: "0.65rem", color: "#3a3a60", marginTop: "1px" }}>{sublabel}</div>}
        </div>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#6060a0" }}>€</span>
            <input ref={inputRef} autoFocus value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={handleBlur} onKeyDown={handleKeyDown}
              style={{ width: "90px", background: "#1a1a2e", border: `1px solid ${color}`, borderRadius: "6px", padding: "0.2rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color, textAlign: "right", outline: "none" }}
            />
          </div>
        ) : (
          <span onClick={() => { setDraft(String(value)); setEditing(true); }} title="Clicca per modificare"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 700, color, cursor: "text", borderBottom: `1px dashed ${color}66`, paddingBottom: "1px" }}>
            {formatEur(value)}
          </span>
        )}
      </div>
      <div style={{ position: "relative", height: "6px", background: "#1e1e2e", borderRadius: "99px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: "99px", transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#444460" }}>{formatEur(min)}</span>
        <span style={{ fontSize: "0.7rem", color: "#444460" }}>{formatEur(max)}</span>
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
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8a8a9a", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
          {sublabel && <div style={{ fontSize: "0.65rem", color: "#3a3a60", marginTop: "1px" }}>{sublabel}</div>}
        </div>
        {editing ? (
          <input ref={inputRef} autoFocus value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur} onKeyDown={handleKeyDown}
            style={{ width: "80px", background: "#1a1a2e", border: `1px solid ${color}`, borderRadius: "6px", padding: "0.2rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color, textAlign: "right", outline: "none" }}
          />
        ) : (
          <span onClick={() => { setDraft(String(value)); setEditing(true); }} title="Clicca per modificare"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 700, color, cursor: "text", borderBottom: `1px dashed ${color}66`, paddingBottom: "1px" }}>
            {formatNum(value)}
          </span>
        )}
      </div>
      <div style={{ position: "relative", height: "6px", background: "#1e1e2e", borderRadius: "99px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: "99px", transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#444460" }}>{formatNum(min)}</span>
        <span style={{ fontSize: "0.7rem", color: "#444460" }}>{formatNum(max)}</span>
      </div>
    </div>
  );
};

// Pct slider
const SliderPct = ({ label, value, min, max, step, onChange, color, sublabel }) => (
  <div style={{ marginBottom: "1.4rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
      <div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8a8a9a", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
        {sublabel && <div style={{ fontSize: "0.65rem", color: "#3a3a60", marginTop: "1px" }}>{sublabel}</div>}
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", fontWeight: 700, color }}>{value}%</span>
    </div>
    <div style={{ position: "relative", height: "6px", background: "#1e1e2e", borderRadius: "99px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${((value - min) / (max - min)) * 100}%`, background: color, borderRadius: "99px", transition: "width 0.1s" }} />
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
      <span style={{ fontSize: "0.7rem", color: "#444460" }}>{min}%</span>
      <span style={{ fontSize: "0.7rem", color: "#444460" }}>{max}%</span>
    </div>
  </div>
);

const Gauge = ({ pct }) => {
  const clamped = Math.max(-30, Math.min(60, pct));
  const normalized = (clamped + 30) / 90;
  const angle = -140 + normalized * 280;
  const getColor = () => {
    if (pct < 0) return "#ff4d6d";
    if (pct < 8) return "#ff9a3c";
    if (pct < 15) return "#f9e040";
    if (pct < 25) return "#3cffa0";
    return "#a78bfa";
  };
  const color = getColor();
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
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={describeArc(-140, 140)} fill="none" stroke="#1e1e2e" strokeWidth="10" strokeLinecap="round" />
      <path d={describeArc(-140, 140)} fill="none" stroke="url(#arcGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" style={{ transition: "x2 0.4s, y2 0.4s" }} />
      <circle cx={cx} cy={cy} r="5" fill={color} filter="url(#glow)" />
      <text x={cx} y={cy + 28} textAnchor="middle" fill={color} fontSize="22" fontWeight="800" fontFamily="'DM Mono', monospace" filter="url(#glow)">{pct.toFixed(1)}%</text>
      <text x={cx} y={cy + 44} textAnchor="middle" fill="#555570" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="1.5">MARGINE NETTO</text>
    </svg>
  );
};

const Row = ({ label, value, accent, bold, sub }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: sub ? "0.35rem 0 0.35rem 0.8rem" : "0.5rem 0", borderBottom: "1px solid #1a1a2a" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: sub ? "0.78rem" : "0.83rem", color: bold ? "#ddddf0" : sub ? "#4a4a70" : "#7070a0" }}>{label}</span>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: sub ? "0.8rem" : "0.88rem", fontWeight: bold ? 800 : 500, color: accent || (bold ? "#fff" : sub ? "#4a4a70" : "#9090c0") }}>{value}</span>
  </div>
);

const Pill = ({ label, color }) => (
  <span style={{ display: "inline-block", padding: "0.2rem 0.75rem", borderRadius: "99px", background: color + "22", border: `1px solid ${color}55`, color, fontSize: "0.72rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
);

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.4rem 0 1.2rem" }}>
    <div style={{ flex: 1, height: "1px", background: "#1a1a2e" }} />
    {label && <span style={{ fontSize: "0.62rem", color: "#2e2e50", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{label}</span>}
    <div style={{ flex: 1, height: "1px", background: "#1a1a2e" }} />
  </div>
);

// Stat box for portfolio summary
const StatBox = ({ label, value, color, sub }) => (
  <div style={{ background: "#0d0d1c", border: `1px solid ${color}33`, borderRadius: "10px", padding: "0.75rem 1rem", flex: 1 }}>
    <div style={{ fontSize: "0.65rem", color: "#4040a0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{label}</div>
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.05rem", fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: "0.65rem", color: "#3a3a60", marginTop: "0.2rem" }}>{sub}</div>}
  </div>
);

const getRating = (pct) => {
  if (pct < 0) return { label: "Operazione in perdita", color: "#ff4d6d", advice: "⚠️ Rivedi il pricing — stai perdendo soldi su questo cliente." };
  if (pct < 8) return { label: "Marginalità critica", color: "#ff9a3c", advice: "⚡ Troppo basso. Considera di ridurre le garanzie o aumentare il premio." };
  if (pct < 15) return { label: "Marginalità accettabile", color: "#f9e040", advice: "✅ Nella norma. Ottimizza il mix di garanzie per migliorare." };
  if (pct < 25) return { label: "Marginalità ottima", color: "#3cffa0", advice: "🚀 Eccellente. Puoi permetterti piccole concessioni per fidelizzare." };
  return { label: "Marginalità premium", color: "#a78bfa", advice: "💎 Margine elevato. Verifica che il prezzo sia competitivo nel mercato." };
};

const PRESETS = [
  { label: "Singoli individui", min: 1, max: 2000, step: 50, default: 48, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
  { label: "Famiglie", min: 1, max: 5000, step: 100, default: 84, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
  { label: "Professionisti", min: 1, max: 15000, step: 250, default: 120, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
  { label: "PMI", min: 1, max: 100000, step: 500, default: 340, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
];

export default function SimulatoreMarginalita({ session, onLogout }) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [premio, setPremio] = useState(48);
  const [volume, setVolume] = useState(1000);
  const [sconto, setSconto] = useState(0);
  const [imposte, setImposte] = useState(21.25);
  const [commissione, setCommissione] = useState(50);
  const [lossRatio, setLossRatio] = useState(15);
  const [costiOp, setCostiOp] = useState(5);
  const [garanzie, setGaranzie] = useState(0);

  const preset = PRESETS[presetIdx];
  const handlePreset = (idx) => {
    const p = PRESETS[idx];
    setPresetIdx(idx);
    setPremio(p.default);
    setVolume(p.volume);
    setSconto(p.sconto);
    setImposte(p.imposte);
    setCommissione(p.commissione);
    setLossRatio(p.lossRatio);
    setCostiOp(p.costiOp);
    setGaranzie(p.garanzie);
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
  const commissioni = (premioNetto * commissione) / 100;
  const sinistri = (premioNetto * lossRatio) / 100;
  const costiOperativi = (premioNetto * costiOp) / 100;
  const ricavoGaranzie = (premioNetto * garanzie) / 100;
  const margineUnitario = premioNetto - commissioni - sinistri - costiOperativi + ricavoGaranzie;
  const marginePerc = (margineUnitario / premio) * 100;

  // --- Totali portafoglio ---
  const premioTotale = premio * volume;
  const premioScontatoTotale = premioScontato * volume;
  const premioNettoTotale = premioNetto * volume;
  const margineTotale = margineUnitario * volume;

  const rating = getRating(marginePerc);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b0b14; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0b0b14; }
        ::-webkit-scrollbar-thumb { background: #2a2a40; border-radius: 4px; }
        input[type=range] { -webkit-appearance: none; appearance: none; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0b0b14 0%, #0f0f1e 60%, #12101c 100%)", fontFamily: "'DM Sans', sans-serif", color: "#eeeeff", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>

        {/* Header */}
        <div style={{ width: "100%", maxWidth: "920px", marginBottom: "1.4rem", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "0.3rem 1rem", background: "#a78bfa22", border: "1px solid #a78bfa44", borderRadius: "99px", marginBottom: "0.9rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#a78bfa", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Sales Tool · Assicurativo B2B</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#fff", marginBottom: "0.4rem" }}>Simulatore di Marginalità</h1>
          <p style={{ color: "#6060a0", fontSize: "0.9rem" }}>Calcola il margine netto in tempo reale prima di ogni offerta</p>
          <div style={{ marginTop: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#3a3a60", fontFamily: "'DM Mono', monospace" }}>{session?.user?.email}</span>
            <button onClick={onLogout} style={{ background: "none", border: "1px solid #2a2a40", borderRadius: "99px", padding: "0.2rem 0.8rem", color: "#4040a0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", cursor: "pointer" }}>Esci</button>
          </div>
        </div>

        {/* Segment selector */}
        <div style={{ width: "100%", maxWidth: "920px", marginBottom: "1.1rem", display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", color: "#3a3a60", alignSelf: "center", marginRight: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Prodotto</span>
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => handlePreset(i)} style={{ padding: "0.4rem 1.1rem", borderRadius: "99px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", border: presetIdx === i ? "1px solid #a78bfa" : "1px solid #2a2a40", background: presetIdx === i ? "#a78bfa22" : "transparent", color: presetIdx === i ? "#a78bfa" : "#4040a0", transition: "all 0.15s" }}>
              {p.label}
              <span style={{ marginLeft: "0.35rem", fontWeight: 400, opacity: 0.55, fontSize: "0.68rem" }}>{formatEur(p.min)}–{formatEur(p.max)}</span>
            </button>
          ))}
        </div>

        {/* Portfolio summary bar */}
        <div style={{ width: "100%", maxWidth: "920px", marginBottom: "1.1rem", display: "flex", gap: "0.7rem" }}>
          <StatBox label="Premi totali lordi" value={formatEur(premioTotale)} color="#a78bfa" sub={`${formatNum(volume)} polizze × ${formatEur(premio)}`} />
          {sconto > 0 && <StatBox label="Dopo sconto" value={formatEur(premioScontatoTotale)} color="#fbbf24" sub={`-${formatEur(scontoEur * volume)} di sconto`} />}
          <StatBox label="Premi netti totali" value={formatEur(premioNettoTotale)} color="#ccaaff" sub="al netto di imposte" />
          <StatBox label="Margine portafoglio" value={formatEur(margineTotale)} color={rating.color} sub={`${formatPct(marginePerc)} sul lordo`} />
        </div>

        <div style={{ width: "100%", maxWidth: "920px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>

          {/* LEFT */}
          <div style={{ background: "#111120", border: "1px solid #1e1e30", borderRadius: "16px", padding: "1.6rem" }}>
            <h2 style={{ fontSize: "0.75rem", color: "#4040a0", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.4rem", fontWeight: 700 }}>Parametri dell'offerta</h2>

            <SliderEuro label="Premio annuo lordo" value={premio} min={preset.min} max={preset.max} step={preset.step} onChange={handlePremio} color="#a78bfa" />

            <SliderInt
              label="Volume polizze"
              sublabel={`Portafoglio lordo → ${formatEur(premioTotale)}`}
              value={volume} min={1} max={10000} step={1}
              onChange={setVolume} color="#38bdf8"
            />

            <Divider label="Condizioni commerciali" />

            <SliderPct
              label="Sconto applicato"
              sublabel={sconto > 0 ? `Premio cliente → ${formatEur(premioScontato)} (- ${formatEur(scontoEur)})` : "Nessuno sconto applicato"}
              value={sconto} min={0} max={100} step={0.5}
              onChange={setSconto} color="#fbbf24"
            />

            <Divider label="Fiscalità" />

            <SliderPct
              label="Imposte sul premio"
              sublabel={`Premio netto → ${formatEur(premioNetto)}`}
              value={imposte} min={0} max={50} step={0.25}
              onChange={setImposte} color="#e879f9"
            />

            <Divider label="Applicati al premio netto" />

            <SliderPct label="Commissione intermediario" value={commissione} min={0} max={70} step={0.5} onChange={setCommissione} color="#60a5fa" />
            <SliderPct label="Loss ratio atteso (sinistri)" value={lossRatio} min={0} max={70} step={0.5} onChange={setLossRatio} color="#f472b6" />
            <SliderPct label="Costi operativi compagnia" value={costiOp} min={3} max={20} step={0.5} onChange={setCostiOp} color="#fb923c" />
            <SliderPct label="Garanzie extra (bassa sinistrosità)" value={garanzie} min={0} max={25} step={0.5} onChange={setGaranzie} color="#3cffa0" />

            <p style={{ marginTop: "0.3rem", fontSize: "0.7rem", color: "#2e2e48", lineHeight: 1.5 }}>Clicca sui valori sottolineati per inserire l'importo esatto</p>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div style={{ background: "#111120", border: "1px solid #1e1e30", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Gauge pct={marginePerc} />
              <Pill label={rating.label} color={rating.color} />
              <p style={{ marginTop: "0.8rem", fontSize: "0.8rem", color: "#6060a0", textAlign: "center", lineHeight: 1.5 }}>{rating.advice}</p>
            </div>

            <div style={{ background: "#111120", border: "1px solid #1e1e30", borderRadius: "16px", padding: "1.5rem", flex: 1 }}>
              <h2 style={{ fontSize: "0.75rem", color: "#4040a0", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem", fontWeight: 700 }}>Breakdown unitario (per polizza)</h2>
              <Row label="Premio lordo" value={formatEur(premio)} />
              {sconto > 0 && <Row label={`Sconto (${sconto}%)`} value={`- ${formatEur(scontoEur)}`} accent="#fbbf24" />}
              {sconto > 0 && <Row label="Premio dopo sconto" value={formatEur(premioScontato)} accent="#fde68a" bold />}
              <Row label={`Imposte (${imposte}%)`} value={`- ${formatEur(imposteTotali)}`} accent="#e879f9" />
              <Row label="Premio netto" value={formatEur(premioNetto)} accent="#ccaaff" bold />
              <div style={{ height: "0.3rem" }} />
              <Row label={`Commissione (${commissione}%)`} value={`- ${formatEur(commissioni)}`} accent="#60a5fa" sub />
              <Row label={`Sinistri attesi (${lossRatio}%)`} value={`- ${formatEur(sinistri)}`} accent="#f472b6" sub />
              <Row label={`Costi operativi (${costiOp}%)`} value={`- ${formatEur(costiOperativi)}`} accent="#fb923c" sub />
              {garanzie > 0 && <Row label={`Garanzie extra (+${garanzie}%)`} value={`+ ${formatEur(ricavoGaranzie)}`} accent="#3cffa0" sub />}
              <div style={{ marginTop: "0.4rem" }}>
                <Row label="Margine per polizza" value={`${formatEur(margineUnitario)} (${formatPct(marginePerc)})`} accent={rating.color} bold />
              </div>
              {volume > 1 && (
                <>
                  <div style={{ margin: "0.8rem 0 0.4rem", height: "1px", background: "#1a1a2e" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#5050a0" }}>× {formatNum(volume)} polizze</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 800, color: rating.color }}>{formatEur(margineTotale)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom tip */}
        <div style={{ width: "100%", maxWidth: "920px", marginTop: "1.1rem", background: "#0d0d1c", border: "1px solid #1a1a2e", borderRadius: "12px", padding: "1rem 1.4rem", display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
          <span style={{ fontSize: "1.1rem", marginTop: "1px" }}>💡</span>
          <p style={{ fontSize: "0.82rem", color: "#6060a0", lineHeight: 1.6 }}>
            <strong style={{ color: "#8080c0" }}>Logica di calcolo:</strong> Sconto → riduce il premio lordo. Imposte → scorporate dal premio scontato. Commissione, LR, costi e garanzie → tutti sul premio netto. Il margine % è sempre calcolato sul lordo iniziale per confrontabilità.
          </p>
        </div>

        <p style={{ marginTop: "1.4rem", fontSize: "0.7rem", color: "#2a2a44" }}>Simulatore indicativo · I valori reali dipendono dal prodotto e dalla compagnia</p>
      </div>
    </>
  );
}
