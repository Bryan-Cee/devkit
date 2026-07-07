import { useCallback, useRef } from 'react'
import { lineCount } from '../utils/devkit'

function gutterText(text) {
  const lines = Math.max(1, lineCount(text))
  let out = ''
  for (let index = 1; index <= lines; index += 1) {
    out += index + (index < lines ? '\n' : '')
  }
  return out
}

// ─── App-level tool shell ───────────────────────────────────────────────────────
export function ToolShell({ title, description, actions, controls, view, error, children }) {
  return (
    <section className="tool-shell">
      <div className="tool-shell__header">
        <h1 className="tool-shell__title">{title}</h1>
        {description ? <p className="tool-shell__desc">{description}</p> : null}
      </div>
      {actions || view ? (
        <div className="tool-shell__toolbar">
          <div className="tool-shell__actions">{actions}</div>
          {view ? <div className="tool-shell__view">{view}</div> : null}
        </div>
      ) : null}
      {controls ? <div className="tool-shell__controls">{controls}</div> : null}
      {error ? <div className="tool-shell__error">{error}</div> : null}
      {children}
    </section>
  )
}

// ─── Shared panel ─────────────────────────────────────────────────────────────
export function Panel({ title, meta, validity, onCopy, copyLabel = 'Copy', flush, bodyClassName = '', className = '', children }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel__header">
        <span className="panel__title">{title}</span>
        <span className="panel__meta">
          {validity ? <span className={`panel__dot panel__dot--${validity}`} aria-hidden="true" /> : null}
          {meta}
          {onCopy ? (
            <button className="panel__copy" onClick={onCopy} type="button">
              {copyLabel}
            </button>
          ) : null}
        </span>
      </div>
      <div className={`panel__body ${flush ? 'panel__body--flush' : 'panel__body--pad'} ${bodyClassName}`}>{children}</div>
    </section>
  )
}

// ─── Code panels with a line-number gutter synced to scroll ─────────────────────
function useGutterSync() {
  const gutterRef = useRef(null)
  const onScroll = useCallback((event) => {
    if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop
  }, [])
  return { gutterRef, onScroll }
}

export function CodeInput({ value, onChange, ariaLabel, placeholder }) {
  const { gutterRef, onScroll } = useGutterSync()
  return (
    <div className="code-panel">
      <div className="code-gutter" ref={gutterRef} aria-hidden="true">
        {gutterText(value)}
      </div>
      <textarea
        aria-label={ariaLabel}
        className="code-input"
        onChange={(event) => onChange(event.target.value)}
        onScroll={onScroll}
        placeholder={placeholder}
        spellCheck={false}
        value={value}
      />
    </div>
  )
}

export function CodeBlock({ text, highlight, placeholder = 'Output will appear here.' }) {
  const { gutterRef, onScroll } = useGutterSync()
  const hasText = Boolean(text)
  return (
    <div className="code-panel">
      <div className="code-gutter" ref={gutterRef} aria-hidden="true">
        {gutterText(hasText ? text : '')}
      </div>
      <div className="code-scroll" onScroll={onScroll}>
        <pre className="code-text">{hasText ? (highlight ? highlight(text) : text) : <span className="panel-placeholder">{placeholder}</span>}</pre>
      </div>
    </div>
  )
}

// ─── View toggle (Split / Tree only / Preview only …) ───────────────────────────
export function ViewToggle({ options, value, onChange, label = 'View' }) {
  return (
    <div className="chip-group" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          className={`chip${value === option.value ? ' chip--active' : ''}`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ─── Chip toggle group (config E controls) ──────────────────────────────────────
export function ChipGroup({ label, options, value, onChange }) {
  return (
    <div className="chip-group" role="group" aria-label={label}>
      {label ? <span className="chip-group__label">{label}</span> : null}
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          className={`chip${value === option.value ? ' chip--active' : ''}`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
