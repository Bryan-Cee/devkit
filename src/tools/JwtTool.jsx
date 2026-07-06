import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, decodeBase64Url, getErrorMessage } from '../utils/devkit'

export function JwtTool() {
  const [input, setInput] = useLocalStorage(
    'devkit-jwt-input',
    '******',
  )

  const { header, payload, signature, error, expStatus } = useMemo(() => {
    try {
      const [encodedHeader = '', encodedPayload = '', encodedSignature = ''] = input.split('.')
      const headerValue = JSON.stringify(JSON.parse(decodeBase64Url(encodedHeader)), null, 2)
      const payloadValue = JSON.stringify(JSON.parse(decodeBase64Url(encodedPayload)), null, 2)
      const payloadJson = JSON.parse(payloadValue)
      const expStatus = payloadJson.exp
        ? new Date(payloadJson.exp * 1000) > new Date()
          ? `Valid until ${new Date(payloadJson.exp * 1000).toLocaleString()}`
          : `Expired on ${new Date(payloadJson.exp * 1000).toLocaleString()}`
        : 'No exp claim present.'
      return { header: headerValue, payload: payloadValue, signature: encodedSignature, expStatus, error: '' }
    } catch (problem) {
      return { header: '', payload: '', signature: '', expStatus: '', error: getErrorMessage(problem) }
    }
  }, [input])

  return (
    <ToolLayout
      description="Decode JWT header and payload locally, with expiry highlighted."
      error={error}
      onClear={() => setInput('')}
      onCopy={() => copyText(payload || input)}
      title="JWT Decoder"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="JWT token">
          <textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} />
        </Pane>
        <Pane title="Decoded output">
          <div className="space-y-3">
            <div className={`rounded-xl px-3 py-2 text-sm ${expStatus.startsWith('Expired') ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'}`}>
              {expStatus || 'Decoded JWT details appear here.'}
            </div>
            <pre className="output-block">Header\n{header}</pre>
            <pre className="output-block">Payload\n{payload}</pre>
            <pre className="output-block">Signature\n{signature}</pre>
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
