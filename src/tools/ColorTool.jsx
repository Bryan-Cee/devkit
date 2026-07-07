import { useMemo } from 'react'
import { ToolShell, Panel } from '../components/Shell'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, hexToRgb, normalizeHex, paletteFromHex, rgbToHsl } from '../utils/devkit'

export function ColorTool() {
  const [input, setInput] = useLocalStorage('devkit-color-input', '#0EA5E9')
  const hex = normalizeHex(input)
  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb])
  const palette = useMemo(() => paletteFromHex(hex), [hex])

  const summary = `HEX: ${hex}\nRGB: ${rgb.r}, ${rgb.g}, ${rgb.b}\nHSL: ${hsl.h}, ${hsl.s}%, ${hsl.l}%`

  return (
    <ToolShell
      title="Color Picker/Converter"
      description="Convert HEX, RGB, and HSL values while generating a quick palette."
      actions={
        <>
          <button className="btn btn-secondary" onClick={() => copyText(JSON.stringify({ hex, rgb, hsl, palette }, null, 2))} type="button">Copy all</button>
          <button className="btn btn-danger" onClick={() => setInput('#0EA5E9')} type="button">Reset</button>
        </>
      }
      controls={
        <>
          <label className="chip-group">
            <span className="chip-group__label">Hex</span>
            <input aria-label="Color value" className="field field-mono" onChange={(event) => setInput(event.target.value)} style={{ width: '9rem' }} value={input} />
          </label>
          <label className="chip-group">
            <span className="chip-group__label">Pick</span>
            <input aria-label="Color picker" onChange={(event) => setInput(event.target.value)} style={{ width: '3rem', height: '2rem', border: '1px solid var(--line)', background: 'transparent' }} type="color" value={hex} />
          </label>
        </>
      }
    >
      <div className="workspace workspace--cols-2">
        <Panel title="Conversions" onCopy={() => copyText(summary)}>
          <div className="kv-row"><span className="kv-label">hex</span><span className="kv-value">{hex}</span></div>
          <div className="kv-row"><span className="kv-label">rgb</span><span className="kv-value">{rgb.r}, {rgb.g}, {rgb.b}</span></div>
          <div className="kv-row"><span className="kv-label">hsl</span><span className="kv-value">{hsl.h}, {hsl.s}%, {hsl.l}%</span></div>
        </Panel>
        <Panel title="Palette">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(4rem, 1fr))', gap: '0.75rem' }}>
            {palette.map((swatch) => (
              <div key={swatch.hex} style={{ textAlign: 'center' }}>
                <div style={{ height: '3.5rem', border: '1px solid var(--line)', backgroundColor: swatch.hex }} />
                <div style={{ marginTop: '0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--muted)' }}>{swatch.hex}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </ToolShell>
  )
}
