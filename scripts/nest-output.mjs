// After `astro build`, move the output into dist/lab/wireframe-kit so the files sit at the
// same path they're served from (ogrigore.design/lab/wireframe-kit). No rewrites needed.
import fs from 'node:fs';
const tmp = 'dist-tmp';
fs.rmSync(tmp, { recursive: true, force: true });
fs.renameSync('dist', tmp);
fs.mkdirSync('dist/lab', { recursive: true });
fs.renameSync(tmp, 'dist/lab/wireframe-kit');
fs.writeFileSync('dist/index.html', '<!doctype html><meta http-equiv="refresh" content="0; url=/lab/wireframe-kit/"><link rel="canonical" href="/lab/wireframe-kit/"><a href="/lab/wireframe-kit/">Wireframe Kit</a>');
console.log('Output nested at dist/lab/wireframe-kit');
