/**
 * Aiuna Growth embeds Doory in an iframe with `?embed=1`.
 * When active, chrome that belongs to the standalone product is hidden.
 */
const EMBED_QUERY = 'embed'
const LANG_QUERY = 'lang'

let cached: boolean | null = null

export function isEmbedMode(): boolean {
  if (cached !== null) return cached
  if (typeof window === 'undefined') {
    cached = false
    return cached
  }
  const params = new URLSearchParams(window.location.search)
  cached = params.get(EMBED_QUERY) === '1' || params.get(EMBED_QUERY) === 'true'
  return cached
}

/** Preferred locale from the embed URL (`lang=pt`), or null when unset. */
export function embedLangParam(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(LANG_QUERY)
}

/** Rail tools that Aiuna Growth does not offer (images-only posts for now). */
export const EMBED_HIDDEN_PANEL_IDS = new Set(['videos', 'animate', 'audio'])
