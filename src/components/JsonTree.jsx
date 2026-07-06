import { useState } from 'react'

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
      <div className="font-mono text-sm">
        <span className="text-slate-500 dark:text-slate-400">{label}: </span>
        <span>{labelFor(value)}</span>
      </div>
    )
  }

  const entries = Array.isArray(value) ? value.map((item, index) => [index, item]) : Object.entries(value)

  return (
    <div className="space-y-2">
      <button className="font-mono text-left text-sm text-sky-600 dark:text-sky-300" onClick={() => setOpen((current) => !current)} type="button">
        {open ? '▾' : '▸'} {label}: {labelFor(value)}
      </button>
      {open ? (
        <div className="space-y-2 border-l border-slate-200 pl-4 dark:border-slate-700">
          {entries.map(([childLabel, childValue]) => (
            <TreeNode depth={depth + 1} key={childLabel} label={String(childLabel)} value={childValue} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function JsonTree({ value }) {
  return <TreeNode label="root" value={value} />
}
