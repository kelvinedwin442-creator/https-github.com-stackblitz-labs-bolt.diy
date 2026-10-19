const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Builds the downloadable project archive for coaches/leagues who want to run or fork this.
 * Only the files needed to run and rebuild the app, plus the standalone offline file.
 *   usage: node make-download-zip.cjs
 */

const root = __dirname;
const out = path.join(root, 'coach-kit.zip');
if (fs.existsSync(out)) fs.unlinkSync(out);

const include = [
  'tactical_coach_preview.html', // the standalone offline app, one file, zero external calls
  'HOW-TO-INSTALL.txt',
  'README-COACH-KIT.md',
  'index.html',
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'bundle-single-file.cjs',
  'server.cjs',
  'make-download-zip.cjs',
  'src',
  'public/manifest.webmanifest',
  'public/sw.js',
  'public/favicon.svg',
  'public/apple-touch-icon.png',
  'dist',
  'research/UED-FORM-INSIGHTS.md',
  'research/VIABILITY-GRASSROOTS.md',
  'research/IMPACT-PIVOT-NIGERIA.md',
];

const really = include.filter((p) => fs.existsSync(path.join(root, p)));

const args = ['-r', '-X', out, ...really];
execFileSync('zip', args, { cwd: root, stdio: 'inherit' });

const kb = fs.statSync(out).size / 1024;
console.log(`\ncoach-kit.zip written — ${kb.toFixed(0)} kB, ${really.length} top-level entries`);
