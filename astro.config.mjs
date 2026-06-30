// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL — drives sitemap, canonical, hreflang, OG. This MUST be the
// public, crawlable origin. The site ships on GitHub Pages as a *project site*,
// so it is served from the `/flagship-portfolio/` subpath. `base` is prepended
// to every asset URL and to every internal-link helper, keeping the build
// self-contained under that subpath. (Netlify, a root host, was the earlier
// target, but its API is unreachable from this build environment.)
const SITE = 'https://engineeringprojectswork-droid.github.io';
const BASE = '/flagship-portfolio';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'never',
  // Real, indexable routes per language. `/` does a client redirect to the
  // saved/preferred locale. Both /en and /ar are explicit, prerendered routes.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', ar: 'ar-KW' },
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    // Dev-only: the preview runner launches with an 8.3 short-path cwd while
    // Node resolves modules to the long path, which trips Vite's fs allow-list
    // (/@vite/client + CSS would 404). Relaxing the check fixes local preview;
    // it has no effect on the static production build.
    server: {
      fs: { strict: false },
    },
  },
});
