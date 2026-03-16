import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { supabase } from "./supabaseClient"
import Auth from "./Auth"
import App from "./App"

const track = (eventName, params = {}) => {
  if (typeof gtag !== "undefined") gtag("event", eventName, params);
};

const FALLBACK_PRESETS = [
  { label: "Singoli individui", min: 1, max: 2000, step: 50, default: 48, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
  { label: "Famiglie", min: 1, max: 5000, step: 100, default: 84, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
  { label: "Professionisti", min: 1, max: 15000, step: 250, default: 120, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
  { label: "PMI", min: 1, max: 100000, step: 500, default: 340, volume: 1000, sconto: 0, imposte: 21.25, commissione: 50, lossRatio: 15, costiOp: 5, garanzie: 0 },
];

function Root() {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(undefined)
  const [presets, setPresets] = useState(FALLBACK_PRESETS)

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Fetch profile when session is available
  useEffect(() => {
    if (!session) return;
    supabase
      .from("profiles")
      .select("id, email, role, enabled")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        setProfile(error ? null : data)
      })
  }, [session])

  // Fetch products once profile is confirmed enabled
  useEffect(() => {
    if (!profile?.enabled) return;
    supabase
      .from("products")
      .select("*")
      .eq("enabled", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPresets(data.map(p => ({
            _id: p.id,
            label: p.label,
            min: p.min,
            max: p.max,
            step: p.step,
            default: p.default_val,
            volume: p.volume,
            sconto: Number(p.sconto),
            imposte: Number(p.imposte),
            commissione: Number(p.commissione),
            lossRatio: Number(p.loss_ratio),
            costiOp: Number(p.costi_op),
            garanzie: Number(p.garanzie),
          })))
        }
        // else: keep FALLBACK_PRESETS
      })
  }, [profile])

  const spinner = (
    <div style={{ minHeight: "100vh", background: "#0b0b14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid #a78bfa44", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  // Still checking auth
  if (session === undefined) return spinner

  // Not logged in
  if (!session) return <Auth />

  // Logged in but profile not yet fetched
  if (profile === undefined) return spinner

  // Profile missing (edge case: signup trigger not fired yet)
  if (profile === null) return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #E8E0D8", borderRadius: "16px", padding: "2rem", maxWidth: "380px", textAlign: "center" }}>
        <p style={{ color: "#7C6F65", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
          Profilo non trovato. Prova ad uscire e rientrare.
        </p>
        <button onClick={() => supabase.auth.signOut()} style={{ background: "#A4274A", border: "none", borderRadius: "8px", padding: "0.5rem 1.4rem", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
          Esci
        </button>
      </div>
    </div>
  )

  // Account disabled
  if (!profile.enabled) {
    track("account_disabled_view")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3F0 0%, #EDE9E4 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800&display=swap');`}</style>
        <div style={{ background: "#fff", border: "1px solid #E8E0D8", borderRadius: "16px", padding: "2rem 2.4rem", maxWidth: "380px", textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", color: "#A4274A", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem" }}>
            Account disabilitato
          </div>
          <p style={{ color: "#7C6F65", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.4rem" }}>
            Il tuo account è stato temporaneamente disabilitato.<br />
            Contatta un amministratore per riattivarlo.
          </p>
          <button onClick={() => supabase.auth.signOut()} style={{ background: "#A4274A", border: "none", borderRadius: "8px", padding: "0.5rem 1.4rem", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
            Esci
          </button>
        </div>
      </div>
    )
  }

  return (
    <App
      session={session}
      profile={profile}
      role={profile.role}
      presets={presets}
      onPresetsChange={setPresets}
      onLogout={() => supabase.auth.signOut()}
    />
  )
}

createRoot(document.getElementById("root")).render(<Root />)
