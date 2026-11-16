#!/usr/bin/env node
// After astro build: crate's site is in dist/crate/. This adds the root of
// oneamendez.github.io beside it: root/index.html (for now, a link on to
// /crate/) and a 404 page, which GitHub Pages looks for at the root.

import { copyFileSync, existsSync } from 'node:fs';

copyFileSync('root/index.html', 'dist/index.html');
if (existsSync('dist/crate/404.html')) copyFileSync('dist/crate/404.html', 'dist/404.html');
console.log('✓ dist/index.html and dist/404.html');
