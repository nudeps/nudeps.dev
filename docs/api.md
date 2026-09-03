# Programmatic API

You can use the programmatic API to call nudeps from another script:

```js
import nudeps from "nudeps";
await nudeps({ prune: true });
```

It accepts the same options as the [config file](/config/).

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
