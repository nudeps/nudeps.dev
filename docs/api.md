# Programmatic API

You can use the programmatic API to call nudeps from another script:

```js
import nudeps from "nudeps";
await nudeps({ prune: true });
```

It accepts the same options as the [config file](/config/), and they win over both the config file and any [override rules](/config/overrides/).

## What you get back

`nudeps()` resolves to the `Nudeps` instance, whose `config` holds every resolved option — read it instead of guessing where files ended up:

```js
let { config } = await nudeps();
// config.dir  → "client_modules"
// config.map  → "importmap.js"
```

It resolves to `null` instead when the run was skipped, which happens for a [workspace](/local-deps/) child whose lockfile npm has yet to write or is about to rewrite — the run that reads it comes later. Check for it before destructuring:

```js
let result = await nudeps();
if (result) {
	console.log(result.config.map);
}
```

## Suggesting defaults

Pass `defaults` to supply values for anything the user's config file and rules leave unset, without overriding what they did set.
This is what a tool should reach for when it has good suggestions but no right to insist — e.g. a static site generator that wants its output paths used unless the project says otherwise:

```js
import nudeps from "nudeps";
await nudeps({ defaults: { dir: "dist/client_modules", root: "dist" } });
```

`defaults` is the weakest layer of the [cascade](/config/overrides/#the-cascade), below even the built-in mode presets, and is programmatic-only: there is no config file key or CLI flag for it.

## Injecting your own client-side libraries

A tool that generates sites (e.g. a static site generator) can pass [override rules](/config/overrides/) with [`include`](/config/overrides/#include) to inject its own client-side libraries into the consumer's import map, even though they are only `devDependencies` of the tool and not declared in the consumer's `dependencies`:

```js
import nudeps from "nudeps";
await nudeps({ overrides: [{ name: ["my-widget", "another-lib"], include: true }] });
```

Use `include: "force"` for the prune-proof variant — packages that must stay in the import map even under `prune: true`, regardless of whether your entry points reference them (e.g. a design-system CSS package loaded only from HTML):

```js
import nudeps from "nudeps";
await nudeps({ prune: true, overrides: [{ name: "my-design-system", include: "force" }] });
```

Rules passed this way **concatenate after** the consumer's own rules rather than replacing them, so both compose.
