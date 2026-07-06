import { useEffect } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, createUlid } from '../utils/devkit'

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

  return (
    <ToolLayout
      description="Generate UUIDs and ULIDs in bulk."
      extraActions={
        <button className="btn btn-secondary" onClick={() => setSeed((current) => current + 1)} type="button">
          Generate new set
        </button>
      }
      onClear={() => setCount(1)}
      onCopy={() => copyText(ids.map(({ uuid, ulid }) => `${uuid} | ${ulid}`).join('\n'))}
      title="UUID / ULID Generator"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Options">
          <label className="text-sm font-medium">How many IDs?</label>
          <input className="field mt-2" max="20" min="1" onChange={(event) => setCount(event.target.value)} type="number" value={count} />
        </Pane>
        <Pane title="Generated IDs">
          <div className="space-y-3">
            {ids.map(({ uuid, ulid }, index) => (
              <div className="output-block" key={`${uuid}-${index}`}>
                UUID: {uuid}\nULID: {ulid}
              </div>
            ))}
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
