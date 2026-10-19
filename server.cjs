const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
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
  '.zip': 'application/zip',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=UTF-8',
  '.woff2': 'font/woff2',
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

    const parsedUrl = req.url.split('?')[0];

    // Direct ZIP Download endpoint
    if (parsedUrl === '/download/zip' || parsedUrl === '/coach-kit.zip' || parsedUrl === '/tactical-coach-mvp.zip') {
      const candidates = ['coach-kit.zip', 'tactical-coach-mvp.zip'].map((f) => path.join(ROOT_DIR, f));
      const zipPath = candidates.find((f) => fs.existsSync(f));
      if (zipPath) {
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${path.basename(zipPath)}"`,
          'Content-Length': fs.statSync(zipPath).size,
        });
        fs.createReadStream(zipPath).pipe(res);
        return;
      }
    }

    // Direct Standalone HTML App Download endpoint
    if (parsedUrl === '/download/html' || parsedUrl === '/tactical_coach_preview.html') {
      const htmlPath = path.join(ROOT_DIR, 'tactical_coach_preview.html');
      if (fs.existsSync(htmlPath)) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Disposition': parsedUrl.includes('download') ? 'attachment; filename="Tactical_Coach_Offline_App.html"' : 'inline',
        });
        fs.createReadStream(htmlPath).pipe(res);
        return;
      }
    }

    // The standalone app under the name coaches actually forward on WhatsApp
    if (parsedUrl === '/coach_kit.html') {
      const htmlPath = path.join(ROOT_DIR, 'tactical_coach_preview.html');
      if (fs.existsSync(htmlPath)) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Disposition': 'attachment; filename="coach_kit.html"',
          'Content-Length': fs.statSync(htmlPath).size,
        });
        fs.createReadStream(htmlPath).pipe(res);
        return;
      }
    }

    // Download Landing Page
    if (parsedUrl === '/download') {
      const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Download Tactical Coach MVP</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #064e3b;
      color: #34d399;
      border: 1px solid #059669;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 8px 0;
      color: #ffffff;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 28px;
    }
    .btn {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 14px 20px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      margin-bottom: 12px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-primary {
      background: #10b981;
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(16,185,129,0.3);
    }
    .btn-primary:hover {
      background: #059669;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
    }
    .btn-secondary:hover {
      background: #334155;
      color: #ffffff;
    }
    .footer-note {
      font-size: 12px;
      color: #64748b;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">TACTICAL COACH · COACH KIT</div>
    <h1>Take it to the pitch</h1>
    <p>
      The offline app is one HTML file — save it, then forward it to every coach on WhatsApp or
      Xender. No internet, no account, no cost. The ZIP has the full project and the built site.
    </p>

    <a href="/coach_kit.html" class="btn btn-primary">
      ⚡ Download the offline app (coach_kit.html)
    </a>

    <a href="/download/zip" class="btn btn-secondary">
      📦 Download full project ZIP (.zip)
    </a>

    <a href="/" class="btn btn-secondary" style="border-color: transparent; color: #94a3b8;">
      ← Open Live Web Studio
    </a>

    <div class="footer-note">
      Zero install required • Runs offline in any browser • Local storage
    </div>
  </div>
</body>
</html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(landingHtml);
      return;
    }

    // Default: Serve SPA from dist
    let reqPath = parsedUrl === '/' || parsedUrl === '' ? '/index.html' : parsedUrl;
    let filePath = path.join(DIST_DIR, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
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

// Start on ports 5173 and 3000
createTacticalServer(5173);
createTacticalServer(3000);
