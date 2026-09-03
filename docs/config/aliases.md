# Aliases

**Importing non-JS resources through stable, unversioned URLs.**

While the import map handles JavaScript specifier resolution, you may need to reference package files directly by URL — for example, CSS files, images, or other assets.
Because package directories include version numbers (e.g. `client_modules/open-props@2.0.4/`), these URLs break every time a dependency is updated.

The `alias` option solves this by creating unversioned symlinks alongside the versioned directories.
For example, `client_modules/open-props` will point to `client_modules/open-props@2.0.4`.

This lets you use stable paths like `client_modules/open-props/open-props.min.css` in your HTML and CSS.

By default, `alias` is `true`, which creates an unversioned symlink for every direct dependency using its install name (generally the same as the package name, except for [npm aliases](https://docs.npmjs.com/cli/v11/using-npm/package-spec#aliases)).
Set `alias: false` to opt out entirely.

> [!NOTE]
> Hosts without symlink support (Netlify, Cloudflare Pages) get redirect rules instead, written to `_redirects` in your [`root`](/config/#root).

## Values

- `true` — alias the package at its install name. Globally, this covers direct dependencies only (transitive duplicates at other versions are skipped).
- `false` — no alias.
- A string — a custom alias **path, relative to the package's [`dir`](/config/#dir)**. It may escape `dir`: `"../open-props"` places the alias at the project root, so `<link href="open-props/open-props.min.css">` works from your HTML.

Scope values to packages via [override rules](/config/overrides/):

```js
export default {
	overrides: {
		"open-props": { alias: "../open-props" }, // alias at the project root
		"tailwindcss": { alias: "tw" },           // custom name inside dir
		"lodash": { alias: false },               // no alias for this one
	},
};
```

Rules also reach transitive dependencies (which `alias: true` alone does not):

```js
export default {
	overrides: [{ name: /./, alias: true }], // alias everything, even transitive deps
};
```

When an alias is removed from the config (or its package is uninstalled), the symlink is automatically cleaned up on the next run — including aliases outside `dir`.

> **npm aliases:** When using npm aliases (e.g. `npm install my-props@npm:open-props`), dictionary keys match against both the install name (`my-props`) and the real package name (`open-props`); in the rule form, match `name` or `installName` explicitly to distinguish multiple installs of the same package (optionally filtered by `version`).
