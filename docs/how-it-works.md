---
order: 0
---

# How It Works

Nudeps copies your dependencies to a **local directory** you specify (`./client_modules` by default), adds versions to directory names for **cache busting** just like a CDN, generates an [**import map**](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) that maps specifiers to these local paths, and an injection script that injects the import map into any HTML page.
For example, `lit` may be mapped to `"./client_modules/lit@3.3.2/index.js"`.
The injection script rebases each address to an absolute URL at runtime, against its own location rather than the page's — so a single import map resolves correctly from every page of a multi-page site, at any directory depth.

It then optimistically adds your direct dependencies to your import map, so that you can use them straight away.
In production (or if you use the [`prune`](/cli/#pruning) option), it will subset the import map to only include the dependencies you actually use.

## Do I need nudeps or JSPM?

[JSPM](https://jspm.org/) paved the way in managing import maps that let you use specifiers in the browser.
Nudeps actually uses the excellent [JSPM Generator](https://jspm.org/docs/generator/) under the hood, which handles a lot of the heavy lifting around tracing and import map generation.

The main value-add of nudeps over JSPM is:

- Letting you **host your own dependencies** instead of relying on a CDN, selectively and with the same cache busting behavior as a CDN.
- Because it takes a different approach to handling which dependencies are installed, it does **not require a watcher** — it just runs during certain npm hooks and that's enough.
- It also takes care of making non-JS imports more palatable, through [aliases](/config/aliases/).

If you're ok with using a CDN for your dependencies and don't need any of these features, JSPM is a great choice.

Here is a handy table to compare the two:

| Feature                                                               | nudeps | JSPM      |
| --------------------------------------------------------------------- | ------ | --------- |
| Use specifiers both in your own code, and in code you distribute.     | ✅     | ✅        |
| Self-host dependencies                                                | ✅     | ❌        |
| Use dependencies without having to transpile your _own_ code.         | ✅     | ✅        |
| Shared transitive dependencies                                        | ✅     | ✅        |
| `npm link` still works                                                | ✅     | ✅        |
| No build process to remember to run before working on code            | ✅     | ❌        |
| Supports CDNs like unpkg, jsdelivr, etc.                              | ❌     | ✅        |
| Granular cache busting                                                | ✅     | CDNs only |
| Nice URLs for resources that can't use specifiers (CSS, images, etc.) | ✅     | ❌        |

## Limitations

- Specifiers will not work in web workers ([#19](https://github.com/nudeps/nudeps/issues/19)). This is a platform limitation, and is not specific to nudeps.
