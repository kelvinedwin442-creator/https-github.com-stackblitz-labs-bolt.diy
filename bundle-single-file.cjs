const fs = require('fs');
const path = require('path');

/**
 * Inlines the built CSS + JS into ONE html file that a coach can send on WhatsApp and open
 * in Chrome with no internet at all.
 *
 * Rules for this file:
 *  - no external requests whatsoever (no webfonts, no CDN, no analytics). A single blocked
 *    request at a pitch with no signal is the whole product failing;
 *  - keep it dependency-free so anyone can run `node bundle-single-file.cjs`.
 */

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

const files = fs.readdirSync(assetsDir);
const jsFile = files.find((f) => f.endsWith('.js'));
const cssFile = files.find((f) => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('Missing built assets. Run `npm run build` first.');
  process.exit(1);
}

const jsCode = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
const cssCode = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');

const singleHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Coach Kit — offline football coaching board</title>
    <meta
      name="description"
      content="Offline football tactics board and drill library. Works with no internet, no account, nothing uploaded. Free."
    />
    <meta name="theme-color" content="#0b1220" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Coach Kit" />
    <!--
      Everything this app needs is inside this one file: no fonts, no CDN, no calls out.
      Send it to another coach on WhatsApp or Xender and it works on their phone too.
      Sessions and voice cues are saved on the device (localStorage; IndexedDB where allowed).
    -->
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

const outPath = path.join(__dirname, 'tactical_coach_preview.html');
fs.writeFileSync(outPath, singleHtml, 'utf8');
const kb = (Buffer.byteLength(singleHtml) / 1024).toFixed(0);
console.log(`Single-file bundle generated: tactical_coach_preview.html (${kb} kB, zero external requests)`);
