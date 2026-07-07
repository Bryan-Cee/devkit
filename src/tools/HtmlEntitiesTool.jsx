import { useMemo } from 'react'
import { ToolShell, Panel, CodeInput, CodeBlock } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, htmlEscape, htmlUnescape, lineCount } from '../utils/devkit'

export function HtmlEntitiesTool() {
  const [input, setInput] = useLocalStorage('devkit-html-entities-input', '<button>Hello & welcome</button>')
  const [mode, setMode] = useLocalStorage('devkit-html-entities-mode', 'escape')

  const output = useMemo(() => (mode === 'escape' ? htmlEscape(input) : htmlUnescape(input)), [input, mode])

  return (
    <ToolShell
      title="HTML Parser / Entity Encoder-Decoder"
      description="Escape or unescape HTML entities quickly."
      actions={
        <>
          <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
            <option value="escape">Escape entities</option>
            <option value="unescape">Unescape entities</option>
          </select>
          <button className="btn btn-secondary" onClick={() => copyText(output)} type="button">Copy output</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--cols-2">
        <Panel title="Input" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
          <CodeInput ariaLabel="Input" onChange={setInput} value={input} />
        </Panel>
        <Panel title="Output" flush validity={output ? 'valid' : undefined} meta={`${lineCount(output)} ln · ${byteCount(output)} B`} onCopy={() => copyText(output)}>
          <CodeBlock text={output} />
        </Panel>
      </div>
    </ToolShell>
  )
}
