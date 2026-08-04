---
order: 0 # Before the reference pages
---

# Getting Started

To install Nudeps on a project and initialize it, run:

```bash
npx nudeps install
```

This will add a `dependencies` (or `predependencies`, `postdependencies` if `dependencies` is taken) script to your `package.json` that will run `nudeps` automatically whenever you install or uninstall packages.
It will also run Nudeps for you, which will copy your dependencies (and their transitive dependencies) to the client modules directory (as `./client_modules` by default) and generate an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) (as `importmap.js` by default).

You can see an example of what such a file looks like in the [`floating-ui` demo](https://github.com/nudeps/nudeps-demos/blob/main/floating-ui/importmap.js) (you can also browse the [other demos](https://github.com/nudeps/nudeps-demos)).

> [!NOTE]
> Normally you should avoid committing your import map to version control as it's a build artifact, but it is included there for demonstration purposes.

## Including the import map

To use the import map in your app, include it in a classic (non-module) `<script>` element, before any modules are loaded, either manually or via your templating system of choice:

```html
<script src="/importmap.js"></script>
```

> [!IMPORTANT]
> To maximize compatibility, this script needs to be included **before any module scripts are loaded, and must be included as a regular script, not a module script.**
> If you want to include it as `<script type="module" src="importmap.js">` instead, set the [`module`](/config/) option to `true` in your nudeps config.
> Please note that as of March 2026, this will _dramatically_ reduce browser support and is not recommended.

Once you do that, you can just **forget about Nudeps and go about your business**, using `npm install` and `npm uninstall` for dependencies as you normally would.
If something seems off, you can run `npx nudeps` explicitly, but most of the time things should Just Work™.

## Walkthrough: a Vue app

Suppose you want to use e.g. [VueJS](https://vuejs.org/) for a simple web app.

You could start by creating a new directory for your app with the following files:

```
my-app/
├── index.html
└── index.js
```

`index.html` might be something like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My App</title>
	<script src="importmap.js"></script>
	<script type="module" src="index.js"></script>
</head>
<body>
	<h1>My App</h1>
</body>
</html>
```

Install Nudeps and add the necessary npm hooks to your `package.json` by running:

```bash
npx nudeps install
```

Then you can install dependencies and they would Just Work™, starting with VueJS:

```bash
npm install vue
```

Now you can write `import { createApp } from "vue"` in your `index.js` file and it just works!

You can keep installing and uninstalling dependencies as needed, and use them immediately in your code — the import map will be updated automatically and you don't have to lift a finger!

## AI coding assistants

Nudeps ships with a [`SKILL.md`](https://github.com/nudeps/nudeps/blob/main/SKILL.md) — a comprehensive reference that teaches AI coding agents how to work with nudeps correctly (lifecycle hooks, generated artifacts, CJS handling, common mistakes, etc.).

The easiest way to install it is via the [`skills`](https://github.com/nicepkg/skills) CLI, which supports 45+ agents including Claude Code, Cursor, and Copilot:

```bash
npx skills add nudeps/nudeps
```

The skill file is also available at `node_modules/nudeps/SKILL.md` after installation.
