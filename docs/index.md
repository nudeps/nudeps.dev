---
layout: landing
hero:
  image: /logo.svg
  title: Your dependencies, naked.
  tagline: Manage client-side dependencies with `npm install`, then import them by name — no bundler, no build step, no CDN.
  actions:
    - text: Get started
      href: /start/
    - text: Demos
      href: /demos/
    - text: GitHub
      href: https://github.com/nudeps/nudeps
      icon: github
features:
  - icon: 📦
    title: No bundling, no transpilation
    description: Neither your code nor your dependencies need a build step. Already transpiling? That works too.
    href: /how-it-works/
  - icon: 🏠
    title: Local-first
    description: Your dependencies are served from your own domain. No external requests, no CDN, no extra points of failure.
  - icon: ⚡
    title: Granular cache busting
    description: Versioned directory names give you CDN-grade caching. Updating one module leaves every other module cached.
  - icon: 🔄
    title: Self regenerating, sans watcher
    description: npm lifecycle hooks keep everything up to date as dependencies change. Nothing to start, nothing to watch.
    href: /how-it-works/
  - icon: 🎨
    title: The web is not just JS
    description: Stable, unversioned URLs for CSS, images, fonts and other package assets that can't go through an import map (yet).
    href: /config/aliases/
  - icon: 🧩
    title: Even the edge cases
    description: Dynamic `import()`, `import.meta.resolve()`, CJS packages, local packages, git dependencies, npm aliases, npm workspaces all work.
    href: /faq/
testimonials:
  - name: Sam Littlefair
    quote: "I ran the npx command and added the import map to my app, but I assumed that there was still a lot more work to do. I was shocked to realize I was done."
    title: Technical writer and Svelte developer
    avatar: https://cdn.bsky.app/img/avatar/plain/did:plc:7a4dbiurb44vggsynafivdpd/bafkreiet46lkur7446ds35nvx27wwlmxhu7hzwh2z2tk7vxwl5tzc346q4
  - name: James Stuckey Weber
    quote: "Nudeps is how I want to build for the web. It helps make sure my time is spent adding features, rather than wrangling build steps."
    title: Web software engineer at OddBird
    avatar: https://avatars.githubusercontent.com/u/167908?v=4
outro: |
  ## Background

  - [Web dependencies are broken. Can we fix them?](https://lea.verou.me/blog/2026/web-deps/)
  - [External import maps, today!](https://lea.verou.me/blog/2026/external-import-maps-today/)
  - [Introducing Nudeps: Web dependencies, naked!](https://lea.verou.me/blog/2026/nudeps/) (upcoming)
---

## Three steps, then forget it's there

<ol class="steps">
<li>

### Install Nudeps once per project

```bash
npx nudeps install
```

This adds Nudeps to your `devDependencies` and gives your `package.json` two scripts: `dependencies`, so Nudeps re-runs itself every time you `npm install` or `npm uninstall`, and `prepare`, so a fresh clone is ready too.
No watcher to start, nothing to remember.

</li>
<li>

### Add the import map to your HTML

```html
<script src="/importmap.js"></script>
```

One classic `<script>`, before any module scripts.
Nudeps keeps the file up to date; the tag never changes.

</li>
<li>

### Install dependencies like you always have

```bash
npm install vue
```

Nudeps copies `vue` and everything it depends on to `client_modules/`, in versioned directories that cache like a CDN, and adds them to the import map.
Plain `npm install`, not `-D`: what the browser imports is a real dependency.

</li>
</ol>

That's it. Bare specifiers now work in the browser, served from your own domain:

```js
import { createApp } from "vue";
```

No bundler, no build step, no CDN.
See it running in the [demos](/demos/), or read the [full walkthrough](/start/).
