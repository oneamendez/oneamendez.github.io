// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const REPO = 'https://github.com/oneamendez/crate-ios';

// https://astro.build/config
export default defineConfig({
	site: 'https://oneamendez.github.io',
	integrations: [
		starlight({
			title: 'crate',
			description:
				'Full Linux distributions, desktop and all, running in virtual machines on your iPhone and iPad, entirely on the device.',
			logo: { src: './src/assets/media/icon.png', alt: 'crate' },
			favicon: '/favicon.png',
			head: [
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				// The social card (1280 × 640) goes here once it's made; see LAUNCH.md.
			],
			social: [{ icon: 'github', label: 'crate on GitHub', href: REPO }],
			customCss: ['./src/styles/custom.css'],
			components: {
				// Features, Gallery, Install and Guides beside the GitHub icon.
				SocialIcons: './src/components/HeaderLinks.astro',
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
						{ label: 'Known issues', slug: 'guides/known-issues' },
						{ label: 'FAQ', slug: 'guides/faq' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Engine and speed', slug: 'engine' },
						{ label: 'Roadmap', slug: 'roadmap' },
						{ label: 'Releases', slug: 'releases' },
					],
				},
			],
		}),
	],
});
