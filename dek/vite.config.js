import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  root: './frontend',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src"),
    },
  },
  server: {
    port: 5176,
    host: '127.0.0.1', //keep this for spotify it needs to be this port and not local host bc spotify doesnt take localhost
    strictPort: true
  }
})
