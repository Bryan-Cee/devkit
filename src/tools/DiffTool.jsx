import { useMemo } from 'react'
import { diffLines } from 'diff'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText } from '../utils/devkit'

export function DiffTool() {
  const [left, setLeft] = useLocalStorage('devkit-diff-left', 'line one\nline two\nline three')
  const [right, setRight] = useLocalStorage('devkit-diff-right', 'line one\nline 2\nline three\nline four')
  const [mode, setMode] = useLocalStorage('devkit-diff-mode', 'inline')

  const changes = useMemo(() => diffLines(left, right), [left, right])

  return (
    <ToolLayout
      description="Compare two text blocks as inline or side-by-side diffs."
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          <option value="inline">Inline</option>
          <option value="side-by-side">Side by side</option>
        </select>
      }
      onClear={() => {
        setLeft('')
        setRight('')
      }}
      onCopy={() => copyText(changes.map((part) => `${part.added ? '+' : part.removed ? '-' : ' '} ${part.value}`).join(''))}
      title="Diff Checker"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Original text"><textarea className="textarea" onChange={(event) => setLeft(event.target.value)} value={left} /></Pane>
        <Pane title="Updated text"><textarea className="textarea" onChange={(event) => setRight(event.target.value)} value={right} /></Pane>
      </div>
      <Pane title="Diff output">
        {mode === 'inline' ? (
          <pre className="output-block min-h-64">
            {changes.map((part, index) => (
              <span
                className={part.added ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200' : part.removed ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200' : ''}
                key={index}
              >
                {part.value}
              </span>
            ))}
          </pre>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <pre className="output-block min-h-64">{left}</pre>
            <pre className="output-block min-h-64">{right}</pre>
          </div>
        )}
      </Pane>
    </ToolLayout>
  )
}
