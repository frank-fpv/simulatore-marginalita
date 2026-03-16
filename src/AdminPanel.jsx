import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const track = (eventName, params = {}) => {
  if (typeof gtag !== "undefined") gtag("event", eventName, params);
};

const ROLE_LABELS = { user: "Utente", admin: "Admin", super_admin: "Super Admin" };
const ROLE_COLORS = { user: "#7C6F65", admin: "#38bdf8", super_admin: "#A4274A" };

const RolePill = ({ role }) => (
  <span style={{
    display: "inline-block", padding: "0.15rem 0.6rem", borderRadius: "99px",
    background: ROLE_COLORS[role] + "22", border: `1px solid ${ROLE_COLORS[role]}55`,
    color: ROLE_COLORS[role], fontSize: "0.7rem", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase"
  }}>{ROLE_LABELS[role] ?? role}</span>
);

export default function AdminPanel({ role, currentUserId, presets, onPresetsChange }) {
  const [tab, setTab] = useState("users");

  // ── USERS TAB STATE ──────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    setUsersLoading(true);
    supabase
      .from("profiles")
      .select("id, email, role, enabled, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setUsers(data ?? []);
        else setUsersError("Errore nel caricamento utenti");
        setUsersLoading(false);
      });
  }, []);

  const handleRoleChange = async (userId, prevRole, newRole) => {
    setSavingId(userId);
    setUsersError(null);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: prevRole } : u));
      setUsersError("Errore nel cambio ruolo");
    } else {
      track("admin_user_role_changed", { target_role: newRole });
    }
    setSavingId(null);
  };

  const handleToggleEnabled = async (userId, prevEnabled) => {
    setSavingId(userId);
    setUsersError(null);
    const newEnabled = !prevEnabled;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: newEnabled } : u));
    const { error } = await supabase
      .from("profiles")
      .update({ enabled: newEnabled, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: prevEnabled } : u));
      setUsersError("Errore nell'aggiornamento stato");
    } else {
      track("admin_user_toggled", { action: newEnabled ? "enabled" : "disabled" });
    }
    setSavingId(null);
  };

  // ── PRODUCTS TAB STATE ───────────────────────────────────────────────
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productError, setProductError] = useState(null);

  const openEdit = (preset) => {
    setEditingId(preset._id);
    setDraft({ ...preset });
    setProductError(null);
  };

  const handleDraftChange = (field, value) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleProductSave = async () => {
    setProductSaving(true);
    setProductError(null);
    const { error } = await supabase
      .from("products")
      .update({
        label: draft.label,
        min: Number(draft.min),
        max: Number(draft.max),
        step: Number(draft.step),
        default_val: Number(draft.default),
        volume: Number(draft.volume),
        sconto: Number(draft.sconto),
        imposte: Number(draft.imposte),
        commissione: Number(draft.commissione),
        loss_ratio: Number(draft.lossRatio),
        costi_op: Number(draft.costiOp),
        garanzie: Number(draft.garanzie),
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft._id);
    if (!error) {
      onPresetsChange(prev => prev.map(p => p._id === draft._id ? { ...draft } : p));
      track("super_admin_product_updated", { product_label: draft.label });
      setEditingId(null);
      setDraft(null);
    } else {
      setProductError("Errore nel salvataggio");
    }
    setProductSaving(false);
  };

  // ── STYLES ───────────────────────────────────────────────────────────
  const tabActive = { background: "#A4274A", color: "#fff", border: "1px solid #A4274A" };
  const tabInactive = { background: "transparent", color: "#A4274A", border: "1px solid #D4C8B8" };

  const inputStyle = {
    width: "100%", background: "#FAF8F5", border: "1px solid #D4C8B8",
    borderRadius: "6px", padding: "0.3rem 0.5rem",
    fontFamily: "'DM Mono', monospace", fontSize: "0.88rem", color: "#1C1C1C", outline: "none"
  };

  const labelStyle = {
    fontSize: "0.7rem", color: "#7C6F65", textTransform: "uppercase",
    letterSpacing: "0.08em", marginBottom: "0.2rem", display: "block",
    fontFamily: "'DM Sans', sans-serif"
  };

  return (
    <div style={{ width: "100%", maxWidth: "920px", margin: "0 auto", paddingTop: "1rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.4rem", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "0.3rem 1rem", background: "#A4274A15", border: "1px solid #a78bfa44", borderRadius: "99px", marginBottom: "0.9rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#A4274A", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Pannello di amministrazione</span>
        </div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#1C1C1C" }}>Gestione</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.4rem", justifyContent: "center" }}>
        <button onClick={() => setTab("users")} style={{ padding: "0.4rem 1.2rem", borderRadius: "99px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", ...(tab === "users" ? tabActive : tabInactive) }}>
          Utenti
        </button>
        {role === "super_admin" && (
          <button onClick={() => setTab("products")} style={{ padding: "0.4rem 1.2rem", borderRadius: "99px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", ...(tab === "products" ? tabActive : tabInactive) }}>
            Prodotti
          </button>
        )}
      </div>

      {/* ── TAB UTENTI ──────────────────────────────────────────────── */}
      {tab === "users" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D8", borderRadius: "16px", padding: "1.6rem" }}>
          <h2 style={{ fontSize: "0.75rem", color: "#A89880", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 700 }}>Utenti registrati</h2>

          {usersError && (
            <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1rem", color: "#be123c", fontSize: "0.8rem" }}>
              {usersError}
            </div>
          )}

          {usersLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
              <div style={{ width: "24px", height: "24px", border: "2px solid #E8E0D8", borderTop: "2px solid #A4274A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr>
                    {["Email", "Ruolo", "Stato", "Azioni"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: "0.65rem", color: "#A89880", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0.5rem 0.8rem", borderBottom: "1px solid #EDE8E2" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const isSelf = u.id === currentUserId;
                    const saving = savingId === u.id;
                    return (
                      <tr key={u.id} style={{ opacity: saving ? 0.6 : 1, transition: "opacity 0.2s" }}>
                        <td style={{ padding: "0.7rem 0.5rem", borderBottom: "1px solid #F5F3F0", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#4a4a70", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.email}
                          {isSelf && <span style={{ marginLeft: "0.4rem", fontSize: "0.65rem", color: "#A89880" }}>(tu)</span>}
                        </td>
                        <td style={{ padding: "0.7rem 0.5rem", borderBottom: "1px solid #F5F3F0" }}>
                          <RolePill role={u.role} />
                        </td>
                        <td style={{ padding: "0.7rem 0.5rem", borderBottom: "1px solid #F5F3F0" }}>
                          <span style={{ display: "inline-block", padding: "0.15rem 0.6rem", borderRadius: "99px", background: u.enabled ? "#3cffa022" : "#ff4d6d22", border: `1px solid ${u.enabled ? "#3cffa055" : "#ff4d6d55"}`, color: u.enabled ? "#16a34a" : "#be123c", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            {u.enabled ? "Attivo" : "Disabilitato"}
                          </span>
                        </td>
                        <td style={{ padding: "0.7rem 0.5rem", borderBottom: "1px solid #F5F3F0" }}>
                          {isSelf ? (
                            <span style={{ fontSize: "0.72rem", color: "#C8B8A8" }}>—</span>
                          ) : (
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                              {/* Role select */}
                              <select
                                value={u.role}
                                disabled={saving}
                                onChange={(e) => handleRoleChange(u.id, u.role, e.target.value)}
                                style={{ background: "#FAF8F5", border: "1px solid #D4C8B8", borderRadius: "6px", padding: "0.2rem 0.4rem", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", cursor: "pointer", outline: "none" }}
                              >
                                <option value="user">Utente</option>
                                <option value="admin">Admin</option>
                                {role === "super_admin" && <option value="super_admin">Super Admin</option>}
                              </select>
                              {/* Enable/disable toggle */}
                              <button
                                onClick={() => handleToggleEnabled(u.id, u.enabled)}
                                disabled={saving}
                                style={{ background: u.enabled ? "#fff1f2" : "#f0fdf4", border: `1px solid ${u.enabled ? "#fecdd3" : "#bbf7d0"}`, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 700, color: u.enabled ? "#be123c" : "#16a34a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {u.enabled ? "Disabilita" : "Abilita"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && (
                <p style={{ textAlign: "center", color: "#A89880", fontSize: "0.85rem", padding: "2rem" }}>Nessun utente trovato</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB PRODOTTI ────────────────────────────────────────────── */}
      {tab === "products" && role === "super_admin" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D8", borderRadius: "16px", padding: "1.6rem" }}>
            <h2 style={{ fontSize: "0.75rem", color: "#A89880", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 700 }}>Prodotti / Preset</h2>
            <p style={{ fontSize: "0.8rem", color: "#9A8878", marginBottom: "1.4rem", lineHeight: 1.5 }}>
              Le modifiche sono immediatamente visibili a tutti gli utenti che effettuano l'accesso dopo il salvataggio.
            </p>

            {productError && (
              <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1rem", color: "#be123c", fontSize: "0.8rem" }}>
                {productError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {presets.map((p) => (
                <div key={p._id ?? p.label}>
                  {/* Card prodotto */}
                  <div style={{ border: "1px solid #E8E0D8", borderRadius: "12px", padding: "1rem 1.2rem", background: editingId === p._id ? "#FAFAF9" : "#F5F3F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif" }}>{p.label}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9A8878", fontFamily: "'DM Mono', monospace", marginTop: "0.2rem" }}>
                        Range: €{p.min.toLocaleString("it-IT")} – €{p.max.toLocaleString("it-IT")} · Step: €{p.step.toLocaleString("it-IT")} · Default: €{p.default.toLocaleString("it-IT")}
                      </div>
                    </div>
                    {editingId === p._id ? (
                      <button onClick={() => { setEditingId(null); setDraft(null); }} style={{ background: "#FAF8F5", border: "1px solid #D4C8B8", borderRadius: "6px", padding: "0.3rem 0.8rem", fontSize: "0.75rem", fontWeight: 700, color: "#7C6F65", cursor: "pointer" }}>
                        Annulla
                      </button>
                    ) : (
                      <button onClick={() => openEdit(p)} style={{ background: "#A4274A15", border: "1px solid #A4274A55", borderRadius: "6px", padding: "0.3rem 0.8rem", fontSize: "0.75rem", fontWeight: 700, color: "#A4274A", cursor: "pointer" }}>
                        Modifica
                      </button>
                    )}
                  </div>

                  {/* Form modifica inline */}
                  {editingId === p._id && draft && (
                    <div style={{ border: "1px solid #A4274A33", borderTop: "none", borderRadius: "0 0 12px 12px", background: "#FFFFFF", padding: "1.4rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>

                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>Nome prodotto</label>
                          <input value={draft.label} onChange={e => handleDraftChange("label", e.target.value)} style={inputStyle} />
                        </div>

                        {[
                          { field: "min", label: "Premio min (€)" },
                          { field: "max", label: "Premio max (€)" },
                          { field: "step", label: "Step slider (€)" },
                          { field: "default", label: "Premio default (€)" },
                          { field: "volume", label: "Volume default (polizze)" },
                        ].map(({ field, label }) => (
                          <div key={field}>
                            <label style={labelStyle}>{label}</label>
                            <input type="number" value={draft[field]} onChange={e => handleDraftChange(field, e.target.value)} style={inputStyle} />
                          </div>
                        ))}

                        <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #EDE8E2", paddingTop: "1rem", marginTop: "0.2rem" }}>
                          <div style={{ fontSize: "0.65rem", color: "#A89880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>Valori default parametri (%)</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
                            {[
                              { field: "sconto", label: "Sconto (%)" },
                              { field: "imposte", label: "Imposte (%)" },
                              { field: "commissione", label: "Commissione Wallife (%)" },
                              { field: "lossRatio", label: "Loss ratio (%)" },
                              { field: "costiOp", label: "Costi operativi (%)" },
                              { field: "garanzie", label: "Garanzie extra (%)" },
                            ].map(({ field, label }) => (
                              <div key={field}>
                                <label style={labelStyle}>{label}</label>
                                <input type="number" step="0.25" value={draft[field]} onChange={e => handleDraftChange(field, e.target.value)} style={inputStyle} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
                        <button onClick={() => { setEditingId(null); setDraft(null); }} style={{ background: "#FAF8F5", border: "1px solid #D4C8B8", borderRadius: "8px", padding: "0.45rem 1.1rem", fontSize: "0.8rem", fontWeight: 700, color: "#7C6F65", cursor: "pointer" }}>
                          Annulla
                        </button>
                        <button onClick={handleProductSave} disabled={productSaving} style={{ background: "#A4274A", border: "1px solid #A4274A", borderRadius: "8px", padding: "0.45rem 1.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#fff", cursor: productSaving ? "not-allowed" : "pointer", opacity: productSaving ? 0.7 : 1 }}>
                          {productSaving ? "Salvataggio…" : "Salva"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
