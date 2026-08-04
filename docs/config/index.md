# Configuration

Most options are available either as a config file key, or a command line option (e.g. `foo` would be `--foo`), though their CLI version may support a more limited syntax.
Some command line options also allow for a shorthand one letter syntax (e.g. `-d foo` instead of `--dir=foo`).

The config file defaults to `nudeps.js` in your project root, and should export an object literal:

```js
export default {
	dir: "./vendor",
	prune: true,
};
```

**Priority:** CLI args override config file values, which override [mode](/config/modes/) defaults, which override hard defaults.

## Output

### `dir`

`--dir`, `-d` · Default: `./client_modules`

Directory to copy deployed dependencies to, relative to project root.
It will be created if it does not exist.
It is assumed that Nudeps owns this directory, do not use a directory path that you use for other things.

### `map`

`--map`, `-o` · Default: `importmap.js`

File path for import map injection script, relative to project root.
Nudeps needs to be able to own this file, do not input a file you use for other things too.

### `publishDir`

`--publish-dir` · Default: workspace root

The directory your host serves as `/`.
Hosts without symlink support (Netlify, Cloudflare) express [aliases](/config/aliases/) as redirect rules, which need URLs rather than file paths — so set this when `dir` lives inside a build output directory (e.g. an SSG's `dist/`), or the rules will be written outside the deployed site and will not match.
Defaults to the npm workspace root, which is typically the deploy root; in a single-package project that is the project root.

### `module`

`--module` · Default: `false`

Set to `true` if the import map script will be loaded as `<script type="module">`.
Please note that **this will reduce browser support**, as certain browsers do not support injecting import maps after any module has started loading.

### `terse`

`--terse` · Default: `false`

Terser import map injection script (compact JSON, no error checks, reduced whitespace).
Enabled by default in [`prod` mode](/config/modes/).

## What gets included

### `prune`

`--prune` · Default: `false`

Whether to subset only to specifiers used by the package entry points (`true`), or include all direct dependencies anyway.
See [Pruning](/cli/#pruning).

### `exclude`

`--exclude`, `-e` · Default: `[]`

Any packages to exclude from the import map even though they appear in `dependencies`.
Useful for server-side dependencies.
When providing via the command line option, comma-separate and do not include any spaces.
They will still be included if actively used in your code.

### `additionalDependencies`

Config file only · Default: `[]`

Extra packages to add to the import map beyond your `dependencies` — e.g. a tool (such as a static site generator) calling nudeps [programmatically](/api/) can inject its own client-side libraries.
Treated exactly like `dependencies` (installed unless pruned, subject to `exclude`); a no-op for anything already in `dependencies`.

### `forceDependencies`

Config file only · Default: `[]`

Like `additionalDependencies`, but **not** subject to pruning: these packages stay in the import map even when `prune` is `true`.
Use for packages you always want available regardless of whether your entry points reference them.
Still subject to `exclude` — a package listed in both is excluded, with a warning.

### `ignore`

Config file only

Any files to exclude from being copied to the target directory.
See [Deployed files](/config/files/).

## Resolution

### `overrides`

Config file only · Default: `{}`

Overrides for the import map, using `./node_modules/` paths.
Set a key to `undefined` to remove it from the map.

### `cjs`

`--cjs` · Default: `true`

Whether to add a CommonJS shim to the import map if any CJS packages are detected.
Setting to `false` will omit both the shim and these packages from the import map.
See [How are CJS packages handled?](/faq/#how-are-cjs-commonjs-packages-handled)

### `combineSubpaths`

Config file only · Default: `false`

Whether to collapse multiple subpath entries for the same package into a single trailing-slash prefix (e.g. `"pkg/"` instead of individual `"pkg/a"`, `"pkg/b"` entries).
`false` keeps every used subpath explicit; `true` collapses within scopes; `"both"` also collapses top-level imports.
Combining subpaths can produce significantly smaller import maps, but is a lossy process, as it can expose specifiers that would not have resolved to anything in the original package.
Corresponds to the [`combineSubpaths` option of `@jspm/generator`](https://jspm.org/docs/generator/interfaces/GeneratorOptions.html).

## Linking

### `symlink`

Config file only · Default: symlink [local dependencies](/local-deps/), copy the rest

Whether to symlink a package into `dir` instead of copying it.
Symlinking means edits to a local dependency are visible immediately, with no re-copy.
Can be a boolean, or a function receiving the package and returning one.
[`dev` mode](/config/modes/) sets it to `true`, `prod` mode to `false`.

> [!NOTE]
> Netlify, Cloudflare Pages, Vercel and GitHub Pages do not support symlinks, so `symlink: true` is a local-development affordance, not a deploy strategy.

### `preserveSymlinks`

Config file only · Default: `false`

Whether to keep symlinks found *inside* a package as-is when copying it, rather than dereferencing them to real files.
Can be a boolean, an array of package names, or a function receiving `{ packageName, version }`.

### `alias`

`--alias` · Default: `true`

Create unversioned symlinks in `dir` pointing to versioned directories.
Useful for stable URLs to package assets (CSS, images, etc.).
See [Aliases](/config/aliases/).

## Meta

### `mode`

`--mode`, `-m`

Activate a mode preset that sets multiple option defaults at once.
Built-in modes: `dev`, `prod`.
See [Modes](/config/modes/).

### `modes`

Config file only

Define your own mode presets. See [Custom modes](/config/modes/#custom-modes).

### `config`

`--config`, `-c` · Default: `nudeps.js`

File path for nudeps configuration, relative to project root.
It should export an object literal with the configuration options as keys.
