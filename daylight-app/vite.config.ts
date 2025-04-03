// daylight-app/vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa' // Import PWA plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({ // Add PWA configuration
      registerType: 'autoUpdate', // Automatically update service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Include these assets
      manifest: { // Define the web app manifest
        name: 'Daylight Duration App',
        short_name: 'DaylightApp',
        description: 'Shows daylight duration for the same day across months',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
          },
          {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
          },
          {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
          },
      ]
      },
      devOptions: {
        enabled: true // Enable PWA plugin in development mode
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: { // Optional: configure dev server
    port: 5173, // Vite default
    strictPort: true, // Exit if port is already in use
  }
})