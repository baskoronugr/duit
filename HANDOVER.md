# Duit — Project Handover & Recap

_Last updated: 21 Jul 2026. Read this first when resuming in a new session._

Duit is a **private, local-first household finance app** for two people (Bas +
Tere). It runs offline on both phones and syncs to a hub on their own Windows PC
over home WiFi. **No cloud, no Supabase, no app stores, ~Rp 0/month.**

---

## 1. Where everything lives

| | |
|---|---|
| **Repo** | https://github.com/baskoronugr/duit — **personal** account `baskoronugr` (baskoro.nugr@gmail.com). **NOT** the work account `baskoronugro-collab` (ninjavan). |
| Local path | `C:\Users\user\Documents\claudeai\personal\Finance` (a dedicated git repo nested inside the `claudeai` workspace). |
| Branch | `main` |
| Frontend | `app/` — Vite + React 19 + TypeScript + Tailwind v4 (CSS `@theme`) + react-router-dom v7 + lucide-react + vite-plugin-pwa + **pouchdb-browser** |
| PC hub | `server/` — Node + Express + express-pouchdb + mkcert HTTPS + mDNS + backup |
| Docs | `PRD.md` (v3.0), `DESIGN_BRIEF.md`, `SETUP.md` (Windows setup), this file |
| Brand refs | `e8c8e77…jpg`, `5477f2eb…webp`, `Mobile Banking App…mp4` |

**Pushing to GitHub from this machine:** Git Credential Manager may still have the
*work* account cached. Plain `git push` opens an interactive dialog that fails in
this environment. Use the token flow (personal account creds are cached):
```bash
CRED=$(printf 'protocol=https\nhost=github.com\nusername=baskoronugr\n\n' | git credential fill 2>/dev/null)
TOKEN=$(printf '%s\n' "$CRED" | sed -n 's/^password=//p')
git remote set-url origin "https://baskoronugr:${TOKEN}@github.com/baskoronugr/duit.git"
GIT_TERMINAL_PROMPT=0 git push origin main
git remote set-url origin https://github.com/baskoronugr/duit.git   # scrub token back out
```
Commit as `baskoro.nugr@gmail.com`; co-author trailer `Claude Opus 4.8 <noreply@anthropic.com>`.

---

## 2. Architecture (PRD v3.0) — local-first, LAN sync

```
 iPhone (Tere) ─┐                          ┌─ PC web (browser)
                ├──  home WiFi (HTTPS)  ──► PC hub (server/)
 Android (Bas) ─┘                          CouchDB-compatible /db (LevelDB on disk)
                                           + nightly backup → personal cloud folder
```

- Each device stores a **full copy** in the browser (PouchDB/IndexedDB) → works 100% offline.
- The **PC hub** (`server/`) is the master store + sync point. Storage = PC disk (free, unlimited).
- Sync is **PouchDB bidirectional replication** when the PC is reachable on WiFi; queues when not.
- **No phone-to-phone sync** without the PC (hub model — accepted trade-off).
- Delivery: **PWA installed via a local mkcert HTTPS cert** at `https://duit.local:5984` (secure context needed for install + service worker; avoids mixed-content).
- **AI is the only thing that leaves the LAN** (opt-in Gemini for receipts/chat).
- Decisions confirmed: **hub OS = Windows**; **backups → a personal cloud-synced folder** (OneDrive/Drive/Dropbox).

---

## 3. Build status (milestones)

**DONE**
- **UI (all 12 designed screens + extras):** Dashboard (swipeable hero carousel w/ blurred balances + eye toggle, profile switch header, spending recap, at-risk, credit card, renewals, goals, portfolio, recent txns, desktop reflow), Quick Add hub + per-type flows (Expense/Income/Transfer/Subscription/Goal/Budget), Accounts (card-stack + money map), Transactions, Budgets (weighted %, month switcher), Goals (rings + savings suggestion), Investments, Receipt scan (capture→review, inline edit), Reprioritize card, Assistant chat, Income, Subscriptions, Full Breakdown (`/summary`), Settings (accounts/cards + Sync-with-PC).
- **Owners:** Bas / Tere only (filter All/Bas/Tere; "Joint" removed). Active user set via header; sets default owner on new entries.
- **M0 — sync foundation:** `server/` hub (verified: boots, `/db` CRUD, PouchDB replication local→hub). App PouchDB layer + live sync + status badge + Settings "Sync with PC". `SETUP.md` for Windows.
- **M1 — all screens on the DB:** every list reads live from PouchDB; every Add flow persists a real, syncing doc; `db.ts` is a generic repository seeding all collections.

**NOT YET DONE (next up)**
- **M2 (recommended next): make derived numbers self-consistent.** Account balances and budget **"spent"** are still *stored* fields, not computed from the transaction ledger. Dashboard hero (net worth / cash / portfolio) and `Summary` still use stored constants from `mockData`, not DB aggregates. Goal `saved` isn't updated by contributions/transfers yet.
- **FX rates**: `derive.ts` uses hardcoded mock rates (`FX_TO_IDR`). Wire a free FX API + manual override.
- **Price feeds**: crypto (CoinGecko), gold (public source) auto; stocks/reksadana manual — none wired yet.
- **M3+**: monthly/yearly reports (real data), AI (Gemini receipt extraction + chat + weight-based reprioritization, proxied through the hub), Telegram bot (on the PC).
- **Edit/delete** of transactions/goals/etc. from the UI (only add + list exist).
- **Real HTTPS/mDNS/cert** only come alive once the user runs `SETUP.md` on the actual PC + phones.

---

## 4. Code map (app/src)

| Path | Purpose |
|---|---|
| `data/db.ts` | **The data layer.** PouchDB instance, generic `listByType/putEntity/removeEntity/newId`, `seedIfEmpty` (seeds all collections), typed helpers (`listTransactions`, `putGoal`, …), sync (`startSync/stopSync/pingHub`), hub URL in localStorage. |
| `data/useCollection.ts` | `useCollection<T>(docType)` hook — reads a collection, refetches on sync change. |
| `data/derive.ts` | Shared math: `toIdr` (mock FX), `monthTotals`, `spentByCategory`, `iconForCategory`. |
| `data/SyncContext.tsx` | Seeds on mount, manages sync state + `changeTick`, hub URL. Wrap point in `main.tsx`. |
| `data/mockData.ts` | **Seed data + all TypeScript types** (Account, Transaction, BudgetCategory, Goal, Holding, Subscription, IncomeEntry) + a few stored aggregate constants still used by the hero/Summary. |
| `theme/ThemeContext.tsx` | Dark/light theme (`data-theme` on `<html>`). |
| `theme/ProfileContext.tsx` | Active member (Bas/Tere) → default owner. |
| `components/` | Screen/Surface, BottomNav (floating pill), ProfileHeader (name switch + sync badge + reveal), OwnerFilter, Carousel, ProgressBar, DonutRing, CategoryIcon, AddShell (shared add-form UI), SyncBadge, SyncSection, TopBar. |
| `pages/` | One file per screen. `pages/add/` holds the per-type Add flows. |
| `App.tsx` | Routes. `main.tsx` | Provider nesting: Theme → Profile → **Sync** → Router. |

**Design tokens** live in `src/index.css` (`--bg #0B0B0D`, surface `#17171B`, violet
gradient `#B44CF6→#7C3AED`, yellow `#F6CE45`, semantic green `#34D399` / red `#F87171`
/ amber `#F59E0B`, Sora font, tabular-nums; light theme via `:root[data-theme=light]`).

**Document model:** ids are `` `${docType}:${id}` `` with a `docType` field; DB name `duit`.

---

## 5. How to run / verify

```bash
# app (dev)
cd app && npm install && npm run dev          # http://localhost:5173
npm run build                                 # tsc -b + vite build (PWA)
npx tsc --noEmit                              # typecheck
npm run lint                                  # oxlint (NOT eslint)

# hub (dev, HTTP mode without a cert)
cd server && npm install
cp .env.example .env                          # set BACKUP_DIR; clear TLS_* for http dev
npm start                                      # boots on :5984, mDNS duit.local
npm run cert                                   # mkcert HTTPS cert (needs mkcert installed)
npm run backup                                 # one-off backup snapshot
```

Full production setup (mkcert cert, phone cert-trust for iOS/Android, firewall,
run-on-login, backups) is in **`SETUP.md`**.

**Environment gotchas on this machine:** no `gh` CLI, no `ffmpeg`. Browser-pane
**screenshots time out** — verify with `get_page_text` / `read_page` / `javascript_tool`
instead. The context-mode hook **blocks HTTP calls made inside Bash commands**
(curl / inline `node -e` with http) — test servers by writing a `.js` file and
running `node file.js`, or use `javascript_tool` in the browser.

**Known fix already applied:** pouchdb-browser + Vite threw
`Class extends value [object Object] is not a constructor`. Fixed via
`npm i events` + `vite.config.ts` `resolve.alias.events='events'` +
`define.global='globalThis'` + `optimizeDeps.include`. Don't remove these.

---

## 6. Product decisions (so you don't re-litigate)

- **Free + local only.** No paid services; no Supabase/cloud (explicitly rejected). AI (Gemini free) is the one exception and is opt-in.
- **Currencies:** IDR (base), USD, JPY, SGD, CNY — data-driven. IDR/JPY no decimals; USD/SGD/CNY 2.
- **Budgets & goals** use **weighted % summing to 100**, not tier labels.
- **Telegram** = quick expense entry only, runs on the PC.
- **Security posture:** local-first = nothing in the cloud; optional device lock; Gemini free tier may train on submitted data (disclosed at point of use).
- **Design:** dark-mode-first premium fintech per the locked brand reference (violet + yellow, stacked-card metaphor, floating pill nav, big bold balances).
- Open questions in `PRD.md §11`: currencies beyond the five; whether AI reprioritization treats upcoming subscriptions as committed spend.

---

## 7. Suggested next actions (in order)

1. **M2 — derive numbers from the ledger:** compute account balances and budget `spent` from transactions; update goal `saved` on contributions; make the dashboard hero + `Summary` use DB aggregates. This makes every number self-consistent as data is added.
2. Wire **FX rates** (free API + manual override) to replace mock `FX_TO_IDR`.
3. **Edit/delete** for transactions and other entities in the UI.
4. **M3:** real monthly/yearly reports.
5. **AI (Gemini)** receipt extraction + chat, proxied through the hub; then **Telegram** bot.
6. Have the user run **`SETUP.md`** on the real PC + phones to bring HTTPS/mDNS/cert/sync fully live.

---

## 8. Commit history (recent, newest first)

- `5c5acdf` M1: migrate all screens to the synced database
- `0afe9b1` M0: local-first sync — PC hub + app PouchDB + sync UI
- `c1040bf` PRD v3.0: pivot to local-first, LAN sync (no cloud/Supabase)
- `890760e` Dashboard header switch, blurred balances, Settings, full breakdown
- `be2a3fe` Refine Duit: owners, add flows, hero carousel, suggestions
- `e90fc47` Scaffold Duit frontend from Claude Design mockup
- `7c67a53` Duit household finance app: PRD v2.1, design brief, brand references
