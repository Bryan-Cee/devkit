import { useMemo } from 'react'
import YAML from 'yaml'
import { JsonTree } from '../components/JsonTree'
import { ToolShell, Panel, CodeInput, CodeBlock } from '../components/Shell'
import { highlightJson } from '../components/highlight'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, getErrorMessage, lineCount, parseCsv, parseJson, toCsv } from '../utils/devkit'

const MODES = [
  { value: 'json-csv', label: 'JSON → CSV' },
  { value: 'csv-json', label: 'CSV → JSON' },
  { value: 'json-yaml', label: 'JSON → YAML' },
  { value: 'yaml-json', label: 'YAML → JSON' },
]

const JSON_OUTPUT = new Set(['csv-json', 'yaml-json'])

function parseSource(mode, input) {
  switch (mode) {
    case 'json-csv':
    case 'json-yaml':
      return parseJson(input)
    case 'csv-json':
      return parseCsv(input)
    case 'yaml-json':
      return YAML.parse(input)
    default:
      return null
  }
}

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

  const tree = useMemo(() => {
    try {
      const value = parseSource(mode, input)
      return value && typeof value === 'object' ? value : null
    } catch {
      return null
    }
  }, [input, mode])

  return (
    <ToolShell
      title="JSON ↔ CSV / YAML Converter"
      description="Convert between JSON, CSV, and YAML without leaving the browser."
      error={error}
      actions={
        <>
          <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
            {MODES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={() => copyText(output)} type="button">Copy output</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--A">
        <Panel title="Source" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
          <CodeInput ariaLabel="Source" onChange={setInput} value={input} />
        </Panel>
        <Panel
          title="Converted output"
          flush
          validity={error ? 'error' : output ? 'valid' : undefined}
          meta={`${lineCount(output)} ln · ${byteCount(output)} B`}
          onCopy={() => copyText(output)}
        >
          <CodeBlock highlight={JSON_OUTPUT.has(mode) ? highlightJson : undefined} text={output} />
        </Panel>
        <Panel title="Tree" meta={tree ? `${Array.isArray(tree) ? tree.length : Object.keys(tree).length} items` : ''}>
          {tree ? <JsonTree value={tree} /> : <p className="panel-placeholder">Provide nestable data to inspect the tree.</p>}
        </Panel>
      </div>
    </ToolShell>
  )
}
