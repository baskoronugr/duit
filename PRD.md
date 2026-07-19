# PRD — Household Finance App (working name: "Duit")

**Version:** 2.1
**Date:** 2026-07-19
**Owner:** Baskoro Adi Nugroho
**Status:** Draft for review

> **v2.1 changes** (from v2.0): currencies fixed to **IDR (base), USD, JPY, SGD, CNY** (extensible); added **subscription tracking** (F13); English UI confirmed; **both members' Telegram linked at launch**; launch on the **host's default subdomain** (custom domain optional later); brand/design reference locked (see DESIGN_BRIEF §3 and the reference image/video files).
>
> **v2.0 changes** (from v1.0): added multi-currency, debt tracking, credit cards, monthly/yearly reports + spending recap; budget/savings priorities changed from 3 tiers to **weighted percentages (sum 100%)**; AI provider set to **free Google Gemini for vision + optional Groq for text**; hard **$0/month** goal reaffirmed; security section expanded (standard security, AI opt-in and on).

---

## 1. Overview

A personal finance web app for a two-person household (Baskoro + wife). It tracks income and — primarily — expenses, shows where money is kept across banks/pockets/e-money/credit cards, tracks debts owed, tracks investments and their growth, manages monthly budgets with weighted priorities, funds savings goals, and reports spending monthly and yearly. AI makes capture effortless (receipt/bank-screenshot extraction) and budgeting smarter (weight-based reprioritization). Quick expense entry is also available through a Telegram bot.

### 1.1 Goals

1. Make logging an expense take **under 10 seconds** (app) or **one Telegram message** (bot).
2. Always answer: *"How much money do we have, where is it, and how much can we still spend this month?"*
3. Show investment growth vs. purchase cost at a glance, across currencies.
4. Protect savings goals: when spending threatens them, reprioritize budgets by their weights to keep goals on track.
5. Give a clear **spending recap** on the dashboard, a **monthly report**, and a **yearly view**.
6. **Run entirely free — a hard requirement.** No paid hosting, database, or AI. AI uses free tiers only; the app must remain fully usable if AI is unavailable.

### 1.2 Non-goals (v1)

- No bank API integrations / automatic transaction imports (screenshots + manual entry instead).
- No native app-store apps — PWA only.
- No full loan **amortization schedules** — debts are tracked as balances + payments, not modeled with per-installment interest tables (can be a later module).
- No users beyond the two household members.
- No paid services of any kind (no paid AI, no paid hosting, no VPS).

---

## 2. Users & Access

| | |
|---|---|
| Users | Exactly 2: Baskoro (Android + PC) and wife (iPhone). |
| Model | **One shared household.** Both users see and can edit all data. |
| Ownership tag | Every account, transaction, savings goal, and holding carries an owner: `Me`, `Wife`, or `Joint`. A global filter switches any view between All / Me / Wife / Joint. |
| Auth | Supabase Auth with Google sign-in. An **email allowlist of exactly two addresses**; anyone else is rejected. |
| Devices | Installable PWA (Add to Home Screen) on Android Chrome, iOS Safari, desktop browsers. |
| Language | **English UI**, IDR-style number formatting. |
| Currencies | **IDR (base), USD, JPY, SGD, CNY** at launch; the list is data-driven so more can be added without code changes. |
| Telegram | **Both members linked at launch** (each links their own account). |
| Domain | Launch on the **host's default subdomain** (e.g. `*.pages.dev`); custom domain is an optional later step. |

---

## 3. Platform & Architecture

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) PWA, mobile-first responsive | One codebase for all three device types |
| Backend / DB | Supabase free tier — Postgres, Auth, Storage, Edge Functions | Free, hosted, real-time sync, row-level security |
| Web hosting | Cloudflare Pages (or Vercel) free tier | Free static hosting, custom domain optional |
| Telegram bot | Telegram Bot API webhook → Supabase Edge Function | No server to run |
| AI | **Provider-agnostic AI layer.** Vision (receipts): **Google Gemini free tier** — the only major free tier with native image understanding. Text (advice/chat): Gemini, optionally routed to **Groq free tier** (fast Llama, generous limits) to spread load. Optional paid Claude API pluggable in Settings for those who want it. | $0 by default |
| FX rates | IDR↔USD (and any added currency) from a free exchange-rate API (e.g. exchangerate.host / Frankfurter), cached daily, manual override allowed. | Free |
| Price feeds | Crypto: CoinGecko free API. Gold: public gold-price source with manual override. Stocks/reksadana: manual entry with staleness reminders. | Free feeds only where reliable |

Sync model: all data lives in Supabase; clients read/write online. v1 requires connectivity to write (offline queue is a possible v2 enhancement).

**Free-tier note:** Google's *free* Gemini tier may use submitted content to improve its models. AI is therefore opt-in per feature and the UI states, at the point of use, that the item is sent to Google. See §7.

---

## 4. Data Model (conceptual)

- **household** — the single shared space. Holds `base_currency` (default IDR) for consolidated totals.
- **member** — 2 rows; maps auth user → display name, owner tag.
- **account** — where money is kept or owed. Fields: name, type (`bank`, `pocket`, `emoney`, `cash`, **`credit_card`**), **currency** (e.g. `IDR`, `USD`), owner, `parent_account_id` (pockets nest under a bank account), current balance (derived; negative = owed for credit cards), archived flag. Credit-card extras: `credit_limit`, `statement_day`, `due_day`.
- **debt** — money owed outside a credit card (loans, BNPL, personal debt, or money you lent = negative debt). Fields: name, kind (`loan`, `bnpl`, `personal`, `receivable`), counterparty, currency, original amount, current balance (derived from payments), owner, optional interest note, optional due date. Not a full amortization schedule — balance + payments only.
- **debt_payment** — dated payment toward a debt (optionally linked to a transfer transaction from a funding account).
- **category** — expense/income categories. Fields: name, icon, kind (`expense`/`income`), **priority_weight** (0–100; expense-category weights within a household sum to 100 — used by budgeting/reprioritization).
- **transaction** — Fields: type (`expense`, `income`, `transfer`, **`debt_payment`**, **`cc_payment`**), amount, **currency + fx_rate_to_base** (captured at entry), date, account (and destination account for transfers/payments), category, owner, note, source (`manual`, `telegram`, `screenshot`), receipt image ref, created-by member. A credit-card *purchase* is an expense on the card account (raises its owed balance); paying the card is a `cc_payment` transfer from a bank account.
- **subscription** — a recurring commitment (Netflix, Spotify, iCloud, insurance, etc.). Fields: name, amount, currency, billing cycle (`monthly`/`quarterly`/`yearly`/custom), next renewal date, funding account/card, category, owner, active flag, optional free-trial-ends date. Generates the expected recurring expense on renewal; feeds an "upcoming renewals" list and a total monthly/yearly subscription cost.
- **budget** — month × category → amount (in base currency). Copied forward each month, editable. Category `priority_weight` drives allocation and reprioritization.
- **goal** — savings goal. Fields: name, target amount, currency, target date (optional), owner, **priority_weight** (0–100; goal weights sum to 100 — used to split available savings), linked account/pocket (optional), funded amount (via contributions).
- **goal_contribution** — dated amounts toward a goal (optionally linked to a transfer transaction).
- **holding** — investment position. Fields: asset type (`gold`, `stock`, `mutual_fund`, `crypto`), symbol/name, unit (`gram`, `share`, `unit`, `coin`), **price currency** (e.g. crypto/USD, gold/IDR), quantity, average buy price per unit (derived from lots), owner.
- **holding_lot** — each buy/sell: date, quantity, price per unit. Enables cost basis and per-lot gain.
- **asset_price** — latest known price per unit per asset, with timestamp and source (`auto`/`manual`).
- **fx_rate** — currency pair → rate, date, source (`auto`/`manual`). Used to convert non-base amounts for consolidated totals and reports.
- **receipt** — uploaded image, AI-extracted JSON, review status.

Balances are derived from transactions (with an opening-balance transaction per account), so account totals, pocket totals, card owed-balances, debts, and consolidated "total money" (converted to base currency) are always consistent. **Net worth = accounts + investments − credit-card balances − debts.**

---

## 5. Features

### F1 — Accounts & money map (multi-currency)
- CRUD accounts with the bank → pocket hierarchy; e-money, cash, and **credit cards** as flat accounts. Each account has a **currency** (IDR default; USD and others supported).
- "Money map" view: total per institution, expandable to pockets, filterable by owner. Amounts shown in native currency with a **consolidated total in base currency (IDR)** using the latest FX rate.
- Transfers between any two accounts (including cross-currency, which captures the FX rate) — never counted as spending.
- **Credit cards** show owed balance vs. credit limit, available credit, and statement/due dates; a card purchase is an expense that increases the owed balance, and paying the card is a transfer from a bank account (`cc_payment`).

### F2 — Expense & income tracking
- Fast add: amount → category → account, with smart defaults (last-used account, today's date). Shorthand amounts accepted (`45k` → 45.000, `1.2m` → 1.200.000).
- Transaction list with filters: month, category, account, owner, source; search on notes.
- Recurring transactions (e.g. salary, subscriptions) auto-post monthly.
- Edit/delete with recalculated balances.

### F3 — Screenshot / receipt capture (AI)
- Upload or camera-capture a **receipt photo** or a **bank/e-wallet app screenshot**.
- AI extracts: amount, merchant, date, suggested category, and (from bank screenshots) the source account.
- **Review-before-save screen** — nothing is committed until the user confirms/corrects the extraction. Corrections are stored to improve future category suggestions.
- Original image kept attached to the transaction (Supabase Storage, 1GB free ≈ years of receipts at phone-photo size).

### F4 — Investments (multi-currency)
- Add holdings with buy lots (date, qty, price/unit) for gold (grams), IDX stocks, reksadana (units), crypto. Each holding's price has its own **currency** (e.g. crypto priced in USD, gold in IDR).
- Current value = qty × latest price. Show per-holding and portfolio: invested amount, current value, gain in native currency and **%**, plus a **consolidated portfolio value in base currency (IDR)**, by owner.
- Prices: crypto auto-refreshed from CoinGecko; gold auto (public source) with manual override; stocks/reksadana manual with a "price is N days old" nudge. FX converted with the latest rate.
- Selling records a realized gain and (optionally) a deposit transaction into a chosen account.

### F5 — Budgeting with weighted priorities
- Monthly budget per expense category (base currency). Each expense category carries a **priority weight (%)**; all expense weights **sum to 100%** — the app shows the running total and warns if it isn't 100.
- The weights express relative importance. Given a total budgetable amount (income − planned savings), the app can **suggest each category's budget as its weight × the pool**, which the user can accept or override.
- Progress bars per category: spent vs budget, color-coded (safe / warning ≥80% / over).
- Month rollover: budgets copy forward; overspend/underspend is reported, not carried.

### F6 — Savings goals (weighted)
- Multiple goals (e.g. "Emergency fund", "Umrah", "New phone"), each with target amount + currency, optional deadline, owner, a **priority weight (%)** (goal weights sum to 100%), and progress.
- A given amount of "money to save this month" is **split across goals by their weights** (with an accept/override step); contribute via transfer (to a linked pocket) or manual entry.
- Projection: at the current average contribution rate, the estimated completion date; "on track / behind" vs. the deadline.

### F7 — AI budget reprioritization (weight-driven)
- Trigger: on demand, or when projected month-end spending threatens goal contributions or exceeds income.
- The AI receives budget vs. actuals, **category and goal weights**, goal targets, and income; it returns a concrete proposal that **respects the weights** — trimming the lowest-weight categories first: *"Dining (8%) is over by Rp 300k; cut it and Hobby (5%) to keep the Umrah goal (weight 30%) on schedule."*
- Proposals are **suggestions with an Apply button** — nothing changes without confirmation. If AI is unavailable, a **deterministic weight-based fallback** produces the same kind of suggestion without any API call.

### F8 — AI assistant
- Chat panel in the app: ask questions about your own data ("How much did we spend on groceries the last 3 months?", "Can we afford X?").
- Runs on the configured provider (Gemini free default / Groq for text / Claude optional). Answers are grounded in the household's data only.

### F9 — Telegram quick entry
- Each member links their personal Telegram account to their app profile via a one-time code (bot only accepts the two linked chat IDs).
- **Text entry:** `lunch 45k gopay` → bot parses amount/category/account, replies with a confirmation summary; expense is tagged to the sender as owner.
- **Photo entry:** send a receipt/bank screenshot → same AI extraction as F3 → bot replies with the parsed result for one-tap confirm (inline buttons) or "edit in app" link.
- Bot does nothing else in v1 (no queries, alerts, or digests).

### F10 — Dashboard & spending recap
- Top: **total money / net worth** (accounts + investments − credit cards − debts, in base currency), this month's spending vs total budget, income this month.
- **Spending recap** block: this month's spending broken down by category (share of total, top categories), vs. last month and vs. the same month last year; a small trend sparkline of the last ~6 months.
- Sections: budget categories at risk, credit-card balances & due dates, debts outstanding, recent transactions, goals progress, portfolio value + gain.
- Everything respects the global owner filter (All / Me / Wife / Joint).

### F11 — Debts & credit cards
- **Credit cards** (as F1 account type): track owed balance, credit limit, available credit, statement/due dates; log purchases as card expenses and payments as `cc_payment` transfers.
- **Debts** (loans, BNPL, personal debt, and money lent as *receivables*): track counterparty, original amount, current balance, currency, optional interest note and due date.
- Record payments (reducing the balance); show total owed, total lent, and payoff progress. Included in net worth.
- Not a full amortization engine — balances and payments only (interest entered as a note or a manual charge).

### F12 — Reports (monthly & yearly)
- **Monthly report**: income vs expense vs savings for the month; category breakdown (table + chart); budget adherence per category; net cash flow; savings-goal contributions; net-worth change over the month. Exportable/printable; owner-filterable.
- **Yearly view**: 12-month grid of income/expense/net per month; spending by category across the year; net-worth trend line; investment gain over the year; year total vs prior year.
- All amounts consolidated to base currency; each report can be filtered by owner and drilled into a category to see its transactions.

### F13 — Subscriptions
- A dedicated view of recurring commitments (streaming, cloud, insurance, memberships): name, amount + currency, billing cycle, next renewal date, funding account/card, category, owner.
- **Upcoming renewals** list (sorted by next date) and a header total: monthly subscription cost and annualized cost (consolidated to base currency).
- On the renewal date the subscription auto-posts its expense (like a recurring transaction) to the linked account/card; the user can skip or adjust an occurrence.
- Flags: free-trial ending soon, price changed vs last cycle, and duplicate/unused suspects surfaced for review. Cancel = mark inactive (history retained).

---

## 6. AI Provider Abstraction

A single internal interface with three operations:
1. `extract_transaction(image)` → structured JSON (amount, currency, date, merchant, category guess, account guess).
2. `suggest_rebalance(budget_state)` → proposal JSON (weight-aware). Has a **deterministic non-AI fallback**.
3. `answer_question(question, data_context)` → text.

Implementations: **Gemini** (default; free tier, includes vision — used for operation 1 and, if desired, 2–3), **Groq** (optional, free; text-only, for operations 2–3), and **Claude** (optional; requires user-supplied API key stored server-side). Provider + keys configurable in Settings. If no provider is configured, F3/F7/F8 gracefully degrade (manual entry works everywhere; F7 uses its deterministic fallback).

---

## 7. Security & Privacy

**Chosen posture (v1): standard security, AI on.** Strong protection against other users and outside attackers; the hosting provider can technically read the database (true for any free hosted service). Acceptable for this household; a client-side encrypted "vault" for the most sensitive fields is a possible later add-on.

- **Auth:** Supabase Auth (Google sign-in) with an **email allowlist of exactly two addresses**; all others rejected.
- **Row-Level Security:** every row scoped to the household; only the two allowlisted members can read/write.
- **Transport & storage:** HTTPS everywhere; database and storage encrypted at rest by the provider. Receipt images in a **private** storage bucket (short-lived signed URLs, never public).
- **Telegram:** webhook validates Telegram's secret token and the two linked chat IDs; all other senders ignored.
- **Secrets:** API keys (Gemini/Groq/Claude/CoinGecko/FX) live in Edge Function secrets, never shipped to the browser.
- **No banking credentials:** the app never connects to real bank/card accounts; nothing that could move money is stored.
- **AI data disclosure (important):** the *free* Gemini tier may use submitted content to improve Google's models. AI is **opt-in per feature** and the UI states, at the point of use, that the specific image/text is sent to Google. Turning AI off (or using a paid provider) avoids this; manual entry never sends anything externally.
- **What "totally secret even from the host" would require (not in v1):** client-side end-to-end encryption with a household passphrase; this would disable server-side AI, search, and some reports. Documented here as a deliberate trade-off the user chose against for v1.

---

## 8. Milestones

| Milestone | Scope | Gate |
|---|---|---|
| **M0 — Foundation** | Supabase project, schema + RLS, Google sign-in with 2-email allowlist, PWA shell deployed | Both users can log in on their own devices |
| **M1 — Core money** | Multi-currency accounts/pockets + **credit cards**, manual expenses/income/transfers, categories, transaction list, dashboard v1 with spending recap | A week of real household use, balances correct |
| **M2 — Budgets, goals & subscriptions** | Monthly budgets with **weighted (%) priorities**, savings goals + weighted split + contributions, recurring transactions, **subscriptions view + upcoming renewals** | Month rollover works; weights sum to 100; goals show correct progress; a subscription auto-posts on renewal |
| **M3 — Debts & reports** | Debts/receivables + credit-card payment flows; **monthly report + yearly view**; net worth | Net worth correct; monthly/yearly figures reconcile |
| **M4 — Investments** | Holdings, lots, price feeds (crypto/gold auto, manual others), multi-currency portfolio gain view, FX rates | Gain % matches manual calculation across currencies |
| **M5 — AI capture** | Screenshot/receipt extraction with review screen (Gemini) | 8/10 receipts extracted correctly on first pass |
| **M6 — Telegram** | Bot linking, text entry, photo entry with confirm buttons | Expense logged from Telegram in one message |
| **M7 — AI advisor** | Weight-driven budget reprioritization (with deterministic fallback) + Q&A chat; Groq/Claude optional providers | Useful proposal generated on real data |

---

## 9. Costs

| Item | Cost |
|---|---|
| Supabase free tier (500MB DB, 1GB storage, Edge Functions) | Rp 0 |
| Cloudflare Pages / Vercel hosting | Rp 0 |
| Telegram Bot API | Rp 0 |
| Gemini free tier (vision) / Groq free tier (text) | Rp 0 |
| CoinGecko + FX-rate free APIs | Rp 0 |
| **Optional** Claude API (only if the user enables it) | pay-per-use, est. < $2/month |

**Total to run as specified: Rp 0/month** (the hard requirement). Claude is the only paid option and is off by default.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Free-tier terms change | Standard Postgres + open stack; data exports cleanly and moves anywhere |
| AI misreads receipts | Mandatory review-before-save screen; manual entry always available |
| Stock/reksadana prices go stale | Staleness badges + gentle reminders; 30-second manual update flow |
| iOS PWA limitations (notifications, storage eviction) | Core flows don't depend on push; data is server-side so eviction loses nothing |
| Supabase project pauses after inactivity (free tier) | Weekly scheduled keep-alive ping; household use itself is regular activity |
| Gemini free tier trains on submitted data | AI opt-in per feature with a clear disclosure at point of use; manual entry sends nothing; paid provider available |
| Gemini free rate limits (were cut in late 2025) | Low personal volume stays within limits; route text to Groq; queue/retry on 429 |
| FX/gold price source unreliable | Cache last good rate; manual override; staleness badge |
| Multi-currency rounding/consolidation errors | Store native amount + captured FX rate per transaction; compute base-currency totals from stored rates, not live re-conversion |

---

## 11. Resolved Decisions & Open Questions

**Resolved (19 Jul 2026):**
- Language: **English UI**.
- Currencies at launch: **IDR (base), USD, JPY, SGD, CNY**; data-driven so more can be added. Note: JPY has **no minor units** (whole yen); formatting is per-currency (IDR/JPY no decimals, USD/SGD/CNY 2 decimals).
- Telegram: **both members linked at launch**.
- Domain: **host's default subdomain** at launch; custom domain optional later.
- Credit cards: track **balance / limit / due date** in v1 (statement itemization deferred).
- **Subscriptions** added as F13.
- Design: follow the locked brand reference (DESIGN_BRIEF §3; reference image + video in the project folder).

**Still open:**
1. Any currencies to add beyond the five above?
2. Should the AI reprioritization also consider upcoming subscription renewals when protecting goals? (Assumed: yes, treat known upcoming subscriptions as committed spend.)
