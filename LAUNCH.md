# Launch checklist

The site is private and not published. GitHub Pages is off, and the Deploy
workflow only runs when started by hand. Nothing below happens without the
owner's go-ahead.

## Before launch

- [x] The social card: `public/social-card.png` (`scripts/make-social-card.mjs`),
      in every page's link-preview tags.
- [ ] `npm run build` passes, which also checks that no image or video carries
      metadata.

## Launch (each step needs the owner's OK)

1. Make this repository public (free), or keep it private on GitHub Pro.
2. Settings › Pages › Build and deployment › Source: **GitHub Actions**.
3. Actions › Deploy › Run workflow. The site appears at
   https://oneamendez.github.io/crate/ a minute later.
4. Set https://oneamendez.github.io/crate/ as crate-ios's website (repo › About ›
   Website), and upload `public/social-card.png` as its social preview (repo
   Settings › General › Social preview).
5. Search engines: add https://oneamendez.github.io/ to Google Search Console
   and Bing Webmaster Tools. Their verification file goes in `root/` (it's
   published at the site's root), then submit
   https://oneamendez.github.io/crate/sitemap-index.xml in each.

## Adding pictures and videos

Put originals in `incoming/` (never committed), then:

    npm run media

Images come out in `src/assets/media/` and videos in `public/media/`, re-encoded
with no metadata: no location, device, dates or software. The pre-commit hook and
CI refuse any image or video that still has some.

For a video to upload to YouTube instead, this drops the metadata without
re-encoding and writes to `youtube/`:

    npm run media -- --youtube incoming/my-video.mov

Videos need ffmpeg: `brew install ffmpeg`. An MP4 that's already encoded can be
cleaned without it, in place: `node scripts/scrub-mp4.mjs file.mp4` zeroes its
dates and blanks its metadata boxes.

## Pictures and videos on the site

Done, all cleaned of metadata:

- Videos: the showcase (hero), the external monitor, the GPU (glmark2 and the
  WebGL Aquarium), and the iPad with keyboard and trackpad.
- Screenshots: the Ubuntu and KDE desktops, SolidCraft, Chrome on GitHub,
  Chrome's GPU page, the monitor photo, the Displays settings, the serial
  console, the Install tab and the account sheet.

No placeholders are left on the site.

What's on screen isn't metadata, so check it yourself in new screenshots: names,
notifications, Wi-Fi names and browser history or suggestions.

No more videos are planned for now, and the site embeds none from YouTube. The
`YouTube` component is there if that changes: it loads nothing from Google until
someone presses play.
