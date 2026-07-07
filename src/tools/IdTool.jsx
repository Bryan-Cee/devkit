import { useEffect } from 'react'
import { ToolShell, Panel } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, createUlid } from '../utils/devkit'

const COUNTS = [1, 3, 5, 10, 20]

export function IdTool() {
  const [count, setCount] = useLocalStorage('devkit-id-count', 3)
  const [seed, setSeed] = useLocalStorage('devkit-id-seed', 1)
  const [ids, setIds] = useLocalStorage('devkit-id-output', [])

  useEffect(() => {
    setIds(
      Array.from({ length: Number(count) || 1 }, () => ({
        uuid: crypto.randomUUID(),
        ulid: createUlid(),
      })),
    )
  }, [count, seed, setIds])

  const text = ids.map(({ uuid, ulid }) => `${uuid} | ${ulid}`).join('\n')

  return (
    <ToolShell
      title="UUID / ULID Generator"
      description="Generate UUIDs and ULIDs in bulk."
      actions={
        <>
          <button className="btn btn-primary" onClick={() => setSeed((current) => current + 1)} type="button">Generate new set</button>
          <button className="btn btn-secondary" onClick={() => copyText(text)} type="button">Copy all</button>
          <button className="btn btn-danger" onClick={() => setCount(1)} type="button">Clear</button>
        </>
      }
      controls={
        <div className="chip-group" role="group" aria-label="How many IDs">
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
      }
    >
      <div className="workspace workspace--E">
        <Panel title="Generated IDs" meta={`${ids.length} items`} onCopy={() => copyText(text)}>
          <pre className="panel-output">{ids.map(({ uuid, ulid }) => `UUID: ${uuid}\nULID: ${ulid}`).join('\n\n')}</pre>
        </Panel>
      </div>
    </ToolShell>
  )
}
