import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: 3001, //TODO: Check if it is indeed only needed for development
    }
  }
})
