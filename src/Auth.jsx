import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error"|"success", text }

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ type: "error", text: "Email o password non corretti." });
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);
    if (password.length < 6) {
      setMessage({ type: "error", text: "La password deve essere di almeno 6 caratteri." });
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Registrazione completata! Controlla la tua email per confermare l'account." });
    setLoading(false);
  };

  const handleForgot = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Email inviata! Controlla la tua casella di posta." });
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    background: "#FAF8F5", border: "1px solid #D4C8B8",
    borderRadius: "8px", color: "#1C1C1C",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
    outline: "none", marginBottom: "0.8rem",
    boxSizing: "border-box"
  };

  const btnStyle = {
    width: "100%", padding: "0.8rem",
    background: "#A4274A", border: "none", borderRadius: "8px",
    color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
    opacity: loading ? 0.6 : 1, marginTop: "0.4rem"
  };

  const linkStyle = {
    background: "none", border: "none", color: "#A4274A",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
    cursor: "pointer", textDecoration: "underline", padding: 0
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@700&family=DM+Sans:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F3F0; }
        input::placeholder { color: #B8A898; }
        input:focus { border-color: #A4274A !important; }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F5F3F0 0%, #F2EFEb 60%, #EDE9E4 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", padding: "2rem 1rem"
      }}>
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-block", padding: "0.3rem 1rem", background: "#A4274A15", border: "1px solid #A4274A40", borderRadius: "99px", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.72rem", color: "#A4274A", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Sales Tool · Assicurativo B2B</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#1C1C1C", marginBottom: "0.3rem" }}>
            Simulatore di Marginalità
          </h1>
          <p style={{ color: "#A89880", fontSize: "0.85rem" }}>
            {mode === "login" && "Accedi per continuare"}
            {mode === "register" && "Crea il tuo account"}
            {mode === "forgot" && "Recupera la password"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "400px",
          background: "#ffffff", border: "1px solid #e8d0d8",
          borderRadius: "16px", padding: "2rem"
        }}>

          {/* Message */}
          {message && (
            <div style={{
              padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.2rem",
              background: message.type === "error" ? "#ff4d6d22" : "#3cffa022",
              border: `1px solid ${message.type === "error" ? "#ff4d6d44" : "#3cffa044"}`,
              color: message.type === "error" ? "#ff4d6d" : "#3cffa0",
              fontSize: "0.85rem", lineHeight: 1.5
            }}>
              {message.text}
            </div>
          )}

          <input
            type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          {mode !== "forgot" && (
            <input
              type="password" placeholder="Password (min. 6 caratteri)"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
              style={inputStyle}
            />
          )}

          {mode === "login" && (
            <>
              <button onClick={handleLogin} disabled={loading} style={btnStyle}>
                {loading ? "Accesso in corso..." : "Accedi"}
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.2rem" }}>
                <button onClick={() => { setMode("register"); setMessage(null); }} style={linkStyle}>
                  Crea account
                </button>
                <button onClick={() => { setMode("forgot"); setMessage(null); }} style={linkStyle}>
                  Password dimenticata?
                </button>
              </div>
            </>
          )}

          {mode === "register" && (
            <>
              <button onClick={handleRegister} disabled={loading} style={btnStyle}>
                {loading ? "Registrazione in corso..." : "Registrati"}
              </button>
              <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
                <button onClick={() => { setMode("login"); setMessage(null); }} style={linkStyle}>
                  Hai già un account? Accedi
                </button>
              </div>
            </>
          )}

          {mode === "forgot" && (
            <>
              <button onClick={handleForgot} disabled={loading} style={btnStyle}>
                {loading ? "Invio in corso..." : "Invia email di recupero"}
              </button>
              <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
                <button onClick={() => { setMode("login"); setMessage(null); }} style={linkStyle}>
                  Torna al login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
