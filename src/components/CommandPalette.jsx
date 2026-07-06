import { useMemo, useState } from 'react'

export function CommandPalette({ open, onClose, onSelect, tools, recentTools }) {
  const [query, setQuery] = useState('')

  const filteredTools = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return tools
    return tools.filter(({ name, keywords }) => `${name} ${keywords.join(' ')}`.toLowerCase().includes(term))
  }, [query, tools])

  if (!open) return null

  const recentIds = new Set(recentTools.map(({ slug }) => slug))
  const recentAndFiltered = recentTools.filter(({ name, keywords }) => `${name} ${keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div
      onClick={onClose}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        padding: '5rem 1rem 1rem',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '38rem',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          padding: '0.75rem',
        }}
      >
        {/* Search input row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '0.625rem',
            marginBottom: '0.5rem',
          }}
        >
          <span aria-hidden="true" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', flexShrink: 0, fontSize: '0.9rem' }}>{'>'}</span>
          <input
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              outline: 'none',
            }}
            type="text"
            value={query}
          />
          <button
            aria-label="Close palette"
            onClick={onClose}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--dim)',
              border: '1px solid var(--line)',
              padding: '0.1875rem 0.5rem',
              background: 'transparent',
              cursor: 'pointer',
            }}
            type="button"
          >
            ESC
          </button>
        </div>

        <div style={{ maxHeight: '26rem', overflowY: 'auto' }}>
          {!query && recentAndFiltered.length ? (
            <div style={{ marginBottom: '0.25rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--dim)', textTransform: 'uppercase', padding: '0.25rem 0.5rem 0.25rem', borderBottom: '1px solid var(--line)' }}>
                Recently used
              </p>
              {recentAndFiltered.map((tool) => (
                <button
                  key={tool.slug}
                  onClick={() => onSelect(tool.slug)}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4375rem 0.625rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--line)',
                    borderLeft: '2px solid transparent',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 100ms, background-color 100ms',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = 'var(--accent)'
                    e.currentTarget.style.backgroundColor = 'rgba(95,212,160,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderLeftColor = 'transparent'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  type="button"
                >
                  <span>{tool.name}</span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--dim)' }}>recent</span>
                </button>
              ))}
            </div>
          ) : null}

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--dim)', textTransform: 'uppercase', padding: '0.25rem 0.5rem 0.25rem', borderBottom: '1px solid var(--line)' }}>
              All tools
            </p>
            {filteredTools.map((tool) => (
              <button
                key={tool.slug}
                onClick={() => onSelect(tool.slug)}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.4375rem 0.625rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--line)',
                  borderLeft: '2px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 100ms, background-color 100ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftColor = 'var(--accent)'
                  e.currentTarget.style.backgroundColor = 'rgba(95,212,160,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                type="button"
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text)' }}>{tool.name}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.125rem' }}>{tool.description}</p>
                </div>
                {recentIds.has(tool.slug) ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.125rem 0.375rem', flexShrink: 0, background: 'rgba(95,212,160,0.1)' }}>
                    recent
                  </span>
                ) : null}
              </button>
            ))}
            {!filteredTools.length ? (
              <p style={{ padding: '2rem 0.625rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--dim)' }}>
                No tools matched your search.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

