# crate's website

The website for [crate](https://github.com/oneamendez/crate-ios), which runs
Linux VMs on iPhone and iPad. Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build), and published at
https://oneamendez.github.io/crate/ by the Deploy workflow (Actions › Deploy ›
Run workflow), which runs only when started by hand.

crate's site is under `/crate/`, so the root of oneamendez.github.io stays free
for other projects. `root/index.html` is the root's page: for now, a link on to
crate.

## Working on it

    npm install
    npm run dev        # http://localhost:4321/crate/, updates as you edit
    npm run build      # the whole site, in dist/ (crate's in dist/crate/)

`npm install` also turns on the pre-commit hook (`.githooks/`).

## Pages

The pages are Markdown and MDX in `src/content/docs/`, and the sidebar is in
`astro.config.mjs`. Components for screenshots, clips and YouTube videos are in
`src/components/`; without a file they show a dashed placeholder saying what to
capture.

## Pictures and videos have no metadata

Every image and video is re-encoded by `npm run media` before it's committed,
which drops location, device, dates and software. `scripts/check-media.mjs`
refuses anything that still carries some, in the pre-commit hook, in CI, and
before every build. [LAUNCH.md](LAUNCH.md) has the details.
