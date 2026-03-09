# Brand Book — Simulatore di Marginalità
**Wallife · Versione 1.0 · Marzo 2026**

---

## 1. Visione e Definizione del Prodotto

### Cos'è Wallife

Wallife è una insurtech assicurativa con la mission di studiare e coprire i nuovi rischi derivanti dall'evoluzione tecnologica. Opera nel mercato B2B sviluppando prodotti assicurativi innovativi distribuiti attraverso operatori, agenti e reti commerciali.

### Cos'è il Simulatore di Marginalità

Il Simulatore di Marginalità è un tool interno B2B sviluppato per supportare il team commerciale e gli operatori assicurativi di Wallife nella costruzione di proposte commerciali economicamente sostenibili.

Il tool consente di simulare in tempo reale la marginalità di un'offerta assicurativa al variare dei parametri chiave — premio, volume, commissioni, sinistrosità attesa, costi operativi — garantendo che ogni proposta mantenga un livello di margine adeguato per tutti gli attori della filiera: Wallife, il risk carrier e il prospect.

### Il problema che risolve

Prima del simulatore, la valutazione della marginalità di una proposta commerciale richiedeva calcoli manuali, fogli Excel non standardizzati o stime empiriche. Questo esponeva il team a:

- Proposte sottomarginalizzate accettate per errore di calcolo
- Tempi lunghi nella fase di offerta
- Mancanza di un linguaggio comune tra sales, risk e management per valutare la sostenibilità di un deal

Il simulatore elimina questi problemi offrendo un'interfaccia unica, condivisa e in tempo reale.

---

## 2. Target e Comunicazione

### Target di utenti

Il simulatore è rivolto esclusivamente al **team interno Wallife**, in particolare:

- **Sales e account manager** — nella fase di costruzione dell'offerta commerciale al prospect
- **Team operations e risk** — per validare la sostenibilità tecnica della proposta
- **Management** — per monitoring della marginalità media del portafoglio

L'accesso è protetto da autenticazione email/password tramite Supabase. Non è previsto accesso pubblico o da parte di clienti finali.

### Tono di voce

Il simulatore adotta un tono **diretto e tecnico**, coerente con il contesto di un tool B2B professionale.

| Caratteristica | Applicazione |
|---|---|
| **Diretto** | Le informazioni sono presentate senza fronzoli. I numeri sono in primo piano. |
| **Tecnico** | Terminologia assicurativa precisa (loss ratio, premio netto, commissioni, ecc.) |
| **Efficiente** | Ogni interazione ha uno scopo. Nessun elemento decorativo fine a sé stesso. |
| **Non emozionale** | Il tono è funzionale, non persuasivo. Il tool informa, non convince. |

Esempi di micro-copy applicati nel prodotto:
- *"Calcola il margine netto in tempo reale prima di ogni offerta"*
- *"Marginalità ottima"* / *"Attenzione: margine insufficiente"*
- Label come *"Commissione Wallife"*, *"Loss Ratio atteso"*, *"Margine netto totale"*

---

## 3. Identità Visiva e Personalità

### Personalità del brand

Il simulatore riflette la personalità di un **strumento professionale di precisione**: affidabile, leggibile, privo di ambiguità. Non è un prodotto consumer — non deve piacere, deve funzionare bene e comunicare chiaramente.

Aggettivi che descrivono l'identità visiva: **preciso, sobrio, professionale, leggibile, moderno**.

### Color Palette

La palette è **warm gray** con accento bordeaux, scelta per garantire leggibilità prolungata in contesti di lavoro senza affaticare la vista.

| Ruolo | Colore | HEX |
|---|---|---|
| Sfondo principale | Warm gray | `#F5F3F0` |
| Sfondo secondario | Grigio caldo chiaro | `#F2EFEB` |
| Card e superfici | Bianco puro | `#FFFFFF` |
| Bordi | Beige caldo | `#E8E0D8` |
| Testo principale | Antracite | `#1C1C1C` |
| Testo secondario | Grigio medio | `#7C6F65` |
| Testo terziario | Grigio chiaro | `#A89880` |
| Accento primario | Bordeaux Wallife | `#A4274A` |
| Successo / margine positivo | Verde | `#27AE60` |
| Attenzione / margine basso | Arancio | `#F39C12` |
| Pericolo / margine negativo | Rosso | `#E74C3C` |

### Tipografia

| Ruolo | Font | Caratteristiche |
|---|---|---|
| Titoli e interfaccia | **DM Sans** | Sans-serif moderno, pesi 400/700/800 |
| Valori numerici e dati | **DM Mono** | Monospaced, allineamento numerico preciso |

La scelta di DM Mono per i valori numerici è deliberata: garantisce che cifre come `22.715.500 €` siano immediatamente leggibili e confrontabili visivamente.

### Logo e Icone

Il prodotto è identificato dalla pill testuale:

```
SALES TOOL · ASSICURATIVO B2B
```

Presentata come badge tipografico in uppercase con letter-spacing accentuato, colore accento bordeaux `#A4274A` su sfondo trasparente con bordo sottile.

Non è previsto un logo illustrativo dedicato al simulatore — l'identità visiva è affidata interamente alla tipografia e alla palette.

---

## 4. Elementi di Supporto

### Discovery

Non è stata condotta una discovery formale strutturata (interviste, survey, test utente). Il prodotto è nato da un'esigenza operativa diretta identificata internamente dal team Wallife.

Il backlog di interviste e insight è da sviluppare nelle prossime iterazioni del prodotto, in particolare per:
- Validare i parametri predefiniti (loss ratio, costi operativi, commissioni) con il team risk
- Identificare eventuali scenari d'uso non ancora coperti (es. prodotti multi-garanzia, bundle)
- Raccogliere feedback sull'usabilità dalla rete commerciale

### User Flow ad alto livello

```
1. ACCESSO
   └── L'utente raggiunge il simulatore via URL condiviso
   └── Se non autenticato → schermata di login
   └── Primo accesso → registrazione + conferma email
   └── Login riuscito → accesso al simulatore

2. CONFIGURAZIONE OFFERTA
   └── Selezione prodotto (Singoli individui / Famiglie / Professionisti / PMI)
   └── Impostazione premio annuo lordo
   └── Impostazione volume polizze (1 – 1.000.000)
   └── Applicazione sconto commerciale (opzionale)

3. PARAMETRI TECNICI
   └── Imposte sul premio
   └── Commissione Wallife
   └── Commissione intermediario di Wallife (opzionale)
   └── Loss ratio atteso
   └── Costi operativi compagnia
   └── Garanzie extra (opzionale)
   └── Costi sviluppi custom in € (opzionale)

4. LETTURA RISULTATI
   └── Visualizzazione margine netto totale
   └── Gauge di marginalità con rating (ottima / buona / sufficiente / insufficiente)
   └── Breakdown unitario per polizza
   └── Moltiplicatore volume per proiezione portafoglio

5. LOGOUT
   └── L'utente esce dall'applicazione
```

### Metriche di prodotto tracciate (GA4)

Il comportamento degli utenti è monitorato tramite Google Analytics 4 (Measurement ID: `G-554L8EBJG6`) con i seguenti eventi custom:

- `login_view`, `register_view`, `forgot_password_view`
- `login_success`, `login_error`
- `register_success`, `register_error`
- `simulator_view`
- `product_selected` (con parametro `product_name`)
- `logout`

---

## 5. Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | React + Vite |
| Autenticazione | Supabase (email/password) |
| Hosting | Vercel (deploy automatico da GitHub) |
| Repository | GitHub — `frank-fpv/simulatore-marginalita` |
| Analytics | Google Analytics 4 |
| URL produzione | https://simulatore-marginalita.vercel.app |

---

*Brand Book — Simulatore di Marginalità · Wallife · v1.0 · Marzo 2026*
