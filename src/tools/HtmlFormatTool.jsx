import { useMemo } from 'react'
import { ToolShell, Panel, CodeInput, CodeBlock } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { beautifyHtml, byteCount, copyText, lineCount, minifyHtml } from '../utils/devkit'

export function HtmlFormatTool() {
  const [input, setInput] = useLocalStorage('devkit-html-format-input', '<div><h2>DevKit</h2><p>Beautify or minify markup.</p></div>')
  const [mode, setMode] = useLocalStorage('devkit-html-format-mode', 'beautify')

  const output = useMemo(() => (mode === 'minify' ? minifyHtml(input) : beautifyHtml(input)), [input, mode])

  return (
    <ToolShell
      title="HTML Formatter / Beautifier / Minifier"
      description="Format or minify HTML with one click."
      actions={
        <>
          <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
            <option value="beautify">Beautify</option>
            <option value="minify">Minify</option>
          </select>
          <button className="btn btn-secondary" onClick={() => copyText(output)} type="button">Copy output</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--cols-2">
        <Panel title="HTML source" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
          <CodeInput ariaLabel="HTML source" onChange={setInput} value={input} />
        </Panel>
        <Panel title="Output" flush validity={output ? 'valid' : undefined} meta={`${lineCount(output)} ln · ${byteCount(output)} B`} onCopy={() => copyText(output)}>
          <CodeBlock text={output} />
        </Panel>
      </div>
    </ToolShell>
  )
}
