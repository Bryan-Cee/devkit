import { useMemo } from 'react'
import { ToolShell, Panel, CodeInput } from '../components/Shell'
import { highlightJson } from '../components/highlight'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, decodeBase64Url, getErrorMessage, lineCount } from '../utils/devkit'

export function JwtTool() {
  const [input, setInput] = useLocalStorage(
    'devkit-jwt-input',
    '******',
  )

  const { header, payload, signature, error, expStatus, expired } = useMemo(() => {
    try {
      const [encodedHeader = '', encodedPayload = '', encodedSignature = ''] = input.split('.')
      const headerValue = JSON.stringify(JSON.parse(decodeBase64Url(encodedHeader)), null, 2)
      const payloadValue = JSON.stringify(JSON.parse(decodeBase64Url(encodedPayload)), null, 2)
      const payloadJson = JSON.parse(payloadValue)
      const isExpired = payloadJson.exp ? new Date(payloadJson.exp * 1000) <= new Date() : false
      const expStatus = payloadJson.exp
        ? isExpired
          ? `Expired ${new Date(payloadJson.exp * 1000).toLocaleString()}`
          : `Valid until ${new Date(payloadJson.exp * 1000).toLocaleString()}`
        : 'No exp claim'
      return { header: headerValue, payload: payloadValue, signature: encodedSignature, expStatus, expired: isExpired, error: '' }
    } catch (problem) {
      return { header: '', payload: '', signature: '', expStatus: '', expired: false, error: getErrorMessage(problem) }
    }
  }, [input])

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode JWT header and payload locally, with expiry highlighted."
      error={error}
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(payload || input)} type="button">Copy payload</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--C">
        <Panel title="JWT token" flush meta={`${byteCount(input)} B`}>
          <CodeInput ariaLabel="JWT token" onChange={setInput} value={input} />
        </Panel>
        <div className="output-stack">
          <Panel title="Header" meta={header ? `${lineCount(header)} ln` : ''} onCopy={() => copyText(header)}>
            {header ? <pre className="panel-output">{highlightJson(header)}</pre> : <p className="panel-placeholder">Decoded header appears here.</p>}
          </Panel>
          <Panel
            title="Payload"
            validity={payload ? (expStatus === 'No exp claim' ? undefined : expired ? 'error' : 'valid') : undefined}
            meta={expStatus}
            onCopy={() => copyText(payload)}
          >
            {payload ? <pre className="panel-output">{highlightJson(payload)}</pre> : <p className="panel-placeholder">Decoded payload appears here.</p>}
          </Panel>
          <Panel title="Signature" meta={signature ? `${byteCount(signature)} B` : ''} onCopy={() => copyText(signature)}>
            {signature ? <pre className="panel-output">{signature}</pre> : <p className="panel-placeholder">Signature segment appears here.</p>}
          </Panel>
        </div>
      </div>
    </ToolShell>
  )
}
