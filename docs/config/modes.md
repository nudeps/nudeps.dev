# Modes

Modes let you switch between sets of option defaults with a single flag. Two modes are built in:

| Mode   | Defaults                                       |
| ------ | ---------------------------------------------- |
| `dev`  | `symlink: true`                                |
| `prod` | `symlink: false`, `prune: true`, `terse: true` |

Use a mode from the CLI:

```bash
npx nudeps -m dev
npx nudeps --mode=prod
```

Or set it in your config file:

```js
export default {
	mode: "dev",
};
```

**Priority:** CLI args override config file values, which override mode defaults, which override hard defaults.
For example, `npx nudeps -m prod --prune=false` will use `prod` defaults but keep `prune` off.

## Custom modes

You can define your own modes via the `modes` key in the config file. Custom modes are merged with the built-in ones (and can override them):

```js
export default {
	modes: {
		staging: {
			symlink: false,
			prune: false,
		},
	},
};
```

You can now run `npx nudeps -m staging` to use these defaults.

Modes can extend other modes by including a `mode` key. The child mode inherits all parent defaults and can override individual values:

```js
export default {
	modes: {
		staging: {
			// inherits prod's symlink: false, overrides prune
			mode: "prod",
			prune: false,
		},
	},
};
```

This also works for overriding built-in modes — use the same name to extend the built-in with your own defaults:

```js
export default {
	modes: {
		prod: {
			mode: "prod", // extends built-in prod
			prune: false, // but disables pruning
		},
	},
};
```

If an unknown mode is specified, a warning is printed listing the available modes.
