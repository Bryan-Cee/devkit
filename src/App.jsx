import { Suspense, useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CommandPalette } from './components/CommandPalette'
import { useLocalStorage } from './hooks/useLocalStorage'
import { tools } from './tools'

const toolLookup = Object.fromEntries(tools.map((tool) => [tool.slug, tool]))

const CATEGORY_GLYPHS = {
  'Text / Data format': '{}',
  'URL / Web': '#',
  'Encoding / Hashing / IDs': '01',
  'Text utilities': 'Aa',
  'Misc': '*',
}

const TOOL_TAGS = {
  'json-viewer': '.json',
  'json-converter': '.json',
  'html-viewer': '.html',
  'html-formatter': '.html',
  'html-entities': '.html',
  'markdown-previewer': '.md',
  'url-parser': '.url',
  'url-codec': '.url',
  'base64': '.b64',
  'jwt-decoder': '.jwt',
  'hash-generator': '.hash',
  'id-generator': '.id',
  'timestamp-converter': '.ts',
  'diff-checker': '.diff',
  'regex-tester': '.re',
  'case-converter': '.txt',
  'lorem-generator': '.txt',
  'color-picker': '.css',
  'qr-generator': '.qr',
}

function ToolRow({ tool }) {
  return (
    <a className="tool-row" href={`#/tool/${tool.slug}`}>
      <span className="tool-row-name">{tool.name}</span>
      <span className="tool-row-desc">{tool.description}</span>
      <span className="tool-row-tag">{TOOL_TAGS[tool.slug] ?? '.tool'}</span>
    </a>
  )
}

function Home({ recentTools }) {
  const [query, setQuery] = useState('')

  const grouped = tools.reduce((accumulator, tool) => {
    accumulator[tool.category] ||= []
    accumulator[tool.category].push(tool)
    return accumulator
  }, {})

  const filteredTools = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return null
    return tools.filter(({ name, keywords }) => `${name} ${keywords.join(' ')}`.toLowerCase().includes(term))
  }, [query])

  return (
    <div>
      <div className="cmd-bar" role="search">
        <span aria-hidden="true" className="cmd-prompt">{'>'}</span>
        <input
          aria-label="Search tools"
          className="cmd-input"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type a tool name — json, jwt, diff, qr…"
          type="text"
          value={query}
        />
        <span aria-hidden="true" className="cmd-cursor" />
        <span aria-hidden="true" className="cmd-hint">⌘K</span>
      </div>

      <p className="home-tagline">Client-side only. Nothing you paste here leaves the browser.</p>

      {filteredTools ? (
        <section>
          <div className="section-header">
            <span className="section-label">RESULTS</span>
            <span className="section-count">{filteredTools.length} tools</span>
          </div>
          <div className="tool-rows">
            {filteredTools.length ? (
              filteredTools.map((tool) => <ToolRow key={tool.slug} tool={tool} />)
            ) : (
              <p style={{ padding: '1.5rem 0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                No tools matched &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          {recentTools.length > 0 && (
            <section style={{ marginBottom: '1.5rem' }}>
              <div className="section-header">
                <span className="section-label">RECENT</span>
                <span className="section-count">{recentTools.length} tools</span>
              </div>
              <div className="tool-rows">
                {recentTools.map((tool) => (
                  <ToolRow key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} style={{ marginBottom: '1.5rem' }}>
              <div className="section-header">
                <span className="section-label">{category.toUpperCase()}</span>
                <span className="section-count">{items.length} tools</span>
              </div>
              <div className="tool-rows">
                {items.map((tool) => (
                  <ToolRow key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

function ToolRoute() {
  const { slug = '' } = useParams()
  const tool = toolLookup[slug]

  if (!tool) {
    return (
      <div className="page-scroll">
        <section className="tool-card">
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 500 }}>Tool not found</h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>Pick a tool from the sidebar or return home.</p>
        </section>
      </div>
    )
  }

  const Component = tool.component
  return (
    <Suspense
      fallback={
        <div className="page-scroll">
          <section className="tool-card">
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Loading tool…</p>
          </section>
        </div>
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

  const grouped = tools.reduce((accumulator, tool) => {
    accumulator[tool.category] ||= []
    accumulator[tool.category].push(tool)
    return accumulator
  }, {})

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

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app-shell" style={{ background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <CommandPalette onClose={() => setPaletteOpen(false)} onSelect={selectTool} open={paletteOpen} recentTools={recentTools} tools={tools} />

      {/* Mobile top bar */}
      <div className="mobile-bar">
        <button
          onClick={() => setNavOpen(true)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', background: 'none', border: '1px solid var(--line)', padding: '0.25rem 0.625rem', cursor: 'pointer' }}
          type="button"
        >
          ☰ menu
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          type="button"
        >
          DEVKIT
        </button>
        <button className="theme-btn" onClick={toggleTheme} type="button">
          {theme === 'dark' ? 'light' : 'dark'}
        </button>
      </div>

      <div className="app-body" style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar overlay (mobile) */}
        <div
          className={`sidebar-overlay${navOpen ? ' sidebar-overlay--open' : ''}`}
          onClick={() => setNavOpen(false)}
          role="presentation"
        />

        {/* Sidebar */}
        <aside className={`sidebar${navOpen ? ' sidebar--open' : ''}`}>
          <div className="sidebar-brand">
            <button
              onClick={() => { navigate('/'); setNavOpen(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
              type="button"
            >
              <p className="brand-label">DEVKIT</p>
              <h1 className="brand-name">Toolbox</h1>
            </button>
          </div>

          <div className="sidebar-meta">
            <span className="version-label">v0.1 · local only</span>
            <button className="theme-btn" onClick={toggleTheme} type="button">
              {theme === 'dark' ? 'light' : 'dark'}
            </button>
          </div>

          <nav aria-label="Tools" className="sidebar-nav">
            {Object.entries(grouped).map(([category, items]) => (
              <div className="nav-group" key={category}>
                <p className="nav-group-label">
                  <span aria-hidden="true" className="nav-group-glyph">{CATEGORY_GLYPHS[category]}</span>
                  {category.toUpperCase()}
                </p>
                {items.map((tool) => (
                  <NavLink
                    className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
                    key={tool.slug}
                    onClick={() => setNavOpen(false)}
                    title={tool.name}
                    to={`/tool/${tool.slug}`}
                  >
                    {tool.name}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-area">
          <Routes>
            <Route element={<div className="page-scroll"><Home recentTools={recentTools} /></div>} path="/" />
            <Route element={<ToolRoute />} path="/tool/:slug" />
          </Routes>
        </main>
      </div>
    </div>
  )
}

