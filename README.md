# jamlog — landing page

A tiny [SvelteKit](https://kit.svelte.dev) page that sits on the `jamlog.lol`
domain and explains that the original jamlog is paused. Spotify's developer
platform changes broke the old app, and all focus has moved to
[fast.jamlog.lol](https://fast.jamlog.lol).

It reuses the design tokens and fonts (Pixelify Sans + Geist Mono, neutral-gray
OKLCH palette) from [oyuh/music-widget](https://github.com/oyuh/music-widget).

> The full original Next.js app lives on the **`future`** branch.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build      # outputs a static site
pnpm preview    # preview the production build
```

Deploys to Vercel as a static SvelteKit app (via `@sveltejs/adapter-auto`).
