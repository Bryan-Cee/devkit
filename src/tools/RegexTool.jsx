import { useMemo } from 'react'
import { ToolShell, Panel, CodeInput } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, getErrorMessage, lineCount } from '../utils/devkit'

export function RegexTool() {
  const [pattern, setPattern] = useLocalStorage('devkit-regex-pattern', '(Dev)(Kit)')
  const [flags, setFlags] = useLocalStorage('devkit-regex-flags', 'g')
  const [input, setInput] = useLocalStorage('devkit-regex-input', 'DevKit helps DevKit users.')

  const { matches, error, segments } = useMemo(() => {
    try {
      const expression = new RegExp(pattern, flags)
      const values = [...input.matchAll(expression)]
      let cursor = 0
      const highlighted = []
      values.forEach((match, index) => {
        const start = match.index ?? 0
        highlighted.push({ text: input.slice(cursor, start), match: false, key: `${index}-lead` })
        highlighted.push({ text: match[0], match: true, key: `${index}-match` })
        cursor = start + match[0].length
      })
      highlighted.push({ text: input.slice(cursor), match: false, key: 'tail' })
      return {
        matches: values,
        error: '',
        segments: highlighted,
      }
    } catch (problem) {
      return { matches: [], error: getErrorMessage(problem), segments: [{ text: input, match: false, key: 'error' }] }
    }
  }, [flags, input, pattern])

  return (
    <ToolShell
      title="RegExp Tester"
      description="Test a regular expression live with match highlighting and capture groups."
      error={error}
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(JSON.stringify(matches.map((match) => ({ match: match[0], groups: [...match].slice(1) })), null, 2))} type="button">Copy matches</button>
          <button className="btn btn-danger" onClick={() => { setPattern(''); setFlags(''); setInput('') }} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--G">
        <Panel title="Pattern" flush validity={error ? 'error' : pattern ? 'valid' : undefined} meta={`${matches.length} matches`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '0 0.5rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>/</span>
            <input aria-label="Pattern" className="pattern-input" onChange={(event) => setPattern(event.target.value)} placeholder="pattern" value={pattern} />
            <span style={{ padding: '0 0.25rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>/</span>
            <input aria-label="Flags" className="pattern-input" onChange={(event) => setFlags(event.target.value)} placeholder="flags" style={{ width: '5rem', flex: 'none' }} value={flags} />
          </div>
        </Panel>
        <div className="regex-body">
          <Panel title="Test string" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
            <CodeInput ariaLabel="Test string" onChange={setInput} value={input} />
          </Panel>
          <Panel title="Matches" meta={`${matches.length} matches`}>
            <pre className="panel-output">
              {segments.map((segment) => (
                <span className={segment.match ? 'regex-mark' : ''} key={segment.key}>{segment.text}</span>
              ))}
            </pre>
            {matches.length ? (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {matches.map((match, index) => (
                  <div className="kv-row" key={`${match[0]}-${index}`}>
                    <span className="kv-label">match {index + 1}</span>
                    <span className="kv-value">{match[0]} · groups: {JSON.stringify([...match].slice(1))}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </Panel>
        </div>
      </div>
    </ToolShell>
  )
}
