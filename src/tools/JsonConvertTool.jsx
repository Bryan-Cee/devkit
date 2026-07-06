import { useMemo } from 'react'
import YAML from 'yaml'
import { CodeEditor, CodeOutput, TextStats } from '../components/CodePanel'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, getErrorMessage, parseCsv, parseJson, toCsv } from '../utils/devkit'

const MODES = [
  { value: 'json-csv', label: 'JSON → CSV' },
  { value: 'csv-json', label: 'CSV → JSON' },
  { value: 'json-yaml', label: 'JSON → YAML' },
  { value: 'yaml-json', label: 'YAML → JSON' },
]

export function JsonConvertTool() {
  const [mode, setMode] = useLocalStorage('devkit-json-convert-mode', 'json-csv')
  const [input, setInput] = useLocalStorage('devkit-json-convert-input', '[{"name":"Ada","role":"Engineer"}]')

  const { output, error } = useMemo(() => {
    try {
      switch (mode) {
        case 'json-csv':
          return { output: toCsv(parseJson(input)), error: '' }
        case 'csv-json':
          return { output: JSON.stringify(parseCsv(input), null, 2), error: '' }
        case 'json-yaml':
          return { output: YAML.stringify(parseJson(input)), error: '' }
        case 'yaml-json':
          return { output: JSON.stringify(YAML.parse(input), null, 2), error: '' }
        default:
          return { output: '', error: '' }
      }
    } catch (problem) {
      return { output: '', error: getErrorMessage(problem) }
    }
  }, [input, mode])

  const sourceLanguage = mode.startsWith('json') ? 'json' : 'text'
  const outputLanguage = mode.endsWith('json') ? 'json' : 'text'

  return (
    <ToolLayout
      description="Convert between JSON, CSV, and YAML without leaving the browser."
      error={error}
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          {MODES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      }
      onClear={() => setInput('')}
      onCopy={() => copyText(output)}
      title="JSON ↔ CSV / YAML Converter"
    >
      <div className="panel-grid">
        <Pane contentClassName="h-full" meta={<TextStats value={input} />} title="Source">
          <CodeEditor language={sourceLanguage} onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane contentClassName="h-full" meta={<TextStats value={output} />} title="Converted output">
          <CodeOutput language={outputLanguage} value={output} />
        </Pane>
      </div>
    </ToolLayout>
  )
}
