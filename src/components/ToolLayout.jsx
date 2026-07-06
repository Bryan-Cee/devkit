export function ToolLayout({ title, description, onCopy, onClear, copyLabel = 'Copy output', extraActions, error, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          borderBottom: '1px solid var(--line)',
          paddingBottom: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.0625rem', fontWeight: 500, color: 'var(--text)' }}>{title}</h1>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>{description}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
        <div
          style={{
            border: '1px solid rgba(224, 82, 82, 0.4)',
            background: 'rgba(224, 82, 82, 0.08)',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8125rem',
            color: '#e05252',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {error}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Pane({ title, subtitle, meta, className = '', contentClassName = '', children }) {
  return (
    <section className={`tool-card pane ${className}`.trim()}>
      <div className="pane-header">
        <div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text)', letterSpacing: '0.03em' }}>{title}</h2>
          {subtitle ? <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted)' }}>{subtitle}</p> : null}
        </div>
        {meta ? <div className="pane-meta">{meta}</div> : null}
      </div>
      <div className={`pane-content ${contentClassName}`.trim()}>{children}</div>
    </section>
  )
}
