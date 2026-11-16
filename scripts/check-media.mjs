#!/usr/bin/env node
// Fails if any image or video the site ships carries metadata: camera or
// phone model, location, dates, software, author, comments, or editor paths.
// Runs before every commit (.githooks/pre-commit) and in CI.
//
//     node scripts/check-media.mjs            # the site's media folders
//     node scripts/check-media.mjs some/file  # just these files or folders

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOTS = ['public', 'src/assets'];
const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.ico']);

// PNG chunks that hold text, Exif or a timestamp. Colour chunks (iCCP, sRGB,
// gAMA, cHRM, cICP) and pixel density (pHYs) say nothing about who or where.
const PNG_BAD = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME']);

function* walk(path) {
	const st = statSync(path, { throwIfNoEntry: false });
	if (!st) return;
	if (st.isDirectory()) {
		for (const name of readdirSync(path)) {
			if (name.startsWith('.')) continue;
			yield* walk(join(path, name));
		}
	} else yield path;
}

function checkPng(buf) {
	const found = [];
	let at = 8;
	while (at + 8 <= buf.length) {
		const len = buf.readUInt32BE(at);
		const type = buf.toString('latin1', at + 4, at + 8);
		if (PNG_BAD.has(type)) found.push(`PNG ${type} chunk`);
		if (type === 'IEND') break;
		at += 12 + len;
	}
	return found;
}

function checkJpeg(buf) {
	const found = [];
	let at = 2;
	while (at + 4 <= buf.length && buf[at] === 0xff) {
		const marker = buf[at + 1];
		if (marker === 0xda) break; // image data follows
		const len = buf.readUInt16BE(at + 2);
		const head = buf.toString('latin1', at + 4, at + 4 + Math.min(len - 2, 30));
		if (marker === 0xe1) found.push(head.startsWith('Exif') ? 'JPEG Exif' : 'JPEG XMP');
		else if (marker === 0xed) found.push('JPEG IPTC/Photoshop');
		else if (marker === 0xfe) found.push('JPEG comment');
		else if (marker === 0xe2 && !head.startsWith('ICC_PROFILE')) found.push('JPEG APP2 (not a colour profile)');
		else if (marker >= 0xe3 && marker <= 0xef && marker !== 0xee) found.push(`JPEG APP${marker - 0xe0}`);
		at += 2 + len;
	}
	return found;
}

function checkWebp(buf) {
	const found = [];
	let at = 12;
	while (at + 8 <= buf.length) {
		const type = buf.toString('latin1', at, at + 4);
		const len = buf.readUInt32LE(at + 4);
		if (type === 'EXIF' || type === 'XMP ') found.push(`WebP ${type.trim()} chunk`);
		at += 8 + len + (len & 1);
	}
	return found;
}

function checkGif(buf) {
	const s = buf.toString('latin1');
	const found = [];
	if (s.includes('\x21\xfe')) found.push('GIF comment');
	if (s.includes('XMP DataXMP')) found.push('GIF XMP');
	return found;
}

function checkSvg(buf) {
	const s = buf.toString('utf8');
	const found = [];
	if (/<metadata[\s>]/i.test(s)) found.push('SVG <metadata>');
	if (/(inkscape|sodipodi):/i.test(s)) found.push('SVG editor attributes');
	if (/\/Users\/|[A-Z]:\\\\/.test(s)) found.push('SVG local file path');
	if (/<!--/.test(s)) found.push('SVG comment');
	return found;
}

// MP4/MOV: user data and metadata boxes (make, model, location, software,
// dates), XMP, and a recording date in the movie, track or media header.
const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf']);
function checkMp4(buf, start = 0, end = buf.length, found = []) {
	let at = start;
	while (at + 8 <= end) {
		let size = buf.readUInt32BE(at);
		const type = buf.toString('latin1', at + 4, at + 8);
		let header = 8;
		if (size === 1) {
			size = Number(buf.readBigUInt64BE(at + 8));
			header = 16;
		} else if (size === 0) size = end - at;
		if (size < header) break;
		if (type === 'udta') found.push('video user data (udta: make, model, location, software or date)');
		else if (type === 'meta') found.push('video metadata (meta)');
		else if (type === 'uuid') found.push('video uuid box (often XMP)');
		else if (type === 'mvhd' || type === 'tkhd' || type === 'mdhd') {
			const version = buf[at + header];
			const created = version === 1
				? Number(buf.readBigUInt64BE(at + header + 4))
				: buf.readUInt32BE(at + header + 4);
			if (created !== 0) found.push(`video recording date (${type})`);
		} else if (CONTAINERS.has(type)) checkMp4(buf, at + header, at + size, found);
		at += size;
	}
	return [...new Set(found)];
}

const CHECKS = {
	'.png': checkPng, '.jpg': checkJpeg, '.jpeg': checkJpeg, '.webp': checkWebp,
	'.gif': checkGif, '.svg': checkSvg, '.mp4': (b) => checkMp4(b), '.ico': () => [],
};

const MEDIA = /\.(png|jpe?g|webp|gif|svg|mp4|ico|heic|heif|avif|mov|m4v|webm|tiff?|bmp|dng|raw)$/i;
const targets = process.argv.slice(2);
let problems = 0;
let checked = 0;
for (const root of targets.length ? targets : ROOTS) {
	for (const file of walk(root)) {
		if (!MEDIA.test(file)) continue;
		const ext = extname(file).toLowerCase();
		const name = relative(process.cwd(), file);
		if (!ALLOWED.has(ext)) {
			console.error(`✗ ${name}: ${ext} isn't allowed. Run npm run media to convert and clean it.`);
			problems++;
			continue;
		}
		checked++;
		const found = CHECKS[ext](readFileSync(file));
		if (found.length) {
			console.error(`✗ ${name}: ${found.join(', ')}`);
			problems++;
		}
	}
}
if (problems) {
	console.error(`\n${problems} file(s) carry metadata. Run npm run media to clean them.`);
	process.exit(1);
}
console.log(`✓ ${checked} media file(s), no metadata.`);
