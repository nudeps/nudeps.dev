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

**Priority** (weakest to strongest): hard defaults → built-in mode presets → config file values → matching [override rules](/config/overrides/) → CLI args.

Unknown or invalid options fail loudly: typos get a "did you mean" suggestion, invalid values report which layer supplied them, and options from previous versions point at their replacement.

Top-level values are global; the [`overrides`](/config/overrides/) option scopes any package-scoped option (marked below) to specific packages, versions, or modes.

## At a glance

| Option                                          | Default                        | CLI                       | Per-package | What it does                                                     |
| ----------------------------------------------- | ------------------------------ | ------------------------- | :---------: | ---------------------------------------------------------------- |
| [`dir`](#dir)                                   | `./client_modules`             | `--dir`, `-d`             |     ✅      | Where packages are materialized                                  |
| [`map`](#map)                                   | `importmap.js`                 | `--map`, `-o`             |             | Import map injection script path                                 |
| [`root`](#root)                                 | Workspace root                 | `--root`                  |             | Directory the host serves as `/`                                 |
| [`module`](#module)                             | `false`                        | `--module`                |             | Load the map script as `type="module"`                           |
| [`terse`](#terse)                               | `false`                        | `--terse`                 |             | Minify the map script                                            |
| [`prune`](#prune)                               | `false`                        | `--prune`                 |             | Keep only specifiers the entry points use                        |
| [`include`](/config/overrides/#include)         | —                              |                           | ✅ (only)   | Direct-install membership: `"force"` \| `true` \| `false`        |
| [`ignore`](#ignore)                             | Readmes, dotfiles, pkg files   |                           |     ✅      | File globs to skip when copying                                  |
| [`imports`](#imports)                           | —                              |                           |     ✅      | Import map entries merged into the generated map                 |
| [`cjs`](#cjs)                                   | `true`                         | `--cjs`                   |     ✅      | Shim CommonJS packages                                           |
| [`subpaths`](#subpaths)                         | `"split"`                      | `--subpaths`              |             | Collapse subpath mappings: `"split"` \| `"combined"` \| `"both"` |
| [`symlink`](#symlink)                           | External deps only             | `--symlink`               |     ✅      | Symlink packages instead of copying                              |
| [`preserveSymlinks`](#preservesymlinks)         | `false`                        | `--preserveSymlinks`      |     ✅      | Keep symlinks inside copied packages                             |
| [`alias`](#alias)                               | `true`                         | `--alias`                 |     ✅      | Unversioned stable paths to packages                             |
| [`overrides`](/config/overrides/)               | —                              |                           |             | Conditional rules: per package, mode, version                    |
| [`host`](#host)                                 | Auto-detected                  | `--host`                  |             | Deploy host adapter                                              |
| [`mode`](#mode)                                 | —                              | `--mode`, `-m`            |             | Active mode, tested by rules                                     |
| [`hooks`](#hooks)                               | —                              |                           |             | Lifecycle hook callbacks                                         |
| [`config`](#config)                             | `nudeps.js`                    | `--config`, `-c`          |             | Config file path                                                 |
| [`init`](/cli/)                                 | `false`                        | `--init`                  |             | Full re-initialization: clear caches, regenerate                 |

"Per-package" = settable from a package-matched [override rule](/config/overrides/); an empty CLI cell means config file (or programmatic) only.

## Output

### `dir`

`--dir`, `-d` · Default: `./client_modules` · Package-scoped

Directory to copy deployed dependencies to, relative to project root.
It will be created if it does not exist.
It is assumed that Nudeps owns this directory, do not use a directory path that you use for other things.
Overriding it per package via a rule materializes just that package elsewhere (the import map follows).

### `map`

`--map`, `-o` · Default: `importmap.js`

File path for import map injection script, relative to project root.
Nudeps needs to be able to own this file, do not input a file you use for other things too.

### `root`

`--root` · Default: workspace root

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
Enabled by default in [`prod` mode](/config/overrides/#modes).

## What gets included

### `prune`

`--prune` · Default: `false`

Whether to subset only to specifiers used by the package entry points (`true`), or include all direct dependencies anyway.
Packages with [`include: "force"`](/config/overrides/#include) survive pruning.
See [Pruning](/cli/#pruning).

### `include`

Rule-only (inside [`overrides`](/config/overrides/#include))

One setting for direct-install membership, replacing separate add/force/exclude lists:
`true` installs a package like a dependency even if unlisted (prunable), `"force"` also survives `prune`, `false` removes a package from direct installs, and `undefined` restores standard behavior.

```js
export default {
	overrides: {
		"canvas-confetti": { include: true },
		"my-design-system": { include: "force" },
		"@netlify/blobs": { include: false }, // server-side dep
	},
};
```

Note that `include: false` does not guarantee absence from the map: a package actively imported by your code still gets mapped.

### `ignore`

Config file only · Package-scoped

Any files to exclude from being copied to the target directory.
See [Deployed files](/config/files/).

## Resolution

### `imports`

Config file only · Package-scoped

Import map entries deep-merged into the generated map, using the platform's own [`imports`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap#imports) shape: keys are specifiers, values are paths relative to the map file (or full URLs).
Set a value to `undefined` to remove an entry from the map.

```js
export default {
	imports: {
		lodash: "./vendor/lodash.js",
	},
};
```

Inside a [package rule](/config/overrides/), values are **package-relative** paths instead, resolved against the package's versioned directory — no `node_modules` paths needed:

```js
export default {
	overrides: {
		"colorjs.io": {
			imports: {
				"colorjs.io/fn": "./src/index-fn.js",
				"colorjs.io/src/": "./src/",
			},
		},
	},
};
```

### `cjs`

`--cjs` · Default: `true` · Package-scoped

Whether to add a CommonJS shim to the import map if any CJS packages are detected.
Setting to `false` will omit both the shim and these packages from the import map.
Override per package for misdetected packages.
See [How are CJS packages handled?](/faq/#how-are-cjs-commonjs-packages-handled)

### `subpaths`

`--subpaths` · Default: `"split"`

Whether to collapse multiple subpath entries for the same package into a single trailing-slash prefix (e.g. `"pkg/"` instead of individual `"pkg/a"`, `"pkg/b"` entries):

- `"split"` keeps every used subpath explicit
- `"combined"` collapses within scopes
- `"both"` also collapses top-level imports

Combining subpaths can produce significantly smaller import maps, but is a lossy process, as it can expose specifiers that would not have resolved to anything in the original package.
Corresponds to the [`combineSubpaths` option of `@jspm/generator`](https://jspm.org/docs/generator/interfaces/GeneratorOptions.html).

## Linking

### `symlink`

`--symlink` · Default: symlink [local dependencies](/local-deps/), copy the rest · Package-scoped

Whether to symlink a package into `dir` instead of copying it.
Symlinking means edits to a local dependency are visible immediately, with no re-copy.
[`dev` mode](/config/overrides/#modes) sets it to `true`, `prod` mode to `false`.

> [!NOTE]
> Netlify, Cloudflare Pages, Vercel and GitHub Pages do not support symlinks, so `symlink: true` is a local-development affordance, not a deploy strategy.

### `preserveSymlinks`

`--preserveSymlinks` · Default: `false` · Package-scoped

Whether to keep symlinks found *inside* a package as-is when copying it, rather than dereferencing them to real files.
Scope to specific packages via [override rules](/config/overrides/).

### `alias`

`--alias` · Default: `true` · Package-scoped

Create unversioned symlinks pointing to versioned directories.
Useful for stable URLs to package assets (CSS, images, etc.).
See [Aliases](/config/aliases/).

## Environment

### `host`

`--host` · Default: auto-detected

Deploy host adapter: `netlify`, `vercel`, `cloudflare`, or `gitHubPages`.
Normally detected from the environment; set it to force one.

### `mode`

`--mode`, `-m`

The active mode.
Built-in presets: `dev`, `prod`; define your own with rules that match on `mode`.
See [Overrides & modes](/config/overrides/).

### `overrides`

Config file only

Conditional config rules: override options per package, per mode, per version — or unconditionally.
See [Overrides & modes](/config/overrides/).

### `hooks`

Config file only

Lifecycle hook callbacks: `constructed`, `create-aliases-start`, `create-aliases-after-external`, `create-aliases-end`.
See [blissful-hooks](https://github.com/LeaVerou/blissful-hooks).

### `config`

`--config`, `-c` · Default: `nudeps.js`

File path for nudeps configuration, relative to project root.
It should export an object literal with the configuration options as keys.
