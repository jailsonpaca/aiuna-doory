import { EMBED_HIDDEN_PANEL_IDS, isEmbedMode } from '@/features/embed/embedMode'
import { useSyncExternalStore } from 'react'
import { useEditor, useEditorStateShallow } from '../context'
import { panels } from './registry'

/** Panels visible for the current editor state (some need an account service or edit rights). */
export function useVisiblePanels() {
  const editor = useEditor()
  const all = useSyncExternalStore(panels.subscribe, panels.getSnapshot)
  const embed = isEmbedMode()
  return useEditorStateShallow((state) =>
    all.filter((p) => {
      if (embed && EMBED_HIDDEN_PANEL_IDS.has(p.id)) return false
      return !p.requires || p.requires({ editor, state })
    }),
  )
}
