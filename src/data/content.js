/**
 * content.js — SINGLE SOURCE OF TRUTH for all brands & projects.
 *
 * Every piece of work Lee has done lives here as one record. The site UI,
 * the SEO/GEO structured data, and the (future) live-site crawl all read
 * from this file — nothing about a project should be hard-coded in a
 * component again.
 *
 * SCOPE FLAGS
 *   scope.brand    → identity/logo work exists (shows in brand showcase)
 *   scope.product  → digital product work exists (shows in product showcase)
 *   A record can be brand-only, product-only, or both.
 *
 * STATUS  (set per record so we can narrow the list without deleting history)
 *   'live'    → include on the site
 *   'draft'   → kept on record, hidden from the site for now
 *   'archive' → retired, kept for the permanent record only
 *
 * ASSETS
 *   Paths point at the CURRENT (legacy) /images files for now. Once the list
 *   is finalised we physically reorganise to /public/work/<slug>/… and only
 *   the values here change — never the components.
 *
 * RESEARCH PLACEHOLDERS  (empty = to be filled, likely via live-site crawl)
 *   url        → canonical live site (null where unknown / no live site)
 *   summary    → 1–2 sentence what-it-is + what-Lee-did (for GEO/LLM + UI)
 *   sector     → e.g. 'fintech', 'proptech', 'saas', 'consumer'
 *   year       → engagement year(s)
 *   tags       → freeform keywords for search/structured data
 */

/** @typedef {'live'|'draft'|'archive'} Status */

export const work = [
  // ── Flagship: brand + product ───────────────────────────────────────
  {
    slug: 'tracksynk', name: 'Tracksynk', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://tracksynk.com/',
    services: ['Brand Design', 'Product Design', 'Strategy', 'Full-Stack Engineering'],
    assets: { mark: '/images/-4.svg', wordmark: '/images/-3.svg', preview: '/images/previews/tracksynk.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'paloma', name: 'Paloma', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://palomagroup.com/',
    services: ['Brand Design', 'Brand Strategy', 'Web Strategy', 'Website Development'],
    assets: { mark: '/images/3.svg', wordmark: '/images/4.svg', preview: '/images/previews/palomagroup.png' },
    summary: '', sector: 'venture studio', year: '', tags: [],
  },
  {
    slug: 'geodde', name: 'Geodde', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://geodde.com/',
    services: ['Brand Strategy', 'Brand Design'],
    assets: { mark: '/images/-6.svg', wordmark: '/images/-5.svg', preview: '/images/previews/geodde.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'klippr', name: 'Klippr', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://klippr.ai/',
    services: ['Brand Strategy', 'Brand Design', 'Web Design', 'Web Development'],
    assets: { mark: '/images/-2.svg', wordmark: '/images/-1.svg', preview: '/images/previews/klippr.png' },
    summary: '', sector: 'ai', year: '', tags: [],
  },
  {
    slug: 'gondola', name: 'Gondola', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://gogondola.com/',
    services: ['Brand Strategy', 'Brand Design', 'Website Development Strategy'],
    assets: { mark: '/images/1.svg', wordmark: '/images/2.svg', preview: '/images/previews/gogondola.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'planna', name: 'Planna', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://www.yourplanna.com.au/',
    services: ['Brand Strategy', 'Brand Design', 'Web Design'],
    assets: { mark: '/images/27.svg', wordmark: '/images/28.svg', preview: '/images/previews/yourplanna.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'authsignal', name: 'Authsignal', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://authsignal.com/',
    services: ['Brand Design', 'Product Design', 'Strategy'],
    assets: { mark: '/images/14.svg', wordmark: '/images/15.svg', preview: '/images/previews/authsignal.png' },
    summary: '', sector: 'fintech', year: '', tags: [],
  },
  {
    slug: 'botallow', name: 'Botallow', status: 'draft',
    scope: { brand: true, product: true },
    url: 'https://botallow.com/',
    services: ['Brand Design', 'Product Design'],
    assets: { mark: '/images/7.svg', wordmark: '/images/8.svg', preview: '/images/previews/botallow.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'sipper', name: 'Enjoy a Sipper', status: 'live',
    scope: { brand: true, product: true },
    url: 'https://www.enjoyasipper.com/',
    services: ['Brand Design', 'Product Design'],
    assets: { mark: '/images/9.svg', wordmark: '/images/10.svg', preview: '/images/previews/enjoyasipper.png' },
    summary: '', sector: 'consumer', year: '', tags: [],
  },

  // ── Brand work with a preview on file (product scope TBD by Lee) ─────
  {
    slug: 'nextwork', name: 'Nextwork', status: 'live',
    scope: { brand: true, product: false },
    url: 'https://www.nextwork.org/',
    services: ['Brand Design'],
    assets: { mark: '/images/5.svg', wordmark: '/images/6.svg', preview: '/images/previews/nextwork.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'plerion', name: 'Plerion', status: 'draft',
    scope: { brand: true, product: false },
    url: 'https://www.plerion.com/',
    services: ['Brand Design'],
    assets: { mark: '/images/23.svg', wordmark: '/images/24.svg', preview: '/images/previews/plerion.png' },
    summary: '', sector: 'security', year: '', tags: [],
  },
  {
    slug: 'supahuman', name: 'Supahuman', status: 'draft',
    scope: { brand: true, product: false },
    url: 'https://www.supahuman.com/',
    services: ['Brand Design'],
    assets: { mark: '/images/19.svg', wordmark: null, preview: '/images/previews/supahuman.png' },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'spinaway', name: 'Spinaway', status: 'draft',
    scope: { brand: true, product: false },
    url: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/',
    services: ['Brand Design', 'Product Design'],
    assets: { mark: '/images/17.svg', wordmark: '/images/18.svg', preview: '/images/previews/spinaway.png' },
    summary: 'Best Awards–recognised work via Paloma. No standalone live site.', sector: '', year: '', tags: [],
  },

  // ── Brand-only (logos). URLs/summaries TO RESEARCH — likely via crawl ─
  {
    slug: 'clearspend', name: 'ClearSpend', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: '/images/11.svg', wordmark: '/images/12.svg', preview: null },
    summary: '', sector: 'fintech?', year: '', tags: [],
  },
  {
    slug: 'blank-canvas', name: 'Blank Canvas', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: null, wordmark: '/images/13.svg', preview: null },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'tailor', name: 'Tailor', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: null, wordmark: '/images/16.svg', preview: null },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'dovetail', name: 'Dovetail', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: '/images/20.svg', wordmark: '/images/21.svg', preview: null },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'eyeup', name: 'Eyeup', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: null, wordmark: '/images/22.svg', preview: null },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'sucasa', name: 'Sucasa', status: 'live',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: '/images/25.svg', wordmark: '/images/26.svg', preview: null },
    summary: '', sector: 'proptech?', year: '', tags: [],
  },
  {
    slug: 'blue-dwarf', name: 'Blue Dwarf', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: '/images/29.svg', wordmark: '/images/30.svg', preview: null },
    summary: '', sector: '', year: '', tags: [],
  },
  {
    slug: 'tripwell', name: 'Tripwell', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: '/images/31.svg', wordmark: '/images/32.svg', preview: null },
    summary: '', sector: 'travel?', year: '', tags: [],
  },
  {
    slug: 'grow-my-money', name: 'Grow My Money', status: 'draft',
    scope: { brand: true, product: false },
    url: null,
    services: ['Brand Design'],
    assets: { mark: '/images/33.svg', wordmark: '/images/34.svg', preview: null },
    summary: '', sector: 'fintech?', year: '', tags: [],
  },
];

// ── Media strips ─────────────────────────────────────────────────────────
// Each project's imagery lives in /public/work/<slug>/01.jpg, 02.jpg, …
// `media` is the ordered strip (first = the hero-grid cover). Drop real files
// into the folder and they appear; until then components fall back to Picsum
// via shotFallback(). Override a record's `media` above for a custom count/order.
const shots = (slug, n = 4) =>
  Array.from({ length: n }, (_, i) => `/work/${slug}/${String(i + 1).padStart(2, '0')}.jpg`);
for (const w of work) if (!w.media) w.media = shots(w.slug);

/** Stable Picsum placeholder for a (slug, index) — used as an <img onError> fallback. */
export const shotFallback = (slug, i = 0) =>
  `https://picsum.photos/seed/lcd-${slug}-${i + 1}/1280/720`;

// ── Hero-grid tile shape per project ──────────────────────────────────────
// Controls each project's cell in the mosaic: 'wide' (2:1) | 'tall' (1:2) | 'square'.
// Author the cover image to match (see /proto-e). Edit a slug here to reshape it.
const TILE = {
  tracksynk: 'wide', paloma: 'square', geodde: 'tall', klippr: 'square',
  gondola: 'wide', planna: 'wide', authsignal: 'tall', botallow: 'square',
  sipper: 'wide', nextwork: 'square', plerion: 'tall', sucasa: 'square',
};
for (const w of work) w.tile = TILE[w.slug] || 'square';

// ── Derived views (use these in components instead of filtering inline) ──
export const liveWork = work.filter((w) => w.status === 'live');
export const brandWork = liveWork.filter((w) => w.scope.brand);
export const productWork = liveWork.filter((w) => w.scope.product);

export default work;
