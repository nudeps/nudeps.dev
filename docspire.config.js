import fs from "node:fs";
import landing from "docspire/plugins/landing";

// The header version badge should track the tool being documented, not this site
const nudeps = JSON.parse(fs.readFileSync(new URL("node_modules/nudeps/package.json", import.meta.url)));

export default {
	title: "Nudeps",
	description: "Web dependencies, naked. Bundler-free, local-first dependency management.",
	logo: "/wordmark.svg",
	icon: "/logo.svg",
	version: nudeps.version,
	input: "docs",
	deleteOutput: true,
	plugins: [
		landing,
		{
			url: import.meta.url,
			styles: "brand.css",
			// Files that belong at the site root but live outside the input dir: the branding
			// (hotlinked from the README and blog posts, so the URLs must not move) and the
			// Netlify redirects, which Netlify only reads at the publish root and which nudeps
			// appends its alias rules to after Eleventy has written (see Docspire#build).
			plugin (eleventyConfig) {
				eleventyConfig.addPassthroughCopy({
					_redirects: "_redirects",
					"logo.svg": "logo.svg",
					"wordmark.svg": "wordmark.svg",
				});
			},
		},
	],
};
