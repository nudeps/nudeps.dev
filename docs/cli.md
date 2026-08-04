# CLI

## `nudeps install`

Install Nudeps into a project: adds the npm lifecycle script that keeps your import map up to date, then runs Nudeps once to initialize.
This is the only command most projects ever need to run by hand.
See [Getting Started](/start/).

## `nudeps`

Copy dependencies and regenerate the import map.
npm runs this for you whenever dependencies change, so you only need it explicitly if something seems off.

Every [config option](/config/) that has a CLI equivalent can be passed as a flag, e.g. `npx nudeps --dir=vendor -m prod`.

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
