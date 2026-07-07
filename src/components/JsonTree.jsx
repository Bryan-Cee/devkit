import { useState } from 'react'

function classForValue(value) {
  if (typeof value === 'string') return 'tok-string'
  if (typeof value === 'number') return 'tok-number'
  if (typeof value === 'boolean') return 'tok-bool'
  if (value === null) return 'tok-null'
  return ''
}

function labelFor(value) {
  if (Array.isArray(value)) return `Array(${value.length})`
  if (value && typeof value === 'object') return 'Object'
  return JSON.stringify(value)
}

function TreeNode({ label, value, depth = 0 }) {
  const isBranch = value && typeof value === 'object'
  const [open, setOpen] = useState(depth < 1)

  if (!isBranch) {
    return (
      <div style={{ fontFamily: 'var(--font-mono)' }}>
        <span className="tree-leaf-key">{label}: </span>
        <span className={classForValue(value)}>{labelFor(value)}</span>
      </div>
    )
  }

  const entries = Array.isArray(value) ? value.map((item, index) => [index, item]) : Object.entries(value)

  return (
    <div>
      <button className="tree-toggle" onClick={() => setOpen((current) => !current)} type="button">
        {open ? '▾' : '▸'} {label}: {labelFor(value)}
      </button>
      {open ? (
        <div className="tree-children">
          {entries.map(([childLabel, childValue]) => (
            <TreeNode depth={depth + 1} key={childLabel} label={String(childLabel)} value={childValue} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function JsonTree({ value }) {
  return (
    <div className="tree-panel">
      <TreeNode label="root" value={value} />
    </div>
  )
}
