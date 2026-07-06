import { useMemo } from 'react'
import { Pane, ToolLayout } from '../components/ToolLayout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { copyText, hexToRgb, normalizeHex, paletteFromHex, rgbToHsl } from '../utils/devkit'

export function ColorTool() {
  const [input, setInput] = useLocalStorage('devkit-color-input', '#0EA5E9')
  const hex = normalizeHex(input)
  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb])
  const palette = useMemo(() => paletteFromHex(hex), [hex])

  return (
    <ToolLayout
      description="Convert HEX, RGB, and HSL values while generating a quick palette."
      onClear={() => setInput('#0EA5E9')}
      onCopy={() => copyText(JSON.stringify({ hex, rgb, hsl, palette }, null, 2))}
      title="Color Picker/Converter"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Pane title="Input color">
          <input className="field" onChange={(event) => setInput(event.target.value)} value={input} />
          <input className="mt-4 h-16 w-full rounded-xl border border-slate-300 bg-transparent dark:border-slate-700" onChange={(event) => setInput(event.target.value)} type="color" value={hex} />
        </Pane>
        <Pane title="Conversions & palette">
          <div className="space-y-3">
            <div className="output-block">HEX: {hex}\nRGB: {rgb.r}, {rgb.g}, {rgb.b}\nHSL: {hsl.h}, {hsl.s}%, {hsl.l}%</div>
            <div className="grid gap-3 sm:grid-cols-5">
              {palette.map((swatch) => (
                <div className="space-y-2 text-center" key={swatch.hex}>
                  <div className="h-16 rounded-xl border border-slate-200 dark:border-slate-700" style={{ backgroundColor: swatch.hex }} />
                  <div className="text-xs font-mono">{swatch.hex}</div>
                </div>
              ))}
            </div>
          </div>
        </Pane>
      </div>
    </ToolLayout>
  )
}
