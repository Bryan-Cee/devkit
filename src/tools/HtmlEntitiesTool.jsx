import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, htmlEscape, htmlUnescape } from '../utils/devkit'

export function HtmlEntitiesTool() {
  const [input, setInput] = useLocalStorage('devkit-html-entities-input', '<button>Hello & welcome</button>')
  const [mode, setMode] = useLocalStorage('devkit-html-entities-mode', 'escape')

  const output = useMemo(() => (mode === 'escape' ? htmlEscape(input) : htmlUnescape(input)), [input, mode])

  return (
    <ToolLayout
      description="Escape or unescape HTML entities quickly."
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          <option value="escape">Escape entities</option>
          <option value="unescape">Unescape entities</option>
        </select>
      }
      onClear={() => setInput('')}
      onCopy={() => copyText(output)}
      title="HTML Parser / Entity Encoder-Decoder"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Output">
          <textarea className="textarea" readOnly value={output} />
        </Pane>
      </div>
    </ToolLayout>
  )
}
