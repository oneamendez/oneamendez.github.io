# crate's website

The website for [crate](https://github.com/oneamendez/crate-ios), which runs
Linux VMs on iPhone and iPad. Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build); it will be published at
https://oneamendez.github.io. It isn't yet: see [LAUNCH.md](LAUNCH.md).

## Working on it

    npm install
    npm run dev        # http://localhost:4321, updates as you edit
    npm run build      # the static site, in dist/

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
