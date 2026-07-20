import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
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
