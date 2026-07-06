import { useMemo } from 'react'
import { diffLines } from 'diff'
import { CodeEditor, TextStats } from '../components/CodePanel'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText } from '../utils/devkit'

export function DiffTool() {
  const [left, setLeft] = useLocalStorage('devkit-diff-left', 'line one\nline two\nline three')
  const [right, setRight] = useLocalStorage('devkit-diff-right', 'line one\nline 2\nline three\nline four')
  const [mode, setMode] = useLocalStorage('devkit-diff-mode', 'inline')

  const changes = useMemo(() => diffLines(left, right), [left, right])
  const diffText = useMemo(() => changes.map((part) => `${part.added ? '+' : part.removed ? '-' : ' '} ${part.value}`).join(''), [changes])

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
      onCopy={() => copyText(diffText)}
      title="Diff Checker"
    >
      <div className="panel-grid panel-grid-3">
        <Pane contentClassName="h-full" meta={<TextStats value={left} />} title="Original text">
          <CodeEditor onChange={(event) => setLeft(event.target.value)} value={left} />
        </Pane>
        <Pane contentClassName="h-full" meta={<TextStats value={right} />} title="Updated text">
          <CodeEditor onChange={(event) => setRight(event.target.value)} value={right} />
        </Pane>
        <Pane contentClassName="h-full" meta={<TextStats value={diffText} />} title="Diff output">
        {mode === 'inline' ? (
          <pre className="output-block h-full min-h-0 overflow-auto whitespace-pre">
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
          <div className="grid h-full min-h-0 gap-4 lg:grid-cols-2">
            <pre className="output-block h-full min-h-0 overflow-auto whitespace-pre">{left}</pre>
            <pre className="output-block h-full min-h-0 overflow-auto whitespace-pre">{right}</pre>
          </div>
        )}
        </Pane>
      </div>
    </ToolLayout>
  )
}
