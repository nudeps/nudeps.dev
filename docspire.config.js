import fs from "node:fs";
import landing from "docspire/plugins/landing";

// The header version badge should track the tool being documented, not this site
const nudeps = JSON.parse(fs.readFileSync(new URL("node_modules/nudeps/package.json", import.meta.url)));

export default {
	title: "Nudeps",
	description: "Web dependencies, naked. Bundler-free, local-first dependency management.",
	icon: "/logo.svg",
	version: nudeps.version,
	repo: "https://github.com/nudeps/nudeps",
	editLink: {
		pattern: "https://github.com/nudeps/nudeps.dev/edit/main/:path",
	},
	input: "docs",
	deleteOutput: true,
	plugins: [
		landing,
		{
			url: import.meta.url,
			styles: "brand.css",
			data: {
				// Crawlers need an absolute URL
				image: "https://nudeps.dev/og-image.png",
			},
			icons: {
				// Simple Icons: npm
				npm: `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
						<path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/>
					</svg>
				`,
			},
			// The npm package link, right after the GitHub one in the header (see templates/npm-link.njk)
			slotted: {
				"nav.end": "npm-link",
			},
			// Files that belong at the site root but live outside the input dir: the branding
			// (hotlinked from the README and blog posts, so the URLs must not move) and the
			// Netlify redirects, which Netlify only reads at the publish root and which nudeps
			// appends its alias rules to after Eleventy has written (see Docspire#build).
			plugin (eleventyConfig) {
				eleventyConfig.addPassthroughCopy({
					_redirects: "_redirects",
					"logo.svg": "logo.svg",
					"wordmark.svg": "wordmark.svg",
					"og-image.png": "og-image.png",
				});
			},
		},
	],
};
