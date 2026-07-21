# Duit — setup guide (Windows PC hub + phones)

This sets up the **local-first** Duit: the app lives offline on your phones and
syncs to a hub on **this Windows PC** over your home WiFi. No cloud, no Supabase,
no app stores. See `PRD.md` §3 for the architecture.

You do this **once**. Total time ~30–40 min.

---

## 0. What you're building

```
 iPhone (Tere) ─┐                         ┌─ PC web (browser)
                ├──  home WiFi  ──►  PC hub (this machine)
 Android (Bas) ─┘        HTTPS            CouchDB-compatible DB (master)
                                          + nightly backup → your cloud folder
```

- Each phone keeps a full copy (works offline).
- When the phone is on home WiFi **and the PC is on**, they two-way sync.
- The PC's database is the master; it's backed up to a cloud-synced folder.

---

## 1. Install prerequisites (PC)

1. **Node.js LTS** — https://nodejs.org (already installed if `node -v` works).
2. **mkcert** (makes a locally-trusted HTTPS certificate):
   - Easiest with Chocolatey: open **PowerShell as Administrator** →
     ```powershell
     choco install mkcert
     ```
   - Or download `mkcert-vX.X.X-windows-amd64.exe` from
     https://github.com/FiloSottile/mkcert/releases, rename it to `mkcert.exe`,
     and put it somewhere on your PATH.

---

## 2. Configure the hub

```bash
cd server
npm install
copy .env.example .env
```

Open `.env` and set:
- `BACKUP_DIR` → a folder your cloud client already syncs, e.g.
  `C:\Users\user\OneDrive\DuitBackups` (create it first).
- Leave `PORT=5984`, `MDNS_HOST=duit.local`, `APP_DIST=../app/dist` as-is.

---

## 3. Make the certificate

```bash
npm run cert
```

This installs a local Certificate Authority and issues a cert for `duit.local`,
`localhost`, and your PC's LAN IP into `server/certs/`. It prints the path to the
**root CA** file (`rootCA.pem`) — you'll need it for the phones in step 6.

> Keep the default cert filenames so `.env`'s `TLS_CERT` / `TLS_KEY` match.

---

## 4. Build the app and start the hub

```bash
cd ../app
npm install
npm run build          # produces app/dist that the hub serves

cd ../server
npm start
```

You should see:
```
[hub] HTTPS up:
      https://duit.local:5984
      https://192.168.1.xx:5984
[hub] sync endpoint: https://duit.local:5984/db/duit
```

Open `https://duit.local:5984` in the PC browser — the app should load with a
green **Synced** badge.

---

## 5. Allow it through the Windows Firewall

First time you run it, Windows may prompt — click **Allow access** on
**Private networks**. If it didn't prompt, run in an **Admin PowerShell**:
```powershell
New-NetFirewallRule -DisplayName "Duit hub" -Direction Inbound -LocalPort 5984 -Protocol TCP -Action Allow -Profile Private
```

---

## 6. Trust the certificate + install the app on each phone

Both phones must be on the **same WiFi** as the PC.

**Copy `rootCA.pem`** (path printed in step 3, or run `mkcert -CAROOT`) to each
phone — email it to yourself, AirDrop, or a USB transfer.

### iPhone (Tere)
1. Open the `rootCA.pem` you copied → **Allow** the profile download.
2. Settings → General → **VPN & Device Management** → install the "mkcert" profile.
3. Settings → General → About → **Certificate Trust Settings** → toggle the
   mkcert CA **ON**. *(This step is required — without it Safari won't trust it.)*
4. In **Safari**, go to `https://duit.local:5984` → it should load with no warning.
5. Share button → **Add to Home Screen**. Open the installed app.
6. In the app: **More → Accounts & cards → Sync with PC**, enter
   `https://duit.local:5984/db`, tap **Test & connect** → expect "Hub reachable".

### Android (Bas)
1. Settings → Security → **Encryption & credentials → Install a certificate →
   CA certificate** → pick `rootCA.pem` (accept the warning).
2. In **Chrome**, go to `https://duit.local:5984` → loads with no warning.
3. Chrome menu → **Add to Home screen / Install app**.
4. In the app: **More → Accounts & cards → Sync with PC**, enter
   `https://duit.local:5984/db`, tap **Test & connect**.

> If `duit.local` doesn't resolve on a phone, use the PC's IP instead
> (`https://192.168.1.xx:5984/db`). The cert covers the IP too. Consider giving
> the PC a **static/reserved IP** in your router so it never changes.

---

## 7. Keep the hub running

- **Run on login:** simplest is to create a shortcut to a `start-hub.bat`
  containing `cd /d %~dp0server && npm start`, then put that shortcut in
  `shell:startup` (Win+R → `shell:startup`).
- For always-on, install it as a Windows service later (e.g. with `nssm`).

---

## 8. Backups

While the hub runs, it copies the database to `BACKUP_DIR` every
`BACKUP_EVERY_HOURS` (default daily) and keeps the last 14 snapshots. Because
that folder is synced by your cloud client, you get an automatic off-site copy.
Run a manual one anytime with `cd server && npm run backup`.

---

## Everyday behavior

- Log expenses on either phone anytime — **works with no internet**.
- Turn the PC on and both phones sync within seconds on the WiFi.
- PC off / away from home → phones keep working and **queue** changes; they sync
  next time they see the hub.
- AI features (receipt scan, chat) need internet and send that item to Google
  Gemini; everything else stays on your devices + PC.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Sync badge stuck "Local only" | Hub URL empty in Settings, or PC unreachable — re-run **Test & connect**. |
| "Couldn't reach the hub" | PC on? Same WiFi? Firewall rule added (step 5)? Try the IP URL. |
| Cert warning in browser | CA not trusted yet — redo step 6 (iPhone needs the *Trust Settings* toggle). |
| `duit.local` won't resolve | Use `https://<PC-IP>:5984/db`; reserve the PC's IP in the router. |
