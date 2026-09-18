# Memoraa Step 9 deployment

1. Replace every `__DOMAIN__` with the verified HTTPS origin with no trailing slash, for example your approved production origin.
2. Deploy the contents of this folder at the site root. `index.html` is the public entry.
3. Preserve `service-worker.js`, `manifest.webmanifest`, icons, `robots.txt`, `sitemap.xml`, `404.html`, `_headers` and `.nojekyll` at the root.
4. Configure host response headers equivalent to `_headers`. GitHub Pages does not apply `_headers`; private surfaces need an approved host or backend that can enforce `Cache-Control: private, no-store` and `X-Robots-Tag`.
5. Do not add analytics until verified IDs and consent architecture are approved. Never add payment, email or storage secrets to client files.
6. After deployment, validate canonical and social URLs, fetch robots/sitemap, test the 404 page, install PWA, and confirm Workspace/Admin are network-only and excluded from cache.

## Required verified inputs
[BUSINESS DETAILS], [DOMAIN], [BACKEND PROVIDER], [PAYMENT KEYS], [EMAIL PROVIDER], [STORAGE PROVIDER], [ANALYTICS IDS], [LEGAL REVIEW].
