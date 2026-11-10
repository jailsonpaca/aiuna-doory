import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/nunito'
import '@fontsource-variable/nunito/wght-italic.css'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/caveat'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import { embedLangParam, isEmbedMode } from './features/embed/embedMode'
import { initContrast } from './lib/contrast'
import App from './App'
import { activateLocale, loadLocale } from './i18n/catalog'
import { getLocale, setLocale, type Locale } from './i18n/locale'

// Before the first render, so high contrast is on from the first paint (the CSP allows no inline script for this).
initContrast()
const embedLang = embedLangParam()
const bootLocale: Locale =
  embedLang === 'pt' || (isEmbedMode() && !embedLang)
    ? 'pt'
    : embedLang === 'en' || embedLang === 'zh-CN' || embedLang === 'zh-TW'
      ? embedLang
      : getLocale()
await activateLocale(bootLocale).catch(() => loadLocale(getLocale()).catch(() => setLocale('en')))

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
