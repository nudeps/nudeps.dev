# Deployed Files

By default, Nudeps will copy everything in each package except for the following:

- `readme` or `README` files with any extension
- Files and directories starting with a dot
- `package.json`, `package-lock.json`, `pnpm-lock.json` files at the top level of any package

**Why not just restrict to copying `*.js` files by default?**
Because this allows dependencies to fetch other files dynamically, e.g. stylesheets, images, data files, etc.
This is particularly important for UI libraries, component libraries, etc.
Since files are only fetched when used, this does not impact actual bandwidth usage.
And if you're trusting a package to run JS in your domain anyway, the additional risk from copying its entire package directory is tiny.

That said, there are cases where you _know_ you won't need certain files.
You can add globs (per Node's native glob syntax) via the `ignore` option.
Its value can be either an array or a singular value.
Each entry is a raw string (a glob to ignore) or an object with an `ignore` or `copy` property.
Globs are relative to the package root.

The semantics are similar to a `.gitignore` file: the **last matching entry wins**, so a `copy` glob can only undo `ignore` globs that precede it.
Your entries come after the built-in defaults, which means reversing a default *is* the opt-out:

- To include `package.json` files: `ignore: { copy: "package.json" }`.
- To only copy `*.js` files and nothing else: `ignore: [{ ignore: "**/*" }, { copy: "**/*.js" }]` (but see above why this is not recommended).

Files that the import map explicitly maps are never ignored.

To restrict globs to specific packages, put them in an [override rule](/config/overrides/) — a rule's `ignore` appends to the global list for the packages it matches:

```js
export default {
	overrides: {
		"leaflet": { ignore: "docs/**" },
	},
};
```
