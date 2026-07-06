import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText } from '../utils/devkit'

export function HtmlViewerTool() {
  const [input, setInput] = useLocalStorage('devkit-html-viewer-input', '<main><h1>Hello DevKit</h1><p>Rendered in a sandboxed iframe.</p></main>')

  return (
    <ToolLayout
      description="Preview raw HTML in a sandboxed iframe next to the source."
      onClear={() => setInput('')}
      onCopy={() => copyText(input)}
      title="HTML Viewer"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="HTML source">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Live preview">
          <iframe className="preview-frame" sandbox="" srcDoc={input} title="HTML preview" />
        </Pane>
      </div>
    </ToolLayout>
  )
}
