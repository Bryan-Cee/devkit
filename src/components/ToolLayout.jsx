export function ToolLayout({ title, description, onCopy, onClear, copyLabel = 'Copy output', extraActions, error, children }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {extraActions}
          <button className="btn btn-secondary" onClick={onCopy} type="button">
            {copyLabel}
          </button>
          <button className="btn btn-danger" onClick={onClear} type="button">
            Clear
          </button>
        </div>
      </div>
      {error ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Pane({ title, subtitle, children }) {
  return (
    <section className="tool-card space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}
