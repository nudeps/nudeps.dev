---
order: 2
---

# Troubleshooting

While most packages should work fine, some packages make certain over-reaching assumptions about the environment they are running in.

## Getting an error about a specifier failing to resolve

There are a few cases where not all specifiers supported by a package can be detected upfront, and are only added when actually used in your code.
This is not frequent enough to warrant continuously running a watcher for every edit, but it can happen occasionally (e.g. see [#25](https://github.com/nudeps/nudeps/issues/25)).

Before investigating further:

1. Make sure your entry points are declared correctly in your `package.json`
2. Run `npx nudeps`

## Package assumes a bundler is being used

Some packages don't just use specifiers — they actively assume that if they can use specifiers, it _must_ mean that a bundler is being used and that the environment is NodeJS or similar.
For popular packages, we use [JSPM's override registry](https://github.com/jspm/overrides) but for less well-known packages, you may need to use a custom override through the [`overrides`](/config/#overrides) option.

Another option is to stub NodeJS objects like `process`.
This can work if the surface area is limited, but it can quickly turn into a game of whack-a-mole. Additionally, it can cause bugs in other packages that depend on the presence of these objects to _detect_ NodeJS.

## Packages that use extension-less paths

Some packages use extension-less paths even for their own imports, e.g. `./foo/bar` instead of `./foo/bar.js`.
While this doesn't usually make it to the files they distribute, there are a few exceptions.
Because these are not actual specifiers, import maps will not help here.
However, since the browser will see these as URLs, you can take advantage of whatever URL rewriting capabilities your server has and simply rewrite not-found URLs in that directory to their corresponding `.js` paths.
For example, using a [Netlify `_redirects` file](https://docs.netlify.com/routing/redirects/redirect-options/) this may look like this:

```
/client_modules/*  /client_modules/:splat.js 301
```
