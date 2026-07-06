import { Suspense, useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CommandPalette } from './components/CommandPalette'
import { useLocalStorage } from './hooks/useLocalStorage'
import { tools } from './tools'

const toolLookup = Object.fromEntries(tools.map((tool) => [tool.slug, tool]))

function Home({ recentTools, onOpenPalette }) {
  const grouped = tools.reduce((accumulator, tool) => {
    accumulator[tool.category] ||= []
    accumulator[tool.category].push(tool)
    return accumulator
  }, {})

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-500 to-cyan-500 p-6 text-white shadow-lg shadow-sky-500/20">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-100">DevKit</p>
        <h1 className="mt-2 text-4xl font-semibold">Private developer tools, all in one static app.</h1>
        <p className="mt-3 max-w-3xl text-sm text-sky-50/90">
          Fast client-side utilities for formatting, encoding, parsing, previewing, and generating developer data. Nothing leaves the browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn bg-white text-sky-700 hover:bg-sky-50" onClick={onOpenPalette} type="button">
            Open command palette (⌘/Ctrl + K)
          </button>
          <a className="btn border border-white/40 text-white hover:bg-white/10" href="#/tool/json-viewer">
            Start with JSON Viewer
          </a>
        </div>
      </section>

      <section className="tool-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recently used tools</h2>
          <span className="badge">Stored in localStorage</span>
        </div>
        {recentTools.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentTools.map((tool) => (
              <a className="rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-700 dark:hover:border-sky-700 dark:hover:bg-slate-800" href={`#/tool/${tool.slug}`} key={tool.slug}>
                <p className="font-medium">{tool.name}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Open a tool and it will appear here for quick access later.</p>
        )}
      </section>

      {Object.entries(grouped).map(([category, items]) => (
        <section className="tool-card" key={category}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{category}</h2>
            <span className="badge">{items.length} tools</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((tool) => (
              <a className="rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-700 dark:hover:border-sky-700 dark:hover:bg-slate-800" href={`#/tool/${tool.slug}`} key={tool.slug}>
                <p className="font-medium">{tool.name}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function ToolRoute() {
  const { slug = '' } = useParams()
  const tool = toolLookup[slug]

  if (!tool) {
    return (
      <section className="tool-card">
        <h1 className="text-2xl font-semibold">Tool not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick a tool from the sidebar or return home.</p>
      </section>
    )
  }

  const Component = tool.component
  return (
    <Suspense
      fallback={
        <section className="tool-card">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading tool…</p>
        </section>
      }
    >
      <Component />
    </Suspense>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useLocalStorage('devkit-theme', 'dark')
  const [recent, setRecent] = useLocalStorage('devkit-recent-tools', [])
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const recentTools = useMemo(() => recent.map((slug) => toolLookup[slug]).filter(Boolean), [recent])
  const activeSlug = location.pathname.startsWith('/tool/') ? location.pathname.replace('/tool/', '') : ''

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme !== 'dark')
  }, [theme])

  useEffect(() => {
    if (!activeSlug || !toolLookup[activeSlug]) return
    setRecent((current) => [activeSlug, ...current.filter((slug) => slug !== activeSlug)].slice(0, 6))
  }, [activeSlug, setRecent])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
        setNavOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const selectTool = (slug) => {
    navigate(`/tool/${slug}`)
    setPaletteOpen(false)
    setNavOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <CommandPalette onClose={() => setPaletteOpen(false)} onSelect={selectTool} open={paletteOpen} recentTools={recentTools} tools={tools} />
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col lg:flex-row">
        <aside className={`${navOpen ? 'block' : 'hidden'} border-b border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-900/90 lg:block lg:w-80 lg:border-b-0 lg:border-r`}>
          <div className="flex items-center justify-between gap-3">
            <button className="text-left" onClick={() => navigate('/')} type="button">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">DevKit</p>
              <h1 className="text-2xl font-semibold">Toolbox</h1>
            </button>
            <button className="btn btn-secondary lg:hidden" onClick={() => setNavOpen(false)} type="button">
              Close
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Client-side utilities with persisted state, command palette search, and zero backend requirements.</p>
          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary flex-1" onClick={() => setPaletteOpen(true)} type="button">
              Command palette
            </button>
            <button className="btn btn-secondary" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} type="button">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          <nav className="mt-6 space-y-6">
            {Object.entries(
              tools.reduce((accumulator, tool) => {
                accumulator[tool.category] ||= []
                accumulator[tool.category].push(tool)
                return accumulator
              }, {}),
            ).map(([category, items]) => (
              <section key={category}>
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{category}</p>
                <div className="space-y-1">
                  {items.map((tool) => (
                    <NavLink
                      className={({ isActive }) =>
                        `block rounded-2xl px-3 py-2 text-sm transition ${isActive ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-100' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`
                      }
                      key={tool.slug}
                      onClick={() => setNavOpen(false)}
                      to={`/tool/${tool.slug}`}
                    >
                      {tool.name}
                    </NavLink>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button className="btn btn-secondary" onClick={() => setNavOpen(true)} type="button">
              Browse tools
            </button>
            <button className="btn btn-secondary" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} type="button">
              {theme === 'dark' ? 'Light theme' : 'Dark theme'}
            </button>
          </div>
          <Routes>
            <Route element={<Home onOpenPalette={() => setPaletteOpen(true)} recentTools={recentTools} />} path="/" />
            <Route element={<ToolRoute />} path="/tool/:slug" />
          </Routes>
        </main>
      </div>
    </div>
  )
}
