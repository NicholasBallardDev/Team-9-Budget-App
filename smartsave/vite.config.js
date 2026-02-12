import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/n8n': {
        target: 'https://cee-wee.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => {
          // Remove /api/n8n prefix, keep the rest
          const newPath = path.replace(/^\/api\/n8n/, '');
          console.log('Rewriting:', path, '→', newPath);
          return newPath;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📤 Proxying:', req.method, req.url, '→', `https://cee-wee.app.n8n.cloud${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})