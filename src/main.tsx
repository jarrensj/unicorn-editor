
import { createRoot } from 'react-dom/client'
import { Analytics } from "@vercel/analytics/react"
import '@fontsource/nunito/700.css'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Analytics />
  </>
);
