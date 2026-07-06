import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { beautifyHtml, copyText, minifyHtml } from '../utils/devkit'

export function HtmlFormatTool() {
  const [input, setInput] = useLocalStorage('devkit-html-format-input', '<div><h2>DevKit</h2><p>Beautify or minify markup.</p></div>')
  const [mode, setMode] = useLocalStorage('devkit-html-format-mode', 'beautify')

  const output = useMemo(() => (mode === 'minify' ? minifyHtml(input) : beautifyHtml(input)), [input, mode])

  return (
    <ToolLayout
      description="Format or minify HTML with one click."
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          <option value="beautify">Beautify</option>
          <option value="minify">Minify</option>
        </select>
      }
      onClear={() => setInput('')}
      onCopy={() => copyText(output)}
      title="HTML Formatter / Beautifier / Minifier"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="HTML source">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Output">
          <textarea className="textarea" readOnly value={output} />
        </Pane>
      </div>
    </ToolLayout>
  )
}
