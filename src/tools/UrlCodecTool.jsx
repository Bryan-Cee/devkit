import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, getErrorMessage } from '../utils/devkit'

export function UrlCodecTool() {
  const [input, setInput] = useLocalStorage('devkit-url-codec-input', 'name=Dev Kit & theme=light')
  const [mode, setMode] = useLocalStorage('devkit-url-codec-mode', 'encode')

  const { output, error } = useMemo(() => {
    try {
      return { output: mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input), error: '' }
    } catch (problem) {
      return { output: '', error: getErrorMessage(problem) }
    }
  }, [input, mode])

  return (
    <ToolLayout
      description="Encode or decode URL-safe text fragments."
      error={error}
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      }
      onClear={() => setInput('')}
      onCopy={() => copyText(output)}
      title="URL Encoder/Decoder"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input"><textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} /></Pane>
        <Pane title="Output"><textarea className="textarea" readOnly value={output} /></Pane>
      </div>
    </ToolLayout>
  )
}
