import { useMemo } from 'react'
import YAML from 'yaml'
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
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Source">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Converted output">
          <textarea className="textarea" readOnly value={output} />
        </Pane>
      </div>
    </ToolLayout>
  )
}
