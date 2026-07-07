import { useMemo } from 'react'
import { ToolShell, Panel, CodeInput, CodeBlock } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, getErrorMessage, lineCount } from '../utils/devkit'

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
    <ToolShell
      title="URL Encoder/Decoder"
      description="Encode or decode URL-safe text fragments."
      error={error}
      actions={
        <>
          <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
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
        <Panel title="Output" flush validity={error ? 'error' : output ? 'valid' : undefined} meta={`${byteCount(output)} B`} onCopy={() => copyText(output)}>
          <CodeBlock text={output} />
        </Panel>
      </div>
    </ToolShell>
  )
}
