import { useMemo, useRef } from 'react'

function lineCount(value) {
  if (!value) return 1
  return value.split(/\r\n|\r|\n/).length
}

function textStats(value) {
  const text = value ?? ''
  return {
    lines: lineCount(text),
    chars: text.length,
    bytes: new TextEncoder().encode(text).length,
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function highlightJson(value) {
  const escaped = escapeHtml(value)
  return escaped
    .replace(/"(\\.|[^"\\])*"(?=\s*:)/g, '<span class="syntax-key">$&</span>')
    .replace(/"(\\.|[^"\\])*"/g, '<span class="syntax-string">$&</span>')
    .replace(/\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, '<span class="syntax-number">$&</span>')
    .replace(/\b(true|false)\b/g, '<span class="syntax-boolean">$&</span>')
    .replace(/\bnull\b/g, '<span class="syntax-null">$&</span>')
}

function highlightHtml(value) {
  const escaped = escapeHtml(value)
  return escaped.replace(/(&lt;\/?)([a-zA-Z0-9-]+)([^&]*?)(\/?&gt;)/g, (_, start, tag, attrs, end) => {
    const highlightedAttrs = attrs.replace(/([a-zA-Z-:]+)(=)("[^"]*"|'[^']*')/g, '<span class="syntax-attr">$1</span>$2<span class="syntax-string">$3</span>')
    return `<span class="syntax-punct">${start}</span><span class="syntax-tag">${tag}</span>${highlightedAttrs}<span class="syntax-punct">${end}</span>`
  })
}

function highlightCode(value, language) {
  if (!value) return ''
  if (language === 'json') return highlightJson(value)
  if (language === 'html') return highlightHtml(value)
  return escapeHtml(value)
}

function LineNumbers({ count, scrollRef }) {
  return (
    <div aria-hidden="true" className="code-gutter" ref={scrollRef}>
      {Array.from({ length: count }, (_, index) => (
        <span className="code-line-number" key={index}>
          {index + 1}
        </span>
      ))}
    </div>
  )
}

export function TextStats({ value }) {
  const stats = useMemo(() => textStats(value), [value])
  return (
    <span className="pane-stats">
      {stats.lines}L · {stats.chars}C · {stats.bytes}B
    </span>
  )
}

export function CodeEditor({ value, onChange, readOnly = false, language = 'text', placeholder }) {
  const count = lineCount(value)
  const gutterRef = useRef(null)

  return (
    <div className="code-surface">
      <LineNumbers count={count} scrollRef={gutterRef} />
      <textarea
        className={`code-textarea code-textarea--${language}`}
        onChange={onChange}
        onScroll={(event) => {
          if (gutterRef.current) {
            gutterRef.current.scrollTop = event.currentTarget.scrollTop
          }
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        value={value}
      />
    </div>
  )
}

export function CodeOutput({ value, language = 'text', emptyLabel }) {
  const count = lineCount(value || emptyLabel || '')
  const highlighted = useMemo(() => highlightCode(value || emptyLabel || '', language), [value, emptyLabel, language])

  return (
    <div className="code-surface">
      <LineNumbers count={count} />
      <pre className={`code-output code-output--${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  )
}
