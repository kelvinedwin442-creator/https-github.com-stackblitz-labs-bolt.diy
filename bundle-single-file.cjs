const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

const files = fs.readdirSync(assetsDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

const jsCode = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
const cssCode = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');

const singleHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Tactical Coach — Football Tactics & Coaching Studio</title>
    <meta name="description" content="Professional football coaching workspace to create, demonstrate, save, and present tactics." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
${cssCode}
    </style>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white overflow-x-hidden min-h-screen">
    <div id="root"></div>
    <script>
${jsCode}
    </script>
  </body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'tactical_coach_preview.html'), singleHtml, 'utf8');
console.log('Single-file bundle generated at tactical_coach_preview.html');
