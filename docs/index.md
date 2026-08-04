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
    image: https://cdn.bsky.app/img/avatar/plain/did:plc:7a4dbiurb44vggsynafivdpd/bafkreiet46lkur7446ds35nvx27wwlmxhu7hzwh2z2tk7vxwl5tzc346q4
---

## Try it

```bash
npx nudeps install
npm install vue
```

That's it — `import { createApp } from "vue"` now works in the browser. See [Getting Started](/start/) for the whole story.

## Background

- [Web dependencies are broken. Can we fix them?](https://lea.verou.me/blog/2026/web-deps/)
- [External import maps, today!](https://lea.verou.me/blog/2026/external-import-maps-today/)
- [Introducing Nudeps: Web dependencies, naked!](https://lea.verou.me/blog/2026/nudeps/) (upcoming)
