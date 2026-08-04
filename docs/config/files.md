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
You can add additional globs (per Node's native glob syntax) to be included or excluded by providing globs to the `ignore` option.
Its value can be either an array or a singular value.
Each glob can be provided as a raw string (glob to exclude) or an object with an `include` or `exclude` property.
The values of these properties can also be arrays of strings or objects.
Globs are relative to the package root.

The semantics are similar to a `.gitignore` file, meaning that negative globs can only undo globs that precede them.

For example:

- To include `package.json` files you'd use `ignore: { include: "package.json" }`.
- To only copy `*.js` files and nothing else you'd use `ignore: [{ exclude: "**/*" }, { include: "**/*.js" } ]` (but see above why this is not recommended).

To restrict rules to specific packages, you can provide the rule as an object and add one or more (as an array) package names via the `packageName` property.
