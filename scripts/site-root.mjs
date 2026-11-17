#!/usr/bin/env node
// After astro build: crate's site is in dist/crate/. This adds the root of
// oneamendez.github.io beside it: every file in root/ (the root's page, which
// for now sends visitors on to /crate/, and robots.txt), and a 404 page, which
// GitHub Pages looks for at the root.

import { copyFileSync, existsSync, readdirSync } from 'node:fs';

for (const name of readdirSync('root')) {
	if (name.startsWith('.')) continue;
	copyFileSync(`root/${name}`, `dist/${name}`);
	console.log(`✓ dist/${name}`);
}
if (existsSync('dist/crate/404.html')) {
	copyFileSync('dist/crate/404.html', 'dist/404.html');
	console.log('✓ dist/404.html');
}
