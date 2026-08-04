---
order: 2 # Back matter, after the reference pages
---

# FAQ

## Which browsers are supported?

When the import map injection script is included as a non-module script before any module scripts are loaded, Nudeps works in pretty much every browser that supports import maps, which is [all of them](https://caniuse.com/import-maps) at this point, including:

- Chrome **89+**
- Safari **16.4+**
- Firefox **108+**

## Does this support pnpm/bun/yarn/etc.?

At the moment, we're focusing on nailing the best DX possible, and to let us focus on that, we're cutting scope by only supporting npm for now.
Please open an issue if lack of support for your package manager is a blocker for you and add it below:

- [pnpm](https://github.com/nudeps/nudeps/issues/13)

If there is an existing issue for your package manager, please upvote it.

## Why does it add the version number to the directory name?

Because this allows you to get the same cache busting behavior as you would with a CDN, but in your own domain.
It also allows us to flatten dependencies to get better caching behavior: when you upgrade a dependency, its own dependencies remain cached by the browser unless _they_ also change version.

## Do I need to add `.nudeps`, `client_modules` and `importmap.js` to my `.gitignore`?

This is up to you.

- `.nudeps` and `client_modules` include local `.gitignore` files that prevent you from accidentally committing paths from them, but you may want to gitignore them at the top level so that you don't see them in your IDE.
- Whether you gitignore `importmap.js` is up to you. On one hand it's a generated file, and these generally should not be committed, on the other hand it can help track changes to dependencies in a compact way.

## Why doesn't Nudeps have an option to add integrity hashes to the import map?

The purpose of integrity hashes is to guard against compromise in resources you don't control, such as public CDNs.
When using Nudeps you host your own dependencies, so that is not necessary, and would unnecessarily double the size of your import map.
However, if we later decide there is a need for this, [the PR is already written](https://github.com/nudeps/nudeps/pull/5).

## How are CJS (CommonJS) packages handled?

When CJS packages are detected, [`cjs-browser-shim`](https://npmjs.com/package/cjs-browser-shim) is automatically included.
This is a tiny shim that makes `require()` work in the browser, both for relative paths and specifiers, allowing such dependencies to work out of the box.
Note that you would need to import such dependencies using `require()` in your code, like so:

```js
import { require } from "cjs-browser-shim";
const { createElement } = require("react");
```

You can see a demo of this in [`nudeps-demos/react`](https://github.com/nudeps/nudeps-demos/tree/main/react).

To disable this, set the [`cjs`](/config/#cjs) option to `false` and both these packages and the CJS shim will be omitted from the import map.
