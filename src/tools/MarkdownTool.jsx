import { useMemo, useState } from 'react'
import { marked } from 'marked'
import { ToolShell, Panel, CodeInput, ViewToggle } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, lineCount, previewDocument } from '../utils/devkit'

const VIEWS = [
  { value: 'split', label: 'Split' },
  { value: 'preview', label: 'Preview only' },
]

export function MarkdownTool() {
  const [input, setInput] = useLocalStorage('devkit-markdown-input', '# DevKit\n\n- Client-side only\n- Fast static tools\n- GitHub Pages ready')
  const [view, setView] = useState('split')
  const html = useMemo(() => marked.parse(input), [input])

  const preview = (
    <Panel title="Preview" flush>
      <iframe className="panel-iframe" sandbox="" srcDoc={previewDocument(html)} title="Markdown preview" />
    </Panel>
  )

  return (
    <ToolShell
      title="Markdown Previewer"
      description="Write markdown and preview the rendered result live."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(input)} type="button">Copy markdown</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
      view={<ViewToggle options={VIEWS} value={view} onChange={setView} />}
    >
      {view === 'preview' ? (
        <div className="workspace workspace--E">{preview}</div>
      ) : (
        <div className="workspace workspace--cols-2">
          <Panel title="Markdown source" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
            <CodeInput ariaLabel="Markdown source" onChange={setInput} value={input} />
          </Panel>
          {preview}
        </div>
      )}
    </ToolShell>
  )
}
