// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const REPO = 'https://github.com/oneamendez/crate-ios';

// Before the page draws: hide the sidebar if it was hidden last time, so it
// doesn't flash open. SidebarToggle.astro changes it.
const SIDEBAR_STATE = `try{if(localStorage.getItem('crate-sidebar')==='hidden')document.documentElement.dataset.sidebarHidden=''}catch(e){}`;

const SITE = 'https://oneamendez.github.io';
const CARD = `${SITE}/crate/social-card.png`;
const CARD_ALT = "crate: Linux desktops on your iPhone and iPad. crate's icon beside Claude Code building a chair in SolidCraft, a 3D CAD app, on Ubuntu on an iPhone.";

// https://astro.build/config
export default defineConfig({
	// crate lives at /crate/, leaving the root of oneamendez.github.io for other
	// projects. The build goes to dist/crate/, and scripts/site-root.mjs adds
	// the root's own page beside it (see LAUNCH.md).
	site: SITE,
	base: '/crate',
	outDir: './dist/crate',
	integrations: [
		starlight({
			title: 'crate',
			description:
				'Full Linux distributions, desktop and all, running in virtual machines on your iPhone and iPad, entirely on the device.',
			logo: { src: './src/assets/media/icon.png', alt: 'crate' },
			favicon: '/favicon.png',
			head: [
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/crate/apple-touch-icon.png' } },
				{ tag: 'script', content: SIDEBAR_STATE },
				// The picture link previews show (iMessage, Slack, X, Discord…),
				// made by scripts/make-social-card.mjs.
				{ tag: 'meta', attrs: { property: 'og:image', content: CARD } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1280' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '640' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: CARD_ALT } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: CARD } },
				{ tag: 'meta', attrs: { name: 'twitter:image:alt', content: CARD_ALT } },
			],
			social: [{ icon: 'github', label: 'crate on GitHub', href: REPO }],
			customCss: ['./src/styles/custom.css'],
			components: {
				// Features, Gallery, Install and Guides beside the GitHub icon.
				SocialIcons: './src/components/HeaderLinks.astro',
				// A button before the site title that hides or shows the sidebar.
				SiteTitle: './src/components/SidebarToggle.astro',
				// The home page's hero, with crate's icon and name above it.
				Hero: './src/components/Hero.astro',
			},
			credits: false,
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Features', slug: 'features' },
						{ label: 'Gallery', slug: 'gallery' },
						{ label: 'Install', slug: 'install' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Turning on JIT', slug: 'guides/jit' },
						{ label: 'Using a VM', slug: 'guides/using-a-vm' },
						{ label: 'External monitor', slug: 'guides/external-monitor' },
						{ label: 'Memory and disk', slug: 'guides/memory-and-disk' },
						{ label: 'Logs and bug reports', slug: 'guides/logs' },
					],
				},
				{
					label: 'Help',
					items: [
						{ label: 'Tips', slug: 'guides/tips' },
						{ label: 'Known issues', slug: 'guides/known-issues' },
						{ label: 'FAQ', slug: 'guides/faq' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Engine and speed', slug: 'engine' },
						{ label: 'Roadmap', slug: 'roadmap' },
						// GitHub's own page, always current: nothing to update here per release.
						{
							label: 'Releases ↗',
							link: 'https://github.com/oneamendez/crate-ios/releases',
							attrs: { target: '_blank', rel: 'noopener' },
						},
					],
				},
			],
		}),
	],
});
