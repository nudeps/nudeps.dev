# Local Dependencies

**Via `npm install ../other-repo`.**

When you have local dependencies (installed via `npm install ../other-repo`), nudeps automatically handles propagation between them, but there are a few things you need to know about it.

- You only need Nudeps on your side. `other-repo` needs nothing installed, only a `dependencies` hook that runs [`npx nudeps dependents`](/cli/#nudeps-dependents), which is enough to notify you. Set [`wireLocalDeps`](/config/#wirelocaldeps) and Nudeps adds that hook for you. A library with no frontend of its own never has to take on Nudeps as a dependency.
- Instead of copying `other-repo` to `client_modules/other-repo@<version>` by default it creates a symlink. You can tweak the [`symlink`](/config/#symlink) option to change this.
- Since the npm `dependencies` hook does not fire when the dependencies of `other-repo` change (see npm bug [#8984](https://github.com/npm/cli/issues/8984)), `other-repo` will run `npm run dependencies --if-present` in each of its dependents to trigger nudeps in them.

## Registration

Each time nudeps runs, it registers each of its local dependencies, nested ones included, with the package that links it: it writes that package's relative path to the dep's `.nudeps/local-dependents.json`.
A local dependency in `devDependencies` is skipped, along with everything it links: Nudeps never installs it, so it has nothing to propagate.

With [`wireLocalDeps: true`](/config/#wirelocaldeps), it also makes sure each of them can notify back: if none of its `dependencies`, `predependencies` or `postdependencies` scripts mention nudeps, `"dependencies": "npx nudeps dependents"` is added to its `package.json`, preserving that file's existing formatting.
Without the option, Nudeps never edits another repo's `package.json`: it warns instead, and you can add the hook yourself.
Set it to `false` to drop the warning.
A [package rule](/config/overrides/) can set it for one dependency, and the setting then covers that dependency's own local dependencies too.
A dependency that already runs the full `npx nudeps` is left alone — it notifies its dependents anyway, and a second command would notify them twice.

### Workspace siblings

A package in the same [npm workspace](/workspaces/) shares your lockfile, and the workspace root's `dependencies` hook already runs every child's.
Nudeps still registers you as a dependent of the sibling, but leaves its `package.json` alone rather than adding a hook that would duplicate the root's.

## Propagation

When the dependencies of package B change, every repo that depends on B locally regenerates its import map, and so does every repo above it in the chain.
Circular local dependencies (A depends on B and B depends on A) terminate: the change stops when it comes back to a repo it has already passed through.

## Chains

Local dependencies can be nested: your app depends on `../lib`, which itself depends on `../util`.
Your app's run registers `util` with `lib` and, with `wireLocalDeps: true`, gives both their hook.
`npx nudeps dependents` also registers as a dependent of its own local dependencies before notifying its dependents, so a link added later is picked up too — a change in `util` reaches `lib`, and `lib` passes it on to your app.
None of the intermediate packages need Nudeps installed, and one that has it still passes the change on.
