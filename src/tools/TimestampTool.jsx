import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
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

  return (
    <ToolLayout
      description="Convert Unix timestamps and human-readable dates with a timezone picker."
      extraActions={
        <select className="select" onChange={(event) => setTimeZone(event.target.value)} value={timeZone}>
          {TIME_ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      }
      onClear={() => {
        setEpoch('')
        setDateText('')
      }}
      onCopy={() => copyText(`${output.epochToHuman}\n\n${output.humanToEpoch}`)}
      title="Timestamp Converter"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Inputs">
          <label className="text-sm font-medium">Unix epoch</label>
          <input className="field mt-2" onChange={(event) => setEpoch(event.target.value)} value={epoch} />
          <label className="mt-4 block text-sm font-medium">Human-readable date</label>
          <input className="field mt-2" onChange={(event) => setDateText(event.target.value)} type="datetime-local" value={dateText} />
        </Pane>
        <Pane title="Conversions">
          <div className="space-y-3">
            <div className="output-block">Epoch → Human\n{output.epochToHuman}</div>
            <div className="output-block">Human → Epoch\n{output.humanToEpoch}</div>
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
