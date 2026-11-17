#!/usr/bin/env node
// Makes public/social-card.png, the 1280 × 640 picture link previews show
// (iMessage, Slack, X, Discord…): crate's icon, name and tagline beside a
// desktop screenshot. Also usable as crate-ios's social preview on GitHub.
//
//     node scripts/make-social-card.mjs [screenshot] [output]
//
// The screenshot defaults to Claude Code building a chair in SolidCraft; the
// output to
// public/social-card.png.

import sharp from 'sharp';

const W = 1280;
const H = 640;
const SHOT = process.argv[2] ?? 'src/assets/media/solidcraft.png';
const OUT = process.argv[3] ?? 'public/social-card.png';
const SHOT_W = 560;

const shotMeta = await sharp(SHOT).metadata();
const shotH = Math.round((SHOT_W * shotMeta.height) / shotMeta.width);
const radius = 18;
const roundMask = Buffer.from(
	`<svg width="${SHOT_W}" height="${shotH}"><rect width="${SHOT_W}" height="${shotH}" rx="${radius}" ry="${radius}"/></svg>`
);
const shot = await sharp(SHOT)
	.resize(SHOT_W, shotH)
	.composite([{ input: roundMask, blend: 'dest-in' }])
	.png()
	.toBuffer();

const iconMask = Buffer.from(`<svg width="150" height="150"><rect width="150" height="150" rx="34" ry="34"/></svg>`);
const icon = await sharp('src/assets/media/icon.png')
	.resize(150, 150)
	.composite([{ input: iconMask, blend: 'dest-in' }])
	.png()
	.toBuffer();

const font = `font-family="Helvetica Neue, Helvetica, Arial, sans-serif"`;
const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
	<text x="72" y="330" ${font} font-size="104" font-weight="700" fill="#ffffff">crate</text>
	<text x="74" y="398" ${font} font-size="40" font-weight="500" fill="#e6e9ef">Linux desktops on your</text>
	<text x="74" y="448" ${font} font-size="40" font-weight="500" fill="#e6e9ef">iPhone and iPad</text>
	<text x="74" y="504" ${font} font-size="24" fill="#9aa3b2">Ubuntu, Debian and Arch Linux ARM,</text>
	<text x="74" y="536" ${font} font-size="24" fill="#9aa3b2">entirely on the device.</text>
	<text x="74" y="590" ${font} font-size="24" font-weight="600" fill="#7fb0ff">oneamendez.github.io/crate</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 3, background: '#0f1115' } })
	.composite([
		{ input: icon, left: 72, top: 96 },
		{ input: text, left: 0, top: 0 },
		{ input: shot, left: W - SHOT_W - 64, top: Math.round((H - shotH) / 2) },
	])
	.png({ compressionLevel: 9 })
	.toFile(OUT);

console.log(`✓ ${OUT}`);
