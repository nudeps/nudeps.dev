# CLI

## `nudeps install`

Install Nudeps into a project: adds it to your `devDependencies`, adds the `dependencies` and `prepare` npm lifecycle scripts that keep your import map up to date, then runs Nudeps once to initialize.
On Vercel, it also adds a `build` script if you have none, [so Vercel runs Nudeps](/config/#host).
This is the only command most projects ever need to run by hand.
See [Getting Started](/start/).

## `nudeps`

Copy dependencies and regenerate the import map.
npm runs this for you whenever dependencies change, so you only need it explicitly if something seems off.

Every [config option](/config/) that has a CLI equivalent can be passed as a flag, e.g. `npx nudeps --dir=vendor -m prod`.

## `nudeps dependents`

Tell every repo that depends on this one locally that it changed, so they regenerate their import maps, and register with this repo's own local dependencies so they can do the same for it.

npm does not run your `dependencies` hook when the dependencies of `other-repo` change (npm bug [#8984](https://github.com/npm/cli/issues/8984)), so `other-repo` has to notify you itself.
This command does that without generating an import map, so `other-repo` needs no Nudeps installed.

Run it from `other-repo`'s `dependencies` hook: `"dependencies": "npx nudeps dependents"`.
With [`wireLocalDeps: true`](/config/#wirelocaldeps), your app's run adds that hook to every local dependency in the chain. Otherwise, add it yourself.
`nudeps dependents` itself never edits a `package.json`.
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
