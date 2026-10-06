import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Mock in-memory data for local Vite dev server
let devBeans: any = null;

function getDevBeans() {
  if (!devBeans) {
    try {
      const seedPath = resolve(__dirname, 'public/coffee/api/seed_beans.json');
      if (fs.existsSync(seedPath)) {
        devBeans = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
      }
    } catch {
      devBeans = {};
    }
  }
  return devBeans;
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'coffee-dev-api-middleware',
      configureServer(server) {
        // Handle /coffee/api in Vite dev server
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/coffee/api')) {
            return next();
          }

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            return res.end();
          }

          const parsedUrl = new URL(req.url, 'http://localhost');
          const path = parsedUrl.pathname.replace(/^\/coffee\/api/, '').replace(/^\//, '');
          const segments = path.split('/');
          const resource = segments[0];
          const param = segments[1] ? decodeURIComponent(segments[1]) : null;

          const currentBeans = getDevBeans();

          if (resource === 'beans') {
            if (req.method === 'GET') {
              res.statusCode = 200;
              return res.end(JSON.stringify(currentBeans));
            }

            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', () => {
                try {
                  const body = JSON.parse(bodyStr || '{}');
                  if (param) {
                    currentBeans[param] = { ...(currentBeans[param] || {}), ...body };
                    res.statusCode = 200;
                    return res.end(JSON.stringify({ status: 'saved', bean: currentBeans[param] }));
                  } else {
                    devBeans = body;
                    res.statusCode = 200;
                    return res.end(JSON.stringify({ status: 'saved', count: Object.keys(body).length }));
                  }
                } catch (e: any) {
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            if (req.method === 'DELETE' && param) {
              delete currentBeans[param];
              res.statusCode = 200;
              return res.end(JSON.stringify({ status: 'deleted', name: param }));
            }
          }

          if (resource === 'chat' && req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', () => {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                response: "Local Dev Mode: Backend simulation active. Deploying to Dreamhost will route through PHP + SQLite."
              }));
            });
            return;
          }

          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        coffee: resolve(__dirname, 'coffee/index.html')
      }
    }
  }
});
