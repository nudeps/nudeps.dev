# Aliases

**Importing non-JS resources through stable, unversioned URLs.**

While the import map handles JavaScript specifier resolution, you may need to reference package files directly by URL — for example, CSS files, images, or other assets.
Because package directories include version numbers (e.g. `client_modules/open-props@2.0.4/`), these URLs break every time a dependency is updated.

The `alias` option solves this by creating unversioned symlinks alongside the versioned directories.
For example, `client_modules/open-props` will point to `client_modules/open-props@2.0.4`.

This lets you use stable paths like `client_modules/open-props/open-props.min.css` in your HTML and CSS.

By default, `alias` is `true`, which creates an unversioned symlink for every package using its install name (generally the same as the package name, except for [npm aliases](https://docs.npmjs.com/cli/v11/using-npm/package-spec#aliases)).
Set `alias: false` to opt out entirely.

> [!NOTE]
> Hosts without symlink support (Netlify, Cloudflare Pages) get redirect rules instead, written to `_redirects` in your [`publishDir`](/config/#publishdir).

## Forms

**Boolean** to set globally for all packages. Note that `alias: true` will _only_ create aliases for direct dependencies, not transitive dependencies. If you also want to alias transitive dependencies, you need to use one of the more granular forms.

**String** — alias a single package by name:

```js
alias: "open-props";
```

**Function** — dynamically determine based on package metadata.
For example, to alias every package to its unversioned name (even transitive dependencies, which are not included by `alias: true`), you can use:

```js
alias: ({ installName }) => installName;
```

**Array** — specify a list of packages to alias:

```js
alias: ["open-props", "tailwindcss"];
```

**Object** — map package names to custom alias paths:

```js
alias: {
	"open-props": "open-props",
	"tailwindcss": "tw",
}
```

Functions can also be used as object values for per-package logic:

```js
alias: {
	"open-props": ({version}) => `open-props-v${version.split(".")[0]}`,
}
```

When an alias is removed from the config (or its package is uninstalled), the symlink is automatically cleaned up on the next run.

> **npm aliases:** When using npm aliases (e.g. `npm install my-props@npm:open-props`), string and object forms match against both the install name (`my-props`) and the real package name (`open-props`), with install name taking priority in object lookups.
> Function forms receive both as `{ packageName, version, installName, isExternal }`, letting you distinguish multiple installs of the same package.
