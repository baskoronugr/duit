# Design Brief — Household Finance App ("Duit")

**For:** UI design (Claude design session)
**Companion doc:** `PRD.md` v2.0 — the PRD defines *what* the app does; this brief defines *how it should look and feel*. Where they conflict, the PRD wins on functionality.
**Aligned to PRD v3.0:** local-first (offline on phones, syncs to PC over WiFi); multi-currency (IDR/USD/JPY/SGD/CNY), credit cards & debts, weighted-% budget/goal priorities, reports + spending recap.

**v3 UI additions (built):** dashboard header is a **tappable profile switch** (Hi, Bas! / Tere) — no avatar/bell chrome — with guiding copy; **hero is a swipeable carousel** (Net worth / Cash / Portfolio / Debt) whose **amounts are privacy-blurred by default** with an eye toggle; **Full Breakdown** screen (all metrics consolidated); **Settings → Accounts & cards** to create/name banks, cards, pockets, e-money, cash; per-type **Add hub** flows. Owners are **Bas / Tere** (filter All/Bas/Tere).

---

## 1. What this is

A private, two-person household finance PWA (husband + wife, Indonesia). Tracks expenses (primary), income, accounts and bank pockets, **credit cards and debts**, **multi-currency balances (IDR + USD)**, monthly budgets with **weighted-% priorities**, savings goals, and investments (gold, IDX stocks, reksadana, crypto). It reports spending as a **dashboard recap, a monthly report, and a yearly view**. AI reads receipt/bank screenshots and suggests budget cuts to protect goals. Quick entry also happens via Telegram, so the app itself is where money gets *understood*, not just logged.

**Devices:** Android phone, iPhone, and PC browser. **Design mobile-first** (~360–430px), then scale up to a comfortable desktop layout (max content width, multi-column dashboard). It's an installed-PWA experience: no marketing pages, no onboarding carousel — users land straight in the app.

## 2. Audience & tone

Two specific adults managing their shared money, daily for 10-second interactions and weekly for 5-minute reviews. The look should feel like a **premium, modern consumer banking app** — confident, sleek, and a little bit aspirational — while staying trustworthy and calm underneath. Not gamified, no confetti/mascots/fake urgency; money states (over budget, investment loss) are shown plainly and without shame. Think "the nicest neobank app you've used," scaled down to a private household tool.

## 3. Visual direction — follow the brand reference

**Reference files in the project folder (match this look):**
- `e8c8e77cd1b2cf21a40a86dcaa5f41e1.jpg` — dark premium wallet: near-black canvas, big white balance, dark rounded cards, colorful category dots, brand-logo chips, floating labeled bottom nav.
- `5477f2eb8377667dbca62b9f4434ed54.webp` — light **and** dark home: bold "Hello {name}" greeting, **stacked payment cards** (yellow behind, purple front) with balance/exp/name, circular action buttons (Send/Request/TopUp/More), "Manage Expenses" list with circular category icons, pill-shaped bottom nav.
- `Mobile Banking App UI Design -App Concept - Mobile UX UI_2.mp4` — motion reference for the same family (transitions, card interactions).

**Design language to adopt:**
- **Dark-mode-first, both themes required.** Dark is the primary/default (deep near-black `#0B0B0D`-ish surfaces, layered dark-grey cards); a clean light theme mirrors it. Both pass WCAG AA.
- **Accent palette:** a confident **violet/purple primary** with a **warm yellow secondary**, used on hero cards and key actions — exactly the reference's card colors. Accents are saturated and premium, but used deliberately (hero cards, primary buttons, active states), not smeared everywhere. Neutral dark/grey surfaces carry most of the UI.
- **Semantic set stays strict and separate from brand accents:** income/gain green, expense/loss red, warning amber (budgets ≥80%). Never let a brand accent be mistaken for a semantic signal.
- **The card metaphor is central.** Accounts and credit cards render as **real-looking cards** (rounded ~20–24px radius, subtle gradient/sheen, masked number `**** 3264`, network mark, name, balance), and **stack** when there are several — tap to fan/expand. This is the signature of the app.
- **Typography:** clean geometric/grotesque sans. **Very large, bold display weights** for greetings and balances (the balance is the biggest thing on screen); quiet muted labels. **Tabular figures everywhere** for aligned amounts.
- **Shape & depth:** large corner radii on every surface, soft shadows/elevation, generous padding. Circular icon buttons for primary actions; circular category icons (icon on a tinted disc) in lists.
- **Navigation:** a **floating pill bottom nav** (Home / Payment or Cards / Reports / More), active item labeled and highlighted, with a prominent center **`+`** for Quick Add. Reachable one-handed.
- **Iconography:** one consistent line-icon set; each expense category = a line icon on a colored disc (the reference's colorful category dots).
- **Density:** phone comfortable and thumb-friendly (44px+ targets, bottom-reachable actions); desktop reflows the same cards into 2–3 columns and may use denser tables for transactions/reports.

## 4. Ever-present patterns

- **IDR formatting:** `Rp 1.234.567` (dots as thousand separators, no decimals). Large numbers may compact to `Rp 1,2 jt` in tight spots with full value on tap/hover. Amount inputs accept shorthand (`45k`, `1.2m`) and echo the parsed full value live.
- **Multi-currency (IDR, USD, JPY, SGD, CNY):** each account/holding shows its **native currency** with a subtle currency tag. Per-currency formatting: **IDR** `Rp 1.234.567` and **JPY** `¥12.345` have **no decimals**; **USD** `$1,250.00`, **SGD** `S$1,250.00`, **CNY** `¥1,250.00` use 2 decimals (disambiguate CNY vs JPY yen by the currency tag). Totals also show a **consolidated base-currency (IDR) figure** with a small "≈" and the FX date. Never silently mix currencies in one sum — always convert and label.
- **Weighted priorities:** budget categories and goals carry a **weight %**; design a compact weight control (slider or stepper) plus an always-visible **"total = 100%"** meter that turns amber/red when weights don't sum to 100. Weight should read as *relative importance*, shown as a thin bar or % chip on each row.
- **Owner filter:** a global segmented control — `All · Me · Wife · Joint` — persistent on dashboard and list screens. Every account, transaction, and goal also shows a small owner indicator (e.g. initial avatar chip).
- **The `+` action:** adding an expense is THE primary action of the whole app. A prominent FAB / bottom-bar center button opens Quick Add from anywhere. Target: under 10 seconds to log.
- **Source badges:** transactions show a subtle origin marker — manual / Telegram / screenshot (with thumbnail if a receipt image is attached).
- **Sync trust:** data is shared live between two people; after saving, show a brief, quiet confirmation (no modal celebrations).

## 5. Screens

### 5.1 Dashboard (home) + spending recap
Header like the reference: a **bold greeting** ("Hi, {name}") with avatar and a subtle line ("Let's manage your money"), plus the global owner filter. Then a **hero card / card-stack** showing the headline number. Order of importance: ① **net worth / total money** (accounts + investments − credit cards − debts, base currency) as the hero, ② this month: spent vs total budget (one clear visual), ③ **spending recap** — this month by category (top categories with % share, shown as the reference's colorful category dots/bar), vs last month and vs same month last year, plus a small 6-month trend sparkline, ④ budget categories at risk (≥80% or over), ⑤ credit-card balances + due dates and debts outstanding, ⑥ **upcoming subscription renewals**, ⑦ goals progress snapshot, ⑧ portfolio value + gain, ⑨ recent transactions ("Manage Expenses" list with circular category icons, right-aligned amounts). Respect the owner filter. Desktop: 2–3 column arrangement of the same cards; the spending recap is a hero card.

### 5.2 Quick Add (expense/income/transfer)
The 10-second flow: big amount keypad-first input (shorthand-aware) → category grid (icons, most-used first) → account picker (defaults to last used) → optional note → Save. Tabs or segmented switch for Expense / Income / Transfer. Camera/upload button here too ("scan receipt instead").

### 5.3 Accounts — "money map" (card-stack)
Top: a **stack of account/card visuals** (the signature card metaphor from the reference) — bank accounts, e-money, and credit cards rendered as cards with balance, masked number, currency tag, and network/brand mark; tap to fan the stack and select one. Below the stack, a **hierarchical money map**: institution (bank) → its pockets with balances; e-money and cash flat. Grand total on top is the **consolidated base-currency** figure. Tap a card/account → its transaction history + transfer action. **Credit cards** are visually distinct (owed balance as an "owed" state, a limit-usage bar, available credit, due date). "Add Card/Account" pill action mirrors the reference. Archived accounts hidden by default.

### 5.3b Debts
List of debts owed and money lent (receivables). Each: name, counterparty, current balance vs original, currency, due date, payoff progress bar. Receivables (money others owe you) visually separated from debts you owe. Record-payment action. A header shows total owed vs total lent. These feed net worth on the dashboard.

### 5.4 Transactions
Filterable list (month, category, account, owner, source) grouped by day with daily subtotals. Phone: list rows (icon, note/merchant, account, amount right-aligned). Desktop: table with columns. Tap → detail/edit sheet with attached receipt image if any.

### 5.5 Budgets (weighted)
Month switcher at top. Per-category rows: icon, name, **weight % chip**, progress bar spent vs budget, remaining amount. A persistent **"weights total = 100%"** meter (amber/red if off). States: safe, warning (≥80%, amber), over (red, shows overage). Summary header: total budgeted vs spent vs remaining. Optional "suggest budgets from weights" action that fills each category as weight × pool (editable). Entry point to the AI reprioritization proposal when things are at risk (see 5.8).

### 5.6 Goals (weighted)
Cards per goal: name, owner chip, **weight % chip**, progress ring/bar, saved vs target, projected completion date ("on track for Nov 2026" / "3 months behind"). A "save this month" flow splits an amount across goals **by weight** (accept/override). Contribute action opens a transfer-style flow. Multi-currency goals show native + consolidated. Completed goals celebrate *quietly* (a check state, not fireworks).

### 5.7 Investments
Portfolio header: invested vs current value, total gain in native currency and % (semantic color), plus a **consolidated base-currency** total. Holdings list grouped by asset class (Gold / Stocks / Reksadana / Crypto): name, quantity + unit (`5,2 gram`, `120 unit`), **price currency tag**, current value, gain %. Price freshness matters: auto-updated prices show a timestamp; stale manual prices (>N days) get a subtle "update price" nudge with an inline quick-edit. Holding detail: lot history (buys/sells with per-lot gain).

### 5.6b Subscriptions
A list of recurring commitments, each as a row with a **brand/service logo or icon disc**, name, amount + currency, billing cycle, and **next renewal date** (with a "renews in N days" hint). Header totals: monthly and annualized subscription cost (consolidated). An **upcoming renewals** strip at top (next 30 days). Subtle flags: free-trial ending, price changed, possibly-unused. Add/edit sheet: name, amount, currency, cycle, next date, funding card/account, category, owner. Cancel = mark inactive (kept in history, greyed).

### 5.7b Reports (monthly & yearly)
- **Monthly report:** a clean, printable summary — income vs expense vs savings, category breakdown (table + donut/bar), budget adherence, net cash flow, goal contributions, net-worth change. Month switcher; owner filter; tap a category to drill into its transactions.
- **Yearly view:** 12-month grid (income/expense/net per month), spending-by-category across the year, a net-worth trend line, and year-vs-prior-year totals. Charts must follow the `dataviz` guidance — restrained, tabular figures, semantic colors only.

### 5.8 AI surfaces
- **Extraction review** (after receipt/screenshot scan): the image beside/above editable parsed fields (amount, date, merchant, category, account), confidence shown by highlighting uncertain fields. Primary action "Save", secondary "edit". Never auto-saves.
- **Reprioritization proposal:** a card that reads like advice from a sensible friend: what's at risk, the concrete proposed cuts (category, amount, its priority tag), what it protects. Actions: Apply / Adjust / Dismiss. Applying edits the budgets visibly.
- **Assistant chat:** simple chat panel (a screen on mobile, side panel on desktop) for questions about the household's own data. Plain bubbles; amounts and mini-tables render cleanly. No personality gimmicks.
- If no AI provider is configured, these surfaces show a quiet "AI is off — add a key in Settings" state; nothing else breaks.

### 5.9 Settings
Members & Telegram linking (show linked/unlinked state, one-time code flow), categories manager (icons + **weight %**), **currencies & base currency** (FX rate view + manual override + last-updated), AI provider (Gemini default / Groq / optional Claude key) with the **AI data-usage disclosure**, recurring transactions, theme, data export.

## 6. States to design

Empty states for every list (first-run: friendly one-liner + primary action, no illustrations required), loading skeletons, offline banner ("viewing cached data — changes need a connection"), AI-processing state (scan in progress), AI-failure state (extraction failed → fall through to manual Quick Add with the image still attached), over-budget and goal-behind states (informative, not punitive).

## 7. Accessibility & platform notes

- WCAG AA contrast in both themes; color is never the only signal (pair icons/labels with semantic colors).
- Tabular figures and right-aligned amounts in all lists/tables.
- iOS Safari PWA quirks: respect safe areas (notch/home bar), no hover-dependent interactions.
- Large-text friendliness: layouts must survive 120% font scaling.
- Two-adult privacy: app may be opened in front of others — no sensitive totals in notifications/badges (v1 has none anyway).

## 8. Out of scope for design

Marketing/landing pages, onboarding tours, app-store assets, admin tooling, any screens for users beyond the two members, native-app chrome. The Telegram bot's conversation design is spec'd in the PRD (F9), not part of this visual brief.
