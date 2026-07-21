/**
 * Backups for the Duit hub.
 *
 * Copies the master database directory (DATA_DIR) into your personal cloud
 * folder (BACKUP_DIR) as a timestamped snapshot. Because BACKUP_DIR is a folder
 * your Google Drive / OneDrive / Dropbox client already syncs, the snapshot is
 * pushed off-device automatically — that is the off-site copy for a no-cloud app.
 *
 * Keeps the most recent 14 snapshots. Run once with "npm run backup", or let
 * index.js schedule it every BACKUP_EVERY_HOURS.
 */
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(process.env.DATA_DIR || './data')
const BACKUP_DIR = process.env.BACKUP_DIR ? path.resolve(process.env.BACKUP_DIR) : null
const EVERY_HOURS = Number(process.env.BACKUP_EVERY_HOURS || 24)
const KEEP = 14

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

function prune() {
  const snaps = fs
    .readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('duit-'))
    .map((e) => e.name)
    .sort()
  while (snaps.length > KEEP) {
    const old = snaps.shift()
    fs.rmSync(path.join(BACKUP_DIR, old), { recursive: true, force: true })
    console.log('[backup] pruned old snapshot', old)
  }
}

function runOnce() {
  if (!BACKUP_DIR) {
    console.warn('[backup] BACKUP_DIR not set in .env — skipping. Point it at a synced cloud folder.')
    return false
  }
  if (!fs.existsSync(DATA_DIR)) {
    console.warn('[backup] DATA_DIR does not exist yet — nothing to back up.')
    return false
  }
  const dest = path.join(BACKUP_DIR, `duit-${stamp()}`)
  copyDir(DATA_DIR, dest)
  prune()
  console.log('[backup] snapshot written ->', dest)
  return true
}

function schedule() {
  if (!BACKUP_DIR) {
    console.warn('[backup] BACKUP_DIR not set — automatic backups disabled. Set it in .env.')
    return
  }
  runOnce()
  setInterval(runOnce, EVERY_HOURS * 60 * 60 * 1000)
  console.log(`[backup] scheduled every ${EVERY_HOURS}h -> ${BACKUP_DIR}`)
}

module.exports = { runOnce, schedule }

// Allow "node backup.js" to run a one-off snapshot.
if (require.main === module) runOnce()
