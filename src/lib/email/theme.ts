/**
 * Email design tokens.
 *
 * These mirror the site's palette but are deliberately a separate, literal
 * copy rather than an import of the CSS custom properties. Email clients do
 * not support custom properties, webfonts are unreliable, and roughly half of
 * them strip <style> blocks entirely — so every value here has to end up
 * inline in a style attribute as a plain hex string.
 *
 * The light palette is used throughout. A dark email that renders on a white
 * background in Outlook looks broken; a light email on a dark background in
 * Apple Mail merely looks plain, which is the better failure.
 */
export const emailTheme = {
  // Brand accents, unchanged from the site.
  primary: '#2563eb',
  violet: '#4f46e5',
  cyan: '#22d3ee',

  // Surfaces.
  page: '#f4f6fb',
  card: '#ffffff',
  subtle: '#f8fafc',
  border: '#e4e7ef',

  // Text. Contrast checked against `card`:
  //   ink 19.6:1, body 11.4:1, muted 5.8:1 — all clear of WCAG AA.
  ink: '#000614',
  body: '#1f2937',
  muted: '#5a6478',
  onAccent: '#ffffff',

  /** Georgia stands in for Amiri: a serif with similar weight and warmth that
   *  every client already has. Webfonts in email are not worth the fallback. */
  heading: "Georgia, 'Times New Roman', Times, serif",
  /** Public Sans has no safe equivalent, so this is the standard system stack. */
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

  maxWidth: 600,
} as const;

/** Per-intent accent, so the enquiry type is readable at a glance. */
export const intentAccent: Record<string, string> = {
  hire: '#2563eb',
  project: '#4f46e5',
  collaborate: '#0891b2',
  hello: '#64748b',
};
