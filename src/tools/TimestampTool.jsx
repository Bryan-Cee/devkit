import { useMemo } from 'react'
import { ToolShell, Panel } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, formatInTimeZone, getTimeZones } from '../utils/devkit'

const TIME_ZONES = getTimeZones()

export function TimestampTool() {
  const [epoch, setEpoch] = useLocalStorage('devkit-timestamp-epoch', () => `${Math.floor(Date.now() / 1000)}`)
  const [dateText, setDateText] = useLocalStorage('devkit-timestamp-date', () => new Date().toISOString().slice(0, 16))
  const [timeZone, setTimeZone] = useLocalStorage('devkit-timestamp-zone', 'UTC')

  const output = useMemo(() => {
    const epochValue = Number(epoch)
    const dateFromEpoch = Number.isFinite(epochValue)
      ? new Date(epochValue > 1_000_000_000_000 ? epochValue : epochValue * 1000)
      : null
    const dateFromInput = dateText ? new Date(dateText) : null
    return {
      epochToHuman: dateFromEpoch ? formatInTimeZone(dateFromEpoch, timeZone) : 'Enter a valid Unix timestamp.',
      humanToEpoch:
        dateFromInput && !Number.isNaN(dateFromInput.valueOf())
          ? `${Math.floor(dateFromInput.getTime() / 1000)} seconds\n${dateFromInput.getTime()} milliseconds`
          : 'Enter a valid date/time.',
    }
  }, [dateText, epoch, timeZone])

  const combined = `${output.epochToHuman}\n\n${output.humanToEpoch}`

  return (
    <ToolShell
      title="Timestamp Converter"
      description="Convert Unix timestamps and human-readable dates with a timezone picker."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(combined)} type="button">Copy output</button>
          <button className="btn btn-danger" onClick={() => { setEpoch(''); setDateText('') }} type="button">Clear</button>
        </>
      }
      controls={
        <>
          <label className="chip-group">
            <span className="chip-group__label">Unix epoch</span>
            <input aria-label="Unix epoch" className="field field-mono" onChange={(event) => setEpoch(event.target.value)} style={{ width: '11rem' }} value={epoch} />
          </label>
          <label className="chip-group">
            <span className="chip-group__label">Date/time</span>
            <input aria-label="Human-readable date" className="field field-mono" onChange={(event) => setDateText(event.target.value)} style={{ width: '13rem' }} type="datetime-local" value={dateText} />
          </label>
          <label className="chip-group">
            <span className="chip-group__label">Zone</span>
            <select className="select" onChange={(event) => setTimeZone(event.target.value)} style={{ width: 'auto' }} value={timeZone}>
              {TIME_ZONES.map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </label>
        </>
      }
    >
      <div className="workspace workspace--E">
        <Panel title="Conversions" onCopy={() => copyText(combined)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <div className="chip-group__label" style={{ marginBottom: '0.25rem' }}>Epoch → Human</div>
              <pre className="panel-output">{output.epochToHuman}</pre>
            </div>
            <div>
              <div className="chip-group__label" style={{ marginBottom: '0.25rem' }}>Human → Epoch</div>
              <pre className="panel-output">{output.humanToEpoch}</pre>
            </div>
          </div>
        </Panel>
      </div>
    </ToolShell>
  )
}
