import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise the warning threshold to avoid false alarms for large libs like emoji-picker
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching (function form required by Vite 8 / Rolldown)
        manualChunks(id) {
          if (id.includes('node_modules/@zegocloud')) return 'zego-video';
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react';
          if (id.includes('node_modules/react-router-dom')) return 'router';
          if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/react-redux') || id.includes('node_modules/redux-persist')) return 'redux';
          if (id.includes('node_modules/socket.io-client')) return 'socketio';
          if (id.includes('node_modules/emoji-picker-react')) return 'emoji';
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
})
