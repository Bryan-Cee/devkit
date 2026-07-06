import { useMemo } from 'react'
import CryptoJS from 'crypto-js'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText } from '../utils/devkit'

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
    <ToolLayout
      description="Generate MD5, SHA-1, and SHA-256 hashes for any text input."
      onClear={() => setInput('')}
      onCopy={() => copyText(JSON.stringify(hashes, null, 2))}
      title="Hash Generator"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input text"><textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} /></Pane>
        <Pane title="Hashes">
          <div className="space-y-3">
            {Object.entries(hashes).map(([algorithm, value]) => (
              <div className="output-block" key={algorithm}>
                <strong>{algorithm}</strong>
                <div className="mt-2 break-all">{value}</div>
              </div>
            ))}
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
