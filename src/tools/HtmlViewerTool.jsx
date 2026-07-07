import { useState } from 'react'
import { ToolShell, Panel, CodeInput, ViewToggle } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, lineCount } from '../utils/devkit'

const VIEWS = [
  { value: 'split', label: 'Split' },
  { value: 'preview', label: 'Preview only' },
]

export function HtmlViewerTool() {
  const [input, setInput] = useLocalStorage('devkit-html-viewer-input', '<main><h1>Hello DevKit</h1><p>Rendered in a sandboxed iframe.</p></main>')
  const [view, setView] = useState('split')

  const preview = (
    <Panel title="Live preview" flush>
      <iframe className="panel-iframe" sandbox="" srcDoc={input} title="HTML preview" />
    </Panel>
  )

  return (
    <ToolShell
      title="HTML Viewer"
      description="Preview raw HTML in a sandboxed iframe next to the source."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(input)} type="button">Copy HTML</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
      view={<ViewToggle options={VIEWS} value={view} onChange={setView} />}
    >
      {view === 'preview' ? (
        <div className="workspace workspace--E">{preview}</div>
      ) : (
        <div className="workspace workspace--cols-2">
          <Panel title="HTML source" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
            <CodeInput ariaLabel="HTML source" onChange={setInput} value={input} />
          </Panel>
          {preview}
        </div>
      )}
    </ToolShell>
  )
}
