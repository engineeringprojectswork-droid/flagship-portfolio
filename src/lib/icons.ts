/**
 * Brand / technology icon registry.
 *
 * Real logos come from `simple-icons`; tools without an official open-source
 * logo (Canva, Adobe AE/Pr, Excel, the AI-video tools, Python stdlib bits) get
 * a clean monogram tile in a brand-appropriate colour. A glyph fallback covers
 * anything unmapped. Everything is decorative (aria-hidden in the component).
 */
import {
  siPython, siSqlite, siGithubactions, siGit, siAstro, siTypescript,
  siTailwindcss, siVercel, siMeta, siWhatsapp, siGooglesheets, siGoogledrive,
  siClaude, siGmail, siGithub, siFacebook, siInstagram, siTiktok, siYoutube,
} from 'simple-icons';

export interface TechIcon {
  label: string;
  /** accent colour for the chip glow */
  hex: string;
  /** raw inner SVG (24x24 viewBox) for a logo/glyph icon */
  inner?: string;
  /** monogram text shown on a coloured tile instead of an SVG */
  mono?: string;
  /** glyph/icon fill colour on a dark surface (defaults to hex; set lighter for dark brands) */
  on?: string;
}

const p = (d: string) => `<path d="${d}"/>`;
const fromSi = (si: { path: string; hex: string; title: string }, on?: string): TechIcon => ({
  label: si.title,
  hex: `#${si.hex}`,
  inner: p(si.path),
  on,
});

// A few hand-built glyphs (24x24) for stdlib / generic concepts.
const G = {
  // window / GUI toolkit
  window: p('M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 4v11h16V8H4Zm2-2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z'),
  // spreadsheet grid
  sheet: p('M3 3h18v18H3V3Zm2 2v4h6V5H5Zm8 0v4h6V5h-6Zm-8 6v4h6v-4H5Zm8 0v4h6v-4h-6Zm-8 6v4h6v-4H5Zm8 0v4h6v-4h-6Z'),
  // bidi / arrows
  bidi: p('M8 7 4 11l4 4v-3h8v3l4-4-4-4v3H8V7Z'),
  // arabic letter ain (RTL shaping)
  ain: p('M14.5 6c-2.5 0-4 1.6-4 3.6 0 1.7 1.2 2.9 3 2.9.8 0 1.5-.3 2-.8v.8c0 1.4-1 2.3-2.6 2.3-1 0-1.9-.3-2.6-.9l-.9 1.6c1 .8 2.3 1.2 3.6 1.2 2.8 0 4.6-1.7 4.6-4.4V6h-2.1v.8c-.5-.5-1.2-.8-2-.8Zm.2 1.9c1 0 1.7.7 1.7 1.7s-.7 1.6-1.7 1.6-1.6-.6-1.6-1.6.6-1.7 1.6-1.7Z'),
  // braces (ctypes / bindings)
  braces: p('M8 4c-2 0-3 1-3 3v2c0 1-.5 1.5-1.5 1.5v3C4.5 13.5 5 14 5 15v2c0 2 1 3 3 3v-2c-.8 0-1-.4-1-1.2V15c0-1-.5-1.7-1.4-2 .9-.3 1.4-1 1.4-2V7.2C7 6.4 7.2 6 8 6V4Zm8 0v2c.8 0 1 .4 1 1.2V11c0 1 .5 1.7 1.4 2-.9.3-1.4 1-1.4 2v3.8c0 .8-.2 1.2-1 1.2v2c2 0 3-1 3-3v-2c0-1 .5-1.5 1.5-1.5v-3C19 11.5 18.5 11 18.5 10V8c0-2-1-3-3-3l.5-1Z'),
  // GPU / accelerator card
  gpu: p('M3 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1v2h-2v-2H8v2H6v-2H3V6Zm2 2v8h14V8H5Zm2 2h6v4H7v-4Zm8 0h2v1h-2v-1Zm0 2h2v1h-2v-1Z'),
  // package / installer box
  box: p('M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3ZM5 9.6l6 3.3v6.8l-6-3.3V9.6Zm14 0v6.8l-6 3.3v-6.8l6-3.3Z'),
  // node graph (ComfyUI)
  nodes: p('M4 5h6v3h4V6h6v5h-6V9h-4v3h4v5h-6v-2H8v3H2v-5h6v2h2v-3H6V8H4V5Z'),
  // sparkles (AI)
  sparkles: p('M12 2l1.7 4.1L18 7.8l-4.3 1.7L12 14l-1.7-4.5L6 7.8l4.3-1.7L12 2Zm6.5 11l1 2.4 2.5 1-2.5 1-1 2.6-1-2.6-2.5-1 2.5-1 1-2.4Z'),
};

// dark brand hexes that need a lighter glyph colour on the dark UI
const D = {
  vercel: fromSi(siVercel, '#ffffff'),
  github: fromSi(siGithub, '#e8eef7'),
  sqlite: { ...fromSi(siSqlite), on: '#4F90C4' },
};

const REG: Record<string, TechIcon> = {
  python: fromSi(siPython),
  sqlite: D.sqlite,
  githubactions: fromSi(siGithubactions, '#5aa6ff'),
  git: fromSi(siGit),
  astro: fromSi(siAstro),
  typescript: fromSi(siTypescript),
  tailwind: fromSi(siTailwindcss),
  vercel: D.vercel,
  github: D.github,
  meta: fromSi(siMeta, '#3d92ff'),
  whatsapp: fromSi(siWhatsapp),
  googlesheets: fromSi(siGooglesheets),
  googledrive: fromSi(siGoogledrive),
  gmail: fromSi(siGmail),
  claude: fromSi(siClaude),
  facebook: fromSi(siFacebook, '#3d92ff'),
  instagram: fromSi(siInstagram, '#E1306C'),
  tiktok: fromSi(siTiktok, '#e8eef7'),
  youtube: fromSi(siYoutube),

  // monogram tiles — real brands without an open-source logo
  canva: { label: 'Canva', hex: '#00C4CC', mono: 'Cv' },
  aftereffects: { label: 'After Effects', hex: '#9999FF', mono: 'Ae' },
  premiere: { label: 'Premiere Pro', hex: '#EA77FF', mono: 'Pr' },
  excel: { label: 'Excel', hex: '#21A366', mono: 'Xl' },
  comfyui: { label: 'ComfyUI', hex: '#1FA2A6', inner: G.nodes },
  kling: { label: 'Kling', hex: '#FF5C8A', mono: 'Kl' },
  wan: { label: 'Wan', hex: '#5B8DEF', mono: 'Wn' },
  opensooq: { label: 'OpenSooq', hex: '#E8552D', mono: 'OS' },
  pyinstaller: { label: 'PyInstaller', hex: '#FFD43B', inner: G.box, on: '#FFD43B' },

  // concept chips (homepage skills) — monogram / glyph
  crm: { label: 'CRM', hex: '#0bb1c4', mono: 'Cr' },
  brandvideo: { label: 'Brand & Video', hex: '#ff9f0a', mono: 'Bv' },
  aiautomation: { label: 'AI Automation', hex: '#a259ff', inner: G.sparkles, on: '#c89bff' },
  bilingual: { label: 'Bilingual', hex: '#2997ff', inner: G.bidi, on: '#7cc0ff' },

  // glyph icons — Python stdlib / concepts
  tkinter: { label: 'Tkinter', hex: '#4B8BBE', inner: G.window, on: '#6db3e6' },
  openpyxl: { label: 'openpyxl', hex: '#21A366', inner: G.sheet, on: '#3ecb87' },
  arabicreshaper: { label: 'arabic-reshaper', hex: '#2997ff', inner: G.ain },
  pythonbidi: { label: 'python-bidi', hex: '#a259ff', inner: G.bidi, on: '#c89bff' },
  ctypes: { label: 'ctypes', hex: '#9aa0a6', inner: G.braces, on: '#c2c7cc' },
  gpu: { label: 'Rented GPUs', hex: '#76B900', inner: G.gpu, on: '#9ee04b' },
};

/** alias table → canonical key (handles compound / decorated chip labels) */
const ALIAS: Record<string, string> = {
  'tkinterttk': 'tkinter',
  'githubactions': 'githubactions',
  'claudecode': 'claude',
  'claudedesign': 'claude',
  'metaads': 'meta',
  'metaadsmanager': 'meta',
  'clicktowhatsapp': 'whatsapp',
  'whatsappweb': 'whatsapp',
  'whatsappwebreadonly': 'whatsapp',
  'rentedgpus': 'gpu',
  'tailwindcss': 'tailwind',
  'adobeaftereffects': 'aftereffects',
  'adobepremiere': 'premiere',
  'adobepremierepro': 'premiere',
  'googledrivesheets': 'googledrive',
  'excelgooglesheets': 'googlesheets',
  'crmmarketingops': 'crm',
  'bilingualar': 'bilingual',
};

function keyOf(raw: string): string {
  // take the leading token before a separator, strip parens/punctuation
  const lead = raw.split(/[/·(]/)[0].trim();
  return lead.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Resolve any tech/brand label to an icon descriptor (with a safe fallback). */
export function resolveTech(label: string): TechIcon {
  const k = keyOf(label);
  const key = ALIAS[k] ?? k;
  if (REG[key]) return REG[key];
  // fallback: first-letter monogram in the brand accent
  return { label, hex: '#a1a1a6', mono: label.trim().charAt(0).toUpperCase() || '•' };
}
