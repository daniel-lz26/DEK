import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig(({ mode }) => {
  // Load env files from the project root (where .env is located)
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🔧 Vite Config - Environment loaded:', {
    clientId: env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: env.VITE_SPOTIFY_REDIRECT_URI,
    cwd: process.cwd()
  })

  return {
    root: './frontend',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./frontend/src"),
      },
    },
    server: {
      port: 5176,
      host: '127.0.0.1',
      strictPort: true
    },
    // Explicitly pass the environment variables to the client
    define: {
      'import.meta.env.VITE_SPOTIFY_CLIENT_ID': JSON.stringify(env.VITE_SPOTIFY_CLIENT_ID),
      'import.meta.env.VITE_SPOTIFY_REDIRECT_URI': JSON.stringify(env.VITE_SPOTIFY_REDIRECT_URI),
    }
  }
})