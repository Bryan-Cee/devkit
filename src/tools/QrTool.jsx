import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { ToolShell, Panel } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText } from '../utils/devkit'

export function QrTool() {
  const [input, setInput] = useLocalStorage('devkit-qr-input', 'https://github.com/Bryan-Cee/devkit')
  const [output, setOutput] = useState('')

  useEffect(() => {
    let active = true
    QRCode.toDataURL(input || ' ', { margin: 1, width: 320 }).then((value) => {
      if (active) setOutput(value)
    })
    return () => {
      active = false
    }
  }, [input])

  return (
    <ToolShell
      title="QR Code Generator"
      description="Generate a QR code locally from text or a URL."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(output)} type="button">Copy data URL</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
      controls={
        <label className="chip-group" style={{ flex: 1, minWidth: '16rem' }}>
          <span className="chip-group__label">Content</span>
          <input
            aria-label="Text or URL"
            className="field field-mono"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Text or URL"
            value={input}
          />
        </label>
      }
    >
      <div className="workspace workspace--E">
        <Panel title="QR output" bodyClassName="panel-center">
          {output ? <img alt="Generated QR code" src={output} style={{ background: '#fff', padding: '1rem' }} /> : <p className="panel-placeholder">Enter text to generate a QR code.</p>}
        </Panel>
      </div>
    </ToolShell>
  )
}
