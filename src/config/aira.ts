/**
 * AIRA — the future AJIX AI assistant, present on the Contact page as a visual
 * centrepiece only. No chat, no model, no behaviour in this sprint.
 *
 * To drop in the real character: put the file in /public/images/aira/ and set
 * `src` below. Nothing else changes — not the page, not the layout, not the
 * composition. If `src` is empty or the file fails to load, AiraCharacter
 * renders its built-in brand placeholder instead, so a missing asset can never
 * show a broken image.
 */
export const airaConfig = {
  /** e.g. '/images/aira/aira.png'. Empty = use the built-in placeholder. */
  src: '',

  /**
   * Describe what is actually depicted once a real asset is in place.
   * Ignored while the placeholder is showing — the placeholder is decorative
   * and is hidden from assistive technology.
   */
  alt: 'AIRA — the AJIX digital assistant',

  /** Intrinsic dimensions of the real asset, for layout stability. */
  width: 760,
  height: 980,
} as const;
