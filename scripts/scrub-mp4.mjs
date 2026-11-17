#!/usr/bin/env node
// Cleans MP4 files in place without re-encoding (no ffmpeg needed): zeroes the
// creation and modification dates in the movie, track and media headers, and
// turns user-data, metadata and uuid boxes (make, model, location, software,
// XMP) into free space, which players skip. check-media.mjs then passes them.
//
//     node scripts/scrub-mp4.mjs public/media/showcase.mp4

import { readFileSync, writeFileSync } from 'node:fs';

const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf']);

function scrub(buf, start, end, changes) {
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
		if (type === 'udta' || type === 'meta' || type === 'uuid') {
			buf.write('free', at + 4, 'latin1');
			buf.fill(0, at + header, at + size);
			changes.push(`${type} → free`);
		} else if (type === 'mvhd' || type === 'tkhd' || type === 'mdhd') {
			const version = buf[at + header];
			const width = version === 1 ? 8 : 4;
			buf.fill(0, at + header + 4, at + header + 4 + 2 * width); // creation, modification
			changes.push(`${type} dates zeroed`);
		} else if (CONTAINERS.has(type)) scrub(buf, at + header, at + size, changes);
		at += size;
	}
}

for (const file of process.argv.slice(2)) {
	const buf = readFileSync(file);
	const changes = [];
	scrub(buf, 0, buf.length, changes);
	writeFileSync(file, buf);
	console.log(`✓ ${file}: ${changes.length ? [...new Set(changes)].join(', ') : 'nothing to clean'}`);
}
