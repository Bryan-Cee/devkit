import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'
import { ToolShell, Panel, CodeInput, ViewToggle } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, lineCount } from '../utils/devkit'

const DEFAULT_DIAGRAM = `flowchart TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B`

const VIEWS = [
  { value: 'split', label: 'Split' },
  { value: 'preview', label: 'Preview only' },
]

mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })

function MermaidPreview({ source }) {
  const id = useId().replace(/:/g, '')
  const containerId = `mermaid-${id}`
  const [svg, setSvg] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!source.trim()) {
        setSvg(null)
        setError(null)
        return
      }
      try {
        const result = await mermaid.render(containerId, source)
        if (!cancelled) {
          setSvg(result.svg)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setSvg(null)
          setError(err instanceof Error ? err.message : String(err))
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [source, containerId])

  return (
    <Panel title="Preview" flush>
      <div className="panel-iframe" style={{ overflow: 'auto', padding: '1rem', background: '#fff' }}>
        {error ? (
          <p style={{ color: 'var(--color-error, #dc2626)', fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{error}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: svg ?? '' }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }} />
        )}
      </div>
    </Panel>
  )
}

export function MermaidTool() {
  const [input, setInput] = useLocalStorage('devkit-mermaid-input', DEFAULT_DIAGRAM)
  const [view, setView] = useState('split')

  const preview = <MermaidPreview source={input} />

  return (
    <ToolShell
      title="Mermaid Diagram Viewer"
      description="Write Mermaid diagram syntax and preview the rendered diagram live."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(input)} type="button">Copy source</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
      view={<ViewToggle options={VIEWS} value={view} onChange={setView} />}
    >
      {view === 'preview' ? (
        <div className="workspace workspace--E">{preview}</div>
      ) : (
        <div className="workspace workspace--cols-2">
          <Panel title="Mermaid source" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
            <CodeInput ariaLabel="Mermaid source" onChange={setInput} value={input} />
          </Panel>
          {preview}
        </div>
      )}
    </ToolShell>
  )
}
