# npm Workspaces

Nudeps works inside a workspace package.
It finds the lockfile at the workspace root, where npm hoists dependencies, so both hoisted dependencies and sibling workspace packages resolve.
Hoisted dependencies are copied, and siblings are symlinked.

## Hooks

Run `npx nudeps install` in a workspace child.
Besides the child's own hooks, it adds `dependencies` and `prepare` hooks to the workspace root that run the same hook in every child: `npm run <hook> --if-present --workspaces`.

npm fires `dependencies` on the workspace root only, so the root's hook is what regenerates a child's import map after a dependency change.
If the root has no such hook, Nudeps warns: nothing would keep the child's map current.

A child's own run during `npm install`, `ci`, `uninstall` or `link` is skipped, because npm has yet to write the lockfile it resolves against, or is about to rewrite it.
The root's hook runs it again afterwards.
[`nudeps()`](/api/) resolves to `null` for a skipped run.

## Siblings as local dependencies

A sibling you depend on is a local dependency, but it needs no hook of its own: the root's hook already runs every child's.
See [Workspace siblings](/local-deps/#workspace-siblings).

## Deploying

On Netlify and Cloudflare, workspace children write their redirect rules to the root `_redirects`, prefixed with the child's directory.
This assumes the workspace root is the deploy root.
If it is not, set [`root`](/config/#root).
