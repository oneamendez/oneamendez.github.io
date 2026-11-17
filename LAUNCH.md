# Launch checklist

The site is private and not published. GitHub Pages is off, and the Deploy
workflow only runs when started by hand. Nothing below happens without the
owner's go-ahead.

## Before launch

- [ ] Every placeholder replaced (the dashed boxes in the preview; the lists
      below name each one).
- [ ] The social card made (1280 × 640: icon, "crate", the tagline, a desktop
      screenshot) and added to `astro.config.mjs`'s `head`, and as crate-ios's
      social preview (repo Settings › General › Social preview).
- [ ] The YouTube IDs filled in (`<YouTube id="…">`), the videos still unlisted
      until launch day.
- [ ] `npm run build` passes, which also checks that no image or video carries
      metadata.

## Launch (each step needs the owner's OK)

1. Make this repository public (free), or keep it private on GitHub Pro.
2. Settings › Pages › Build and deployment › Source: **GitHub Actions**.
3. Actions › Deploy › Run workflow. The site appears at
   https://oneamendez.github.io/crate/ a minute later.
4. Set https://oneamendez.github.io/crate/ as crate-ios's website (repo › About ›
   Website), and switch the YouTube videos to public.

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

## Clips for the site (short, muted, looping)

Each 8–15 s, real time unless labelled, recorded at full resolution. Screen
recordings: Control Center › Screen Recording, with Do Not Disturb on and the
microphone off.

| | Where | What |
|---|---|---|
| A | Home, hero | **Done:** `public/media/showcase.mp4`, 21 s at 60 fps from three recordings (Duo boot and Claude Code, an iPad Chrome search, Big Buck Bunny playing on YouTube in real time), sped-up parts captioned. Big Buck Bunny is CC BY 3.0: keep its credit under the clip. |
| B | Home, Features, Gallery | **Done:** `public/media/monitor.mp4`, 15 s from a camera recording: plugging the Duo into a monitor, Ubuntu filling it, the phone as trackpad and keyboard. Sped-up parts captioned. |
| D | Home, Features, Gallery | **Done:** `public/media/gpu.mp4`, 18 s in real time: four glmark2 scenes (score 1092) and the WebGL Aquarium with 500 fish at about 60 fps, on the Duo. |
| G | Features, Gallery | **Done:** `public/media/ipad.mp4`, 13.5 s from a camera recording, cropped to the iPad: the keyboard opens the app grid and types in Chrome, the trackpad clicks and scrolls. |

## Screenshots and photos

What's on screen isn't metadata, so check it yourself: use a VM account and
computer name like `demo` and `crate`, not your own (today's `desktop.png` shows
`amendez@ubuntu`), and keep notifications, Wi-Fi names and other people's
names out of frame.

- iPhone, portrait: Home with 2–3 VM cards; a VM's settings with the memory
  picker; Settings with JIT on. (Done: the Install tab, the account sheet and
  the serial console.)
- The five desktops, same device and orientation: Ubuntu GNOME (have), Debian
  KDE, Debian Xfce, Arch KDE (have), Arch Xfce.
- Apps: LibreOffice or GIMP. (Done: Chrome on a real site.)
- iPad in landscape with Debian Xfce and the pointer visible.
- (Done: the iPad with a keyboard, as clip G.)
- Mac: Xcode's Signing & Capabilities with the two memory capabilities, the
  team name and email cropped out.

## YouTube videos

Upload as **Unlisted** until launch (unlisted videos still embed). In YouTube
Studio leave Video location and Recording date empty. Run each file through
`npm run media -- --youtube` first, so the original file Google keeps has no
location or device either.

1. **crate in 2 minutes** (1:30–2:30). Captions on screen; music optional.
   - Cold open, real time: tap Start on the Duo, the desktop comes up.
   - The Install tab: pick Ubuntu, a memory size and a disk, Install (sped up,
     labelled "4×").
   - The desktop: a terminal, `apt install` of something, a browser on a site.
   - Claude Code building something in SolidCraft (time-lapse, labelled).
   - The external monitor with the iPhone as its trackpad.
   - The iPad with a trackpad and keyboard.
   - End card: oneamendez.github.io/crate and the GitHub link.
2. **Installing crate, start to finish** (4–6 min), with YouTube chapters.
   - Download and verify the IPA; make the profiles in Xcode, with the two
     capabilities; `sign-ipa.sh --install`; Developer Mode.
   - In crate: Set Up JIT and LocalDevVPN; install a first VM; first boot;
     setting the resolution to 1280 × 800.
   - Hide before recording: Apple ID email, team name and ID, device names and
     identifiers (rename the iPhone, or blur `devicectl` output), the terminal
     prompt's user and host names, notifications.
3. **Boot to desktop, in real time** (1–2 min). Uncut, a timer on screen: from
   tapping Start to a usable desktop on the iPhone 16, the Duo and the iPad,
   with the distribution and memory size written on screen.
