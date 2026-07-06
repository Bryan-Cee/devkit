import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, generateFakeData, generateLorem } from '../utils/devkit'

export function LoremTool() {
  const [mode, setMode] = useLocalStorage('devkit-lorem-mode', 'lorem')
  const [count, setCount] = useLocalStorage('devkit-lorem-count', 3)

  const output = useMemo(() => (mode === 'lorem' ? generateLorem(Number(count) || 1) : generateFakeData(Number(count) || 1)), [count, mode])

  return (
    <ToolLayout
      description="Generate placeholder lorem ipsum or lightweight fake data."
      extraActions={
        <select className="select" onChange={(event) => setMode(event.target.value)} value={mode}>
          <option value="lorem">Lorem ipsum</option>
          <option value="fake">Fake people data</option>
        </select>
      }
      onClear={() => setCount(1)}
      onCopy={() => copyText(output)}
      title="Lorem Ipsum / Fake Data Generator"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Options">
          <label className="text-sm font-medium">Count</label>
          <input className="field mt-2" max="12" min="1" onChange={(event) => setCount(event.target.value)} type="number" value={count} />
        </Pane>
        <Pane title="Generated output">
          <textarea className="textarea" readOnly value={output} />
        </Pane>
      </div>
    </ToolLayout>
  )
}
