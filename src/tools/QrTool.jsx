import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Pane, ToolLayout } from '../components/ToolLayout'
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
    <ToolLayout
      description="Generate a QR code locally from text or a URL."
      onClear={() => setInput('')}
      onCopy={() => copyText(output)}
      title="QR Code Generator"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Text or URL"><textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} /></Pane>
        <Pane title="QR output">
          {output ? <img alt="Generated QR code" className="mx-auto rounded-2xl bg-white p-4" src={output} /> : <p className="text-sm text-slate-500 dark:text-slate-400">Enter text to generate a QR code.</p>}
        </Pane>
      </div>
    </ToolLayout>
  )
}
