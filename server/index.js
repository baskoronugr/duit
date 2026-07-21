/**
 * Duit local sync hub.
 *
 * Runs on the household PC. Responsibilities:
 *   1. Expose a CouchDB-compatible database at /db (backed by PouchDB/LevelDB on disk)
 *      so the phones and the PC web app replicate to it over the LAN.
 *   2. Serve the built PWA (app/dist) over HTTPS so phones can install it.
 *   3. Advertise `duit.local` on the LAN via mDNS so phones find the PC without an IP.
 *   4. Kick off scheduled backups (see backup.js).
 *
 * Everything is local. No cloud, no external services.
 */
require('dotenv').config()
const fs = require('fs')
const os = require('os')
const path = require('path')
const https = require('https')
const http = require('http')
const express = require('express')
const cors = require('cors')
const compression = require('compression')

const PORT = Number(process.env.PORT || 5984)
const DATA_DIR = path.resolve(process.env.DATA_DIR || './data')
const APP_DIST = process.env.APP_DIST ? path.resolve(process.env.APP_DIST) : null
const MDNS_HOST = process.env.MDNS_HOST || 'duit.local'
const TLS_CERT = process.env.TLS_CERT ? path.resolve(process.env.TLS_CERT) : null
const TLS_KEY = process.env.TLS_KEY ? path.resolve(process.env.TLS_KEY) : null

fs.mkdirSync(DATA_DIR, { recursive: true })

// PouchDB with on-disk LevelDB storage inside DATA_DIR.
const PouchDB = require('pouchdb').defaults({ prefix: DATA_DIR.endsWith(path.sep) ? DATA_DIR : DATA_DIR + path.sep })
const expressPouchDB = require('express-pouchdb')

const app = express()
app.use(compression())
// The phones are served from the same origin, but allow the dev server + LAN origins too.
app.use(cors({ origin: true, credentials: true }))

// Health check — the app pings this to show "hub reachable".
app.get('/hub/health', (_req, res) => {
  res.json({ ok: true, host: MDNS_HOST, time: new Date().toISOString() })
})

// CouchDB-compatible sync endpoint at /db (e.g. https://duit.local:5984/db/duit).
app.use('/db', expressPouchDB(PouchDB, { mode: 'fullCouchDB', configPath: path.join(DATA_DIR, 'pouch-config.json') }))

// Serve the built PWA if provided.
if (APP_DIST && fs.existsSync(APP_DIST)) {
  app.use(express.static(APP_DIST))
  // SPA fallback for client-side routes.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/db') || req.path.startsWith('/hub')) return next()
    res.sendFile(path.join(APP_DIST, 'index.html'))
  })
  console.log(`[hub] serving app from ${APP_DIST}`)
} else {
  console.log('[hub] APP_DIST not set or missing — exposing /db sync endpoint only')
}

function lanIPs() {
  const out = []
  const ifaces = os.networkInterfaces()
  for (const name of Object.keys(ifaces)) {
    for (const net of ifaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) out.push(net.address)
    }
  }
  return out
}

function startMDNS(ip) {
  try {
    const mdns = require('multicast-dns')()
    mdns.on('query', (query) => {
      for (const q of query.questions) {
        if (q.name === MDNS_HOST && (q.type === 'A' || q.type === 'ANY')) {
          mdns.respond({
            answers: [{ name: MDNS_HOST, type: 'A', ttl: 120, data: ip }],
          })
        }
      }
    })
    console.log(`[hub] mDNS advertising ${MDNS_HOST} -> ${ip}`)
  } catch (e) {
    console.warn('[hub] mDNS unavailable:', e.message, '(phones can still use the IP address)')
  }
}

function boot() {
  const ips = lanIPs()
  const ip = ips[0] || '127.0.0.1'
  let server

  if (TLS_CERT && TLS_KEY && fs.existsSync(TLS_CERT) && fs.existsSync(TLS_KEY)) {
    server = https.createServer({ cert: fs.readFileSync(TLS_CERT), key: fs.readFileSync(TLS_KEY) }, app)
    server.listen(PORT, () => {
      console.log(`\n[hub] HTTPS up:`)
      console.log(`      https://${MDNS_HOST}:${PORT}`)
      ips.forEach((a) => console.log(`      https://${a}:${PORT}`))
      startMDNS(ip)
      console.log(`\n[hub] sync endpoint: https://${MDNS_HOST}:${PORT}/db/duit`)
    })
  } else {
    console.warn('[hub] No TLS cert found — starting in HTTP mode (dev only).')
    console.warn('[hub] Run "npm run cert" and set TLS_CERT/TLS_KEY for phone install + secure sync.')
    server = http.createServer(app)
    server.listen(PORT, () => {
      console.log(`\n[hub] HTTP up (dev): http://${ip}:${PORT}`)
      startMDNS(ip)
      console.log(`[hub] sync endpoint: http://${ip}:${PORT}/db/duit`)
    })
  }

  // Schedule backups in-process (also runnable standalone via "npm run backup").
  try {
    require('./backup').schedule()
  } catch (e) {
    console.warn('[hub] backup scheduling skipped:', e.message)
  }
}

boot()
