#!/usr/bin/env node
// Cleans images and videos for the site: re-encodes each one with no
// metadata (no camera or phone model, location, dates, software or comments),
// then checks the result with check-media.mjs.
//
//     npm run media                 # everything in incoming/
//     npm run media -- a.png b.mov  # just these
//
// Images (PNG, JPEG, WebP, HEIC) go to src/assets/media/, where Astro makes
// the web sizes. Videos (MOV, MP4, M4V) go to public/media/ as H.264 MP4 with
// no sound, beside a poster image; they need ffmpeg (brew install ffmpeg).
// incoming/ isn't committed, so originals never reach the repository.
//
//     npm run media -- --youtube a.mov  # for uploading, not for the site
//
// --youtube keeps the video and sound exactly as they are (no re-encoding) and
// drops only the metadata: location, device, dates, and the iPhone's timed
// metadata tracks. The result goes to youtube/, which isn't committed either.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const IMAGES = 'src/assets/media';
const VIDEOS = 'public/media';
const MAX_WIDTH = 2400; // wide enough for any screen; Astro makes smaller ones

const slug = (file) =>
	basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const youtube = process.argv.includes('--youtube');
const args = process.argv.slice(2).filter((a) => a !== '--youtube');
if (youtube) {
	if (spawnSync('ffmpeg', ['-version']).status !== 0) {
		console.error('Videos need ffmpeg (brew install ffmpeg).');
		process.exit(1);
	}
	mkdirSync('youtube', { recursive: true });
	const made = [];
	for (const file of args) {
		const out = join('youtube', `${slug(file)}.mp4`);
		// Only the first video and audio streams: an iPhone's MOV also has
		// timed metadata tracks, which can hold location.
		execFileSync('ffmpeg', [
			'-y', '-loglevel', 'error', '-i', file,
			'-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-dn',
			'-map_metadata', '-1', '-map_chapters', '-1',
			'-movflags', '+faststart', '-fflags', '+bitexact',
			out,
		]);
		made.push(out);
		console.log(`✓ ${file} → ${out}`);
	}
	const check = spawnSync('node', ['scripts/check-media.mjs', ...made], { stdio: 'inherit' });
	process.exit(check.status ?? 1);
}
const inputs = args.length
	? args
	: existsSync('incoming')
		? readdirSync('incoming').filter((n) => !n.startsWith('.')).map((n) => join('incoming', n))
		: [];
if (!inputs.length) {
	console.log('Nothing to clean: put files in incoming/ or name them.');
	process.exit(0);
}

const hasFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
mkdirSync(IMAGES, { recursive: true });
mkdirSync(VIDEOS, { recursive: true });
const outputs = [];

for (const file of inputs) {
	const ext = extname(file).toLowerCase();
	const name = slug(file);

	if (['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif'].includes(ext)) {
		let source = file;
		// sharp's prebuilt binaries can't read HEIC; macOS's sips can.
		if (ext === '.heic' || ext === '.heif') {
			source = join(tmpdir(), `${name}-${process.pid}.jpg`);
			execFileSync('sips', ['-s', 'format', 'jpeg', file, '--out', source], { stdio: 'ignore' });
		}
		const keepPng = ext === '.png';
		const out = join(IMAGES, `${name}.${keepPng ? 'png' : 'jpg'}`);
		// rotate() applies the Exif orientation before it's dropped; sharp
		// writes no metadata unless asked, and converts to sRGB.
		let image = sharp(source).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
		image = keepPng ? image.png({ compressionLevel: 9 }) : image.jpeg({ quality: 88, mozjpeg: true });
		await image.toFile(out);
		if (source !== file) rmSync(source);
		outputs.push(out);
		console.log(`✓ ${file} → ${out}`);
	} else if (ext === '.svg') {
		const out = join(IMAGES, `${name}.svg`);
		const svg = readFileSync(file, 'utf8')
			.replace(/<\?xml[^>]*\?>\s*/g, '')
			.replace(/<!--[\s\S]*?-->/g, '')
			.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
			.replace(/<sodipodi:namedview[\s\S]*?(\/>|<\/sodipodi:namedview>)/gi, '')
			.replace(/\s(inkscape|sodipodi):[a-z-]+="[^"]*"/gi, '')
			.replace(/\sxmlns:(inkscape|sodipodi|rdf|cc|dc)="[^"]*"/gi, '');
		writeFileSync(out, svg);
		outputs.push(out);
		console.log(`✓ ${file} → ${out}`);
	} else if (['.mov', '.mp4', '.m4v'].includes(ext)) {
		if (!hasFfmpeg) {
			console.error(`✗ ${file}: videos need ffmpeg (brew install ffmpeg). Skipped.`);
			process.exitCode = 1;
			continue;
		}
		const out = join(VIDEOS, `${name}.mp4`);
		const poster = join(IMAGES, `${name}-poster.jpg`);
		// -map_metadata -1 and -map_chapters -1 drop every tag and chapter;
		// -an drops the sound (loops play muted); bitexact leaves out the
		// encoder's version strings.
		execFileSync('ffmpeg', [
			'-y', '-loglevel', 'error', '-i', file,
			'-map', '0:v:0', '-an', '-map_metadata', '-1', '-map_chapters', '-1',
			'-vf', "scale='min(1920,iw)':-2,fps=30",
			'-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p',
			'-movflags', '+faststart', '-fflags', '+bitexact', '-flags:v', '+bitexact',
			out,
		]);
		const frame = join(tmpdir(), `${name}-${process.pid}.png`);
		execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-frames:v', '1', frame]);
		await sharp(frame).jpeg({ quality: 85, mozjpeg: true }).toFile(poster);
		rmSync(frame);
		outputs.push(out, poster);
		console.log(`✓ ${file} → ${out} (+ ${poster})`);
	} else {
		console.error(`✗ ${file}: not an image or video this script handles. Skipped.`);
		process.exitCode = 1;
	}
}

if (outputs.length) {
	const check = spawnSync('node', ['scripts/check-media.mjs', ...outputs], { stdio: 'inherit' });
	if (check.status !== 0) process.exitCode = 1;
}
