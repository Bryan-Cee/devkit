import { useMemo, useState } from 'react'
import { JsonTree } from '../components/JsonTree'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { collectJsonError, copyText, formatJson, getErrorMessage, parseJson } from '../utils/devkit'

export function JsonViewerTool() {
  const [input, setInput] = useLocalStorage('devkit-json-viewer-input', '{"hello":"world"}')
  const [minified, setMinified] = useState(false)

  const { parsed, output, error } = useMemo(() => {
    try {
      const value = parseJson(input)
      return { parsed: value, output: formatJson(input, minified), error: '' }
    } catch (problem) {
      return { parsed: null, output: '', error: collectJsonError(getErrorMessage(problem)) }
    }
  }, [input, minified])

  return (
    <ToolLayout
      copyLabel="Copy JSON"
      description="Paste JSON to validate, pretty-print or minify it, and inspect the structure in a collapsible tree."
      error={error}
      extraActions={
        <button className="btn btn-secondary" onClick={() => setMinified((current) => !current)} type="button">
          {minified ? 'Beautify' : 'Minify'}
        </button>
      }
      onClear={() => setInput('')}
      onCopy={() => copyText(output)}
      title="JSON Viewer & Formatter"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input JSON">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Formatted output">
          <pre className="output-block min-h-52">{output || 'Valid JSON output will appear here.'}</pre>
        </Pane>
      </div>
      <Pane title="Collapsible tree view">
        {parsed ? <JsonTree value={parsed} /> : <p className="text-sm text-slate-500 dark:text-slate-400">Fix the JSON error to inspect the tree.</p>}
      </Pane>
    </ToolLayout>
  )
}
