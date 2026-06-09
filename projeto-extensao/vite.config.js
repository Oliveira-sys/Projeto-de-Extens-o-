import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou plugin equivalente do react
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
