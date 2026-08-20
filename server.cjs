const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
};

function createTacticalServer(port) {
  const server = http.createServer((req, res) => {
    // Permissive headers for preview framing and CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('X-Frame-Options', 'ALLOWALL');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }

    let filePath = path.join(DIST_DIR, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback to index.html for SPA routing
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Tactical Coach running on http://0.0.0.0:${port}`);
  });

  return server;
}

// Start on primary port 5173
createTacticalServer(5173);
// Also start on alternative port 3000
createTacticalServer(3000);
