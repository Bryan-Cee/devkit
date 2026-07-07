import { useMemo, useState } from 'react'
import { ToolShell, Panel, CodeInput, CodeBlock } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { base64Decode, base64Encode, byteCount, copyText, getErrorMessage, lineCount } from '../utils/devkit'

export function Base64Tool() {
  const [input, setInput] = useLocalStorage('devkit-base64-input', 'Hello DevKit')
  const [mode, setMode] = useLocalStorage('devkit-base64-mode', 'encode')
  const [fileResult, setFileResult] = useState('')

  const { output, error } = useMemo(() => {
    try {
      return { output: mode === 'encode' ? base64Encode(input) : base64Decode(input), error: '' }
    } catch (problem) {
      return { output: '', error: getErrorMessage(problem) }
    }
  }, [input, mode])

  const onFile = async (event) => {
    const [file] = event.target.files ?? []
    if (!file) return
    const text = await file.arrayBuffer().then((buffer) => {
      const bytes = new Uint8Array(buffer)
      let binary = ''
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte)
      })
      return btoa(binary)
    })
    setFileResult(text)
  }

  const result = fileResult || output

  return (
    <ToolShell
      title="Base64 Encode/Decode"
      description="Encode or decode base64 text, plus inspect the base64 output of a file or image."
      error={error}
      actions={
        <>
          <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
            <option value="encode">Encode text</option>
            <option value="decode">Decode text</option>
          </select>
          <button className="btn btn-secondary" onClick={() => copyText(result)} type="button">Copy output</button>
          <button className="btn btn-danger" onClick={() => { setInput(''); setFileResult('') }} type="button">Clear</button>
        </>
      }
      controls={
        <label className="chip-group">
          <span className="chip-group__label">File / image → base64</span>
          <input aria-label="File to base64" className="field-mono" onChange={onFile} type="file" />
        </label>
      }
    >
      <div className="workspace workspace--cols-2">
        <Panel title="Text input" flush meta={`${lineCount(input)} ln · ${byteCount(input)} B`}>
          <CodeInput ariaLabel="Text input" onChange={setInput} value={input} />
        </Panel>
        <Panel title="Output" flush validity={error ? 'error' : result ? 'valid' : undefined} meta={`${byteCount(result)} B`} onCopy={() => copyText(result)}>
          <CodeBlock text={result} />
        </Panel>
      </div>
    </ToolShell>
  )
}
