# Local Dependencies

**Via `npm install ../other-repo`.**

When you have local dependencies (installed via `npm install ../other-repo`), nudeps automatically handles propagation between them, but there are a few things you need to know about it.

- You need Nudeps on both sides of the dependency for things to work
- Instead of copying `other-repo` to `client_modules/other-repo@<version>` by default it creates a symlink. You can tweak the [`symlink`](/config/#symlink) option to change this.
- Since the npm `dependencies` hook does not fire when the dependencies of `other-repo` change (see npm bug [#8984](https://github.com/npm/cli/issues/8984)), Nudeps on `other-repo` will run `npm run dependencies --if-present` in its own dependencies to trigger nudeps in them.

## Registration

Each time nudeps runs, it registers itself as a dependent of each of its local dependencies by writing its relative path to the dep's `.nudeps/local-dependents.json`.
If a local dependency doesn't have nudeps installed, a warning is printed suggesting you run `npx nudeps install` there.

## Propagation

When nudeps detects that the generated import map has actually changed (content differs from the file on disk), it reads `.nudeps/local-dependents.json` and runs `npx nudeps` in each listed dependent.
This ensures that when package B's dependencies change, any repo A that depends on B locally gets its import map updated automatically.

Circular local dependencies (A depends on B and B depends on A) are handled naturally: propagation only triggers when the map content changes, so cycles terminate once the maps converge.
