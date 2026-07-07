import { useMemo } from 'react'
import { ToolShell, Panel, CodeInput } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, toCases } from '../utils/devkit'

export function CaseTool() {
  const [input, setInput] = useLocalStorage('devkit-case-input', 'dev kit utility')
  const output = useMemo(() => toCases(input), [input])

  return (
    <ToolShell
      title="Case Converter"
      description="Convert text into camelCase, snake_case, kebab-case, and Title Case."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(JSON.stringify(output, null, 2))} type="button">Copy all</button>
          <button className="btn btn-danger" onClick={() => setInput('')} type="button">Clear</button>
        </>
      }
    >
      <div className="workspace workspace--C">
        <Panel title="Input text" flush meta={`${byteCount(input)} B`}>
          <CodeInput ariaLabel="Input text" onChange={setInput} value={input} />
        </Panel>
        <div className="output-stack">
          {Object.entries(output).map(([label, value]) => (
            <Panel key={label} title={label} meta={`${byteCount(value)} B`} onCopy={() => copyText(value)}>
              <pre className="panel-output">{value}</pre>
            </Panel>
          ))}
        </div>
      </div>
    </ToolShell>
  )
}
