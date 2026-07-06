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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-20 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-4 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          className="field border-slate-700 bg-slate-950 text-white"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools…"
          value={query}
        />
        <div className="mt-4 space-y-4">
          {!query && recentAndFiltered.length ? (
            <section>
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">Recently used</p>
              <div className="space-y-2">
                {recentAndFiltered.map((tool) => (
                  <button
                    className="flex w-full items-center justify-between rounded-2xl bg-slate-800 px-4 py-3 text-left hover:bg-slate-700"
                    key={tool.slug}
                    onClick={() => onSelect(tool.slug)}
                    type="button"
                  >
                    <span>{tool.name}</span>
                    <span className="text-xs text-slate-400">Open</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
          <section>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">All tools</p>
            <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {filteredTools.map((tool) => (
                <button
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left hover:bg-slate-800"
                  key={tool.slug}
                  onClick={() => onSelect(tool.slug)}
                  type="button"
                >
                  <div>
                    <p>{tool.name}</p>
                    <p className="text-xs text-slate-400">{tool.description}</p>
                  </div>
                  {recentIds.has(tool.slug) ? <span className="badge bg-sky-500/20 text-sky-200">Recent</span> : null}
                </button>
              ))}
              {!filteredTools.length ? <p className="px-4 py-8 text-center text-sm text-slate-400">No tools matched your search.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
