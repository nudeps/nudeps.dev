# CLI

## `nudeps install`

Install Nudeps into a project: adds it to your `devDependencies`, adds the `dependencies` and `prepare` npm lifecycle scripts that keep your import map up to date, then runs Nudeps once to initialize.
This is the only command most projects ever need to run by hand.
See [Getting Started](/start/).

## `nudeps`

Copy dependencies and regenerate the import map.
npm runs this for you whenever dependencies change, so you only need it explicitly if something seems off.

Every [config option](/config/) that has a CLI equivalent can be passed as a flag, e.g. `npx nudeps --dir=vendor -m prod`.

## `nudeps dependents`

Tell every repo that depends on this one locally that it changed, so they regenerate their import maps, and register with this repo's own local dependencies so they can do the same for it.

This is the whole of Nudeps' local-dependency bookkeeping without any import map generation, which is what lets a package take part in a chain of local dependencies without installing Nudeps.

You do not run this by hand. It runs from `other-repo`'s `dependencies` hook, which Nudeps adds when you set [`wireLocalDeps`](/config/#wirelocaldeps).
`nudeps dependents` never edits a `package.json`: your app's run gives every link in the chain its hook.
See [Local Dependencies](/local-deps/).

## Pruning

`npx nudeps --prune`

Subset copied dependencies and import map to only those used by your own package entry points.
Subsequent runs of `nudeps` will respect previously pruned dependencies (unless you use `--init`).
This allows you to use dependencies immediately as they are added, without having to continuously watch all your JS files, and periodically run `nudeps --prune` to subset.

You can set `prune: true` in your config file to always prune dependencies, but then you will need to re-run it when your code changes.

## Force initialization

`npx nudeps --init`

Force initialization, even if nudeps has already run.
Note that this also clears the list of local dependents (see [Local dependencies](/local-deps/)). They will re-register the next time they run nudeps.
