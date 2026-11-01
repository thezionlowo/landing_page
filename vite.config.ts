import { defineConfig, loadEnv } from 'vite';
import crypto from 'node:crypto';
import accountHandler from './api/account/[...path]';
import paystackHandler from './api/webhook/paystack';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['ZAMERIA_SESSION_SECRET', 'ZAMERIA_SITE_ORIGIN', 'ZAMERIA_BACKEND_URL', 'PAYSTACK_SECRET_KEY']) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }
  return {
  plugins: [react(), {
    name: 'zameria-local-account-api',
    configureServer(server) {
      // Local development only. Deployment always requires a configured secret.
      process.env.ZAMERIA_SESSION_SECRET ||= crypto.randomBytes(32).toString('hex');
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api/account/')) void accountHandler(req, res);
        else if (url.split('?')[0] === '/api/webhook/paystack') void paystackHandler(req, res);
        else next();
      });
    },
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-utils';
          }
        },
      },
    },
  },
  };
});
