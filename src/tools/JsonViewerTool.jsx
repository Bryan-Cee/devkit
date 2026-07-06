import { useMemo, useState } from 'react'
import { CodeEditor, CodeOutput, TextStats } from '../components/CodePanel'
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
      <div className="panel-grid">
        <Pane contentClassName="h-full" meta={<TextStats value={input} />} title="Input JSON">
          <CodeEditor language="json" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <div className="panel-stack">
          <Pane contentClassName="h-full" meta={<TextStats value={output} />} title="Formatted output">
            <CodeOutput emptyLabel="Valid JSON output will appear here." language="json" value={output} />
          </Pane>
          <Pane contentClassName="h-full" title="Collapsible tree view">
            {parsed ? <JsonTree value={parsed} /> : <p className="text-sm text-slate-500 dark:text-slate-400">Fix the JSON error to inspect the tree.</p>}
          </Pane>
        </div>
      </div>
    </ToolLayout>
  )
}
