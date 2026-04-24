import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        'react-dev-locator',
      ],
    },
  }), tsconfigPaths()],
  optimizeDeps: {
    exclude: ['puppeteer', '@puppeteer/browsers', 'proxy-agent', 'pac-proxy-agent', 'http-proxy-agent', 'socks-proxy-agent']
  },
  build: {
    rollupOptions: {
      external: ['puppeteer', '@puppeteer/browsers', 'proxy-agent', 'pac-proxy-agent', 'http-proxy-agent', 'socks-proxy-agent']
    }
  }
})
