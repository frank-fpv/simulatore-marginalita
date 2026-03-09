# Architecture — Simulatore di Marginalità
**Wallife · Versione 1.0 · Marzo 2026**

---

## Panoramica

Il Simulatore di Marginalità è una **Single Page Application (SPA)** React ospitata su Vercel, con autenticazione gestita da Supabase e monitoraggio tramite Google Analytics 4. Non ha un backend proprietario — tutta la logica applicativa gira nel browser dell'utente.

```
┌─────────────────────────────────────────────────────┐
│                     BROWSER                         │
│                                                     │
│   ┌─────────────┐        ┌──────────────────────┐   │
│   │  Auth.jsx   │◄──────►│  Supabase Auth       │   │
│   │  (login /   │        │  (email + password)  │   │
│   │  register)  │        └──────────────────────┘   │
│   └──────┬──────┘                                   │
│          │ session                                  │
│   ┌──────▼──────┐        ┌──────────────────────┐   │
│   │   App.jsx   │───────►│  Google Analytics 4  │   │
│   │ (simulatore)│        │  (eventi custom)     │   │
│   └─────────────┘        └──────────────────────┘   │
└─────────────────────────────────────────────────────┘
         ▲
         │ deploy automatico
┌────────┴────────┐        ┌──────────────────────┐
│     Vercel      │◄───────│      GitHub          │
│  (hosting CDN)  │  push  │  (source control)    │
└─────────────────┘        └──────────────────────┘
```

---

## Stack tecnologico

| Layer | Tecnologia | Versione | Ruolo |
|---|---|---|---|
| Frontend framework | React | 18.x | UI e logica applicativa |
| Build tool | Vite | 5.x | Bundling, dev server, env variables |
| Autenticazione | Supabase | JS SDK v2 | Login, registrazione, sessioni |
| Hosting | Vercel | — | Deploy, CDN, HTTPS automatico |
| Source control | GitHub | — | Versioning e trigger deploy |
| Analytics | Google Analytics 4 | gtag.js | Tracciamento eventi utente |

---

## Struttura del progetto

```
simulatore-marginalita/
│
├── index.html                  # Entry point HTML — contiene tag GA4
├── vite.config.js              # Config Vite — inietta VITE_BUILD_TIME
├── package.json                # Dipendenze npm
├── .env.local                  # Variabili d'ambiente locali (NON in Git)
├── .gitignore                  # Esclude node_modules, .env.local
│
└── src/
    ├── main.jsx                # Entry point React — gestisce sessione Supabase
    ├── App.jsx                 # Simulatore principale
    ├── Auth.jsx                # Schermate login / registrazione / reset password
    └── supabaseClient.js       # Inizializzazione client Supabase
```

---

## Componenti principali

### `main.jsx` — Entry point e gestione sessione

Responsabilità:
- Inizializza React
- Ascolta i cambiamenti di sessione Supabase (`onAuthStateChange`)
- Decide quale componente renderizzare: `Auth` (utente non loggato) o `App` (utente loggato)
- Passa `session` e `onLogout` come props

```
main.jsx
├── session === null  →  <Auth />
└── session !== null  →  <App session={session} onLogout={...} />
```

### `Auth.jsx` — Autenticazione

Gestisce tre modalità tramite stato interno:
- `login` — form email + password
- `register` — form registrazione con conferma email
- `forgot` — form reset password via email

Integrazione Supabase:
- `signInWithPassword()` per il login
- `signUp()` per la registrazione
- `resetPasswordForEmail()` per il reset

Traccia eventi GA4: `login_view`, `register_view`, `login_success`, `login_error`, `register_success`, `register_error`, `forgot_password_view`.

### `App.jsx` — Simulatore

Contiene tutta la logica di calcolo della marginalità. I parametri sono gestiti con `useState` e il calcolo è **sincrono e in tempo reale** — non ci sono chiamate API esterne.

Parametri di input:
| Parametro | Tipo | Range |
|---|---|---|
| Premio annuo lordo | € slider | 1€ — varia per prodotto |
| Volume polizze | intero slider | 1 — 1.000.000 |
| Sconto applicato | % slider | 0% — 100% |
| Imposte sul premio | % slider | 0% — 50% |
| Commissione Wallife | % slider | 0% — 70% |
| Commissione intermediario | % slider | 0% — 70% |
| Loss ratio atteso | % slider | 0% — 100% |
| Costi operativi compagnia | % slider | 3% — 20% |
| Garanzie extra | % slider | 0% — 25% |
| Costi sviluppi custom | € input | 0€ — illimitato |

Formula di calcolo (per polizza):
```
premioNetto       = premioLordo × (1 - imposte%)
commissioni       = premioNetto × (commWallife% + commIntermediario%)
sinistri          = premioNetto × lossRatio%
costiOperativi    = premioNetto × costiOp%
costiCustomUnit   = costiCustomTotali ÷ volume
ricavoGaranzie    = premioNetto × garanzie%

margineUnitario   = premioNetto
                  - commissioni
                  - sinistri
                  - costiOperativi
                  - costiCustomUnit
                  + ricavoGaranzie

margineTotale     = margineUnitario × volume
marginePerc       = margineUnitario ÷ premioLordo × 100
```

Traccia eventi GA4: `simulator_view`, `product_selected`, `logout`.

### `supabaseClient.js` — Client Supabase

Inizializza e esporta il client Supabase usando le variabili d'ambiente Vite:

```javascript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## Variabili d'ambiente

| Variabile | Dove | Descrizione |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` + Vercel | URL del progetto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Chiave pubblica Supabase (anon) |
| `VITE_BUILD_TIME` | Iniettata da `vite.config.js` | Timestamp del build, mostrato in UI |

> ⚠️ Le variabili `VITE_*` sono visibili nel bundle JavaScript lato client. La `ANON_KEY` di Supabase è progettata per essere pubblica — la sicurezza è garantita dalle Row Level Security (RLS) di Supabase, non dalla segretezza della chiave.

---

## Autenticazione e sicurezza

### Flusso di autenticazione

```
1. Utente inserisce email + password
2. Auth.jsx chiama supabase.auth.signInWithPassword()
3. Supabase verifica le credenziali
4. Se valide → restituisce un JWT token di sessione
5. main.jsx riceve la sessione via onAuthStateChange
6. React renderizza App.jsx con la sessione attiva
7. Il JWT viene rinnovato automaticamente da Supabase SDK
```

### Email di conferma

Al momento della registrazione, Supabase invia un'email di conferma con link che punta a:
```
https://simulatore-marginalita.vercel.app
```
Il Site URL è configurato nel pannello Supabase → Authentication → URL Configuration.

---

## Deploy e CI/CD

### Flusso di rilascio

```
Sviluppatore
    │
    ├── modifica file in locale (VS Code)
    ├── npm run dev  →  preview su localhost:5173
    │
    ├── commit + push su GitHub (branch: main)
    │
    └── Vercel rileva il push
            ├── esegue npm run build (Vite)
            ├── inietta le variabili d'ambiente
            ├── pubblica su CDN globale
            └── disponibile su simulatore-marginalita.vercel.app
                (tempo medio: 30-60 secondi)
```

### Variabili su Vercel

Le variabili d'ambiente sono configurate manualmente su:
**Vercel → Project Settings → Environment Variables**

Sono impostate su "All Environments" (Production + Preview).

---

## Analytics — Google Analytics 4

Il tag GA4 è incluso in `index.html` e si carica in modo asincrono (`async`) per non bloccare il rendering.

**Measurement ID:** `G-554L8EBJG6`
**Account:** Wallife
**Property:** Simulatore di Marginalità

Gli eventi custom sono inviati tramite la funzione helper `track()` definita in `App.jsx` e `Auth.jsx`:

```javascript
const track = (eventName, params = {}) => {
  if (typeof gtag !== "undefined") gtag("event", eventName, params);
};
```

Il controllo `typeof gtag !== "undefined"` previene errori in sviluppo locale dove GA4 potrebbe non essere caricato.

---

## Limitazioni attuali e sviluppi futuri

| Limitazione | Note |
|---|---|
| Nessun database per i calcoli | I parametri non vengono salvati — ogni sessione riparte da zero |
| Nessuna funzione di export | Non è possibile esportare il risultato in PDF o Excel |
| Nessun storico simulazioni | Non c'è traccia delle simulazioni effettuate per utente |
| Nessun ruolo utente | Tutti gli utenti autenticati hanno gli stessi permessi |
| Prodotti fissi | I 4 prodotti (Singoli, Famiglie, Professionisti, PMI) sono hardcoded |

Possibili evoluzioni:
- Salvataggio simulazioni su Supabase Database
- Export PDF del risultato
- Gestione ruoli (admin vs. sales)
- Configurazione prodotti da pannello admin
- Versione mobile ottimizzata

---

*Architecture — Simulatore di Marginalità · Wallife · v1.0 · Marzo 2026*
