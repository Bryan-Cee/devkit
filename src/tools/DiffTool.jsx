import { useMemo } from 'react'
import { diffLines } from 'diff'
import { ToolShell, Panel, CodeInput } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, lineCount } from '../utils/devkit'

export function DiffTool() {
  const [left, setLeft] = useLocalStorage('devkit-diff-left', 'line one\nline two\nline three')
  const [right, setRight] = useLocalStorage('devkit-diff-right', 'line one\nline 2\nline three\nline four')

  const changes = useMemo(() => diffLines(left, right), [left, right])

  const { rows, added, removed } = useMemo(() => {
    const collected = []
    let add = 0
    let rem = 0
    changes.forEach((part, partIndex) => {
      const type = part.added ? 'add' : part.removed ? 'rem' : 'ctx'
      const lines = part.value.split('\n')
      if (lines.length && lines[lines.length - 1] === '') lines.pop()
      lines.forEach((line, lineIndex) => {
        if (type === 'add') add += 1
        if (type === 'rem') rem += 1
        collected.push({ type, line, key: `${partIndex}-${lineIndex}` })
      })
    })
    return { rows: collected, added: add, removed: rem }
  }, [changes])

  return (
    <ToolShell
      title="Diff Checker"
      description="Compare two text blocks and review a line-by-line diff."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(changes.map((part) => `${part.added ? '+' : part.removed ? '-' : ' '} ${part.value}`).join(''))} type="button">Copy diff</button>
          <button className="btn btn-danger" onClick={() => { setLeft(''); setRight('') }} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--D">
        <div className="diff-inputs">
          <Panel title="Original text" flush meta={`${lineCount(left)} ln · ${byteCount(left)} B`}>
            <CodeInput ariaLabel="Original text" onChange={setLeft} value={left} />
          </Panel>
          <Panel title="Updated text" flush meta={`${lineCount(right)} ln · ${byteCount(right)} B`}>
            <CodeInput ariaLabel="Updated text" onChange={setRight} value={right} />
          </Panel>
        </div>
        <Panel title="Diff output" meta={`+${added} -${removed}`}>
          {rows.map((row) => (
            <div className={`diff-line${row.type === 'add' ? ' diff-line--add' : row.type === 'rem' ? ' diff-line--rem' : ''}`} key={row.key}>
              <span className="diff-marker" aria-hidden="true">{row.type === 'add' ? '+' : row.type === 'rem' ? '-' : ' '}</span>
              <span className="diff-text">{row.line || '\u00a0'}</span>
            </div>
          ))}
        </Panel>
      </div>
    </ToolShell>
  )
}
