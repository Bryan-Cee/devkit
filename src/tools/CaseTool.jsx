import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, toCases } from '../utils/devkit'

export function CaseTool() {
  const [input, setInput] = useLocalStorage('devkit-case-input', 'dev kit utility')
  const output = useMemo(() => toCases(input), [input])

  return (
    <ToolLayout
      description="Convert text into camelCase, snake_case, kebab-case, and Title Case."
      onClear={() => setInput('')}
      onCopy={() => copyText(JSON.stringify(output, null, 2))}
      title="Case Converter"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input text"><textarea className="textarea" onChange={(event) => setInput(event.target.value)} value={input} /></Pane>
        <Pane title="Converted cases">
          <div className="space-y-3">
            {Object.entries(output).map(([label, value]) => (
              <div className="output-block" key={label}>
                <strong>{label}</strong>
                <div className="mt-2 break-all">{value}</div>
              </div>
            ))}
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
