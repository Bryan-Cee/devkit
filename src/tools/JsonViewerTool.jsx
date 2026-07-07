import { useMemo, useState } from 'react'
import { JsonTree } from '../components/JsonTree'
import { ToolShell, Panel, CodeInput, CodeBlock, ViewToggle } from '../components/Shell'
import { highlightJson } from '../components/highlight'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, collectJsonError, copyText, formatJson, getErrorMessage, lineCount, parseJson } from '../utils/devkit'

const VIEWS = [
  { value: 'split', label: 'Split' },
  { value: 'tree', label: 'Tree only' },
]

export function JsonViewerTool() {
  const [input, setInput] = useLocalStorage('devkit-json-viewer-input', '{"hello":"world"}')
  const [minified, setMinified] = useState(false)
  const [view, setView] = useState('split')

  const { parsed, output, error } = useMemo(() => {
    try {
      const value = parseJson(input)
      return { parsed: value, output: formatJson(input, minified), error: '' }
    } catch (problem) {
      return { parsed: null, output: '', error: collectJsonError(getErrorMessage(problem)) }
    }
  }, [input, minified])

  const treePanel = (
    <Panel title="Tree" meta={parsed && typeof parsed === 'object' ? `${Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length} items` : ''}>
      {parsed ? <JsonTree value={parsed} /> : <p className="panel-placeholder">Fix the JSON error to inspect the tree.</p>}
    </Panel>
  )

  return (
    <ToolShell
      title="JSON Viewer & Formatter"
      description="Paste JSON to validate, pretty-print or minify it, and inspect the structure in a collapsible tree."
      error={error}
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => setMinified((current) => !current)} type="button">
            {minified ? 'Beautify' : 'Minify'}
          </button>
          <button className="btn btn-secondary" onClick={() => copyText(output)} type="button">Copy JSON</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
      view={<ViewToggle options={VIEWS} value={view} onChange={setView} />}
    >
      {view === 'tree' ? (
        <div className="workspace workspace--E">{treePanel}</div>
      ) : (
        <div className="workspace workspace--A">
          <Panel title="Input JSON" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
            <CodeInput ariaLabel="Input JSON" onChange={setInput} value={input} />
          </Panel>
          <Panel
            title="Formatted output"
            flush
            validity={error ? 'error' : output ? 'valid' : undefined}
            meta={`${lineCount(output)} ln · ${byteCount(output)} B`}
            onCopy={() => copyText(output)}
          >
            <CodeBlock highlight={highlightJson} placeholder="Valid JSON output will appear here." text={output} />
          </Panel>
          {treePanel}
        </div>
      )}
    </ToolShell>
  )
}
