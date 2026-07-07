import { useMemo } from 'react'
import CryptoJS from 'crypto-js'
import { ToolShell, Panel, CodeInput } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText } from '../utils/devkit'

export function HashTool() {
  const [input, setInput] = useLocalStorage('devkit-hash-input', 'Hash me!')
  const hashes = useMemo(
    () => ({
      MD5: CryptoJS.MD5(input).toString(),
      'SHA-1': CryptoJS.SHA1(input).toString(),
      'SHA-256': CryptoJS.SHA256(input).toString(),
    }),
    [input],
  )

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate MD5, SHA-1, and SHA-256 hashes for any text input."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(JSON.stringify(hashes, null, 2))} type="button">Copy all</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--C">
        <Panel title="Input text" flush meta={`${byteCount(input)} B`}>
          <CodeInput ariaLabel="Input text" onChange={setInput} value={input} />
        </Panel>
        <div className="output-stack">
          {Object.entries(hashes).map(([algorithm, value]) => (
            <Panel key={algorithm} title={algorithm} validity="valid" meta={`${value.length} chars`} onCopy={() => copyText(value)}>
              <pre className="panel-output">{value}</pre>
            </Panel>
          ))}
        </div>
      </div>
    </ToolShell>
  )
}
