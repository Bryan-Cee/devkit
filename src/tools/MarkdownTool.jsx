import { useMemo } from 'react'
import { marked } from 'marked'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, previewDocument } from '../utils/devkit'

export function MarkdownTool() {
  const [input, setInput] = useLocalStorage('devkit-markdown-input', '# DevKit\n\n- Client-side only\n- Fast static tools\n- GitHub Pages ready')
  const html = useMemo(() => marked.parse(input), [input])

  return (
    <ToolLayout
      description="Write markdown and preview the rendered result live."
      onClear={() => setInput('')}
      onCopy={() => copyText(input)}
      title="Markdown Previewer"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Markdown source">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Preview">
          <iframe className="preview-frame" sandbox="" srcDoc={previewDocument(html)} title="Markdown preview" />
        </Pane>
      </div>
    </ToolLayout>
  )
}
