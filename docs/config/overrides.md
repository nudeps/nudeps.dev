# Overrides & Modes

**One mechanism for conditional configuration: per package, per mode, per version — or all at once.**

Top-level config values are global defaults.
The `overrides` option holds **rules** that override options for whatever they match: specific packages, the active mode, specific versions, or any combination.

## The dictionary form

For the common case — settings for one specific package — use an object whose keys are exact package names (matched against both the package name and the [install name](https://docs.npmjs.com/cli/v11/using-npm/package-spec#aliases)):

```js
export default {
	overrides: {
		"open-props": { alias: "../open-props" },
		"canvas-confetti": { include: true },
		"legacy-lib": { cjs: false },
	},
};
```

## The rule form

For anything conditional beyond a single exact name, use an array of rules.
A rule mixes **matcher fields** — which packages and/or modes it applies to — with the option values it overrides:

```js
export default {
	overrides: [
		{ mode: "staging", terse: false },                 // mode preset
		{ installName: /^@types\//, include: false },      // pattern
		{ name: "leaflet", version: "^1", ignore: "docs/**" },
		{ mode: "prod", name: "leaflet", symlink: false }, // package × mode
		{ terse: true },                                   // unconditional (handy for debugging)
	],
};
```

### Matchers

| Field         | Matches against                              |
| ------------- | -------------------------------------------- |
| `name`        | The package's real name                      |
| `installName` | The name it was installed as (the key in `dependencies`) |
| `version`     | The package's version                        |
| `mode`        | The active [mode](#modes)                    |

Each matcher is an **exact string** (a semver range for `version`), a **regex**, a **function** receiving the field's value, or an **array** of these (matching any of them).
Multiple matcher fields in one rule must all match (AND).
A rule with no matchers at all is unconditional.

The `version` filter exists because transitive dependencies can bring in the same package at several versions — rules can target each separately.

### The cascade

All matching rules apply **in order, later wins**, merged per property — a later rule only overrides the properties it actually sets, it never replaces a whole earlier rule.
The full priority order, weakest to strongest:

1. Hard option defaults
2. Built-in mode presets ([below](#modes))
3. Top-level config file values
4. Your rules, in order
5. CLI / programmatic arguments

So an explicit top-level value beats a built-in preset, while your own rules — being more specific — beat top-level values.

Rules passed [programmatically](/api/) concatenate after config-file rules rather than replacing them, so tools injecting their own rules compose with yours.

One exception to per-property override: a rule's `ignore` **appends** to the global ignore list for the matched packages (matching how the [built-in ignore defaults](/config/files/) always apply) rather than replacing it.

### What rules can set

Rules that match packages may set the package-scoped options — `dir`, `symlink`, `preserveSymlinks`, `alias`, `ignore`, `imports`, `cjs` — plus `include`, which only exists inside rules.
Mode-only and unconditional rules may set any option.
Setting a global-only option (like `terse`) from a package-matched rule is an error.

### `include`

Membership in the direct-install set — one setting replacing separate add/force/exclude lists:

| Value       | Meaning                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------ |
| `undefined` | Standard behavior: in `dependencies` → installed (prunable); otherwise only if imported    |
| `true`      | Install like a dependency even if not listed in `dependencies`; subject to `prune`         |
| `"force"`   | Install **and** survive `prune`                                                            |
| `false`     | Remove from the direct-install set                                                         |

`true` and `"force"` require exact-name matchers (you cannot install a regex); `false` accepts any matcher, so `{ installName: /^@types\//, include: false }` works.

> [!NOTE]
> `include: false` does not guarantee absence from the map: a package your code actively imports still gets mapped.

## Modes

A mode preset is nothing special — it is just a rule with a `mode` matcher.
Two presets are built in, sitting *below* your config in the cascade:

| Mode   | Rule                                                        |
| ------ | ----------------------------------------------------------- |
| `dev`  | `{ mode: "dev", symlink: true }`                            |
| `prod` | `{ mode: "prod", symlink: false, prune: true, terse: true }` |

Activate a mode from the CLI or config:

```bash
npx nudeps -m dev
npx nudeps --mode=prod
```

Define your own modes as rules, and group modes with any-of matchers instead of inheritance chains:

```js
export default {
	overrides: [
		{ mode: ["prod", "staging"], prune: true }, // shared by both
		{ mode: "staging", terse: false },          // staging-specific
	],
};
```

Because built-in presets sit below your config, `npx nudeps -m prod --prune=false` uses `prod` defaults but keeps `prune` off — and a top-level `terse: false` in your config wins over `prod`'s `terse: true`.
To *strengthen* a preset instead, use a rule: `{ mode: "prod", terse: true }` beats top-level values.

If the active mode is neither built-in nor referenced by any rule, a warning is printed.
