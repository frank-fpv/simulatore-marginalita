# Come aggiornare il Simulatore di Marginalità

## Flusso di lavoro

### 1. Chiedi le modifiche a Claude
Vai su [claude.ai](https://claude.ai) e descrivi le modifiche che vuoi fare al simulatore.
Claude ti fornirà il file `App.jsx` aggiornato da scaricare.

---

### 2. Sostituisci il file sul tuo Mac
Apri il **Finder** e naviga in:
```
/Users/andrea/simulatore-marginalita/src/
```
Sostituisci il file `App.jsx` con quello nuovo scaricato da Claude.

---

### 3. Pubblica su GitHub Desktop
1. Apri **GitHub Desktop**
2. Vedrai le modifiche elencate nel tab **"Changes"**
3. Scrivi un messaggio nel campo **"Summary"** (es. `aggiunto campo sconto`)
4. Clicca **"Commit to main"**
5. Clicca **"Push origin"**

---

### 4. Vercel aggiorna il sito automaticamente
Aspetta **30-60 secondi** — il sito pubblico si aggiorna da solo.
Nessuna azione necessaria su Vercel.

---

## Link utili
- **Sito pubblico:** https://simulatore-marginalita.vercel.app
- **Repository GitHub:** https://github.com/frank-fpv/simulatore-marginalita
- **Dashboard Vercel:** https://vercel.com/frank-fpvs-projects/simulatore-marginalita

---

## Note
- **Vite** (`npm run dev`) serve solo per vedere le modifiche in anteprima in locale prima di pubblicare. Non è necessario per il flusso quotidiano.
- Ogni `Push origin` su GitHub Desktop triggera automaticamente un nuovo deploy su Vercel.
- L'unico file che viene modificato normalmente è `src/App.jsx`.