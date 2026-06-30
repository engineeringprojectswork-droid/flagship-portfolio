// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL — update before deploy (drives sitemap, canonical, hreflang, OG).
const SITE = 'https://mohamed-mahmoud-kw.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
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
