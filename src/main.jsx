import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { supabase } from "./supabaseClient"
import Auth from "./Auth"
import App from "./App"

function Root() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div style={{ minHeight: "100vh", background: "#0b0b14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid #a78bfa44", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return session ? <App session={session} onLogout={() => supabase.auth.signOut()} /> : <Auth />
}

createRoot(document.getElementById("root")).render(<Root />)
