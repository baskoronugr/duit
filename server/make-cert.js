/**
 * Generates a locally-trusted HTTPS certificate for the hub using mkcert.
 *
 * Prereq: install mkcert once (see SETUP.md). This script then:
 *   1. installs the local CA (mkcert -install) if needed,
 *   2. issues a cert covering duit.local, localhost, and this PC's LAN IPs,
 *   3. writes them to ./certs so index.js can serve HTTPS.
 *
 * The tricky part — trusting the CA on the phones — is a manual step documented
 * in SETUP.md (export the CA with `mkcert -CAROOT` and install it on each phone).
 */
const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const MDNS_HOST = process.env.MDNS_HOST || 'duit.local'
const CERT_DIR = path.resolve('./certs')

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

function has(cmd) {
  try {
    execSync(process.platform === 'win32' ? `where ${cmd}` : `command -v ${cmd}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function main() {
  if (!has('mkcert')) {
    console.error('mkcert is not installed. See SETUP.md → "Install mkcert".')
    process.exit(1)
  }
  fs.mkdirSync(CERT_DIR, { recursive: true })

  console.log('[cert] installing local CA (safe to run repeatedly)…')
  execSync('mkcert -install', { stdio: 'inherit' })

  const names = [MDNS_HOST, 'localhost', '127.0.0.1', ...lanIPs()]
  const certPath = path.join(CERT_DIR, `${MDNS_HOST}.pem`)
  const keyPath = path.join(CERT_DIR, `${MDNS_HOST}-key.pem`)

  console.log('[cert] issuing certificate for:', names.join(', '))
  execSync(`mkcert -cert-file "${certPath}" -key-file "${keyPath}" ${names.map((n) => `"${n}"`).join(' ')}`, {
    stdio: 'inherit',
  })

  const caRoot = execSync('mkcert -CAROOT').toString().trim()
  console.log('\n[cert] done.')
  console.log(`[cert]   cert: ${certPath}`)
  console.log(`[cert]   key:  ${keyPath}`)
  console.log(`\n[cert] To trust this on your phones, install the root CA from:`)
  console.log(`[cert]   ${path.join(caRoot, 'rootCA.pem')}`)
  console.log(`[cert] (see SETUP.md → "Trust the certificate on Android / iPhone")`)
}

main()
