import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  define: {
    // PouchDB and some transitive deps expect a Node-style `global`.
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // pouchdb-browser does `class … extends EventEmitter`; without a real
      // shim Vite externalizes node's `events` to an empty object and the
      // class extension throws. Point it at the browser-friendly npm package.
      events: 'events',
    },
  },
  optimizeDeps: {
    include: ['pouchdb-browser', 'events'],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Duit',
        short_name: 'Duit',
        description: 'Household finance app',
        theme_color: '#0B0B0D',
        background_color: '#0B0B0D',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
})
