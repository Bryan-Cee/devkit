import { useMemo, useState } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { base64Decode, base64Encode, copyText, getErrorMessage } from '../utils/devkit'

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

  return (
    <ToolLayout
      description="Encode or decode base64 text, plus inspect the base64 output of a file or image."
      error={error}
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          <option value="encode">Encode text</option>
          <option value="decode">Decode text</option>
        </select>
      }
      onClear={() => {
        setInput('')
        setFileResult('')
      }}
      onCopy={() => copyText(fileResult || output)}
      title="Base64 Encode/Decode"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Text input">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
          <label className="mt-4 block text-sm font-medium">File / image to base64</label>
          <input className="mt-2 block w-full text-sm" onChange={onFile} type="file" />
        </Pane>
        <Pane title="Output">
          <textarea className="textarea" readOnly value={fileResult || output} />
        </Pane>
      </div>
    </ToolLayout>
  )
}
