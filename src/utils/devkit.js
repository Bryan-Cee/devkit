export async function copyText(value) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  await navigator.clipboard.writeText(String(value ?? ''))
}

// Presentation helpers for panel meta lines.
export function lineCount(text) {
  if (!text) return 0
  return String(text).split('\n').length
}

export function byteCount(text) {
  if (!text) return 0
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(String(text)).length
  return String(text).length
}

export function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

export function parseJson(input) {
  return JSON.parse(input)
}

export function formatJson(input, minified = false) {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed, null, minified ? 0 : 2)
}

export function collectJsonError(message) {
  const match = message.match(/position\s(\d+)/i)
  return match ? `${message} (character ${match[1]})` : message
}

export function htmlEscape(value) {
  const div = document.createElement('div')
  div.innerText = value
  return div.innerHTML
}

export function htmlUnescape(value) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = value
  return textarea.value
}

function formatDomNode(node, depth = 0) {
  const indent = '  '.repeat(depth)
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim()
    return text ? `${indent}${text}` : ''
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const attrs = [...node.attributes].map((attr) => `${attr.name}="${attr.value}"`).join(' ')
  const open = `${indent}<${node.tagName.toLowerCase()}${attrs ? ` ${attrs}` : ''}>`
  const children = [...node.childNodes].map((child) => formatDomNode(child, depth + 1)).filter(Boolean)
  if (!children.length) {
    return `${open}</${node.tagName.toLowerCase()}>`
  }
  return `${open}\n${children.join('\n')}\n${indent}</${node.tagName.toLowerCase()}>`
}

export function beautifyHtml(value) {
  const doc = new DOMParser().parseFromString(value, 'text/html')
  return [...doc.body.childNodes].map((node) => formatDomNode(node, 0)).filter(Boolean).join('\n') || value.trim()
}

export function minifyHtml(value) {
  return value.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()
}

export function parseCsv(input) {
  const rows = []
  let current = ''
  let row = []
  let inQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const next = input[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1
      row.push(current)
      rows.push(row)
      row = []
      current = ''
    } else {
      current += char
    }
  }

  if (current || row.length) {
    row.push(current)
    rows.push(row)
  }

  const [headers = [], ...body] = rows.filter((cells) => cells.some((cell) => cell !== ''))
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])))
}

export function toCsv(value) {
  const array = Array.isArray(value) ? value : [value]
  const keys = [...new Set(array.flatMap((item) => Object.keys(item || {})))]
  const escapeCell = (cell) => {
    const text = typeof cell === 'string' ? cell : JSON.stringify(cell ?? '')
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
  }
  const lines = [keys.join(',')]
  for (const item of array) {
    lines.push(keys.map((key) => escapeCell(item?.[key])).join(','))
  }
  return lines.join('\n')
}

export function base64Encode(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

export function base64Decode(value) {
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return base64Decode(padded)
}

function splitWords(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
}

export function toCases(input) {
  const words = splitWords(input)
  const capitalized = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  return {
    camelCase: words.map((word, index) => (index ? capitalized[index] : word)).join(''),
    snake_case: words.join('_'),
    'kebab-case': words.join('-'),
    'Title Case': capitalized.join(' '),
  }
}

const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function encodeTime(time, length) {
  let value = time
  let output = ''
  for (let index = 0; index < length; index += 1) {
    output = ULID_ALPHABET[value % 32] + output
    value = Math.floor(value / 32)
  }
  return output
}

function encodeRandom(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (value) => ULID_ALPHABET[value % 32]).join('')
}

export function createUlid() {
  return `${encodeTime(Date.now(), 10)}${encodeRandom(16)}`
}

export function formatInTimeZone(date, timeZone) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone,
  }).format(date)
}

export function getTimeZones() {
  if (Intl.supportedValuesOf) {
    const common = ['UTC', Intl.DateTimeFormat().resolvedOptions().timeZone]
    return [...new Set([...common, ...Intl.supportedValuesOf('timeZone').slice(0, 80)])]
  }
  return ['UTC', Intl.DateTimeFormat().resolvedOptions().timeZone]
}

export function normalizeHex(value) {
  let hex = value.trim().replace('#', '')
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('')
  }
  return hex.length === 6 ? `#${hex.toUpperCase()}` : '#0EA5E9'
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex).slice(1)
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

export function rgbToHsl({ r, g, b }) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let h = 0
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  if (delta !== 0) {
    switch (max) {
      case red:
        h = ((green - blue) / delta) % 6
        break
      case green:
        h = (blue - red) / delta + 2
        break
      default:
        h = (red - green) / delta + 4
        break
    }
  }
  return {
    h: Math.round(h * 60 < 0 ? h * 60 + 360 : h * 60),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function paletteFromHex(hex) {
  const { r, g, b } = hexToRgb(hex)
  return [-30, -15, 0, 15, 30].map((shift) => {
    const clamp = (value) => Math.max(0, Math.min(255, value + shift))
    const next = { r: clamp(r), g: clamp(g), b: clamp(b) }
    return {
      hex: `#${[next.r, next.g, next.b].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()}`,
      rgb: next,
    }
  })
}

const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')
const NAMES = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Linus Torvalds', 'Margaret Hamilton']
const COMPANIES = ['Acme Labs', 'Orbit Systems', 'Northwind', 'Pioneer Works', 'Binary Forge']

export function generateLorem(count) {
  return Array.from({ length: count }, (_, index) => {
    const words = Array.from({ length: 12 }, (_, wordIndex) => LOREM[(index * 7 + wordIndex) % LOREM.length])
    return `${words.join(' ')}.`.replace(/^./, (char) => char.toUpperCase())
  }).join('\n\n')
}

export function generateFakeData(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = NAMES[index % NAMES.length]
    const company = COMPANIES[index % COMPANIES.length]
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.dev`
    return `${name} | ${email} | ${company}`
  }).join('\n')
}

export function previewDocument(content) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Inter,system-ui,sans-serif;padding:1rem;color:#0f172a}pre{white-space:pre-wrap}code,pre{font-family:ui-monospace,SFMono-Regular,monospace;background:#f8fafc;border-radius:0.75rem;padding:0.15rem 0.35rem}img{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #cbd5e1;padding:0.5rem;text-align:left}</style></head><body>${content}</body></html>`
}
