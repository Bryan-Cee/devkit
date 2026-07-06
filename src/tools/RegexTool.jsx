import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, getErrorMessage } from '../utils/devkit'

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
    <ToolLayout
      description="Test a regular expression live with match highlighting and capture groups."
      error={error}
      onClear={() => {
        setPattern('')
        setFlags('')
        setInput('')
      }}
      onCopy={() => copyText(JSON.stringify(matches.map((match) => ({ match: match[0], groups: [...match].slice(1) })), null, 2))}
      title="RegExp Tester"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Inputs">
          <label className="text-sm font-medium">Pattern</label>
          <input className="field mt-2" onChange={(event) => setPattern(event.target.value)} value={pattern} />
          <label className="mt-4 block text-sm font-medium">Flags</label>
          <input className="field mt-2" onChange={(event) => setFlags(event.target.value)} value={flags} />
          <label className="mt-4 block text-sm font-medium">Test text</label>
          <textarea className="textarea mt-2" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Matches">
          <div className="output-block min-h-52">
            {segments.map((segment) => (
              <span className={segment.match ? 'mark-highlight' : ''} key={segment.key}>
                {segment.text}
              </span>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {matches.map((match, index) => (
              <div className="output-block" key={`${match[0]}-${index}`}>
                Match {index + 1}: {match[0]}\nGroups: {JSON.stringify([...match].slice(1))}
              </div>
            ))}
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
