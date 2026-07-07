import { useMemo } from 'react'
import { ToolShell, Panel, ChipGroup } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { byteCount, copyText, generateFakeData, generateLorem, lineCount } from '../utils/devkit'

const MODES = [
  { value: 'lorem', label: 'Lorem ipsum' },
  { value: 'fake', label: 'Fake people' },
]
const COUNTS = [1, 3, 5, 8, 12]

export function LoremTool() {
  const [mode, setMode] = useLocalStorage('devkit-lorem-mode', 'lorem')
  const [count, setCount] = useLocalStorage('devkit-lorem-count', 3)

  const output = useMemo(() => (mode === 'lorem' ? generateLorem(Number(count) || 1) : generateFakeData(Number(count) || 1)), [count, mode])

  return (
    <ToolShell
      title="Lorem Ipsum / Fake Data Generator"
      description="Generate placeholder lorem ipsum or lightweight fake data."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(output)} type="button">Copy output</button>
          <button className="btn btn-danger" onClick={() => setCount(1)} type="button">Clear</button>
        </>
      }
      controls={
        <>
          <ChipGroup label="Type" options={MODES} value={mode} onChange={setMode} />
          <div className="chip-group" role="group" aria-label="Count">
            <span className="chip-group__label">Count</span>
            {COUNTS.map((value) => (
              <button
                aria-pressed={Number(count) === value}
                className={`chip${Number(count) === value ? ' chip--active' : ''}`}
                key={value}
                onClick={() => setCount(value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </>
      }
    >
      <div className="workspace workspace--E">
        <Panel title="Generated output" meta={`${lineCount(output)} ln · ${byteCount(output)} B`} onCopy={() => copyText(output)}>
          <pre className="panel-output">{output}</pre>
        </Panel>
      </div>
    </ToolShell>
  )
}
