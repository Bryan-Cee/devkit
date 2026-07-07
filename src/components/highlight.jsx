// Presentation-only syntax highlighting. Does not alter any tool's data —
// it only wraps an already-produced string in colored <span> tokens so the
// same value type renders with the same color token everywhere.

const JSON_TOKEN = /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}[\],])/g

// Returns an array of React nodes with JSON syntax coloring using the shared
// --key/--string/--number/--bool tokens.
export function highlightJson(text) {
  if (!text) return text
  const nodes = []
  let lastIndex = 0
  let match
  let key = 0
  JSON_TOKEN.lastIndex = 0
  while ((match = JSON_TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const [value, propKey, str, num, bool, nul, punct] = match
    let className = ''
    if (propKey) className = 'tok-key'
    else if (str) className = 'tok-string'
    else if (num) className = 'tok-number'
    else if (bool) className = 'tok-bool'
    else if (nul) className = 'tok-null'
    else if (punct) className = 'tok-punct'
    nodes.push(
      <span className={className} key={key++}>
        {value}
      </span>,
    )
    lastIndex = match.index + value.length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  return nodes
}
